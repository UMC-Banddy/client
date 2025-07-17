import React from "react";
import { IoClose } from "react-icons/io5";
import Instagram from "@/shared/components/images/Instagram";
import People from "@/shared/components/images/People";
// import Playlist from "@/shared/components/images/Playlist";
import Prefer from "@/shared/components/images/Prefer";
import Tictok from "@/shared/components/images/Tictok";
import Youtube from "@/shared/components/images/Youtube";

interface BandInfoModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  tags: string[];
  description: string;
  deadline: string;
}

const BandInfoModal: React.FC<BandInfoModalProps> = ({
  title,
  subtitle,
  onClose,
  tags,
  description,
  deadline,
}) => {
  return (
    <div
      className="relative bg-[#F5E9EA] rounded-[28px] w-full max-w-[410px] min-w-[320px] min-h-[420px] max-h-[95vh] flex flex-col px-8 pt-10 pb-8"
      style={{ boxShadow: "0px 4px 13px 0px #00000040" }}
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10"
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
        {/* <Playlist size={40} color="red-400" /> */}
        <Prefer size={40} color="red-400" />
        <People size={40} color="red-400" />

        <Youtube size={40} color="gray-700" />
        <Instagram size={40} color="gray-700" />
        <Tictok size={40} color="gray-700" />
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
          {tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              {idx !== 0 && <span className="text-gray-400">|</span>}
              <span className="whitespace-nowrap">{tag}</span>
            </React.Fragment>
          ))}
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
