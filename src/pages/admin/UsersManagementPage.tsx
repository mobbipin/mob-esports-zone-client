import React, { useState } from "react";
import { SearchIcon, FilterIcon, MoreVerticalIcon, BanIcon, ShieldIcon, UserIcon, MailIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../contexts/ToastContext";

export const UsersManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const users = [
    {
      id: 1,
      username: "ProGamer123",
      email: "progamer@example.com",
      role: "player",
      status: "active",
      joinDate: "Dec 15, 2024",
      lastActive: "2 hours ago",
      tournaments: 8,
      wins: 6,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      id: 2,
      username: "EsportsKing",
      email: "esportsking@example.com",
      role: "player",
      status: "active",
      joinDate: "Dec 10, 2024",
      lastActive: "1 day ago",
      tournaments: 12,
      wins: 9,
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      id: 3,
      username: "GameMaster",
      email: "gamemaster@example.com",
      role: "admin",
      status: "active",
      joinDate: "Nov 20, 2024",
      lastActive: "30 minutes ago",
      tournaments: 0,
      wins: 0,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      id: 4,
      username: "PixelWarrior",
      email: "pixelwarrior@example.com",
      role: "player",
      status: "banned",
      joinDate: "Dec 5, 2024",
      lastActive: "1 week ago",
      tournaments: 3,
      wins: 0,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      id: 5,
      username: "CyberNinja",
      email: "cyberninja@example.com",
      role: "player",
      status: "inactive",
      joinDate: "Nov 15, 2024",
      lastActive: "2 weeks ago",
      tournaments: 5,
      wins: 2,
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBanUser = (userId: number, username: string) => {
    if (confirm(`Are you sure you want to ban ${username}?`)) {
      addToast(`User ${username} has been banned`, "success");
    }
  };

  const handlePromoteUser = (userId: number, username: string) => {
    if (confirm(`Are you sure you want to promote ${username} to admin?`)) {
      addToast(`User ${username} has been promoted to admin`, "success");
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage platform users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
            Export Users
          </Button>
          <Button className="bg-[#f34024] hover:bg-[#f34024]/90 text-white">
            <UserIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FilterIcon className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Filter Users</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-[#19191d] border border-[#292932] text-white rounded-md focus:border-[#f34024] focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="player">Players</option>
              <option value="admin">Admins</option>
            </select>
            
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
      {selectedUsers.length > 0 && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-[#292932] hover:text-white hover:bg-[#292932]">
                  <MailIcon className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  <BanIcon className="w-4 h-4 mr-2" />
                  Ban Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#292932]">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-[#292932] bg-[#19191d] text-[#f34024] focus:ring-[#f34024]"
                    />
                  </th>
                  <th className="text-left p-4 text-white font-medium">User</th>
                  <th className="text-left p-4 text-white font-medium">Role</th>
                  <th className="text-left p-4 text-white font-medium">Status</th>
                  <th className="text-left p-4 text-white font-medium">Tournaments</th>
                  <th className="text-left p-4 text-white font-medium">Last Active</th>
                  <th className="text-left p-4 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#292932] hover:bg-[#19191d]">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-[#292932] bg-[#19191d] text-[#f34024] focus:ring-[#f34024]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="text-white font-medium">{user.username}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          user.status === "active" ? "bg-green-500" :
                          user.status === "inactive" ? "bg-yellow-500" : "bg-red-500"
                        }`}></div>
                        <span className={`text-sm ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white text-sm">
                        {user.tournaments} total
                      </div>
                      <div className="text-gray-400 text-xs">
                        {user.wins} wins
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-400 text-sm">{user.lastActive}</div>
                      <div className="text-gray-500 text-xs">Joined {user.joinDate}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#292932] hover:text-white hover:bg-[#292932]"
                        >
                          View
                        </Button>
                        {user.role === "player" && user.status !== "banned" && (
                          <Button 
                            size="sm"
                            onClick={() => handlePromoteUser(user.id, user.username)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <ShieldIcon className="w-3 h-3 mr-1" />
                            Promote
                          </Button>
                        )}
                        {user.status !== "banned" && (
                          <Button 
                            size="sm"
                            onClick={() => handleBanUser(user.id, user.username)}
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <BanIcon className="w-3 h-3 mr-1" />
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No users found</div>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredUsers.length} of {users.length} users
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