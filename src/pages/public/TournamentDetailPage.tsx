import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, MapPinIcon, ClockIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

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

  // Team registration handler
  const handleRegisterTeam = async () => {
    if (!user?.teamId || !id) return;
    setRegistering(true);
    try {
      await apiFetch(`/tournaments/${id}/register`, {
        method: "POST",
        body: JSON.stringify({ teamId: user.teamId })
      });
      addToast("Team registered for tournament!", "success");
      // Refetch tournament data to update participants count
      const res = await apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`);
      setTournament(res.data);
    } catch (err: any) {
      const errorMessage = err?.error || err?.message || err?.toString() || "Failed to register team";
      addToast(errorMessage, "error");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="text-center text-white">Loading tournament...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/tournaments" className="inline-flex items-center text-[#f34024] hover:text-[#f34024]/80 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Tournaments
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
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tournament.name}</h1>
              <p className="text-lg text-gray-200">{tournament.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tournament Info */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <CalendarIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-sm text-gray-400">{tournament.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <ClockIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Start Time</div>
                        <div className="text-sm text-gray-400">{tournament.startTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <UsersIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Participants</div>
                        <div className="text-sm text-gray-400">{tournament.participants || 0}/{tournament.maxParticipants || 0}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <TrophyIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Prize Pool</div>
                        <div className="text-sm text-gray-400">{tournament.prize}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPinIcon className="w-5 h-5 mr-3 text-[#f34024]" />
                      <div>
                        <div className="font-medium">Region</div>
                        <div className="text-sm text-gray-400">{tournament.region}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <div className="w-5 h-5 mr-3 bg-[#f34024] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <div>
                        <div className="font-medium">Platform</div>
                        <div className="text-sm text-gray-400">{tournament.platform}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[#292932] pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">About This Tournament</h3>
                  <p className="text-gray-300 leading-relaxed">{tournament.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Rules</h2>
                <ul className="space-y-3">
                  {(tournament.rules || []).map((rule: any, index: number) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <span className="w-6 h-6 bg-[#f34024] text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament Schedule</h2>
                <div className="space-y-4">
                  {(tournament.schedule || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center p-4 bg-[#19191d] rounded-lg">
                      <div className="text-center mr-4">
                        <div className="text-[#f34024] font-bold text-sm">{item.date}</div>
                        <div className="text-gray-400 text-xs">{item.time}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Registration */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registration</h3>
                {/* Registration Button */}
                {user ? (
                  user.teamId ? (
                    tournament.registeredTeams?.some((team: any) => team.id === user.teamId) ? (
                      <Button disabled className="w-full bg-green-600 hover:bg-green-600 text-white mb-2">
                        ✓ Already Registered
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleRegisterTeam} 
                        disabled={registering || (tournament.participants || 0) >= (tournament.maxParticipants || 0)} 
                        className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white mb-2"
                      >
                        {registering ? "Registering..." : 
                         (tournament.participants || 0) >= (tournament.maxParticipants || 0) ? "Tournament Full" : "Register Team"}
                      </Button>
                    )
                  ) : (
                    <div className="text-gray-400 mb-2">You must be part of a team to register.</div>
                  )
                ) : (
                  <div className="text-gray-400 mb-2">Login to register your team.</div>
                )}
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Spots Filled</span>
                    <span>{tournament.participants || 0}/{tournament.maxParticipants || 0}</span>
                  </div>
                  <div className="w-full bg-[#292932] rounded-full h-2">
                    <div 
                      className="bg-[#f34024] h-2 rounded-full"
                      style={{ width: `${((tournament.participants || 0) / (tournament.maxParticipants || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-[#292932 hover:bg-[#292932] hover:text-white">
                    Join Discord
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Prize Distribution */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Prize Distribution</h3>
                <div className="space-y-3">
                  {(tournament.prizes || []).map((prize: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{prize.position}</span>
                      <span className="text-[#f34024] font-bold">{prize.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Registered Teams */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registered Teams</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(tournament.registeredTeams || []).map((team: any) => (
                    <div key={team.id} className="flex items-center space-x-3 mb-2">
                      <img 
                        src={team.avatar} 
                        alt={team.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{team.name}</span>
                    </div>
                  ))}
                  {(tournament.registeredTeams || []).length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No teams registered yet
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-[#292932]  hover:bg-[#292932] text-sm">
                    View All Teams
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};