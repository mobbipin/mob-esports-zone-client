import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { apiFetch } from "../../lib/api";
import { useLocation } from "react-router-dom";

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selected) fetchMessages(selected);
    // eslint-disable-next-line
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // If opened with ?user=ID, auto-select that user
    const params = new URLSearchParams(location.search);
    const userId = params.get("user");
    const userName = params.get("name");
    const userAvatar = params.get("avatar");
    if (userId) {
      let conv = conversations.find((c) => c.recipientId === userId || c.senderId === userId);
      if (!conv && userId !== user?.id) {
        // Create a temp conversation object for new chat
        conv = { recipientId: userId, senderId: user?.id, displayName: userName || "", username: userName || "", avatar: userAvatar || "", messages: [] };
        setConversations((prev) => [conv, ...prev]);
      }
      if (conv) setSelected(conv);
    }
    // Poll for new messages every 5s
    const interval = setInterval(() => {
      if (selected) fetchMessages(selected);
      fetchConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [location.search, conversations, selected]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Inbox + sent for now, can be improved to show unique conversations
      const inbox = await apiFetch<any>("/messages/inbox");
      const sent = await apiFetch<any>("/messages/sent");
      // Group by user or team
      const all = [...(inbox.data || []), ...(sent.data || [])];
      // Unique by recipientId or teamId
      const convMap: Record<string, any> = {};
      all.forEach((msg: any) => {
        const key = msg.teamId ? `team-${msg.teamId}` : `user-${msg.senderId === user?.id ? msg.recipientId : msg.senderId}`;
        if (!convMap[key]) convMap[key] = msg;
      });
      setConversations(Object.values(convMap));
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchMessages = async (conv: any) => {
    setLoading(true);
    try {
      let msgs = [];
      if (conv.teamId) {
        // Tournament group chat
        const res = await apiFetch<any>(`/messages/tournament-group?tournamentId=${conv.tournamentId}`);
        msgs = res.data || [];
      } else {
        // 1:1 chat
        const inbox = await apiFetch<any>("/messages/inbox");
        const sent = await apiFetch<any>("/messages/sent");
        msgs = [...(inbox.data || []), ...(sent.data || [])].filter(
          (m: any) =>
            (m.senderId === user?.id && m.recipientId === conv.recipientId) ||
            (m.recipientId === user?.id && m.senderId === conv.senderId)
        );
        msgs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      setMessages(msgs);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };
  const sendMessage = async () => {
    if (!input.trim() || !selected) return;
    try {
      if (selected.teamId) {
        // Only admin can send in group
        if (user?.role !== "admin") return;
        await apiFetch("/messages", {
          method: "POST",
          body: JSON.stringify({ teamId: selected.teamId, content: input, isBulk: 1 })
        });
      } else {
        await apiFetch("/messages", {
          method: "POST",
          body: JSON.stringify({ recipientId: selected.recipientId, content: input })
        });
      }
      setInput("");
      fetchMessages(selected);
      fetchConversations();
    } catch (err: any) {
      addToast(err.message || "Failed to send message", "error");
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await apiFetch<any>("/friends");
      setFriends((res.data || []).filter((f: any) => f.status === "accepted"));
    } catch {
      setFriends([]);
    }
  };

  // In the conversation list, show all friends as well
  const allConversations = [
    ...(user ? friends.map((f) => ({
      id: f.friendId === user.id ? f.userId : f.friendId,
      displayName: f.friendId === user.id ? f.userDisplayName : f.friendDisplayName,
      username: f.friendId === user.id ? f.userUsername : f.friendUsername,
      avatar: f.friendId === user.id ? f.userAvatar : f.friendAvatar,
      banned: f.friendId === user.id ? f.userBanned : f.friendBanned,
      isFriend: true,
    })) : []),
    ...conversations.filter((c) => user && c.recipientId !== user.id && c.senderId !== user.id),
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
        {/* Conversations List */}
        <div className="w-1/3">
          <Card className="bg-[#15151a] border-[#292932]">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold text-white mb-4">Conversations</h2>
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : allConversations.length === 0 ? (
                <div className="text-gray-400">No conversations yet.</div>
              ) : (
                <ul className="space-y-2">
                  {allConversations.map((conv: any, i) => (
                    <li key={conv.id || i} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selected && (selected.recipientId === conv.id || selected.senderId === conv.id) ? "bg-[#292932]" : "hover:bg-[#19191d]"}`} onClick={() => setSelected(conv)}>
                      <img src={conv.avatar || "https://via.placeholder.com/40x40?text=U"} alt={conv.displayName || conv.username} className="w-8 h-8 rounded-full" />
                      <span className="text-white font-medium">{conv.displayName || conv.username}</span>
                      {conv.banned === 1 && <span className="ml-2 px-2 py-0.5 rounded bg-red-700 text-white text-xs">Banned</span>}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Chat Window */}
        <div className="flex-1">
          <Card className="bg-[#15151a] border-[#292932] h-full flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col h-[600px]">
              {selected && (
                <div className="flex items-center gap-3 mb-4">
                  <img src={selected.avatar || "https://via.placeholder.com/40x40?text=U"} alt={selected.displayName || selected.username} className="w-10 h-10 rounded-full" />
                  <span className="text-white font-bold text-lg">{selected.displayName || selected.username}</span>
                </div>
              )}
              {selected ? (
                <>
                  <div className="flex-1 overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <div className="text-gray-400">No messages yet.</div>
                    ) : (
                      messages.map((msg: any, i: number) => (
                        <div key={i} className={`mb-2 flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`} >
                          <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === user?.id ? "bg-[#f34024] text-white" : "bg-[#292932] text-white"}`} >
                            {msg.content}
                            <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                      placeholder="Type a message..."
                      className="bg-[#19191d] border-[#292932] text-white"
                      disabled={selected.teamId && user?.role !== "admin"}
                    />
                    <Button onClick={sendMessage} className="bg-[#f34024] text-white" disabled={selected.teamId && user?.role !== "admin"}>Send</Button>
                  </div>
                  {selected.teamId && user?.role !== "admin" && (
                    <div className="text-xs text-gray-400 mt-2">Only admins can send messages in this group.</div>
                  )}
                </>
              ) : (
                <div className="text-gray-400">Select a conversation to start chatting.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 