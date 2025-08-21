// 기존 타입들 (호환성 유지)
export interface ChatMessage {
  id: string;
  type: "me" | "other" | "system";
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
  showReadIndicator?: boolean; // 읽음 표시 여부
}

// API 스펙에 맞는 새로운 타입들
export interface MemberInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  lastReadMessageId?: number;
}

export interface ChatRoomInfo {
  roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER";
  roomId: number;
  chatName: string;
  imageUrl: string | null;
  memberInfo?: {
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
    lastReadMessageId: number;
  };
  memberInfos?: MemberInfo[];
  unreadCount: number | null;
  lastMessageAt: string | null;
  pinnedAt?: string | null;
}

// 밴드 지원자 채팅방 정보 (BAND-APPLICANT)
export interface BandApplicantRoomInfo {
  roomType: "BAND-APPLICANT";
  roomId: number;
  bandId: number;
  bandName: string;
  profileImageUrl: string | null;
  memberInfo: {
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
    lastReadMessageId: number;
    session: string;
    passFail: "PENDING" | "PASS" | "FAIL";
  };
  unreadCount: number | null;
  lastMessageAt: string | null;
  pinnedAt?: string | null;
}

// 밴드 관리자 채팅방 정보 (BAND-MANAGER)
export interface BandManagerRoomInfo {
  roomType: "BAND-MANAGER";
  roomId: number;
  bandId: number;
  bandName: string;
  profileImageUrl: string | null;
  status: "RECRUITING" | "ACTIVE";
  bandSessionList: string[];
  chatRoomInfo: {
    roomId: number;
    memberInfo: {
      memberId: number;
      nickname: string;
      profileImageUrl: string | null;
      lastReadMessageId: number;
    };
    session: string;
    passFail: "PENDING" | "PASS" | "FAIL";
    lastMessageAt: string | null;
    pinnedAt?: string | null;
    unreadCount: number | null;
  }[];
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
  bandStatus: "RECRUITING" | "ACTIVE";
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
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    chatRoomInfos: ChatRoomInfo[];
    managedRoomInfos?: ManagedRoomInfo[];
    appliedRoomInfos?: AppliedRoomInfo[];
  };
}

// 친구 채팅방 타입
export interface FriendRoomInfo {
  roomId: number;
  memberId: number;
  friendName: string;
  profileImage: string;
}

export interface FriendRoomsResponse {
  rooms: FriendRoomInfo[];
}

// 채팅방 참가자 정보 타입
export interface RoomMemberDetail {
  memberId: number;
  timestamp: string;
}

export interface RoomMembersResponse {
  roomId: number;
  infos: RoomMemberDetail[];
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
  roomtype: "GROUP" | "DIRECT";
  memberinfos: {
    userId: number;
    userName: string;
  }[];
}

export interface MessagesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    messages: {
      messageId: number;
      senderId: number;
      senderName: string;
      content: string;
      timestamp: string;
    }[];
    hasNext: boolean;
    lastMessageId: number;
  };
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
  roomType?: "PRIVATE" | "GROUP" | "BAND";
  receiverId?: number; // PRIVATE일 때 필수
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
