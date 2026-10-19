import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homeFor } from "../../utils/roles";


// roleRequired="admin" | "employer" | "candidate"
function ProtectedRoute({ children, roleRequired }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;

  // Anyone who isn't an admin or employer counts as a candidate (older accounts may say "jobseeker")
  const role = ["admin", "employer"].includes(user.role) ? user.role : "candidate";
  if (roleRequired && role !== roleRequired) return <Navigate to={homeFor(user)} replace />;

  return children;
}

export default ProtectedRoute;
