import React, { useState, useEffect } from "react";
import PreferArtistGrid from "../_components/prefer/PreferArtistGrid";
import guitarBoy from "@/assets/images/guitar-boy.svg";
import homeAlbum2 from "@/assets/images/home-album2.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import { getBandProfile, getBandArtists } from "@/store/userStore";
import { useParams } from "react-router-dom";

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
  const { bandId } = useParams<{ bandId: string }>();
  const [bandInfo, setBandInfo] = useState<BandInfo>({
    id: 1,
    name: "냥커버!!",
    description: "선호 아티스트",
    profileImage: homeAlbum2,
  });
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // 밴드 정보 조회 API
  const fetchBandInfo = async () => {
    try {
      if (!bandId) return;

      const profileData = await getBandProfile(bandId);

      // BandProfileData를 BandInfo로 변환
      setBandInfo({
        id: parseInt(bandId),
        name: profileData.goalTracks?.[0]?.title || "밴드명",
        description: "선호 아티스트",
        profileImage: profileData.goalTracks?.[0]?.imageUrl || homeAlbum2,
      });
    } catch (error) {
      console.error("밴드 정보 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setBandInfo({
        id: parseInt(bandId || "1"),
        name: "냥커버!!",
        description: "선호 아티스트",
        profileImage: homeAlbum2,
      });
    }
  };

  // 밴드 선호 아티스트 목록 조회 API
  const fetchBandArtists = async () => {
    try {
      setLoading(true);
      if (!bandId) return;

      const artistsData = await getBandArtists(bandId);

      // API 응답을 Artist 형식으로 변환
      const transformedArtists: Artist[] = artistsData.map(
        // (artist: any, index: number) => ({
        (artist: Artist, index: number) => ({
          id: artist.id || index + 1,
          name: artist.name || `아티스트 ${index + 1}`,
          image: artist.imageUrl || artist.image || guitarBoy,
        })
      );

      setArtists(transformedArtists);
    } catch (error) {
      console.error("밴드 아티스트 목록 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setArtists(preferData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBandInfo();
  }, [bandId]);

  useEffect(() => {
    if (bandInfo.id) {
      fetchBandArtists();
    }
  }, [bandInfo.id]);

  if (loading) {
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
