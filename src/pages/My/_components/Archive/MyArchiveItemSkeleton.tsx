const MyArchiveItemSkeleton = () => {
  return (
    <div className="flex flex-col items-start cursor-pointer max-w-[104px] animate-pulse">
      {/* 이미지 영역 스켈레톤 */}
      <div className="relative w-[26vw] h-[26vw] overflow-hidden flex items-center justify-center max-w-[104px] max-h-[104px] bg-gray-700 rounded" />
      
      {/* 제목 영역 스켈레톤 */}
      <div className="w-full mt-[1vh]">
        <div className="w-3/4 h-3 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default MyArchiveItemSkeleton; 