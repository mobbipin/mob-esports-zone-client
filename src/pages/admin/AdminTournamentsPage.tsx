import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, SearchIcon, FilterIcon, CalendarIcon, UsersIcon, TrophyIcon, EditIcon, TrashIcon, SettingsIcon, EyeIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { TournamentDialog } from "../../components/ui/TournamentDialog";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

// Add DeleteDialog component (copied from TeamsManagementPage)
const DeleteDialog = ({ open, onConfirm, onCancel, message, loading }: { open: boolean, onConfirm: () => void, onCancel: () => void, message: string, loading?: boolean }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#19191d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#292932]">
        <div className="text-lg text-white font-semibold mb-4">Confirm Deletion</div>
        <div className="text-gray-300 mb-6">{message}</div>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" className="border-[#292932]">Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white" disabled={loading}>{loading ? "Deleting..." : "Delete"}</Button>
        </div>
      </div>
    </div>
  );
};

export const AdminTournamentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, tournamentId?: string, tournamentName?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = `/tournaments?admin=true&page=${page}&limit=${limit}`;
      if (statusFilter !== "all") query += `&status=${statusFilter}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      // typeFilter can be used if API supports
      const res = await apiFetch<any>(query);
      setTournaments(res.data || []);
      setTotal(res.total || res.data?.length || 0);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line
  }, [page, statusFilter, searchTerm]);

  const handleDeleteTournament = async (tournamentId: string, tournamentTitle: string) => {
    if (confirm(`Are you sure you want to delete "${tournamentTitle}"? This action cannot be undone.`)) {
      try {
        await apiFetch(`/tournaments/${tournamentId}`, { method: "DELETE" });
        toast.success(`Tournament "${tournamentTitle}" has been deleted`);
        fetchTournaments();
      } catch (err: any) {
        toast.error(err?.toString() || "Failed to delete tournament");
      }
    }
  };

  const handleCancelTournament = async (tournamentId: string, tournamentTitle: string) => {
    if (confirm(`Are you sure you want to cancel "${tournamentTitle}"? All registered participants will be notified.`)) {
      try {
        await apiFetch(`/tournaments/${tournamentId}`, {
          method: "PUT",
          body: JSON.stringify({ status: "cancelled" })
        });
        toast.success(`Tournament "${tournamentTitle}" has been cancelled`);
        fetchTournaments();
      } catch (err: any) {
        toast.error(err?.toString() || "Failed to cancel tournament");
      }
    }
  };

  const handleCreateTournament = async (data: any) => {
    try {
      await apiFetch('/tournaments', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      toast.success('Tournament created successfully!');
      setShowDialog(false);
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create tournament');
    }
  };

  const handleEditTournament = async (data: any) => {
    if (!editingTournament) return;
    
    try {
      await apiFetch(`/tournaments/${editingTournament.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      toast.success('Tournament updated successfully!');
      setShowDialog(false);
      setEditingTournament(null);
      setIsEditing(false);
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update tournament');
    }
  };

  const openEditDialog = (tournament: any) => {
    setEditingTournament(tournament);
    setIsEditing(true);
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditingTournament(null);
    setIsEditing(false);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingTournament(null);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "registration open":
      case "registration":
        return "bg-green-600";
      case "full":
        return "bg-blue-600";
      case "ongoing":
        return "bg-purple-600";
      case "completed":
        return "bg-gray-600";
      case "draft":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  // Stats calculation
  const stats = [
    { label: "Total Tournaments", value: total, color: "text-white" },
    { label: "Active", value: tournaments.filter(t => ["registration", "ongoing", "registration open"].includes((t.status||"").toLowerCase())).length, color: "text-green-500" },
    { label: "Completed", value: tournaments.filter(t => (t.status||"").toLowerCase() === "completed").length, color: "text-blue-500" },
    { label: "Total Prize Pool", value: `$${tournaments.reduce((sum, t) => sum + (t.prizePool || t.prize || 0), 0).toLocaleString()}`, color: "text-[#f34024]" }
  ];

  if (loading && !error) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <Skeleton key={i} height={180} className="mb-4" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournament Management</h1>
          <p className="text-gray-400">Create and manage esports tournaments</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Tournaments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tournaments or games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="registration">Registration Open</option>
              <option value="full">Full</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="team">Team</option>
              <option value="squad">Squad</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tournaments Grid */}
      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-[#15151a] border-[#292932] overflow-hidden hover:border-[#f34024] transition-colors">
              <div className="relative">
                <img 
                  src={tournament.imageUrl || tournament.image || "/assets/logo.png"} 
                  alt={tournament.name || tournament.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-[#19191d]/80 text-white text-xs font-semibold rounded">
                    {tournament.game}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-[#f34024] text-white text-xs font-semibold rounded">
                    {tournament.type}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{tournament.name || tournament.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tournament.description}</p>
                <div className="space-y-2 text-gray-400 text-sm mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "-"} - {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : "-"}
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {tournament.teams?.length || tournament.participants || 0}/{tournament.maxTeams || tournament.maxParticipants || 0} participants
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    {tournament.prizePool ? `$${tournament.prizePool}` : tournament.prize || "-"} prize pool
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Registration Progress</span>
                    <span>{tournament.maxTeams || tournament.maxParticipants ? Math.round(((tournament.teams?.length || tournament.participants || 0) / (tournament.maxTeams || tournament.maxParticipants)) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-[#292932] rounded-full h-2">
                    <div 
                      className="bg-[#f34024] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tournament.maxTeams || tournament.maxParticipants ? ((tournament.teams?.length || tournament.participants || 0) / (tournament.maxTeams || tournament.maxParticipants)) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                {/* Tournament Info */}
                <div className="text-xs text-gray-500 mb-4">
                  <div>Organizer: {tournament.createdBy || "-"}</div>
                  <div>Created: {tournament.createdAt ? new Date(tournament.createdAt).toLocaleDateString() : "-"}</div>
                  <div>Registration Deadline: {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : "-"}</div>
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
                    onClick={() => navigate(`/admin/tournaments/${tournament.id}/view`)}
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Link to={`/admin/tournaments/${tournament.id}/bracket`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <SettingsIcon className="w-3 h-3 mr-1" />
                      Bracket
                    </Button>
                  </Link>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
                    onClick={() => openEditDialog(tournament)}
                  >
                    <EditIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  {(tournament.status === "registration" || tournament.status === "Registration Open") && (
                    <Button 
                      size="sm"
                      onClick={() => handleCancelTournament(tournament.id, tournament.name || tournament.title)}
                      variant="outline"
                      className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    onClick={() => setDeleteDialog({ open: true, tournamentId: tournament.id, tournamentName: tournament.name })}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-gray-400 text-sm">
          Showing {tournaments.length} of {total} tournaments
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]" disabled={tournaments.length < limit} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
      <DeleteDialog
        open={deleteDialog.open}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await apiFetch(`/tournaments/${deleteDialog.tournamentId}`, { method: "DELETE" });
            toast.success(`Tournament "${deleteDialog.tournamentName}" deleted`);
            // Refresh the tournament list here
            fetchTournaments();
          } catch (err: any) {
            toast.error(err.message || err?.toString() || "Failed to delete tournament");
          } finally {
            setDeleteDialog({ open: false });
            setDeleting(false);
          }
        }}
        onCancel={() => setDeleteDialog({ open: false })}
        message={`Are you sure you want to delete tournament "${deleteDialog.tournamentName}"? This action cannot be undone.`}
        loading={deleting}
      />
      {/* Tournament Dialog */}
      <TournamentDialog
        open={showDialog}
        onClose={closeDialog}
        onSubmit={isEditing ? handleEditTournament : handleCreateTournament}
        tournament={editingTournament}
        isEditing={isEditing}
      />
    </div>
  );
};