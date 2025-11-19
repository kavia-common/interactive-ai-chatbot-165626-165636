import React, { useState, useRef, useEffect } from "react";

type Props = {
  onSend: (msg: string) => void;
  disabled: boolean;
};

export const MessageInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (input.trim().length === 0) return;
    onSend(input.trim());
    setInput("");
  };

  useEffect(() => {
    // Focus input on mount (except mobile)
    if (window.innerWidth > 700 && inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <form
      className="ocean-chat-input-bar"
      aria-label="Type your message"
      onSubmit={handleSend}
      autoComplete="off"
    >
      <input
        ref={inputRef}
        type="text"
        aria-label="Message input"
        name="message"
        placeholder="Type a message…"
        autoComplete="off"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) handleSend(e);
        }}
        tabIndex={0}
        maxLength={750}
        required
        spellCheck
      />
      <button
        className="ocean-send-btn"
        type="submit"
        aria-label="Send"
        disabled={disabled || input.trim().length === 0}
        aria-disabled={disabled || input.trim().length === 0}
        tabIndex={0}
      >
        Send
      </button>
    </form>
  );
};
