import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, UploadIcon, CalendarIcon, UsersIcon, DollarSignIcon, TrophyIcon, ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";
import toast from "react-hot-toast";
import { validateRequired, validateMinLength, validateMaxLength } from "../../lib/utils";

export const OrganizerTournamentCreationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    maxTeams: "",
    prizePool: "",
    entryFee: "",
    game: "",
    type: "squad",
    rules: ""
  });

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

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    let errorMessage = "";
    switch (name) {
      case "name":
        if (!validateRequired(value, "Tournament name")) {
          errorMessage = "Tournament name is required";
        } else if (!validateMinLength(value, 3, "Tournament name")) {
          errorMessage = "Tournament name must be at least 3 characters";
        } else if (!validateMaxLength(value, 100, "Tournament name")) {
          errorMessage = "Tournament name must be no more than 100 characters";
        }
        break;
      case "description":
        if (!validateRequired(value, "Description")) {
          errorMessage = "Description is required";
        } else if (!validateMinLength(value, 10, "Description")) {
          errorMessage = "Description must be at least 10 characters";
        }
        break;
      case "startDate":
        if (!validateRequired(value, "Start date")) {
          errorMessage = "Start date is required";
        }
        break;
      case "endDate":
        if (!validateRequired(value, "End date")) {
          errorMessage = "End date is required";
        }
        break;
      case "maxTeams":
        if (!validateRequired(value, "Maximum teams")) {
          errorMessage = "Maximum teams is required";
        } else if (isNaN(Number(value)) || Number(value) < 2) {
          errorMessage = "Maximum teams must be at least 2";
        }
        break;
      case "prizePool":
        if (!validateRequired(value, "Prize pool")) {
          errorMessage = "Prize pool is required";
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          errorMessage = "Prize pool must be a valid number";
        }
        break;
      case "game":
        if (!validateRequired(value, "Game")) {
          errorMessage = "Game is required";
        } else if (!validateMinLength(value, 2, "Game")) {
          errorMessage = "Game must be at least 2 characters";
        }
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "tournament_banner");

      const response = await apiUpload("/upload/tournament-banner", formData);
      setBannerUrl(response.data.url);
      toast.success("Banner uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload banner");
    } finally {
      setBannerUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate all required fields
    if (!validateRequired(formData.name, "Tournament name")) {
      errors.name = "Tournament name is required";
    }
    if (!validateRequired(formData.description, "Description")) {
      errors.description = "Description is required";
    }
    if (!validateRequired(formData.startDate, "Start date")) {
      errors.startDate = "Start date is required";
    }
    if (!validateRequired(formData.endDate, "End date")) {
      errors.endDate = "End date is required";
    }
    if (!validateRequired(formData.maxTeams, "Maximum teams")) {
      errors.maxTeams = "Maximum teams is required";
    }
    if (!validateRequired(formData.prizePool, "Prize pool")) {
      errors.prizePool = "Prize pool is required";
    }
    if (!validateRequired(formData.game, "Game")) {
      errors.game = "Game is required";
    }

    // Additional validations
    if (formData.name && !validateMinLength(formData.name, 3, "Tournament name")) {
      errors.name = "Tournament name must be at least 3 characters";
    }
    if (formData.description && !validateMinLength(formData.description, 10, "Description")) {
      errors.description = "Description must be at least 10 characters";
    }
    if (formData.maxTeams && (isNaN(Number(formData.maxTeams)) || Number(formData.maxTeams) < 2)) {
      errors.maxTeams = "Maximum teams must be at least 2";
    }
    if (formData.prizePool && (isNaN(Number(formData.prizePool)) || Number(formData.prizePool) < 0)) {
      errors.prizePool = "Prize pool must be a valid number";
    }
    if (formData.game && !validateMinLength(formData.game, 2, "Game")) {
      errors.game = "Game must be at least 2 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const tournamentData = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxTeams: parseInt(formData.maxTeams),
        prizePool: parseFloat(formData.prizePool),
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
        game: formData.game,
        type: formData.type,
        rules: formData.rules || undefined,
        imageUrl: bannerUrl || undefined
      };

      await apiFetch("/pending/tournaments", {
        method: "POST",
        body: JSON.stringify(tournamentData),
      });

      toast.success("Tournament created successfully! It will be reviewed by admin before being visible to players.");
      navigate("/organizer/tournaments");
    } catch (error: any) {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        toast.error(error.message || "Failed to create tournament");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate("/organizer")}
                variant="outline"
                className="border-[#292932] hover:text-white hover:bg-[#292932]"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Create Tournament</h1>
                <p className="text-gray-400">Create a new tournament for players to compete in</p>
              </div>
            </div>
            
            <Button 
              form="tournament-form"
              type="submit"
              disabled={loading}
              className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Tournament"}
            </Button>
          </div>

          <form id="tournament-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                  
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <TrophyIcon className="w-4 h-4 inline mr-2" />
                          Tournament Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.name && fieldTouched.name ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter tournament name"
                        />
                        {fieldErrors.name && fieldTouched.name && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          Start Date *
                        </label>
                        <Input
                          name="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.startDate && fieldTouched.startDate ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldErrors.startDate && fieldTouched.startDate && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.startDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          End Date *
                        </label>
                        <Input
                          name="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.endDate && fieldTouched.endDate ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldErrors.endDate && fieldTouched.endDate && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.endDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <UsersIcon className="w-4 h-4 inline mr-2" />
                          Maximum Teams *
                        </label>
                        <Input
                          name="maxTeams"
                          type="number"
                          value={formData.maxTeams}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="2"
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.maxTeams && fieldTouched.maxTeams ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter max teams"
                        />
                        {fieldErrors.maxTeams && fieldTouched.maxTeams && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.maxTeams}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <DollarSignIcon className="w-4 h-4 inline mr-2" />
                          Prize Pool ($) *
                        </label>
                        <Input
                          name="prizePool"
                          type="number"
                          value={formData.prizePool}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="0"
                          step="0.01"
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.prizePool && fieldTouched.prizePool ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter prize pool"
                        />
                        {fieldErrors.prizePool && fieldTouched.prizePool && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.prizePool}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <DollarSignIcon className="w-4 h-4 inline mr-2" />
                          Entry Fee ($)
                        </label>
                        <Input
                          name="entryFee"
                          type="number"
                          value={formData.entryFee}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                          placeholder="Enter entry fee (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Game *
                        </label>
                        <Input
                          name="game"
                          value={formData.game}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] ${
                            fieldErrors.game && fieldTouched.game ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter game name"
                        />
                        {fieldErrors.game && fieldTouched.game && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.game}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Tournament Type
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                        >
                          <option value="solo">Solo</option>
                          <option value="duo">Duo</option>
                          <option value="squad">Squad</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={4}
                        className={`w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none ${
                          fieldErrors.description && fieldTouched.description ? 'border-red-500' : ''
                        }`}
                        placeholder="Describe your tournament..."
                      />
                      {fieldErrors.description && fieldTouched.description && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
                      )}
                    </div>

                    {/* Rules */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Tournament Rules
                      </label>
                      <textarea
                        name="rules"
                        value={formData.rules}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
                        placeholder="Enter tournament rules (optional)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Banner Upload */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    <UploadIcon className="w-5 h-5 inline mr-2" />
                    Tournament Banner
                  </h3>
                  
                  <div className="border-2 border-dashed border-[#292932] rounded-lg p-8 text-center">
                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Upload tournament banner</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                      id="banner-upload"
                      disabled={bannerUploading}
                    />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer bg-[#19191d] border border-[#292932] text-white px-4 py-2 rounded-md hover:bg-[#292932] transition-colors"
                    >
                      {bannerUploading ? "Uploading..." : "Choose Banner"}
                    </label>
                    {bannerUrl && (
                      <div className="flex items-center space-x-2 mt-4">
                        <img src={bannerUrl} alt="Banner" className="w-16 h-12 object-cover rounded" />
                        <span className="text-green-400 text-sm">✓ Uploaded</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{formData.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game:</span>
                      <span className="text-white">{formData.game || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Teams:</span>
                      <span className="text-white">{formData.maxTeams || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-[#f34024] font-bold">{formData.prizePool || "Not set"}</span>
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
                    <li>• All tournaments require admin approval</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 