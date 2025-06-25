import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon, FilterIcon, CalendarIcon, UsersIcon, TrophyIcon, EditIcon, TrashIcon, SettingsIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";

export const AdminTournamentsPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const tournaments = [
    {
      id: 1,
      title: "PUBG Mobile Championship",
      description: "The ultimate battle royale tournament with the best players from around the world.",
      date: "Jan 15 - Jan 17, 2025",
      startDate: "2025-01-15",
      participants: 96,
      maxParticipants: 128,
      prize: "$10,000",
      status: "Registration Open",
      type: "Squad",
      game: "PUBG Mobile",
      organizer: "Admin Team",
      created: "Dec 20, 2024",
      registrationDeadline: "Jan 12, 2025",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 2,
      title: "Valorant Pro League",
      description: "Professional Valorant tournament featuring top-tier teams competing for glory.",
      date: "Jan 20 - Jan 22, 2025",
      startDate: "2025-01-20",
      participants: 32,
      maxParticipants: 64,
      prize: "$15,000",
      status: "Registration Open",
      type: "Team",
      game: "Valorant",
      organizer: "Tournament Director",
      created: "Dec 18, 2024",
      registrationDeadline: "Jan 17, 2025",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 3,
      title: "Mobile Legends Tournament",
      description: "Fast-paced MOBA action with teams battling for supremacy.",
      date: "Jan 25 - Jan 27, 2025",
      startDate: "2025-01-25",
      participants: 96,
      maxParticipants: 96,
      prize: "$8,000",
      status: "Full",
      type: "Team",
      game: "Mobile Legends",
      organizer: "Admin Team",
      created: "Dec 15, 2024",
      registrationDeadline: "Jan 22, 2025",
      image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 4,
      title: "Free Fire Solo Championship",
      description: "Individual skill tournament where only the best survive.",
      date: "Feb 1 - Feb 3, 2025",
      startDate: "2025-02-01",
      participants: 0,
      maxParticipants: 200,
      prize: "$5,000",
      status: "Draft",
      type: "Solo",
      game: "Free Fire",
      organizer: "Community Manager",
      created: "Dec 25, 2024",
      registrationDeadline: "Jan 28, 2025",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 5,
      title: "COD Mobile Winter Cup",
      description: "Intense battles in the ultimate mobile FPS experience.",
      date: "Dec 15 - Dec 17, 2024",
      startDate: "2024-12-15",
      participants: 64,
      maxParticipants: 64,
      prize: "$12,000",
      status: "Completed",
      type: "Duo",
      game: "COD Mobile",
      organizer: "Tournament Director",
      created: "Nov 20, 2024",
      registrationDeadline: "Dec 12, 2024",
      image: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
    },
    {
      id: 6,
      title: "Clash Royale Masters",
      description: "Strategic card battles with the most skilled players.",
      date: "Jan 12 - Jan 14, 2025",
      startDate: "2025-01-12",
      participants: 64,
      maxParticipants: 64,
      prize: "$3,000",
      status: "Ongoing",
      type: "Solo",
      game: "Clash Royale",
      organizer: "Admin Team",
      created: "Dec 10, 2024",
      registrationDeadline: "Jan 9, 2025",
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

  const handleDeleteTournament = (tournamentId: number, tournamentTitle: string) => {
    if (confirm(`Are you sure you want to delete "${tournamentTitle}"? This action cannot be undone.`)) {
      addToast(`Tournament "${tournamentTitle}" has been deleted`, "success");
    }
  };

  const handleCancelTournament = (tournamentId: number, tournamentTitle: string) => {
    if (confirm(`Are you sure you want to cancel "${tournamentTitle}"? All registered participants will be notified.`)) {
      addToast(`Tournament "${tournamentTitle}" has been cancelled`, "info");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-600";
      case "Full":
        return "bg-blue-600";
      case "Ongoing":
        return "bg-purple-600";
      case "Completed":
        return "bg-gray-600";
      case "Draft":
        return "bg-yellow-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const stats = [
    { label: "Total Tournaments", value: tournaments.length, color: "text-white" },
    { label: "Active", value: tournaments.filter(t => t.status === "Registration Open" || t.status === "Ongoing").length, color: "text-green-500" },
    { label: "Completed", value: tournaments.filter(t => t.status === "Completed").length, color: "text-blue-500" },
    { label: "Total Prize Pool", value: `$${tournaments.reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0).toLocaleString()}`, color: "text-[#f34024]" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournament Management</h1>
          <p className="text-gray-400">Create and manage esports tournaments</p>
        </div>
        <Link to="/admin/tournaments/create">
          <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Tournament
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Tournaments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tournaments or games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="registration">Registration Open</option>
              <option value="full">Full</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="team">Team</option>
              <option value="squad">Squad</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
            <div className="relative">
              <img 
                src={tournament.image} 
                alt={tournament.title}
                className="w-full h-40 object-cover"
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
              <h3 className="text-lg font-bold text-white mb-2">{tournament.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tournament.description}</p>
              
              <div className="space-y-2 text-gray-400 text-sm mb-4">
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

              {/* Tournament Info */}
              <div className="text-xs text-gray-500 mb-4">
                <div>Organizer: {tournament.organizer}</div>
                <div>Created: {tournament.created}</div>
                <div>Registration Deadline: {tournament.registrationDeadline}</div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Link to={`/tournaments/${tournament.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full border-[#292932]  hover:bg-[#292932]">
                    View
                  </Button>
                </Link>
                
                <Link to={`/admin/tournaments/${tournament.id}/bracket`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <SettingsIcon className="w-3 h-3 mr-1" />
                    Bracket
                  </Button>
                </Link>
                
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-[#292932] text-white hover:bg-[#292932]"
                >
                  <EditIcon className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                
                {tournament.status === "Registration Open" && (
                  <Button 
                    size="sm"
                    onClick={() => handleCancelTournament(tournament.id, tournament.title)}
                    variant="outline"
                    className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                )}
                
                {(tournament.status === "Draft" || tournament.status === "Cancelled") && (
                  <Button 
                    size="sm"
                    onClick={() => handleDeleteTournament(tournament.id, tournament.title)}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <TrashIcon className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No tournaments found</div>
          <p className="text-gray-500 mb-6">Try adjusting your filters or create a new tournament</p>
          <Link to="/admin/tournaments/create">
            <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredTournaments.length} of {tournaments.length} tournaments
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
            Previous
          </Button>
          <Button variant="outline" className="border-[#292932] text-white hover:bg-[#292932]">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};