import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { setLoading } = useLoading();

  React.useEffect(() => {
    if (!isLoaded) {
      setLoading(true, "Checking authentication...");
    } else if (isSignedIn) {
      setLoading(false);
    } else {
      setLoading(true, "Redirecting to login...");
    }
  }, [isLoaded, isSignedIn, setLoading]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Redirect to landing page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Render protected content if signed in
  return <>{children}</>;
};

export default ProtectedRoute;
