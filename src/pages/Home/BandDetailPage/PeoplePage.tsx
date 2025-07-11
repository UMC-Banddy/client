import homeAlbum2 from "@/assets/images/home-album2.svg";
import MemberCard from "@/pages/Home/_components/people/MemberCard";
import BandInfoSection from "@/pages/Home/_components/people/BandInfoSection";
import RoleIconList from "@/pages/Home/_components/people/RoleIconList";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";

export default function PeoplePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-0 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={homeAlbum2}
          title="냥커버!!의 인원 구성 정보"
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
      <div className="w-full mt-0 mb-4 px-0">
        <RoleIconList />
      </div>
    </main>
  );
}
