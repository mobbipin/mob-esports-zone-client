import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { UserPlus, Users, Clock, Search, Check, X } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState(user?.isPublic ?? 1);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [requestPending, setRequestPending] = useState<{ [id: string]: string }>({}); // receiverId: requestId
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
    fetchPending();
    setPrivacy(user?.isPublic ?? 1);
    // eslint-disable-next-line
  }, [user]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>("/friends");
      setFriends(res.data || []);
      setError(null);
    } catch (err: any) {
      setFriends([]);
      setError(err?.message || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };
  const fetchPending = async () => {
    try {
      const res = await apiFetch<any>("/friends");
      setPending((res.data || []).filter((f: any) => f.status !== "accepted" && f.friendId === user?.id));
      // Track outgoing requests
      const outgoing = (res.data || []).filter((f: any) => f.status !== "accepted" && f.userId === user?.id);
      const pendingMap: { [id: string]: string } = {};
      outgoing.forEach((req: any) => {
        pendingMap[req.friendId] = req.id;
      });
      setRequestPending(pendingMap);
    } catch {
      setPending([]);
      setRequestPending({});
    }
  };
  const handleSearch = async () => {
    if (!search) return;
    try {
      const res = await apiFetch<any>(`/players?search=${encodeURIComponent(search)}`);
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    }
  };
  const sendRequest = async (receiverId: string) => {
    try {
      await apiFetch("/friends/request", { method: "POST", body: JSON.stringify({ receiverId, senderName: user?.username }) });
      toast.success("Friend request sent");
      setRequestSent((prev) => [...prev, receiverId]);
      setSearchResults((results) => results.filter((u) => u.id !== receiverId));
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    }
  };
  const cancelRequest = async (receiverId: string) => {
    try {
      const requestId = requestPending[receiverId];
      if (!requestId) return;
      await apiFetch(`/friends/${requestId}/cancel`, { method: "POST" });
      toast.success("Friend request cancelled");
      setRequestSent((prev) => prev.filter((id) => id !== receiverId));
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel request");
    }
  };
  const acceptRequest = async (id: string) => {
    try {
      await apiFetch(`/friends/${id}/accept`, { method: "PUT" });
      toast.success("Friend request accepted");
      fetchFriends();
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Failed to accept request");
    }
  };
  const rejectRequest = async (id: string) => {
    try {
      await apiFetch(`/friends/${id}/reject`, { method: "PUT" });
      toast.success("Friend request rejected");
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject request");
    }
  };
  const togglePrivacy = async () => {
    try {
      await apiFetch("/friends/privacy", { method: "PUT", body: JSON.stringify({ isPublic: !privacy }) });
      setPrivacy((p) => (p ? 0 : 1));
      toast.success("Privacy updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update privacy");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton height={40} width={200} className="mb-8" />
          <Skeleton height={200} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton height={300} />
            <Skeleton height={300} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Friends</h1>
          <p className="text-gray-400">Connect with other players and manage your friend requests</p>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <div className="text-red-400">{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="bg-[#15151a] border-[#292932] mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users by username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024] pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
                disabled={!search.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-3">
                  {searchResults.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between bg-[#19191d] p-4 rounded-lg border border-[#292932]">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatar || "/assets/logo.png"} 
                          alt={u.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{u.displayName || u.username}</div>
                          <div className="text-gray-400 text-sm">@{u.username}</div>
                        </div>
                      </div>
                      {requestPending[u.id] ? (
                        <Button
                          size="sm"
                          onClick={() => cancelRequest(u.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel Request
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => sendRequest(u.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={requestSent.includes(u.id)}
                        >
                          {requestSent.includes(u.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Requested
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add Friend
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            <div className="flex items-center justify-between pt-4 border-t border-[#292932]">
              <div>
                <span className="text-white font-medium">Account Privacy</span>
                <p className="text-gray-400 text-sm">
                  {privacy ? "Your profile is public and searchable" : "Your profile is private"}
                </p>
              </div>
              <Button 
                onClick={togglePrivacy} 
                variant="outline"
                className={`border-[#292932] ${privacy ? "bg-green-600/20 text-green-400 border-green-500" : "bg-gray-600/20 text-gray-400"}`}
              >
                {privacy ? "Public" : "Private"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friends and Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Friends List */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#f34024]" />
                <h2 className="text-xl font-bold text-white">Your Friends ({friends.length})</h2>
              </div>
              
              {friends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <div className="text-gray-400 mb-2">No friends yet</div>
                  <div className="text-gray-500 text-sm">Search for users above to add friends</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 bg-[#19191d] p-4 rounded-lg border border-[#292932]">
                      <img 
                        src={f.avatar || "/assets/logo.png"} 
                        alt={f.username} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{f.displayName || f.username}</div>
                        <div className="text-gray-400 text-sm">@{f.username}</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-[#f34024]" />
                <h2 className="text-xl font-bold text-white">Pending Requests ({pending.length})</h2>
              </div>
              
              {pending.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <div className="text-gray-400 mb-2">No pending requests</div>
                  <div className="text-gray-500 text-sm">Friend requests will appear here</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((f: any) => (
                    <div key={f.id} className="flex items-center justify-between bg-[#19191d] p-4 rounded-lg border border-[#292932]">
                      <div className="flex items-center gap-3">
                        <img 
                          src={f.avatar || "/assets/logo.png"} 
                          alt={f.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{f.displayName || f.username}</div>
                          <div className="text-gray-400 text-sm">@{f.username}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white" 
                          onClick={() => acceptRequest(f.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white" 
                          onClick={() => rejectRequest(f.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage; 