import { useCallback, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import type { ChatMessage } from "@/types/chat";

export const useChat = () => {
  const snap = useSnapshot(chatStore);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [snap.messages]);

  const sendMessage = useCallback((text: string) => {
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
      unreadCount: 0, // 읽음 표시
    };

    chatActions.addMessage(newMessage);
  }, []);

  const sendAudio = useCallback(() => {
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
      unreadCount: 0, // 읽음 표시
    };

    chatActions.addMessage(newMessage);
  }, []);

  const sendImage = useCallback((imageFile: File) => {
    console.log("Image file:", imageFile);
    // TODO: Implement image upload logic
  }, []);

  const sendCalendar = useCallback(() => {
    console.log("Calendar event creation");
    // TODO: Implement calendar event creation
  }, []);

  const handleAudioPlay = useCallback(
    (messageId: string) => {
      // Stop currently playing audio
      if (snap.playingAudioId && snap.playingAudioId !== messageId) {
        chatActions.setPlayingAudioId(null);
      }

      // Toggle current audio
      chatActions.setPlayingAudioId(
        snap.playingAudioId === messageId ? null : messageId
      );
    },
    [snap.playingAudioId]
  );

  const loadMoreMessages = useCallback(() => {
    chatActions.setLoading(true);
    // Simulate loading more messages
    setTimeout(() => {
      chatActions.setLoading(false);
    }, 1000);
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    chatActions.markAsRead(messageId);
  }, []);

  return {
    messages: snap.messages,
    currentRoom: snap.currentRoom,
    isLoading: snap.isLoading,
    isTyping: snap.isTyping,
    playingAudioId: snap.playingAudioId,
    messagesEndRef,
    sendMessage,
    sendAudio,
    sendImage,
    sendCalendar,
    handleAudioPlay,
    loadMoreMessages,
    markMessageAsRead,
  };
};
