import React from "react";

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
  const handleCardClick = () => {
    onSelect(session.id);
  };

  const handleLevelClick = (levelId: string) => {
    onLevelSelect(session.id, levelId);
  };

  return (
    <div className="w-full">
      {/* 세션 카드 */}
      <div
        className={`w-full px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 xl:px-14 xl:py-8 2xl:px-16 2xl:py-9 bg-[#292929] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] xl:rounded-[4rem] 2xl:rounded-[5rem] border cursor-pointer transition-all duration-200 ${
          isSelected ? "border-white" : "border-white hover:border-gray-300"
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          {/* 가운데 텍스트 (이모티콘 포함) */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white text-center">
              {session.name}
            </span>
          </div>

          {/* 우측 체크표시 (선택된 경우에만) */}
          {isSelected && (
            <div className="ml-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 bg-[#292929] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-[#C7242D]"
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
      </div>

      {/* 실력 레벨 선택 (선택된 경우에만 표시) */}
      {isSelected && (
        <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-2xl sm:rounded-3xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-3xl">
          <div className="flex justify-center gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 2xl:gap-11">
            {session.levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8"
              >
                {/* 라디오 버튼 */}
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-200 ${
                    selectedLevel === level.id
                      ? "bg-gray-400"
                      : "bg-transparent"
                  }`}
                >
                  {selectedLevel === level.id && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5 bg-[#292929] rounded-full"></div>
                  )}
                </div>

                {/* 레벨 텍스트 (우측에 배치) */}
                <span
                  className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium transition-colors duration-200 ${
                    selectedLevel === level.id ? "text-white" : "text-gray-400"
                  }`}
                >
                  {level.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
