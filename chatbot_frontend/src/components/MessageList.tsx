import React, { useRef, useEffect } from "react";
import { Message } from "../types.d";

type Props = {
  messages: Message[];
};

const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};

// PUBLIC_INTERFACE
export const MessageList: React.FC<Props> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(listRef);
  }, [messages]);

  return (
    <div
      className="ocean-message-list"
      ref={listRef}
      role="log"
      aria-live="polite"
      tabIndex={0}
      aria-label="Chat conversation"
      style={{ outline: "none" }}
      data-testid="message-list"
    >
      {messages.map((m) => (
        <div
          className={`ocean-message ${m.author} ${m.error ? "error" : ""}`}
          key={m.id}
          aria-atomic="true"
        >
          <div
            className={`ocean-message-bubble ${m.author}${m.error ? " ocean-message-error" : ""}`}
            aria-label={`${m.author === "user" ? "You" : "Assistant"}:`}
          >
            {m.content}
            {m.streaming && (
              <span className="animate-pulse text-gray-400" aria-hidden>
                ▋
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
