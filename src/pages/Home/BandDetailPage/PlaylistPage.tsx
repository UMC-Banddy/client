import React, { useMemo } from "react";
import homeAlbum2 from "@/assets/images/home-album2.svg";
import homeAlbum3Img from "@/assets/images/home-album3.png";
import homeAlbum2Img from "@/assets/images/home-album2.svg";
import homeAlbum1Img from "@/assets/images/home-album1.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import PlaylistList from "@/pages/Home/_components/playlist/PlaylistList";
import { useParams } from "react-router-dom";
import {
  useBandProfile,
  useBandTracks,
} from "@/features/band/hooks/useBandData";

interface Track {
  id: number;
  title: string;
  artist: string;
  albumImage?: string;
  duration?: string;
  imageUrl?: string;
}

interface BandInfo {
  id: number;
  name: string;
  description: string;
  profileImage: string;
}

// API 응답 타입 정의
interface ApiTrack {
  id?: number;
  title?: string;
  artist?: string;
  albumImage?: string;
  duration?: string;
  imageUrl?: string;
}

export default function PlaylistPage() {
  const { bandId = "1" } = useParams<{ bandId: string }>();
  const { data: bandData, isLoading: loadingProfile } = useBandProfile(bandId);
  const { data: tracksData = [], isLoading: loadingTracks } =
    useBandTracks(bandId);

  const profile = bandData?.profile ?? {};
  const detail = bandData?.detail;

  const bandInfo: BandInfo = useMemo(
    () => ({
      id: parseInt(bandId),
      name: detail?.bandName || profile?.goalTracks?.[0]?.title || "냥커버!!",
      description: "목표 곡",
      profileImage:
        detail?.profileImageUrl ||
        profile?.goalTracks?.[0]?.imageUrl ||
        homeAlbum2,
    }),
    [bandId, profile, detail]
  );

  const tracks: Track[] = useMemo(() => {
    const safe = Array.isArray(tracksData) ? tracksData : [];
    if (safe.length === 0) {
      return [
        {
          id: 1,
          title: "그래요 저 왜색 짙어요",
          artist: "YOASOBI",
          albumImage: homeAlbum3Img,
        },
        {
          id: 2,
          title: "혼또니 아리가또 고자이마스",
          artist: "aiko",
          albumImage: homeAlbum2Img,
        },
        {
          id: 3,
          title: "J-POP 히트곡",
          artist: "Various Artists",
          albumImage: homeAlbum1Img,
        },
      ];
    }
    return safe.map((t: any, index: number) => ({
      id: t?.id ?? index + 1,
      title: t?.title ?? `곡 ${index + 1}`,
      artist: t?.artist ?? "아티스트",
      albumImage: t?.imageUrl ?? t?.albumImage,
      duration: t?.duration,
    }));
  }, [tracksData]);

  if (loadingProfile || loadingTracks) {
    return (
      <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0 overflow-y-auto scrollbar-hide">
        <div className="text-white text-center">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0 overflow-y-auto scrollbar-hide">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={bandInfo.profileImage}
          bandName={bandInfo.name}
          description={bandInfo.description}
        />
      </div>
      {/* 구분선 */}
      <hr className="w-full border-t border-gray-400 my-4" />
      {/* 곡 리스트 */}
      <PlaylistList tracks={tracks} />
    </main>
  );
}
