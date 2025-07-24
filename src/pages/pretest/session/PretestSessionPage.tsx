import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "../artist/_components/PretestHeader";
import SessionList from "./_components/SessionList";
import SkillGuideModal from "./_components/SkillGuideModal";
import { SESSIONS } from "./_components/sessionData";

const PretestSessionPage = () => {
  const navigate = useNavigate();
  const [selectedSessions, setSelectedSessions] = useState<
    Record<string, string>
  >({});
  const [showSkillModal, setShowSkillModal] = useState(false);

  // 세션 선택 처리
  const handleSessionSelect = (sessionId: string) => {
    // 이미 선택된 세션이면 제거, 아니면 초보로 선택
    if (selectedSessions[sessionId]) {
      const newSelected = { ...selectedSessions };
      delete newSelected[sessionId];
      setSelectedSessions(newSelected);
    } else {
      // 새로운 세션 선택 시 초보로 기본 설정
      setSelectedSessions((prev) => ({
        ...prev,
        [sessionId]: "beginner",
      }));
    }
  };

  // 실력 레벨 선택 처리
  const handleLevelSelect = (sessionId: string, levelId: string) => {
    setSelectedSessions((prev) => ({
      ...prev,
      [sessionId]: levelId,
    }));
  };

  // 건너뛰기 처리
  const handleSkip = () => {
    navigate("/home");
  };

  // 다음 단계 처리
  const handleNext = () => {
    if (Object.keys(selectedSessions).length > 0) {
      navigate("/home");
    }
  };

  // 실력 기준 모달 열기
  const handleSkillGuideClick = () => {
    setShowSkillModal(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] text-white font-inherit">
      {/* 헤더 */}
      <PretestHeader
        onSkip={handleSkip}
        onNext={handleNext}
        showNext={Object.keys(selectedSessions).length > 0}
        nextDisabled={Object.keys(selectedSessions).length === 0}
        progress={60} // 두 번째 단계이므로 60% 진행
      />

      {/* 본문 */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 overflow-y-auto">
        {/* 컨테이너 - 데스크탑에서는 중앙 정렬, 모바일에서는 전체 너비 */}
        <div className="w-full max-w-4xl mx-auto">
          {/* 안내 텍스트 - 반응형으로 크기 조정 */}
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white font-medium leading-tight mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7">
              가능한 세션과 실력
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-400 font-medium mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7">
              실력의 기준이 애매하다면{" "}
              <span
                className="text-[#B71C1C] cursor-pointer hover:underline"
                onClick={handleSkillGuideClick}
              >
                여기를 눌러주세요.
              </span>
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-200">
              복수 응답
            </p>
          </div>

          {/* 세션 리스트 */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
            <SessionList
              sessions={SESSIONS}
              selectedSessions={selectedSessions}
              onSessionSelect={handleSessionSelect}
              onLevelSelect={handleLevelSelect}
            />
          </div>
        </div>
      </div>

      {/* 실력 기준 모달 */}
      <SkillGuideModal
        open={showSkillModal}
        onClose={() => setShowSkillModal(false)}
      />
    </div>
  );
};

export default PretestSessionPage;
