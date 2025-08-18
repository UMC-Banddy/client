import { proxy } from "valtio";
import type {
  ChatState,
  ChatMessage,
  ChatRoom,
  InterviewRoom,
  AppliedRoom,
  WebSocketMessage,
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
  // WebSocket 관련 상태 추가
  webSocketConnected: false,
  currentRoomId: null,
  realtimeMessages: [],
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

  // WebSocket 관련 액션들
  setWebSocketConnected: (connected: boolean) => {
    chatStore.webSocketConnected = connected;
  },

  setCurrentRoomId: (roomId: string | null) => {
    chatStore.currentRoomId = roomId;
  },

  addRealtimeMessage: (wsMessage: WebSocketMessage) => {
    // WebSocket 메시지를 ChatMessage 형식으로 변환
    const chatMessage: ChatMessage = {
      id: wsMessage.messageId.toString(),
      type: "other", // 기본값, 실제로는 현재 사용자 ID와 비교해야 함
      name: wsMessage.senderName,
      avatar: "/src/assets/images/profile1.png", // 기본 아바타
      text: wsMessage.content,
      time: new Date(wsMessage.timestamp).toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      unreadCount: 0,
    };

    chatStore.realtimeMessages.push(chatMessage);
    
    // 현재 채팅방의 메시지에도 추가
    if (chatStore.currentRoomId === wsMessage.roomId.toString()) {
      chatStore.messages.push(chatMessage);
    }
  },

  clearRealtimeMessages: () => {
    chatStore.realtimeMessages = [];
  },

  // WebSocket 메시지를 기존 메시지와 통합
  mergeRealtimeMessages: () => {
    // 실시간 메시지를 기존 메시지와 통합하고 중복 제거
    const allMessages = [...chatStore.messages, ...chatStore.realtimeMessages];
    const uniqueMessages = allMessages.filter((message, index, self) => 
      index === self.findIndex(m => m.id === message.id)
    );
    
    // 시간순으로 정렬
    uniqueMessages.sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });

    chatStore.messages = uniqueMessages;
    chatStore.realtimeMessages = [];
  },

  // 안읽음 카운트 증가 (목록 실시간 반영용)
  incrementUnreadCount: (roomId: number) => {
    const idx = chatStore.rooms.findIndex((r) => r.roomId === roomId);
    if (idx !== -1) {
      const current = chatStore.rooms[idx].unreadCount;
      const next = (current ?? 0) + 1;
      chatStore.rooms[idx] = {
        ...chatStore.rooms[idx],
        unreadCount: next,
      } as unknown as ChatRoom;
    }
  },
};
