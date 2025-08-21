import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BandCarousel from "./_components/BandCarousel";
import HomeSkeleton from "./_components/HomeSkeleton";
import MuiDialog from "@/shared/components/MuiDialog";
import BandInfoModal from "./_components/BandInfoModal";
import {
  getRecruitingBandSummaries,
} from "@/store/userStore";
import { useRecommendedBands } from "@/features/band/hooks/useBandData";
import type {} from "@/types/band";
import { createGroupChat } from "@/store/chatApi";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

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
  const [myBands, setMyBands] = useState<Band[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: recommended = [], isFetching } = useRecommendedBands();
  // 홈 진입 시 채팅방 목록 선조회(캐시 용도)
  const [chatRoomInfosCache, setChatRoomInfosCache] = useState<ChatRoomInfo[]>(
    []
  );
  // 밴드별 매칭된 roomId 매핑
  const [bandRoomMap, setBandRoomMap] = useState<Record<number, number>>({});

  // 추천 밴드 프로필 조회 API
  const fetchRecommendedBands = async () => {
    try {
      setLoading(true);

      // 사전테스트 중에는 기본 데이터만 사용하여 API 호출 최소화
      if (window.location.pathname.startsWith("/pre-test")) {
        setMyBands([]);
        return;
      }

      // 1-200 범위에서 빠르게 조회하여 status가 'RECRUITING'인 밴드만 필터링
      const recruitingSummaries = await getRecruitingBandSummaries({
        page: 0,
        size: 200,
        useCache: true,
        cacheMs: 60 * 1000,
      });

      if (!recruitingSummaries || recruitingSummaries.length === 0) {
        // 모집중인 밴드가 없으면 빈 배열 설정
        setMyBands([]);
        return;
      }

      // status가 'RECRUITING'인 밴드만 필터링
      const recruitingBands = recruitingSummaries.filter(
        (recruit: Record<string, unknown>) => recruit.status === "RECRUITING"
      );

      if (recruitingBands.length === 0) {
        // 모집중인 밴드가 없으면 빈 배열 설정
        setMyBands([]);
        return;
      }

      // 모집중인 밴드들을 Band 인터페이스에 맞게 변환
      const bands: Band[] = recruitingBands.map((recruit: Record<string, unknown>) => {
        const goalTracks = Array.isArray(recruit?.tracks)
          ? recruit.tracks.map((t: Record<string, unknown>) => ({
              title: String(t?.title || ""),
              artist: "",
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
        const sessions = Array.isArray(recruit?.sessions)
          ? recruit.sessions
          : [];

        const representativeTrack = goalTracks[0];
        const representativeArtist = preferredArtists[0];

        const tags =
          sessions.length > 0
            ? sessions.map((session: string) => cleanSessionName(session))
            : ["모집중"];

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
            sessions,
            jobs: Array.isArray(recruit?.jobs) ? recruit.jobs : [],
          },
          bandName: String(recruit?.name || recruit?.bandName || ""),
          representativeSongFileUrl:
            String((recruit?.representativeSongFile as Record<string, unknown>)?.fileUrl || "") || null,
        } as Band;
      });

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
    // 훅 데이터가 갱신되면 다시 바인딩
  }, [recommended]);

  // 홈에서는 WS 자동 연결을 수행하지 않음 (전역 AuthProvider에서 1회만 연결)

  // 개발 모드에서 밴드 상세정보 조회 테스트
  useEffect(() => {
    if (import.meta.env.DEV && myBands.length > 0) {
      console.log("=== 밴드 상세정보 조회 테스트 시작 ===");
      console.log(
        "현재 설정된 밴드들:",
        myBands.map((b) => ({ id: b.id, title: b.title }))
      );

      // 첫 번째 밴드의 상세정보 조회 테스트
      const testBandId = myBands[0]?.id;
      if (testBandId) {
        console.log(`테스트: 밴드 ${testBandId} 상세정보 조회 시도`);
        // API 호출은 이미 probeSomeBandDetails에서 수행됨
      }
    }
  }, [myBands]);

  if (loading || isFetching) {
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
            />
          </div>
        </div>
      </main>
      <MuiDialog open={open} setOpen={setOpen}>
        <BandInfoModal
          imageUrl={
            selectedBand?.profileData?.goalTracks?.[0]?.imageUrl ||
            selectedBand?.image
          }
          title={selectedBand?.bandName || "--"}
          subtitle={
            selectedBand?.profileData?.goalTracks?.[0]?.artist ||
            selectedBand?.subtitle ||
            "베이스만 넷이에요 살려주세요"
          }
          onClose={() => setOpen(false)}
          tags={
            selectedBand?.profileData?.sessions?.map((session: string) =>
              cleanSessionName(session)
            ) ||
            selectedBand?.tags || [
              "20대 이상",
              "성별 무관",
              "서울 홍대",
              "부산 진구",
            ]
          }
          description={
            `목표 곡: ${selectedBand?.profileData?.goalTracks
              ?.map((track) => `${track.title} - ${track.artist}`)
              .join(", ")}\n\n` +
            `선호 아티스트: ${selectedBand?.profileData?.preferredArtists
              ?.map((artist) => artist.name)
              .join(", ")}\n\n` +
            `구성: 남성 ${selectedBand?.profileData?.composition?.maleCount}명, 여성 ${selectedBand?.profileData?.composition?.femaleCount}명\n` +
            `평균 나이: ${selectedBand?.profileData?.composition?.averageAge}`
          }
          deadline="25.07.08"
          youtubeUrl={
            selectedBand?.profileData?.sns?.find(
              (s) => s.platform === "youtube"
            )?.url || "https://www.youtube.com/@Banddy79"
          }
          instagramUrl={
            selectedBand?.profileData?.sns?.find(
              (s) => s.platform === "instagram"
            )?.url || "https://www.instagram.com/banddy79/"
          }
          bandId={selectedBand?.id?.toString()} // 추가
        />
      </MuiDialog>
    </>
  );
};

export default HomePage;
