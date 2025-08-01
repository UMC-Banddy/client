const SongListItemSkeleton = () => {
  return (
    <div className="flex items-center animate-pulse">
      {/* 이미지 스켈레톤 */}
      <div className="relative w-[14vw] h-[14vw] mr-[16px] max-w-[55px] max-h-[55px] bg-gray-700 rounded" />
      
      {/* 텍스트 영역 스켈레톤 */}
      <div className="flex-1 space-y-1">
        <div className="w-32 h-4 bg-gray-700 rounded" />
        <div className="w-24 h-3 bg-gray-700 rounded" />
      </div>
      
      {/* 버튼 스켈레톤 */}
      <div className="w-[7.8vw] h-[7.8vw] max-w-[31px] max-h-[31px] bg-gray-700 rounded" />
    </div>
  );
};

export default SongListItemSkeleton; 