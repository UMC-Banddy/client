import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SavedAlbumsResponse } from "@/types/album";

export const getSavedAlbums = async (memberId: number): Promise<SavedAlbumsResponse> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.OTHER_ALBUMS(memberId.toString()));
  return response.data;
}; 