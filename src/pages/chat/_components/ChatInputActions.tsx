import React from "react";
import CalendarIcon from "@/assets/icons/chat/calendar.svg?react";
import AlbumIcon from "@/assets/icons/chat/album.svg?react";
import VoiceIcon from "@/assets/icons/chat/record.svg?react";

export default function ChatInputActions({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed left-0 right-0 bottom-0 z-30 transition-transform duration-300 ${
        open
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-around bg-[#E9E9E9] py-4 rounded-t-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-1">
            <CalendarIcon className="w-8 h-8 text-gray-700" />
          </div>
          <span className="text-xs text-gray-700">일정</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-1">
            <AlbumIcon className="w-8 h-8 text-gray-700" />
          </div>
          <span className="text-xs text-gray-700">앨범</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-1">
            <VoiceIcon className="w-8 h-8 text-gray-700" />
          </div>
          <span className="text-xs text-gray-700">음성</span>
        </div>
      </div>
      {/* 바깥 클릭 시 닫기 */}
      {open && <div className="fixed inset-0 z-20" onClick={onClose} />}
    </div>
  );
}
