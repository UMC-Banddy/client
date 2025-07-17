import React, { useEffect, useState } from "react";
import HomeTagSection from "./_components/HomeTagSection";
import BandCarousel from "./_components/BandCarousel";
import MuiDialog from "@/shared/components/MuiDialog";
import BandInfoModal from "./_components/BandInfoModal";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMyBands(bandData); // 추후 API 연결로 대체
  }, []);

  return (
    <>
      <main className="min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-center bg-[#121212]/90 overflow-hidden">
        <div className="w-full max-w-[420px] mx-auto flex flex-col items-center mb-10">
          {/* 태그 바 */}
          <div className="w-full">
            <HomeTagSection />
          </div>
          {/* 캐러셀 */}
          <div className="w-full">
            {myBands.length > 0 && (
              <BandCarousel bands={myBands} onJoinClick={() => setOpen(true)} />
            )}
          </div>
        </div>
      </main>
      <MuiDialog open={open} setOpen={setOpen}>
        <BandInfoModal
          title="냥커버!!"
          subtitle="베이스만 넷이에요 살려주세요"
          onClose={() => setOpen(false)}
          tags={["20대 이상", "성별 무관", "서울 홍대", "부산 진구"]}
          description={`!!아마추어 밴드!!\n프로지향 X\n\n안녕하세요 냥커버입니당 저희는 그냥 즐겁게 할 사람 찾고 있어요 아무나 지원하셈 목적은 올해말 공연임 유튜브 있긴 한데 영상 촬영 필수 아님\n주 1회 평일 합주 선호함`}
          deadline="25.07.08"
        />
      </MuiDialog>
    </>
  );
};

export default HomePage;
