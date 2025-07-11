import React from "react";
import TagButton from "@/shared/ui/atoms/TagButton";

interface Tag {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface TagListProps {
  tags: Tag[];
  className?: string;
}

const TagList = ({ tags, className = "" }: TagListProps) => (
  <div
    className={`flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide w-full ${className}`}
    aria-label="태그 리스트"
  >
    {tags.map((tag, idx) => (
      <TagButton
        key={tag.label + idx}
        active={tag.active}
        onClick={tag.onClick}
        className="font-wantedsans font-semibold text-[15px] px-4 py-2 min-w-max"
        aria-label={tag.label}
      >
        {tag.label}
      </TagButton>
    ))}
  </div>
);

export default TagList;
