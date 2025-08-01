import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "../artist/_components/PretestHeader";
import SessionList from "./_components/SessionList";
import SkillGuideModal from "./_components/SkillGuideModal";
import { surveyAPI, profileAPI, artistSaveAPI } from "@/api/API";
import { SESSIONS } from "./_components/sessionData";

// 임시로 만들었습니다.. (타입 정의)
interface ProfileData {
  gender: string;
  nickname: string;
  age: number;
  region: string;
  district: string;
  bio: string;
  profileImageUrl: string;
  availableSessions: Array<{ sessionType: string; level: string }>;
  tags: string[];
  savedTracks: Array<{ title: string; imageUrl?: string }>;
}

const PretestSessionPage = () => {
  const navigate = useNavigate();
  const [selectedSessions, setSelectedSessions] = useState<
    Record<string, string>
  >({});
  const [sessions, setSessions] = useState(SESSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  // const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  // Session 데이터 로드
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const apiData = await surveyAPI.getSessions();
        console.log("서버 세션 데이터:", apiData);

        // API 데이터와 mock 데이터의 levels를 결합
        const combinedSessions = apiData.map((apiSession) => {
          const mockSession = SESSIONS.find((s) => s.name === apiSession.name);
          return {
            ...apiSession,
            id: apiSession.id.toString(), // API는 number, UI는 string 사용
            levels: mockSession?.levels || SESSIONS[0].levels, // 기본값으로 첫 번째 세션의 levels 사용
          };
        });

        setSessions(combinedSessions);
        setError(null);
      } catch (err) {
        console.error("Session 데이터 로드 실패:", err);
        setError("Session 데이터를 불러오는데 실패했습니다.");
        // API 실패 시 mock 데이터 사용
        setSessions(SESSIONS);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

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
    navigate("/pre-test/profile/complete");
  };

  // 다음 단계 처리
  const handleNext = async () => {
    if (Object.keys(selectedSessions).length > 0) {
      try {
        setSubmitting(true);

        // 1. 아티스트 저장 처리
        // localStorage에서 선택된 아티스트 정보 가져오기
        const savedArtistData = localStorage.getItem("selectedArtists");
        if (savedArtistData) {
          try {
            const artistSpotifyIds = JSON.parse(savedArtistData);
            console.log("저장된 아티스트 데이터:", artistSpotifyIds);

            // 각 아티스트를 개별적으로 저장
            const artistSavePromises = artistSpotifyIds.map(
              async (spotifyId: string) => {
                try {
                  const result = await artistSaveAPI.saveArtist(spotifyId);
                  console.log(`아티스트 ${spotifyId} 저장 성공:`, result);
                  return result;
                } catch (error) {
                  console.error(`아티스트 ${spotifyId} 저장 실패:`, error);
                  throw error;
                }
              }
            );

            await Promise.all(artistSavePromises);
            console.log("모든 아티스트 저장 완료");

            // 저장 완료 후 localStorage에서 제거
            localStorage.removeItem("selectedArtists");
          } catch (artistError) {
            console.error("아티스트 저장 중 오류:", artistError);
            // 아티스트 저장 실패해도 세션 저장은 계속 진행
          }
        }

        // 2. 세션 데이터 처리
        // selectedSessions를 availableSessions 형식으로 변환
        const availableSessions = Object.entries(selectedSessions).map(
          ([sessionId, levelId]) => {
            // sessionId를 실제 세션 정보에서 찾아서 올바른 sessionType으로 변환
            const session = sessions.find((s) => s.id === sessionId);

            // 서버에서 가져온 세션 데이터를 기반으로 sessionType 결정
            // 서버가 제공한 session.name을 그대로 사용 (이미 올바른 형식)
            let sessionType = session ? session.name : sessionId;

            // 디버깅을 위한 로그
            console.log("원본 세션 이름:", session?.name);
            console.log("변환 전 sessionType:", sessionType);

            // 서버가 기대하는 영문 세션 타입으로 변환
            const sessionTypeMapping: Record<string, string> = {
              "🎤 보컬 🎤": "vocal",
              "🎸 일렉 기타 🎸": "electric_guitar",
              "🪕 어쿠스틱 기타 🪕": "acoustic_guitar",
              "🪕 베이스 🪕": "bass",
              "🥁 드럼 🥁": "drums",
              "🎹 키보드 🎹": "keyboard",
              "🎻 바이올린 🎻": "violin",
              "🎺 트럼펫 🎺": "trumpet",
            };

            sessionType = sessionTypeMapping[sessionType] || sessionType;
            console.log("변환 후 sessionType:", sessionType);

            // levelId를 level로 변환 (예: "beginner" -> "beginner")
            const level = levelId;

            console.log(
              `세션 변환: ${sessionId} -> ${sessionType}, 레벨: ${level}`
            );

            return {
              sessionType,
              level,
            };
          }
        );

        console.log("전송할 세션 데이터:", availableSessions);
        console.log(
          "전송할 세션 데이터 (JSON):",
          JSON.stringify(availableSessions, null, 2)
        );

        // 기존 프로필 정보를 가져와서 availableSessions만 업데이트
        try {
          const currentProfile = await profileAPI.getProfile();
          console.log("현재 프로필 정보:", currentProfile);

          // 기존 프로필 정보와 새로운 세션 정보를 병합
          const updatedProfile = {
            // ...currentProfile.result, // 기존 프로필 정보 유지
            ...(currentProfile.result as ProfileData), // 기존 프로필 정보 유지
            availableSessions: availableSessions, // 세션 정보만 업데이트
          };

          console.log("업데이트할 프로필 정보:", updatedProfile);

          // 프로필 API로 세션 데이터 저장
          await profileAPI.updateProfile(updatedProfile);
        } catch (profileError) {
          console.error("프로필 조회 실패, 기본값으로 저장:", profileError);

          // 프로필 조회 실패 시 기본값으로 저장
          await profileAPI.updateProfile({
            availableSessions: availableSessions,
            nickname: "",
            age: 0,
            gender: "",
            region: "",
            district: "",
            bio: "",
            profileImage: "",
            mediaUrl: "",
            genres: [],
            artists: [],
            keywords: [],
          });
        }

        // 성공 시 다음 페이지로 이동
        navigate("/pre-test/profile/complete");
      } catch (error) {
        console.error("세션 데이터 제출 실패:", error);
        // 에러가 발생해도 다음 페이지로 이동 (선택사항)
        navigate("/pre-test/profile/complete");
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">
                  세션 목록을 불러오는 중...
                </div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-4">
                {error}
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
