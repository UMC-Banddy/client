import React from "react";

interface PreferTitleProps {
  nickname: string;
}

const PreferTitle: React.FC<PreferTitleProps> = ({ nickname }) => (
  <div className="text-white text-lg font-medium text-center mt-2">
    {nickname}의 선호 아티스트
  </div>
);

export default PreferTitle;
