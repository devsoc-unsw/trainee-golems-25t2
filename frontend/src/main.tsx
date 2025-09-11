import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Router } from "./Router";
import { SidebarProvider } from "./contexts/SidebarContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const clerkAppearance = {
  elements: {
    footer: "hidden",
    footerText: "hidden",
    footerTextLink: "hidden",
  },
};

const AppWithLoading = () => {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <SidebarProvider>
          <Router />
        </SidebarProvider>
      </BrowserRouter>
    </LoadingProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      <AppWithLoading />
    </ClerkProvider>
  </StrictMode>
);
