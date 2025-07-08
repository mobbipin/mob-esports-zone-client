import { useEffect, useRef, useState, useCallback } from "react";
import { WSClient, WSMessage } from "../lib/ws";

export function useWebSocket(token: string | null) {
  const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<WSClient | null>(null);

  // Send a message
  const send = useCallback((msg: WSMessage) => {
    wsRef.current?.send(msg);
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("closed");
      return;
    }
    const ws = new WSClient(token);
    wsRef.current = ws;

    const listener = (msg: WSMessage) => {
      if (msg.type === "ws:open") setStatus("open");
      else if (msg.type === "ws:close") setStatus("closed");
      else if (msg.type === "ws:error") setStatus("error");
      else setLastMessage(msg);
    };
    ws.addListener(listener);

    return () => {
      ws.removeListener(listener);
      ws.close();
    };
  }, [token]);

  return { status, send, lastMessage, ws: wsRef.current };
} 