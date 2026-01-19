import { Chat } from "@/components/Chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Uncle Rommy",
  openGraph: {
    title: "Chat with Uncle Rommy",
  },
};

export default function ChatPage() {
  return (
    <div className="h-full">
      <Chat />
    </div>
  );
}
