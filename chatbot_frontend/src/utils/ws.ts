import { Message, ChatWebSocket } from "../types.d";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

type MessageCb = (msg: Message) => void;

class WebSocketClient implements ChatWebSocket {
  private socket: WebSocket | null = null;
  private url: string;
  public connected: boolean = false;
  private messageCb: MessageCb | null = null;
  private reconnectTries: number = 0;
  private isClosed = false;
  private reconnectTimeout?: number;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  connect() {
    this.socket = new window.WebSocket(this.url);

    this.socket.onopen = () => {
      this.connected = true;
      this.reconnectTries = 0;
    };

    this.socket.onmessage = (e) => {
      if (this.messageCb) {
        try {
          const raw = JSON.parse(e.data);
          if (raw && typeof raw.content === "string") {
            this.messageCb({
              id: Date.now().toString() + Math.random().toString(36),
              author: raw.author ?? "assistant",
              content: raw.content,
              ts: Date.now(),
              streaming: false,
              error: !!raw.error,
            });
          }
        } catch {
          // ignore invalid messages 
        }
      }
    };

    this.socket.onclose = () => {
      this.connected = false;
      if (!this.isClosed) {
        this.reconnect();
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  reconnect() {
    if (this.reconnectTries < 6) {
      this.reconnectTries += 1;
      const ms = 1200 + Math.random() * 2100 * this.reconnectTries;
      this.reconnectTimeout = window.setTimeout(() => this.connect(), ms);
    }
  }

  send(msg: string) {
    if (this.socket && this.connected && this.socket.readyState === 1) {
      this.socket.send(msg);
    }
  }

  close() {
    this.isClosed = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.socket?.close();
  }

  onMessage(cb: MessageCb) {
    this.messageCb = cb;
  }
}

// PUBLIC_INTERFACE
export function createWebSocketClient(): ChatWebSocket | null {
  if (typeof window === "undefined" || !WS_URL || WS_URL === "") return null;
  try {
    return new WebSocketClient(WS_URL);
  } catch {
    return null;
  }
}
