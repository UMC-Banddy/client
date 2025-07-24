import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatHeader,
  ChatDateDivider,
  ChatMessageList,
  ChatInputBar,
  type ChatMessage,
} from "@/shared/components/ChatComponents";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSettings = useCallback(() => {
    // Settings modal or navigation logic
    console.log("Settings clicked");
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendAudio = useCallback((audioBlob: Blob) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      audio: {
        duration: 30,
        isPlaying: false,
        onPlay: () => console.log("Play audio"),
      },
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendImage = useCallback((imageFile: File) => {
    // Handle image upload logic
    console.log("Image file:", imageFile);
  }, []);

  const handleSendCalendar = useCallback(() => {
    // Handle calendar event creation
    console.log("Calendar event creation");
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading more messages
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader onBack={handleBack} onSettings={handleSettings} />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider />
        <ChatMessageList
          messages={messages}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </div>

      <ChatInputBar
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onSendImage={handleSendImage}
        onSendCalendar={handleSendCalendar}
      />
    </div>
  );
}
