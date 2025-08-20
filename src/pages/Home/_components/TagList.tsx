import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import {
  MicImg,
  GuitarImg,
  AcousticGuitarImg,
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
  if (
    cleanName.includes("어쿠스틱 기타") ||
    cleanName.includes("acoustic guitar")
  )
    return AcousticGuitarImg;
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
            // 세션 태그: 붉은 배경 + 흰 글자, 좌측 점 뱃지
            colorClass = "!bg-[#B42127] !text-white !border-none before:content-[''] before:inline-block before:mr-2 before:w-2 before:h-2 before:rounded-full before:bg-[#D9D9D9]";
          } else {
            // 나머지 태그: 얇은 흰색 테두리 + 반투명 블랙 배경
            colorClass = "!bg-[rgba(0,0,0,0.5)] !text-white !border !border-white/60";
          }
        } else if (variant === "card") {
          // 👉 캐러셀 카드 전용 스타일
          colorClass = "!bg-white !text-black !border-none"; // 예: 전부 깔끔한 흰색
        }

        // 세션 태그인지 확인 (첫 번째 태그만, 빨간색 태그)
        const isSessionTag =
          idx === 0 &&
          (tag.toLowerCase().includes("보컬") ||
            tag.toLowerCase().includes("어쿠스틱 기타") ||
            tag.toLowerCase().includes("기타") ||
            tag.toLowerCase().includes("베이스") ||
            tag.toLowerCase().includes("드럼") ||
            tag.toLowerCase().includes("피아노") ||
            tag.toLowerCase().includes("바이올린") ||
            tag.toLowerCase().includes("트럼펫") ||
            tag.toLowerCase().includes("vocal") ||
            tag.toLowerCase().includes("acoustic guitar") ||
            tag.toLowerCase().includes("guitar") ||
            tag.toLowerCase().includes("bass") ||
            tag.toLowerCase().includes("drum") ||
            tag.toLowerCase().includes("piano") ||
            tag.toLowerCase().includes("violin") ||
            tag.toLowerCase().includes("trumpet"));

        const SessionIcon = isSessionTag ? getSessionIcon(tag) : null;

        return (
          <CustomButton
            key={idx}
            className={`inline-flex shrink-0 !rounded-full !px-4 !py-1 !text-[13px] !font-bold !shadow-none !w-auto !max-w-none !min-w-0 !h-auto tracking-tight ${colorClass}`}
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
