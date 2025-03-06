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

interface Post {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string | null;
  date: string;
  author: string;
  comments: { text: string; date: string }[];
}

interface HeaderProps {
  title: string;
  sections: ReadonlyArray<{
    title: string;
    url?: string;
  }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;   // Callback to change category
  onAddPost: (post: Post) => void;               // Callback to create a new post
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
  // "Create Post" modal open/close
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Local state for the new post being created
  const [post, setPost] = React.useState<Post>({
    id: 0,
    title: "",
    category: "",
    description: "",
    image: null,
    date: new Date().toLocaleString(),
    author: "Admin",
    comments: []
  });

  // Field updates
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPost({ ...post, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  // Create a new post
  const handlePost = () => {
    if (!post.category) return;

    // Assign unique ID
    const newPost = {
      ...post,
      id: Date.now(),
      date: new Date().toLocaleString()
    };

    // Pass up to Blog.tsx
    onAddPost(newPost);

    // Reset local form
    setPost({
      id: 0,
      title: "",
      category: "",
      description: "",
      image: null,
      date: new Date().toLocaleString(),
      author: "Admin",
      comments: []
    });

    handleClose();
  };

  // Category link click
  const handleCategoryClick = (category: string) => {
    onSelectCategory(category); // update category in Blog state
  };

  return (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
        {categories.map((category) => (
          <Link
            color="inherit"
            noWrap
            key={category}
            variant="body2"
            component="button"
            onClick={() => handleCategoryClick(category)}
            sx={{
              p: 1,
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration:
                selectedCategory === category ? "underline" : "none"
            }}
          >
            {category}
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
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Create a Post
          </Typography>
          <TextField
            fullWidth
            label="Title"
            name="title"
            margin="normal"
            value={post.title}
            onChange={handleChange}
          />
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
          <Input
            type="file"
            fullWidth
            name="image"
            onChange={handleFileChange}
            sx={{ mt: 2 }}
          />
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