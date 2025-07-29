import { proxy } from "valtio";
import type {
  ChatState,
  ChatMessage,
  ChatRoom,
  InterviewRoom,
  AppliedRoom,
} from "@/types/chat";

export const chatStore = proxy<ChatState>({
  rooms: [],
  interviewRooms: [],
  appliedRooms: [],
  currentRoom: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  playingAudioId: null,
  error: null,
});

// Actions
export const chatActions = {
  setRooms: (rooms: ChatRoom[]) => {
    chatStore.rooms = rooms;
  },

  setInterviewRooms: (interviewRooms: InterviewRoom[]) => {
    chatStore.interviewRooms = interviewRooms;
  },

  setAppliedRooms: (appliedRooms: AppliedRoom[]) => {
    chatStore.appliedRooms = appliedRooms;
  },

  setCurrentRoom: (room: ChatRoom | null) => {
    chatStore.currentRoom = room;
  },

  addRoom: (room: ChatRoom) => {
    chatStore.rooms.push(room);
  },

  addInterviewRoom: (interviewRoom: InterviewRoom) => {
    chatStore.interviewRooms.push(interviewRoom);
  },

  addAppliedRoom: (appliedRoom: AppliedRoom) => {
    chatStore.appliedRooms.push(appliedRoom);
  },

  updateRoom: (roomId: number, updates: Partial<ChatRoom>) => {
    const roomIndex = chatStore.rooms.findIndex(
      (room) => room.roomId === roomId
    );
    if (roomIndex !== -1) {
      chatStore.rooms[roomIndex] = {
        ...chatStore.rooms[roomIndex],
        ...updates,
      };
    }

    if (chatStore.currentRoom?.roomId === roomId) {
      chatStore.currentRoom = { ...chatStore.currentRoom, ...updates };
    }
  },

  removeRoom: (roomId: number) => {
    chatStore.rooms = chatStore.rooms.filter((room) => room.roomId !== roomId);
    if (chatStore.currentRoom?.roomId === roomId) {
      chatStore.currentRoom = null;
    }
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

  setError: (error: string | null) => {
    chatStore.error = error;
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

  clearAllRooms: () => {
    chatStore.rooms = [];
    chatStore.interviewRooms = [];
    chatStore.appliedRooms = [];
    chatStore.currentRoom = null;
  },
};
