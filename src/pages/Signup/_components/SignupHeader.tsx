import React from "react";
import whiteStar from "../../../assets/logos/white-star.svg";

interface SignupHeaderProps {
  progress: number; // 0-100 사이의 진행률
  className?: string;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({ progress, className = "" }) => {
  return (
    <>
      {/* 프로그레스 바 */}
      <div className={`w-full h-0.5 bg-[#959595] ${className}`}>
        <div 
          className="h-full bg-[#C7242D] transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 별 아이콘 */}
      <img 
        src={whiteStar} 
        alt="step" 
        className="absolute right-6 top-[18px] w-8 h-8" 
      />
    </>
  );
};

export default SignupHeader; 