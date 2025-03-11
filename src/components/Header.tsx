import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import { storeImage } from "../utils/imageStorage.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Logout } from "@mui/icons-material";

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
  onAddPost,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [post, setPost] = React.useState<Post>({
    id: 0,
    title: "",
    category: "",
    description: "",
    image: null,
    date: new Date().toLocaleString(),
    comments: [],
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const navigate = useNavigate();
  const { userRole, userEmail, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Make sure the logout function is implemented in AuthContext
    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]);
    }
  };

  const handlePost = async () => {
    try {
      if (!post.category) {
        alert("Please select a category");
        return;
      }

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

        {userRole === "administrator" && (
          <Button
            size="small"
            color="primary"
            onClick={() => navigate("/admin")}
          >
            Users
          </Button>
        )}

        {/* User profile avatar */}
        <Avatar
        alt="User Profile"
        sx={{
          cursor: 'pointer',
          backgroundColor: '#5c6bc0', 
          backdropFilter: 'blur(5px)',
          borderRadius: '50%',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
          '&:hover': {
            transform: 'scale(1.1)', 
            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)', 
          },
        }}
        onClick={handleProfileClick}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
        sx={{
          backdropFilter: 'blur(10px)', 
          backgroundColor: 'rgba(255, 255, 255, 0.3)', 
          borderRadius: '8px', 
        }}
      >
        <MenuItem disabled>
          <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Email: {userEmail}</Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Role: {userRole}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#e57373' }}>
          <Logout sx={{ mr: 1 }} /> 
          <Typography sx={{ fontWeight: 'bold' }}>Logout</Typography>
        </MenuItem>
      </Menu>
      </Toolbar>

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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        bgcolor: 'rgba(255, 255, 255, 0.3)', 
        backdropFilter: 'blur(10px)', 
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', 
        ':hover': {
          transform: 'translate(-50%, -50%) scale(1.05)', 
          boxShadow: 24,
        },
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          color: '#fff',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',  
        }}
      >
        Create a Post
      </Typography>

      <TextField
        fullWidth
        label="Title"
        name="title"
        margin="normal"
        value={post.title}
        onChange={handleChange}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc', 
            },
            '&:hover fieldset': {
              borderColor: '#5c6bc0', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5c6bc0',
            },
          },
        }}
      />

      <TextField
        select
        fullWidth
        label="Category"
        name="category"
        margin="normal"
        value={post.category}
        onChange={handleChange}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#5c6bc0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5c6bc0',
            },
          },
        }}
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
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#5c6bc0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5c6bc0',
            },
          },
        }}
      />

      <Input
        type="file"
        fullWidth
        name="image"
        onChange={handleFileChange}
        sx={{
          mt: 2,
          '& input[type="file"]': {
            border: '1px solid #ccc', 
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#f1f1f1',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#e1e1e1', 
            },
          },
        }}
      />

      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: '#5c6bc0',
          color: 'white',
          padding: '12px 0',
          borderRadius: '20px',
          '&:hover': {
            backgroundColor: '#3f4f91', 
          },
        }}
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
