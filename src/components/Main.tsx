import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Modal,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImage } from '../utils/imageStorage.ts';

// Firestore imports
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

// Import AuthContext to check user role
import { AuthContext } from "../context/AuthContext.tsx";

// Custom styles for Glassmorphism effect
const glassStyle = {
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

interface Comment {
  text: string;
  date: string;
}

interface Post {
  docId: string;
  id: number;
  title: string;
  category: string;
  date: string;
  image: string | null;
  description: string;
  comments: Comment[];
}

interface MainProps {
  posts: Post[];
  selectedCategory: string;
  onDeletePost: (postDocId: string) => void;
}

export default function Main({
  posts,
  selectedCategory,
  onDeletePost,
}: MainProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Get the current user's role from AuthContext
  const { userRole } = useContext(AuthContext);
  console.log("Current userRole:", userRole);

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCommentClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setSelectedPostForComments(post);
  };

  useEffect(() => {
    if (!selectedPostForComments) {
      setComments([]);
      return;
    }

    const commentsRef = collection(db, "posts", selectedPostForComments.docId, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments: Comment[] = [];
      snapshot.forEach((docSnap) => {
        fetchedComments.push(docSnap.data() as Comment);
      });
      setComments(fetchedComments);
    });

    return () => {
      unsubscribe();
    };
  }, [selectedPostForComments]);

  const handleClosePost = () => setSelectedPost(null);
  const handleCloseComments = () => {
    setSelectedPostForComments(null);
    setCommentText("");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    if (!selectedPostForComments || !commentText.trim()) return;

    try {
      const commentsRef = collection(db, "posts", selectedPostForComments.docId, "comments");
      await addDoc(commentsRef, {
        text: commentText,
        date: new Date().toLocaleString(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  const handleDeletePost = (e: React.MouseEvent, postDocId: string) => {
    e.stopPropagation();
    onDeletePost(postDocId);
  };

  const renderImage = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    const localUrl = getImage(imageUrl);
    if (!localUrl) return null;

    return (
      <CardMedia
        component="img"
        height="300"
        image={localUrl}
        sx={{
          borderRadius: 1,
          marginBottom: 2,
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
    );
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {filteredPosts.length === 0 ? (
          <Typography variant="h6" align="center">
            No posts available for this category.
          </Typography>
        ) : (
          filteredPosts.map((post) => (
            <Card
              key={post.docId}
              sx={{
                borderRadius: 2,
                marginTop: "16px",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)",
                },
                ...glassStyle,
              }}
              onClick={() => handlePostClick(post)}
            >
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {post.date}
                </Typography>
              

                {renderImage(post.image)}

                {/* Footer with Delete and Comment icons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      cursor: "pointer",
                      fontWeight: "medium",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Continue reading...
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {/* DELETE ICON: visible only if the user is a moderator */}
                    {userRole === "moderator" && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDeletePost(e, post.docId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}

                    {/* COMMENT ICON */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleCommentClick(e, post)}
                    >
                      <CommentIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      {/* FULL POST MODAL */}
      <Modal open={!!selectedPost} onClose={handleClosePost}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 1200,
            height: "80vh",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: "hidden",
            ...glassStyle,
          }}
        >
          {selectedPost && (
            <Grid container spacing={3} sx={{ height: "100%" }}>
              <Grid item xs={5} sx={{ height: "100%" }}>
                {selectedPost.image && (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={7} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold",  textAlign: "center",  }}>
                      {selectedPost.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: "center",  }}>
                      {selectedPost.date}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": { width: "8px" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        lineHeight: 1.5,
                        textAlign: "justify",
                        fontWeight: 'bold',  
                        fontSize: '1.05rem',
                      }}
                    >
                      {selectedPost.description}
                    </Typography>

                  </Box>
                  <Box
                    sx={{
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClosePost}
                      sx={{ width: "fit-content" }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* COMMENTS MODAL */}
      <Modal open={!!selectedPostForComments} onClose={handleCloseComments}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            ...glassStyle,
          }}
        >
          {selectedPostForComments && (
            <>
              <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }} >
                Comments for {selectedPostForComments.title}
              </Typography>

              <Box sx={{ overflowY: "auto", maxHeight: "300px" }}>
                {comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No comments yet.
                  </Typography>
                ) : (
                  comments.map((comment, index) => (
                    <Box key={index} sx={{ marginBottom: "16px" }}>
                      <Paper sx={{ padding: "16px", ...glassStyle }}>
                        <Typography variant="body2" sx={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        lineHeight: 1.5,
                        fontWeight: 'bold',  
                        fontSize: '1rem',
                      }}>{comment.text}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ marginTop: "8px" }}>
                          {comment.date}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                )}
              </Box>

              {/* Add a comment section */}
              <Box sx={{ marginTop: "16px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={handleCommentChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Add Comment
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
