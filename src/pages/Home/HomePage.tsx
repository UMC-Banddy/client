import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BandCarousel from "./_components/BandCarousel";
import HomeSkeleton from "./_components/HomeSkeleton";
import MuiDialog from "@/shared/components/MuiDialog";
import BandInfoModal from "./_components/BandInfoModal";
import { getRecruitingBandSummaries } from "@/store/userStore";
import { useRecommendedBands } from "@/features/band/hooks/useBandData";
import { useProfile } from "@/features/my/hooks/useProfile";
import type {} from "@/types/band";
import { createGroupChat } from "@/store/chatApi";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
// import { useSnapshot } from "valtio"; // eslint 에러로 인해 임시 주석
// import { authStore } from "@/store/authStore"; // eslint 에러로 인해 임시 주석
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";

// 이미지 import
import homeAlbum3Img from "@/assets/images/home-album3.png";

interface TrackDto {
  title: string;
  artist: string;
  imageUrl: string;
}

interface ArtistDto {
  name: string;
  imageUrl: string;
}

interface CompositionDto {
  averageAge: string;
  maleCount: number;
  femaleCount: number;
}

interface SnsDto {
  platform: string;
  url: string;
}

interface BandProfileData {
  goalTracks: TrackDto[];
  preferredArtists: ArtistDto[];
  composition: CompositionDto;
  sns: SnsDto[];
  sessions: string[];
  jobs: string[];
}

interface Band {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  tags: string[];
  profileData?: BandProfileData; // 원본 프로필 데이터 저장
  bandName?: string; // 상세 정보에서 가져온 밴드명 (없으면 undefined)
}

interface ChatRoomInfo {
  roomId: number;
  roomType: string;
  chatName?: string;
  bandName?: string;
  roomName?: string;
  bandId?: number;
}

// 세션 이름 정리 및 아이콘 매핑 함수
const cleanSessionName = (sessionName: string): string => {
  // 이모지 제거
  return sessionName.replace(/[🪕🎤🥁🎹🎻🎺🎸]/gu, "").trim();
};

// const getSessionIcon = (sessionName: string) => {
//   const cleanName = cleanSessionName(sessionName).toLowerCase();

//   if (cleanName.includes("보컬") || cleanName.includes("vocal")) return MicImg;
//   if (cleanName.includes("어쿠스틱 기타") || cleanName.includes("acoustic guitar"))
//     return AcousticGuitarImg;
//   if (cleanName.includes("기타") || cleanName.includes("guitar"))
//     return GuitarImg;
//   if (cleanName.includes("베이스") || cleanName.includes("bass"))
//     return BassImg;
//   if (cleanName.includes("드럼") || cleanName.includes("drum")) return DrumImg;
//   if (cleanName.includes("피아노") || cleanName.includes("piano"))
//     return PianoImg;
//   if (cleanName.includes("바이올린") || cleanName.includes("violin"))
//     return ViolinImg;
//   if (cleanName.includes("트럼펫") || cleanName.includes("trumpet"))
//     return TrumpetImg;

//   // 기본값
//   return MicImg;
// };

const HomePage = () => {
  const navigate = useNavigate();
  // const authSnap = useSnapshot(authStore); // eslint 에러로 인해 임시 주석
  const [myBands, setMyBands] = useState<Band[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: recommended = [], isFetching } = useRecommendedBands();
  const { data: userProfile } = useProfile();
  // 홈 진입 시 채팅방 목록 선조회(캐시 용도)
  const [chatRoomInfosCache, setChatRoomInfosCache] = useState<ChatRoomInfo[]>(
    []
  );
  // 밴드별 매칭된 roomId 매핑
  const [bandRoomMap, setBandRoomMap] = useState<Record<number, number>>({});

  // WebSocket 연결 관리 - 앱 전체 생명주기 동안 유지
  useWebSocketConnection();

  // 추천 밴드 프로필 조회 API
  const fetchRecommendedBands = async () => {
    try {
      setLoading(true);

      // 사전테스트 중에는 기본 데이터만 사용하여 API 호출 최소화
      if (window.location.pathname.startsWith("/pre-test")) {
        setMyBands([]);
        return;
      }

      // /api/recruitments/recruiting 엔드포인트에서 모집중인 밴드 목록 조회
      const recruitingSummaries = await getRecruitingBandSummaries({
        page: 0,
        size: 200,
        useCache: true,
        cacheMs: 5 * 60 * 1000, // 5분 캐시
      });

      console.log("API 응답 원본:", recruitingSummaries);

      if (!recruitingSummaries || recruitingSummaries.length === 0) {
        // 모집중인 밴드가 없으면 빈 배열 설정
        setMyBands([]);
        return;
      }

      // 이미 필터링된 데이터이므로 바로 사용
      const recruitingBands = recruitingSummaries;

      console.log(
        "RECRUITING 상태 필터링 후:",
        recruitingBands.length,
        "개 밴드"
      );

      if (recruitingBands.length === 0) {
        // 모집중인 밴드가 없으면 빈 배열 설정
        setMyBands([]);
        return;
      }

      // 모집중인 밴드들을 Band 인터페이스에 맞게 변환
      const bands: Band[] = recruitingBands.map(
        (recruit: Record<string, unknown>) => {
          const goalTracks = Array.isArray(recruit?.tracks)
            ? recruit.tracks.map((t: Record<string, unknown>) => ({
                title: String(t?.title || ""),
                artist: String(t?.artist || ""),
                imageUrl: String(t?.imageUrl || ""),
              }))
            : [];
          const preferredArtists = Array.isArray(recruit?.artists)
            ? recruit.artists.map((a: Record<string, unknown>) => ({
                name: String(a?.name || ""),
                imageUrl: String(a?.imageUrl || ""),
              }))
            : [];
          const composition = {
            averageAge: String(recruit?.averageAge || ""),
            maleCount: Number(recruit?.maleCount || 0),
            femaleCount: Number(recruit?.femaleCount || 0),
          };

          // 모집하는 세션 (sessions)과 현재 구성원 세션 (currentSessions) 구분
          const recruitingSessions = Array.isArray(recruit?.sessions)
            ? recruit.sessions
            : [];
          const currentMemberSessions = Array.isArray(recruit?.currentSessions)
            ? recruit.currentSessions
            : [];

          const representativeTrack = goalTracks[0];
          const representativeArtist = preferredArtists[0];

          // 태그 구성: 모집 세션 + 장르
          const tags = [];

          // 1. 모집하는 세션 태그들 (사용자와 연관성에 따라 색상 결정)
          if (recruitingSessions.length > 0) {
            tags.push(
              ...recruitingSessions.map((session: string) =>
                cleanSessionName(session)
              )
            );
          }

          // 2. 장르 태그들 (검은색으로 표시)
          if (Array.isArray(recruit?.genres) && recruit.genres.length > 0) {
            tags.push(...recruit.genres);
          }

          // 3. 태그가 없으면 기본값
          if (tags.length === 0) {
            tags.push("모집중");
          }

          console.log(`밴드 ${recruit?.name || recruit?.bandName} 태그:`, {
            recruitingSessions,
            genres: recruit?.genres,
            finalTags: tags,
          });

          return {
            id: Number(recruit?.bandId || recruit?.id),
            image:
              String(recruit?.profileImageUrl || "") ||
              representativeTrack?.imageUrl ||
              representativeArtist?.imageUrl ||
              homeAlbum3Img,
            title: String(
              recruit?.name ||
                recruit?.bandName ||
                `밴드 ${recruit?.bandId || recruit?.id}`
            ),
            subtitle: String(recruit?.description || ""),
            tags,
            profileData: {
              goalTracks,
              preferredArtists,
              composition,
              sns: [],
              sessions: recruitingSessions, // 모집하는 세션
              currentSessions: currentMemberSessions, // 현재 구성원 세션
              jobs: Array.isArray(recruit?.jobs) ? recruit.jobs : [],
              genres: Array.isArray(recruit?.genres) ? recruit.genres : [],
            },
            bandName: String(recruit?.name || recruit?.bandName || ""),
            representativeSongFileUrl:
              String(
                (recruit?.representativeSongFile as Record<string, unknown>)
                  ?.fileUrl || ""
              ) || null,
          } as Band;
        }
      );

      setMyBands(bands);
    } catch (error) {
      console.error("모집중인 밴드 조회 실패:", error);
      // 에러 시 빈 배열 사용
      setMyBands([]);
    } finally {
      setLoading(false);
    }
  };

  // 홈 진입 시 자동으로 채팅방 목록 조회
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsRes = await API.get(API_ENDPOINTS.CHAT.ROOMS);
        const chatInfos = roomsRes?.data?.result?.chatRoomInfos ?? [];
        setChatRoomInfosCache(chatInfos);
      } catch {
        // 조회 실패 시 무시
      }
    };
    fetchRooms();
  }, []);

  // 캐러셀 밴드와 채팅방 목록을 비교하여 매핑 구성
  useEffect(() => {
    if (!myBands?.length || !chatRoomInfosCache?.length) return;

    const normalize = (s: unknown) =>
      String(s || "")
        .trim()
        .toLowerCase();

    const roomMap: Record<number, number> = {};
    for (const band of myBands) {
      const bandName = normalize(band.title);
      const candidate = chatRoomInfosCache.find((r: ChatRoomInfo) => {
        const roomType = r?.roomType;
        const name = normalize(r?.chatName || r?.bandName || r?.roomName);
        const byId = Number(r?.bandId);
        return (
          (roomType === "BAND-APPLICANT" ||
            roomType === "BAND-MANAGER" ||
            roomType === "GROUP") &&
          ((byId && byId === band.id) || (!!name && name === bandName))
        );
      });
      if (candidate?.roomId) {
        roomMap[band.id] = Number(candidate.roomId);
      }
    }
    if (Object.keys(roomMap).length) {
      setBandRoomMap((prev) => ({ ...prev, ...roomMap }));
    }
  }, [myBands, chatRoomInfosCache]);

  const handleJoinClick = async (band: Band) => {
    try {
      // 1) 사전 지정된 룸 바로 입장(데모 계정용 예외 유지)
      if (band.id === 49) {
        navigate("/home/chat?roomId=52&roomType=GROUP");
        return;
      }

      // 2) 밴드에 대응되는 기존 채팅방 매핑이 있으면 바로 이동
      const mappedRoomId = bandRoomMap[band.id];
      if (mappedRoomId) {
        navigate(`/home/chat?roomId=${mappedRoomId}&roomType=GROUP`);
        return;
      }

      // 2-1) 서버에 BAND_JOIN 미구현(404 등) 시 백업 경로:
      // 우선 캐시에서 탐색, 없으면 즉시 조회 후 탐색
      try {
        const chatInfosLocal = chatRoomInfosCache.length
          ? chatRoomInfosCache
          : (await API.get(API_ENDPOINTS.CHAT.ROOMS))?.data?.result
              ?.chatRoomInfos ?? [];
        const bandRoom = chatInfosLocal.find(
          (r: ChatRoomInfo) =>
            (r?.roomType === "BAND-APPLICANT" ||
              r?.roomType === "BAND-MANAGER") &&
            (r?.bandId === band.id || r?.bandName === band.title)
        );
        const fallbackRoomId = bandRoom?.roomId;
        if (fallbackRoomId) {
          navigate(`/home/chat?roomId=${fallbackRoomId}&roomType=GROUP`);
          return;
        }
      } catch {
        // 조회 실패 시 무시
      }

      // 2-2) 목록에도 없으면 방 생성 시도(그룹 채팅)
      try {
        console.log(`밴드 ${band.id}를 위한 그룹 채팅방 생성 시도...`);

        // 테스트용 멤버 ID (실제 사용자 ID로 변경 필요)
        const testMemberIds = [1, 2]; // 테스트용 사용자 ID들

        const createRes = await createGroupChat({
          memberIds: testMemberIds,
          roomName: band.title || `밴드 모집_${band.id}`,
        });

        console.log("채팅방 생성 응답:", createRes);

        const newRoomId = (createRes as { roomId?: number })?.roomId;
        if (newRoomId) {
          console.log(`그룹 채팅방 생성 성공: ${newRoomId}`);
          // 채팅방 생성 성공 시 바로 이동
          navigate(`/home/chat?roomId=${newRoomId}&roomType=GROUP`);
          return;
        } else {
          console.warn("채팅방 생성 응답에 roomId가 없음:", createRes);
        }
      } catch (error) {
        console.error("그룹 채팅방 생성 실패:", error);
        // 방 생성 실패 시 무시하고 계속 진행
      }

      // 3) roomId를 얻지 못한 경우, 기존 모달로 fallback
      setSelectedBand(band);
      setOpen(true);
    } catch {
      // 오류 시에도 기존 모달로 fallback
      setSelectedBand(band);
      setOpen(true);
    }
  };

  // 이미지 클릭 시 밴드 상세 섹션 이동 등 확장용 (현재는 모달 오픈 동일 동작)
  const handleImageClick = (band: Band) => {
    setSelectedBand(band);
    setOpen(true);
  };

  useEffect(() => {
    // 사전테스트 중에는 API 호출하지 않음
    if (!window.location.pathname.startsWith("/pre-test")) {
      fetchRecommendedBands();
    }
    // 훅 데이터가 갱신되면 다시 바인딩 (의존성 배열 최적화)
  }, []); // recommended 의존성 제거하여 불필요한 재실행 방지

  // 홈에서는 WS 자동 연결을 수행하지 않음 (전역 AuthProvider에서 1회만 연결)

  // 개발 모드에서 밴드 상세정보 조회 테스트
  useEffect(() => {
    if (import.meta.env.DEV && myBands.length > 0 && myBands.length <= 3) {
      // 로그를 줄여서 성능 향상
      console.log("=== 밴드 정보 로드 완료 ===");
      console.log("로드된 밴드 수:", myBands.length);
    }
  }, [myBands]);

  // 사용자 세션 정보 추출
  const userSessions = useMemo(() => {
    return (
      userProfile?.availableSessions?.map(
        (session: { sessionType: string }) => session.sessionType
      ) || []
    );
  }, [userProfile]);

  if (loading || isFetching) {
    // 개발 모드에서는 더 빠른 로딩 처리
    if (import.meta.env.DEV && myBands.length > 0) {
      // 이미 데이터가 있으면 로딩 스켈레톤을 보여주지 않음
      return (
        <>
          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto">
            <div className="w-full flex flex-col items-center overflow-hidden">
              {/* 캐러셀 */}
              <div className="w-full overflow-hidden">
                <BandCarousel
                  bands={myBands}
                  onJoinClick={handleJoinClick}
                  onImageClick={handleImageClick}
                  userSessions={userSessions}
                />
              </div>
            </div>
          </main>
          <MuiDialog open={open} setOpen={setOpen}>
            <BandInfoModal
              imageUrl={
                selectedBand?.profileData?.goalTracks?.[0]?.imageUrl ||
                selectedBand?.profileData?.preferredArtists?.[0]?.imageUrl ||
                selectedBand?.image
              }
              bandName={selectedBand?.title || ""}
              title={selectedBand?.title || ""}
              subtitle={selectedBand?.subtitle || ""}
              onClose={() => setOpen(false)}
              tags={selectedBand?.tags || []}
              description={selectedBand?.subtitle || ""}
              deadline={new Date().toISOString()}
              userSessions={userSessions}
            />
          </MuiDialog>
        </>
      );
    }
    return <HomeSkeleton />;
  }

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto">
        <div className="w-full flex flex-col items-center overflow-hidden">
          {/* 캐러셀 */}
          <div className="w-full overflow-hidden">
            <BandCarousel
              bands={myBands}
              onJoinClick={handleJoinClick}
              onImageClick={handleImageClick}
              userSessions={userSessions}
            />
          </div>
        </div>
      </main>
      <MuiDialog open={open} setOpen={setOpen}>
        <BandInfoModal
          imageUrl={
            selectedBand?.profileData?.goalTracks?.[0]?.imageUrl ||
            selectedBand?.profileData?.preferredArtists?.[0]?.imageUrl ||
            selectedBand?.image
          }
          bandName={selectedBand?.title || ""}
          title={selectedBand?.title || ""}
          subtitle={selectedBand?.subtitle || ""}
          onClose={() => setOpen(false)}
          tags={selectedBand?.tags || []}
          description={selectedBand?.subtitle || ""}
          deadline={new Date().toISOString()}
          userSessions={userSessions}
        />
      </MuiDialog>
    </>
  );
};

export default HomePage;
