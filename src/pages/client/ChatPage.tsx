import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const { status, send, lastMessage } = useWebSocket(localStorage.getItem("token"));

  // Listen for incoming chat messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === "chat:message") {
      setMessages((msgs) => [...msgs, { from: lastMessage.from, text: lastMessage.text }]);
    }
  }, [lastMessage]);

  // Send a message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // For 1:1 chat, set to: userId. For group, set to: roomId.
      send({ type: "chat:send", to: "global", text: input });
      setInput("");
    }
  };

  return (
    <div>
      <h2>Chat ({status})</h2>
      <div style={{ minHeight: 200, border: "1px solid #ccc", marginBottom: 8, padding: 8 }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.from}:</b> {msg.text}</div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={status !== "open"}>Send</button>
      </form>
    </div>
  );
};

export default ChatPage; 