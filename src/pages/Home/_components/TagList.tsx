import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import micIcon from "@/assets/icons/home/mic.svg";

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
            {variant === "home" && idx === 0 && (
              <img
                src={micIcon}
                alt="mic"
                className="w-4 h-4 mr-2 inline-block align-middle"
              />
            )}
            {tag}
          </CustomButton>
        );
      })}
    </>
  );
};

export default TagList;
