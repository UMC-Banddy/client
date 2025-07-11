import React, { useEffect, useState } from "react";
import HomeTagSection from "./_components/HomeTagSection";
import BandCarousel from "./_components/BandCarousel";

const bandData = [
  {
    id: 1,
    title: "Flying Bobs",
    description: "난 그저 열일곱을 살던 중이었어요...",
    image: "src/assets/images/home-album1.svg",
  },
  {
    id: 2,
    title: "냥커버!!",
    description: "베이스만 넷이에요 살려주세요",
    image: "src/assets/images/home-album2.svg",
  },
];

const HomePage = () => {
  const [myBands, setMyBands] = useState<typeof bandData>([]);

  useEffect(() => {
    setMyBands(bandData); // 추후 API 연결로 대체
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-[#2B2521] to-[#1D1B19] px-6 py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
        {/* 태그 바 - 한 줄 슬라이딩, gap-x-3, no-wrap, overflow-x-auto */}
        <div className="w-full mb-8">
          <HomeTagSection />
        </div>
        {/* 캐러셀 */}
        <div className="w-full mb-8">
          {myBands.length > 0 && <BandCarousel bands={myBands} />}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
