import React, { useRef } from "react";
import BackIcon from "@/assets/icons/back.svg";

interface ChatHeaderProps {
  bandName?: string;
  bandAvatar?: string;
  bandStatus?: string;
  onBack?: () => void;
  onSettings?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ChatHeader({
  bandName = "우리밴드 정상영업합니다",
  bandAvatar = "/src/assets/images/profile1.png",
  bandStatus = "정상영업중",
  onBack,
  onSettings,
}: ChatHeaderProps) {
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

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
          onClick={onSettings}
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
    </div>
  );
}
