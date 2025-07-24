import React from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "@/assets/icons/back.svg";

interface PretestHeaderProps {
  onSkip?: () => void;
  onNext?: () => void;
  showNext?: boolean;
  nextDisabled?: boolean;
  progress?: number; // 0-100 사이의 진행률
}

const PretestHeader: React.FC<PretestHeaderProps> = ({
  onSkip,
  onNext,
  showNext = false,
  nextDisabled = false,
  progress = 0,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* 상단바 */}
      <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-[18px] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] xl:h-[100px] 2xl:h-[110px]">
        <button
          onClick={() => navigate(-1)}
          className="bg-none border-none text-white text-[28px] cursor-pointer flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18"
        >
          <img
            src={backIcon}
            alt="Back"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12"
          />
        </button>
        <div className="flex-1" />
        {!showNext && (
          <button
            onClick={onSkip}
            className="bg-none border-none text-[#aaa] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium mr-3 cursor-pointer"
          >
            건너뛰기
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`bg-none border-none text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold cursor-pointer ${
              nextDisabled ? "text-[#444]" : "text-[#7ED957]"
            }`}
          >
            다음
          </button>
        )}
      </div>

      {/* 프로그레스 바 */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8">
        <div className="w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5 xl:h-3 2xl:h-4 bg-[#333] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B71C1C] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default PretestHeader;
