import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "../artist/_components/PretestHeader";
import SessionList from "./_components/SessionList";
import SkillGuideModal from "./_components/SkillGuideModal";
import { surveyAPI } from "@/api/API";
import { SESSIONS } from "./_components/sessionData";
import { useSurveySessions } from "@/features/pretest/hooks/useSurveyData";
import toast from "react-hot-toast";


const PretestSessionPage = () => {
  const navigate = useNavigate();
  const [selectedSessions, setSelectedSessions] = useState<
    Record<string, string>
  >({});
  const [sessions, setSessions] = useState(SESSIONS);
  const { data: apiSessions, isLoading, isError } = useSurveySessions();
  const [submitting, setSubmitting] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  // const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  // Session 데이터 로드 (react-query 결과와 결합)
  useEffect(() => {
    if (!apiSessions) return;
    const combined = apiSessions.map((apiSession) => {
      const mockSession = SESSIONS.find((s) => s.name === apiSession.name);
      return {
        ...apiSession,
        id: apiSession.id.toString(),
        levels: mockSession?.levels || SESSIONS[0].levels,
      };
    });
    setSessions(combined);
  }, [apiSessions]);

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

  // 건너뛰기 처리 - 홈으로 이동
  const handleSkip = () => {
    navigate("/");
  };

  // 다음 단계 처리
  const handleNext = async () => {
    if (Object.keys(selectedSessions).length > 0) {
      try {
        setSubmitting(true);
        // 1) 세션 데이터 변환: { sessionId: number, level: string }
        const sessionsPayload = Object.entries(selectedSessions).map(
          ([sessionId, levelId]) => {
            const numericId = Number(sessionId);
            // 백엔드 enum(Level)과 일치하도록 정규화
            const rawLevel = (levelId || "").toLowerCase();
            const levelMap: Record<string, "BEGINNER" | "INTERMEDIATE" | "ADVANCED"> = {
              beginner: "BEGINNER",
              novice: "BEGINNER",
              entry: "BEGINNER",
              intermediate: "INTERMEDIATE",
              middle: "INTERMEDIATE",
              advanced: "ADVANCED",
              expert: "ADVANCED",
              pro: "ADVANCED",
            };
            const level = levelMap[rawLevel] ?? "BEGINNER";

            // 세션 타입을 백엔드 enum(SessionType)으로 정규화
            const sessionObj = sessions.find((s) => {
              const sid = (s as unknown as { id?: string | number }).id;
              return Number(sid) === numericId;
            });
            const rawName = (sessionObj?.name || "").trim();
            // 이모지/특수문자 제거, 연속 공백 축소 후 소문자화
            const normalized = rawName
              .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "")
              .replace(/[^\p{L}\p{N}\s_]/gu, "")
              .replace(/\s+/g, " ")
              .trim()
              .toLowerCase();

            const typeMap: Record<string, string> = {
              // 한글 라벨
              "보컬": "VOCAL",
              "일렉 기타": "ELECTRIC_GUITAR",
              "어쿠스틱 기타": "ACOUSTIC_GUITAR",
              "베이스": "BASS",
              "드럼": "DRUM",
              "키보드": "KEYBOARD",
              "바이올린": "VIOLIN",
              "트럼펫": "TRUMPET",
              // 이모지 포함 라벨 (원본 매칭 용)
              "🎤 보컬 🎤": "VOCAL",
              "🎸 일렉 기타 🎸": "ELECTRIC_GUITAR",
              "🪕 어쿠스틱 기타 🪕": "ACOUSTIC_GUITAR",
              "🎵 베이스 🎵": "BASS",
              "🥁 드럼 🥁": "DRUM",
              "🎹 키보드 🎹": "KEYBOARD",
              "🎻 바이올린 🎻": "VIOLIN",
              "🎺 트럼펫 🎺": "TRUMPET",
              // 영문 키 대비
              vocal: "VOCAL",
              electric_guitar: "ELECTRIC_GUITAR",
              acoustic_guitar: "ACOUSTIC_GUITAR",
              bass: "BASS",
              drum: "DRUM",
              keyboard: "KEYBOARD",
              violin: "VIOLIN",
              trumpet: "TRUMPET",
            };

            // 1차: 원본 한글/이모지 직매칭 → 2차: 정규화 키 매칭 → 3차: 포함어 매칭
            let sessionType = typeMap[rawName] || typeMap[normalized];
            if (!sessionType) {
              if (normalized.includes("보컬")) sessionType = "VOCAL";
              else if (normalized.includes("일렉") || normalized.includes("electric")) sessionType = "ELECTRIC_GUITAR";
              else if (normalized.includes("어쿠스틱") || normalized.includes("acoustic")) sessionType = "ACOUSTIC_GUITAR";
              else if (normalized.includes("베이스") || normalized.includes("bass")) sessionType = "BASS";
              else if (normalized.includes("드럼") || normalized.includes("drum")) sessionType = "DRUM";
              else if (normalized.includes("키보드") || normalized.includes("keyboard")) sessionType = "KEYBOARD";
              else if (normalized.includes("바이올린") || normalized.includes("violin")) sessionType = "VIOLIN";
              else if (normalized.includes("트럼펫") || normalized.includes("trumpet")) sessionType = "TRUMPET";
            }

            if (!sessionType) {
              console.warn(
                `세션 타입 매핑 실패: id=${numericId}, name='${rawName}'. 기본값 미지정.`
              );
            }

            console.log(
              `세션 변환: ${sessionId} -> ${numericId}, 타입: ${sessionType}, 레벨: ${level}`
            );
            return { sessionId: numericId, level, sessionType } as {
              sessionId: number;
              level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
              sessionType?: string;
            };
          }
        );

        console.log("전송할 세션 데이터:", sessionsPayload);
        console.log(
          "전송할 세션 데이터 (JSON):",
          JSON.stringify(sessionsPayload, null, 2)
        );
        
        // 2) 단일 제출: 아티스트 + 세션 묶어서 한 번만 호출
        const memberId = localStorage.getItem("memberId");
        const savedArtistIds = localStorage.getItem("artistIds");
        const artistIds: number[] = savedArtistIds
          ? JSON.parse(savedArtistIds)
          : [];

        if (!memberId) {
          throw new Error("로그인이 필요합니다. memberId가 없습니다.");
        }
        if (artistIds.length === 0) {
          throw new Error("선택된 아티스트가 없습니다.");
        }

        await surveyAPI.submitSurvey(
          {
            genreNames: [],
            keywords: {},
            artistIds,
            sessions: sessionsPayload,
            snsLinks: [],
            profileImageUrl: null,
            bio: null,
            mediaUrl: null,
          },
          memberId
        );

        // 제출 후 임시 저장 데이터 정리
        localStorage.removeItem("artistIds");

        // 성공 시 다음 페이지로 이동
        navigate("/pre-test/profile/complete");
      } catch (error) {
        console.error("세션 데이터 제출 실패:", error);
        // 에러 시 이동하지 않고 오류 안내
        toast.error("사전테스트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setSubmitting(false);
      }
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
        nextDisabled={Object.keys(selectedSessions).length === 0 || submitting}
        nextText={submitting ? "저장 중..." : "다음"}
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">
                  세션 목록을 불러오는 중...
                </div>
              </div>
            ) : isError ? (
              <div className="text-red-400 text-center py-4">
                Session 데이터를 불러오는데 실패했습니다.
                <div className="text-sm text-gray-400 mt-2">
                  (기본 세션 목록을 표시합니다)
                </div>
              </div>
            ) : null}
            <SessionList
              sessions={sessions}
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
