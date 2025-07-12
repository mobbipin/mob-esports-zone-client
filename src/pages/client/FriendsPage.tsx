import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../lib/api";
import { useWebSocket } from "../../hooks/useWebSocket";
import toast from "react-hot-toast";

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState(user?.isPublic ?? 1);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { lastMessage } = useWebSocket(localStorage.getItem("token"));

  useEffect(() => {
    fetchFriends();
    fetchPending();
    setPrivacy(user?.isPublic ?? 1);
    // eslint-disable-next-line
  }, [user]);

  // WebSocket: Listen for real-time friend updates
  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "friend:update") {
      fetchFriends();
      fetchPending();
    } else if (lastMessage.type === "friend:request") {
      toast.success("New friend request received!");
      fetchPending();
    }
  }, [lastMessage]);

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
      // Pending requests: status !== 'accepted' and user is recipient
      // We'll filter after fetching all
      const res = await apiFetch<any>("/friends");
      setPending((res.data || []).filter((f: any) => f.status !== "accepted" && f.friendId === user?.id));
    } catch {
      setPending([]);
    }
  };
  const handleSearch = async () => {
    if (!search) return;
    try {
      // Use /players?search=... to find users
      const res = await apiFetch<any>(`/players?search=${encodeURIComponent(search)}`);
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    }
  };
  const sendRequest = async (friendId: string) => {
    try {
      await apiFetch("/friends/request", { method: "POST", body: JSON.stringify({ friendId }) });
      toast.success("Friend request sent");
      setRequestSent((prev) => [...prev, friendId]);
      setSearchResults((results) => results.filter((u) => u.id !== friendId));
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
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

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Friends</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Card className="bg-[#15151a] border-[#292932] mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
              <Button onClick={handleSearch} className="bg-[#f34024] text-white">Search</Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mb-4">
                <div className="text-white mb-2">Search Results:</div>
                <div className="space-y-2">
                  {searchResults.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between bg-[#19191d] p-3 rounded">
                      <div className="flex items-center gap-3">
                        <img src={u.playerProfile?.avatar || u.avatar || "https://via.placeholder.com/40x40?text=U"} alt={u.username} className="w-8 h-8 rounded-full" />
                        <span className="text-white font-medium">{u.displayName || u.username}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendRequest(u.id)}
                        className="bg-blue-600 text-white"
                        disabled={requestSent.includes(u.id)}
                      >
                        {requestSent.includes(u.id) ? "Requested" : "Add Friend"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-6">
              <span className="text-white">Account Privacy:</span>
              <Button onClick={togglePrivacy} className={privacy ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                {privacy ? "Public (anyone can DM)" : "Private (only friends can DM)"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Friends</h2>
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : friends.length === 0 ? (
                <div className="text-gray-400">No friends yet.</div>
              ) : (
                <ul className="space-y-3">
                  {friends.map((f: any) => (
                    <li key={f.id} className="flex items-center gap-3 bg-[#19191d] p-3 rounded">
                      <img src={f.avatar || "https://via.placeholder.com/40x40?text=F"} alt={f.username} className="w-8 h-8 rounded-full" />
                      <span className="text-white font-medium">{f.displayName || f.username}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Pending Requests</h2>
              {pending.length === 0 ? (
                <div className="text-gray-400">No pending requests.</div>
              ) : (
                <ul className="space-y-3">
                  {pending.map((f: any) => (
                    <li key={f.id} className="flex items-center justify-between bg-[#19191d] p-3 rounded">
                      <div className="flex items-center gap-3">
                        <img src={f.avatar || "https://via.placeholder.com/40x40?text=P"} alt={f.username} className="w-8 h-8 rounded-full" />
                        <span className="text-white font-medium">{f.displayName || f.username}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 text-white" onClick={() => acceptRequest(f.id)}>Accept</Button>
                        <Button size="sm" className="bg-red-600 text-white" onClick={() => rejectRequest(f.id)}>Reject</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage; 