import React, { useState, useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";

interface Message {
  id: string;
  type: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  audio?: {
    duration: number;
    isPlaying: boolean;
    onPlay: () => void;
  };
  time: string;
  unreadCount?: number;
}

interface ChatMessageListProps {
  messages?: Message[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ChatMessageList({
  messages = [],
  onLoadMore,
  isLoading = false,
}: ChatMessageListProps) {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sample messages for demonstration
  const sampleMessages: Message[] = [
    {
      id: "1",
      type: "other",
      name: "I'll kill you",
      avatar: "/src/assets/images/pierrot.png",
      text: "안녕하세요 제 실력 먼저 보여드리죠",
      time: "AM 12:47",
    },
    {
      id: "2",
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text: "안녕하세요 저는 Beck이에요 덤벼 ㅋㅋ",
      time: "AM 12:47",
    },
    {
      id: "3",
      type: "other",
      name: "I'll kill you",
      avatar: "/src/assets/images/pierrot.png",
      audio: {
        duration: 30,
        isPlaying: playingAudioId === "3",
        onPlay: () => handleAudioPlay("3"),
      },
      time: "AM 12:48",
    },
    {
      id: "4",
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text: "와 칠 줄 아시네",
      time: "AM 12:52",
      unreadCount: 1,
    },
  ];

  const displayMessages = messages.length > 0 ? messages : sampleMessages;

  const handleAudioPlay = (messageId: string) => {
    // Stop currently playing audio
    if (playingAudioId && playingAudioId !== messageId) {
      setPlayingAudioId(null);
    }

    // Toggle current audio
    setPlayingAudioId(playingAudioId === messageId ? null : messageId);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && onLoadMore && !isLoading) {
      onLoadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-0 py-4"
      onScroll={handleScroll}
    >
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      )}

      <div className="space-y-2">
        {displayMessages.map((message) => (
          <ChatMessageItem
            key={message.id}
            type={message.type}
            name={message.name}
            avatar={message.avatar}
            text={message.text}
            audio={message.audio}
            time={message.time}
            unreadCount={message.unreadCount}
          />
        ))}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
