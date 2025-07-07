import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UsersIcon, CalendarIcon, TrendingUpIcon, StarIcon, ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { useToast } from "../../contexts/ToastContext";

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

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
        let teamData = null;
        if (user.teamId) {
          const teamRes: any = await apiFetch(`/teams/my`);
          setTeam(teamRes.data);
        } else {
          setTeam(null);
        }

        // Fetch upcoming tournaments (registered or available)
        const tournamentsRes: any = await apiFetch(`/tournaments?status=upcoming&playerId=${user.id}`);
        setUpcomingTournaments(tournamentsRes.data || []);

        // Fetch recent matches (from tournaments the player participated in)
        // This is a simplified example; you may want to aggregate from multiple tournaments
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
    await apiFetch(`/teams/invite/${inviteId}/accept`, { method: "POST" });
    setInvites((prev) => prev.map(i => i.id === inviteId ? { ...i, status: "accepted" } : i));
    addToast("Invite accepted!", "success");
  };
  const handleReject = async (inviteId: string) => {
    await apiFetch(`/teams/invite/${inviteId}/reject`, { method: "POST" });
    setInvites((prev) => prev.map(i => i.id === inviteId ? { ...i, status: "rejected" } : i));
    addToast("Invite rejected!", "success");
  };

  if (loading) return <div className="text-center text-white py-12">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  // Stats
  const stats = [
    { label: "Tournaments Joined", value: playerStats?.achievements?.length || 0, icon: TrophyIcon, color: "text-[#f34024]" },
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
              <Card key={index} className="bg-[#15151a] border-[#292932]">
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
            {/* Upcoming Tournaments */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming Tournaments</h2>
                  <Link to="/dashboard/tournaments" className="flex items-center text-[#f34024] hover:text-[#f34024]/80 text-sm">
                    View All <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingTournaments.length === 0 ? (
                    <div className="text-gray-400">No upcoming tournaments.</div>
                  ) : (
                    upcomingTournaments.map((tournament: any) => (
                      <div key={tournament.id} className="flex items-center justify-between p-4 bg-[#19191d] rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{tournament.name}</h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBA"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#f34024] font-bold text-sm mb-1">{tournament.prizePool ? `$${tournament.prizePool}` : "TBA"}</div>
                          <span className={`px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white`}>
                            {tournament.status}
                          </span>
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
                <h2 className="text-xl font-bold text-white mb-6">Recent Match History</h2>
                <div className="space-y-3">
                  {recentMatches.length === 0 ? (
                    <div className="text-gray-400">No recent matches.</div>
                  ) : (
                    recentMatches.map((match: any) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${match.status === "completed" && match.winnerId === team?.id ? "bg-green-500" : "bg-red-500"}`}></div>
                          <div>
                            <div className="text-white font-medium">Match {match.matchNumber}</div>
                            <div className="text-gray-400 text-sm">Round {match.round}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${match.status === "completed" && match.winnerId === team?.id ? "text-green-500" : "text-red-500"}`}>
                            {match.status === "completed" ? (match.winnerId === team?.id ? "Win" : "Loss") : match.status}
                          </div>
                          <div className="text-gray-400 text-sm">{match.score1} - {match.score2}</div>
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
            {/* Quick Actions */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/tournaments">
                    <Button className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white justify-start">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to={team ? "/dashboard/manage-team" : "/dashboard/create-team"}>
                    <Button variant="outline" className="w-full border-[#292932]  hover:bg-[#292932] hover:text-white justify-start">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {team ? "Manage Team" : "Create Team"}
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile">
                    <Button variant="outline" className="w-full border-[#292932]  hover:bg-[#292932] hover:text-white justify-start">
                      <StarIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
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
                      <li key={invite.id} className="flex items-center justify-between bg-[#19191d] rounded px-3 py-2">
                        <div>
                          <div className="text-white text-sm font-medium">Team: {invite.teamId}</div>
                          <div className="text-gray-400 text-xs">From: {invite.invitedBy}</div>
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

            {/* Team Overview */}
            {team && (
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">My Team</h3>
                    <Link to="/dashboard/manage-team" className="text-[#f34024] hover:text-[#f34024]/80 text-sm">
                      Manage
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white font-medium">{team.name}</div>
                    <div className="text-gray-400 text-sm">{team.bio}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      {team.members?.map((member: any) => (
                        <div key={member.userId} className="flex items-center space-x-1">
                          <span className="text-xs text-white">{member.role === "owner" ? "👑" : ""}{member.userId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};