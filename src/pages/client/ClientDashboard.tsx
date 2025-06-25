import React from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UsersIcon, CalendarIcon, TrendingUpIcon, StarIcon, ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Tournaments Joined", value: "12", icon: TrophyIcon, color: "text-[#f34024]" },
    { label: "Current Rank", value: user?.rank || "Unranked", icon: StarIcon, color: "text-yellow-500" },
    { label: "Team Members", value: "3/4", icon: UsersIcon, color: "text-blue-500" },
    { label: "Win Rate", value: "68%", icon: TrendingUpIcon, color: "text-green-500" }
  ];

  const upcomingTournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      date: "Jan 15, 2025",
      time: "10:00 AM",
      status: "Registered",
      prize: "$10,000"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      date: "Jan 20, 2025",
      time: "2:00 PM",
      status: "Registration Open",
      prize: "$15,000"
    },
    {
      id: 3,
      title: "Mobile Legends Tournament",
      date: "Jan 25, 2025",
      time: "12:00 PM",
      status: "Coming Soon",
      prize: "$8,000"
    }
  ];

  const recentMatches = [
    { id: 1, tournament: "Free Fire Solo", result: "Win", position: "2nd", date: "Jan 5" },
    { id: 2, tournament: "COD Mobile Duo", result: "Loss", position: "8th", date: "Jan 3" },
    { id: 3, tournament: "PUBG Squad", result: "Win", position: "1st", date: "Dec 28" },
    { id: 4, tournament: "Valorant Team", result: "Win", position: "3rd", date: "Dec 25" }
  ];

  const teamMembers = [
    { id: 1, name: "ProGamer123", role: "Captain", status: "Online", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 2, name: "SkillMaster", role: "Player", status: "Online", avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: 3, name: "GameNinja", role: "Player", status: "Offline", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">
            Here's what's happening in your esports journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {/* Upcoming Tournaments */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming Tournaments</h2>
                  <Link to="/dashboard/tournaments" className="flex items-center text-[#f34024] hover:text-[#f34024]/80 text-sm">
                    View All <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {upcomingTournaments.map((tournament) => (
                    <div key={tournament.id} className="flex items-center justify-between p-4 bg-[#19191d] rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{tournament.title}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {tournament.date} at {tournament.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#f34024] font-bold text-sm mb-1">{tournament.prize}</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tournament.status === "Registered" ? "bg-green-600 text-white" :
                          tournament.status === "Registration Open" ? "bg-blue-600 text-white" :
                          "bg-yellow-600 text-white"
                        }`}>
                          {tournament.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Match History</h2>
                
                <div className="space-y-3">
                  {recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          match.result === "Win" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{match.tournament}</div>
                          <div className="text-gray-400 text-sm">{match.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${
                          match.result === "Win" ? "text-green-500" : "text-red-500"
                        }`}>
                          {match.result}
                        </div>
                        <div className="text-gray-400 text-sm">{match.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/tournaments">
                    <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white justify-start">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to="/dashboard/team">
                    <Button variant="outline" className="w-full border-[#292932] text-white hover:bg-[#292932] justify-start">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Manage Team
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile">
                    <Button variant="outline" className="w-full border-[#292932] text-white hover:bg-[#292932] justify-start">
                      <StarIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Overview */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">My Team</h3>
                  <Link to="/dashboard/team" className="text-[#f34024] hover:text-[#f34024]/80 text-sm">
                    Manage
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{member.name}</div>
                        <div className="text-gray-400 text-xs">{member.role}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === "Online" ? "bg-green-500" : "bg-gray-500"
                      }`}></div>
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t border-[#292932]">
                    <Button variant="outline" size="sm" className="w-full border-[#292932] text-white hover:bg-[#292932]">
                      Invite Player
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-to-br from-[#f34024] to-[#ff6b47] border-none">
              <CardContent className="p-6 text-center">
                <TrophyIcon className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Rising Star!</h3>
                <p className="text-white/90 text-sm mb-4">
                  You've won 3 tournaments this month. Keep up the great work!
                </p>
                <Button variant="outline" className=" hover:text-[#f34024]">
                  View Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};