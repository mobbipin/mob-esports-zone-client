import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { Card, CardContent, Dialog, DialogContent, DialogTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";
import { UserPlus, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";

const PlayerProfileDialog = ({ open, onClose, player }: { open: boolean; onClose: () => void; player: any }) => {
  if (!player) return null;
  const p = player.playerProfile || {};
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogTitle>Player Profile</DialogTitle>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={p.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#f34024]"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{player.displayName || player.username}</h3>
            <p className="text-gray-400">{player.email}</p>
            <p className="text-[#f34024] text-sm font-medium">{p.rank || "Unranked"}</p>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-gray-400">Game ID: </span>
          <span className="text-white font-medium">{p.gameId || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-400">Bio: </span>
          <span className="text-white font-medium">{p.bio || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-400">Win Rate: </span>
          <span className="text-white font-medium">{p.winRate != null ? `${p.winRate}%` : "-"}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-400">Kills: </span>
          <span className="text-white font-medium">{p.kills ?? "-"}</span>
        </div>
        {p.social && (
          <div className="mb-2">
            <span className="text-gray-400">Social: </span>
            <span className="text-white font-medium">
              {p.social.twitch && <a href={p.social.twitch} target="_blank" rel="noopener noreferrer" className="text-[#9147ff] underline mr-2">Twitch</a>}
              {p.social.discord && <span className="text-[#5865F2]">{p.social.discord}</span>}
            </span>
          </div>
        )}
        {p.achievements && p.achievements.length > 0 && (
          <div className="mb-2">
            <span className="text-gray-400">Achievements: </span>
            <ul className="list-disc list-inside text-white">
              {p.achievements.map((ach: string, idx: number) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const PlayerListPage: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const [myTeam, setMyTeam] = useState<any>(null);
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        let query = `/players?page=${page}&limit=${limit}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        const res: any = await apiFetch(query);
        setPlayers(Array.isArray(res.data) ? res.data : []);
        setTotal(res.total || (Array.isArray(res.data) ? res.data.length : 0));
      } catch {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [page, search]);

  useEffect(() => {
    // Fetch friend requests for current user
    const fetchRequests = async () => {
      try {
        const res = await apiFetch<any>("/friends");
        setFriendRequests(res.data || []);
      } catch {
        setFriendRequests([]);
      }
    };
    if (user) {
      fetchRequests();
    }
  }, [user?.id]);

  // Only fetch myTeam if user is logged in
  useEffect(() => {
    if (!user?.teamId) return;
    const fetchMyTeam = async () => {
      try {
        const res: any = await apiFetch(`/teams/my`);
        setMyTeam(res.data);
      } catch {
        setMyTeam(null);
      }
    };
    fetchMyTeam();
  }, [user?.teamId]);

  const isOwner = user && myTeam && myTeam.ownerId === user.id;

  const handleInvite = async (player: any) => {
    if (!myTeam || !isOwner) return;
    try {
      await apiFetch(`/teams/${myTeam.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ userEmail: player.email })
      }, true, false, false);
      toast.success("Invite sent!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to send invite");
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return;
    try {
      await apiFetch("/friends/request", { method: "POST", body: JSON.stringify({ receiverId }) }, true, false, false);
      toast.success("Friend request sent");
      setFriendRequests((prev) => [...prev, { receiverId, userId: user.id, status: 'pending' }]);
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    }
  };

  const cancelFriendRequest = async (friendId: string) => {
    const req = friendRequests.find((f) => (f.friendId === friendId || f.userId === friendId) && f.status === "pending");
    if (!req) return;
    try {
      await apiFetch(`/friends/${req.id}/cancel`, { method: "DELETE" }, true, false, false);
      toast.success("Friend request canceled");
      setFriendRequests((prev) => prev.filter((f) => f.id !== req.id));
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel request");
    }
  };
  const getFriendStatus = (playerId: string) => {
    if (!user) return "none";
    const req = friendRequests.find((f) => (f.friendId === playerId || f.userId === playerId));
    if (!req) return "none";
    if (req.status === "accepted") return "friends";
    if (req.status === "pending") return req.userId === user.id ? "requested" : "incoming";
    return "none";
  };

  const getPlayerInfo = (playerId: string) => players.find((p) => p.id === playerId);

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        {[...Array(10)].map((_, i) => <Skeleton key={i} height={60} className="mb-4" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Players</h1>
        <div className="flex items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-80"
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-[#15151a] border border-[#292932]">
            <thead>
              <tr>
                <th className="p-4 text-left text-white font-semibold">Avatar</th>
                <th className="p-4 text-left text-white font-semibold">Username</th>
                <th className="p-4 text-left text-white font-semibold">Team</th>
                <th className="p-4 text-left text-white font-semibold">Rank</th>
                <th className="p-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-[#292932] hover:bg-[#19191d]">
                  <td className="p-4">
                    <img
                      src={player.playerProfile?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#f34024]"
                    />
                  </td>
                  <td className="p-4 text-white font-medium">{player.displayName || player.username}</td>
                  <td className="p-4 text-gray-400">{player.teamName || "No Team"}</td>
                  <td className="p-4 text-gray-400">{player.playerProfile?.rank || "Unranked"}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        onClick={() => { setSelectedPlayer(player); setDialogOpen(true); }}
                      >
                        View
                      </Button>
                      {user && player.id !== user.id && !player.banned && (
                        <>
                          {(getFriendStatus(player.id) === "friends" || (player.isPublic !== 0 && getFriendStatus(player.id) !== "incoming")) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                              onClick={() => navigate(`/messages?user=${player.id}&name=${encodeURIComponent(player.displayName || player.username)}&avatar=${encodeURIComponent(player.avatar || player.playerProfile?.avatar || '')}`)}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          )}
                          {getFriendStatus(player.id) === "none" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                              onClick={() => sendFriendRequest(player.id)}
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add Friend
                            </Button>
                          )}
                          {getFriendStatus(player.id) === "requested" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                              onClick={() => cancelFriendRequest(player.id)}
                            >
                              Cancel Request
                            </Button>
                          )}
                          {getFriendStatus(player.id) === "friends" && (
                            <span className="inline-block px-3 py-1 rounded bg-green-700 text-white text-xs font-semibold">Friends</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-gray-400 text-sm">
            Showing {players.length} of {total} players
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#292932] hover:text-white hover:bg-[#292932]"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="border-[#292932] hover:text-white hover:bg-[#292932]"
              onClick={() => setPage((p) => p + 1)}
              disabled={players.length < limit}
            >
              Next
            </Button>
          </div>
        </div>
        <PlayerProfileDialog open={dialogOpen} onClose={() => setDialogOpen(false)} player={selectedPlayer} />
      </div>
    </div>
  );
};

export default PlayerListPage; 