"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Message } from "../types.d";
import { sendMessage } from "../utils/api";
import { createWebSocketClient } from "../utils/ws";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

function uniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      author: "assistant",
      content:
        "Hello! 👋 I’m your Ocean Professional AI assistant. How can I help you today?",
      ts: Date.now(),
    },
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<ReturnType<typeof createWebSocketClient> | null>(null);

  // Handle incoming WS (if supported)
  useEffect(() => {
    wsRef.current = createWebSocketClient();
    if (wsRef.current) {
      wsRef.current.onMessage((msg) => {
        setMessages((msgs) => [
          ...msgs,
          { ...msg, id: uniqueId(), author: "assistant" },
        ]);
      });
      return () => wsRef.current?.close();
    }
  }, []);

  // PUBLIC_INTERFACE
  const handleSend = useCallback(
    async (text: string) => {
      setError(null);
      setSending(true);
      const userMsg: Message = {
        id: uniqueId(),
        author: "user",
        content: text,
        ts: Date.now(),
      };
      setMessages((msgs) => [...msgs, userMsg]);

      let aiMsg: Message | null = null;
      // WebSocket (streaming) mode
      if (wsRef.current) {
        aiMsg = {
          id: uniqueId(),
          author: "assistant",
          content: "",
          ts: Date.now(),
          streaming: true,
        };
        setMessages((msgs) => [...msgs, aiMsg!]);
        try {
          wsRef.current.send(JSON.stringify({ content: text }));
        } catch {
          setError("Could not send message via WebSocket.");
        }
        setSending(false);
      } else {
        // REST (or mock) fallback
        try {
          const resp = await sendMessage({ content: text });
          aiMsg = {
            id: uniqueId(),
            author: resp.author ?? "assistant",
            content: resp.content,
            ts: Date.now(),
          };
          setMessages((msgs) => [...msgs, aiMsg!]);
        } catch (e: unknown) {
          setMessages((msgs) => [
            ...msgs,
            {
              id: uniqueId(),
              author: "error",
              content: typeof e === "string"
                ? e
                : (e instanceof Error
                  ? e.message
                  : "Unknown error"),
              ts: Date.now(),
              error: true,
            },
          ]);
          setError("Sorry, I couldn't process that. Try again.");
        } finally {
          setSending(false);
        }
      }
    },
    []
  );

  return (
    <div className="ocean-chat-container" role="region" aria-label="AI Chat">
      <div className="ocean-chat-header">Ocean Professional Chatbot</div>
      <MessageList messages={messages} />
      <div style={{ minHeight: "76px" }}>
        {error && <div className="ocean-message-error" aria-live="assertive">{error}</div>}
        <MessageInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
};
