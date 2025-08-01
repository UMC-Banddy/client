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
  title: string;
  subtitle: string;
  onClose: () => void;
  tags: string[];
  description: string;
  deadline: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  bandId?: string; // 추가
}

const BandInfoModal: React.FC<BandInfoModalProps> = ({
  title,
  subtitle,
  onClose,
  tags,
  description,
  deadline,
  youtubeUrl,
  instagramUrl,
  bandId, // 추가
}) => {
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

  // 디버깅용 로그
  console.log("BandInfoModal props:", {
    title,
    subtitle,
    youtubeUrl,
    instagramUrl,
    bandId,
  });
  return (
    <div
      className="relative bg-[#F5E9EA] rounded-[28px] w-full max-w-[410px] min-w-[320px] min-h-[420px] max-h-[95vh] flex flex-col px-8 pt-10 pb-8"
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
      <div className="text-center mb-2 mt-2">
        <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
        <p className="text-lg text-gray-700 mb-6">{subtitle}</p>
      </div>
      {/* 아이콘 리스트 */}
      <div className="flex justify-center gap-4 mb-6">
        {[
          {
            Comp: Prefer,
            color: "red-400",
            link: bandId ? `/home/prefer/${bandId}` : "/home/prefer",
            hasLink: true,
          },
          {
            Comp: Playlist,
            color: "red-400",
            link: bandId ? `/home/playlist/${bandId}` : "/home/playlist",
            hasLink: true,
          },
          {
            Comp: People,
            color: "red-400",
            link: bandId ? `/home/people/${bandId}` : "/home/people",
            hasLink: true,
          },
          {
            Comp: Youtube,
            color: "gray-700",
            link: youtubeUrl,
            hasLink: !!youtubeUrl,
          },
          {
            Comp: Instagram,
            color: "gray-700",
            link: instagramUrl,
            hasLink: !!instagramUrl,
          },
          {
            Comp: Tictok,
            color: "gray-700",
            link: "https://tiktok.com",
            hasLink: true,
          },
        ].map(({ Comp, color, link, hasLink }, idx) => {
          const iconElement = (
            <Comp size={40} color={color as "red-400" | "gray-700"} />
          );

          if (hasLink && link) {
            if (link.startsWith("/")) {
              return (
                <Link key={idx} to={link} style={{ display: "inline-block" }}>
                  {iconElement}
                </Link>
              );
            } else {
              return (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block" }}
                >
                  {iconElement}
                </a>
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
        className="flex items-center mb-6 font-bold text-base w-full min-w-0 overflow-x-auto"
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
            // 세션 태그인지 확인 (첫 번째 태그만)
            const isSessionTag =
              idx === 0 &&
              (tag.toLowerCase().includes("보컬") ||
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
                tag.toLowerCase().includes("trumpet"));

            const SessionIcon = isSessionTag ? getSessionIcon(tag) : null;

            return (
              <React.Fragment key={tag}>
                {idx !== 0 && <span className="text-gray-400">|</span>}
                <span className="whitespace-nowrap flex items-center">
                  {isSessionTag && SessionIcon && (
                    <div className="w-3 h-3 mr-1">
                      <SessionIcon size={12} color="gray-700" />
                    </div>
                  )}
                  {tag}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* 본문/설명 스크롤 영역 */}
      <div
        className="flex-1 min-h-[120px] max-h-[160px] overflow-y-auto w-full px-0 mb-8"
        style={{ overflowX: "hidden" }}
      >
        <div className="whitespace-pre-line leading-relaxed text-[16px]">
          {description}
        </div>
      </div>
      {/* 마감일 좌측 하단 고정 */}
      <div className="absolute left-8 bottom-8 text-gray-700 text-[13px] font-bold">
        마감: {deadline}
      </div>
    </div>
  );
};

export default BandInfoModal;
