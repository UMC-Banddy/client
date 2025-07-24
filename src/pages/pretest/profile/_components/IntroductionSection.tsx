import React, { useState } from "react";

interface IntroductionSectionProps {
  introduction: string;
  onEdit?: () => void;
  onIntroductionChange?: (text: string) => void;
}

const IntroductionSection: React.FC<IntroductionSectionProps> = ({
  introduction,
  onEdit,
  onIntroductionChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempIntroduction, setTempIntroduction] = useState(introduction);

  const handleSave = () => {
    onIntroductionChange?.(tempIntroduction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempIntroduction(introduction);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
          소개글
        </h3>
        {isEditing ? (
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
            <button
              onClick={handleSave}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              onClick={handleCancel}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#B71C1C] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium hover:text-red-400 transition-colors"
          >
            수정
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={tempIntroduction}
          onChange={(e) => setTempIntroduction(e.target.value)}
          className="w-full bg-transparent text-white border-none outline-none resize-none text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl leading-relaxed"
          rows={4}
          autoFocus
        />
      ) : (
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white leading-relaxed">
          {introduction}
        </p>
      )}
    </div>
  );
};

export default IntroductionSection;
