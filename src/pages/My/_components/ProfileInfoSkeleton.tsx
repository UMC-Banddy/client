const ProfileInfoSkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-[28px] px-[24px] pt-[1.8vh] pb-[4vh] w-full animate-pulse">
      {/* 아바타 스켈레톤 */}
      <div className="w-[25vw] h-[25vw] rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 max-w-[100px] max-h-[100px]" />
      
      {/* 정보 영역 스켈레톤 */}
      <div className="flex flex-col justify-center flex-1 min-w-0 space-y-2">
        {/* 닉네임 스켈레톤 */}
        <div className="w-1/3 h-4 bg-gray-700 rounded mb-[1vh]" />
        
        {/* 바이오 스켈레톤 */}
        <div className="w-full h-3 bg-gray-700 rounded mb-[2vh]" />
        
        
      </div>
    </div>
  );
};

export default ProfileInfoSkeleton; 