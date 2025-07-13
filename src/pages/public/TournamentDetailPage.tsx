import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarIcon, UsersIcon, TrophyIcon, MapPinIcon, ClockIcon, ArrowLeftIcon, UserIcon, Users2Icon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`)
      .then(res => setTournament(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load tournament"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.teamId && tournament?.type === 'squad') {
      // Fetch team members for player selection
      apiFetch<{ status: boolean; data: any }>(`/teams/${user.teamId}`)
        .then(res => setTeamMembers(res.data.members || []))
        .catch(err => console.error('Failed to load team members:', err));
    }
  }, [user?.teamId, tournament?.type]);

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

  const isRegistered = () => {
    if (!tournament || !user) return false;
    
    if (tournament.type === 'solo') {
      return tournament.registeredTeams?.some((team: any) => team.id === user.id);
    } else {
      return tournament.registeredTeams?.some((team: any) => team.id === user.teamId);
    }
  };

  // Team registration handler
  const handleRegisterTeam = async () => {
    if (!user || !id) return;
    
    if (tournament.type === 'solo') {
      // Solo tournament registration
      setRegistering(true);
      try {
        await apiFetch(`/tournaments/${id}/register`, {
          method: "POST",
          body: JSON.stringify({ userId: user.id })
        }, true, false, false);
        toast.success("Registered for tournament!");
        // Refetch tournament data
        const res = await apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`);
        setTournament(res.data);
      } catch (err: any) {
        const errorMessage = err?.error || err?.message || err?.toString() || "Failed to register";
        toast.error(errorMessage);
      } finally {
        setRegistering(false);
      }
    } else {
      // Team tournament - show player selection for squad
      if (tournament.type === 'squad' && user.teamId) {
        setShowPlayerSelection(true);
      } else {
        // Duo tournament or no team
        setRegistering(true);
        try {
          await apiFetch(`/tournaments/${id}/register`, {
            method: "POST",
            body: JSON.stringify({ teamId: user.teamId })
          }, true, false, false);
          toast.success("Team registered for tournament!");
          const res = await apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`);
          setTournament(res.data);
        } catch (err: any) {
          const errorMessage = err?.error || err?.message || err?.toString() || "Failed to register team";
          toast.error(errorMessage);
        } finally {
          setRegistering(false);
        }
      }
    }
  };

  const handleSquadRegistration = async () => {
    if (!user?.teamId || !id) return;
    
    setRegistering(true);
    try {
      await apiFetch(`/tournaments/${id}/register`, {
        method: "POST",
        body: JSON.stringify({ 
          teamId: user.teamId,
          selectedPlayers: selectedPlayers
        })
      }, true, false, false);
      toast.success("Team registered for tournament!");
      setShowPlayerSelection(false);
      setSelectedPlayers([]);
      // Refetch tournament data
      const res = await apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`);
      setTournament(res.data);
    } catch (err: any) {
      const errorMessage = err?.error || err?.message || err?.toString() || "Failed to register team";
      toast.error(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !id) return;
    
    setWithdrawing(true);
    try {
      await apiFetch(`/tournaments/${id}/withdraw`, {
        method: "DELETE"
      }, true, false, false);
      toast.success("Registration withdrawn successfully!");
      // Refetch tournament data
      const res = await apiFetch<{ status: boolean; data: any }>(`/tournaments/${id}`);
      setTournament(res.data);
    } catch (err: any) {
      const errorMessage = err?.error || err?.message || err?.toString() || "Failed to withdraw registration";
      toast.error(errorMessage);
    } finally {
      setWithdrawing(false);
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
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
                
                {/* Registration Status */}
                {isRegistered() ? (
                  <div className="space-y-3">
                    <Button disabled className="w-full bg-green-600 hover:bg-green-600 text-white mb-2">
                      ✓ Already Registered
                    </Button>
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={withdrawing}
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      {withdrawing ? "Withdrawing..." : "Withdraw Registration"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!user ? (
                      <div className="space-y-3">
                        <div className="text-gray-400 text-sm">Login to register for this tournament.</div>
                        <Button 
                          onClick={() => navigate('/login')}
                          className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                        >
                          Login to Register
                        </Button>
                      </div>
                    ) : user.role === 'admin' ? (
                      <div className="space-y-3">
                        <div className="text-gray-400 text-sm">Admins cannot register for tournaments.</div>
                        <Button 
                          onClick={() => navigate(`/admin/tournaments/${id}/view`)}
                          className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                        >
                          Manage Tournament
                        </Button>
                      </div>
                    ) : user.role === 'tournament_organizer' ? (
                      <div className="space-y-3">
                        <div className="text-gray-400 text-sm">Tournament organizers cannot register for tournaments.</div>
                        <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
                          Registration Disabled
                        </Button>
                      </div>
                    ) : tournament.type === 'solo' ? (
                      <Button 
                        onClick={handleRegisterTeam} 
                        disabled={registering || (tournament.participants || 0) >= (tournament.maxParticipants || 0)} 
                        className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                      >
                        {registering ? "Registering..." : 
                         (tournament.participants || 0) >= (tournament.maxParticipants || 0) ? "Tournament Full" : "Register as Solo Player"}
                      </Button>
                    ) : !user.teamId ? (
                      <div className="space-y-3">
                        <div className="text-gray-400 text-sm">You must be part of a team to register for this tournament.</div>
                        <Button 
                          onClick={() => {
                            if (!user?.emailVerified) {
                              toast.error('Please verify your email before creating a team.');
                              return;
                            }
                            navigate('/dashboard/create-team');
                          }}
                          className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                        >
                          Create/Join Team
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleRegisterTeam} 
                        disabled={registering || (tournament.participants || 0) >= (tournament.maxParticipants || 0)} 
                        className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                      >
                        {registering ? "Registering..." : 
                         (tournament.participants || 0) >= (tournament.maxParticipants || 0) ? "Tournament Full" : "Register Team"}
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="mb-4 mt-4">
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

                
              </CardContent>
            </Card>

            {/* Player Selection Modal for Squad Tournaments */}
            {showPlayerSelection && (
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Select Players</h3>
                  <div className="space-y-3 mb-4">
                    {teamMembers.map((member: any) => (
                      <div 
                        key={member.userId}
                        className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                          selectedPlayers.includes(member.userId) 
                            ? 'bg-[#f34024] border-[#f34024]' 
                            : 'bg-[#19191d] border-[#292932] hover:bg-[#292932]'
                        }`}
                        onClick={() => togglePlayerSelection(member.userId)}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{member.username || member.displayName}</div>
                          <div className="text-gray-400 text-sm">{member.role}</div>
                        </div>
                        {selectedPlayers.includes(member.userId) && (
                          <div className="text-white">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSquadRegistration}
                      disabled={registering || selectedPlayers.length === 0}
                      className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                    >
                      {registering ? "Registering..." : "Register Selected Players"}
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowPlayerSelection(false);
                        setSelectedPlayers([]);
                      }}
                      variant="outline"
                      className="border-[#292932] hover:bg-[#292932] hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                <h3 className="text-xl font-bold text-white mb-4">Registered Participants</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(tournament.registeredTeams || []).map((team: any) => (
                    <div key={team.id} className="flex items-center space-x-3 mb-2">
                      <img 
                        src={team.avatar} 
                        alt={team.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">{team.name}</span>
                        <div className="text-gray-400 text-xs">
                          {team.type === 'player' ? 'Solo Player' : 'Team'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(tournament.registeredTeams || []).length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No participants registered yet
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    onClick={() => navigate(`/tournaments/${id}/registered-teams`)}
                    variant="outline" 
                    className="border-[#292932] hover:bg-[#292932] text-sm"
                  >
                    View All Participants
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