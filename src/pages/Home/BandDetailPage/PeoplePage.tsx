import homeAlbum2 from "@/assets/images/home-album2.svg";
import MemberCard from "@/pages/Home/_components/people/MemberCard";
import BandInfoSection from "@/pages/Home/_components/people/BandInfoSection";
import RoleIconList from "@/pages/Home/_components/people/RoleIconList";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";

export default function PeoplePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-center bg-[#121212]/90 overflow-hidden">
      <BandProfileHeader
        imageSrc={homeAlbum2}
        title="냥커버!!의 인원 구성 정보"
      />
      <MemberCard />
      <div className="my-6 w-full max-w-md">
        <BandInfoSection />
      </div>
      <RoleIconList />
    </main>
  );
}
