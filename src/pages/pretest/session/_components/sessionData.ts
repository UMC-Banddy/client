import type { Session } from "./SessionCard";

// 실력 레벨 정의
const LEVELS = {
  beginner: {
    id: "beginner",
    name: "초보",
    description: "코드를 간단히",
    icon: "😊",
  },
  intermediate: {
    id: "intermediate",
    name: "중수",
    description: "어느정도 익숙해요 연습하면 할 수 있어요",
    icon: "😉",
  },
  expert: {
    id: "expert",
    name: "고수",
    description: "위든 해요",
    icon: "😎🔥",
  },
};

// 세션 데이터 - name에 이모티콘 포함
export const SESSIONS: Session[] = [
  {
    id: "vocal",
    name: "🎤 보컬 🎤",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "electric-guitar",
    name: "🎸 일렉 기타 🎸",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "acoustic-guitar",
    name: "🪕 어쿠스틱 기타 🪕",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "bass",
    name: "🎶 베이스 🎶",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "drums",
    name: "🥁 드럼 🥁",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "keyboard",
    name: "🎹 키보드 🎹",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "violin",
    name: "🎻 바이올린 🎻",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
  {
    id: "trumpet",
    name: "🎺 트럼펫 🎺",
    levels: [LEVELS.beginner, LEVELS.intermediate, LEVELS.expert],
  },
];
