import React from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "../artist/_components/PretestHeader";

const PretestSessionPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/pre-test/artist");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] text-white font-inherit">
      {/* 헤더 */}
      <PretestHeader
        onNext={handleBack}
        showNext={true}
        nextDisabled={false}
        progress={60} // 두 번째 단계이므로 60% 진행
      />

      {/* 본문 */}
      <div className="flex-1 px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg text-white font-medium mb-4">세션 페이지</h2>
          <p className="text-gray-400">
            이 페이지는 향후 세션 관련 기능이 구현될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PretestSessionPage;
