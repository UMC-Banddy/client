import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { SavedTracksResponse } from "@/types/track";

// 다른 사용자의 저장된 곡 조회 API
export const getSavedTracks = async (memberId: number): Promise<SavedTracksResponse> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.OTHER_TRACKS(memberId.toString()));
  return response.data;
}; 