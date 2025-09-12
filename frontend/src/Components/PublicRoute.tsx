import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  // Show loading screen while checking authentication status
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Redirect to dashboard if signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render public content if not signed in
  return <>{children}</>;
};

export default PublicRoute;
