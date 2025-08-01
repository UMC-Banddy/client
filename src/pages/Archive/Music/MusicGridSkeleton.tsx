const MusicGridSkeleton = () => {
  return (
    <div className="flex gap-[14px] overflow-x-auto pb-[1vh] scrollbar-hide mb-[4vh] animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-start">
          {/* 이미지 스켈레톤 */}
          <div className="relative w-[29vw] h-[29vw] overflow-hidden bg-gray-700 max-w-[116px] max-h-[116px] rounded" />
          {/* 제목 스켈레톤 */}
          <div className="mt-[1vh] w-20 h-3 bg-gray-700 rounded" />
          {/* 부제목 스켈레톤 */}
          <div className="w-16 h-3 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default MusicGridSkeleton; 