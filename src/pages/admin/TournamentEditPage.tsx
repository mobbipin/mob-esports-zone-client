import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch } from "../../lib/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const TournamentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<any>({});

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<any>(`/tournaments/${id}`);
        setForm(res.data || {});
      } catch (err: any) {
        setError("Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: [] }));
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
      // Only send fields expected by backend
      const updatePayload = {
        name: form.name,
        description: form.description,
        game: form.game,
        startDate: form.startDate,
        endDate: form.endDate,
        maxTeams: form.maxTeams,
        prizePool: form.prizePool === "" || form.prizePool === null ? undefined : Number(form.prizePool),
        entryFee: form.entryFee === "" || form.entryFee === null ? undefined : Number(form.entryFee),
        rules: form.rules,
        status: form.status
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

  const validate = () => {
    const errors: any = {};
    if (!form.name || form.name.length < 2) errors.name = ["Name must be at least 2 characters."];
    if (!form.game) errors.game = ["Game is required."];
    if (!form.startDate) errors.startDate = ["Start date is required."];
    if (!form.endDate) errors.endDate = ["End date is required."];
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) errors.endDate = ["End date must be after start date."];
    if (form.bannerUrl && !/^https?:\/\/.+/.test(form.bannerUrl)) errors.bannerUrl = ["Banner URL must be a valid URL."];
    if (form.maxTeams && (isNaN(Number(form.maxTeams)) || Number(form.maxTeams) < 2)) errors.maxTeams = ["Max teams must be a number >= 2."];
    if (form.prizePool && isNaN(Number(form.prizePool))) errors.prizePool = ["Prize pool must be a number."];
    return errors;
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading tournament...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Edit Tournament</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Name</label>
              <Input name="name" value={form.name || ""} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
              {fieldErrors.name && fieldErrors.name.map((err, idx) => (
                <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={val => setForm((prev: any) => ({ ...prev, description: val }))}
                className="bg-[#19191d] text-white"
              />
              {fieldErrors.description && fieldErrors.description.map((err, idx) => (
                <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Game</label>
              <Input name="game" value={form.game || ""} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
              {fieldErrors.game && fieldErrors.game.map((err, idx) => (
                <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Date & Time *</label>
                <DatePicker
                  selected={form.startDate ? new Date(form.startDate) : null}
                  onChange={date => setForm((prev: any) => ({ ...prev, startDate: date ? date.toISOString() : "" }))}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-full px-3 py-2 rounded-md"
                  required
                />
                {fieldErrors.startDate && fieldErrors.startDate.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">End Date & Time *</label>
                <DatePicker
                  selected={form.endDate ? new Date(form.endDate) : null}
                  onChange={date => setForm((prev: any) => ({ ...prev, endDate: date ? date.toISOString() : "" }))}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] w-full px-3 py-2 rounded-md"
                  required
                />
                {fieldErrors.endDate && fieldErrors.endDate.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Max Teams</label>
                <Input type="number" name="maxTeams" value={form.maxTeams || 0} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
                {fieldErrors.maxTeams && fieldErrors.maxTeams.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Prize Pool</label>
                <Input type="number" name="prizePool" value={form.prizePool || 0} onChange={handleChange} className="bg-[#19191d] border-[#292932] text-white" />
                {fieldErrors.prizePool && fieldErrors.prizePool.map((err, idx) => (
                  <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Rules</label>
              <textarea name="rules" value={form.rules || ""} onChange={handleChange} className="w-full bg-[#19191d] border-[#292932] text-white rounded-md p-2 min-h-[60px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Status</label>
              <select name="status" value={form.status || "draft"} onChange={handleChange} className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md">
                <option value="draft">Draft</option>
                <option value="registration">Registration</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" onClick={() => navigate("/admin/tournaments")} variant="outline" className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]">
                Cancel
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 