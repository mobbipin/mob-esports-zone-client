import React, { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, EyeIcon, BanIcon, CrownIcon, UserCheckIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

// Add Modal component (styled like DeleteDialog)
const Modal = ({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#19191d] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#292932]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg text-white font-semibold">{title}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const UsersManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [banDialog, setBanDialog] = useState<{ open: boolean, userId?: string, username?: string }>({ open: false });
  const [promoteDialog, setPromoteDialog] = useState<{ open: boolean, userId?: string, username?: string }>({ open: false });
  const [bulkBanDialog, setBulkBanDialog] = useState(false);
  const [unbanDialog, setUnbanDialog] = useState<{ open: boolean, userId?: string, username?: string }>({ open: false });
  const [pendingOrganizers, setPendingOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState(false);
  const [unapproveDialog, setUnapproveDialog] = useState<{ open: boolean, userId?: string, username?: string }>({ open: false });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = `/players?page=${page}&limit=${limit}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await apiFetch<any>(query);
      setUsers(Array.isArray(res.data) ? res.data : []);
      setTotal(res.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load users");
      console.error("Users API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrganizers = async () => {
    setOrganizersLoading(true);
    try {
      const res = await apiFetch<any>('/auth/pending-organizers');
      setPendingOrganizers(res.data || []);
    } catch (err: any) {
      console.error("Pending organizers API error:", err);
    } finally {
      setOrganizersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingOrganizers();
    // eslint-disable-next-line
  }, [page, searchTerm]);

  // Map banned field to status for admin UI
  const mappedUsers = users.map(user => ({
    ...user,
    status: user.banned === 1 ? 'banned' : (user.status || 'active'),
  }));
  const filteredUsers = mappedUsers.filter(user => {
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

  const handleViewUser = async (userId: string) => {
    setActionLoading(true);
    try {
      const res = await apiFetch<any>(`/players/${userId}`);
      setViewUser(res.data);
      setViewModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || err?.toString() || 'Failed to load user details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    setActionLoading(true);
    try {
      await apiFetch(`/players/${userId}/ban`, { method: "PUT" }, true, false); // Don't show error toast here
      toast.success("User banned successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to ban user");
    } finally {
      setActionLoading(false);
      setBanDialog({ open: false });
    }
  };

  const handlePromoteUser = async (userId: string) => {
    setActionLoading(true);
    try {
      await apiFetch(`/players/${userId}/promote`, { method: "PUT" }, true, false); // Don't show error toast here
      toast.success("User promoted to admin successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to promote user");
    } finally {
      setActionLoading(false);
      setPromoteDialog({ open: false });
    }
  };

  const handleBulkBan = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to ban");
      return;
    }
    setActionLoading(true);
    try {
      await apiFetch("/players/bulk-ban", {
        method: "PUT",
        body: JSON.stringify({ userIds: selectedUsers })
      }, true, false); // Don't show error toast here
      toast.success(`${selectedUsers.length} users banned successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to ban users");
    } finally {
      setActionLoading(false);
      setBulkBanDialog(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(true);
    try {
      await apiFetch(`/players/${userId}/unban`, { method: "PUT" }, true, false); // Don't show error toast here
      toast.success("User unbanned successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to unban user");
    } finally {
      setActionLoading(false);
      setUnbanDialog({ open: false });
    }
  };

  const handleApproveOrganizer = async (organizerId: string) => {
    setActionLoading(true);
    try {
      await apiFetch('/auth/approve-organizer', {
        method: 'POST',
        body: JSON.stringify({ organizerId })
      }, true, false);
      toast.success("Tournament organizer approved successfully");
      fetchPendingOrganizers();
      fetchUsers(); // Refresh users list as well
    } catch (err: any) {
      toast.error(err.message || "Failed to approve organizer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnapproveOrganizer = async (userId: string) => {
    setActionLoading(true);
    try {
      await apiFetch('/auth/unapprove-organizer', {
        method: 'POST',
        body: JSON.stringify({ organizerId: userId })
      }, true, false);
      toast.success("Tournament organizer unapproved successfully");
      fetchPendingOrganizers();
      fetchUsers(); // Refresh users list as well
    } catch (err: any) {
      toast.error(err.message || "Failed to unapprove organizer");
    } finally {
      setActionLoading(false);
      setUnapproveDialog({ open: false });
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

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton height={40} width={300} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <Skeleton key={i} height={120} className="mb-4" />)}
        </div>
      </div>
    </div>
  );

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
            <UserCheckIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Pending Tournament Organizers */}
      {pendingOrganizers.length > 0 && (
        <Card className="bg-[#15151a] border-[#292932]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <CrownIcon className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-white">Pending Tournament Organizers</h2>
              <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                {pendingOrganizers.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {pendingOrganizers.map((organizer) => (
                <div key={organizer.id} className="flex items-center justify-between p-3 bg-[#19191d] rounded-lg border border-[#292932]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {organizer.username?.charAt(0).toUpperCase() || organizer.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{organizer.username || 'No username'}</div>
                      <div className="text-gray-400 text-sm">{organizer.email}</div>
                      <div className="text-gray-500 text-xs">
                        Registered: {new Date(organizer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveOrganizer(organizer.id)}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading ? "Approving..." : "Approve"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <option value="tournament_organizer">Tournament Organizers</option>
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
                  <UserCheckIcon className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white" onClick={handleBulkBan}>
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
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading users...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
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
                          (user.role || "player") === "admin" ? "bg-purple-600 text-white" : 
                          (user.role || "player") === "tournament_organizer" ? "bg-orange-600 text-white" :
                          "bg-blue-600 text-white"
                        }`}>
                          {(user.role || "player") === "tournament_organizer" ? "Tournament Organizer" : 
                           (user.role || "player").charAt(0).toUpperCase() + (user.role || "player").slice(1)}
                        </span>
                        {user.role === "tournament_organizer" && (
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.isApproved ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                            }`}>
                              {user.isApproved ? "Approved" : "Pending Approval"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            (user.status || "active") === "active" ? "bg-green-500" :
                            (user.status || "active") === "inactive" ? "bg-yellow-500" : "bg-red-500"
                          }`}></div>
                          <span className={`text-sm ${getStatusColor(user.status || "active")}`}>
                            {(user.status || "active").charAt(0).toUpperCase() + (user.status || "active").slice(1)}
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
                            onClick={() => handleViewUser(user.id)}
                          >
                            View
                          </Button>
                          {user.role === "tournament_organizer" && user.isApproved && (
                            <Button
                              size="sm"
                              onClick={() => setUnapproveDialog({ open: true, userId: user.id, username: user.username })}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              Unapprove
                            </Button>
                          )}
                          {user.status === "banned" ? (
                            <Button
                              size="sm"
                              onClick={() => handleUnbanUser(user.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Unban
                            </Button>
                          ) : (
                            <>
                              {user.role === "player" && user.status !== "banned" && (
                                <Button
                                  size="sm"
                                  onClick={() => handlePromoteUser(user.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  <CrownIcon className="w-3 h-3 mr-1" />
                                  Promote
                                </Button>
                              )}
                              {user.status !== "banned" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleBanUser(user.id)}
                                  variant="outline"
                                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                  <BanIcon className="w-3 h-3 mr-1" />
                                  Ban
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Modals/Dialogs */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="User Details">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={viewUser.avatar} alt={viewUser.username} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-white">{viewUser.username}</h3>
                <p className="text-gray-400 text-sm">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Role:</p>
                <p className="text-white font-medium">{viewUser.role || "Player"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status:</p>
                <p className="text-white font-medium">{viewUser.status || "Active"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tournaments:</p>
                <p className="text-white font-medium">{viewUser.tournaments || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Wins:</p>
                <p className="text-white font-medium">{viewUser.wins || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Active:</p>
                <p className="text-white font-medium">{viewUser.lastActive}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Join Date:</p>
                <p className="text-white font-medium">{viewUser.joinDate}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={banDialog.open} onClose={() => setBanDialog({ open: false })} title="Ban User">
        <div className="text-white">Are you sure you want to ban user <b>{banDialog.username}</b>? This action cannot be undone.</div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setBanDialog({ open: false })} variant="outline">Cancel</Button>
          <Button onClick={() => handleBanUser(banDialog.userId!)} className="bg-red-600 text-white" disabled={actionLoading}>{actionLoading ? "Banning..." : "Ban"}</Button>
        </div>
      </Modal>
      <Modal open={promoteDialog.open} onClose={() => setPromoteDialog({ open: false })} title="Promote User">
        <div>Are you sure you want to promote user <b>{promoteDialog.username}</b> to admin?</div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setPromoteDialog({ open: false })} variant="outline">Cancel</Button>
          <Button onClick={() => handlePromoteUser(promoteDialog.userId!)} className="bg-purple-600 text-white" disabled={actionLoading}>{actionLoading ? "Promoting..." : "Promote"}</Button>
        </div>
      </Modal>
      <Modal open={bulkBanDialog} onClose={() => setBulkBanDialog(false)} title="Ban Users">
        <div className="text-white">Are you sure you want to ban <b>{selectedUsers.length}</b> user(s)? This action cannot be undone.</div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setBulkBanDialog(false)} variant="outline">Cancel</Button>
          <Button onClick={handleBulkBan} className="bg-red-600 text-white" disabled={actionLoading}>{actionLoading ? "Banning..." : "Ban All"}</Button>
        </div>
      </Modal>
      <Modal open={unbanDialog.open} onClose={() => setUnbanDialog({ open: false })} title="Unban User">
        <div className="text-white">Are you sure you want to unban user <b>{unbanDialog.username}</b>?</div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setUnbanDialog({ open: false })} variant="outline">Cancel</Button>
          <Button onClick={() => handleUnbanUser(unbanDialog.userId!)} className="bg-green-600 text-white" disabled={actionLoading}>{actionLoading ? "Unbanning..." : "Unban"}</Button>
        </div>
      </Modal>
      <Modal open={unapproveDialog.open} onClose={() => setUnapproveDialog({ open: false })} title="Unapprove Organizer">
        <div className="text-white">Are you sure you want to unapprove tournament organizer <b>{unapproveDialog.username}</b>? They will need to reapply for approval.</div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setUnapproveDialog({ open: false })} variant="outline">Cancel</Button>
          <Button onClick={() => handleUnapproveOrganizer(unapproveDialog.userId!)} className="bg-yellow-600 text-white" disabled={actionLoading}>{actionLoading ? "Unapproving..." : "Unapprove"}</Button>
        </div>
      </Modal>
    </div>
  );
};