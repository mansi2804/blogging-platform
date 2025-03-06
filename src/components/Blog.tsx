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

const defaultTheme = createTheme();

/** Match the shape of posts you create in Header. */
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

export default function Blog() {
  // State for all created posts
  const [posts, setPosts] = React.useState<Post[]>([]);

  // State for currently selected category
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  // When Header finishes creating a new post, push it into `posts`
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [...prev, newPost]);
  };

  // DELETE: remove post by id
  const handleDeletePost = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
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
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>

          {/* The blog layout: Main content + Sidebar */}
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              {/* MAIN: now also receives the parent's delete callback */}
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