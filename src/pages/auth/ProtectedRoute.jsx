import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role check
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;