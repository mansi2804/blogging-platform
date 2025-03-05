import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Header from "./Header";
import MainFeaturedPost from "./MainFeaturedPost";
import FeaturedPost from "./FeaturedPost";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import post1 from "./blog-post.1.md";
import post2 from "./blog-post.2.md";
import post3 from "./blog-post.3.md";

import { NavSections } from "../constants/sections.ts";
import { SidebarData } from "../constants/sidebar.ts";
import { mainFeaturedPost } from "../constants/mainFeaturedPost.ts";
import { featuredPosts } from "../constants/featuredPosts.ts";

const posts = [post1, post2, post3];

const defaultTheme = createTheme();

export default function Blog() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container maxWidth="lg">
        <Header title="Blog" sections={NavSections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="From the firehose" posts={posts} />
            <Sidebar
              title={SidebarData.title}
              description={SidebarData.description}
              archives={SidebarData.archives}
              social={SidebarData.social}
            />
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
