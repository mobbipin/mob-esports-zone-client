import React, { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, UsersIcon, MessageCircleIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch } from "../../lib/api";

export const TeamsManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = `/teams?admin=true&page=${page}&limit=${limit}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await apiFetch<any>(query);
      setTeams(Array.isArray(res.data) ? res.data : []);
      setTotal(res.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load teams");
      console.error("Teams API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line
  }, [page, searchTerm]);

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map((team: any) => team.id));
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) {
      try {
        await apiFetch(`/teams/${teamId}`, { method: "DELETE" });
        addToast(`Team "${teamName}" has been deleted`, "success");
        fetchTeams();
      } catch (err: any) {
        addToast(err?.toString() || "Failed to delete team", "error");
      }
    }
  };

  const handleMessageCaptain = (captainName: string) => {
    addToast(`Message sent to ${captainName}`, "success");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-yellow-500";
      case "banned":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "inactive":
        return "bg-yellow-600";
      case "banned":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teams Management</h1>
          <p className="text-gray-400">Manage teams and their rosters</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Export Teams
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{teams.length}</div>
            <div className="text-gray-400 text-sm">Total Teams</div>
          </CardContent>
        </Card>
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {teams.filter(t => t.status === "active").length}
            </div>
            <div className="text-gray-400 text-sm">Active Teams</div>
          </CardContent>
        </Card>
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {teams.filter(t => t.members < t.maxMembers).length}
            </div>
            <div className="text-gray-400 text-sm">Recruiting</div>
          </CardContent>
        </Card>
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              {teams.filter(t => t.status === "banned").length}
            </div>
            <div className="text-gray-400 text-sm">Banned Teams</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Teams</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search teams, tags, or captains..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTeams.length > 0 && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
                  <MessageCircleIcon className="w-4 h-4 mr-2" />
                  Message Captains
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teams Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading teams...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="bg-[#15151a] border-[#292932] hover:border-[#f34024] transition-colors">
              <CardContent className="p-6">
                {/* Team Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.id)}
                      onChange={() => handleSelectTeam(team.id)}
                      className="rounded border-[#292932] bg-[#19191d] text-[#f34024] focus:ring-[#f34024]"
                    />
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-white font-bold">{team.name}</h3>
                      <p className="text-[#f34024] text-sm font-medium">[{team.tag}]</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusBadge(team.status)}`}>
                    {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                  </span>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-white font-bold">{team.members}/{team.maxMembers}</div>
                    <div className="text-gray-400 text-xs">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500 font-bold">{team.wins}</div>
                    <div className="text-gray-400 text-xs">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#f34024] font-bold">{team.winRate}%</div>
                    <div className="text-gray-400 text-xs">Win Rate</div>
                  </div>
                </div>

                {/* Captain Info */}
                <div className="mb-4 p-3 bg-[#19191d] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">Captain: {team.captain}</div>
                      <div className="text-gray-400 text-xs">Created {team.created}</div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleMessageCaptain(team.captain)}
                      className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                    >
                      <MessageCircleIcon className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Members List */}
                <div className="mb-4">
                  <div className="text-white text-sm font-medium mb-2">Members:</div>
                  <div className="space-y-1">
                    {team.membersList.map((member: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{member.username}</span>
                        <span className={`px-2 py-1 rounded ${
                          member.role === "Captain" ? "bg-yellow-600 text-white" : "bg-[#292932] text-gray-300"
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                    {team.members < team.maxMembers && (
                      <div className="text-gray-500 text-xs italic">
                        {team.maxMembers - team.members} slot{team.maxMembers - team.members > 1 ? 's' : ''} available
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
                  >
                    <EditIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <TrashIcon className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Last Active */}
                <div className="mt-3 text-center">
                  <span className="text-gray-500 text-xs">Last active: {team.lastActive}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {teams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No teams found</div>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {teams.length} of {total} teams
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Previous
          </Button>
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};