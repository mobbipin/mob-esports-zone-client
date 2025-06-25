import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, FilterIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const TournamentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const tournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      description: "The ultimate battle royale tournament with the best players from around the world.",
      date: "Jan 15 - Jan 17, 2025",
      participants: 128,
      maxParticipants: 128,
      prize: "$10,000",
      status: "Registration Open",
      type: "Squad",
      game: "PUBG Mobile",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      description: "Professional Valorant tournament featuring top-tier teams competing for glory.",
      date: "Jan 20 - Jan 22, 2025",
      participants: 32,
      maxParticipants: 64,
      prize: "$15,000",
      status: "Registration Open",
      type: "Team",
      game: "Valorant",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 3,
      title: "Mobile Legends Tournament",
      description: "Fast-paced MOBA action with teams battling for supremacy.",
      date: "Jan 25 - Jan 27, 2025",
      participants: 96,
      maxParticipants: 96,
      prize: "$8,000",
      status: "Full",
      type: "Team",
      game: "Mobile Legends",
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 4,
      title: "Free Fire Solo Championship",
      description: "Individual skill tournament where only the best survive.",
      date: "Feb 1 - Feb 3, 2025",
      participants: 0,
      maxParticipants: 200,
      prize: "$5,000",
      status: "Coming Soon",
      type: "Solo",
      game: "Free Fire",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 5,
      title: "Call of Duty Mobile Duo",
      description: "Partner up and dominate the battlefield in this intense duo tournament.",
      date: "Feb 5 - Feb 7, 2025",
      participants: 24,
      maxParticipants: 100,
      prize: "$12,000",
      status: "Registration Open",
      type: "Duo",
      game: "COD Mobile",
      image: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 6,
      title: "Clash Royale Masters",
      description: "Strategic card battles with the most skilled players.",
      date: "Jan 12 - Jan 14, 2025",
      participants: 64,
      maxParticipants: 64,
      prize: "$3,000",
      status: "Ongoing",
      type: "Solo",
      game: "Clash Royale",
      image: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    }
  ];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesType = typeFilter === "all" || tournament.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-600";
      case "Coming Soon":
        return "bg-yellow-600";
      case "Ongoing":
        return "bg-blue-600";
      case "Full":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Tournaments</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Compete in the most exciting esports tournaments. Join solo, duo, or team competitions 
            and prove your skills against the best players.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#15151a] rounded-lg p-6 mb-8 border border-[#292932]">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Tournaments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="registration">Registration Open</option>
                <option value="coming">Coming Soon</option>
                <option value="ongoing">Ongoing</option>
                <option value="full">Full</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
                <option value="team">Team</option>
                <option value="squad">Squad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:transform hover:scale-105">
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
                <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tournament.description}</p>
                
                <div className="space-y-2 text-gray-400 text-sm mb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {tournament.date}
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {tournament.participants}/{tournament.maxParticipants} participants
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    {tournament.prize} prize pool
                  </div>
                </div>

                {/* Progress Bar */}
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
                
                <Link to={`/tournaments/${tournament.id}`}>
                  <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No tournaments found</div>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};