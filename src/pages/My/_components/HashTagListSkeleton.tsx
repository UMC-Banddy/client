const HashTagListSkeleton = () => {
  return (
    <div className="flex flex-wrap px-[24px] gap-[8px] mb-[5vh] w-full animate-pulse">
      {/* 태그 스켈레톤들 */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-20 h-8 bg-gray-700 rounded-full"
        />
      ))}
    </div>
  );
};

export default HashTagListSkeleton; 