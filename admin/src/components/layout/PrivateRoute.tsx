import React from "react";
import { useNavigate } from "react-router-dom";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate();

  // Check if the user is authenticated (e.g., by checking localStorage).
  const isAuthenticated = localStorage.getItem("user") !== null;

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return children;
}

export default PrivateRoute;
