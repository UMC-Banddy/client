import homeAlbum2 from "@/assets/images/home-album2.svg";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import PlaylistList from "@/pages/Home/_components/playlist/PlaylistList";

export default function PlaylistPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0 overflow-y-auto scrollbar-hide">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={homeAlbum2}
          bandName="냥커버!!"
          description="목표 곡"
        />
      </div>
      {/* 구분선 */}
      <hr className="w-full border-t border-gray-400 my-4" />
      {/* 곡 리스트 */}
      <PlaylistList />
    </main>
  );
}
