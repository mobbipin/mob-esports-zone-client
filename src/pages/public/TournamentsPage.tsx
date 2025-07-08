import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, FilterIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";

export const TournamentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ status: boolean; data: any[] }>(`/tournaments?status=${statusFilter === "all" ? "" : statusFilter}&search=${searchTerm}`)
      .then(res => setTournaments(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load tournaments"))
      .finally(() => setLoading(false));
  }, [searchTerm, statusFilter]);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesType = typeFilter === "all" || (tournament.type && tournament.type.toLowerCase() === typeFilter.toLowerCase());
    return matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registration":
        return "bg-green-600";
      case "coming":
        return "bg-yellow-600";
      case "ongoing":
        return "bg-blue-600";
      case "full":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <Skeleton key={i} height={180} className="mb-4" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Tournaments</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Compete in the most exciting esports tournaments. Join solo, duo, or team competitions 
            and prove your skills against the best players.
          </p>
        </div>
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
                <option value="upcoming">Upcoming</option>
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
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-all duration-300 hover:transform hover:scale-105">
                <div className="relative">
                  <img 
                    src={tournament.imageUrl || tournament.image || ""} 
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
                  <Link to={`/tournaments/${tournament.id}`} className="block mt-4">
                    <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};