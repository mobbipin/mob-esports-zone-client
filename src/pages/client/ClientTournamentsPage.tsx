import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, FilterIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const ClientTournamentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("available");

  const availableTournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      date: "Jan 15 - Jan 17, 2025",
      participants: 96,
      maxParticipants: 128,
      prize: "$10,000",
      status: "Registration Open",
      type: "Squad",
      game: "PUBG Mobile",
      registrationDeadline: "Jan 12, 2025",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      date: "Jan 20 - Jan 22, 2025",
      participants: 32,
      maxParticipants: 64,
      prize: "$15,000",
      status: "Registration Open",
      type: "Team",
      game: "Valorant",
      registrationDeadline: "Jan 17, 2025",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 4,
      title: "Free Fire Solo Championship",
      date: "Feb 1 - Feb 3, 2025",
      participants: 0,
      maxParticipants: 200,
      prize: "$5,000",
      status: "Coming Soon",
      type: "Solo",
      game: "Free Fire",
      registrationDeadline: "Jan 28, 2025",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    }
  ];

  const registeredTournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      date: "Jan 15 - Jan 17, 2025",
      participants: 96,
      maxParticipants: 128,
      prize: "$10,000",
      status: "Registered",
      type: "Squad",
      game: "PUBG Mobile",
      registrationDate: "Dec 28, 2024",
      teamName: "Elite Gamers",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    }
  ];

  const pastTournaments = [
    {
      id: 5,
      title: "Mobile Legends Winter Cup",
      date: "Dec 15 - Dec 17, 2024",
      prize: "$8,000",
      status: "Completed",
      type: "Team",
      game: "Mobile Legends",
      result: "2nd Place",
      earnings: "$2,000",
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 6,
      title: "Free Fire Solo Tournament",
      date: "Nov 20 - Nov 22, 2024",
      prize: "$3,000",
      status: "Completed",
      type: "Solo",
      game: "Free Fire",
      result: "1st Place",
      earnings: "$1,500",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    }
  ];

  const getCurrentTournaments = () => {
    switch (activeTab) {
      case "available":
        return availableTournaments;
      case "registered":
        return registeredTournaments;
      case "past":
        return pastTournaments;
      default:
        return availableTournaments;
    }
  };

  const filteredTournaments = getCurrentTournaments().filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status.toLowerCase().includes(statusFilter.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-600";
      case "Registered":
        return "bg-blue-600";
      case "Coming Soon":
        return "bg-yellow-600";
      case "Completed":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const tabs = [
    { id: "available", label: "Available", count: availableTournaments.length },
    { id: "registered", label: "Registered", count: registeredTournaments.length },
    { id: "past", label: "Past", count: pastTournaments.length }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Tournaments</h1>
          <p className="text-gray-400">
            Manage your tournament registrations and view your competition history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#15151a] p-1 rounded-lg border border-[#292932] w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-[#f34024] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#292932]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#15151a] rounded-lg p-6 mb-8 border border-[#292932]">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Tournaments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search tournaments or games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
              >
                <option value="all">All Status</option>
                {activeTab === "available" && (
                  <>
                    <option value="registration">Registration Open</option>
                    <option value="coming">Coming Soon</option>
                  </>
                )}
                {activeTab === "registered" && (
                  <option value="registered">Registered</option>
                )}
                {activeTab === "past" && (
                  <option value="completed">Completed</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300">
              <div className="relative">
                <img 
                  src={tournament.image} 
                  alt={tournament.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-[#19191d]/80 text-white text-xs font-semibold rounded">
                    {tournament.game}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-[#f34024] text-white text-xs font-semibold rounded">
                    {tournament.type}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{tournament.title}</h3>
                
                <div className="space-y-2 text-gray-400 text-sm mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {tournament.date}
                  </div>
                  
                  {activeTab === "available" && (
                    <>
                      <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-2" />
                        {tournament.participants}/{tournament.maxParticipants} participants
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Register by {tournament.registrationDeadline}
                      </div>
                    </>
                  )}
                  
                  {activeTab === "registered" && (
                    <>
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                        Registered as {tournament.teamName}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Registered on {tournament.registrationDate}
                      </div>
                    </>
                  )}
                  
                  {activeTab === "past" && (
                    <div className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-2 text-yellow-500" />
                      {tournament.result} - Earned {tournament.earnings}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    {tournament.prize} prize pool
                  </div>
                </div>

                {/* Progress Bar for Available Tournaments */}
                {activeTab === "available" && tournament.maxParticipants && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Registration Progress</span>
                      <span>{Math.round((tournament.participants / tournament.maxParticipants) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[#292932] rounded-full h-2">
                      <div 
                        className="bg-[#f34024] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Link to={`/tournaments/${tournament.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-[#292932] text-white hover:bg-[#292932]">
                      View Details
                    </Button>
                  </Link>
                  
                  {activeTab === "available" && tournament.status === "Registration Open" && (
                    <Button className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                      Register
                    </Button>
                  )}
                  
                  {activeTab === "registered" && (
                    <Button variant="outline" className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                      Withdraw
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {activeTab === "available" && "No available tournaments found"}
              {activeTab === "registered" && "You haven't registered for any tournaments yet"}
              {activeTab === "past" && "No tournament history found"}
            </div>
            <p className="text-gray-500 mb-6">
              {activeTab === "available" && "Try adjusting your filters or check back later for new tournaments"}
              {activeTab === "registered" && "Browse available tournaments to join the competition"}
              {activeTab === "past" && "Participate in tournaments to build your competition history"}
            </p>
            {activeTab !== "available" && (
              <Link to="/tournaments">
                <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                  Browse Tournaments
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};