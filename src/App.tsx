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
import { CreateTeamPage } from "./pages/client/CreateTeamPage";
import { ManageTeamPage } from "./pages/client/ManageTeamPage";
import { ClientTournamentsPage } from "./pages/client/ClientTournamentsPage";
import PlayerListPage from "./pages/client/PlayerListPage";
import FriendsPage from "./pages/client/FriendsPage";
import MessagesPage from "./pages/client/MessagesPage";

// Admin Pages
import { UsersManagementPage } from "./pages/admin/UsersManagementPage";
import { TeamsManagementPage } from "./pages/admin/TeamsManagementPage";
import { AdminTournamentsPage } from "./pages/admin/AdminTournamentsPage";
import { TournamentCreationPage } from "./pages/admin/TournamentCreationPage";
import { BracketManagementPage } from "./pages/admin/BracketManagementPage";
import { PostsManagementPage } from "./pages/admin/PostsManagementPage";
import { TournamentEditPage } from "./pages/admin/TournamentEditPage";
import { PostEditPage } from "./pages/admin/PostEditPage";
import { TournamentViewPage } from "./pages/admin/TournamentViewPage";
import { PostViewPage } from "./pages/admin/PostViewPage";
import { AdminTeamViewPage } from "./pages/admin/AdminTeamViewPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

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
        <Route path="/players" element={<PlayerListPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <LoginPage />} />
      <Route path="/register" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <RegisterPage />} />
      

      {/* Client Routes */}
      {user && user.role !== 'admin' && (
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<ClientDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="create-team" element={<CreateTeamPage />} />
          <Route path="manage-team" element={<ManageTeamPage />} />
          <Route path="tournaments" element={<ClientTournamentsPage />} />
        </Route>
      )}
      {user && user.role !== 'admin' && (
        <Route path="/friends" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<FriendsPage />} />
        </Route>
      )}
      {user && user.role !== 'admin' && (
        <Route path="/messages" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<MessagesPage />} />
        </Route>
      )}

      {/* Admin Routes */}
      {user && user.role === 'admin' && (
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
          <Route path="tournaments/:id/edit" element={<TournamentEditPage />} />
          <Route path="tournaments/:id/view" element={<TournamentViewPage />} />
          <Route path="posts" element={<PostsManagementPage />} />
          <Route path="posts/:id/edit" element={<PostEditPage />} />
          <Route path="posts/:id/view" element={<PostViewPage />} />
          <Route path="teams/:id/view" element={<AdminTeamViewPage />} />
        </Route>
      )}

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};