export type SessionEmoji =
  | "🎤 보컬 🎤"
  | "🎸 일렉 기타 🎸"
  | "🪕 어쿠스틱 기타 🪕"
  | "🎵 베이스 🎵"
  | "🥁 드럼 🥁"
  | "🎹 키보드 🎹"
  | "🎻 바이올린 🎻"
  | "🎺 트럼펫 🎺";

export const SESSION_OPTIONS: SessionEmoji[] = [
  "🎤 보컬 🎤",
  "🎸 일렉 기타 🎸",
  "🪕 어쿠스틱 기타 🪕",
  "🎵 베이스 🎵",
  "🥁 드럼 🥁",
  "🎹 키보드 🎹",
  "🎻 바이올린 🎻",
  "🎺 트럼펫 🎺",
];

export interface BandJoinResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: {
    roomId: number;
  };
  roomId?: number; // 백엔드가 바로 roomId를 상위에 줄 수도 있어 유연 처리
}
