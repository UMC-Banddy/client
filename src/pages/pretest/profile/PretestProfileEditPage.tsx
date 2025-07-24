import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "@/assets/images/profile1.png";
import ProfileEditHeader from "./_components/ProfileEditHeader";
import ProfileImageSection from "./_components/ProfileImageSection";
import BasicInfoSection from "./_components/BasicInfoSection";
import LocationSection from "./_components/LocationSection";
import SessionSection from "./_components/SessionSection";
import GenreSection from "./_components/GenreSection";
import ArtistSection from "./_components/ArtistSection";
import KeywordSection from "./_components/KeywordSection";
import IntroductionSection from "./_components/IntroductionSection";

const PretestProfileEditPage: React.FC = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [name, setName] = useState("BECK");
  const [age, setAge] = useState("23세");
  const [gender, setGender] = useState("여성");
  const [city, setCity] = useState("서울특별시");
  const [district, setDistrict] = useState("노원구");
  const [selectedSessions, setSelectedSessions] = useState<
    Record<string, string>
  >({
    vocal: "expert",
    drum: "beginner",
  });
  const [genres] = useState([
    { id: "1", name: "Grunge", icon: "🤘" },
    { id: "2", name: "Indie Rock", icon: "🎶" },
  ]);
  const [artists] = useState([
    { id: "1", name: "Gorillaz", imageUrl: profileImage },
    { id: "2", name: "Sheena ringo", imageUrl: profileImage },
    { id: "3", name: "The cabs", imageUrl: profileImage },
  ]);
  const [keywords] = useState([
    { id: "1", text: "미리 조율해요", category: "manner" },
    { id: "2", text: "약속 잘 지켜요", category: "manner" },
    { id: "3", text: "연락이 빨라요", category: "manner" },
  ]);
  const [introduction, setIntroduction] = useState(
    "안녕하세요 저는 파리의 택시운전사입니다 파리는 정말 멋진 도시이고요 2025 파리 엑스포 화이팅!"
  );

  // 이벤트 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = () => {
    navigate("/pre-test/profile/complete");
  };

  const handleImageChange = () => {
    // 이미지 변경 로직
    console.log("이미지 변경");
  };

  const handleImageUpload = () => {
    // 이미지 업로드 로직
    console.log("이미지 업로드");
  };

  const handleNameClear = () => {
    setName("");
  };

  const handleSessionChange = (sessionId: string, levelId: string) => {
    setSelectedSessions((prev) => ({
      ...prev,
      [sessionId]: levelId,
    }));
  };

  const handleAddSession = () => {
    // 세션 추가 로직 - 모달을 열거나 새 세션을 추가
    console.log("세션 추가 모달 열기");
    // 여기서는 간단히 새로운 세션을 추가하는 예시
    const newSessionId = `session_${Date.now()}`;
    setSelectedSessions((prev) => ({
      ...prev,
      [newSessionId]: "beginner", // 기본값으로 초보 설정
    }));
  };

  const handleEditGenre = () => {
    // 장르 수정 로직
    console.log("장르 수정");
  };

  const handleRemoveGenre = (genreId: string) => {
    // 장르 제거 로직
    console.log("장르 제거:", genreId);
  };

  const handleEditArtist = () => {
    // 아티스트 수정 로직
    console.log("아티스트 수정");
  };

  const handleRemoveArtist = (artistId: string) => {
    // 아티스트 제거 로직
    console.log("아티스트 제거:", artistId);
  };

  const handleAddKeyword = () => {
    // 키워드 추가 로직
    console.log("키워드 추가");
  };

  const handleRemoveKeyword = (keywordId: string) => {
    // 키워드 제거 로직
    console.log("키워드 제거:", keywordId);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#292929] text-white">
      {/* 헤더 */}
      <ProfileEditHeader onBack={handleBack} onComplete={handleComplete} />

      {/* 본문 */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* 프로필 이미지 */}
          <ProfileImageSection
            imageUrl={profileImage}
            onImageChange={handleImageChange}
            onImageUpload={handleImageUpload}
          />

          {/* 기본 정보 */}
          <BasicInfoSection
            name={name}
            age={age}
            gender={gender}
            onNameChange={setName}
            onNameClear={handleNameClear}
            onAgeChange={setAge}
            onGenderChange={setGender}
          />

          {/* 거주 지역 */}
          <LocationSection
            city={city}
            district={district}
            onCityChange={setCity}
            onDistrictChange={setDistrict}
          />

          {/* 가능한 세션 및 실력 */}
          <SessionSection
            sessions={selectedSessions}
            onSessionChange={handleSessionChange}
            onAddSession={handleAddSession}
          />

          {/* 관심 장르 */}
          <GenreSection
            genres={genres}
            onEdit={handleEditGenre}
            onRemoveGenre={handleRemoveGenre}
          />

          {/* 관심 아티스트 */}
          <ArtistSection
            artists={artists}
            onEdit={handleEditArtist}
            onRemoveArtist={handleRemoveArtist}
          />

          {/* 키워드 */}
          <KeywordSection
            keywords={keywords}
            onAddKeyword={handleAddKeyword}
            onRemoveKeyword={handleRemoveKeyword}
          />

          {/* 소개글 */}
          <IntroductionSection
            introduction={introduction}
            onIntroductionChange={setIntroduction}
          />
        </div>
      </div>
    </div>
  );
};

export default PretestProfileEditPage;
