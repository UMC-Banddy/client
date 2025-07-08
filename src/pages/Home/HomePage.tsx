import React from "react";
import AlbumCarousel from "./_components/AlbumCarousel";
import BottomBar from "@/widgets/Layout/BottomBar";

const tags = [
  { label: "보컬 모집", active: true },
  { label: "Sheena ringo" },
  { label: "いちないもの" },
  { label: "Betcover!!" },
];

const albums = [
  {
    image: "src/assets/images/home-album1.svg",
    title: "Flying Bobs",
    description: "난 그저 앨범만을 살던 중이었어요...",
  },
  {
    image: "src/assets/images/home-album2.svg",
    title: "냥커버!!",
    description: "베이스만 남아있어요 살려주세요",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-gradient-to-b from-[#1C1C1E] to-black overflow-hidden relative">
      {/* 상단: 로고+태그 */}
      <header className="flex items-end h-[56px] md:h-[72px] px-4 md:px-6 pt-safe-top gap-2">
        <img
          src="src/assets/logos/Banddy.svg"
          alt="Banddy 로고"
          aria-label="Banddy 로고"
          tabIndex={0}
          className="w-28 md:w-36 object-left"
          style={{ marginLeft: 0 }}
        />
        <div className="flex flex-nowrap gap-2 ml-2 overflow-x-auto items-end h-8 md:h-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-['Wanted Sans'] whitespace-nowrap ${
                tag.active
                  ? "bg-[#FF3B30] text-white"
                  : "bg-[#232323] text-[#8E8E93]"
              }`}
              tabIndex={0}
              aria-label={tag.label}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </header>
      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pb-[120px] md:pb-[140px] min-h-[calc(100vh-56px-64px)]">
        <AlbumCarousel albums={albums} />
      </main>
      {/* 하단 바 */}
      <BottomBar />
    </div>
  );
};

export default HomePage;
