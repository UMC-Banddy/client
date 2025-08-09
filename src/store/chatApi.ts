import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type {
  ChatRoomsResponse,
  CreateGroupChatRequest,
  CreateDirectChatRequest,
  CreateChatResponse,
  MessagesResponse,
  JoinResponse,
  LeaveResponse,
  FriendRoomsResponse,
  RoomMembersResponse,
} from "@/types/chat";

// 채팅방 목록 조회 (새로운 API 스펙)
export const getChatRooms = async (): Promise<ChatRoomsResponse> => {
  const response = await API.get(API_ENDPOINTS.CHAT.ROOMS);
  return response.data;
};

// 그룹 채팅방 생성 (새로운 API 스펙)
export const createGroupChat = async (
  data: CreateGroupChatRequest
): Promise<CreateChatResponse> => {
  const formData = new FormData();
  // imageUrl이 파일 업로드로 전달될 수 있어 multipart 지원
  if (data.imageUrl) {
    // 서버 스펙에 따라 키 이름이 image 또는 roomImage일 수 있음. 현재는 image로 사용.
    formData.append("image", data.imageUrl as unknown as Blob);
  }
  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          memberIds: data.memberIds,
          roomName: data.roomName,
        }),
      ],
      { type: "application/json" }
    )
  );

  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_GROUP, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 1대1 채팅방 생성 (새로운 API 스펙)
export const createDirectChat = async (
  data: CreateDirectChatRequest
): Promise<{ roomId: number }> => {
  const response = await API.post(API_ENDPOINTS.CHAT.PRIVATE, data);
  return response.data;
};

// 면접 채팅방 생성 (밴드 가입 신청용) - API 문서에 없어서 주석 처리
// export const createInterviewChat = async (_bandId: string) => {
export const createInterviewChat = async () => {
  // const response = await API.post(API_ENDPOINTS.CHAT.CREATE_INTERVIEW(bandId));
  // return response.data;
  throw new Error("면접 채팅방 생성 API가 구현되지 않았습니다.");
};

// 지원 채팅방 생성 (밴드 지원용) - API 문서에 없어서 주석 처리
// export const createApplicationChat = async (_bandId: string) => {
export const createApplicationChat = async () => {
  // const response = await API.post(
  //   API_ENDPOINTS.CHAT.CREATE_APPLICATION(bandId)
  // );
  // return response.data;
  throw new Error("지원 채팅방 생성 API가 구현되지 않았습니다.");
};

// 채팅 메시지 조회 (새로운 API 스펙 - 무한 스크롤)
export const getChatMessages = async (
  roomId: string,
  cursor?: number,
  limit: number = 20
): Promise<MessagesResponse> => {
  const params: Record<string, number> = { limit };
  if (cursor !== undefined) {
    params.cursor = cursor;
  }

  const response = await API.get(
    API_ENDPOINTS.CHAT.MESSAGES(roomId, cursor || 0, limit),
    {
      params,
    }
  );
  return response.data;
};

// 채팅방 참가자 정보 조회 (새로운 API)
export const getChatRoomMembers = async (
  roomId: string
): Promise<RoomMembersResponse> => {
  const response = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(roomId));
  return response.data;
};

// 단체 채팅방 정보 수정 (multipart)
export const updateGroupChat = async (payload: {
  roomId: number;
  roomName?: string;
  imageFile?: File;
}): Promise<{ roomId: number; roomName: string; roomProfileUrl: string }> => {
  const formData = new FormData();
  const data: Record<string, unknown> = {};
  if (payload.roomName) data.roomName = payload.roomName;
  if (Object.keys(data).length > 0) {
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }
  const response = await API.patch(API_ENDPOINTS.CHAT.UPDATE_GROUP, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { roomId: payload.roomId },
  });
  return response.data;
};

// 채팅방 고정/해제
export const pinChatRoom = async (params: {
  bandId?: number;
  chatId?: number;
}): Promise<Record<string, never>> => {
  const response = await API.patch(API_ENDPOINTS.CHAT.PIN, null, { params });
  return response.data;
};

export const unpinChatRoom = async (params: {
  bandId?: number;
  chatId?: number;
}): Promise<Record<string, never>> => {
  const response = await API.patch(API_ENDPOINTS.CHAT.UNPIN, null, { params });
  return response.data;
};

// 채팅방 멤버 초대 - API 문서에 없어서 주석 처리
export const inviteChatMember = async () =>
  // _roomId: string,
  // _memberIds: number[]
  {
    // const response = await API.post(API_ENDPOINTS.CHAT.INVITE(roomId), {
    //   memberIds,
    // });
    // return response.data;
    throw new Error("채팅방 멤버 초대 API가 구현되지 않았습니다.");
  };

// 채팅방 참여 (새로운 API 스펙)
export const joinChatRoom = async (roomId: string): Promise<JoinResponse> => {
  const response = await API.post(API_ENDPOINTS.CHAT.JOIN(roomId));
  return response.data;
};

// 채팅방 나가기 (새로운 API 스펙)
export const leaveChatRoom = async (roomId: string): Promise<LeaveResponse> => {
  const response = await API.post(API_ENDPOINTS.CHAT.LEAVE(roomId));
  return response.data;
};

// 친구 채팅방 목록 조회 (새로운 API 스펙)
export const getChatFriends = async (): Promise<FriendRoomsResponse> => {
  const response = await API.get(API_ENDPOINTS.CHAT.FRIENDS);
  return response.data;
};

// 기존 함수들 (호환성 유지)
export const getChatRoomsLegacy = async (type?: string) => {
  const params = type ? { type } : {};
  const response = await API.get(API_ENDPOINTS.CHAT.ROOMS, { params });
  return response.data;
};

export const createGroupChatLegacy = async (data: {
  roomName: string;
  memberIds: number[];
  roomImage?: string;
}) => {
  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_GROUP, data);
  return response.data;
};

export const createDirectChatLegacy = async (data: { friendId: number }) => {
  const response = await API.post(API_ENDPOINTS.CHAT.CREATE_WITH_FRIEND, data);
  return response.data;
};

export const getChatMessagesLegacy = async (
  roomId: string,
  cursor?: string
) => {
  const url = cursor
    ? API_ENDPOINTS.CHAT.MESSAGES(roomId, cursor)
    : API_ENDPOINTS.CHAT.MESSAGES(roomId, "");
  const response = await API.get(url);
  return response.data;
};

export const leaveChatRoomLegacy = async (roomId: string) => {
  const response = await API.post(API_ENDPOINTS.CHAT.LEAVE(roomId));
  return response.data;
};
