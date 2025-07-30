import PreferArtistGrid from "../_components/prefer/PreferArtistGrid";
import guitarBoy from "@/assets/images/guitar-boy.svg";

const preferData = [
  { name: "BECK", img: guitarBoy },
  { name: "Tyler, the creator", img: guitarBoy },
  { name: "Oasis", img: guitarBoy },
  { name: "Steve Lacy", img: guitarBoy },
  { name: "Blur", img: guitarBoy },
  { name: "쏜애플", img: guitarBoy },
];

export default function PreferPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-6 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-2">냥커버!!</h1>
          <p className="text-gray-300 text-base">선호 아티스트</p>
        </div>
      </div>
      {/* 구분선 */}
      <hr className="w-full border-t border-gray-400 my-6" />
      {/* 하단 아티스트 그리드 */}
      <div className="flex-1 flex flex-col items-center">
        <PreferArtistGrid
          artists={preferData}
          thumbSize="w-28 h-28"
          gapY="gap-y-6"
          gapX="gap-x-2"
        />
      </div>
    </main>
  );
}
