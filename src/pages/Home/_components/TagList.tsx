import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import micIcon from "@/assets/icons/home/mic.svg";
import {
  MicImg,
  GuitarImg,
  BassImg,
  DrumImg,
  PianoImg,
  ViolinImg,
  TrumpetImg,
} from "@/shared/components/images";

// 세션별 아이콘 매핑 함수
const getSessionIcon = (tagName: string) => {
  const cleanName = tagName.toLowerCase();

  if (cleanName.includes("보컬") || cleanName.includes("vocal")) return MicImg;
  if (cleanName.includes("기타") || cleanName.includes("guitar"))
    return GuitarImg;
  if (cleanName.includes("베이스") || cleanName.includes("bass"))
    return BassImg;
  if (cleanName.includes("드럼") || cleanName.includes("drum")) return DrumImg;
  if (cleanName.includes("피아노") || cleanName.includes("piano"))
    return PianoImg;
  if (cleanName.includes("바이올린") || cleanName.includes("violin"))
    return ViolinImg;
  if (cleanName.includes("트럼펫") || cleanName.includes("trumpet"))
    return TrumpetImg;

  // 기본값
  return MicImg;
};

const TagList: React.FC<{
  tags: string[];
  variant?: "home" | "card";
}> = ({ tags, variant = "home" }) => {
  return (
    <>
      {tags.map((tag, idx) => {
        let colorClass = "";

        if (variant === "home") {
          if (idx === 0) {
            colorClass = "!bg-[#DF0001] !text-white !border-none";
          } else if (idx === 1) {
            colorClass = "!bg-white !text-black !border-none";
          } else {
            colorClass = "!bg-black !text-white !border !border-white";
          }
        } else if (variant === "card") {
          // 👉 캐러셀 카드 전용 스타일
          colorClass = "!bg-white !text-black !border-none"; // 예: 전부 깔끔한 흰색
        }

        // 세션 태그인지 확인 (첫 번째 태그만, 빨간색 태그)
        const isSessionTag =
          idx === 0 &&
          (tag.toLowerCase().includes("보컬") ||
            tag.toLowerCase().includes("기타") ||
            tag.toLowerCase().includes("베이스") ||
            tag.toLowerCase().includes("드럼") ||
            tag.toLowerCase().includes("피아노") ||
            tag.toLowerCase().includes("바이올린") ||
            tag.toLowerCase().includes("트럼펫") ||
            tag.toLowerCase().includes("vocal") ||
            tag.toLowerCase().includes("guitar") ||
            tag.toLowerCase().includes("bass") ||
            tag.toLowerCase().includes("drum") ||
            tag.toLowerCase().includes("piano") ||
            tag.toLowerCase().includes("violin") ||
            tag.toLowerCase().includes("trumpet"));

        const SessionIcon = isSessionTag ? getSessionIcon(tag) : null;

        // 디버깅용 로그 (개발 환경에서만)
        if (import.meta.env.DEV && idx === 0) {
          console.log(
            `태그 "${tag}" - isSessionTag: ${isSessionTag}, SessionIcon: ${
              SessionIcon ? "있음" : "없음"
            }`
          );
        }

        return (
          <CustomButton
            key={idx}
            className={`inline-flex shrink-0 !rounded-full !px-4 !py-1 !text-sm !font-medium !shadow-none !w-auto !max-w-none !min-w-0 !h-auto ${colorClass}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "unset",
            }}
          >
            {variant === "home" && isSessionTag && SessionIcon && (
              <div className="w-3 h-3 mr-1 inline-block align-middle">
                <SessionIcon size={12} color="gray-200" />
              </div>
            )}
            {tag}
          </CustomButton>
        );
      })}
    </>
  );
};

export default TagList;
