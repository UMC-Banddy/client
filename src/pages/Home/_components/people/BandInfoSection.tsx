import TagList from "@/shared/ui/atoms/Tag";

const BandInfoSection = () => {
  return (
    <div className="space-y-2 text-sm text-gray-200 px-4">
      {/* pill + 일반 텍스트 + 작은 해시태그 */}
      <div className="flex items-center gap-2 mb-1">
        <TagList tags={[{ label: "평균 연령대" }]} className="mb-0" />
        <span className="text-base font-medium">20대 초반</span>
        <span className="text-xs text-gray-400 ml-1">#대학생</span>
        <span className="text-xs text-gray-400 ml-1">#직장인</span>
      </div>
      {/* pill + 일반 텍스트 */}
      <div className="flex items-center gap-2 mb-1">
        <TagList tags={[{ label: "성비" }]} className="mb-0" />
        <span className="text-base font-medium">남1 · 여2</span>
      </div>
      {/* 모집중 pill */}
      <TagList tags={[{ label: "모집중!", color: "red" }]} />
    </div>
  );
};

export default BandInfoSection;
