const ArtistListSkeleton = () => {
  return (
    <div className="flex flex-col gap-[12px] mb-[3vh] animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center">
          {/* 원형 이미지 스켈레톤 */}
          <div className="w-[14vw] h-[14vw] rounded-full bg-gray-700 mr-[16px] max-w-[55px] max-h-[55px]" />
          {/* 제목 스켈레톤 */}
          <div className="w-32 h-4 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ArtistListSkeleton; 