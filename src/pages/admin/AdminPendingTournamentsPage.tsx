import React, { useEffect, useState } from "react";
import { EyeIcon, CheckIcon, XIcon, TrophyIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { PendingContentDialog } from "../../components/ui/PendingContentDialog";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";

export const AdminPendingTournamentsPage: React.FC = () => {
  const { user } = useAuth();
  const [pendingTournaments, setPendingTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPendingTournaments = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<any>('/pending/tournaments');
        setPendingTournaments(response.data || []);
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load pending tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTournaments();
  }, [user]);

  const handleReview = async (tournamentId: string, approved: boolean, reviewNotes?: string) => {
    try {
      await apiFetch(`/pending/tournaments/${tournamentId}/review`, {
        method: "PUT",
        body: JSON.stringify({
          approved,
          reviewNotes: reviewNotes || ""
        })
      }, true, false, false);
      
      // Remove from list
      setPendingTournaments(prev => prev.filter(t => t.id !== tournamentId));
      
      toast.success(approved ? "Tournament approved and published" : "Tournament rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to review tournament");
    }
  };

  const handleViewTournament = (tournament: any) => {
    setSelectedTournament(tournament);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTournament(null);
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
        <div className="text-red-500 text-xl mb-4">Error Loading Pending Tournaments</div>
        <div className="text-gray-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pending Tournaments</h1>
          <p className="text-gray-400">Review and approve/reject tournament submissions from organizers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{pendingTournaments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingTournaments.filter(t => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(t.createdAt) > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Organizers</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(pendingTournaments.map(t => t.createdBy)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tournaments */}
        {pendingTournaments.length === 0 ? (
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-12 text-center">
              <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Pending Tournaments</h3>
              <p className="text-gray-400">All tournament submissions have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-[#15151a] border-[#292932] hover:border-yellow-500/50 transition-colors">
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
                        <span className="px-2 py-1 rounded text-xs bg-yellow-600 text-white">
                          Pending Review
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Game: {tournament.game}</span>
                        <span>Type: {tournament.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Max Teams: {tournament.maxTeams}</span>
                        <span className="text-[#f34024] font-bold">
                          ${tournament.prizePool?.toLocaleString() || "TBA"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Submitted by: {tournament.organizerName || tournament.organizerEmail}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#292932]">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#292932] hover:bg-[#292932] hover:text-white"
                          onClick={() => handleViewTournament(tournament)}
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleReview(tournament.id, true)}
                        >
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleReview(tournament.id, false)}
                        >
                          <XIcon className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pending Content Dialog */}
        <PendingContentDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          content={selectedTournament}
          contentType="tournament"
        />
      </div>
    </div>
  );
}; 