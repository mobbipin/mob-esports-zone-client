import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { apiFetch } from "../../lib/api";

export const AdminTeamViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    apiFetch(`/teams/${id}`)
      .then((res: any) => setTeam(res.data))
      .catch(() => setError("Failed to load team"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-2xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!team) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-4 border-[#292932] hover:text-white hover:bg-[#292932]">
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back
      </Button>
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <img src={team.logoUrl || team.logo || "/assets/logo.png"} alt={team.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
              <p className="text-[#f34024] font-medium">[{team.tag}]</p>
              <p className="text-gray-400">{team.bio || team.description}</p>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-white font-medium mr-2">Status:</span>
            <span className="px-2 py-1 rounded text-xs font-medium text-white bg-gray-600">
              {(team.status || "active").charAt(0).toUpperCase() + (team.status || "active").slice(1)}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-white font-medium mr-2">Members:</span>
            <ul className="list-disc pl-6">
              {(team.membersList || []).map((member: any, idx: number) => (
                <li key={idx} className="text-gray-300">
                  {member.username} <span className="text-xs text-gray-500">({member.role})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <span className="text-white font-medium mr-2">Region:</span>
            <span className="text-gray-300">{team.region || "-"}</span>
          </div>
          <div className="mb-4">
            <span className="text-white font-medium mr-2">Created At:</span>
            <span className="text-gray-300">{team.createdAt ? new Date(team.createdAt).toLocaleString() : "-"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 