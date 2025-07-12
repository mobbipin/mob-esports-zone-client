import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, FileTextIcon, TrophyIcon, UsersIcon, CalendarIcon, TrendingUpIcon, StarIcon, ArrowRightIcon, UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    tournaments: 0,
    posts: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    approvedTournaments: 0,
    pendingTournaments: 0,
    approvedPosts: 0,
    pendingPosts: 0
  });

  useEffect(() => {
    const fetchOrganizerStats = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch organizer-specific stats
        const [tournamentsRes, postsRes] = await Promise.all([
          apiFetch<any>(`/tournaments?organizerId=${user.id}`),
          apiFetch<any>(`/posts?organizerId=${user.id}`)
        ]);

        const tournaments = tournamentsRes.data || [];
        const posts = postsRes.data || [];

        setStats({
          tournaments: tournaments.length,
          posts: posts.length,
          totalRegistrations: tournaments.reduce((acc: number, t: any) => acc + (t.registrations || 0), 0),
          pendingApprovals: tournaments.filter((t: any) => !t.isApproved).length + posts.filter((p: any) => !p.isApproved).length,
          approvedTournaments: tournaments.filter((t: any) => t.isApproved).length,
          pendingTournaments: tournaments.filter((t: any) => !t.isApproved).length,
          approvedPosts: posts.filter((p: any) => p.isApproved).length,
          pendingPosts: posts.filter((p: any) => !p.isApproved).length
        });
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load organizer stats");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerStats();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} height={120} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => <Skeleton key={i} height={300} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error Loading Dashboard</div>
        <div className="text-gray-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tournament Organizer Dashboard</h1>
          <p className="text-gray-400">Manage your tournaments and content</p>
        </div>

        {/* Approval Status Banners - Moved to top */}
        {user && !user.isApproved && (
          <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-yellow-400 font-medium">Account Pending Approval</h3>
                <p className="text-yellow-300 text-sm mt-1">
                  Your account is currently pending admin approval. You can browse the platform, but you won't be able to create tournaments or posts until approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {user && user.isApproved && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-green-400 font-medium">Account Approved ✓</h3>
                <p className="text-green-300 text-sm mt-1">
                  Your account has been approved! You can now create tournaments and posts. All content will be reviewed by admins before being published.
                </p>
              </div>
            </div>
          </div>
        )}

        {user && !user.emailVerified && (
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-blue-400 font-medium">Email Verification Required</h3>
                <p className="text-blue-300 text-sm mt-1">
                  Please verify your email address to access all features. Check your inbox for a verification link.
                </p>
              </div>
            </div>
          </div>
        )}

        {user && user.emailVerified && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-green-400 font-medium">Email Verified ✓</h3>
                <p className="text-green-300 text-sm mt-1">
                  Your email has been verified. You have full access to all organizer features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Tournaments</p>
                  <p className="text-2xl font-bold text-white">{stats.tournaments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{stats.posts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Registrations</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Approvals</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved Tournaments</p>
                  <p className="text-2xl font-bold text-white">{stats.approvedTournaments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Tournaments</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingTournaments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved Posts</p>
                  <p className="text-2xl font-bold text-white">{stats.approvedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <FileTextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Posts</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tournament Management</h3>
                <TrophyIcon className="w-5 h-5 text-[#f34024]" />
              </div>
              <p className="text-gray-400 mb-6">
                Create and manage your tournaments. All tournaments require admin approval before being visible to players. You can see the approval status above.
              </p>
              <div className="space-y-3">
                <Link to="/organizer/tournaments/create">
                  <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Tournament
                  </Button>
                </Link>
                <Link to="/organizer/tournaments">
                  <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932] hover:text-white">
                    <ArrowRightIcon className="w-4 h-4 mr-2" />
                    View All Tournaments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Profile Management</h3>
                <UserIcon className="w-5 h-5 text-[#f34024]" />
              </div>
              <p className="text-gray-400 mb-6">
                Update your profile information and account settings.
              </p>
              <Link to="/organizer/profile">
                <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932] hover:text-white">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Content Management</h3>
                <FileTextIcon className="w-5 h-5 text-[#f34024]" />
              </div>
              <p className="text-gray-400 mb-6">
                Create news posts and announcements. All posts require admin approval before being visible to players. You can see the approval status above.
              </p>
              <div className="space-y-3">
                <Link to="/organizer/posts/create">
                  <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
                <Link to="/organizer/posts">
                  <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932] hover:text-white">
                    <ArrowRightIcon className="w-4 h-4 mr-2" />
                    View All Posts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Status Notice */}
        {stats.pendingApprovals > 0 && (
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg mr-4">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">Pending Approvals</h3>
                  <p className="text-yellow-300">
                    You have {stats.pendingApprovals} item(s) waiting for admin approval. 
                    You'll be notified once they're approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 