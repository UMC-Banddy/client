import React from "react";

interface TagListProps {
  tags: { label: string; color?: "red" | "gray" }[];
  className?: string;
}

const TagList = ({ tags, className = "" }: TagListProps) => (
  <div
    className={`flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 ${className}`}
  >
    {tags.map((tag, idx) => (
      <span
        key={tag.label + idx}
        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border
          ${
            tag.color === "red"
              ? "bg-[#DF0001] text-white border-[#DF0001]"
              : "bg-gray-200 text-gray-700 border-gray-300"
          }
        `}
      >
        {tag.label}
      </span>
    ))}
  </div>
);

export default TagList;
