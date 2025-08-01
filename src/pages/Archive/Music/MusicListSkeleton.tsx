const MusicListSkeleton = () => {
  return (
    <div className="flex flex-col gap-x-[16px] gap-y-[12px] mb-[4vh] animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center">
          {/* 이미지 스켈레톤 */}
          <div className="w-[14vw] h-[14vw] bg-gray-700 mr-[16px] max-w-[55px] max-h-[55px] rounded" />
          {/* 텍스트 영역 스켈레톤 */}
          <div className="flex-1 space-y-1">
            <div className="w-24 h-4 bg-gray-700 rounded" />
            <div className="w-20 h-3 bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicListSkeleton; 