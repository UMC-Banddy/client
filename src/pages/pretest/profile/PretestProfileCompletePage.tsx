import React from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "@/assets/images/profile1.png";
import pencilIcon from "@/assets/icons/pencil.svg";
import ProfileTag from "./_components/ProfileTag";
import ArtistCard from "./_components/ArtistCard";
import SessionIcon from "./_components/SessionIcon";

const PretestProfileCompletePage: React.FC = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/home");
  };

  const handleEdit = () => {
    navigate("/pre-test/profile/edit");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] text-white font-inherit">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
        <div className="flex-1"></div>
        <button
          onClick={handleConfirm}
          className="bg-none border-none text-[#7ED957] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold cursor-pointer"
        >
          확인
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* 완성 메시지 */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white font-medium leading-tight">
              프로필이 완성되었습니다!
            </h1>
          </div>

          {/* 프로필 카드 */}
          <div className="bg-gray-200 rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl 2xl:rounded-7xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 relative">
            {/* 수정 아이콘 - 우측 상단 */}
            <button
              onClick={handleEdit}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 xl:top-12 xl:right-12 2xl:top-14 2xl:right-14 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7"
            >
              <img
                src={pencilIcon}
                alt="수정"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13"
              />
            </button>

            {/* 프로필 이미지 및 기본 정보 */}
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <img
                src={profileImage}
                alt="프로필"
                className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 rounded-full object-cover"
              />
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-black mb-1 sm:mb-2">
                  BECK
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 mb-2 sm:mb-3">
                  23세 | 여성 · 서울시 노원구
                </p>
                <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 justify-center">
                  <SessionIcon icon="🎤" />
                  <SessionIcon icon="🥁" />
                </div>
              </div>
            </div>

            {/* 관심 장르 */}
            <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                관심 장르
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
                <ProfileTag text="Tiwan Indie" icon="🤘" variant="genre" />
                <ProfileTag text="Rock" icon="🎸" variant="genre" />
                <ProfileTag text="EMO" icon="💔" variant="genre" />
              </div>
            </div>

            {/* 관심 아티스트 */}
            <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                관심 아티스트
              </h3>
              <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
                <ArtistCard name="Gorillaz" image={profileImage} />
                <ArtistCard name="Sheena ringo" image={profileImage} />
                <ArtistCard name="The cabs" image={profileImage} />
              </div>
            </div>

            {/* 키워드 */}
            <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
                <ProfileTag text="지각 안해요" variant="keyword" />
                <ProfileTag text="미리 조율해요" variant="keyword" />
                <ProfileTag text="펑크 안 내요" variant="keyword" />
                <ProfileTag text="연습 해와요" variant="keyword" />
                <ProfileTag text="주단위 합주" variant="keyword" />
              </div>
            </div>

            {/* 소개글 */}
            <div>
              <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                소개글
              </h3>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black leading-relaxed">
                안녕하세요 저는 파리의 택시운전사입니다. 파리는 정말 멋진
                도시이고요 2025 파리 엑스포 화이팅!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PretestProfileCompletePage;
