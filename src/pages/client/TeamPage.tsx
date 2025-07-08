import React, { useEffect, useState } from "react";
import { PlusIcon, UserPlusIcon, CrownIcon, SettingsIcon, MessageCircleIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";

export const TeamPage: React.FC = () => {
  const { user, setUserData } = useAuth();
  const { addToast } = useToast();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    bio: "",
    region: "",
    logoUrl: ""
  });

  useEffect(() => {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/teams/my`)
      .then(res => setTeam(res.data))
      .catch(err => setError(typeof err === "string" ? err : "Failed to load team"))
      .finally(async () => {
        // Always refresh user context on mount
        const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
        setUserData(me.data);
        setLoading(false);
      });
  }, [user?.teamId, setUserData]);

  // Add a function to refresh team info after actions
  const refreshTeam = async () => {
    if (!user?.teamId) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ status: boolean; data: any }>(`/teams/my`);
      setTeam(res.data);
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  // Create team
  const handleCreateTeam = async () => {
    try {
      const { logoUrl, ...restFormData } = formData;
      const payload = {
        ...restFormData,
        ...(logoUrl && logoUrl.trim() !== '' ? { logoUrl } : {})
      };
      const res = await apiFetch<{ status: boolean; data: { id: string } }>("/teams", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      addToast("Team created!", "success");
      refreshTeam(); // Call refreshTeam after successful creation
      // Optionally refetch or redirect
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to create team", "error");
    }
  };

  // Update team
  const handleUpdateTeam = async () => {
    if (!team) return;
    try {
      await apiFetch(`/teams/${team.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      addToast("Team updated!", "success");
      refreshTeam(); // Call refreshTeam after successful update
      setIsEditing(false);
      // Optionally refetch
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to update team", "error");
    }
  };

  // Delete team
  const handleDeleteTeam = async () => {
    if (!team) return;
    try {
      await apiFetch(`/teams/${team.id}`, { method: "DELETE" });
      addToast("Team deleted!", "success");
      refreshTeam(); // Call refreshTeam after successful deletion
      // Optionally refetch or redirect
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to delete team", "error");
    }
  };

  // Invite player
  const handleInvitePlayer = async (email: string) => {
    if (!team) return;
    try {
      await apiFetch(`/teams/${team.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ userEmail: email }),
      });
      addToast("Player invited!", "success");
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to invite player", "error");
    }
  };

  // Logo upload
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !team) return;
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/team-logo", formData);
      setLogoUrl(res.data.url);
      addToast("Logo uploaded!", "success");
      await apiFetch(`/teams/${team.id}`, {
        method: "PUT",
        body: JSON.stringify({ logoUrl: res.data.url })
      });
      refreshTeam(); // Call refreshTeam after successful logo upload
      // Optionally refetch
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to upload logo", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="flex items-center space-x-6 mb-8">
          <Skeleton height={64} width={64} className="rounded-lg" />
          <div className="flex-1">
            <Skeleton height={32} width={200} className="mb-2" />
            <Skeleton height={20} width={100} />
          </div>
        </div>
        <Skeleton height={200} />
      </div>
    </div>
  );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user?.teamId) return <div className="text-center text-gray-400">You are not part of a team.</div>;
  if (!team) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img 
                  src={logoUrl || team.logoUrl || team.logo || ""} 
                  alt={team.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                {/* Logo upload button for owner/captain */}
                {user?.id === team.ownerId && (
                  <label className="absolute bottom-0 right-0 w-6 h-6 bg-[#f34024] rounded-full flex items-center justify-center cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={logoUploading} />
                    <span className="text-white text-xs">Logo</span>
                  </label>
                )}
                {logoUploading && <span className="absolute -bottom-6 right-0 text-xs text-yellow-500">Uploading...</span>}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                <p className="text-[#f34024] font-medium">[{team.tag}]</p>
                <p className="text-gray-400">{team.bio || team.description}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {user?.id === team.ownerId && (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline">Edit</Button>
                  <Button onClick={handleDeleteTeam} variant="destructive">Delete</Button>
                </>
              )}
              {/* Invite player UI */}
              {user?.id === team.ownerId && (
                <form onSubmit={e => { e.preventDefault(); const email = (e.target as any).inviteEmail.value; handleInvitePlayer(email); }} className="flex items-center space-x-2">
                  <Input name="inviteEmail" placeholder="Player email" className="bg-[#19191d] border-[#292932] text-white" />
                  <Button type="submit" variant="outline">Invite</Button>
                </form>
              )}
            </div>
          </div>
        </div>
        {/* ...rest of the UI, use team fields as needed... */}
      </div>
    </div>
  );
};