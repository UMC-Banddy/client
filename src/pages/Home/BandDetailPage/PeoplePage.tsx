import homeAlbum2 from "@/assets/images/home-album2.svg";
import MemberCard from "@/pages/Home/_components/people/MemberCard";
import BandInfoSection from "@/pages/Home/_components/people/BandInfoSection";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import MicImg from "@/shared/components/images/MicImg";
import GuitarImg from "@/shared/components/images/GuitarImg";
import ElectricGuitarImg from "@/shared/components/images/ElectricGuitarImg";
import BassImg from "@/shared/components/images/BassImg";
import RecruitBadge from "@/pages/Home/_components/people/RecruitBadge";

export default function PeoplePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-0 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={homeAlbum2}
          bandName="냥커버!!"
          description="인원 구성 정보"
        />
      </div>

      {/* 멤버 카드 */}
      <div className="w-full flex flex-col items-center mb-4 px-0">
        <div className="w-full max-w-xl">
          <MemberCard />
        </div>
      </div>

      {/* 밴드 정보 섹션 */}
      <div className="w-full flex flex-col items-center mb-2 px-0">
        <div className="w-full max-w-xl">
          <BandInfoSection />
        </div>
      </div>

      {/* 역할 아이콘 리스트 */}
      <div className="w-full mt-0 mb-4 px-5 flex gap-4 justify-start">
        {/* 모집중: Mic */}
        <div className="relative">
          <RecruitBadge />
          <MicImg size={68} color="gray-200" />
        </div>
        {/* 모집중: Guitar */}
        <div className="relative">
          <RecruitBadge />
          <GuitarImg size={68} color="gray-200" />
        </div>
        {/* 모집 완료: ElectricGuitar */}
        <ElectricGuitarImg size={68} color="red" />
        {/* 모집 완료: Bass */}
        <BassImg size={68} color="red" />
      </div>
    </main>
  );
}
