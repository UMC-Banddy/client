import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileCard from "./_components/ProfileCard";
import ProfileModalSection from "./_components/ProfileModalSection";
import { useOtherProfile } from "@/features/profile/hooks/useOtherProfile";
import { 
  MicImg, 
  DrumImg, 
  ElectricGuitarImg, 
  GuitarImg, 
  BassImg, 
  PianoImg, 
  ViolinImg, 
  TrumpetImg 
} from "@/shared/components/images";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const { profile: otherProfile, isLoading, error } = useOtherProfile(id ? parseInt(id) : null);
  
  // 가이드 상태 관리
  const [showGuide, setShowGuide] = useState(false);
  
  // 모달 상태 관리
  const [modalType, setModalType] = useState<null | "chat" | "friend">(null);
  const [modalMsg, setModalMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  
  // 메뉴 상태 관리
  const [menuOpen, setMenuOpen] = useState(false);

  // 세션 이름에 따라 적절한 컴포넌트를 반환하는 함수
  const getSessionComponent = (sessionName: string) => {
    const lowerName = sessionName.toLowerCase();
    if (lowerName.includes("보컬") || lowerName.includes("🎤")) return <MicImg color="red" size={32} />;
    if (lowerName.includes("드럼") || lowerName.includes("🥁")) return <DrumImg color="red" size={32} />;
    if (lowerName.includes("일렉") || lowerName.includes("🎸")) return <ElectricGuitarImg color="red" size={32} />;
    if (lowerName.includes("어쿠스틱") || lowerName.includes("🪕")) return <GuitarImg color="red" size={32} />;
    if (lowerName.includes("베이스") || lowerName.includes("🎧")) return <BassImg color="red" size={32} />;
    if (lowerName.includes("키보드") || lowerName.includes("🎹")) return <PianoImg color="red" size={32} />;
    if (lowerName.includes("바이올린") || lowerName.includes("🎻")) return <ViolinImg color="red" size={32} />;
    if (lowerName.includes("트럼펫") || lowerName.includes("🎺")) return <TrumpetImg color="red" size={32} />;
    return <MicImg color="red" size={32} />; // 기본값
  };

  // 장르 이름에 따라 아이콘을 반환하는 함수
  const getGenreIcon = (genreName: string) => {
    const lowerName = genreName.toLowerCase();
    if (lowerName.includes("rock")) return "🎸";
    if (lowerName.includes("metal")) return "⚡";
    if (lowerName.includes("pop")) return "🎤";
    if (lowerName.includes("jazz")) return "🎺";
    if (lowerName.includes("emo")) return "💔";
    if (lowerName.includes("indie")) return "🌊";
    if (lowerName.includes("punk")) return "🧑‍🎤";
    if (lowerName.includes("r&b")) return "🎵";
    if (lowerName.includes("grunge")) return "🥁";
    if (lowerName.includes("shoegaze")) return "👟";
    if (lowerName.includes("psychedelic")) return "💊";
    if (lowerName.includes("dream pop")) return "🌙";
    if (lowerName.includes("nu metal")) return "⛓️";
    if (lowerName.includes("j-pop")) return "⛩️";
    if (lowerName.includes("tiwan indie")) return "🤘";
    if (lowerName.includes("russian rock")) return "🪆";
    return "🎵"; // 기본값
  };
  
  // API 데이터를 기존 형식으로 변환
  const profile = otherProfile ? {
    avatar: otherProfile.profileImageUrl,
    id: otherProfile.memberId,
    name: otherProfile.nickname,
    age: otherProfile.age,
    gender: otherProfile.gender === "MALE" ? "남성" : "여성",
    location: otherProfile?.region || "",
    session: otherProfile.sessions.map((session: { icon: string; name: string }) => ({
      icon: getSessionComponent(session.name),
      name: session.name
    })),
    genres: otherProfile.genres.map((genre: string) => ({
      icon: getGenreIcon(genre),
      label: genre
    })),
    artists: otherProfile.favoriteArtists.map((artist: { imageUrl: string; name: string }) => ({
      image: artist.imageUrl,
      name: artist.name
    })),
    tags: otherProfile.traits,
    bio: otherProfile.bio,
    youtubeUrl: otherProfile.youtubeUrl,
  } : null;

  // 첫 접근 감지 및 가이드 표시
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("profile_guide_shown");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  // 가이드 닫기 핸들러
  const handleGuideClose = () => {
    setShowGuide(false);
    localStorage.setItem("profile_guide_shown", "true");
  };

  // 모달 보내기
  const handleSend = () => {
    setModalType(null);
    setModalMsg("");
    setToast({ message: modalType === "chat" ? "채팅 요청을 보냈습니다." : "친구 신청을 보냈습니다.", visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
  };

  // 모달 닫기
  const handleClose = () => {
    setModalType(null);
    setModalMsg("");
  };

  // 로딩 중이거나 에러가 있으면 처리
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-white">프로필을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1C1C1E] flex flex-col items-center relative">
      <ProfileHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onReport={() => alert("신고")}
        onBan={() => alert("차단")}
      />
      
      <div className="w-full flex flex-col items-center">        
        <ProfileCard
          profile={profile}
          onChat={() => setModalType("chat")}
          onFriend={() => setModalType("friend")}
          showGuide={showGuide}
          onGuideClose={handleGuideClose}
        />
      </div>
      
      <ProfileModalSection
        modalType={modalType}
        modalMsg={modalMsg}
        profileName={profile.name}
        onSend={handleSend}
        onClose={handleClose}
        onMessageChange={setModalMsg}
        toast={toast}
      />
    </div>
  );
} 