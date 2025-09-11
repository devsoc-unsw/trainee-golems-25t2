import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Router } from "./Router";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

const clerkAppearance = {
  elements: {
    footer: "hidden",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      afterSignOutUrl="/"
    >
      <BrowserRouter>
        <SidebarProvider>
          <Router />
        </SidebarProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
