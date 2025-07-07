import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";

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
      addToast(err?.toString() || "Failed to upload logo", "error");
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
      addToast(err?.toString() || "Failed to invite player", "error");
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
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold  mb-4">Invite Player</h2>
            <form onSubmit={handleInvite} className="flex items-center space-x-2">
              <Input name="inviteEmail" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Player email" className="bg-[#19191d] border-[#292932] text-white" />
              <Button type="submit" variant="outline" disabled={inviteLoading || !inviteEmail}>Invite</Button>
            </form>
            {/* Invited Players List */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-white mb-2">Invited Players</h3>
              {invites.length === 0 ? (
                <div className="text-gray-400 text-sm">No invites sent yet.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="text-gray-400 font-medium pb-2">Email</th>
                      <th className="text-gray-400 font-medium pb-2">Status</th>
                      <th className="text-gray-400 font-medium pb-2">Invited At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((invite) => (
                      <tr key={invite.id}>
                        <td className="text-white py-1">{invite.invitedEmail}</td>
                        <td className="py-1">
                          {invite.status === 'pending' && <span className="text-yellow-400">Pending</span>}
                          {invite.status === 'accepted' && <span className="text-green-400">Accepted</span>}
                          {invite.status === 'rejected' && <span className="text-red-400">Rejected</span>}
                        </td>
                        <td className="text-gray-400 py-1">{new Date(invite.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 