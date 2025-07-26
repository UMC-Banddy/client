import React from "react";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageItemProps {
  type: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  audio?: {
    duration: number;
    isPlaying: boolean;
    onPlay: () => void;
  };
  time: string;
  unreadCount?: number;
}

export default function ChatMessageItem({
  type,
  name,
  avatar,
  text,
  audio,
  time,
  unreadCount,
}: ChatMessageItemProps) {
  const isMe = type === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4 px-4`}>
      {/* 상대방 메시지일 때만 프로필 이미지와 닉네임 표시 */}
      {!isMe && (
        <div className="flex flex-col items-center mr-3 flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover mb-1"
          />
          <span className="text-xs text-gray-500 text-center max-w-[60px] truncate">
            {name}
          </span>
        </div>
      )}

      {/* 메시지 컨테이너 */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* 텍스트 메시지 */}
        {text && (
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed break-words ${
              isMe
                ? "bg-[#292929] text-white rounded-br-md"
                : "bg-white text-gray-800 rounded-bl-md"
            }`}
          >
            {text}
          </div>
        )}

        {/* 오디오 메시지 */}
        {audio && (
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm flex items-center w-48 ${
              isMe
                ? "bg-[#292929] text-white rounded-br-md"
                : "bg-white text-gray-800 rounded-bl-md"
            }`}
          >
            <button
              onClick={audio.onPlay}
              className={`mr-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isMe
                  ? "bg-white text-[#292929] hover:bg-gray-100"
                  : "bg-[#292929] text-white hover:bg-gray-800"
              }`}
            >
              {audio.isPlaying ? (
                <svg
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <div
                className={`h-1 rounded-full ${
                  isMe ? "bg-white/30" : "bg-gray-300"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isMe ? "bg-white" : "bg-[#292929]"
                  }`}
                  style={{ width: audio.isPlaying ? "60%" : "0%" }}
                />
              </div>
            </div>
            <span className="text-xs ml-2 opacity-70">
              {Math.floor(audio.duration / 60)}:
              {(audio.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}

        {/* 시간과 읽지않음 표시 */}
        <div
          className={`flex items-center mt-1 gap-1 ${
            isMe ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-[10px] text-gray-400">{time}</span>
          {isMe && unreadCount && unreadCount > 0 && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
