import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.tsx'; // Adjust the path as needed

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  // Optionally, you can add a loading spinner here while auth state is loading.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no authenticated user, redirect to the login page.
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;