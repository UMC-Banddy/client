import { type SavedTrack } from "@/types/track";

export interface ProfileData {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  bio: string;
  tags: string[];
  savedTracks: SavedTrack[];
}

export interface ProfileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ProfileData;
}