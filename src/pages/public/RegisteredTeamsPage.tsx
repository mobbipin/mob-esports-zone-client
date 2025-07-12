import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, UsersIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

export const RegisteredTeamsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Fetch tournament details
    apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`)
      .then(res => setTournament(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load tournament"));
    
    // Fetch registered teams
    apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}/registered-teams`)
      .then(res => setRegisteredTeams(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load registered teams"))
      .finally(() => setLoading(false));
  }, [id]);

  const getTournamentTypeIcon = (type: string) => {
    switch (type) {
      case "solo":
        return <UserIcon className="w-4 h-4" />;
      case "duo":
        return <UsersIcon className="w-4 h-4" />;
      case "squad":
        return <UsersIcon className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-6" />
        <Skeleton height={60} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={120} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    </div>
  );

  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={`/tournaments/${id}`} className="inline-flex items-center text-[#f34024] hover:text-[#f34024]/80 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Tournament
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Registered Participants
          </h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-2">
              {getTournamentTypeIcon(tournament.type)}
              {tournament.type?.toUpperCase()} Tournament
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {tournament.date}
            </span>
            <span>
              {registeredTeams.length} / {tournament.maxParticipants} participants
            </span>
          </div>
        </div>

        {/* Registered Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredTeams.map((team: any, index: number) => (
            <Card key={team.id} className="bg-[#15151a] border-[#292932] hover:border-[#f34024]/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={team.avatar} 
                    alt={team.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{team.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        team.type === 'player' ? 'bg-blue-600' : 'bg-green-600'
                      } text-white`}>
                        {team.type === 'player' ? 'Solo Player' : 'Team'}
                      </span>
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Registered:</span>
                    <span>{new Date(team.registeredAt).toLocaleDateString()}</span>
                  </div>
                  
                  {team.registeredPlayers && team.registeredPlayers.length > 0 && (
                    <div className="mt-4">
                      <div className="text-gray-400 mb-2">Selected Players:</div>
                      <div className="space-y-1">
                        {team.registeredPlayers.map((playerId: string) => (
                          <div key={playerId} className="text-xs text-gray-300 bg-[#19191d] px-2 py-1 rounded">
                            Player ID: {playerId}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {registeredTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No participants registered yet</div>
            <p className="text-gray-500">Be the first to register for this tournament!</p>
          </div>
        )}

        {/* Tournament Info Footer */}
        <div className="mt-12">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Tournament Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Tournament Type</div>
                  <div className="text-white font-medium">{tournament.type?.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Prize Pool</div>
                  <div className="text-white font-medium">{tournament.prize}</div>
                </div>
                <div>
                  <div className="text-gray-400">Registration Status</div>
                  <div className="text-white font-medium">
                    {registeredTeams.length} / {tournament.maxParticipants} filled
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 