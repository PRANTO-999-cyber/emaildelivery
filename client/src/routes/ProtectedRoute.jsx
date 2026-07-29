import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Pass through directly to allow viewing all pages during development
  return <Outlet />;
}
