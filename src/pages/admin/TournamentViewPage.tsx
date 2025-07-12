import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

export const TournamentViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<any>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<any>(`/tournaments/${id}`);
        setTournament(res.data || null);
      } catch (err: any) {
        setError("Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return;
    try {
      await apiFetch(`/tournaments/${id}`, { method: "DELETE" });
      toast.success("Tournament deleted");
      navigate("/admin/tournaments");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to delete tournament");
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error || !tournament) return <div className="text-center py-12 text-red-500">{error || "Tournament not found"}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          {tournament.imageUrl && (
            <img src={tournament.imageUrl} alt="Tournament Banner" className="mb-6 rounded-lg max-h-64 mx-auto" />
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{tournament.name}</h2>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/admin/tournaments/${id}/bracket`)} variant="outline" className="border-[#292932] text-white">Bracket</Button>
              <Button onClick={handleDelete} variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">Delete</Button>
              <Button onClick={() => navigate(-1)} variant="outline" className="border-[#292932] text-white">Back</Button>
            </div>
          </div>
          <div className="mb-4 text-gray-400">{tournament.description}</div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><span className="font-semibold text-white">Game:</span> {tournament.game}</div>
            <div><span className="font-semibold text-white">Status:</span> {tournament.status}</div>
            <div><span className="font-semibold text-white">Start:</span> {tournament.startDate}</div>
            <div><span className="font-semibold text-white">End:</span> {tournament.endDate}</div>
            <div><span className="font-semibold text-white">Max Teams:</span> {tournament.maxTeams}</div>
            <div><span className="font-semibold text-white">Prize Pool:</span> ${tournament.prizePool || 0}</div>
            <div><span className="font-semibold text-white">Entry Fee:</span> ${tournament.entryFee || 0}</div>
          </div>
          <div className="mb-4"><span className="font-semibold text-white">Rules:</span>
            <pre className="bg-[#19191d] p-2 rounded text-gray-300 whitespace-pre-wrap">{tournament.rules || "-"}</pre>
          </div>
          {Array.isArray(tournament.teams) && (
            <div className="mb-4">
              <div className="font-semibold text-white mb-2">Registered Teams:</div>
              <ul className="list-disc pl-6 text-gray-300">
                {tournament.teams.length === 0 && <li>No teams registered</li>}
                {tournament.teams.map((team: any) => (
                  <li key={team.teamId || team.id} className="flex items-center justify-between">
                    <span>{team.teamId || team.id}</span>
                    <Button size="sm" variant="outline" className="ml-2 border-[#292932] hover:text-white hover:bg-[#292932]" onClick={() => navigate(`/admin/teams/${team.teamId || team.id}/view`)}>
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(tournament.matches) && (
            <div className="mb-4">
              <div className="font-semibold text-white mb-2">Matches:</div>
              <ul className="list-disc pl-6 text-gray-300">
                {tournament.matches.length === 0 && <li>No matches</li>}
                {tournament.matches.map((match: any) => (
                  <li key={match.id}>Round {match.round}, Match {match.matchNumber}: {match.team1Id} vs {match.team2Id}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 