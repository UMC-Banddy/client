import React, { useState, useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
  messages?: readonly ChatMessage[];
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
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            type={message.type}
            name={message.name}
            avatar={message.avatar}
            text={message.text}
            audio={
              message.audio
                ? {
                    ...message.audio,
                    isPlaying: playingAudioId === message.id,
                    onPlay: () => handleAudioPlay(message.id),
                  }
                : undefined
            }
            time={message.time}
            unreadCount={message.unreadCount}
          />
        ))}
      </div>

      <div ref={messagesEndRef} className="pb-32" />
    </div>
  );
}
