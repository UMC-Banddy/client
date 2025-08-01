const SuggestionListSkeleton = () => {
  return (
    <div className="mt-[1.4vh] animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center w-[87vw] h-[5.7vh] py-[1.4vh]"
        >
          {/* 검색 아이콘 스켈레톤 */}
          <div className="w-[6vw] h-[6vw] mr-[16px] max-w-[25px] max-h-[25px] bg-gray-700 rounded" />
          {/* 텍스트 스켈레톤 */}
          <div className="w-32 h-4 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default SuggestionListSkeleton; 