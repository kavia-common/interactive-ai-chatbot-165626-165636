export type AuthorType = "user" | "assistant" | "system" | "error";

export type Message = {
  id: string;
  author: AuthorType;
  content: string;
  ts: number;
  streaming?: boolean;
  error?: boolean;
};

export type SendMessagePayload = {
  content: string;
};

export type ApiResponse = {
  content: string;
  author: AuthorType;
};

export interface ChatWebSocket {
  send: (msg: string) => void;
  close: () => void;
  connected: boolean;
  onMessage: (cb: (msg: Message) => void) => void;
}

export type MockApiMode = "success" | "error";
