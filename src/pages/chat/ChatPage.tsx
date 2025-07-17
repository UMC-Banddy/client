import ChatHeader from "@/pages/chat/_components/ChatHeader";
import ChatDateDivider from "@/pages/chat/_components/ChatDateDivider";
import ChatMessageList from "@/pages/chat/_components/ChatMessageList";
import ChatInputBar from "@/pages/chat/_components/ChatInputBar";

export default function ChatPage() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader />
      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-3xl pt-2 px-0 overflow-hidden">
        <ChatDateDivider date="2025.06.14" />
        <ChatMessageList />
      </div>
      <ChatInputBar />
    </main>
  );
}
