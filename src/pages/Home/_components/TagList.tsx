import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import {
  mic,
  electricGuitar,
  acousticGuitar,
  bass,
  drum,
  piano,
  violin,
  trumpet,
} from "@/assets/icons/home/tag";

// 세션별 아이콘 매핑 함수
const getSessionIcon = (tagName: string) => {
  const cleanName = tagName.toLowerCase();

  if (cleanName.includes("보컬") || cleanName.includes("vocal")) return mic;
  if (
    cleanName.includes("어쿠스틱 기타") ||
    cleanName.includes("acoustic guitar")
  )
    return acousticGuitar;
  if (cleanName.includes("기타") || cleanName.includes("guitar"))
    return electricGuitar;
  if (cleanName.includes("베이스") || cleanName.includes("bass")) return bass;
  if (cleanName.includes("드럼") || cleanName.includes("drum")) return drum;
  if (cleanName.includes("피아노") || cleanName.includes("piano")) return piano;
  if (cleanName.includes("바이올린") || cleanName.includes("violin"))
    return violin;
  if (cleanName.includes("트럼펫") || cleanName.includes("trumpet"))
    return trumpet;

  // 기본값
  return mic;
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
            colorClass =
              "!bg-[#B42127] !text-white !border-none before:content-[''] before:inline-block before:mr-2 before:w-2 before:h-2 before:rounded-full before:bg-[#D9D9D9]";
          } else {
            // 나머지 태그: 얇은 흰색 테두리 + 반투명 블랙 배경
            colorClass =
              "!bg-[rgba(0,0,0,0.5)] !text-white !border !border-white/60";
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
            className={`inline-flex !items-center shrink-0 !rounded-full !px-4 !py-1 !text-sm !font-medium !shadow-none !w-auto !max-w-none !min-w-0 !h-auto ${colorClass}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "unset",
            }}
          >
            {variant === "home" && isSessionTag && SessionIcon && (
              <div className="size-[12px] mr-1 inline-block align-middle">
                <img src={SessionIcon} alt="" />
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
