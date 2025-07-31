import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type ProfileResponse } from "@/types/profile";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
  return response.data;
}; 