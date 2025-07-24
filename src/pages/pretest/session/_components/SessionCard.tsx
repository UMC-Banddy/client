import React, { useState } from "react";

export interface SessionLevel {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Session {
  id: string;
  name: string;
  levels: SessionLevel[];
}

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  selectedLevel?: string;
  onSelect: (sessionId: string) => void;
  onLevelSelect: (sessionId: string, levelId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isSelected,
  selectedLevel,
  onSelect,
  onLevelSelect,
}) => {
  const [showLevels, setShowLevels] = useState(false);

  const handleCardClick = () => {
    if (!isSelected) {
      onSelect(session.id);
      setShowLevels(true);
    } else {
      setShowLevels(!showLevels);
    }
  };

  const handleLevelClick = (levelId: string) => {
    onLevelSelect(session.id, levelId);
    setShowLevels(false);
  };

  return (
    <div className="w-full">
      {/* 세션 카드 */}
      <div
        className={`w-full px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 xl:px-14 xl:py-8 2xl:px-16 2xl:py-9 bg-[#292929] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] xl:rounded-[4rem] 2xl:rounded-[5rem] border border-white cursor-pointer transition-all duration-200 ${
          isSelected ? "border-[#7ED957] shadow-lg" : "hover:border-gray-300"
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-center">
          {/* 가운데 텍스트 (이모티콘 포함) */}
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white text-center">
            {session.name}
          </span>
        </div>

        {/* 선택 상태 표시 */}
        {isSelected && (
          <div className="flex justify-center mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 2xl:mt-7">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-[#7ED957] font-medium">
                {session.levels.find((level) => level.id === selectedLevel)
                  ?.name || "선택됨"}
              </span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-[#7ED957]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 실력 레벨 선택 (선택된 경우에만 표시) */}
      {isSelected && showLevels && (
        <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 bg-[#f8f8f8] rounded-2xl sm:rounded-3xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-3xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
            {session.levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={`flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 rounded-2xl sm:rounded-3xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-3xl transition-all duration-200 ${
                  selectedLevel === level.id
                    ? "bg-[#7ED957] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {/* 라디오 버튼 */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 rounded-full border-2 flex items-center justify-center ${
                    selectedLevel === level.id
                      ? "border-white bg-white"
                      : "border-gray-400 bg-transparent"
                  }`}
                >
                  {selectedLevel === level.id && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5 bg-[#7ED957] rounded-full"></div>
                  )}
                </div>

                {/* 레벨 정보 */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
                    {level.icon}
                  </span>
                  <div>
                    <div
                      className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold ${
                        selectedLevel === level.id
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {level.name}
                    </div>
                    <div
                      className={`text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl ${
                        selectedLevel === level.id
                          ? "text-white/80"
                          : "text-gray-600"
                      }`}
                    >
                      {level.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
