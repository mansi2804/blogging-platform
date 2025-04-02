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
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { collection, addDoc, onSnapshot, doc, updateDoc} from "firebase/firestore";
import { db } from "../firebase.ts";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { searchPosts } from "../Services/elasticsearch.ts";
import ActivityRecommendation from "./ActivityRecommendation.tsx"; 
import { Fade } from "@mui/material"; 

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
  docId?: string;
}

interface Notification {
  id: string;
  message: string;
  category: string;
  createdAt: string;
  read: boolean;
  email: string;
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
    logout();
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

  const [subscriptions, setSubscriptions] = React.useState<string[]>([]);
  const [notifications, setNotifications] = React.useState<string[]>([]);
  const [notificationModalOpen, setNotificationModalOpen] = React.useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [subscribedCategories, setSubscribedCategories] = React.useState<string[]>([]);
  
    // Search modal
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Post[]>([]);

  const [activityModalOpen, setActivityModalOpen] = React.useState(false);

  const handleActivityModalOpen = () => setActivityModalOpen(true);
  const handleActivityModalClose = () => setActivityModalOpen(false);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), { read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subscriptions"), (snapshot) => {
      const subs: string[] = [];
      snapshot.forEach((doc) => {
        if (doc.data().email === userEmail) {
          subs.push(doc.data().category);
        }
      });
      setSubscriptions(subs);
    });

    const unsubscribeNotifications = onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        const notifs: Notification[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email === userEmail) {
            notifs.push({
              id: doc.id,
              message: data.message,
              category: data.category,
              createdAt: data.createdAt,
              read: data.read,
              email: data.email,
            });
          }
        });
        setNotifications(notifs);
      }
    );

    return () => {
      unsubscribe();
      unsubscribeNotifications();
    };
  }, [userEmail]);

  const handleSubscribeModalOpen = () => {
    setSubscribeModalOpen(true);
  };

  const handleSubscribeModalClose = () => {
    setSubscribeModalOpen(false);
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleSubscribe = async () => {
    try {
      for (const category of selectedCategories) {
        if (!subscriptions.includes(category)) {
          await addDoc(collection(db, "subscriptions"), {
            email: userEmail,
            category,
            subscribedAt: new Date().toLocaleString(),
          });
        }
      }
      alert("Subscription updated successfully!");
      setSubscribeModalOpen(false);
    } catch (error) {
      console.error("Error subscribing to categories:", error);
      alert("Failed to update subscriptions.");
    }
  };

  const handleNotificationClick = async (notification: Notification | null) => {
    try {
      if (!notification || !notification.id) {
        throw new Error("Invalid notification object.");
      }


      await updateDoc(doc(db, "notifications", notification.id), { read: true });


      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notification.id ? { ...notif, read: true } : notif
        )
      );


      if (notification.category) {
        onSelectCategory(notification.category);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    } finally {
  
      setNotificationModalOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClose = () => {
    setNotificationModalOpen(false);
  };

  const handleOpenSearchModal = () => setSearchModalOpen(true);
  const handleCloseSearchModal = () => {
    setSearchModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchSubmit = async () => {
    const results = await searchPosts(searchQuery);
    setSearchResults(results);
  };

  return (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" onClick={handleOpen}>
            Create Post
          </Button>
          <Button size="small" onClick={handleSubscribeModalOpen}>
            Subscribe
          </Button>
          <Button size="small" onClick={handleActivityModalOpen}>
            Activity Recommender
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
          <IconButton onClick={handleOpenSearchModal}>
          <SearchIcon />
        </IconButton>
       {userRole === "administrator" && (
        <Button
      size="small"
    color="primary"
  onClick={() => navigate("/admin")}
    > Users
    </Button>
        )}
        <IconButton onClick={() => setNotificationModalOpen(true)}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Avatar
          alt="User Profile"
          sx={{
            cursor: "pointer",
            backgroundColor: "#5c6bc0",
            backdropFilter: "blur(5px)",
            borderRadius: "50%",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
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

      {/* Navigation Bar */}
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
            onClick={() => onSelectCategory(cat)}
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

      {/* Subscribe Modal */}
      <Modal open={subscribeModalOpen} onClose={handleSubscribeModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Subscribe to Categories
          </Typography>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategorySelection(category)}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubscribe}
            sx={{ mt: 2 }}
          >
            Update Subscriptions
          </Button>
        </Box>
      </Modal>

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

      {/* Activity Recommendation Modal */}
      <Modal open={activityModalOpen} onClose={handleActivityModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <ActivityRecommendation />
        </Box>
      </Modal>

      {/* Notification Modal */}
      <Modal open={notificationModalOpen} onClose={handleNotificationClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          {notifications.length === 0 ? (
            <Typography>No notifications yet.</Typography>
          ) : (
            notifications.map((notif) => (
              <Paper
                key={notif.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: notif.read ? "#f5f5f5" : "#e3f2fd",
                  cursor: "pointer",
                }}
                onClick={() => handleNotificationClick(notif)}
              >
                <Typography
                  sx={{
                    fontWeight: notif.read ? "normal" : "bold",
                    color: notif.read ? "inherit" : "#1565c0",
                  }}
                >
                  {notif.message}
                </Typography>
              </Paper>
            ))
          )}
          <Button onClick={handleNotificationClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Search Modal */}
      <Modal open={searchModalOpen} onClose={handleCloseSearchModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Search Posts
          </Typography>
          <TextField
            fullWidth
            label="Enter your search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={handleSearchSubmit} sx={{ mt: 2 }}>
            Search
          </Button>
          <Box sx={{ mt: 3, maxHeight: "50vh", overflowY: "auto" }}>
            {searchResults.length === 0 ? (
              <Typography color="text.secondary">
                {searchQuery ? "No results found." : "Enter a query and click Search."}
              </Typography>
            ) : (
              searchResults.map((post) => (
                <Fade in={true} key={post.docId || post.id}>
                  <Paper
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2">{post.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {post.category}
                    </Typography>
                  </Paper>
                </Fade>
              ))
            )}
          </Box>
          <Button variant="outlined" onClick={handleCloseSearchModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
