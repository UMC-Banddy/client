import React from "react";

export default function ChatInputBar() {
  return (
    <div className="w-full bg-[#E9E9E9] px-3 py-3 flex items-end gap-2 border-t border-[#CACACA]">
      <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-2xl font-bold">
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
  );
}
