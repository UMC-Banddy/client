import React from "react";

interface HashtagListProps {
  tags: string[];
  className?: string;
}

const HashtagList: React.FC<HashtagListProps> = ({ tags, className }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap px-[6vw] gap-x-[1vw] gap-y-[1vh] mb-[2vh] w-full max-w-xs mx-auto mt-[3vh] ${className || ""}`}>
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center justify-center rounded-full bg-[#555555] text-[#E9E9E9] text-hakgyo-r-14 px-[3vw] py-[2vh] h-[3.2vh]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default HashtagList; 