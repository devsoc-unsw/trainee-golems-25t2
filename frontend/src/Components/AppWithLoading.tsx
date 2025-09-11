import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";
import LoadingProvider from "../contexts/LoadingContext";
import { Router } from "../Router";

const AppWithLoading: React.FC = () => {
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

export default AppWithLoading;
