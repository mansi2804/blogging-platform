import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blog from "./components/Blog.tsx";
import SignUp from "./components/SignUp.tsx";
import Login from "./components/Login.tsx";
import AdminPanel from "./components/AdminPanel.tsx"; // new admin panel
import ProtectedRoute from "./routes/ProtectedRoute.tsx"; // ensure this is set up
import { AuthProvider } from "./context/AuthContext.tsx";

import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;