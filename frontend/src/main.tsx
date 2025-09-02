import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { SidebarProvider } from "./contexts/SidebarContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <Router />
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);
