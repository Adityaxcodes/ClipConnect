import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AppLayout from "../components/layout/AppLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";

import CreatorDashboard from "../pages/creator/Dashboard";
import CreatorGigs from "../pages/creator/mygigs";
import CreateGig from "../pages/creator/CreateGig";
import GigDetails from "../pages/creator/gigDetails";

import ClipperDashboard from "../pages/clipper/Dashboard";
import ClipperAllGigs from "../pages/clipper/allgigs";
import ClipperMyGigs from "../pages/clipper/mygigs";
import ApplicationDetail from "../pages/clipper/applicationDetail";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with Layout */}
      <Route element={<AppLayout />}>
        
        {/* Creator Routes */}
        <Route
          path="/creator/dashboard"
          element={
            <ProtectedRoute role="CREATOR">
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/gigs"
          element={
            <ProtectedRoute role="CREATOR">
              <CreatorGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/gigs/new"
          element={
            <ProtectedRoute role="CREATOR">
              <CreateGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/gig/:id"
          element={
            <ProtectedRoute role="CREATOR">
              <GigDetails />
            </ProtectedRoute>
          }
        />

        {/* Clipper Routes */}
        <Route
          path="/clipper/dashboard"
          element={
            <ProtectedRoute role="CLIPPER">
              <ClipperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clipper/gigs"
          element={
            <ProtectedRoute role="CLIPPER">
              <ClipperAllGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clipper/my-gigs"
          element={
            <ProtectedRoute role="CLIPPER">
              <ClipperMyGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clipper/application/:id"
          element={
            <ProtectedRoute role="CLIPPER">
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
