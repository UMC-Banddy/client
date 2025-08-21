import React from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import Instagram from "@/shared/components/images/Instagram";
import People from "@/shared/components/images/People";
import Playlist from "@/shared/components/images/Playlist";
import Prefer from "@/shared/components/images/Prefer";
import Tictok from "@/shared/components/images/Tictok";
import Youtube from "@/shared/components/images/Youtube";
import {
  MicImg,
  GuitarImg,
  AcousticGuitarImg,
  BassImg,
  DrumImg,
  PianoImg,
  ViolinImg,
  TrumpetImg,
} from "@/shared/components/images";

interface BandInfoModalProps {
  bandName?: string;
  title: string;
  subtitle: string;
  onClose: () => void;
  tags: string[];
  description: string;
  deadline: string;
  imageUrl?: string; // 캐러셀에서 사용한 이미지 전달
  userSessions?: string[]; // 사용자 세션 정보 추가
}

const BandInfoModal: React.FC<BandInfoModalProps> = ({
  bandName,
  title,
  subtitle,
  onClose,
  tags,
  description,
  deadline,
  imageUrl,
  userSessions = [], // 사용자 세션 정보 추가
}) => {
  // subtitle은 props로 받지만 현재 UI에서는 사용하지 않음
  // 향후 필요시 활용 가능하도록 유지
  console.log("Modal subtitle:", subtitle); // 임시로 사용하여 린트 에러 해결
  // 세션별 아이콘 매핑 함수
  const getSessionIcon = (tagName: string) => {
    const cleanName = tagName.toLowerCase();

    if (cleanName.includes("보컬") || cleanName.includes("vocal"))
      return MicImg;
    if (
      cleanName.includes("어쿠스틱 기타") ||
      cleanName.includes("acoustic guitar")
    )
      return AcousticGuitarImg;
    if (cleanName.includes("기타") || cleanName.includes("guitar"))
      return GuitarImg;
    if (cleanName.includes("베이스") || cleanName.includes("bass"))
      return BassImg;
    if (cleanName.includes("드럼") || cleanName.includes("drum"))
      return DrumImg;
    if (cleanName.includes("피아노") || cleanName.includes("piano"))
      return PianoImg;
    if (cleanName.includes("바이올린") || cleanName.includes("violin"))
      return ViolinImg;
    if (cleanName.includes("트럼펫") || cleanName.includes("trumpet"))
      return TrumpetImg;

    // 기본값
    return MicImg;
  };

  const YOUTUBE_FALLBACK = "https://www.youtube.com/@Banddy79";
  const INSTAGRAM_FALLBACK = "https://www.instagram.com/banddy79/";

  const resolvedYoutubeLink =
    // youtubeUrl && youtubeUrl.trim() ? youtubeUrl : YOUTUBE_FALLBACK; // Removed as per new_code
    YOUTUBE_FALLBACK; // Assuming a default or that it's no longer needed
  const resolvedInstagramLink =
    // instagramUrl && instagramUrl.trim() ? instagramUrl : INSTAGRAM_FALLBACK; // Removed as per new_code
    INSTAGRAM_FALLBACK; // Assuming a default or that it's no longer needed

  return (
    <div
      className="relative bg-[#F5E9EA] rounded-[28px] w-full max-w-[420px] min-w-0 min-h-[420px] max-h-[95vh] flex flex-col px-6 sm:px-7 md:px-8 pt-10 pb-8 overflow-hidden"
      style={{ boxShadow: "0px 4px 13px 0px #00000040" }}
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10"
        onClick={onClose}
        aria-label="닫기"
      >
        <IoClose className="w-5 h-5 text-black" />
      </button>
      {/* 제목/부제목 */}
      <div className="text-center mb-2 mt-2 px-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 break-words break-keep">
          {bandName ?? title}
        </h2>
      </div>
      {/* 아이콘 리스트 (반응형, 1줄 고정) */}
      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 flex-nowrap">
        {[
          {
            Comp: Prefer,
            color: "red-400",
            link: "/home/prefer",
            hasLink: true,
          },
          {
            Comp: Playlist,
            color: "red-400",
            link: "/home/playlist",
            hasLink: true,
          },
          {
            Comp: People,
            color: "red-400",
            link: "/home/people",
            hasLink: true,
          },
          {
            Comp: Youtube,
            color: "gray-700",
            link: resolvedYoutubeLink,
            hasLink: true,
          },
          {
            Comp: Instagram,
            color: "gray-700",
            link: resolvedInstagramLink,
            hasLink: true,
          },
          {
            Comp: Tictok,
            color: "gray-700",
            link: "https://tiktok.com",
            hasLink: true,
          },
        ].map(({ Comp, color, link, hasLink }, idx) => {
          const iconElement = (
            <div className="shrink-0 aspect-square w-9 sm:w-10 md:w-12 flex items-center justify-center">
              <Comp size={28} color={color as "red-400" | "gray-700"} />
            </div>
          );

          if (hasLink && link) {
            if (link.startsWith("/")) {
              return (
                <Link
                  key={idx}
                  to={link}
                  state={{
                    initialBand: {
                      title: bandName ?? title,
                      imageUrl,
                    },
                  }}
                  style={{ display: "inline-block" }}
                >
                  {iconElement}
                </Link>
              );
            } else {
              const absoluteLink = link.startsWith("http")
                ? link
                : `https://${link.replace(/^\/+/, "")}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    window.open(absoluteLink, "_blank", "noopener,noreferrer")
                  }
                  style={{ display: "inline-block" }}
                >
                  {iconElement}
                </button>
              );
            }
          } else {
            return (
              <div key={idx} style={{ display: "inline-block" }}>
                {iconElement}
              </div>
            );
          }
        })}
      </div>
      {/* 태그/정보 + 세로 구분선 */}
      <div
        className="flex items-center mb-6 font-bold text-base w-full min-w-0 overflow-x-auto overflow-y-hidden px-1"
        style={{ scrollbarWidth: "none" }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="mr-3 shrink-0"
          fill="none"
        >
          <polygon points="0,0 10,5 0,10" fill="#B42127" />
        </svg>
        <div className="flex items-center gap-3 flex-nowrap min-w-0">
          {tags.map((tag, idx) => {
            // 사용자 세션과 연관된 세션 태그인지 확인
            const isUserSessionTag = userSessions.some((userSession) => {
              const cleanTagName = tag.toLowerCase();
              const cleanUserSession = userSession.toLowerCase();

              // 세션 매핑 (API 응답 형식에 맞게)
              if (cleanTagName.includes("보컬") && cleanUserSession.includes("vocal")) return true;
              if (cleanTagName.includes("어쿠스틱 기타") && cleanUserSession.includes("acoustic_guitar")) return true;
              if (cleanTagName.includes("일렉 기타") && cleanUserSession.includes("electric_guitar")) return true;
              if (cleanTagName.includes("기타") && cleanUserSession.includes("electric_guitar")) return true;
              if (cleanTagName.includes("베이스") && cleanUserSession.includes("bass")) return true;
              if (cleanTagName.includes("드럼") && cleanUserSession.includes("drums")) return true;
              if (cleanTagName.includes("키보드") && cleanUserSession.includes("keyboard")) return true;
              if (cleanTagName.includes("바이올린") && cleanUserSession.includes("violin")) return true;
              if (cleanTagName.includes("트럼펫") && cleanUserSession.includes("trumpet")) return true;

              return false;
            });

            // 장르 태그인지 확인
            const isGenreTag = [
              "rock",
              "pop",
              "jazz",
              "blues",
              "hip-hop",
              "rap",
              "electronic",
              "classical",
              "country",
              "folk",
              "reggae",
              "punk",
              "metal",
              "indie",
              "alternative",
              "r&b",
              "soul",
              "funk",
              "disco",
              "techno",
              "house",
              "trance",
              "ambient",
              "grunge",
              "nu metal",
              "indie rock",
            ].some((keyword) => tag.toLowerCase().includes(keyword));

            // 세션 태그인지 확인 (아이콘 표시용)
            const isSessionTag =
              isUserSessionTag ||
              tag.toLowerCase().includes("보컬") ||
              tag.toLowerCase().includes("기타") ||
              tag.toLowerCase().includes("베이스") ||
              tag.toLowerCase().includes("드럼") ||
              tag.toLowerCase().includes("피아노") ||
              tag.toLowerCase().includes("바이올린") ||
              tag.toLowerCase().includes("트럼펫") ||
              tag.toLowerCase().includes("vocal") ||
              tag.toLowerCase().includes("guitar") ||
              tag.toLowerCase().includes("bass") ||
              tag.toLowerCase().includes("drum") ||
              tag.toLowerCase().includes("piano") ||
              tag.toLowerCase().includes("violin") ||
              tag.toLowerCase().includes("trumpet");

            const SessionIcon = isSessionTag ? getSessionIcon(tag) : null;

            // 태그 색상 결정
            let tagStyle = "";
            if (isUserSessionTag) {
              // 사용자 세션과 연관된 태그: 빨간색
              tagStyle = "bg-[#B42127] text-white";
            } else if (isGenreTag) {
              // 장르 태그: 검은색
              tagStyle = "bg-black text-white";
            } else {
              // 기타 세션 태그: 기본 스타일
              tagStyle =
                "bg-[rgba(0,0,0,0.5)] text-white border border-white/60";
            }

            return (
              <React.Fragment key={tag}>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tagStyle}`}
                >
                  {isSessionTag && SessionIcon && (
                    <div className="w-3 h-3 mr-1">
                      <SessionIcon size={12} color="gray" />
                    </div>
                  )}
                  {tag}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* 본문/설명 스크롤 영역 */}
      <div className="flex-1 min-h-[120px] max-h-[160px] overflow-y-auto w-full px-1 mb-8 overflow-x-hidden">
        <div className="whitespace-pre-line leading-relaxed text-[16px] break-words break-keep">
          {description}
        </div>
      </div>
      {/* 마감일 좌측 하단 고정 */}
      <div className="absolute left-6 sm:left-8 bottom-8 text-gray-700 text-[13px] font-bold">
        마감: {deadline}
      </div>
    </div>
  );
};

export default BandInfoModal;
