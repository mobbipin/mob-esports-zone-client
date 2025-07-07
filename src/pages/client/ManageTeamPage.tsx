import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";

const PlayerProfileDialog = ({ open, onClose, player }: { open: boolean; onClose: () => void; player: any }) => {
  if (!player) return null;
  // Support both member and invite objects
  const p = player.playerProfile || player;
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
            <h3 className="text-lg font-bold text-white">{player.displayName || player.username || player.invitedEmail || player.userId}</h3>
            <p className="text-gray-400">{player.email || player.invitedEmail}</p>
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

export const ManageTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", tag: "", bio: "", region: "", logoUrl: "" });
  const [logoUploading, setLogoUploading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user?.teamId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res: any = await apiFetch(`/teams/my`);
        setTeam(res.data);
        setFormData({
          name: res.data.name || "",
          tag: res.data.tag || "",
          bio: res.data.bio || "",
          region: res.data.region || "",
          logoUrl: res.data.logoUrl || ""
        });
        // Fetch invites for this team
        const invitesRes: any = await apiFetch(`/teams/${res.data.id}/invites`);
        setInvites(invitesRes.data || []);
      } catch (err: any) {
        setError(err?.toString() || "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user?.teamId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/team-logo", form);
      setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
      addToast("Logo uploaded!", "success");
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to upload logo", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/teams/${team.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      addToast("Team updated!", "success");
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.toString() || "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !inviteEmail) return;
    setInviteLoading(true);
    try {
      await apiFetch(`/teams/${team.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ userEmail: inviteEmail })
      });
      addToast("Player invited!", "success");
      setInviteEmail("");
      // Refresh invites after successful invite
      const invitesRes: any = await apiFetch(`/teams/${team.id}/invites`);
      setInvites(invitesRes.data || []);
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to invite player", "error");
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white py-12">Loading team...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!user?.teamId) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">No Team Found</h1>
          <p className="text-gray-400 mb-8">You are not part of a team yet. Create a team to get started!</p>
          <Button 
            onClick={() => navigate("/dashboard/create-team")} 
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            Create Team
          </Button>
        </div>
      </div>
    );
  }
  if (!team) return <div className="text-center text-gray-400 py-12">You are not part of a team.</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Team</h1>
        <Card className="bg-[#15151a] border-[#292932] mb-8">
          <CardContent className="p-6">
            {!isEditing ? (
              <div>
                <div className="flex items-center space-x-6 mb-6">
                  <img src={team.logoUrl || "https://via.placeholder.com/100x100"} alt={team.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{team.name}</h2>
                    <p className="text-[#f34024] font-medium">[{team.tag}]</p>
                    <p className="text-gray-400">{team.bio}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400">Region: </span>
                  <span className="text-white font-medium">{team.region}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-400">Members: </span>
                  <span className="text-white font-medium">{team.members?.length || 1}</span>
                </div>
                <Button onClick={() => setIsEditing(true)} className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">Edit Team</Button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team Tag</label>
                  <Input name="tag" value={formData.tag} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Region</label>
                  <Input name="region" value={formData.region} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} required className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Team Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} disabled={logoUploading} className="text-white" />
                  {logoUploading && <span className="ml-2 text-yellow-500">Uploading...</span>}
                  {formData.logoUrl && <img src={formData.logoUrl} alt="Team Logo" className="w-16 h-16 mt-2 rounded" />}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-[#f34024] hover:bg-[#f34024]/90 text-white" disabled={loading}>Save</Button>
                  <Button type="button" variant="outline" className="border-[#292932]  hover:bg-[#292932]" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </form>
            )}
          </CardContent>
        </Card>
        {/* Invite Player */}
        {user?.id === team.ownerId && (
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Invite Player</h2>
              <form onSubmit={handleInvite} className="flex items-center space-x-2">
                <Input name="inviteEmail" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Player email" className="bg-[#19191d] border-[#292932] text-white" />
                <Button type="submit" variant="outline" disabled={inviteLoading || !inviteEmail}>Invite</Button>
              </form>
            </CardContent>
          </Card>
        )}
        {/* Transfer Ownership */}
        {user?.id === team.ownerId && team.members && team.members.length > 1 && (
          <Card className="bg-[#15151a] border-[#292932] mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Transfer Ownership</h2>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const form = e.target as any;
                  const newOwnerId = form.newOwnerId.value;
                  if (!newOwnerId) {
                    addToast("Please select a member to transfer ownership.", "error");
                    return;
                  }
                  try {
                    await apiFetch(`/teams/${team.id}/transfer-owner`, {
                      method: "POST",
                      body: JSON.stringify({ newOwnerId })
                    });
                    addToast("Ownership transferred!", "success");
                    // Refetch team data to update owner
                    const res: any = await apiFetch(`/teams/my`);
                    setTeam(res.data);
                  } catch (err: any) {
                    addToast(err.message || err?.toString() || "Failed to transfer ownership", "error");
                  }
                }}
                className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"
              >
                <select name="newOwnerId" className="bg-[#19191d] border-[#292932] text-white rounded px-3 py-2 min-w-[220px]" defaultValue="">
                  <option value="">Select member</option>
                  {team.members.filter((m: any) => m.userId !== user.id).map((m: any) => (
                    <option key={m.userId} value={m.userId}>
                      {m.displayName ? `${m.displayName} (${m.email})` : m.email}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="outline" className="bg-[#f34024] text-white border-none hover:bg-[#f34024]/90 transition">Transfer</Button>
              </form>
              <p className="text-gray-400 text-xs mt-2">You can transfer ownership to any existing team member. This action cannot be undone.</p>
            </CardContent>
          </Card>
        )}
        {/* Members List */}
        <Card className="bg-[#15151a] border-[#292932] mt-8">
          <CardContent className="p-6">
            <h3 className="text-md font-semibold text-white mb-2">Team Members</h3>
            {team.members && team.members.length > 0 ? (
              <ul className="space-y-2">
                {team.members.map((member: any) => (
                  <li key={member.userId} className="flex items-center justify-between bg-[#19191d] rounded px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium">{member.displayName || member.userId}</span>
                      <span className="text-gray-400 text-xs">{member.role}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-[#f34024] text-[#f34024] hover:text-white hover:bg-[#f34024]/10" onClick={() => { setSelectedProfile(member); setProfileDialogOpen(true); }}>View Profile</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No members found.</div>
            )}
          </CardContent>
        </Card>
        {/* Invited Players List */}
        <Card className="bg-[#15151a] border-[#292932] mt-8">
          <CardContent className="p-6">
            <h3 className="text-md font-semibold text-white mb-2">Invited Players</h3>
            {invites.length === 0 ? (
              <div className="text-gray-400 text-sm">No invites sent yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="text-gray-400 font-medium pb-2">Email</th>
                    <th className="text-gray-400 font-medium pb-2">Status</th>
                    <th className="text-gray-400 font-medium pb-2">Invited At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="text-white py-1">{invite.invitedEmail}</td>
                      <td className="text-white py-1">
                        {invite.status === 'pending' && <span className="text-yellow-400">Pending</span>}
                        {invite.status === 'accepted' && <span className="text-green-400">Accepted</span>}
                        {invite.status === 'rejected' && <span className="text-red-400">Rejected</span>}
                      </td>
                      <td className="text-gray-400 py-1">{new Date(invite.createdAt).toLocaleString()}</td>
                      <td>
                        <Button size="sm" variant="outline" className="border-[#f34024] text-[#f34024] hover:text-white hover:bg-[#f34024]/10" onClick={() => { setSelectedProfile(invite); setProfileDialogOpen(true); }}>View Profile</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      <PlayerProfileDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} player={selectedProfile} />
    </div>
  );
}; 