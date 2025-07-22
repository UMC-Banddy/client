import homeAlbum2 from "@/assets/images/home-album2.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import PreferArtistGrid from "@/pages/Home/_components/prefer/PreferArtistGrid";

const mockArtists = [
  { name: "BECK", img: "/src/assets/images/guitar-boy.svg" },
  { name: "Tyler, the creator", img: "/src/assets/images/guitar-boy.svg" },
  { name: "Oasis", img: "/src/assets/images/guitar-boy.svg" },
  { name: "Steve Lacy", img: "/src/assets/images/guitar-boy.svg" },
  { name: "Blur", img: "/src/assets/images/guitar-boy.svg" },
  { name: "쏜애플", img: "/src/assets/images/guitar-boy.svg" },
];

export default function PreferPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={homeAlbum2}
          bandName="냥커버!!"
          description="선호 아티스트"
        />
      </div>
      {/* 구분선 */}
      <hr className="w-full border-t border-gray-400 my-6" />
      {/* 하단 아티스트 그리드 */}
      <div className="flex-1 flex flex-col items-center">
        <PreferArtistGrid
          artists={mockArtists}
          thumbSize="w-28 h-28"
          gapY="gap-y-6"
          gapX="gap-x-2"
        />
      </div>
    </main>
  );
}
