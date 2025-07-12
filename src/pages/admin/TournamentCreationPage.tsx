import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, CalendarIcon, UsersIcon, TrophyIcon, ImageIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";
import { validateRequired, validateFileSize, validateFileType } from "../../lib/utils";

export const TournamentCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    type: "solo",
    maxParticipants: "",
    prize: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    registrationDeadline: null as Date | null,
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

  // Helper to format datetime-local to full ISO string with seconds
  const toFullISOString = (val: Date | null) => {
    if (!val) return "";
    return val.toISOString();
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!validateFileSize(file, 5)) return; // 5MB limit
    if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/webp'])) return;

    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("banner", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/banner", formData, false); // Don't show error toast here
      setBannerUrl(res.data.url);
      setFormData(prev => ({ ...prev, bannerImage: res.data.url }));
      toast.success("Banner uploaded!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload banner");
    } finally {
      setBannerUploading(false);
    }
  };

  const validate = () => {
    const errors: any = {};
    if (!formData.title || formData.title.length < 2) errors.title = ["Title must be at least 2 characters."];
    if (!formData.game) errors.game = ["Game is required."];
    if (!formData.type) errors.type = ["Type is required."];
    if (!formData.startDate) errors.startDate = ["Start date is required."];
    if (!formData.endDate) errors.endDate = ["End date is required."];
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) errors.endDate = ["End date must be after start date."];
    if (bannerUrl && !/^https?:\/\/.+/.test(bannerUrl)) errors.bannerUrl = ["Banner URL must be a valid URL."];
    if (formData.maxParticipants && (isNaN(Number(formData.maxParticipants)) || Number(formData.maxParticipants) < 2)) errors.maxParticipants = ["Max participants must be a number >= 2."];
    if (formData.prize && isNaN(Number(formData.prize))) errors.prize = ["Prize pool must be a number."];
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Form validation
    if (!validateRequired(formData.title, "Tournament title")) return;
    if (!validateRequired(formData.description, "Tournament description")) return;
    if (!validateRequired(formData.game, "Game")) return;
    if (!validateRequired(formData.maxParticipants, "Maximum participants")) return;
    if (!validateRequired(formData.prize, "Prize pool")) return;
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }
    if (!formData.registrationDeadline) {
      toast.error("Registration deadline is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants),
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        registrationDeadline: formData.registrationDeadline?.toISOString(),
      };
      
      await apiFetch("/tournaments", {
        method: "POST",
        body: JSON.stringify(payload),
      }, true, false); // Don't show error toast here
      
      toast.success("Tournament created successfully!");
      navigate("/admin/tournaments");
    } catch (err: any) {
      if (err && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      // Error toast is handled by the API utility
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
        prizePool: Number(formData.prize.replace(/[$,]/g, "")),
        startDate: toFullISOString(formData.startDate),
        endDate: toFullISOString(formData.endDate),
        registrationDeadline: toFullISOString(formData.registrationDeadline),
        rules: formData.rules,
        bannerUrl: bannerUrl || undefined,
        status: "draft",
        date: toFullISOString(formData.startDate) || ""
      };
      await apiFetch("/tournaments", {
        method: "POST",
        body: JSON.stringify(payload)
      }, true, false); // Don't show error toast here
      toast.success("Tournament saved as draft!");
      navigate("/admin/tournaments");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate("/admin/tournaments")}
            variant="outline"
            className="border-[#292932] hover:text-white hover:bg-[#292932]"
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
            className="border-[#292932] hover:text-white hover:bg-[#292932]"
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
                  {fieldErrors.title && fieldErrors.title.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description *</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={val => setFormData(prev => ({ ...prev, description: val }))}
                    className="bg-[#19191d] text-white"
                  />
                  {fieldErrors.description && fieldErrors.description.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
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
                    {fieldErrors.game && fieldErrors.game.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
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
                    {fieldErrors.type && fieldErrors.type.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
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
                    {fieldErrors.maxParticipants && fieldErrors.maxParticipants.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      <TrophyIcon className="w-4 h-4 inline mr-2" />
                      Prize Pool *
                    </label>
                    <Input
                      name="prize"
                      type="number"
                      value={formData.prize}
                      onChange={handleChange}
                      placeholder="e.g., $10,000"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      required
                    />
                    {fieldErrors.prize && fieldErrors.prize.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
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
                  <label className="block text-sm font-medium text-white mb-2">Start Date & Time *</label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={date => setFormData(prev => ({ ...prev, startDate: date }))}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-full px-3 py-2 rounded-md"
                    required
                  />
                  {fieldErrors.startDate && fieldErrors.startDate.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">End Date & Time *</label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={date => setFormData(prev => ({ ...prev, endDate: date }))}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-full px-3 py-2 rounded-md"
                    required
                  />
                  {fieldErrors.endDate && fieldErrors.endDate.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Registration Deadline *</label>
                  <DatePicker
                    selected={formData.registrationDeadline}
                    onChange={date => setFormData(prev => ({ ...prev, registrationDeadline: date }))}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-full px-3 py-2 rounded-md"
                    required
                  />
                  {fieldErrors.registrationDeadline && fieldErrors.registrationDeadline.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
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
                {fieldErrors.rules && fieldErrors.rules.map((err: string, idx: number) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
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
                  onChange={handleBannerUpload}
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