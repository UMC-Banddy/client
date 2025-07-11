import React from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";

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
        return (
          <CustomButton
            key={idx}
            className={`!rounded-full !px-4 !py-1 !text-sm !font-medium !shadow-none !w-auto !max-w-none !min-w-0 !h-auto ${colorClass}`}
          >
            {tag}
          </CustomButton>
        );
      })}
    </>
  );
};

export default TagList;
