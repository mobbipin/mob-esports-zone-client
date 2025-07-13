import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, MapPinIcon, ClockIcon, ArrowLeftIcon, UserIcon, Users2Icon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

export const RegisteredTeamsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`)
      .then(res => setTournament(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load tournament"))
      .finally(() => setLoading(false));
  }, [id]);

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

  const getTournamentTypeIcon = (type: string) => {
    switch (type) {
      case "solo":
        return <UserIcon className="w-4 h-4" />;
      case "duo":
        return <Users2Icon className="w-4 h-4" />;
      case "squad":
        return <UsersIcon className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={`/tournaments/${id}`} className="inline-flex items-center text-[#f34024] hover:text-[#f34024]/80 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Tournament
        </Link>

        {/* Tournament Header */}
        <div className="relative mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <img 
              src={tournament.bannerUrl || tournament.imageUrl || tournament.image || ""} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#19191d]/80 text-white text-sm font-semibold rounded">
                  {tournament.game}
                </span>
                <span className="px-3 py-1 bg-[#f34024] text-white text-sm font-semibold rounded">
                  {tournament.type}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded flex items-center gap-1">
                  {getTournamentTypeIcon(tournament.type)}
                  {tournament.type?.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tournament.name}</h1>
              <p className="text-lg text-gray-200">{tournament.description}</p>
            </div>
          </div>
        </div>

        {/* Registered Participants */}
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Registered Participants</h2>
              <div className="text-gray-400">
                {tournament.registeredTeams?.length || 0} participants
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(tournament.registeredTeams || []).map((team: any, index: number) => (
                <div key={team.id} className="bg-[#19191d] rounded-lg p-4 border border-[#292932] hover:border-[#f34024] transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <img 
                        src={team.avatar || "https://via.placeholder.com/40x40?text=P"} 
                        alt={team.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#f34024] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{team.name}</div>
                      <div className="text-gray-400 text-sm">
                        {team.type === 'player' ? 'Solo Player' : 'Team'}
                      </div>
                    </div>
                  </div>
                  
                  {team.members && team.members.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-gray-400 text-sm font-medium">Team Members:</div>
                      {team.members.map((member: any, memberIndex: number) => (
                        <div key={memberIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-6 h-6 bg-[#292932] rounded-full flex items-center justify-center">
                            <span className="text-[#f34024] text-xs font-bold">{memberIndex + 1}</span>
                          </div>
                          <span className="text-gray-300">{member.username || member.displayName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {team.registrationDate && (
                    <div className="mt-3 pt-3 border-t border-[#292932]">
                      <div className="text-gray-400 text-xs">
                        Registered: {new Date(team.registrationDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {(tournament.registeredTeams || []).length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No participants registered yet</h3>
                <p className="text-gray-400">Be the first to register for this tournament!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 