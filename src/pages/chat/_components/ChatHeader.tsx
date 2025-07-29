import React, { useState, useRef, useEffect } from "react";
import BackIcon from "@/assets/icons/back.svg";
import FlagIcon from "@/assets/icons/chat/flag.svg";
import BlockIcon from "@/assets/icons/chat/block.svg";
import GetoutIcon from "@/assets/icons/chat/getout.svg";

interface ChatHeaderProps {
  bandName?: string;
  bandAvatar?: string;
  bandStatus?: string;
  onBack?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onLeave?: () => void;
}

export default function ChatHeader({
  bandName = "우리밴드 정상영업합니다",
  bandAvatar = "/src/assets/images/profile1.png",
  onBack,
  onReport,
  onBlock,
  onLeave,
}: ChatHeaderProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div className="w-full bg-[#181818] pb-6">
      {/* Main Header Content */}
      <div className="flex items-center justify-between px-6 pt-8 pb-5 h-32">
        {/* Back Button */}
        <button
          className="flex items-center justify-center w-16 h-16 rounded-full hover:bg-white/10 transition-colors"
          onClick={onBack}
        >
          <img src={BackIcon} alt="Back" className="w-8 h-8" />
        </button>

        {/* Band Info */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={bandAvatar}
              alt="밴드"
              className="w-20 h-20 rounded-full object-cover object-center mb-3"
            />
          </div>
          <span className="text-sm text-[#CACACA] text-center max-w-[200px] truncate">
            {bandName}
          </span>
        </div>

        {/* Settings Button */}
        <button
          ref={settingsButtonRef}
          className="flex items-center justify-center w-16 h-16 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          <svg
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            className="text-white"
          >
            <circle cx="12" cy="6" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Popup Menu */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50">
          <div
            ref={popupRef}
            className="absolute bg-white rounded-[14px] shadow-lg border border-gray-200 min-w-[200px] py-2"
            style={{
              top: settingsButtonRef.current
                ? settingsButtonRef.current.getBoundingClientRect().bottom + 8
                : 0,
              right: settingsButtonRef.current
                ? window.innerWidth -
                  settingsButtonRef.current.getBoundingClientRect().right -
                  16
                : 0,
            }}
          >
            <button
              onClick={() => {
                onReport?.();
                setIsPopupOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src={FlagIcon} alt="신고" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">신고</span>
            </button>
            <button
              onClick={() => {
                onBlock?.();
                setIsPopupOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src={BlockIcon} alt="차단" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">차단</span>
            </button>
            <button
              onClick={() => {
                onLeave?.();
                setIsPopupOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src={GetoutIcon} alt="나가기" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">나가기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
