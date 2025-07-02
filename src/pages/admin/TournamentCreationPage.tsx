import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, CalendarIcon, UsersIcon, TrophyIcon, ImageIcon } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";

export const TournamentCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    type: "solo",
    maxParticipants: "",
    prize: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    rules: "",
    bannerImage: ""
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  const games = [
    "PUBG Mobile",
    "Valorant",
    "Mobile Legends",
    "Free Fire",
    "COD Mobile",
    "Clash Royale",
    "Fortnite",
    "Apex Legends"
  ];

  const tournamentTypes = [
    { value: "solo", label: "Solo", description: "Individual players compete" },
    { value: "duo", label: "Duo", description: "Teams of 2 players" },
    { value: "squad", label: "Squad", description: "Teams of 4 players" },
    { value: "team", label: "Team", description: "Teams of 5+ players" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("banner", file);
      const res = await apiUpload("/upload/tournament-banner", formData);
      setBannerUrl(res.data?.url || "");
      addToast("Banner uploaded!", "success");
    } catch (err: any) {
      addToast(err?.toString() || "Failed to upload banner", "error");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.title,
        description: formData.description,
        game: formData.game,
        type: formData.type,
        maxTeams: parseInt(formData.maxParticipants),
        prizePool: formData.prize.replace(/[$,]/g, ""),
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        rules: formData.rules,
        bannerUrl: bannerUrl || undefined,
        date: formData.startDate || ""
      };
      await apiFetch("/tournaments", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      addToast("Tournament created successfully!", "success");
      navigate("/admin/tournaments");
    } catch (error: any) {
      addToast(error?.toString() || "Failed to create tournament. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.title,
        description: formData.description,
        game: formData.game,
        type: formData.type,
        maxTeams: parseInt(formData.maxParticipants),
        prizePool: formData.prize.replace(/[$,]/g, ""),
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        rules: formData.rules,
        bannerUrl: bannerUrl || undefined,
        status: "draft",
        date: formData.startDate || ""
      };
      await apiFetch("/tournaments", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      addToast("Tournament saved as draft!", "info");
      navigate("/admin/tournaments");
    } catch (error: any) {
      addToast(error?.toString() || "Failed to save draft. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate("/admin/tournaments")}
            variant="outline"
            className="border-[#292932] text-white hover:bg-[#292932]"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Tournament</h1>
            <p className="text-gray-400">Set up a new esports tournament</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            variant="outline"
            className="border-[#292932] text-white hover:bg-[#292932]"
          >
            Save as Draft
          </Button>
          <Button 
            form="tournament-form"
            type="submit"
            disabled={isSubmitting}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Tournament"}
          </Button>
        </div>
      </div>

      <form id="tournament-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tournament Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter tournament title"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your tournament..."
                    className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Game *
                    </label>
                    <select
                      name="game"
                      value={formData.game}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                      required
                    >
                      <option value="">Select a game</option>
                      {games.map(game => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tournament Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                      required
                    >
                      {tournamentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      <UsersIcon className="w-4 h-4 inline mr-2" />
                      Max Participants *
                    </label>
                    <Input
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      placeholder="e.g., 64"
                      min="2"
                      max="1000"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      <TrophyIcon className="w-4 h-4 inline mr-2" />
                      Prize Pool *
                    </label>
                    <Input
                      name="prize"
                      value={formData.prize}
                      onChange={handleChange}
                      placeholder="e.g., $10,000"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                <CalendarIcon className="w-5 h-5 inline mr-2" />
                Schedule
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Start Date *
                  </label>
                  <Input
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    End Date *
                  </label>
                  <Input
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Registration Deadline *
                  </label>
                  <Input
                    name="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Tournament Rules</h2>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Rules and Regulations *
                </label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Enter tournament rules, format, and regulations..."
                  className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                  required
                />
                <p className="text-gray-400 text-xs mt-2">
                  Include match format, scoring system, conduct rules, and any special regulations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Banner Image */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                <ImageIcon className="w-5 h-5 inline mr-2" />
                Tournament Banner
              </h3>
              
              <div className="border-2 border-dashed border-[#292932] rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Upload tournament banner</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                  onChange={handleBannerChange}
                  disabled={bannerUploading}
                />
                {bannerUploading && <p className="text-yellow-500 text-xs mt-2">Uploading...</p>}
                {bannerUrl && <img src={bannerUrl} alt="Banner Preview" className="mt-2 rounded-lg max-h-32 mx-auto" />}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white">{formData.title || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game:</span>
                  <span className="text-white">{formData.game || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{formData.type ? tournamentTypes.find(t => t.value === formData.type)?.label : "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Participants:</span>
                  <span className="text-white">{formData.maxParticipants || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Pool:</span>
                  <span className="text-[#f34024] font-bold">{formData.prize || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Not set"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-900/20 border-blue-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4">💡 Tips</h3>
              <ul className="text-blue-300 text-sm space-y-2">
                <li>• Clear titles attract more participants</li>
                <li>• Set realistic prize pools</li>
                <li>• Allow enough time for registration</li>
                <li>• Include detailed rules to avoid disputes</li>
                <li>• Test your tournament format first</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};