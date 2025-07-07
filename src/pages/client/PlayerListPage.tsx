import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { Card, CardContent, Dialog, DialogContent, DialogTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

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
  const { addToast } = useToast();
  const [myTeam, setMyTeam] = useState<any>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res: any = await apiFetch("/players");
        setPlayers(res.data || []);
      } catch {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchMyTeam = async () => {
      if (!user?.teamId) return;
      try {
        const res: any = await apiFetch(`/teams/my`);
        setMyTeam(res.data);
      } catch {
        setMyTeam(null);
      }
    };
    fetchMyTeam();
  }, [user?.teamId]);

  const isOwner = myTeam && myTeam.ownerId === user?.id;

  const handleInvite = async (player: any) => {
    if (!myTeam || !isOwner) return;
    try {
      await apiFetch(`/teams/${myTeam.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ userEmail: player.email })
      });
      addToast("Invite sent!", "success");
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to send invite", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Players</h1>
        {loading ? (
          <div className="text-center text-white py-12">Loading players...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {players.map((player) => (
              <Card key={player.id} className="bg-[#15151a] border-[#292932] hover:shadow-lg transition">
                <CardContent className="flex flex-col items-center p-6">
                  <img
                    src={player.playerProfile?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#f34024] mb-2"
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{player.displayName || player.username}</h3>
                  <p className="text-gray-400 mb-1">{player.teamName || "No Team"}</p>
                  <div className="flex flex-col space-y-2 w-full items-center">
                    <Button
                      variant="outline"
                      className="bg-[#f34024] text-white border-none hover:bg-[#f34024]/90 transition w-full"
                      onClick={() => { setSelectedPlayer(player); setDialogOpen(true); }}
                    >
                      View Profile
                    </Button>
                    {isOwner && !player.teamName && player.id !== user?.id && (
                      <Button
                        variant="outline"
                        className="border-[#f34024] text-[#f34024] hover:bg-[#f34024]/10 hover:text-white transition w-full"
                        onClick={() => handleInvite(player)}
                      >
                        Invite to Team
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <PlayerProfileDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          player={selectedPlayer}
        />
      </div>
    </div>
  );
};

export default PlayerListPage; 