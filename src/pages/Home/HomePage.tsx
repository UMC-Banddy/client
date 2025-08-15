import React, { useState, useEffect } from "react";
import BandCarousel from "./_components/BandCarousel";
import HomeSkeleton from "./_components/HomeSkeleton";
import MuiDialog from "@/shared/components/MuiDialog";
import BandInfoModal from "./_components/BandInfoModal";
import {
  getRecommendedFromSimilar,
  probeSomeBandDetails,
} from "@/store/userStore";
import { useRecommendedBands } from "@/features/band/hooks/useBandData";

// 이미지 import
import homeAlbum3Img from "@/assets/images/home-album3.png";
import homeAlbum1Img from "@/assets/images/home-album1.svg";
import homeAlbum2Img from "@/assets/images/home-album2.svg";
import oasisImg from "@/assets/images/oasis.png";
import pierrotImg from "@/assets/images/pierrot.png";
import profile1Img from "@/assets/images/profile1.png";
import theCabsImg from "@/assets/images/the-cabs.svg";
import guitarBoyImg from "@/assets/images/guitar-boy.svg";

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

// 임시 데이터 (API 연결 전까지 사용)
const fallbackBandData: Band[] = [
  {
    id: 1,
    image: homeAlbum3Img,
    title: "그래요 저 왜색 짙어요",
    subtitle: "혼또니 아리가또 고자이마스",
    tags: ["기타 모집", "YOASOBI", "J-POP", "aiko"],
  },
  {
    id: 2,
    image: homeAlbum1Img,
    title: "락 밴드 모집",
    subtitle: "열정적인 락커들 모여라",
    tags: ["드럼 모집", "락", "메탈", "하드락"],
  },
  {
    id: 3,
    image: homeAlbum2Img,
    title: "재즈 트리오",
    subtitle: "스윙하는 재즈의 세계로",
    tags: ["베이스 모집", "재즈", "스윙", "피아노"],
  },
  {
    id: 4,
    image: oasisImg,
    title: "인디 밴드",
    subtitle: "독립적인 음악을 만들어요",
    tags: ["보컬 모집", "인디", "얼터너티브", "포크"],
  },
  {
    id: 5,
    image: pierrotImg,
    title: "K-POP 커버",
    subtitle: "BTS, BLACKPINK 커버밴드",
    tags: ["키보드 모집", "K-POP", "커버", "댄스"],
  },
  {
    id: 6,
    image: profile1Img,
    title: "어쿠스틱 듀오",
    subtitle: "따뜻한 어쿠스틱 사운드",
    tags: ["기타 모집", "어쿠스틱", "포크", "발라드"],
  },
  {
    id: 7,
    image: theCabsImg,
    title: "일렉트로닉 밴드",
    subtitle: "디지털과 아날로그의 조화",
    tags: ["신디사이저 모집", "일렉트로닉", "EDM", "신스팝"],
  },
  {
    id: 8,
    image: guitarBoyImg,
    title: "블루스 밴드",
    subtitle: "깊이 있는 블루스 사운드",
    tags: ["하모니카 모집", "블루스", "로큰롤", "R&B"],
  },
  {
    id: 9,
    image: homeAlbum3Img,
    title: "팝 밴드",
    subtitle: "신나는 팝 음악",
    tags: ["드럼 모집", "팝", "록", "펑크"],
  },
  {
    id: 10,
    image: homeAlbum1Img,
    title: "클래식 앙상블",
    subtitle: "고전의 아름다움",
    tags: ["바이올린 모집", "클래식", "오케스트라", "실내악"],
  },
  {
    id: 11,
    image: homeAlbum2Img,
    title: "힙합 크루",
    subtitle: "비트와 라임의 세계",
    tags: ["MC 모집", "힙합", "랩", "비트박스"],
  },
  {
    id: 12,
    image: oasisImg,
    title: "컨트리 밴드",
    subtitle: "미국 남부의 향기",
    tags: ["스틸기타 모집", "컨트리", "웨스턴", "포크"],
  },
  {
    id: 13,
    image: pierrotImg,
    title: "레게 밴드",
    subtitle: "자유로운 레게 리듬",
    tags: ["베이스 모집", "레게", "스카", "둠"],
  },
  {
    id: 14,
    image: profile1Img,
    title: "펑크 밴드",
    subtitle: "반항적인 펑크 정신",
    tags: ["기타 모집", "펑크", "하드코어", "스카펑크"],
  },
  {
    id: 15,
    image: theCabsImg,
    title: "소울 밴드",
    subtitle: "깊이 있는 소울 음악",
    tags: ["보컬 모집", "소울", "R&B", "모타운"],
  },
];

const HomePage = () => {
  const [myBands, setMyBands] = useState<Band[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: recommended = [], isFetching } = useRecommendedBands();

  // 추천 밴드 프로필 조회 API
  const fetchRecommendedBands = async () => {
    try {
      setLoading(true);
      // 홈은 추천 결과 우선, 없으면 유사 트랙/아티스트 기반으로 대체 구성
      let profiles: BandProfileData[] =
        recommended && recommended.length > 0
          ? (recommended as BandProfileData[])
          : [];
      if (!profiles || profiles.length === 0) {
        profiles = (await getRecommendedFromSimilar()) as BandProfileData[];
      }

      // 선택적 보강: 일부 detail을 받아 제목/이미지 보강
      const details = await probeSomeBandDetails({ limit: 5 });

      // profiles가 빈 배열이거나 undefined인 경우 기본 데이터 사용
      if (!profiles || profiles.length === 0) {
        if (import.meta.env.DEV) {
          console.log("조회된 밴드가 없어서 기본 데이터 사용");
        }
        setMyBands(fallbackBandData);
        return;
      }

      // API 응답이 있지만 유효하지 않은 경우도 fallback 사용
      const validProfiles = profiles.filter((profile) =>
        Boolean(
          profile &&
            ((profile as BandProfileData).goalTracks ||
              (profile as BandProfileData).preferredArtists ||
              (profile as BandProfileData).sessions)
        )
      ) as BandProfileData[];

      if (validProfiles.length === 0) {
        if (import.meta.env.DEV) {
          console.log("유효한 밴드 데이터가 없어서 기본 데이터 사용");
        }
        setMyBands(fallbackBandData);
        return;
      }

      // 밴드 프로필 데이터를 캐러셀 형식으로 변환
      // const bands: Band[] = validProfiles.map((profile: any, index: number) => {
      const bands: Band[] = validProfiles.map(
        (profile: BandProfileData, index: number) => {
          const detail = details[index];
          // API 응답 구조에 따라 안전하게 접근
          const goalTracks = profile.goalTracks || [];
          const preferredArtists = profile.preferredArtists || [];
          const sessions = profile.sessions || [];

          // 디버깅용 로그
          console.log(`밴드 ${index + 1} 데이터:`, {
            goalTracks,
            preferredArtists,
            sessions,
            profile,
          });

          // 첫 번째 곡을 대표 이미지로 사용
          const representativeTrack = goalTracks[0];
          const representativeArtist = preferredArtists[0];

          // 세션이 비어있으면 기본 태그 사용
          const tags =
            sessions.length > 0
              ? sessions.map((session: string) => cleanSessionName(session))
              : fallbackBandData[index]?.tags || [
                  "기타 모집",
                  "YOASOBI",
                  "J-POP",
                  "aiko",
                ];

          console.log(`밴드 ${index + 1} 최종 태그:`, tags);

          // 모든 데이터가 비어있으면 fallback 데이터 사용
          const hasValidData =
            goalTracks.length > 0 ||
            preferredArtists.length > 0 ||
            sessions.length > 0;
          const fallbackBand = fallbackBandData[index];

          if (!hasValidData && fallbackBand) {
            console.log(
              `밴드 ${index + 1} 데이터가 비어있어 fallback 사용:`,
              fallbackBand
            );
            return fallbackBand;
          }

          return {
            id: index + 1, // 임시 ID
            image:
              detail?.profileImageUrl ||
              representativeTrack?.imageUrl ||
              representativeArtist?.imageUrl ||
              fallbackBandData[index]?.image ||
              homeAlbum3Img,
            title:
              detail?.bandName ||
              representativeTrack?.title ||
              representativeArtist?.name ||
              fallbackBandData[index]?.title ||
              "그래요 저 왜색 짙어요",
            subtitle:
              representativeTrack?.artist ||
              representativeArtist?.name ||
              fallbackBandData[index]?.subtitle ||
              "혼또니 아리가또 고자이마스",
            tags,
            profileData: profile, // 원본 데이터 저장
          };
        }
      );

      setMyBands(bands);
    } catch (error) {
      console.error("추천 밴드 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setMyBands(fallbackBandData);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = async (band: Band) => {
    setSelectedBand(band);
    setOpen(true);
  };

  useEffect(() => {
    fetchRecommendedBands();
    // 훅 데이터가 갱신되면 다시 바인딩
  }, [recommended]);

  // 홈에서는 WS 자동 연결을 수행하지 않음 (전역 AuthProvider에서 1회만 연결)

  if (loading || isFetching) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto">
        <div className="w-full flex flex-col items-center overflow-hidden">
          {/* 캐러셀 */}
          <div className="w-full overflow-hidden">
            <BandCarousel bands={myBands} onJoinClick={handleJoinClick} />
          </div>
        </div>
      </main>
      <MuiDialog open={open} setOpen={setOpen}>
        <BandInfoModal
          imageUrl={
            selectedBand?.profileData?.goalTracks?.[0]?.imageUrl ||
            selectedBand?.image
          }
          title={
            selectedBand?.profileData?.goalTracks?.[0]?.title ||
            selectedBand?.title ||
            "냥커버!!"
          }
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
            )?.url || "https://youtube.com"
          }
          instagramUrl={
            selectedBand?.profileData?.sns?.find(
              (s) => s.platform === "instagram"
            )?.url || "https://instagram.com"
          }
          bandId={selectedBand?.id?.toString()} // 추가
        />
      </MuiDialog>
    </>
  );
};

export default HomePage;
