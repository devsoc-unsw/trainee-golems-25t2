import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Productivity from "./pages/Productivity";
import AINotes from "./pages/AINotes";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

export const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productivity"
        element={
          <ProtectedRoute>
            <Productivity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-notes"
        element={
          <ProtectedRoute>
            <AINotes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
