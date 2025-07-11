import React from "react";
import TagList from "./TagList";

// mockdata로 태그 분리
const tagMockData = [
  "보컬 모집",
  "Sheena Ringo",
  "いらないもの",
  "Betcover",
  // 필요시 더 추가
];

const HomeTagSection = () => {
  return (
    <div className="flex flex-nowrap overflow-x-auto gap-x-3 w-full max-w-full px-1 py-2 mb-0 scrollbar-hide">
      <TagList tags={tagMockData} />
    </div>
  );
};

export default HomeTagSection;
