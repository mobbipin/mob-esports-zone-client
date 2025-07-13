import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, TrophyIcon, CalendarIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { TournamentDialog } from "../../components/ui/TournamentDialog";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

// Add DeleteDialog component
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

export const OrganizerTournamentsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, tournamentId?: string, tournamentName?: string, source?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<any>('/pending/organizer/tournaments');
        setTournaments(response.data || []);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user]);

  const handleCreateTournament = async (data: any) => {
    try {
      await apiFetch('/pending/tournaments', {
        method: 'POST',
        body: JSON.stringify(data)
      }, true, false, false);
      toast.success('Tournament created successfully!');
      setShowDialog(false);
      // Refresh the list
      const response = await apiFetch<any>('/pending/organizer/tournaments');
      setTournaments(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create tournament');
    }
  };

  const handleEditTournament = async (data: any) => {
    if (!editingTournament) return;
    
    try {
      // If tournament is approved, use pending system
      if (editingTournament.source === 'approved') {
        await apiFetch(`/pending/tournaments`, {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            originalId: editingTournament.id,
            action: 'update'
          })
        }, true, false, false);
        toast.success('Tournament update submitted for approval!');
      } else {
        // For pending tournaments, update directly
        await apiFetch(`/pending/tournaments/${editingTournament.id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        }, true, false, false);
        toast.success('Tournament updated successfully!');
      }
      setShowDialog(false);
      setEditingTournament(null);
      setIsEditing(false);
      // Refresh the list
      const response = await apiFetch<any>('/pending/organizer/tournaments');
      setTournaments(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update tournament');
    }
  };

  const handleDeleteTournament = async (tournamentId: string, source: string) => {
    setDeleteDialog({ open: true, tournamentId, tournamentName: tournaments.find(t => t.id === tournamentId)?.name, source });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.tournamentId) return;
    
    setDeleting(true);
    try {
      if (deleteDialog.source === 'pending') {
        await apiFetch(`/pending/tournaments/${deleteDialog.tournamentId}`, { method: "DELETE" }, true, false, false);
        toast.success("Tournament deleted successfully");
      } else if (deleteDialog.source === 'approved') {
        // For approved tournaments, submit deletion request through pending system
        await apiFetch(`/pending/tournaments`, {
          method: 'POST',
          body: JSON.stringify({
            originalId: deleteDialog.tournamentId,
            action: 'delete'
          })
        }, true, false, false);
        toast.success("Tournament deletion submitted for approval");
      } else {
        await apiFetch(`/tournaments/${deleteDialog.tournamentId}`, { method: "DELETE" }, true, false, false);
        toast.success("Tournament deleted successfully");
      }
      setTournaments(prev => prev.filter(tournament => tournament.id !== deleteDialog.tournamentId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tournament");
    } finally {
      setDeleteDialog({ open: false });
      setDeleting(false);
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

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={200} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1a1a1e] flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error Loading Tournaments</div>
        <div className="text-gray-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-3xl font-bold text-white mb-2">My Tournaments</h1>
              <p className="text-gray-400">Manage your tournaments and events</p>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Tournament
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Tournaments</p>
                  <p className="text-2xl font-bold text-white">{tournaments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">{tournaments.filter(t => t.source === 'approved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">{tournaments.filter(t => t.source === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Registrations</p>
                  <p className="text-2xl font-bold text-white">
                    {tournaments.reduce((acc, t) => acc + (t.participants || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournaments Grid */}
        {tournaments.length === 0 ? (
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-12 text-center">
              <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Tournaments Yet</h3>
              <p className="text-gray-400 mb-6">Create your first tournament to get started</p>
              <Button 
                onClick={openCreateDialog}
                className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Your First Tournament
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] hover:border-[#f34024]/50 transition-colors">
                <CardContent className="p-6">
                  {/* Tournament Image */}
                  {tournament.imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={tournament.imageUrl} 
                        alt={tournament.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Tournament Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">{tournament.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {tournament.description}
                    </p>
                    
                    {/* Tournament Meta */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(tournament.startDate).toLocaleDateString()}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          tournament.source === 'approved' ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                        }`}>
                          {tournament.source === 'approved' ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Game: {tournament.game}</span>
                        <span>Type: {tournament.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Teams: {tournament.participants || 0}/{tournament.maxTeams}</span>
                        <span className="text-[#f34024] font-bold">
                          ${tournament.prizePool?.toLocaleString() || "TBA"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#292932]">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] hover:text-white"
                          onClick={() => window.open(`/tournaments/${tournament.id}`, '_blank')}
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] hover:text-white"
                          onClick={() => openEditDialog(tournament)}
                        >
                          <EditIcon className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteTournament(tournament.id, tournament.source)}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tournament Dialog */}
        <TournamentDialog
          open={showDialog}
          onClose={closeDialog}
          onSubmit={isEditing ? handleEditTournament : handleCreateTournament}
          tournament={editingTournament}
          isEditing={isEditing}
        />

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialog.open}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ ...deleteDialog, open: false })}
          message={`Are you sure you want to delete "${deleteDialog.tournamentName}"? This action cannot be undone.`}
          loading={deleting}
        />
      </div>
    </div>
  );
}; 