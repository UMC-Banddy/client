import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { ChatRoomsResponse } from "@/types/chat";

// 채팅방 목록 조회
export const getChatRooms = async (
  type?: string
): Promise<ChatRoomsResponse> => {
  const params = type ? { type } : {};
  const response = await API.get(API_ENDPOINTS.CHAT.ROOMS, { params });
  return response.data;
};

// 그룹 채팅방 생성
export const createGroupChat = async (data: {
  roomName: string;
  memberIds: number[];
  roomImage?: string;
}) => {
  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_GROUP, data);
  return response.data;
};

// 1대1 채팅방 생성
export const createDirectChat = async (data: { friendId: number }) => {
  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_WITH_FRIEND, data);
  return response.data;
};

// 면접 채팅방 생성 (밴드 가입 신청용)
export const createInterviewChat = async (bandId: string) => {
  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_INTERVIEW(bandId));
  return response.data;
};

// 지원 채팅방 생성 (밴드 지원용)
export const createApplicationChat = async (bandId: string) => {
  const response = await API.post(
    API_ENDPOINTS.CHAT.CREATE_APPLICATION(bandId)
  );
  return response.data;
};

// 채팅 메시지 조회
export const getChatMessages = async (roomId: string, cursor?: string) => {
  const url = cursor
    ? API_ENDPOINTS.CHAT.MESSAGES(roomId, cursor)
    : API_ENDPOINTS.CHAT.MESSAGES(roomId, "");
  const response = await API.get(url);
  return response.data;
};

// 채팅방 멤버 초대
export const inviteChatMember = async (roomId: string, memberIds: number[]) => {
  const response = await API.post(API_ENDPOINTS.CHAT.INVITE(roomId), {
    memberIds,
  });
  return response.data;
};

// 채팅방 참여
export const joinChatRoom = async (roomId: string) => {
  const response = await API.post(API_ENDPOINTS.CHAT.JOIN(roomId));
  return response.data;
};

// 채팅방 나가기
export const leaveChatRoom = async (roomId: string) => {
  const response = await API.post(API_ENDPOINTS.CHAT.LEAVE(roomId));
  return response.data;
};

// 친구 목록 조회 (채팅용)
export const getChatFriends = async () => {
  const response = await API.get(API_ENDPOINTS.CHAT.FRIENDS);
  return response.data;
};
