export interface ChatMessage {
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

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  currentRoom: ChatRoom | null;
  isLoading: boolean;
  isTyping: boolean;
  playingAudioId: string | null;
}
