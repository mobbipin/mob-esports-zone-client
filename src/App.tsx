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
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
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
import NotificationsPage from "./pages/client/NotificationsPage";

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
import { AdminPendingTournamentsPage } from "./pages/admin/AdminPendingTournamentsPage";
import { AdminPendingPostsPage } from "./pages/admin/AdminPendingPostsPage";
import { TestEmailPage } from "./pages/TestEmailPage";
import { OrganizerDashboard } from "./pages/organizer/OrganizerDashboard";
import { OrganizerTournamentCreationPage } from "./pages/organizer/TournamentCreationPage";
import { OrganizerTournamentsListPage } from "./pages/organizer/TournamentsListPage";
import { OrganizerPostCreationPage } from "./pages/organizer/PostCreationPage";
import { OrganizerPostsListPage } from "./pages/organizer/PostsListPage";

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
      <Route path="/login" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : user.role === 'tournament_organizer' ? <Navigate to="/organizer" /> : <Navigate to="/dashboard" />) : <LoginPage />} />
      <Route path="/register" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : user.role === 'tournament_organizer' ? <Navigate to="/organizer" /> : <Navigate to="/dashboard" />) : <RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      
      {/* Test Routes (Development Only) */}
      <Route path="/test-email" element={<TestEmailPage />} />
      

      {/* Client Routes (Players Only) */}
      {user && user.role === 'player' && (
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
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<NotificationsPage />} />
        </Route>
      )}

      {/* Organizer Routes */}
      {user && user.role === 'tournament_organizer' && (
        <Route path="/organizer" element={
          <ProtectedRoute requiredRole="tournament_organizer">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<OrganizerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="tournaments" element={<OrganizerTournamentsListPage />} />
          <Route path="tournaments/create" element={<OrganizerTournamentCreationPage />} />
          <Route path="posts" element={<OrganizerPostsListPage />} />
          <Route path="posts/create" element={<OrganizerPostCreationPage />} />
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
          <Route path="tournaments/pending" element={<AdminPendingTournamentsPage />} />
          <Route path="posts/pending" element={<AdminPendingPostsPage />} />
        </Route>
      )}

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};