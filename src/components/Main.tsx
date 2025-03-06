import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImage } from '../utils/imageStorage.ts';

// 1) Firestore imports
import {
  collection,
  onSnapshot,
  addDoc,
 // doc,
} from "firebase/firestore";
import { db } from "../firebase.ts"; // <-- Adjust path to your firebase config

interface Comment {
  text: string;
  date: string;
}

interface Post {
  /** 
   * In Firestore, the doc ID is typically a string.
   * But you've also stored a numeric id inside the document. 
   * We'll treat "docId" as the Firestore document ID (string),
   * and "id" as that numeric ID field.
   */
  docId: string;
  id: number;
  title: string;
  category: string;
  date: string;
  image: string | null;
  description: string;
  comments: Comment[]; // We won't rely on this array; we'll fetch real comments from subcollection
}

interface MainProps {
  posts: Post[];                    // These come from Blog.tsx, read from Firestore
  selectedCategory: string;
  onDeletePost: (postDocId: string) => void; // Now docId is string
}

export default function Main({
  posts,
  selectedCategory,
  onDeletePost,
}: MainProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // For comments modal, we keep track of the post + a local state for the comments from Firestore
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  // -------------------------
  // 1) Show the "Full Post" modal
  // -------------------------
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  // -------------------------
  // 2) Show the "Comments" modal
  //    We'll attach a Firestore listener for that post's comments subcollection
  // -------------------------
  const handleCommentClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation(); // prevents card click
    setSelectedPostForComments(post);
  };

  // Whenever selectedPostForComments changes, set up a real-time listener for that post's comments
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

  // Close modals
  const handleClosePost = () => setSelectedPost(null);
  const handleCloseComments = () => {
    setSelectedPostForComments(null);
    setCommentText("");
  };

  // Handle new comment text
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  // -------------------------
  // 3) Add a comment to Firestore subcollection
  // -------------------------
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

  // -------------------------
  // 4) Delete a post
  // -------------------------
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
        sx={{ borderRadius: 1, marginBottom: 2 }}
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
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => handlePostClick(post)}
            >
              <CardContent>
                <Typography variant="h4" gutterBottom>
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
                    {/* DELETE ICON -> calls parent's onDeletePost */}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => handleDeletePost(e, post.docId)}
                    >
                      <DeleteIcon />
                    </IconButton>

                    {/* COMMENT ICON -> opens comments modal */}
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
          }}
        >
          {selectedPost && (
            <Grid container spacing={3} sx={{ height: "100%" }}>
              {/* Left side - image */}
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

              {/* Right side - content */}
              <Grid item xs={7} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {selectedPost.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedPost.date}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": { width: "8px" },
                      "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {selectedPost.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* COMMENTS MODAL (Full Post + Comments) */}
      <Modal open={!!selectedPostForComments} onClose={handleCloseComments}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 1200,
            height: "90%",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {selectedPostForComments && (
            <Grid container spacing={3} sx={{ height: "100%" }}>
              {/* Left side - post details */}
              <Grid item xs={8} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                      {selectedPostForComments.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedPostForComments.date}
                    </Typography>
                    {selectedPostForComments.image && (
                      <img
                        src={selectedPostForComments.image}
                        alt="Post"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 2,
                      "&::-webkit-scrollbar": { width: "8px" },
                      "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "4px" },
                      "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {selectedPostForComments.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right side - comments */}
              <Grid item xs={4} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" gutterBottom>
                    Comments
                  </Typography>

                  {/* Create new comment */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Add a Comment"
                      value={commentText}
                      onChange={handleCommentChange}
                    />
                    <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddComment}>
                      Add Comment
                    </Button>
                  </Box>

                  {/* Scrolling comment list */}
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": { width: "8px" },
                      "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    {comments.map((c, idx) => (
                      <Paper key={idx} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                        <Typography variant="body2">{c.text}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {c.date}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </>
  );
}