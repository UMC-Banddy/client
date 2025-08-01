const ArchiveGridSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-start">
          {/* 이미지 스켈레톤 */}
          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-700" />
          {/* 제목 스켈레톤 */}
          <div className="mt-1 w-16 h-2 bg-gray-700 rounded" />
          {/* 부제목 스켈레톤 */}
          <div className="w-12 h-2 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ArchiveGridSkeleton; 