import React, { useState, useEffect } from "react";
import homeAlbum2 from "@/assets/images/home-album2.svg";
import homeAlbum3Img from "@/assets/images/home-album3.png";
import homeAlbum2Img from "@/assets/images/home-album2.svg";
import homeAlbum1Img from "@/assets/images/home-album1.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import PlaylistList from "@/pages/Home/_components/playlist/PlaylistList";
import { getBandProfile, getBandTracks } from "@/store/userStore";
import { useParams } from "react-router-dom";

interface Track {
  id: number;
  title: string;
  artist: string;
  albumImage?: string;
  duration?: string;
}

interface BandInfo {
  id: number;
  name: string;
  description: string;
  profileImage: string;
}

export default function PlaylistPage() {
  const { bandId } = useParams<{ bandId: string }>();
  const [bandInfo, setBandInfo] = useState<BandInfo>({
    id: 1,
    name: "냥커버!!",
    description: "목표 곡",
    profileImage: homeAlbum2,
  });
  const [tracks, setTracks] = useState<Track[]>([]);
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
        description: "목표 곡",
        profileImage: profileData.goalTracks?.[0]?.imageUrl || homeAlbum2,
      });
    } catch (error) {
      console.error("밴드 정보 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setBandInfo({
        id: parseInt(bandId || "1"),
        name: "냥커버!!",
        description: "목표 곡",
        profileImage: homeAlbum2,
      });
    }
  };

  // 밴드 목표 곡 목록 조회 API
  const fetchBandTracks = async () => {
    try {
      setLoading(true);
      if (!bandId) return;

      const tracksData = await getBandTracks(bandId);

      // API 응답을 Track 형식으로 변환
      const transformedTracks: Track[] = tracksData.map(
        (track: any, index: number) => ({
          id: track.id || index + 1,
          title: track.title || `곡 ${index + 1}`,
          artist: track.artist || "아티스트",
          albumImage: track.imageUrl || track.albumImage,
          duration: track.duration,
        })
      );

      setTracks(transformedTracks);
    } catch (error) {
      console.error("밴드 곡 목록 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setTracks([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBandInfo();
  }, [bandId]);

  useEffect(() => {
    if (bandInfo.id) {
      fetchBandTracks();
    }
  }, [bandInfo.id]);

  if (loading) {
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
