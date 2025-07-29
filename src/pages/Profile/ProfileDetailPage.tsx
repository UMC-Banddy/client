import { useState, useEffect } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileCard from "./_components/ProfileCard";
import ProfileModalSection from "./_components/ProfileModalSection";
import { DrumImg, MicImg } from "@/shared/components/images";

export default function ProfileDetailPage() {
  // 가이드 상태 관리
  const [showGuide, setShowGuide] = useState(false);
  
  // 모달 상태 관리
  const [modalType, setModalType] = useState<null | "chat" | "friend">(null);
  const [modalMsg, setModalMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  
  // 메뉴 상태 관리
  const [menuOpen, setMenuOpen] = useState(false);

  // 목데이터
  const profile = {
    avatar: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRVZlH-Bqpxw2XI_qUxlkg4uI0ewNh8jKqgS8G9x-GXYZzAQj1-",
    id: 1,
    name: "Flowerboy",
    age: 23,
    gender: "여성",
    location: "서울시 노원구",
    session: [
      { icon: <MicImg color="red" size={32} /> },
      { icon: <DrumImg color="red" size={32} /> },
    ],
    genres: [
      { icon: "🤘", label: "Tiwan Indie" },
      { icon: "🎸", label: "Rock" },
      { icon: "💔", label: "EMO" },
    ],
    artists: [
      { image: "https://i.discogs.com/LWJa1W9cdAaPKnxkTNMyh3xsHMQ96HiwSFlwxfEz4gs/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2ODc2/Njc1LTE2ODI0MTU4/ODMtNjM3Mi5qcGVn.jpeg", name: "Gorillaz" },
      { image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt4MeWxVeeh39au45yo0lKDddcIYWZWSnkRJH79EALdOyQ-Ldh", name: "Sheena ringo" },
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", name: "The cabs" },
    ],
    tags: [
      "지각 안해요", "미리 조율해요", "핑크 안 내요", "연습 해와요", "주단위 합주"
    ],
    bio: "안녕하세요 저는 파리의 택시운전사입니다.\n파리는 정말 멋진 도시이고요 2025 파리 엑스포 화이팅!",
  };

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