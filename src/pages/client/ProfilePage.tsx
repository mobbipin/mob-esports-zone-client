import React, { useEffect, useState } from "react";
import { CameraIcon, SaveIcon, UserIcon, GamepadIcon, MapPinIcon, TrophyIcon, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { apiFetch, apiUpload } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  validateRequired, 
  validateEmail, 
  validateMinLength, 
  validateMaxLength 
} from "../../lib/utils";

export const ProfilePage: React.FC = () => {
  const { user, setUserData, logout } = useAuth();
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>({});
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState<any[]>([]);
  const [tournamentHistory, setTournamentHistory] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

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
      .catch(err => {
        const errorMessage = typeof err === "string" ? err : "Failed to load profile";
        setError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    // Fetch achievements from user.playerProfile
    if (user.playerProfile && Array.isArray(user.playerProfile.achievements)) {
      setAchievements(user.playerProfile.achievements);
    } else {
      setAchievements([]);
    }
    // Fetch tournament history from API
    apiFetch<{ status: boolean; data: any[] }>(`/players/${user.id}/tournaments`)
      .then(res => setTournamentHistory(res.data))
      .catch(() => setTournamentHistory([]));
  }, [user?.id, user?.playerProfile]);

  // Individual field validation functions
  const validateUsername = (value: string): string => {
    if (!value.trim()) return "";
    if (value.length < 2) return "Username must be at least 2 characters long";
    if (value.length > 32) return "Username must be no more than 32 characters long";
    return "";
  };

  const validateEmailField = (value: string): string => {
    if (!value.trim()) return "";
    if (!validateEmail(value)) return "Please enter a valid email address";
    return "";
  };

  const validateGameUsername = (value: string): string => {
    if (!value.trim()) return "";
    if (value.length < 2) return "Game username must be at least 2 characters long";
    if (value.length > 64) return "Game username must be no more than 64 characters long";
    return "";
  };

  const validateBio = (value: string): string => {
    if (!value.trim()) return "";
    if (value.length > 500) return "Bio must be no more than 500 characters long";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Real-time validation
    let errorMessage = "";
    switch (name) {
      case "username":
        errorMessage = validateUsername(value);
        break;
      case "email":
        errorMessage = validateEmailField(value);
        break;
      case "gameUsername":
        errorMessage = validateGameUsername(value);
        break;
      case "bio":
        errorMessage = validateBio(value);
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched on blur
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    let errorMessage = "";
    switch (name) {
      case "username":
        errorMessage = validateUsername(value);
        break;
      case "email":
        errorMessage = validateEmailField(value);
        break;
      case "gameUsername":
        errorMessage = validateGameUsername(value);
        break;
      case "bio":
        errorMessage = validateBio(value);
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Client-side validation that matches backend requirements
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Username validation (backend: min(2).max(32))
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    // Email validation (backend: email())
    const emailError = validateEmailField(formData.email);
    if (emailError) errors.email = emailError;

    // Game username validation (backend: min(2).max(64) for displayName)
    const gameUsernameError = validateGameUsername(formData.gameUsername);
    if (gameUsernameError) errors.gameUsername = gameUsernameError;

    // Bio validation (optional but if provided, should be reasonable length)
    const bioError = validateBio(formData.bio);
    if (bioError) errors.bio = bioError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Clear previous errors
    setError(null);

    // Mark all fields as touched for validation display
    setFieldTouched({
      username: true,
      email: true,
      gameUsername: true,
      region: true,
      bio: true,
      rank: true
    });

    // Client-side validation
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      // Update User table
      await apiFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: formData.email,
          displayName: user.role === 'player' ? formData.gameUsername : undefined,
          username: formData.username,
        }),
      }, true, false, false); // Don't show error toast here
      
      // Update PlayerProfile table only for players
      if (user.role === 'player') {
        await apiFetch(`/players/${user.id}`, {
          method: "PUT",
          body: JSON.stringify({
            bio: formData.bio,
            region: formData.region,
            rank: formData.rank,
            gameId: formData.gameUsername,
          }),
        }, true, false, false); // Don't show error toast here
      } else {
        // For organizers and admins, only update bio in user table
        await apiFetch(`/users/${user.id}`, {
          method: "PUT",
          body: JSON.stringify({
            displayName: formData.bio, // Use displayName for bio for non-players
          }),
        }, true, false, false);
      }
      
      // Refetch user
      const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
      setUserData(me.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      // Handle validation errors from backend
      if (err?.issues && Array.isArray(err.issues) && err.issues.length > 0) {
        const backendErrors: { [key: string]: string } = {};
        err.issues.forEach((issue: any) => {
          const field = issue.path[0];
          // Map backend field names to frontend field names
          const fieldMap: { [key: string]: string } = {
            displayName: 'gameUsername',
            username: 'username',
            email: 'email'
          };
          const frontendField = fieldMap[field] || field;
          backendErrors[frontendField] = issue.message;
        });
        setFieldErrors(backendErrors);
        toast.error("Please fix the validation errors");
      } else if (err?.fieldErrors) {
        // Handle field-specific errors
        setFieldErrors(err.fieldErrors);
        toast.error("Please fix the validation errors");
      } else {
        // Handle general errors
        const errorMessage = typeof err === "string" ? err : err.message || "Failed to update profile";
        setError(errorMessage);
        toast.error(errorMessage);
      }
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
    setFieldErrors({});
    setFieldTouched({});
    setError(null);
    setIsEditing(false);
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await apiFetch('/auth/resend-verification-user', {
        method: 'POST'
      }, true, false, false);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Failed to send verification email';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/avatar", formData, false, false); // Don't show error toast here
      setAvatarUrl(res.data.url);
      toast.success("Avatar uploaded!");
      // Update user profile with new avatar
      await apiFetch(`/players/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ avatar: res.data.url })
      }, true, false, false); // Don't show error toast here
      // Refetch user to update avatar in context
      const me = await apiFetch<{ status: boolean; data: any }>("/auth/me");
      setUserData(me.data);
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />
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
                        disabled={loading}
                        className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                      >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save"}
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
                    
                    {/* Email Verification Status */}
                    <div className="mt-3">
                      {user?.emailVerified ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Email Verified
                        </div>
                      ) : (
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                          <div className="flex items-center text-yellow-400 text-sm mb-2">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Email Not Verified
                          </div>
                          <p className="text-yellow-300 text-xs mb-3">
                            Verify your email to create teams and register for tournaments
                          </p>
                          <Button 
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1"
                          >
                            {resendLoading ? "Sending..." : "Resend Verification Email"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Quick Navigation */}
                    <div className="mt-4 space-y-2">
                      {user?.role === "player" && (
                        <Button 
                          onClick={() => navigate("/dashboard")}
                          variant="outline"
                          className="w-full border-[#292932] hover:bg-[#292932] hover:text-white text-sm"
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Go to Dashboard
                        </Button>
                      )}
                      {user?.role === "admin" && (
                        <Button 
                          onClick={() => navigate("/admin")}
                          variant="outline"
                          className="w-full border-[#292932] hover:bg-[#292932] text-white text-sm"
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      )}
                      {user?.role === "tournament_organizer" && (
                        <Button 
                          onClick={() => navigate("/organizer")}
                          variant="outline"
                          className="w-full border-[#292932] hover:bg-[#292932] hover:text-white text-sm"
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Organizer Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <UserIcon className="w-4 h-4 inline mr-2" />
                        Username *
                      </label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                          fieldErrors.username && fieldTouched.username ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.username && fieldTouched.username && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                          fieldErrors.email && fieldTouched.email ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.email && fieldTouched.email && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Only show game-specific fields for players */}
                    {user?.role === 'player' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            <GamepadIcon className="w-4 h-4 inline mr-2" />
                            Game Username *
                          </label>
                          <Input
                            name="gameUsername"
                            value={formData.gameUsername}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!isEditing}
                            placeholder="Your in-game name"
                            className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                              fieldErrors.gameUsername && fieldTouched.gameUsername ? 'border-red-500' : ''
                            }`}
                          />
                          {fieldErrors.gameUsername && fieldTouched.gameUsername && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.gameUsername}</p>
                          )}
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
                      </>
                    )}

                    {/* Only show bio for players */}
                    {user?.role === 'player' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className={`w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none ${
                            fieldErrors.bio && fieldTouched.bio ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldErrors.bio && fieldTouched.bio && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.bio}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {formData.bio.length}/500 characters
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Only show achievements and tournament history for players */}
            {user?.role === 'player' && (
              <>
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
              </>
            )}

            {/* Role-specific info for organizers and admins */}
            {user?.role !== 'player' && (
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {user?.role === 'tournament_organizer' ? 'Organizer Info' : 'Admin Info'}
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#19191d] rounded-lg">
                      <div className="text-white text-sm font-medium mb-1">Role</div>
                      <div className="text-gray-400 text-xs capitalize">
                        {user?.role === 'tournament_organizer' ? 'Tournament Organizer' : 'Administrator'}
                      </div>
                    </div>
                    <div className="p-3 bg-[#19191d] rounded-lg">
                      <div className="text-white text-sm font-medium mb-1">Account Status</div>
                      <div className="text-green-400 text-xs">
                        {user?.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                      </div>
                    </div>
                    {user?.role === 'tournament_organizer' && (
                      <div className="p-3 bg-[#19191d] rounded-lg">
                        <div className="text-white text-sm font-medium mb-1">Approval Status</div>
                        <div className={`text-xs ${user?.isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
                          {user?.isApproved ? 'Approved' : 'Pending Approval'}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delete Account Section */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#19191d] rounded-lg border border-red-500/20">
                    <div className="text-white text-sm font-medium mb-1">Delete Account</div>
                    <div className="text-gray-400 text-xs mb-3">
                      This will temporarily delete your account. You can restore it within 30 days using your email and OTP. After 30 days, your account will be permanently deleted.
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#19191d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#292932]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg text-white font-semibold">Delete Account</div>
              <button onClick={() => setShowDeleteDialog(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="text-white mb-4">
              <p className="mb-4">This will temporarily delete your account. You can restore it within 30 days using your email and OTP. After 30 days, your account will be permanently deleted.</p>
              <p className="text-sm text-gray-400 mb-4">Enter your password to confirm:</p>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#15151a] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowDeleteDialog(false)} variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (deletePassword) {
                    apiFetch('/auth/soft-delete-account', {
                      method: 'POST',
                      body: JSON.stringify({ password: deletePassword })
                    }, true, false, false)
                    .then(() => {
                      toast.success('Account deleted successfully');
                      // Logout user properly
                      logout();
                      navigate('/');
                    })
                    .catch((err: any) => {
                      toast.error(err.message || 'Failed to delete account');
                    });
                  } else {
                    toast.error('Please enter your password');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};