import { SendMessagePayload, ApiResponse, AuthorType } from "../types.d";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const possibleAIResponses = [
  "Of course! How can I help you today?",
  "Here’s some information I found on that topic.",
  "I'm glad you asked. Let’s dive into it.",
  "Could you clarify your question a bit more?",
  "That's a great point. Would you like more details?",
  "I'm an AI assistant, how can I assist further?",
];

function randomAIResponse(): string {
  return possibleAIResponses[
    Math.floor(Math.random() * possibleAIResponses.length)
  ];
}

// PUBLIC_INTERFACE
export async function sendMessage(payload: SendMessagePayload): Promise<ApiResponse> {
  if (API_BASE && API_BASE !== "") {
    // Real API call
    const resp = await fetch(`${API_BASE.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      throw new Error("API Error: " + resp.status);
    }
    const data = await resp.json();
    return {
      content: data.content ?? "",
      author: (data.author ?? "assistant") as AuthorType,
    };
  } else {
    // Mock AI response: simulate streaming, pauses, and occasional errors
    await sleep(700 + Math.random() * 700);
    if (payload.content.toLowerCase().includes("error test")) {
      await sleep(400);
      throw new Error("Simulated mock API error.");
    }
    let content = randomAIResponse();
    if (payload.content.toLowerCase().includes("weather")) content = "I'm afraid I can't provide real weather info, but it's always sunny here!";
    return {
      content,
      author: "assistant",
    };
  }
}
