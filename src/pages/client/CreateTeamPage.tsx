import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch, apiUpload } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";
import { validateRequired } from "../../lib/utils";

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    bio: "",
    region: "",
    logoUrl: ""
  });
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <Skeleton height={300} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
      </div>
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      console.log('Uploading team logo:', file.name, file.size, file.type);
      const form = new FormData();
      form.append("logo", file);
      console.log('FormData created, sending to team-logo API...');
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/team-logo", form, false); // Don't show error toast here
      console.log('Team logo upload response:', res);
      setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
      toast.success("Logo uploaded!");
    } catch (err: any) {
      console.error('Team logo upload error:', err);
      toast.error(err.message || err?.toString() || "Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!validateRequired(formData.name, "Team name")) return;
    if (!validateRequired(formData.bio, "Team description")) return;
    if (!validateRequired(formData.region, "Region")) return;
    
    setLoading(true);
    setError(null);
    try {
      const { logoUrl, ...restFormData } = formData;
      const payload = {
        ...restFormData,
        ...(logoUrl && logoUrl.trim() !== '' ? { logoUrl } : {})
      };
      const res = await apiFetch<{ status: boolean; data: { id: string } }>("/teams", {
        method: "POST",
        body: JSON.stringify(payload)
      }, true, false); // Don't show error toast here
      toast.success("Team created!");
      // Always refresh user data after team creation
      const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
      setUserData(me.data);
      navigate("/dashboard/manage-team");
    } catch (err: any) {
      setError(err?.toString() || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Create a Team</h1>
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Team Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Enter team name" className="bg-[#19191d] border-[#292932] text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Team Tag</label>
                <Input name="tag" value={formData.tag} onChange={handleChange} required placeholder="Enter team tag (short)" className="bg-[#19191d] border-[#292932] text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Region</label>
                <Input name="region" value={formData.region} onChange={handleChange} required placeholder="Enter region" className="bg-[#19191d] border-[#292932] text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Team Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} required placeholder="Describe your team" className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Team Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoChange} disabled={logoUploading} className="text-white" />
                {logoUploading && <span className="ml-2 text-yellow-500">Uploading...</span>}
                {formData.logoUrl && <img src={formData.logoUrl} alt="Team Logo" className="w-16 h-16 mt-2 rounded" />}
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 