// 기존 타입들 (호환성 유지)
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

// API 스펙에 맞는 새로운 타입들
export interface MemberInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
}

export interface ChatRoomInfo {
  chatName: string;
  imageUrl: string;
  memberInfos: MemberInfo[];
  unreadCount: number;
  lastMessageAt: string;
}

export interface RoomMemberInfo {
  memberId: number;
  profileImageUrl: string;
  session: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ManagedRoomInfo {
  bandId: number;
  bandName: string;
  profileImageUrl: string;
  bandStatus: 'RECRUITING' | 'ACTIVE';
  recruitingSession: string[];
  rooms: RoomMemberInfo[];
}

export interface AppliedRoomInfo {
  bandId: number;
  roomId: number;
  bandName: string;
  profileImageUrl: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatRoomsResponse {
  chatRoomInfos: ChatRoomInfo[];
  managedRoomInfos: ManagedRoomInfo[];
  appliedRoomInfos: AppliedRoomInfo[];
}

// 기존 호환성을 위한 타입 (deprecated)
export interface LegacyChatRoomsResponse {
  rooms: ChatRoom[];
  interviewRooms: InterviewRoom[];
  appliedRooms: AppliedRoom[];
}

export interface CreateGroupChatRequest {
  memberIds: number[];
  imageUrl?: string;
  roomName: string;
}

export interface CreateDirectChatRequest {
  memberId: number;
}

export interface CreateChatResponse {
  roomId: number;
  roomName: string;
  roomImageUrl: string;
  lastMessageTime: string;
  roomtype: 'GROUP' | 'DIRECT';
  memberinfos: {
    userId: number;
    userName: string;
  }[];
}

export interface MessagesResponse {
  roomId: number;
  messages: {
    messageId: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;
  }[];
  hasNext: boolean;
  lastMessageId: number;
}

export interface JoinResponse {
  roomId: number;
  message: string;
  timestamp: string;
}

export interface LeaveResponse {
  roomId: number;
  message: string;
  timestamp: string;
}

// WebSocket 메시지 타입
export interface WebSocketMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  roomId: number;
}

export interface WebSocketSendMessage {
  content: string;
  roomId: number;
}

// 기존 타입들 (호환성 유지)
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
  // WebSocket 관련 상태 추가
  webSocketConnected: boolean;
  currentRoomId: string | null;
  realtimeMessages: ChatMessage[];
}
