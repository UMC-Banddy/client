import React from "react";
import TagList from "./TagList";

interface HomeTagSectionProps {
  tags: string[];
}

const HomeTagSection = ({ tags }: HomeTagSectionProps) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto gap-x-3 w-full max-w-full px-1 py-2 mb-0 scrollbar-hide pl-6 pr-6">
      <TagList tags={tags} variant="home" />
    </div>
  );
};

export default HomeTagSection;
