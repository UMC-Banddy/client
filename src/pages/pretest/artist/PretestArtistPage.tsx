import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PretestHeader from "./_components/PretestHeader";
import SearchBar from "./_components/SearchBar";
import ArtistGrid from "./_components/ArtistGrid";
import { musicAPI } from "@/api/API";
import {
  useSurveyArtists,
  useSearchArtists,
} from "@/features/pretest/hooks/useSurveyData";
// import type { AutocompleteResult } from "@/api/API";
import oasisImage from "@/assets/images/oasis.png";
import toast from "react-hot-toast";

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
    imageUrl: "https://example.com/blur.jpg",
    externalUrl: "https://open.spotify.com/artist/blur",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 6,
    spotifyId: "thornapple",
    name: "쏜애플",
    genre: "k-indie",
    imageUrl: "https://example.com/thornapple.jpg",
    externalUrl: "https://open.spotify.com/artist/thornapple",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 7,
    spotifyId: "blackskirts",
    name: "검정치마",
    genre: "k-indie",
    imageUrl: "https://example.com/blackskirts.jpg",
    externalUrl: "https://open.spotify.com/artist/blackskirts",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 8,
    spotifyId: "eve",
    name: "eve",
    genre: "j-pop",
    imageUrl: "https://example.com/eve.jpg",
    externalUrl: "https://open.spotify.com/artist/eve",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 9,
    spotifyId: "caodong",
    name: "草東沒有派對",
    genre: "rock",
    imageUrl: "https://example.com/caodong.jpg",
    externalUrl: "https://open.spotify.com/artist/caodong",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
  {
    id: 10,
    spotifyId: "radiohead",
    name: "Radiohead",
    genre: "rock",
    imageUrl: "https://example.com/radiohead.jpg",
    externalUrl: "https://open.spotify.com/artist/radiohead",
    createdAt: "2025-01-01T00:00:00",
    updatedAt: "2025-01-01T00:00:00",
  },
];

const PretestArtistPage = () => {
  const location = useLocation();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  // const [autocompleteResults, setAutocompleteResults] = useState<
  //   AutocompleteResult[]
  // >([]);
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const { data: apiArtists, isLoading, isError } = useSurveyArtists();
  const { data: searched, isFetching } = useSearchArtists(searchQuery);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 초기 아티스트 목록 로드 (사전 테스트 아티스트 API)
  useEffect(() => {
    if (!apiArtists) return;
    const mapped = apiArtists.map((item, index) => ({
      id: index + 1,
      spotifyId: item.spotifyId,
      name: item.name,
      genre: item.genre || "unknown",
      imageUrl: item.imageUrl || oasisImage,
      externalUrl:
        item.externalUrl || `https://open.spotify.com/artist/${item.spotifyId}`,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    setArtists(mapped.length > 0 ? mapped : ARTISTS);
  }, [apiArtists]);

  // 검색어 변경 시 사전 테스트 아티스트 검색 API 데이터 반영 및 memberId 확보
  useEffect(() => {
    if (location.state && location.state.memberId) {
      setMemberId(location.state.memberId);
    } else {
      // 회원가입/로그인 시 저장된 memberId 사용 (토큰 없어도 ID 기반 저장 가능)
      const storedMemberId = localStorage.getItem("memberId");
      if (storedMemberId) {
        setMemberId(storedMemberId);
      }
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    if (!searched) return;
    const mapped = searched.map((item, index) => ({
      id: index + 1000,
      spotifyId: item.spotifyId,
      name: item.name,
      genre: item.genre || "unknown",
      imageUrl: item.imageUrl || oasisImage,
      externalUrl:
        item.externalUrl || `https://open.spotify.com/artist/${item.spotifyId}`,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    setSearchResults(mapped);
  }, [searchQuery, searched, location.state]);

  // 검색 필터링된 아티스트 목록 (기본 아티스트 목록용)
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    return artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [artists, searchQuery]);

  // 아티스트 선택/해제 처리
  const handleArtistSelect = (artistId: string) => {
    setSelectedArtists((prev) => {
      if (prev.includes(artistId)) {
        return prev.filter((id) => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  // 건너뛰기 처리 - 홈으로 이동
  const handleSkip = () => {
    navigate("/");
  };

  // 다음 단계 처리
  const handleNext = async () => {
    if (selectedArtists.length === 0) {
      toast.error("아티스트를 한 명 이상 선택해주세요.");
      return;
    }
    try {
      setSubmitting(true);

      // 선택된 아티스트를 백엔드 artistId(number) 배열로 변환
      const artistIds: number[] = selectedArtists
        .map((selId) => {
          // 1) 기본 목록(백엔드 제공)에서 id 직접 매칭
          const base = artists.find((a) => a.id.toString() === selId);
          if (base) return base.id;

          // 2) 검색 결과에서 spotifyId를 찾고, 기본 목록에서 spotifyId로 역매핑
          const search = searchResults.find((s) => s.id.toString() === selId);
          if (search) {
            const matched = artists.find((a) => a.spotifyId === search.spotifyId);
            if (matched) return matched.id;
          }

          // 3) 숫자로 파싱 가능한 경우(이미 백엔드 id가 문자열로 들어온 경우)
          const asNum = Number(selId);
          return Number.isFinite(asNum) ? asNum : NaN;
        })
        .filter((n) => Number.isFinite(n)) as number[];

      if (artistIds.length === 0) {
        toast.error("선택된 아티스트의 백엔드 ID를 찾지 못했습니다.");
        return;
      }

      // 선택된 아티스트 ID를 localStorage에 저장 (세션 페이지에서 단일 제출에 사용)
      localStorage.setItem("artistIds", JSON.stringify(artistIds));

      // 세션 선택 페이지로 이동 (memberId를 넘겨 유지)
      navigate("/pre-test/session", { state: { memberId } });
    } catch (error) {
      console.error(error);
      toast.error("진행 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
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
              placeholder="음악 검색하기"
              onSearch={setSearchQuery}
              onSelect={(item) => {
                console.log("선택된 아이템:", item);
                // 선택된 아이템에 대한 추가 처리 로직
              }}
              onAutocompleteResults={async (results) => {
                // setAutocompleteResults(results);

                // 검색어가 있으면 SEARCH_ALL API로 검색 결과 가져오기
                if (searchQuery.trim().length > 0) {
                  try {
                    // SEARCH_ALL API 호출
                    const searchResponse = await musicAPI.searchAll(
                      searchQuery,
                      results.length || 20
                    );

                    // 검색 결과를 Artist 형식으로 변환 (API 문서에 따른 구조)
                    // 유효한 아티스트만 필터링 (name이 "ARTIST"이거나 imageUrl이 null인 경우 제외)
                    const validArtists = searchResponse.filter(
                      (item) => item.name !== "ARTIST" && item.imageUrl !== null
                    );

                    const artistResults = validArtists.map((item, index) => ({
                      id: index + 1000,
                      spotifyId: item.spotifyId,
                      name: item.name,
                      genre: item.genres || "unknown",
                      imageUrl: item.imageUrl || oasisImage,
                      externalUrl:
                        item.externalUrl ||
                        `https://open.spotify.com/artist/${item.spotifyId}`,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }));
                    setSearchResults(artistResults);
                  } catch (error) {
                    console.error("음악 검색 실패:", error);
                    // 실패 시 자동완성 결과를 기본 이미지로 표시
                    const fallbackResults = results.map((item, index) => ({
                      id: index + 1000,
                      spotifyId: item.id,
                      name: item.name,
                      genre: "unknown",
                      imageUrl: oasisImage,
                      externalUrl: `https://open.spotify.com/artist/${item.id}`,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }));
                    setSearchResults(fallbackResults);
                  }
                } else {
                  setSearchResults([]);
                }
              }}
            />
          </div>

          {/* 검색 결과 또는 아티스트 그리드 */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
            {isFetching ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">검색 중...</div>
              </div>
            ) : searchResults.length > 0 ? (
              // SEARCH_ALL API 결과를 동그라미 그리드 형태로 표시 (실제 이미지 사용)
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12 lg:gap-x-8 lg:gap-y-14 xl:gap-x-10 xl:gap-y-16 2xl:gap-x-12 2xl:gap-y-20">
                {searchResults.map((artist, index) => (
                  <div
                    key={`search-${artist.id}-${index}`}
                    className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
                    onClick={() => handleArtistSelect(artist.id.toString())}
                  >
                    <div className="relative">
                      <img
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 2xl:w-48 2xl:h-48 rounded-full object-cover transition-all duration-200 opacity-100"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 이미지 사용
                          const target = e.target as HTMLImageElement;
                          target.src = oasisImage;
                        }}
                      />
                      {/* 선택 상태 표시 */}
                      {selectedArtists.includes(artist.id.toString()) && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white text-center max-w-[112px] sm:max-w-[128px] md:max-w-[144px] lg:max-w-[160px] xl:max-w-[176px] 2xl:max-w-[192px] font-medium leading-tight">
                      {artist.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 && searchResults.length === 0 ? (
              // 검색 결과가 없는 경우
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">검색 결과가 없습니다.</div>
              </div>
            ) : (
              // 기본 아티스트 그리드 (빈 검색 시 초기 목록 표시)
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-white text-lg">
                      아티스트 목록을 불러오는 중...
                    </div>
                  </div>
                ) : isError ? (
                  <div className="text-red-400 text-center py-4">
                    아티스트 데이터를 불러오는데 실패했습니다.
                    <div className="text-sm text-gray-400 mt-2">
                      (기본 아티스트 목록을 표시합니다)
                    </div>
                  </div>
                ) : null}
                <ArtistGrid
                  artists={filteredArtists}
                  selectedArtists={selectedArtists.map((id) => parseInt(id))}
                  onArtistSelect={(id) => handleArtistSelect(id.toString())}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PretestArtistPage;
