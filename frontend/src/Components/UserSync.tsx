import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import LoadingScreen from "./LoadingScreen";

interface UserSyncProps {
  children: React.ReactNode;
}

const UserSync: React.FC<UserSyncProps> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");

  useEffect(() => {
    const syncUser = async () => {
      if (!(isLoaded && isSignedIn && user)) return;

      setSyncStatus("syncing");

      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

        const response = await fetch(`${API_BASE}/api/user/clerk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || user.firstName || "No Name",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            avatar: user.imageUrl || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("User sync successful:", result);
        setSyncStatus("success");
      } catch (error) {
        console.error("User sync failed:", error);
        setSyncStatus("error");
        // Still allow access even if sync fails
        setSyncStatus("success");
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  // Show loading screen while syncing
  if (syncStatus === "syncing") {
    return <LoadingScreen />;
  }

  // Render children once sync is complete (success or error)
  return <>{children}</>;
};

export default UserSync;
