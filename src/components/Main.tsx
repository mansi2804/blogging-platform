import React, { useState } from "react";
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

interface Comment {
  text: string;
  date: string;
}

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string | null;
  description: string;
  comments: Comment[];
}

interface MainProps {
  posts: Post[];
  selectedCategory: string;
  onDeletePost: (postId: number) => void; // <--- declare a function prop
}

export default function Main({
  posts,
  selectedCategory,
  onDeletePost,
}: MainProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostWithComments, setSelectedPostWithComments] =
    useState<Post | null>(null);
  const [comment, setComment] = useState("");

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  // Show the "Full Post" modal
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  // Show the "Comments" modal
  const handleCommentClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation(); // prevents card click
    setSelectedPostWithComments(post);
  };

  // Close modals
  const handleClosePost = () => setSelectedPost(null);
  const handleCloseComments = () => {
    setSelectedPostWithComments(null);
    setComment("");
  };

  // Handle new comment text
  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };

  // Add comment to post
  const handleAddComment = () => {
    if (selectedPostWithComments && comment.trim()) {
      selectedPostWithComments.comments.push({
        text: comment,
        date: new Date().toLocaleString(),
      });
      // Force re-render
      setSelectedPostWithComments({ ...selectedPostWithComments });
      setComment("");
    }
  };

  // Call the parent's delete callback
  const handleDeletePost = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    onDeletePost(postId);
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
              key={post.id}
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
                  By {post.author} - {post.date}
                </Typography>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={post.image}
                    alt={post.title}
                    sx={{ borderRadius: 1, marginBottom: 2 }}
                  />
                )}

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
                      onClick={(e) => handleDeletePost(e, post.id)}
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
                      By {selectedPost.author} - {selectedPost.date}
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

      {/* FULL POST w/ COMMENTS MODAL */}
      <Modal open={!!selectedPostWithComments} onClose={handleCloseComments}>
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
          {selectedPostWithComments && (
            <Grid container spacing={3} sx={{ height: "100%" }}>
              {/* Left side - post details */}
              <Grid item xs={8} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                      {selectedPostWithComments.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      By {selectedPostWithComments.author} -{" "}
                      {selectedPostWithComments.date}
                    </Typography>
                    {selectedPostWithComments.image && (
                      <img
                        src={selectedPostWithComments.image}
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
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {selectedPostWithComments.description}
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
                      value={comment}
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
                    {selectedPostWithComments.comments.map((c, idx) => (
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