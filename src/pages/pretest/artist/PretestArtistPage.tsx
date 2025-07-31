import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "./_components/PretestHeader";
import SearchBar from "./_components/SearchBar";
import ArtistGrid from "./_components/ArtistGrid";
import { artistAPI, surveyAPI } from "@/api/API";
import oasisImage from "@/assets/images/oasis.png";

// 아티스트 타입 정의 (API에서 import가 안 될 경우를 대비)
interface Artist {
  id: number;
  spotifyId: string;
  name: string;
  genre: string;
  imageUrl: string;
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 아티스트 데이터 (피그마 이미지에 맞춤) - 더 많은 아티스트 추가
const ARTISTS: Artist[] = [
  {
    id: 1,
    spotifyId: "beck",
    name: "BECK",
    genre: "rock",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/beck",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 2,
    spotifyId: "tyler",
    name: "Tyler, the creator",
    genre: "hip-hop",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/tyler",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 3,
    spotifyId: "oasis",
    name: "Oasis",
    genre: "rock",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/oasis",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 4,
    spotifyId: "steve",
    name: "Steve Lacy",
    genre: "r&b",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/steve",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 5,
    spotifyId: "blur",
    name: "Blur",
    genre: "rock",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/blur",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 6,
    spotifyId: "thornapple",
    name: "쏜애플",
    genre: "k-indie",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/thornapple",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 7,
    spotifyId: "blackskirts",
    name: "검정치마",
    genre: "k-indie",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/blackskirts",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 8,
    spotifyId: "eve",
    name: "eve",
    genre: "j-pop",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/eve",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 9,
    spotifyId: "caodong",
    name: "草東沒有派對",
    genre: "rock",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/caodong",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 10,
    spotifyId: "radiohead",
    name: "Radiohead",
    genre: "rock",
    imageUrl: oasisImage,
    externalUrl: "https://open.spotify.com/artist/radiohead",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
];

const PretestArtistPage = () => {
  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 아티스트 데이터 로드
  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const data = await artistAPI.getArtists();
        setArtists(data);
        setError(null);
      } catch (err) {
        console.error("아티스트 데이터 로드 실패:", err);
        setError("아티스트 데이터를 불러오는데 실패했습니다.");
        // API 실패 시 mock 데이터 사용
        setArtists(ARTISTS);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  // 검색 필터링된 아티스트 목록
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    return artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [artists, searchQuery]);

  // 아티스트 선택/해제 처리
  const handleArtistSelect = (artistId: number) => {
    setSelectedArtists((prev) => {
      if (prev.includes(artistId)) {
        return prev.filter((id) => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  // 건너뛰기 처리
  const handleSkip = () => {
    navigate("/pre-test/session");
  };

  // 다음 단계 처리
  const handleNext = async () => {
    if (selectedArtists.length > 0) {
      try {
        setSubmitting(true);
        // Survey 데이터 제출
        await surveyAPI.submitSurvey({
          selectedArtists: selectedArtists,
        });

        // 성공 시 다음 페이지로 이동
        navigate("/pre-test/session");
      } catch (error) {
        console.error("Survey 제출 실패:", error);
        // 에러가 발생해도 다음 페이지로 이동 (선택사항)
        navigate("/pre-test/session");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] text-white font-inherit">
      {/* 헤더 */}
      <PretestHeader
        onSkip={handleSkip}
        onNext={handleNext}
        showNext={selectedArtists.length > 0}
        nextDisabled={selectedArtists.length === 0 || submitting}
        nextText={submitting ? "저장 중..." : "다음"}
        progress={30} // 첫 번째 단계이므로 30% 진행
      />

      {/* 본문 */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 overflow-y-auto">
        {/* 컨테이너 - 데스크탑에서는 중앙 정렬, 모바일에서는 전체 너비 */}
        <div className="w-full max-w-7xl mx-auto">
          {/* 안내 텍스트 - 반응형으로 크기 조정 */}
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white font-medium leading-tight">
              좋아하는 아티스트를
              <br />
              선택하세요.
            </h2>
          </div>

          {/* 검색바 */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 max-w-2xl">
            <SearchBar
              placeholder="아티스트 검색하기"
              onSearch={setSearchQuery}
            />
          </div>

          {/* 아티스트 그리드 */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">
                  아티스트 목록을 불러오는 중...
                </div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-4">
                {error}
                <div className="text-sm text-gray-400 mt-2">
                  (기본 아티스트 목록을 표시합니다)
                </div>
              </div>
            ) : null}
            <ArtistGrid
              artists={filteredArtists}
              selectedArtists={selectedArtists}
              onArtistSelect={handleArtistSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PretestArtistPage;
