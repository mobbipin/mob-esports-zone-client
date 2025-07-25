import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UsersIcon, CalendarIcon, TrendingUpIcon, StarIcon, ArrowRightIcon, UserPlus, LogOutIcon, UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "../../components/ui/skeleton";

// Import CreateTeamDialog
import { CreateTeamDialog } from "./CreateTeamDialog";

export const ClientDashboard: React.FC = () => {
  const { user, setUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [registeredTournaments, setRegisteredTournaments] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch player profile/stats
        const playerRes: any = await apiFetch(`/players/${user.id}`);
        setPlayerStats(playerRes.data);

        // Fetch team info if user has a team
        if (user.teamId) {
          const teamRes: any = await apiFetch(`/teams/my`);
          setTeam(teamRes.data);
        } else {
          setTeam(null);
        }

        // Fetch registered tournaments
        const tournamentsRes: any = await apiFetch(`/tournaments?playerId=${user.id}`);
        setRegisteredTournaments(tournamentsRes.data || []);

        // Fetch recent matches (from tournaments the player participated in)
        let matches: any[] = [];
        if (tournamentsRes.data && tournamentsRes.data.length > 0) {
          for (const t of tournamentsRes.data) {
            const tDetail: any = await apiFetch(`/tournaments/${t.id}`);
            if (tDetail.data && tDetail.data.matches) {
              matches = matches.concat(tDetail.data.matches.filter((m: any) => m.team1Id === user.teamId || m.team2Id === user.teamId));
            }
          }
        }
        setRecentMatches(matches.slice(0, 5));

        // Fetch invites for the user
        if (user) {
          apiFetch(`/teams/invites/user`).then((res: any) => {
            setInvites(res.data || []);
          });
        }
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, user?.teamId]);

  const handleAccept = async (inviteId: string) => {
    await apiFetch(`/teams/invite/${inviteId}/accept`, { method: "POST" }, true, false, false);
    setInvites((prev) => prev.map(i => i.id === inviteId ? { ...i, status: "accepted" } : i));
    toast.success("Invite accepted!");
  };
  
  const handleReject = async (inviteId: string) => {
    await apiFetch(`/teams/invite/${inviteId}/reject`, { method: "POST" }, true, false, false);
    setInvites((prev) => prev.map(i => i.id === inviteId ? { ...i, status: "rejected" } : i));
    toast.success("Invite rejected!");
  };

  const handleWithdrawFromTournament = async (tournamentId: string) => {
    try {
      await apiFetch(`/tournaments/${tournamentId}/withdraw`, { method: "DELETE" }, true, false, false);
      setRegisteredTournaments(prev => prev.filter(t => t.id !== tournamentId));
      toast.success("Withdrawn from tournament successfully!");
    } catch (err: any) {
      const errorMessage = err?.error || err?.message || err?.toString() || "Failed to withdraw from tournament";
      toast.error(errorMessage);
    }
  };

  // Handle create team button click
  const handleCreateTeamClick = () => {
    if (!user?.emailVerified) {
      toast.error("Please verify your email before creating a team.");
      return;
    }
    setShowCreateTeamDialog(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    </div>
  );
  
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  // Stats
  const stats = [
    { label: "Tournaments Joined", value: registeredTournaments.length, icon: TrophyIcon, color: "text-[#f34024]" },
    { label: "Current Rank", value: playerStats?.rank || "Unranked", icon: StarIcon, color: "text-yellow-500" },
    { label: "Team Members", value: team ? `${team.members?.length || 1}/${team.maxMembers || "-"}` : "-", icon: UsersIcon, color: "text-blue-500" },
    { label: "Win Rate", value: playerStats?.winRate ? `${Math.round(playerStats.winRate * 100)}%` : "-", icon: TrendingUpIcon, color: "text-green-500" }
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
              <Card key={index} className="bg-[#15151a] border-[#292932] hover:border-[#f34024] transition-all duration-300 hover:shadow-lg hover:shadow-[#f34024]/10 transform hover:-translate-y-1" hover>
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
            {/* Registered Tournaments */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">My Tournaments</h2>
                  <Link to="/tournaments" className="flex items-center text-[#f34024] hover:text-[#f34024]/80 text-sm">
                    Browse All <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {registeredTournaments.length === 0 ? (
                    <div className="text-gray-400">You haven't registered for any tournaments yet.</div>
                  ) : (
                    registeredTournaments.map((tournament: any) => (
                      <div key={tournament.id} className="flex items-center justify-between p-4 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{tournament.name}</h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBA"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#f34024] font-bold text-sm mb-1">{tournament.prizePool ? `$${tournament.prizePool}` : "TBA"}</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white`}>
                              {tournament.status}
                            </span>
                            {/* Only show Withdraw if user is registered */}
                            {tournament.status === "registration" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                                onClick={() => handleWithdrawFromTournament(tournament.id)}
                              >
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Matches</h2>
                <div className="space-y-4">
                  {recentMatches.length === 0 ? (
                    <div className="text-gray-400">No recent matches found.</div>
                  ) : (
                    recentMatches.map((match: any) => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-[#19191d] rounded-lg hover:bg-[#292932] transition-colors">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">Match #{match.matchNumber}</h3>
                          <div className="text-gray-400 text-sm">
                            Round {match.round} • {match.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {match.score1} - {match.score2}
                          </div>
                                                     <div className="text-gray-400 text-sm">
                             {match.winnerId ? (match.winnerId === user?.teamId ? "Victory" : "Defeat") : "Pending"}
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Team Management */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">Team Management</h2>
                {team ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={team.logoUrl || "https://via.placeholder.com/40x40?text=T"} 
                        alt={team.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h3 className="text-white font-medium">{team.name}</h3>
                        <p className="text-gray-400 text-sm">[{team.tag}]</p>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {team.members?.length || 1} members
                    </div>
                    <Link to="/dashboard/manage-team">
                      <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                        Manage Team
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400 text-sm">
                      You're not part of a team yet.
                    </div>
                    <Button 
                      className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                      onClick={handleCreateTeamClick}
                    >
                      Create Team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Invites */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Pending Invites</h3>
                {invites.filter(i => i.status === 'pending').length === 0 ? (
                  <div className="text-gray-400 text-sm">No pending invites.</div>
                ) : (
                  <ul className="space-y-2">
                    {invites.filter(i => i.status === 'pending').map((invite) => (
                      <li key={invite.id} className="flex items-center justify-between bg-[#19191d] rounded px-3 py-2 hover:bg-[#292932] transition-colors">
                        <div>
                          <div className="text-white text-sm font-medium">Team: {invite.teamName || 'Unknown Team'}</div>
                          <div className="text-gray-400 text-xs">From: {invite.invitedByName || invite.invitedByEmail || 'Unknown User'}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAccept(invite.id)}>Accept</Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white" onClick={() => handleReject(invite.id)}>Reject</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/tournaments">
                    <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932]">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to="/friends">
                    <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932]">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Manage Friends
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile">
                    <Button variant="outline" className="w-full border-[#292932] hover:bg-[#292932]">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Team Dialog */}
      {showCreateTeamDialog && (
        <CreateTeamDialog
          open={showCreateTeamDialog}
          onClose={() => setShowCreateTeamDialog(false)}
          onTeamCreated={() => {
            setShowCreateTeamDialog(false);
            // Refresh user context to update teamId
            apiFetch("/auth/me").then((res: any) => {
              setUserData(res.data);
            });
          }}
        />
      )}
    </div>
  );
};