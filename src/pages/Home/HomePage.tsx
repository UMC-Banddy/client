import React, { useState, useEffect } from "react";
import BandCarousel from "./_components/BandCarousel";
import MuiDialog from "@/shared/components/MuiDialog";
import BandInfoModal from "./_components/BandInfoModal";
import { getRecommendedBands } from "@/store/userStore";

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

// 임시 데이터 (API 연결 전까지 사용)
const fallbackBandData: Band[] = [
  {
    id: 1,
    image: "/src/assets/images/home-album3.png",
    title: "그래요 저 왜색 짙어요",
    subtitle: "혼또니 아리가또 고자이마스",
    tags: ["기타 모집", "YOASOBI", "J-POP", "aiko"],
  },
];

const HomePage = () => {
  const [myBands, setMyBands] = useState<Band[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);

  // 추천 밴드 프로필 조회 API
  const fetchRecommendedBands = async () => {
    try {
      setLoading(true);
      const profiles = await getRecommendedBands();

      // profiles가 빈 배열이거나 undefined인 경우 기본 데이터 사용
      if (!profiles || profiles.length === 0) {
        if (import.meta.env.DEV) {
          console.log("조회된 밴드가 없어서 기본 데이터 사용");
        }
        setMyBands(fallbackBandData);
        return;
      }

      // 밴드 프로필 데이터를 캐러셀 형식으로 변환
      const bands: Band[] = profiles.map(
        (profile: BandProfileData, index: number) => {
          // 첫 번째 곡을 대표 이미지로 사용
          const representativeTrack = profile.goalTracks[0];
          const representativeArtist = profile.preferredArtists[0];

          return {
            id: index + 1, // 임시 ID
            image:
              representativeTrack?.imageUrl ||
              "/src/assets/images/home-album3.png",
            title: representativeTrack?.title || "그래요 저 왜색 짙어요",
            subtitle:
              representativeTrack?.artist || "혼또니 아리가또 고자이마스",
            tags: profile.sessions || ["기타 모집", "YOASOBI", "J-POP", "aiko"],
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
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto">
        <div className="text-white">로딩 중...</div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto">
        <div className="w-full flex flex-col items-center overflow-hidden">
          {/* 캐러셀 */}
          <div className="w-full overflow-hidden">
            {myBands.length > 0 && (
              <BandCarousel bands={myBands} onJoinClick={handleJoinClick} />
            )}
          </div>
        </div>
      </main>
      <MuiDialog open={open} setOpen={setOpen}>
        <BandInfoModal
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
            selectedBand?.profileData?.sessions ||
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
            )?.url
          }
          instagramUrl={
            selectedBand?.profileData?.sns?.find(
              (s) => s.platform === "instagram"
            )?.url
          }
          bandId={selectedBand?.id?.toString()} // 추가
        />
      </MuiDialog>
    </>
  );
};

export default HomePage;
