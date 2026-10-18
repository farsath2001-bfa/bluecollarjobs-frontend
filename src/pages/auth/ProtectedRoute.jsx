import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// roleRequired="admin" → admins only; roleRequired="candidate" → job seekers only
function ProtectedRoute({ children, roleRequired }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;

  // Anyone who isn't an admin counts as a candidate (older accounts may say "jobseeker")
  const role = user.role === "admin" ? "admin" : "candidate";
  if (roleRequired && role !== roleRequired) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
