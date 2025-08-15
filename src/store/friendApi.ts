import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

// 친구 신청
export const sendFriendRequest = async (targetMemberId: number, message?: string): Promise<{ isSuccess: boolean; result: unknown }> => {
  try {
    const response = await API.post(
      API_ENDPOINTS.FRIEND.REQUEST,
      {
        targetMemberId: targetMemberId,
        message: message || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("친구 신청 실패:", error);
    throw error;
  }
};

// 채팅 요청
export const sendChatRequest = async (targetMemberId: number, message?: string): Promise<{ isSuccess: boolean; result: unknown }> => {
  try {
    const response = await API.post(
      API_ENDPOINTS.CHAT.REQUESTS,
      {
        targetMemberId: targetMemberId,
        message: message || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("채팅 요청 실패:", error);
    throw error;
  }
};

// 채팅 요청 삭제
export const deleteChatRequest = async (requestId: number): Promise<{ isSuccess: boolean; result: unknown }> => {
  try {
    const response = await API.delete(
      API_ENDPOINTS.CHAT.DELETE_REQUEST(requestId.toString()),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("채팅 요청 삭제 실패:", error);
    throw error;
  }
};

// 친구 신청 수락
export const acceptFriendRequest = async (requestId: string): Promise<{ isSuccess: boolean; result: unknown }> => {
  try {
    const response = await API.post(
      API_ENDPOINTS.FRIEND.ACCEPT(requestId),
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("친구 신청 수락 실패:", error);
    throw error;
  }
};

// 친구 신청 거절
export const rejectFriendRequest = async (requestId: string): Promise<{ isSuccess: boolean; result: unknown }> => {
  try {
    const response = await API.post(
      API_ENDPOINTS.FRIEND.REJECT(requestId),
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("친구 신청 거절 실패:", error);
    throw error;
  }
};
