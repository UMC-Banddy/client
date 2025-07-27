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
      {/* 상대방 프로필 이미지 (상대방 메시지일 때만) */}
      {!isMe && (
        <div className="flex-shrink-0 mr-3">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      )}

      {/* 메시지 컨테이너 */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* 상대방 이름 표시 (상대방 메시지일 때만) */}
        {!isMe && (
          <div className="mb-1">
            <span className="text-sm text-gray-600 font-medium">{name}</span>
          </div>
        )}
        {/* 텍스트 메시지와 타임스탬프 */}
        {text && (
          <div
            className={`flex items-end gap-2 ${
              isMe ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="relative">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed break-words whitespace-pre-wrap ${
                  isMe
                    ? "bg-gray-200 text-gray-800 rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md"
                }`}
              >
                {text}
              </div>
              {/* 말풍선 꼬리 (상대방 메시지일 때만) */}
              {!isMe && (
                <div className="absolute -left-2 top-0 w-0 h-0 border-r-[8px] border-r-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
              )}
            </div>
            <div
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              {/* 읽지 않은 사람 수 */}
              <span
                className={`text-[10px] text-red-500 font-medium mb-0.5 ${
                  !isMe ? "ml-0.5" : ""
                }`}
              >
                {unreadCount || 1} {/*추후에 0명은 없음으로 수정할 것} */}
              </span>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {time}
              </span>
            </div>
          </div>
        )}

        {/* 오디오 메시지와 타임스탬프 */}
        {audio && (
          <div
            className={`flex items-end gap-2 ${
              isMe ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="relative">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm flex items-center w-48 ${
                  isMe
                    ? "bg-gray-200 text-gray-800 rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md"
                }`}
              >
                <button
                  onClick={audio.onPlay}
                  className={`mr-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isMe
                      ? "bg-gray-800 text-white hover:bg-gray-900"
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
                      isMe ? "bg-gray-400" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMe ? "bg-gray-600" : "bg-[#292929]"
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
              {/* 말풍선 꼬리 (상대방 메시지일 때만) */}
              {!isMe && (
                <div className="absolute -left-2 top-0 w-0 h-0 border-r-[8px] border-r-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
              )}
            </div>
            <div
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              {/* 읽지 않은 사람 수 */}
              <span
                className={`text-[10px] text-red-500 font-medium mb-0.5 ${
                  !isMe ? "ml-2" : ""
                }`}
              >
                {unreadCount || 1}
              </span>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {time}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
