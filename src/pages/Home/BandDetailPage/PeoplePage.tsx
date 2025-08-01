import React, { useState, useEffect } from "react";
import homeAlbum2 from "@/assets/images/home-album2.svg";
import MemberCard from "@/pages/Home/_components/people/MemberCard";
import BandInfoSection from "@/pages/Home/_components/people/BandInfoSection";
import BandProfileHeader from "@/pages/Home/_components/people/BandProfileHeader";
import MicImg from "@/shared/components/images/MicImg";
import GuitarImg from "@/shared/components/images/GuitarImg";
import ElectricGuitarImg from "@/shared/components/images/ElectricGuitarImg";
import BassImg from "@/shared/components/images/BassImg";
import RecruitBadge from "@/pages/Home/_components/people/RecruitBadge";
import { getBandProfile, getBandMembers } from "@/store/userStore";
import { useParams } from "react-router-dom";

interface BandMember {
  id: number;
  name: string;
  role: string;
  isRecruiting: boolean;
  profileImage?: string;
}

interface BandInfo {
  id: number;
  name: string;
  description: string;
  profileImage: string;
  memberCount: number;
  maxMembers: number;
}

// API 응답 타입 정의
interface ApiBandMember {
  id?: number;
  name?: string;
  role?: string;
  isRecruiting?: boolean;
  profileImage?: string;
}

export default function PeoplePage() {
  const { bandId } = useParams<{ bandId: string }>();
  const [bandInfo, setBandInfo] = useState<BandInfo>({
    id: 1,
    name: "냥커버!!",
    description: "인원 구성 정보",
    profileImage: homeAlbum2,
    memberCount: 2,
    maxMembers: 4,
  });
  const [members, setMembers] = useState<BandMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 밴드 정보 조회 API
  const fetchBandInfo = async () => {
    try {
      if (!bandId) return;

      const profileData = await getBandProfile(bandId);

      // BandProfileData를 BandInfo로 변환
      setBandInfo({
        id: parseInt(bandId),
        name: profileData.goalTracks?.[0]?.title || "밴드명",
        description: "인원 구성 정보",
        profileImage: profileData.goalTracks?.[0]?.imageUrl || homeAlbum2,
        memberCount:
          (profileData.composition?.maleCount || 0) +
          (profileData.composition?.femaleCount || 0),
        maxMembers: 4, // 기본값
      });
    } catch (error) {
      console.error("밴드 정보 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setBandInfo({
        id: parseInt(bandId || "1"),
        name: "냥커버!!",
        description: "인원 구성 정보",
        profileImage: homeAlbum2,
        memberCount: 2,
        maxMembers: 4,
      });
    }
  };

  // 밴드 멤버 목록 조회 API
  const fetchBandMembers = async () => {
    try {
      if (!bandId) return;

      const membersData = await getBandMembers(bandId);

      // API 응답을 BandMember 형식으로 변환
      const transformedMembers: BandMember[] = membersData.map(
        (member: ApiBandMember, index: number) => ({
          id: member.id || index + 1,
          name: member.name || `멤버 ${index + 1}`,
          role: member.role || "guitar",
          isRecruiting: member.isRecruiting || false,
          profileImage: member.profileImage,
        })
      );

      setMembers(transformedMembers);
    } catch (error) {
      console.error("밴드 멤버 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      setMembers([
        { id: 1, name: "김기타", role: "electric_guitar", isRecruiting: false },
        { id: 2, name: "박베이스", role: "bass", isRecruiting: false },
        { id: 3, name: "모집중", role: "mic", isRecruiting: true },
        { id: 4, name: "모집중", role: "guitar", isRecruiting: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBandInfo();
  }, [bandId]);

  useEffect(() => {
    if (bandInfo.id) {
      fetchBandMembers();
    }
  }, [bandInfo.id]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-0 pt-6 pb-0">
        <div className="text-white text-center">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] w-full flex flex-col bg-[#121212]/90 overflow-x-hidden px-0 pt-6 pb-0">
      {/* 상단 프로필 영역 */}
      <div className="w-full flex flex-col items-center mb-0 py-2">
        <BandProfileHeader
          imageSrc={bandInfo.profileImage}
          bandName={bandInfo.name}
          description={bandInfo.description}
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
        {members.map((member) => (
          <div key={member.id} className="relative">
            {member.isRecruiting && <RecruitBadge />}
            {member.role === "mic" && <MicImg size={68} color="gray-200" />}
            {member.role === "guitar" && (
              <GuitarImg size={68} color="gray-200" />
            )}
            {member.role === "electric_guitar" && (
              <ElectricGuitarImg size={68} color="red" />
            )}
            {member.role === "bass" && <BassImg size={68} color="red" />}
          </div>
        ))}
      </div>
    </main>
  );
}
