import React, { useState, useEffect } from "react";

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
  const [currentTime, setCurrentTime] = useState(0);

  // 오디오 재생 시간 추적
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (audio?.isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= audio.duration) {
            return audio.duration;
          }
          return prev + 0.05;
        });
      }, 50);
    } else {
      setCurrentTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [audio?.isPlaying, audio?.duration]);

  const handlePlay = () => {
    audio?.onPlay();
    setCurrentTime(0);
  };

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
          <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex ${
                isMe ? "flex-row-reverse" : "flex-row"
              } items-end gap-2 max-w-[70%]`}
            >
              {/* 상대방 메시지일 때만 프로필과 닉네임 표시 */}
              {!isMe && (
                <div className="flex flex-col items-center">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs text-gray-600 mt-1">{name}</span>
                </div>
              )}

              <div className="relative">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm flex items-center ${
                    isMe
                      ? "bg-gray-200 text-gray-800 rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md"
                  }`}
                >
                  {/* 재생 버튼 */}
                  <button
                    onClick={handlePlay}
                    className="mr-3 flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="16"
                      height="19"
                      viewBox="0 0 16 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-700"
                    >
                      <path
                        d="M4.23525e-08 1.05582V17.9442C-5.3432e-05 18.132 0.0505316 18.3164 0.146536 18.4784C0.24254 18.6404 0.380486 18.7742 0.546143 18.8658C0.711799 18.9574 0.899165 19.0037 1.08891 18.9998C1.27866 18.9958 1.46391 18.9419 1.62555 18.8435L15.4918 10.3993C15.6471 10.3049 15.7754 10.1726 15.8643 10.0152C15.9533 9.85775 16 9.68038 16 9.5C16 9.31962 15.9533 9.14225 15.8643 8.98481C15.7754 8.82738 15.6471 8.69513 15.4918 8.60069L1.62555 0.156515C1.46391 0.0581028 1.27866 0.00415256 1.08891 0.000230269C0.899165 -0.00369202 0.711799 0.0425557 0.546143 0.134202C0.380486 0.225848 0.24254 0.359574 0.146536 0.521581C0.0505316 0.683589 -5.3432e-05 0.868011 4.23525e-08 1.05582Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  {/* 시간과 진행바 */}
                  <span className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    {Math.floor(currentTime)}초
                  </span>
                  <div className="w-20 mx-2">
                    <div
                      className={`h-1 rounded-full ${
                        isMe ? "bg-gray-400" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isMe ? "bg-gray-600" : "bg-[#292929]"
                        }`}
                        style={{
                          width: `${(currentTime / audio.duration) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {Math.floor(audio.duration)}초
                  </span>
                </div>
                {/* 말풍선 꼬리 (상대방 메시지일 때만) */}
                {!isMe && (
                  <div className="absolute -left-2 top-0 w-0 h-0 border-r-[8px] border-r-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                )}
              </div>

              <div
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {/* 읽지 않은 사람 수 */}
                <span
                  className={`text-[10px] text-red-500 font-medium mb-0.5 ${
                    !isMe ? "ml-0.5" : ""
                  }`}
                >
                  {unreadCount || 1}
                </span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {time}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
