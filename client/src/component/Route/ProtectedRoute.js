import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute
 *
 * Guards a single route. It is rendered OUTSIDE the main <Routes> block in
 * App.js (one guard per protected path), so it renders its own <Routes> with a
 * single matching <Route>. Unauthenticated users are redirected to /login;
 * non-admin users are blocked from admin-only routes.
 *
 * Props:
 *   path       - the route path to protect
 *   Component  - the component to render when access is allowed
 *   isAdmin    - when true, also require the user to have the "admin" role
 */
const ProtectedRoute = ({ path, Component, isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // Wait until auth state is resolved to avoid a redirect flash.
  if (loading) return null;

  const element =
    isAuthenticated === false ? (
      <Navigate to="/login" replace />
    ) : isAdmin && user && user.role !== "admin" ? (
      <Navigate to="/login" replace />
    ) : (
      <Component />
    );

  return (
    <Routes>
      <Route path={path} element={element} />
    </Routes>
  );
};

export default ProtectedRoute;
