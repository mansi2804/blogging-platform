import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import { storeImage } from '../utils/imageStorage.ts';

interface CommentData {
  text: string;
  date: string;
}

interface Post {
  id: number;                
  title: string;
  category: string;
  description: string;
  image: string | null;       
  date: string;
  comments: CommentData[];
}

interface HeaderProps {
  title: string;
  sections: ReadonlyArray<{
    title: string;
    url?: string;
  }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;  
  onAddPost: (post: Post) => void;              
}

const categories = [
  "Academic Resources",
  "Career Services",
  "Campus",
  "Culture",
  "Local Community Resources",
  "Social",
  "Sports",
  "Health and Wellness",
  "Technology",
  "Travel",
  "Alumni",
];

export default function Header({
  title,
  sections,
  selectedCategory,
  onSelectCategory,
  onAddPost
}: HeaderProps) {
  // Control "Create Post" modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Local form state (minus the file)
  const [post, setPost] = React.useState<Post>({
    id: 0,
    title: "",
    category: "",
    description: "",
    image: null,
    date: new Date().toLocaleString(),
    comments: [],
  });

  // Store the raw File object from the user
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Update text fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // Capture the raw File object from the local machine
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Do NOT convert to a local path or createObjectURL; just store the File object
      setSelectedFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]);
    }
  };

  // Create a new post
  const handlePost = async () => {
    try {
      if (!post.category) {
        alert("Please select a category");
        return;
      }

      // Store image locally and get URL
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = storeImage(selectedFile);
      }

      const newPost: Post = {
        ...post,
        id: Date.now(),
        date: new Date().toLocaleString(),
        image: imageUrl,
        comments: [],
      };

      onAddPost(newPost);

      // Reset form
      setPost({
        id: 0,
        title: "",
        category: "",
        description: "",
        image: null,
        date: new Date().toLocaleString(),
        comments: [],
      });
      setSelectedFile(null);
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  // Switch category
  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
  };

  return (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small">Subscribe</Button>
          <Button size="small" onClick={handleOpen}>
            Create Post
          </Button>
        </Box>

        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>

        <IconButton>
          <SearchIcon />
        </IconButton>

        <Button variant="outlined" size="small">
          Sign up
        </Button>
      </Toolbar>

      {/* Category navigation */}
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {categories.map((cat) => (
          <Link
            color="inherit"
            noWrap
            key={cat}
            variant="body2"
            component="button"
            onClick={() => handleCategoryClick(cat)}
            sx={{
              p: 1,
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: selectedCategory === cat ? "underline" : "none",
            }}
          >
            {cat}
          </Link>
        ))}
      </Toolbar>

      {/* Create Post Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{ invisible: true }}
      >
        <Box
          component={Paper}
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Create a Post
          </Typography>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            name="title"
            margin="normal"
            value={post.title}
            onChange={handleChange}
          />

          {/* Category */}
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            margin="normal"
            value={post.category}
            onChange={handleChange}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            margin="normal"
            value={post.description}
            onChange={handleChange}
          />

          {/* File input -> just store raw File */}
          <Input
            type="file"
            fullWidth
            name="image"
            onChange={handleFileChange}
            sx={{ mt: 2 }}
          />

          {/* Submit */}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={handlePost}
          >
            Post
          </Button>
        </Box>
      </Modal>
    </>
  );
}