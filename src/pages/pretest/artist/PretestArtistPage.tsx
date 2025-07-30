import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PretestHeader from "./_components/PretestHeader";
import SearchBar from "./_components/SearchBar";
import ArtistGrid from "./_components/ArtistGrid";
import oasisImage from "@/assets/images/oasis.png";

// 아티스트 데이터 (피그마 이미지에 맞춤) - 더 많은 아티스트 추가
const ARTISTS = [
  { id: "beck", name: "BECK", image: oasisImage },
  { id: "tyler", name: "Tyler, the creator", image: oasisImage },
  { id: "oasis", name: "Oasis", image: oasisImage },
  { id: "steve", name: "Steve Lacy", image: oasisImage },
  { id: "blur", name: "Blur", image: oasisImage },
  { id: "thornapple", name: "쏜애플", image: oasisImage },
  { id: "blackskirts", name: "검정치마", image: oasisImage },
  { id: "eve", name: "eve", image: oasisImage },
  { id: "caodong", name: "草東沒有派對", image: oasisImage },
  { id: "radiohead", name: "Radiohead", image: oasisImage },
  { id: "arctic", name: "Arctic Monkeys", image: oasisImage },
  { id: "strokes", name: "The Strokes", image: oasisImage },
  { id: "interpol", name: "Interpol", image: oasisImage },
  { id: "muse", name: "Muse", image: oasisImage },
  { id: "coldplay", name: "Coldplay", image: oasisImage },
  { id: "u2", name: "U2", image: oasisImage },
  { id: "pink", name: "Pink Floyd", image: oasisImage },
  { id: "beatles", name: "The Beatles", image: oasisImage },
  { id: "rolling", name: "The Rolling Stones", image: oasisImage },
  { id: "led", name: "Led Zeppelin", image: oasisImage },
];

const PretestArtistPage = () => {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // 검색 필터링된 아티스트 목록
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return ARTISTS;
    return ARTISTS.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  // 건너뛰기 처리
  const handleSkip = () => {
    navigate("/pre-test/session");
  };

  // 다음 단계 처리
  const handleNext = () => {
    if (selectedArtists.length > 0) {
      navigate("/pre-test/session");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] text-white font-inherit">
      {/* 헤더 */}
      <PretestHeader
        onSkip={handleSkip}
        onNext={handleNext}
        showNext={selectedArtists.length > 0}
        nextDisabled={selectedArtists.length === 0}
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
