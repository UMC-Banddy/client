import { proxy } from "valtio";
import type { ChatState, ChatMessage, ChatRoom } from "@/types/chat";

export const chatStore = proxy<ChatState>({
  messages: [],
  currentRoom: null,
  isLoading: false,
  isTyping: false,
  playingAudioId: null,
});

// Actions
export const chatActions = {
  setCurrentRoom: (room: ChatRoom) => {
    chatStore.currentRoom = room;
  },

  addMessage: (message: ChatMessage) => {
    chatStore.messages.push(message);
  },

  setMessages: (messages: ChatMessage[]) => {
    chatStore.messages = messages;
  },

  setLoading: (loading: boolean) => {
    chatStore.isLoading = loading;
  },

  setTyping: (typing: boolean) => {
    chatStore.isTyping = typing;
  },

  setPlayingAudioId: (audioId: string | null) => {
    chatStore.playingAudioId = audioId;
  },

  clearMessages: () => {
    chatStore.messages = [];
  },

  markAsRead: (messageId: string) => {
    const message = chatStore.messages.find((m) => m.id === messageId);
    if (message) {
      message.unreadCount = 0;
    }
  },
};
