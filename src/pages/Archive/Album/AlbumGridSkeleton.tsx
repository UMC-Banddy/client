const AlbumGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 justify-items-center gap-x-[12px] mb-[3vh] animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-start max-w-[166px] break-keep">
          {/* 이미지 스켈레톤 */}
          <div className="relative w-[42vw] h-[42vw] max-w-[166px] max-h-[166px] overflow-hidden bg-gray-700 rounded" />
          {/* 제목 스켈레톤 */}
          <div className="mt-[1.4vh] mb-[2.8vh] w-3/4 h-3 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default AlbumGridSkeleton; 