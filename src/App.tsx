import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { TournamentsPage } from "./pages/public/TournamentsPage";
import { TournamentDetailPage } from "./pages/public/TournamentDetailPage";
import { NewsPage } from "./pages/public/NewsPage";
import { NewsDetailPage } from "./pages/public/NewsDetailPage";

// Client Pages
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ProfilePage } from "./pages/client/ProfilePage";
import { TeamPage } from "./pages/client/TeamPage";
import { ClientTournamentsPage } from "./pages/client/ClientTournamentsPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UsersManagementPage } from "./pages/admin/UsersManagementPage";
import { TeamsManagementPage } from "./pages/admin/TeamsManagementPage";
import { AdminTournamentsPage } from "./pages/admin/AdminTournamentsPage";
import { TournamentCreationPage } from "./pages/admin/TournamentCreationPage";
import { BracketManagementPage } from "./pages/admin/BracketManagementPage";
import { PostsManagementPage } from "./pages/admin/PostsManagementPage";

export const App = (): JSX.Element => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f34024]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:id" element={<NewsDetailPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Client Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<ClientDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="tournaments" element={<ClientTournamentsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagementPage />} />
        <Route path="teams" element={<TeamsManagementPage />} />
        <Route path="tournaments" element={<AdminTournamentsPage />} />
        <Route path="tournaments/create" element={<TournamentCreationPage />} />
        <Route path="tournaments/:id/bracket" element={<BracketManagementPage />} />
        <Route path="posts" element={<PostsManagementPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};