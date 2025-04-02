import * as React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Header from "./Header.tsx";
import Main from "./Main.tsx";
import Footer from "./Footer.tsx";
import Sidebar from "./Sidebar.tsx";
import FeaturedPost from "./FeaturedPost.tsx";
import MainFeaturedPost from "./MainFeaturedPost.tsx";

import { NavSections } from "../constants/sections.ts";
import { SidebarData } from "../constants/sidebar.ts";
import { featuredPosts } from "../constants/featuredPosts.ts";
import { mainFeaturedPost } from "../constants/mainFeaturedPost.ts";


import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDocs,
  query,
  writeBatch,
  where
} from "firebase/firestore";
import { db } from "../firebase.ts"; 
import { indexPost } from "../Services/elasticsearch.ts";


const defaultTheme = createTheme();

interface CommentData {
  text: string;
  date: string;
}

interface Post {

  docId?: string;

  id: number;
  title: string;
  category: string;
  description: string;
  image: string | null;
  date: string;
  comments: CommentData[];
  createdBy?: string;
}

export default function Blog() {
  const [posts, setPosts] = React.useState<Post[]>([]);


  const [selectedCategory, setSelectedCategory] = React.useState<string>("");


  React.useEffect(() => {
    const postsRef = collection(db, "posts");
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const fetched: Post[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Post, "docId">;
        fetched.push({
          docId: docSnap.id, 
          ...data,
        });
      });

      setPosts(fetched);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const handleAddPost = async (newPost: Omit<Post, "docId"> & { createdBy: string }) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...newPost,
      });
      console.log("Post added to Firestore with ID:", docRef.id);


      await indexPost(docRef.id, { ...newPost, docId: docRef.id });


      const subscriptionsRef = collection(db, "subscriptions");
      const q = query(subscriptionsRef, where("category", "==", newPost.category));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnap) => {
        const subscription = docSnap.data();
        if (subscription.email !== newPost.createdBy) {
          await addDoc(collection(db, "notifications"), {
            email: subscription.email,
            message: `You’ve subscribed to ${newPost.category}, and we have a new post for you! Read, comment, and be happy!`,
            createdAt: new Date().toLocaleString(),
            read: false, 
          });
        }
      });
    } catch (error) {
      console.error("Error adding post to Firestore:", error);
    }
  };


  const handleDeletePost = async (postDocId: string) => {
    try {
      const batch = writeBatch(db);
      
 
      const commentsRef = collection(db, "posts", postDocId, "comments");
      const commentsSnapshot = await getDocs(query(commentsRef));
      

      commentsSnapshot.forEach((commentDoc) => {
        batch.delete(doc(db, "posts", postDocId, "comments", commentDoc.id));
      });
      

      batch.delete(doc(db, "posts", postDocId));
      
  
      await batch.commit();
      
      console.log("Post and all comments deleted successfully");
    } catch (error) {
      console.error("Error deleting post and comments:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container maxWidth="lg">
        {/* HEADER: Pass down selectedCategory, setSelectedCategory, and handleAddPost */}
        <Header
          title="Blog"
          sections={NavSections}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddPost={handleAddPost}
        />

        <main>
          {/* Keep your existing mainFeaturedPost component */}
          <MainFeaturedPost post={mainFeaturedPost} />

          {/* Keep your existing FeaturedPost grid, if you want */}
          <Grid container spacing={4}>
            {featuredPosts.map((fp) => (
              <FeaturedPost key={fp.title} post={fp} />
            ))}
          </Grid>

          {/* The blog layout: Main content + Sidebar */}
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              <Main
                posts={posts}
                selectedCategory={selectedCategory}
                onDeletePost={handleDeletePost}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Sidebar
                title={SidebarData.title}
                description={SidebarData.description}
                archives={SidebarData.archives}
                social={SidebarData.social}
              />
            </Grid>
          </Grid>
        </main>
      </Container>

      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}