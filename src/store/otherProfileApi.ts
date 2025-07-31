import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { OtherProfileData } from "@/types/profile";

// 다른 사용자 프로필 조회 API
export const getOtherProfile = async (memberId: number): Promise<OtherProfileData> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.OTHER(memberId.toString()));
  return response.data;
}; 