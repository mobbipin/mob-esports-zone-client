// WebSocket client utility for Bun real-time chat/notifications

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8788/ws";

export type WSMessage = {
  type: string;
  [key: string]: any;
};

export type WSListener = (msg: WSMessage) => void;

export class WSClient {
  private ws: WebSocket | null = null;
  private listeners: Set<WSListener> = new Set();
  private token: string;
  private reconnectTimeout: any = null;
  private reconnectDelay = 2000;
  public connected = false;

  constructor(token: string) {
    this.token = token;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(`${WS_URL}?token=${this.token}`);
    this.ws.onopen = () => {
      this.connected = true;
      this.listeners.forEach((cb) => cb({ type: "ws:open" }));
    };
    this.ws.onclose = () => {
      this.connected = false;
      this.listeners.forEach((cb) => cb({ type: "ws:close" }));
      this.reconnect();
    };
    this.ws.onerror = (e) => {
      this.listeners.forEach((cb) => cb({ type: "ws:error", error: e }));
    };
    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        this.listeners.forEach((cb) => cb(msg));
      } catch {
        // Ignore invalid JSON
      }
    };
  }

  private reconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => this.connect(), this.reconnectDelay);
  }

  send(msg: WSMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  addListener(cb: WSListener) {
    this.listeners.add(cb);
  }

  removeListener(cb: WSListener) {
    this.listeners.delete(cb);
  }

  close() {
    if (this.ws) this.ws.close();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
  }
} 