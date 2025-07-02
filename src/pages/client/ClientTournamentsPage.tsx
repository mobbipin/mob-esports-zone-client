import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, FilterIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch } from "../../lib/api";

export const ClientTournamentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("available");
  const { user } = useAuth();
  const { addToast } = useToast();
  const [availableTournaments, setAvailableTournaments] = useState<any[]>([]);
  const [registeredTournaments, setRegisteredTournaments] = useState<any[]>([]);
  const [pastTournaments, setPastTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch<any>(`/tournaments?status=upcoming`),
      user?.teamId ? apiFetch<any>(`/tournaments?registeredTeamId=${user.teamId}`) : Promise.resolve({ data: [] }),
      apiFetch<any>(`/tournaments?status=completed`)
    ])
      .then(([available, registered, past]: any[]) => {
        setAvailableTournaments(available.data || []);
        setRegisteredTournaments(registered.data || []);
        setPastTournaments(past.data || []);
      })
      .catch(err => setError(typeof err === "string" ? err : "Failed to load tournaments"))
      .finally(() => setLoading(false));
  }, [user?.teamId]);

  const handleRegister = async (tournamentId: string) => {
    if (!user?.teamId) {
      addToast("You must be part of a team to register.", "error");
      return;
    }
    setRegisteringId(tournamentId);
    try {
      await apiFetch(`/tournaments/${tournamentId}/register`, {
        method: "POST",
        body: JSON.stringify({ teamId: user.teamId })
      });
      addToast("Team registered for tournament!", "success");
      // Optionally refetch tournaments
    } catch (err: any) {
      addToast(err?.toString() || "Failed to register team", "error");
    } finally {
      setRegisteringId(null);
    }
  };

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
        {loading ? (
          <div className="text-center text-white">Loading tournaments...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:transform hover:scale-105">
                <div className="relative">
                  <img 
                    src={tournament.imageUrl || tournament.image || "https://via.placeholder.com/400x200"} 
                    alt={tournament.name}
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
                </div>
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold text-white mb-2">{tournament.name}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-2">{tournament.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span><CalendarIcon className="w-4 h-4 inline mr-1" /> {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBA"}</span>
                    <span><UsersIcon className="w-4 h-4 inline mr-1" /> {tournament.maxTeams || "?"} Teams</span>
                    <span><TrophyIcon className="w-4 h-4 inline mr-1" /> {tournament.prizePool ? `$${tournament.prizePool}` : "TBA"}</span>
                  </div>
                  {activeTab === "available" && (
                    <Button 
                      onClick={() => handleRegister(tournament.id)}
                      disabled={registeringId === tournament.id || !user?.teamId}
                      className="w-full mt-4 bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                    >
                      {registeringId === tournament.id ? "Registering..." : "Register"}
                    </Button>
                  )}
                  <Link to={`/tournaments/${tournament.id}`} className="block mt-4">
                    <Button className="w-full bg-[#292932] hover:bg-[#f34024]/90 text-white">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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