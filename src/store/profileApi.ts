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
  // FormData로 변환
  const formData = new FormData();
  
  // text 파트: data 필드에 JSON 데이터
  const jsonData = {
    nickname: profileData.nickname,
    age: profileData.age,
    gender: profileData.gender,
    region: profileData.region,
    district: profileData.district,
    bio: profileData.bio,
    mediaUrl: profileData.mediaUrl,
    availableSessions: profileData.availableSessions,
    genres: profileData.genres,
    artists: profileData.artists,
    keywords: profileData.keywords,
  };
  
  // undefined 값들을 제거
  const cleanData = Object.fromEntries(
    Object.entries(jsonData).filter(([, value]) => value !== undefined)
  );
  
  formData.append("data", JSON.stringify(cleanData));
  
  // profileImage 파트: 파일이 있는 경우에만 추가
  if (profileData.profileImage && profileData.profileImage !== "") {
    // URL을 File 객체로 변환하거나, 기존 파일이 있다면 그대로 사용
    // 현재는 profileImage가 URL 문자열이므로, 필요시 File 객체로 변환 로직 추가
    // formData.append("profileImage", file);
  }

  const response = await API.put(API_ENDPOINTS.PROFILE.UPDATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}; 