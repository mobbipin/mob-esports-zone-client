import React from "react";
import { Link } from "react-router-dom";
import { UsersIcon, TrophyIcon, NewspaperIcon, TrendingUpIcon, CalendarIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: "Total Users", value: "2,847", change: "+12%", icon: UsersIcon, color: "text-blue-500" },
    { label: "Active Teams", value: "342", change: "+8%", icon: UsersIcon, color: "text-green-500" },
    { label: "Live Tournaments", value: "12", change: "+3", icon: TrophyIcon, color: "text-[#f34024]" },
    { label: "Total Prize Pool", value: "$125,000", change: "+25%", icon: DollarSignIcon, color: "text-yellow-500" }
  ];

  const recentActivity = [
    { id: 1, type: "user", message: "New user ProGamer123 registered", time: "2 minutes ago" },
    { id: 2, type: "tournament", message: "PUBG Championship registration opened", time: "1 hour ago" },
    { id: 3, type: "team", message: "Team Elite Gamers created", time: "3 hours ago" },
    { id: 4, type: "tournament", message: "Valorant Pro League completed", time: "1 day ago" },
    { id: 5, type: "user", message: "50 new users registered today", time: "1 day ago" }
  ];

  const upcomingTournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      date: "Jan 15, 2025",
      participants: 96,
      maxParticipants: 128,
      status: "Registration Open"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      date: "Jan 20, 2025",
      participants: 32,
      maxParticipants: 64,
      status: "Registration Open"
    },
    {
      id: 3,
      title: "Mobile Legends Tournament",
      date: "Jan 25, 2025",
      participants: 96,
      maxParticipants: 96,
      status: "Full"
    }
  ];

  const quickActions = [
    { label: "Create Tournament", href: "/admin/tournaments/create", icon: TrophyIcon, color: "bg-[#f34024]" },
    { label: "Manage Users", href: "/admin/users", icon: UsersIcon, color: "bg-blue-600" },
    { label: "Create Post", href: "/admin/posts", icon: NewspaperIcon, color: "bg-green-600" },
    { label: "View Analytics", href: "/admin/analytics", icon: TrendingUpIcon, color: "bg-purple-600" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to the MOB Esports Zone admin panel</p>
      </div>

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
                    <p className="text-green-500 text-sm mt-1">{stat.change} from last month</p>
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

          {/* Recent Activity */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-[#19191d] rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "user" ? "bg-blue-500" :
                      activity.type === "tournament" ? "bg-[#f34024]" :
                      "bg-green-500"
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
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
                {upcomingTournaments.map((tournament) => (
                  <div key={tournament.id} className="p-3 bg-[#19191d] rounded-lg">
                    <h4 className="text-white font-medium text-sm mb-1">{tournament.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {tournament.date}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tournament.status === "Registration Open" ? "bg-green-600 text-white" :
                        tournament.status === "Full" ? "bg-red-600 text-white" :
                        "bg-yellow-600 text-white"
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">
                        {tournament.participants}/{tournament.maxParticipants} participants
                      </span>
                      <Link to={`/admin/tournaments/${tournament.id}`}>
                        <Button size="sm" variant="outline" className="border-[#292932]e hover:bg-[#292932]">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Server Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-500 text-sm">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-500 text-sm">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">API Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-500 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Backup</span>
                  <span className="text-gray-400 text-sm">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};