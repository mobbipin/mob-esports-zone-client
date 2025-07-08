import React, { useEffect, useState } from "react";
import { CameraIcon, SaveIcon, UserIcon, GamepadIcon, MapPinIcon, TrophyIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";

export const ProfilePage: React.FC = () => {
  const { user, setUserData } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    gameUsername: user?.gameUsername || "",
    region: user?.region || "",
    bio: user?.bio || "",
    rank: user?.rank || ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiFetch<{ status: boolean; data: any }>(`/players/${user.id}`)
      .then(res => {
        setFormData({
          username: user.username,
          email: user.email,
          gameUsername: res.data.gameId || "",
          region: res.data.region || "",
          bio: res.data.bio || "",
          rank: res.data.rank || ""
        });
      })
      .catch(err => setError(typeof err === "string" ? err : "Failed to load profile"))
      .finally(async () => {
        // Always refresh user context on mount
        const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
        setUserData(me.data);
        setLoading(false);
      });
  }, [user?.id, user?.username, user?.email, setUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Update User table
      await apiFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: formData.email,
          displayName: formData.gameUsername,
          username: formData.username,
        }),
      });
      // Update PlayerProfile table
      await apiFetch(`/players/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          bio: formData.bio,
          region: formData.region,
          rank: formData.rank,
          gameId: formData.gameUsername,
        }),
      });
      // Refetch user
      const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
      setUserData(me.data);
      addToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (err: any) {
      // Show Zod validation errors as toast
      if (err?.issues && Array.isArray(err.issues) && err.issues.length > 0) {
        addToast(err.message || err.issues[0].message, "error");
      } else if (typeof err === "string") {
        addToast(err, "error");
      } else {
        addToast(err.message || "Failed to update profile", "error");
      }
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      gameUsername: user?.gameUsername || "",
      region: user?.region || "",
      bio: user?.bio || "",
      rank: user?.rank || ""
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/avatar", formData);
      setAvatarUrl(res.data.url);
      addToast("Avatar uploaded!", "success");
      // Update user profile with new avatar
      await apiFetch(`/players/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ avatar: res.data.url })
      });
      // Refetch user to update avatar in context
      const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
      setUserData(me.data);
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to upload avatar", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  const achievements = [
    { id: 1, title: "First Victory", description: "Won your first tournament", icon: "🏆", earned: true },
    { id: 2, title: "Team Player", description: "Joined a team", icon: "👥", earned: true },
    { id: 3, title: "Rising Star", description: "Won 3 tournaments in a month", icon: "⭐", earned: true },
    { id: 4, title: "Veteran", description: "Participated in 10+ tournaments", icon: "🎖️", earned: true },
    { id: 5, title: "Champion", description: "Win a major championship", icon: "👑", earned: false },
    { id: 6, title: "Legendary", description: "Reach top 10 global ranking", icon: "🔥", earned: false }
  ];

  const tournamentHistory = [
    { id: 1, name: "PUBG Mobile Championship", date: "Dec 2024", position: "2nd", prize: "$2,500" },
    { id: 2, name: "Free Fire Solo Tournament", date: "Nov 2024", position: "1st", prize: "$1,000" },
    { id: 3, name: "COD Mobile Duo", date: "Nov 2024", position: "3rd", prize: "$500" },
    { id: 4, name: "Valorant Team Cup", date: "Oct 2024", position: "1st", prize: "$3,000" },
    { id: 5, name: "Mobile Legends Tournament", date: "Oct 2024", position: "4th", prize: "$200" }
  ];

  const regions = ["NA", "EU", "ASIA", "OCE", "SA", "AF"];
  const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton height={300} />
          </div>
          <div>
            <Skeleton height={300} />
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your profile information and view your gaming achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSubmit}
                        className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                      >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        className="border-[#292932] hover:text-white hover:bg-[#292932]"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <img 
                      src={avatarUrl || user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"} 
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    {isEditing && (
                      <>
                        <label className="absolute bottom-0 right-0 w-6 h-6 bg-[#f34024] rounded-full flex items-center justify-center cursor-pointer">
                          <CameraIcon className="w-3 h-3 text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
                        </label>
                        {avatarUploading && <span className="absolute -bottom-6 right-0 text-xs text-yellow-500">Uploading...</span>}
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user?.username}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                    <p className="text-[#f34024] text-sm font-medium">{user?.rank || "Unranked"}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <UserIcon className="w-4 h-4 inline mr-2" />
                        Username
                      </label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <GamepadIcon className="w-4 h-4 inline mr-2" />
                        Game Username
                      </label>
                      <Input
                        name="gameUsername"
                        value={formData.gameUsername}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Your in-game name"
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <MapPinIcon className="w-4 h-4 inline mr-2" />
                        Region
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                      >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">
                        <TrophyIcon className="w-4 h-4 inline mr-2" />
                        Current Rank
                      </label>
                      <select
                        name="rank"
                        value={formData.rank}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                      >
                        <option value="">Select Rank</option>
                        {ranks.map(rank => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-3 rounded-lg text-center ${
                        achievement.earned 
                          ? "bg-[#f34024]/20 border border-[#f34024]/30" 
                          : "bg-[#19191d] border border-[#292932]"
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className={`text-xs font-medium ${
                        achievement.earned ? "text-white" : "text-gray-500"
                      }`}>
                        {achievement.title}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tournament History */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Tournaments</h3>
                <div className="space-y-3">
                  {tournamentHistory.slice(0, 5).map((tournament) => (
                    <div key={tournament.id} className="p-3 bg-[#19191d] rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-white text-sm font-medium">{tournament.name}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          tournament.position === "1st" ? "bg-yellow-600 text-white" :
                          tournament.position === "2nd" ? "bg-gray-400 text-white" :
                          tournament.position === "3rd" ? "bg-orange-600 text-white" :
                          "bg-[#292932] text-gray-300"
                        }`}>
                          {tournament.position}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400 text-xs">{tournament.date}</div>
                        <div className="text-[#f34024] text-xs font-bold">{tournament.prize}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-[#292932] hover:text-white hover:bg-[#292932]">
                  View All History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};