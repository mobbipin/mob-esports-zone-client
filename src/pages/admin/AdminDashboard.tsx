import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersIcon, TrophyIcon, NewspaperIcon, TrendingUpIcon, CalendarIcon, ClockIcon, AlertTriangleIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import { Breadcrumb } from "../../components/ui/Breadcrumb";

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<any>("/auth/admin/dashboard-stats");
        setDashboardData(response.data);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const quickActions = [
    { label: "Create Tournament", href: "/admin/tournaments/create", icon: TrophyIcon, color: "bg-[#f34024]" },
    { label: "Manage Users", href: "/admin/users", icon: UsersIcon, color: "bg-blue-600" },
    { label: "Create Post", href: "/admin/posts", icon: NewspaperIcon, color: "bg-green-600" },
    { label: "View Analytics", href: "/admin/analytics", icon: TrendingUpIcon, color: "bg-purple-600" },
    ...(dashboardData?.pending?.organizers > 0 ? [{ label: `Approve Organizers (${dashboardData.pending.organizers})`, href: "/admin/users", icon: UsersIcon, color: "bg-orange-600" }] : []),
    ...(dashboardData?.pending?.tournaments > 0 ? [{ label: `Approve Tournaments (${dashboardData.pending.tournaments})`, href: "/admin/tournaments/pending", icon: TrophyIcon, color: "bg-yellow-600" }] : []),
    ...(dashboardData?.pending?.posts > 0 ? [{ label: `Approve Posts (${dashboardData.pending.posts})`, href: "/admin/posts/pending", icon: NewspaperIcon, color: "bg-indigo-600" }] : [])
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
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to the MOB Esports Zone admin panel</p>
      </div>

      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-white mt-1">{dashboardData?.totals?.users || 0}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Teams</p>
                    <p className="text-2xl font-bold text-white mt-1">{dashboardData?.totals?.teams || 0}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Tournaments</p>
                    <p className="text-2xl font-bold text-white mt-1">{dashboardData?.totals?.tournaments || 0}</p>
                  </div>
                  <TrophyIcon className="w-8 h-8 text-[#f34024]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pending Items</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {(dashboardData?.pending?.organizers || 0) + (dashboardData?.pending?.tournaments || 0) + (dashboardData?.pending?.posts || 0)}
                    </p>
                  </div>
                  <AlertTriangleIcon className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
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

              {/* Recent Activities */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
                  <div className="space-y-4">
                    {dashboardData?.activities?.length === 0 && <div className="text-gray-400">No recent activities</div>}
                    {dashboardData?.activities?.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#292932] flex items-center justify-center">
                            {activity.type === 'user_registration' && <UsersIcon className="w-4 h-4 text-blue-500" />}
                            {activity.type === 'tournament_created' && <TrophyIcon className="w-4 h-4 text-[#f34024]" />}
                            {activity.type === 'post_created' && <NewspaperIcon className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-sm">{activity.title}</h4>
                            <div className="text-gray-400 text-xs">{activity.description}</div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pending Items Summary */}
              {(dashboardData?.pending?.organizers > 0 || dashboardData?.pending?.tournaments > 0 || dashboardData?.pending?.posts > 0) && (
                <Card className="bg-[#15151a] border-[#292932]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Pending Items</h3>
                      <span className="text-[#f34024] text-sm font-medium">
                        {(dashboardData?.pending?.organizers || 0) + (dashboardData?.pending?.tournaments || 0) + (dashboardData?.pending?.posts || 0)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {dashboardData?.pending?.organizers > 0 && (
                        <Link to="/admin/users" className="block">
                          <div className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors">
                            <div className="flex items-center space-x-3">
                              <UsersIcon className="w-5 h-5 text-orange-500" />
                              <div>
                                <h4 className="text-white font-medium text-sm">Pending Organizers</h4>
                                <div className="text-gray-400 text-xs">{dashboardData.pending.organizers} waiting for approval</div>
                              </div>
                            </div>
                            <span className="text-orange-500 text-sm font-medium">{dashboardData.pending.organizers}</span>
                          </div>
                        </Link>
                      )}
                      {dashboardData?.pending?.tournaments > 0 && (
                        <Link to="/admin/tournaments/pending" className="block">
                          <div className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors">
                            <div className="flex items-center space-x-3">
                              <TrophyIcon className="w-5 h-5 text-yellow-500" />
                              <div>
                                <h4 className="text-white font-medium text-sm">Pending Tournaments</h4>
                                <div className="text-gray-400 text-xs">{dashboardData.pending.tournaments} waiting for approval</div>
                              </div>
                            </div>
                            <span className="text-yellow-500 text-sm font-medium">{dashboardData.pending.tournaments}</span>
                          </div>
                        </Link>
                      )}
                      {dashboardData?.pending?.posts > 0 && (
                        <Link to="/admin/posts/pending" className="block">
                          <div className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors">
                            <div className="flex items-center space-x-3">
                              <NewspaperIcon className="w-5 h-5 text-indigo-500" />
                              <div>
                                <h4 className="text-white font-medium text-sm">Pending Posts</h4>
                                <div className="text-gray-400 text-xs">{dashboardData.pending.posts} waiting for approval</div>
                              </div>
                            </div>
                            <span className="text-indigo-500 text-sm font-medium">{dashboardData.pending.posts}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Stats */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Recent Activity (7 days)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UsersIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-white text-sm">New Users</span>
                      </div>
                      <span className="text-blue-500 font-medium">{dashboardData?.recent?.users || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrophyIcon className="w-5 h-5 text-[#f34024]" />
                        <span className="text-white text-sm">New Tournaments</span>
                      </div>
                      <span className="text-[#f34024] font-medium">{dashboardData?.recent?.tournaments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <NewspaperIcon className="w-5 h-5 text-yellow-500" />
                        <span className="text-white text-sm">New Posts</span>
                      </div>
                      <span className="text-yellow-500 font-medium">{dashboardData?.recent?.posts || 0}</span>
                    </div>
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