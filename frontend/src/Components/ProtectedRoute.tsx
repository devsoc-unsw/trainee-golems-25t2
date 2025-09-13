import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import UserSync from "./UserSync";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  // Show loading screen while checking authentication status
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Redirect to landing page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Render protected content with user sync if signed in
  return <UserSync>{children}</UserSync>;
};

export default ProtectedRoute;
