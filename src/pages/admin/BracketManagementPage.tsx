import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, UsersIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch } from "../../lib/api";

export const BracketManagementPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [tournament, setTournament] = useState<any>(null);
  const [bracket, setBracket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [editingScore, setEditingScore] = useState(false);
  const [tempScores, setTempScores] = useState({ team1: "", team2: "" });

  const fetchBracket = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>(`/tournaments/${id}`);
      setTournament(res.data);
      setBracket({ rounds: res.data.matches ? groupMatchesByRound(res.data.matches) : [] });
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load bracket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket();
    // eslint-disable-next-line
  }, [id]);

  function groupMatchesByRound(matches: any[]) {
    // Group matches by round number for bracket display
    const rounds: any[] = [];
    matches?.forEach((match: any) => {
      const roundIdx = match.round - 1;
      if (!rounds[roundIdx]) rounds[roundIdx] = { name: `Round ${match.round}`, matches: [] };
      rounds[roundIdx].matches.push({
        id: match.id,
        team1: { name: match.team1Id, score: match.score1 },
        team2: { name: match.team2Id, score: match.score2 },
        winner: match.winnerId,
        status: match.status
      });
    });
    return rounds;
  }

  const handleMatchClick = (match: any) => {
    setSelectedMatch(match);
    setTempScores({
      team1: match.team1.score?.toString() || "",
      team2: match.team2.score?.toString() || ""
    });
    setEditingScore(false);
  };

  const handleUpdateScore = async () => {
    if (!selectedMatch || !id) return;
    const team1Score = parseInt(tempScores.team1) || 0;
    const team2Score = parseInt(tempScores.team2) || 0;
    try {
      await apiFetch(`/tournaments/${id}/matches/${selectedMatch.id}`, {
        method: "PUT",
        body: JSON.stringify({
          winnerId: team1Score > team2Score ? selectedMatch.team1.name : selectedMatch.team2.name,
          score1: team1Score,
          score2: team2Score,
          status: "completed"
        })
      });
      addToast("Match result updated successfully!", "success");
      setEditingScore(false);
      fetchBracket();
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to update match", "error");
    }
  };

  const handleGenerateBracket = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await apiFetch(`/tournaments/${id}/bracket`, { method: "POST" });
      addToast("Bracket generated!", "success");
      fetchBracket();
    } catch (err: any) {
      addToast(err.message || err?.toString() || "Failed to generate bracket", "error");
    } finally {
      setLoading(false);
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-600 bg-green-900/20";
      case "ongoing":
        return "border-blue-600 bg-blue-900/20";
      case "upcoming":
        return "border-yellow-600 bg-yellow-900/20";
      default:
        return "border-[#292932] bg-[#19191d]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "ongoing":
        return <RefreshCwIcon className="w-4 h-4 text-blue-500 animate-spin" />;
      case "upcoming":
        return <XCircleIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold hover:text-white">{tournament?.title}</h1>
            <p className="text-gray-400">Bracket Management - {tournament?.format}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="border-[#292932] hover:text-white hover:bg-[#292932]"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white" onClick={handleGenerateBracket} disabled={loading}>
            Generate Bracket
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading bracket...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Bracket Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Tournament Bracket</h2>
                
                <div className="overflow-x-auto">
                  <div className="flex space-x-8 min-w-max">
                    {bracket.rounds.map((round: any, roundIndex: number) => (
                      <div key={roundIndex} className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold text-white text-center mb-4">
                          {round.name}
                        </h3>
                        
                        <div className="space-y-6">
                          {round.matches.map((match: any) => (
                            <div
                              key={match.id}
                              onClick={() => handleMatchClick(match)}
                              className={`w-64 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getMatchStatusColor(match.status)}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-gray-400">
                                  Match {match.id}
                                </span>
                                {getStatusIcon(match.status)}
                              </div>
                              
                              <div className="space-y-2">
                                <div className={`flex items-center justify-between p-2 rounded ${
                                  match.winner === match.team1.name ? "bg-green-900/30" : "bg-[#292932]"
                                }`}>
                                  <span className="text-white font-medium">{match.team1.name}</span>
                                  <span className="text-white font-bold">
                                    {match.team1.score !== null ? match.team1.score : "-"}
                                  </span>
                                </div>
                                
                                <div className={`flex items-center justify-between p-2 rounded ${
                                  match.winner === match.team2.name ? "bg-green-900/30" : "bg-[#292932]"
                                }`}>
                                  <span className="text-white font-medium">{match.team2.name}</span>
                                  <span className="text-white font-bold">
                                    {match.team2.score !== null ? match.team2.score : "-"}
                                  </span>
                                </div>
                              </div>
                              
                              {match.winner && (
                                <div className="mt-2 text-center">
                                  <span className="text-green-400 text-xs font-medium">
                                    Winner: {match.winner}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match Details Sidebar */}
          <div className="space-y-6">
            {selectedMatch ? (
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Match {selectedMatch.id} Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-[#19191d] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{selectedMatch.team1.name}</span>
                        <span className="text-[#f34024] font-bold">
                          {selectedMatch.team1.score !== null ? selectedMatch.team1.score : "TBD"}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">Team 1</div>
                    </div>
                    
                    <div className="text-center text-gray-400 text-sm">VS</div>
                    
                    <div className="p-3 bg-[#19191d] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{selectedMatch.team2.name}</span>
                        <span className="text-[#f34024] font-bold">
                          {selectedMatch.team2.score !== null ? selectedMatch.team2.score : "TBD"}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">Team 2</div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#292932]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Status:</span>
                        <span className={`text-sm font-medium ${
                          selectedMatch.status === "completed" ? "text-green-500" :
                          selectedMatch.status === "ongoing" ? "text-blue-500" :
                          "text-yellow-500"
                        }`}>
                          {selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                        </span>
                      </div>
                      
                      {selectedMatch.winner && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Winner:</span>
                          <span className="text-green-500 font-medium">{selectedMatch.winner}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedMatch.status !== "completed" && (
                      <div className="pt-4">
                        {!editingScore ? (
                          <Button 
                            onClick={() => setEditingScore(true)}
                            className="w-full bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                          >
                            Update Score
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">
                                {selectedMatch.team1.name} Score
                              </label>
                              <input
                                type="number"
                                value={tempScores.team1}
                                onChange={(e) => setTempScores(prev => ({ ...prev, team1: e.target.value }))}
                                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                                min="0"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">
                                {selectedMatch.team2.name} Score
                              </label>
                              <input
                                type="number"
                                value={tempScores.team2}
                                onChange={(e) => setTempScores(prev => ({ ...prev, team2: e.target.value }))}
                                className="w-full px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
                                min="0"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={handleUpdateScore}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                Save
                              </Button>
                              <Button 
                                onClick={() => setEditingScore(false)}
                                variant="outline"
                                className="flex-1 border-[#292932] text-white hover:bg-[#292932]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Select a Match</h3>
                  <p className="text-gray-400 text-sm">
                    Click on any match in the bracket to view details and update scores.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tournament Info */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Tournament Info</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white">{tournament?.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white">{tournament?.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-blue-500">{tournament?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Matches Completed:</span>
                    <span className="text-green-500">
                      {bracket.rounds.flatMap((r: any) => r.matches).filter((m: any) => m.status === "completed").length} / {bracket.rounds.flatMap((r: any) => r.matches).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#15151a] border-[#292932]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold hover:text-white mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full border-[#292932] hover:text-white hover:bg-[#292932] justify-start"
                  >
                    Export Bracket
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-[#292932] hover:text-white hover:bg-[#292932] justify-start"
                  >
                    Send Notifications
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-[#292932] hover:text-white hover:bg-[#292932] justify-start"
                  >
                    View Participants
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};