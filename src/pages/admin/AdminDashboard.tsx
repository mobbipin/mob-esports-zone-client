import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersIcon, TrophyIcon, NewspaperIcon, TrendingUpIcon, CalendarIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to get total counts from API, fallback to data.length
        const [usersRes, teamsRes, tournamentsRes, postsRes, upcomingRes, organizersRes, tournamentsPendingRes, postsPendingRes] = await Promise.all([
          apiFetch<any>("/players"),
          apiFetch<any>("/teams"),
          apiFetch<any>("/tournaments"),
          apiFetch<any>("/posts"),
          apiFetch<any>("/tournaments"),
          apiFetch<any>("/admin/pending-organizers"),
          apiFetch<any>("/admin/pending-tournaments"),
          apiFetch<any>("/admin/pending-posts")
        ]);
        setPendingOrganizers(organizersRes.data || []);
        setPendingTournaments(tournamentsPendingRes.data || []);
        setPendingPosts(postsPendingRes.data || []);
        setStats([
          { label: "Total Users", value: usersRes.total || (Array.isArray(usersRes.data) ? usersRes.data.length : 0), icon: UsersIcon, color: "text-blue-500" },
          { label: "Active Teams", value: teamsRes.total || (Array.isArray(teamsRes.data) ? teamsRes.data.length : 0), icon: UsersIcon, color: "text-green-500" },
          { label: "Live Tournaments", value: tournamentsRes.total || (Array.isArray(tournamentsRes.data) ? tournamentsRes.data.length : 0), icon: TrophyIcon, color: "text-[#f34024]" },
          { label: "Total Posts", value: postsRes.total || (Array.isArray(postsRes.data) ? postsRes.data.length : 0), icon: NewspaperIcon, color: "text-yellow-500" }
        ]);
        setUpcomingTournaments(upcomingRes.data || []);
        setRecentPosts(postsRes.data ? postsRes.data.slice(0, 5) : []);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const [pendingOrganizers, setPendingOrganizers] = useState<any[]>([]);
  const [pendingTournaments, setPendingTournaments] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);

  const quickActions = [
    { label: "Create Tournament", href: "/admin/tournaments/create", icon: TrophyIcon, color: "bg-[#f34024]" },
    { label: "Manage Users", href: "/admin/users", icon: UsersIcon, color: "bg-blue-600" },
    { label: "Create Post", href: "/admin/posts", icon: NewspaperIcon, color: "bg-green-600" },
    { label: "View Analytics", href: "/admin/analytics", icon: TrendingUpIcon, color: "bg-purple-600" },
    ...(pendingOrganizers.length > 0 ? [{ label: `Approve Organizers (${pendingOrganizers.length})`, href: "#", icon: UsersIcon, color: "bg-orange-600" }] : []),
    ...(pendingTournaments.length > 0 ? [{ label: `Approve Tournaments (${pendingTournaments.length})`, href: "#", icon: TrophyIcon, color: "bg-yellow-600" }] : []),
    ...(pendingPosts.length > 0 ? [{ label: `Approve Posts (${pendingPosts.length})`, href: "#", icon: NewspaperIcon, color: "bg-indigo-600" }] : [])
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} height={100} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton height={200} />
            <Skeleton height={200} />
          </div>
          <div className="space-y-8">
            <Skeleton height={120} />
            <Skeleton height={120} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to the MOB Esports Zone admin panel</p>
      </div>

      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-[#15151a] border-[#292932]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Link key={index} to={action.href}>
                          <div className="flex flex-col items-center p-4 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors cursor-pointer">
                            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white text-sm font-medium text-center">{action.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Recent Posts</h2>
                  <div className="space-y-4">
                    {recentPosts.length === 0 && <div className="text-gray-400">No recent posts</div>}
                    {recentPosts.map((post: any) => (
                      <div key={post.id} className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg">
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">{post.title}</h4>
                          <div className="text-gray-400 text-xs">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</div>
                        </div>
                        <Link to={`/admin/posts/${post.id}/view`}>
                          <Button size="sm" variant="outline" className="border-[#292932] hover:bg-[#292932]">View</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pending Organizers */}
              {pendingOrganizers.length > 0 && (
                <Card className="bg-[#15151a] border-[#292932]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Pending Organizers</h3>
                      <span className="text-[#f34024] text-sm font-medium">{pendingOrganizers.length}</span>
                    </div>
                    <div className="space-y-4">
                      {pendingOrganizers.map((organizer: any) => (
                        <div key={organizer.id} className="p-3 bg-[#19191d] rounded-lg">
                          <h4 className="text-white font-medium text-sm mb-1">{organizer.displayName || organizer.username || organizer.email}</h4>
                          <div className="text-gray-400 text-xs mb-2">{organizer.email}</div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded text-xs ${
                              organizer.emailVerified ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                            }`}>
                              {organizer.emailVerified ? "Verified" : "Unverified"}
                            </span>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await apiFetch(`/admin/approve-organizer/${organizer.id}`, { method: 'POST' });
                                    setPendingOrganizers(prev => prev.filter(o => o.id !== organizer.id));
                                  } catch (error) {
                                    console.error('Failed to approve organizer:', error);
                                  }
                                }}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to reject this organizer? This will delete their account.')) {
                                    try {
                                      await apiFetch(`/admin/reject-organizer/${organizer.id}`, { method: 'POST' });
                                      setPendingOrganizers(prev => prev.filter(o => o.id !== organizer.id));
                                    } catch (error) {
                                      console.error('Failed to reject organizer:', error);
                                    }
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Tournaments */}
              {pendingTournaments.length > 0 && (
                <Card className="bg-[#15151a] border-[#292932]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Pending Tournaments</h3>
                      <span className="text-[#f34024] text-sm font-medium">{pendingTournaments.length}</span>
                    </div>
                    <div className="space-y-4">
                      {pendingTournaments.map((tournament: any) => (
                        <div key={tournament.id} className="p-3 bg-[#19191d] rounded-lg">
                          <h4 className="text-white font-medium text-sm mb-1">{tournament.name}</h4>
                          <div className="text-gray-400 text-xs mb-2">
                            By: {tournament.organizerDisplayName || tournament.organizerName || tournament.organizerEmail}
                          </div>
                          <div className="text-gray-400 text-xs mb-2">
                            Game: {tournament.game} • Teams: {tournament.maxTeams}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-400 text-xs">
                              {new Date(tournament.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await apiFetch(`/admin/approve-tournament/${tournament.id}`, { method: 'POST' });
                                    setPendingTournaments(prev => prev.filter(t => t.id !== tournament.id));
                                  } catch (error) {
                                    console.error('Failed to approve tournament:', error);
                                  }
                                }}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to reject this tournament? This will delete it permanently.')) {
                                    try {
                                      await apiFetch(`/admin/reject-tournament/${tournament.id}`, { method: 'POST' });
                                      setPendingTournaments(prev => prev.filter(t => t.id !== tournament.id));
                                    } catch (error) {
                                      console.error('Failed to reject tournament:', error);
                                    }
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Posts */}
              {pendingPosts.length > 0 && (
                <Card className="bg-[#15151a] border-[#292932]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Pending Posts</h3>
                      <span className="text-[#f34024] text-sm font-medium">{pendingPosts.length}</span>
                    </div>
                    <div className="space-y-4">
                      {pendingPosts.map((post: any) => (
                        <div key={post.id} className="p-3 bg-[#19191d] rounded-lg">
                          <h4 className="text-white font-medium text-sm mb-1">{post.title}</h4>
                          <div className="text-gray-400 text-xs mb-2">
                            By: {post.organizerDisplayName || post.organizerName || post.organizerEmail}
                          </div>
                          <div className="text-gray-400 text-xs mb-2">
                            {post.content.substring(0, 100)}...
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-400 text-xs">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await apiFetch(`/admin/approve-post/${post.id}`, { method: 'POST' });
                                    setPendingPosts(prev => prev.filter(p => p.id !== post.id));
                                  } catch (error) {
                                    console.error('Failed to approve post:', error);
                                  }
                                }}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to reject this post? This will delete it permanently.')) {
                                    try {
                                      await apiFetch(`/admin/reject-post/${post.id}`, { method: 'POST' });
                                      setPendingPosts(prev => prev.filter(p => p.id !== post.id));
                                    } catch (error) {
                                      console.error('Failed to reject post:', error);
                                    }
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Tournaments */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Upcoming Tournaments</h3>
                    <Link to="/admin/tournaments" className="text-[#f34024] hover:text-[#f34024]/80 text-sm">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingTournaments.length === 0 && <div className="text-gray-400">No upcoming tournaments</div>}
                    {upcomingTournaments.map((tournament: any) => (
                      <div key={tournament.id} className="p-3 bg-[#19191d] rounded-lg">
                        <h4 className="text-white font-medium text-sm mb-1">{tournament.name || tournament.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <div className="flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : ""}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            tournament.status === "registration" ? "bg-green-600 text-white" :
                            tournament.status === "upcoming" ? "bg-yellow-600 text-white" :
                            tournament.status === "ongoing" ? "bg-blue-600 text-white" :
                            tournament.status === "completed" ? "bg-gray-600 text-white" :
                            "bg-[#292932] text-white"
                          }`}>
                            {tournament.status ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1) : "Unknown"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">
                            {tournament.maxTeams || tournament.maxParticipants || 0} teams
                          </span>
                          <Link to={`/admin/tournaments/${tournament.id}/view`}>
                            <Button size="sm" variant="outline" className="border-[#292932] hover:bg-[#292932]">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};