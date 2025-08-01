const ArtistGridSkeleton = () => {
  return (
    <div className="flex gap-[12px] overflow-x-auto scrollbar-hide mb-[4.2vh] animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-center flex-shrink-0">
          {/* 원형 이미지 스켈레톤 */}
          <div className="w-[25vw] h-[25vw] rounded-full bg-gray-700 border border-[#FFFFFF]/20 max-w-[98px] max-h-[98px]" />
          {/* 제목 스켈레톤 */}
          <div className="mt-[1.4vh] w-16 h-3 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ArtistGridSkeleton; 