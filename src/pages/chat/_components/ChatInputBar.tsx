import React, { useState } from "react";
import CalendarIcon from "@/assets/icons/chat/calendar.svg?react";
import AlbumIcon from "@/assets/icons/chat/album.svg?react";
import VoiceIcon from "@/assets/icons/chat/record.svg?react";

export default function ChatInputBar() {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-30">
      <div
        className={`transition-transform duration-300 ${
          showActions ? "translate-y-0" : "translate-y-[calc(100%-64px)]"
        }`}
      >
        <div className="bg-[#E9E9E9] px-3 pt-3 pb-6 flex flex-col items-center rounded-t-2xl">
          {/* 입력창 */}
          <div className="w-full flex items-end gap-2 mb-4">
            <button
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-2xl font-bold"
              onClick={() => setShowActions((v) => !v)}
            >
              +
            </button>
            <div className="flex-1 flex items-center bg-white rounded-2xl px-3 py-2">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-base"
                placeholder="메시지를 입력하세요"
              />
            </div>
            <button className="w-9 h-9 rounded-full bg-[#292929] flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* 액션버튼들 */}
          {showActions && (
            <div className="flex justify-around w-full">
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
          )}
        </div>
      </div>
    </div>
  );
}
