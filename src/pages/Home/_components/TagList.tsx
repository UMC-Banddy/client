import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import micIcon from "@/assets/icons/mic.svg";

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <>
      {tags.map((tag, idx) => {
        let colorClass = "";
        if (idx === 0) {
          colorClass = "!bg-[#DF0001] !text-white !border-none";
        } else if (idx === 1) {
          colorClass = "!bg-white !text-black !border-none";
        } else {
          colorClass = "!bg-black !text-white !border !border-white";
        }
        //  api 태그 상태들에 따라 수정 필요 현재는 피그마 디자인에 맞춰서 수정
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
            {idx === 0 && (
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
