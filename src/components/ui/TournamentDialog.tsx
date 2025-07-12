import React, { useState, useEffect } from "react";
import { XIcon, UploadIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { apiFetch, apiUpload } from "../../lib/api";
import toast from "react-hot-toast";

interface TournamentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  tournament?: any; // For editing
  isEditing?: boolean;
}

export const TournamentDialog: React.FC<TournamentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  tournament,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    game: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxTeams: 16,
    prizePool: 0,
    entryFee: 0,
    rules: "",
    type: "squad" as "solo" | "duo" | "squad" | "team",
    imageUrl: ""
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  // Helper function to format datetime for input
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  useEffect(() => {
    if (tournament && isEditing) {
      setFormData({
        name: tournament.name || "",
        description: tournament.description || "",
        game: tournament.game || "",
        startDate: formatDateTimeForInput(tournament.startDate),
        endDate: formatDateTimeForInput(tournament.endDate),
        registrationDeadline: formatDateTimeForInput(tournament.registrationDeadline),
        maxTeams: tournament.maxTeams || 16,
        prizePool: tournament.prizePool || 0,
        entryFee: tournament.entryFee || 0,
        rules: tournament.rules || "",
        type: tournament.type || "squad",
        imageUrl: tournament.imageUrl || ""
      });
      setImageUrl(tournament.imageUrl || "");
    } else {
      setFormData({
        name: "",
        description: "",
        game: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        maxTeams: 16,
        prizePool: 0,
        entryFee: 0,
        rules: "",
        type: "squad",
        imageUrl: ""
      });
      setImageUrl("");
    }
  }, [tournament, isEditing, open]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/file", formDataUpload);
      setImageUrl(res.data.url);
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Tournament name is required");
      return;
    }
    if (!formData.game.trim()) {
      toast.error("Game is required");
      return;
    }
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
    
    // Convert datetime-local strings to ISO strings
    const startDate = new Date(formData.startDate).toISOString();
    const endDate = new Date(formData.endDate).toISOString();
    const registrationDeadline = new Date(formData.registrationDeadline).toISOString();
    
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (new Date(registrationDeadline) >= new Date(startDate)) {
      toast.error("Registration deadline must be before start date");
      return;
    }
    if (formData.maxTeams < 2) {
      toast.error("Maximum teams must be at least 2");
      return;
    }

    onSubmit({
      ...formData,
      startDate,
      endDate,
      registrationDeadline,
      imageUrl: formData.imageUrl || imageUrl
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#15151a] border-[#292932] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? "Edit Tournament" : "Create New Tournament"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tournament Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter tournament name"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Game *</label>
                <select
                  required
                  value={formData.game}
                  onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter tournament description"
                rows={3}
                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
              />
            </div>

            {/* Tournament Type and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tournament Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "solo" | "duo" | "squad" | "team" }))}
                  className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                >
                  {tournamentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Date *</label>
                <Input
                  required
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">End Date *</label>
                <Input
                  required
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Registration Deadline *</label>
              <Input
                required
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Max Teams *</label>
                <Input
                  required
                  type="number"
                  min="2"
                  value={formData.maxTeams}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) || 0 }))}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Prize Pool ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prizePool}
                  onChange={(e) => setFormData(prev => ({ ...prev, prizePool: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Entry Fee ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.entryFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Tournament Rules</label>
              <textarea
                value={formData.rules}
                onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                placeholder="Enter tournament rules and guidelines"
                rows={4}
                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tournament Banner</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                  className="text-gray-400"
                />
                {imageUploading && <span className="text-yellow-500 text-sm">Uploading...</span>}
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Preview" className="rounded-lg max-h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                {isEditing ? "Update Tournament" : "Create Tournament"}
              </Button>
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 