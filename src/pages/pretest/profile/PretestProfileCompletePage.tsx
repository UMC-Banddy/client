import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "@/assets/images/profile1.png";
import pencilIcon from "@/assets/icons/pencil.svg";
import ProfileTag from "./_components/ProfileTag";
import SessionIcon from "./_components/SessionIcon";
import { profileAPI } from "@/api/API";

const PretestProfileCompletePage: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 데이터 로드 및 아이디 기반 저장 데이터 처리
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        // memberId가 있으면 아이디 기반 저장 데이터 처리
        const memberId = localStorage.getItem("memberId");
        if (memberId) {
          console.log("아이디 기반 저장 데이터 처리:", memberId);

          // localStorage에서 임시 저장된 데이터 가져오기
          const pendingArtists = localStorage.getItem("pendingArtists");
          const pendingSessions = localStorage.getItem("pendingSessions");

          if (pendingArtists || pendingSessions) {
            console.log("임시 저장된 데이터:", {
              pendingArtists,
              pendingSessions,
            });

            // 백엔드로 아이디 기반 저장 데이터 전송
            try {
              // 아티스트 데이터가 있으면 전송
              if (pendingArtists) {
                const artistData = JSON.parse(pendingArtists);
                // TODO: 백엔드 API 호출하여 아이디 기반으로 아티스트 저장
                console.log("아이디 기반 아티스트 저장:", artistData);
                localStorage.removeItem("pendingArtists");
              }

              // 세션 데이터가 있으면 전송
              if (pendingSessions) {
                const sessionData = JSON.parse(pendingSessions);
                // TODO: 백엔드 API 호출하여 아이디 기반으로 세션 저장
                console.log("아이디 기반 세션 저장:", sessionData);
                localStorage.removeItem("pendingSessions");
              }
            } catch (saveError) {
              console.error("아이디 기반 저장 실패:", saveError);
            }
          }
        }

        // 프로필 데이터 로드 (토큰 기반)
        try {
          const response = await profileAPI.getProfile();
          console.log("프로필 데이터:", response);

          if (response.isSuccess && response.result) {
            setProfileData(response.result);
          } else {
            console.warn("프로필 데이터가 없습니다:", response);
            setProfileData(null);
          }
          setError(null);
        } catch (profileError) {
          console.error("프로필 데이터 로드 실패:", profileError);
          // 프로필 로드 실패해도 에러로 표시하지 않음 (아이디 기반 저장은 성공했을 수 있음)
          setProfileData(null);
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는데 실패했습니다.");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleConfirm = () => {
    navigate("/");
  };

  const handleEdit = () => {
    navigate("/pre-test/profile/edit");
  };

  // 세션 타입에 따른 아이콘 반환
  // const getSessionIcon = (sessionType: string) => {
  //   const iconMapping: Record<string, string> = {
  //     vocal: "🎤",
  //     electric_guitar: "🎸",
  //     acoustic_guitar: "🪕",
  //     bass: "🪕",
  //     drums: "🥁",
  //     keyboard: "🎹",
  //     violin: "🎻",
  //     trumpet: "🎺",
  //   };
  //   return iconMapping[sessionType] || "🎤";
  // };

  return (
    <div className="w-full h-full flex flex-col text-white font-inherit">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
        <div className="flex-1"></div>
        <button
          onClick={handleConfirm}
          className="bg-none border-none text-[#7ED957] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold cursor-pointer"
        >
          확인
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* 완성 메시지 */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white font-medium leading-tight">
          사전테스트가 완료되었습니다!
        </h1>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center text-white text-lg">
              프로필 정보를 불러오는 중...
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center text-red-400 text-lg mb-4">{error}</div>
          )}

          {/* 프로필 카드 */}
          {!loading && (
            <div className="bg-gray-200 rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl 2xl:rounded-7xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 relative">
              {/* 수정 아이콘 - 우측 상단 */}
              <button
                onClick={handleEdit}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 xl:top-12 xl:right-12 2xl:top-14 2xl:right-14 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7"
              >
                <img
                  src={pencilIcon}
                  alt="수정"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13"
                />
              </button>

              {/* 프로필 이미지 및 기본 정보 */}
              <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <img
                  src={profileData?.profileImageUrl || profileImage}
                  alt="프로필"
                  className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 rounded-full object-cover"
                />
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-black mb-1 sm:mb-2">
                    {profileData?.nickname || "BECK"}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 mb-2 sm:mb-3">
                    {profileData?.age ? `${profileData.age}세` : "23세"} |{" "}
                    {profileData?.gender || "여성"} ·{" "}
                    {profileData?.region || "서울시"}{" "}
                    {profileData?.district || "노원구"}
                  </p>
                  <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 justify-center">
                    {/* API에서 availableSessions가 없으므로 기본 아이콘 표시 */}
                    <SessionIcon icon="🎤" />
                    <SessionIcon icon="🥁" />
                  </div>
                </div>
              </div>

              {/* 관심 장르 */}
              <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  관심 장르
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
                  {profileData?.tags?.length > 0 ? (
                    profileData.tags.map((tag: string, index: number) => (
                      <ProfileTag
                        key={index}
                        text={tag}
                        icon="🎵"
                        variant="genre"
                      />
                    ))
                  ) : (
                    <>
                      <ProfileTag
                        text="Tiwan Indie"
                        icon="🤘"
                        variant="genre"
                      />
                      <ProfileTag text="Rock" icon="🎸" variant="genre" />
                      <ProfileTag text="EMO" icon="💔" variant="genre" />
                    </>
                  )}
                </div>
              </div>

              {/* 관심 아티스트 */}
              <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium">
                    관심 아티스트
                  </h3>
                  <button
                    onClick={() => navigate("/pre-test/profile/edit")}
                    className="text-[#B71C1C] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium hover:text-red-400 transition-colors"
                  >
                    수정
                  </button>
                </div>
                <div className="flex gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 2xl:gap-11 overflow-x-auto scrollbar-hide">
                  {profileData?.savedTracks?.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    profileData.savedTracks.map((track: any, index: number) => (
                      <div key={index} className="flex-shrink-0 text-center">
                        <div className="relative inline-block">
                          <img
                            src={track.imageUrl || profileImage}
                            alt={track.title}
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                          />
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black font-medium">
                          {track.title}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex-shrink-0 text-center">
                        <div className="relative inline-block">
                          <img
                            src={profileImage}
                            alt="Gorillaz"
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                          />
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black font-medium">
                          Gorillaz
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <div className="relative inline-block">
                          <img
                            src={profileImage}
                            alt="Sheena ringo"
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                          />
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black font-medium">
                          Sheena ringo
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <div className="relative inline-block">
                          <img
                            src={profileImage}
                            alt="The cabs"
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                          />
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black font-medium">
                          The cabs
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 소개글 */}
              <div>
                <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  소개글
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black leading-relaxed">
                  {profileData?.bio ||
                    "안녕하세요 저는 파리의 택시운전사입니다. 파리는 정말 멋진 도시이고요 2025 파리 엑스포 화이팅!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PretestProfileCompletePage;
