import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to landing page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Render protected content if signed in
  return <>{children}</>;
};

export default ProtectedRoute;
