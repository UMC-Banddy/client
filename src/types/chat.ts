export interface ChatMessage {
  id: string;
  type: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  audio?: {
    duration: number;
    isPlaying: boolean;
    currentTime?: number;
    onPlay: () => void;
  };
  time: string;
  unreadCount?: number;
}

export interface ChatRoomMember {
  userid: number;
  userName: string;
}

export interface ChatRoom {
  roomId: number;
  roomName: string;
  roomImage?: string;
  lastMessage?: string;
  pinnedAt?: string;
  member: ChatRoomMember[];
  unreadCount?: number;
  isOnline?: boolean;
}

export interface InterviewRoom {
  bandId: number;
  bandName: string;
  bandImage?: string;
  createdAt: string;
}

export interface AppliedRoom {
  roomId: number;
  roomName: string;
  roomImage?: string;
  createdAt: string;
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[];
  interviewRooms: InterviewRoom[];
  appliedRooms: AppliedRoom[];
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: string;
}

export interface ChatState {
  rooms: ChatRoom[];
  interviewRooms: InterviewRoom[];
  appliedRooms: AppliedRoom[];
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  playingAudioId: string | null;
  error: string | null;
}
