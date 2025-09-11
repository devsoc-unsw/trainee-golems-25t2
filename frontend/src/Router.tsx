import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Productivity from "./pages/Productivity";
import ProtectedRoute from "./Components/ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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
    </Routes>
  );
};
