import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";

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

  if (loading) return <div className="text-center py-12 text-gray-400">Loading tournament...</div>;
  if (error || !tournament) return <div className="text-center py-12 text-red-500">{error || "Tournament not found"}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{tournament.name}</h2>
            <Button onClick={() => navigate(-1)} variant="outline" className="border-[#292932] text-white">Back</Button>
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
                  <li key={team.teamId || team.id}>{team.teamId || team.id}</li>
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