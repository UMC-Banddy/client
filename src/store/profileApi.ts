import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type ProfileResponse } from "@/types/profile";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
  return response.data;
};

export const getMemberProfile = async (memberId: number): Promise<ProfileResponse> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.OTHER(memberId.toString()));
  return response.data;
};

export const uploadProfileMedia = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(API_ENDPOINTS.PROFILE.MEDIA_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProfile = async (profileData: {
  nickname?: string;
  age?: number;
  gender?: string;
  region?: string;
  district?: string;
  bio?: string;
  profileImage?: string;
  mediaUrl?: string;
  availableSessions?: Array<{
    sessionType: string;
    level: string;
  }>;
  genres?: string[];
  artists?: string[];
  keywords?: string[];
}): Promise<ProfileResponse> => {
  const response = await API.put(API_ENDPOINTS.PROFILE.UPDATE, profileData);
  return response.data;
}; 