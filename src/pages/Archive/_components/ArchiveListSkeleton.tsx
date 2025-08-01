const ArchiveListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center py-2 border-b border-white/10">
          {/* 이미지 스켈레톤 */}
          <div className="w-12 h-12 rounded-md bg-gray-700 mr-3" />
          {/* 텍스트 영역 스켈레톤 */}
          <div className="flex-1 space-y-1">
            <div className="w-24 h-3 bg-gray-700 rounded" />
            <div className="w-20 h-2 bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchiveListSkeleton; 