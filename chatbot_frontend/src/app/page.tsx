import { ChatWindow } from "../components/ChatWindow";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-gray-50"
      aria-label="AI chatbot main area"
    >
      <ChatWindow />
    </main>
  );
}
