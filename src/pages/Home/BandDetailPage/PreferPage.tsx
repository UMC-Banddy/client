import React, { useMemo } from "react";
import PreferArtistGrid from "../_components/prefer/PreferArtistGrid";
import guitarBoy from "@/assets/images/guitar-boy.svg";
import homeAlbum2 from "@/assets/images/home-album2.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import { useLocation, useParams } from "react-router-dom";
import {
  useBandProfile,
  useBandArtists,
} from "@/features/band/hooks/useBandData";

interface Artist {
  id: number;
  name: string;
  image: string;
  imageUrl?: string;
}

interface BandInfo {
  id: number;
  name: string;
  description: string;
  profileImage: string;
}

// API 응답 타입 정의
// interface ApiArtist {
//   id?: number;
//   name?: string;
//   image?: string;
//   imageUrl?: string;
// }

// 임시 데이터 (API 연결 전까지 사용)
const preferData = [
  { id: 1, name: "BECK", image: guitarBoy },
  { id: 2, name: "Tyler, the creator", image: guitarBoy },
  { id: 3, name: "Oasis", image: guitarBoy },
  { id: 4, name: "Steve Lacy", image: guitarBoy },
  { id: 5, name: "Blur", image: guitarBoy },
  { id: 6, name: "쏜애플", image: guitarBoy },
];

export default function PreferPage() {
  const { bandId = "1" } = useParams<{ bandId: string }>();
  const location = useLocation() as {
    state?: {
      initialBand?: { bandId?: string; title?: string; imageUrl?: string };
    };
  };
  const { data: bandData, isLoading: loadingProfile } = useBandProfile(bandId);
  const { data: artistsData = [], isLoading: loadingArtists } =
    useBandArtists(bandId);

  const profile = bandData?.profile ?? {};
  const detail = bandData?.detail;

  const bandInfo: BandInfo = useMemo(
    () => ({
      id: parseInt(bandId),
      name:
        detail?.bandName ||
        profile?.goalTracks?.[0]?.title ||
        location.state?.initialBand?.title ||
        "냥커버!!",
      description: "선호 아티스트",
      profileImage:
        detail?.profileImageUrl ||
        profile?.goalTracks?.[0]?.imageUrl ||
        location.state?.initialBand?.imageUrl ||
        homeAlbum2,
    }),
    [bandId, profile, detail, location.state]
  );

  const artists: Artist[] = useMemo(() => {
    const safe = Array.isArray(artistsData) ? artistsData : [];
    if (safe.length === 0) return preferData;
    return safe.map((a: Partial<Artist>, index: number) => ({
      id: a?.id ?? index + 1,
      name: a?.name ?? `아티스트 ${index + 1}`,
      image: a?.imageUrl ?? a?.image ?? guitarBoy,
    }));
  }, [artistsData]);

  if (loadingProfile || loadingArtists) {
    return (
      <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0">
        <div className="text-white text-center">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={bandInfo.profileImage}
          bandName={bandInfo.name}
          description={bandInfo.description}
        />
      </div>
      {/* 구분선 */}
      <hr className="w-full border-t border-gray-400 my-6" />
      {/* 하단 아티스트 그리드 */}
      <div className="flex-1 flex flex-col items-center">
        <PreferArtistGrid
          artists={artists}
          thumbSize="w-28 h-28"
          gapY="gap-y-6"
          gapX="gap-x-2"
        />
      </div>
    </main>
  );
}
