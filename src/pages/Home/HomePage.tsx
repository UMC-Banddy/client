import React, { useEffect, useState } from 'react';
import HomeTagSection from './_components/HomeTagSection';
import BandCarousel from './_components/BandCarousel';

const bandData = [
  {
    id: 1,
    title: 'Flying Bobs',
    description: '난 그저 열일곱을 살던 중이었어요...',
    image: 'src/assets/images/home-album1.svg',
  },
  {
    id: 2,
    title: '냥커버!!',
    description: '베이스만 넷이에요 살려주세요',
    image: 'src/assets/images/home-album2.svg',
  },
];

const HomePage = () => {
  const [myBands, setMyBands] = useState<typeof bandData>([]);

  useEffect(() => {
    setMyBands(bandData); // 추후 API 연결로 대체
  }, []);

  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-center bg-[#121212]/90 overflow-hidden">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center mb-10">
        {/* 태그 바 */}
        <div className="w-full">
          <HomeTagSection />
        </div>
        {/* 캐러셀 */}
        <div className="w-full">
          {myBands.length > 0 && <BandCarousel bands={myBands} />}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
