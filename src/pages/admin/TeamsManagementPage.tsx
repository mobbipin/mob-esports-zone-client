import React, { useState } from "react";
import { SearchIcon, FilterIcon, UsersIcon, MessageCircleIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";

export const TeamsManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const teams = [
    {
      id: 1,
      name: "Elite Gamers",
      tag: "EG",
      captain: "ProGamer123",
      members: 4,
      maxMembers: 4,
      wins: 12,
      losses: 4,
      winRate: 75,
      created: "Dec 15, 2024",
      lastActive: "2 hours ago",
      status: "active",
      logo: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      membersList: [
        { username: "ProGamer123", role: "Captain" },
        { username: "SkillMaster", role: "Player" },
        { username: "GameNinja", role: "Player" },
        { username: "PixelWarrior", role: "Player" }
      ]
    },
    {
      id: 2,
      name: "Storm Breakers",
      tag: "SB",
      captain: "EsportsKing",
      members: 3,
      maxMembers: 4,
      wins: 8,
      losses: 3,
      winRate: 73,
      created: "Dec 10, 2024",
      lastActive: "1 day ago",
      status: "active",
      logo: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      membersList: [
        { username: "EsportsKing", role: "Captain" },
        { username: "CyberNinja", role: "Player" },
        { username: "GameMaster", role: "Player" }
      ]
    },
    {
      id: 3,
      name: "Phoenix Rising",
      tag: "PR",
      captain: "FirePhoenix",
      members: 4,
      maxMembers: 4,
      wins: 15,
      losses: 2,
      winRate: 88,
      created: "Nov 20, 2024",
      lastActive: "30 minutes ago",
      status: "active",
      logo: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      membersList: [
        { username: "FirePhoenix", role: "Captain" },
        { username: "BlazeMaster", role: "Player" },
        { username: "FlameKnight", role: "Player" },
        { username: "InfernoGamer", role: "Player" }
      ]
    },
    {
      id: 4,
      name: "Shadow Wolves",
      tag: "SW",
      captain: "ShadowHunter",
      members: 2,
      maxMembers: 4,
      wins: 3,
      losses: 5,
      winRate: 38,
      created: "Dec 5, 2024",
      lastActive: "1 week ago",
      status: "inactive",
      logo: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      membersList: [
        { username: "ShadowHunter", role: "Captain" },
        { username: "DarkWolf", role: "Player" }
      ]
    },
    {
      id: 5,
      name: "Toxic Squad",
      tag: "TX",
      captain: "ToxicPlayer",
      members: 4,
      maxMembers: 4,
      wins: 1,
      losses: 8,
      winRate: 11,
      created: "Nov 15, 2024",
      lastActive: "2 weeks ago",
      status: "banned",
      logo: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      membersList: [
        { username: "ToxicPlayer", role: "Captain" },
        { username: "BadBehavior", role: "Player" },
        { username: "RuleBreaker", role: "Player" },
        { username: "Cheater123", role: "Player" }
      ]
    }
  ];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.captain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredTeams.map(team => team.id));
    }
  };

  const handleDeleteTeam = (teamId: number, teamName: string) => {
    if (confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) {
      addToast(`Team "${teamName}" has been deleted`, "success");
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
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
                  {team.membersList.map((member, index) => (
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

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No teams found</div>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredTeams.length} of {teams.length} teams
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