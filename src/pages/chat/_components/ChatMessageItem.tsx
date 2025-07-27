import React from "react";

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
                className={`px-4 py-3 rounded-2xl shadow-sm flex items-center w-56 ${
                  isMe
                    ? "bg-gray-200 text-gray-800 rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md"
                }`}
              >
                {/* 오디오 아이콘 */}
                <div className="mr-3 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* 재생 버튼 */}
                <button
                  onClick={audio.onPlay}
                  className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isMe
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-[#292929] text-white hover:bg-gray-800"
                  }`}
                >
                  {audio.isPlaying ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* 진행바와 시간 */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">0:00</span>
                    <span className="text-xs text-gray-500">
                      {Math.floor(audio.duration / 60)}:
                      {(audio.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full ${
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
              {unreadCount && unreadCount > 0 && (
                <span
                  className={`text-[10px] text-red-500 font-medium mb-0.5 ${
                    !isMe ? "ml-2" : ""
                  }`}
                >
                  {unreadCount}
                </span>
              )}
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
