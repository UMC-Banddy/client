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

export interface OtherProfileSession {
  name: string;
  icon: string;
}

export interface OtherProfileArtist {
  name: string;
  imageUrl: string;
}

export interface OtherProfileData {
  memberId: number;
  nickname: string;
  bio: string;
  profileImageUrl: string;
  age: number;
  gender: "MALE" | "FEMALE";
  region: string | null;
  tags: string[];
  sessions: OtherProfileSession[];
  favoriteArtists: OtherProfileArtist[];
  traits: string[];
  youtubeUrl: string | null;
  instagramUrl: string | null;
  genres: string[];
  canRequestChat: boolean;
  friend: boolean;
  blocked: boolean;
}

export interface OtherProfileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: OtherProfileData;
}

// 장르 타입 (17가지 장르)
export interface Genre {
  id: number;
  name: string;
  icon: string;
}

export const GENRES: Genre[] = [
  { id: 1, name: "Metal", icon: "⚡" },
  { id: 2, name: "New age", icon: "🎹" },
  { id: 3, name: "Pop", icon: "🎤" },
  { id: 4, name: "Punk", icon: "🧑‍🎤" },
  { id: 5, name: "R&B", icon: "🎵" },
  { id: 6, name: "Rock", icon: "🎸" },
  { id: 7, name: "Grunge", icon: "🥁" },
  { id: 8, name: "Indie Rock", icon: "🌊" },
  { id: 9, name: "Jazz", icon: "🎺" },
  { id: 10, name: "Shoegaze", icon: "👟" },
  { id: 11, name: "EMO", icon: "💔" },
  { id: 12, name: "Psychedelic", icon: "💊" },
  { id: 13, name: "Dream Pop", icon: "🌙" },
  { id: 14, name: "Nu Metal", icon: "⛓️" },
  { id: 15, name: "J-pop", icon: "⛩️" },
  { id: 16, name: "Tiwan Indie", icon: "🤘" },
  { id: 17, name: "Russian Rock", icon: "🪆" }
]; 