import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, CalendarIcon, UsersIcon, TrophyIcon, ImageIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch, apiUpload } from "../../lib/api";
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import { Skeleton } from "../../components/ui/skeleton";

export const TournamentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<any>(`/tournaments/${id}`);
        setFormData({
          title: res.data?.name || "",
          description: res.data?.description || "",
          game: res.data?.game || "",
          maxParticipants: res.data?.maxTeams?.toString() || "",
          prize: res.data?.prizePool?.toString() || "",
          startDate: res.data?.startDate ? new Date(res.data.startDate) : null,
          endDate: res.data?.endDate ? new Date(res.data.endDate) : null,
          rules: res.data?.rules || "",
          bannerUrl: res.data?.imageUrl || res.data?.bannerUrl || "",
        });
        setBannerUrl(res.data?.imageUrl || res.data?.bannerUrl || "");
      } catch (err: any) {
        setError("Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev: any) => ({ ...prev, [e.target.name]: [] }));
  };

  const toFullISOString = (val: Date | null) => {
    if (!val) return "";
    return val.toISOString();
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("banner", file);
      const res = await apiUpload("/upload/tournament-banner", formData);
      setBannerUrl(res.data?.url || "");
      addToast("Banner uploaded!", "success");
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to upload banner", "error");
    } finally {
      setBannerUploading(false);
    }
  };

  const validate = () => {
    const errors: any = {};
    if (!formData.title || formData.title.length < 2) errors.title = ["Title must be at least 2 characters."];
    if (!formData.game) errors.game = ["Game is required."];
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
    setSaving(true);
    setError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaving(false);
      return;
    }
    try {
      const updatePayload = {
        name: formData.title,
        description: formData.description,
        game: formData.game,
        startDate: toFullISOString(formData.startDate),
        endDate: toFullISOString(formData.endDate),
        maxTeams: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        prizePool: formData.prize === "" || formData.prize === null ? undefined : Number(formData.prize),
        rules: Array.isArray(formData.rules) ? formData.rules.join("\n") : formData.rules,
        imageUrl: bannerUrl || undefined,
      };
      await apiFetch(`/tournaments/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatePayload)
      });
      addToast("Tournament updated successfully!", "success");
      navigate("/admin/tournaments");
    } catch (err: any) {
      setError(err.message || err?.toString() || "Failed to update tournament");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

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
            <h1 className="text-3xl font-bold text-white">Edit Tournament</h1>
            <p className="text-gray-400">Update tournament details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            form="tournament-edit-form"
            type="submit"
            disabled={saving}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <form id="tournament-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tournament Title *</label>
                  <Input
                    name="title"
                    value={formData.title || ""}
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
                    onChange={val => setFormData((prev: any) => ({ ...prev, description: val }))}
                    className="bg-[#19191d] text-white"
                  />
                  {fieldErrors.description && fieldErrors.description.map((err: string, idx: number) => (
                    <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Game *</label>
                    <Input
                      name="game"
                      value={formData.game || ""}
                      onChange={handleChange}
                      placeholder="Enter game name"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      required
                    />
                    {fieldErrors.game && fieldErrors.game.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Max Participants *</label>
                    <Input
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants || ""}
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Prize Pool *</label>
                    <Input
                      name="prize"
                      type="number"
                      value={formData.prize || ""}
                      onChange={handleChange}
                      placeholder="e.g., $10,000"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      required
                    />
                    {fieldErrors.prize && fieldErrors.prize.map((err: string, idx: number) => (
                      <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Rules</label>
                    <textarea
                      name="rules"
                      value={formData.rules || ""}
                      onChange={handleChange}
                      rows={8}
                      placeholder="Enter tournament rules, format, and regulations..."
                      className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Start Date & Time *</label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={date => setFormData((prev: any) => ({ ...prev, startDate: date }))}
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
                    onChange={date => setFormData((prev: any) => ({ ...prev, endDate: date }))}
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
        </div>
      </form>
    </div>
  );
}; 