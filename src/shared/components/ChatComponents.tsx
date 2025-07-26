import React, { useState, useRef, useEffect, useCallback } from "react";

// Types
export interface ChatMessage {
  id: string;
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

export interface ChatHeaderProps {
  bandName?: string;
  bandAvatar?: string;
  bandStatus?: string;
  onBack?: () => void;
  onSettings?: () => void;
}

export interface ChatMessageItemProps {
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

export interface ChatMessageListProps {
  messages?: ChatMessage[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  autoScroll?: boolean;
}

export interface ChatInputBarProps {
  onSendMessage?: (message: string) => void;
  onSendAudio?: (audioBlob: Blob) => void;
  onSendImage?: (imageFile: File) => void;
  onSendCalendar?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

// Chat Header Component
export function ChatHeader({
  bandName = "우리밴드 정상영업합니다",
  bandAvatar = "/src/assets/images/profile1.png",
  bandStatus = "정상영업중",
  onBack,
  onSettings,
}: ChatHeaderProps) {
  return (
    <div className="w-full bg-[#181818] pb-6">
      {/* Main Header Content */}
      <div className="flex items-center justify-between px-6 py-5 h-28">
        <button
          className="flex items-center justify-center w-24 h-24 rounded-full hover:bg-white/10 transition-colors"
          onClick={onBack}
        >
          <img
            src="/src/assets/icons/back.svg"
            alt="Back"
            className="w-14 h-14"
          />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <img
              src={bandAvatar}
              alt="밴드"
              className="w-16 h-16 rounded-full object-cover mb-3"
            />
          </div>
          <span className="text-sm text-[#CACACA] text-center max-w-[200px] truncate mt-2">
            {bandName}
          </span>
        </div>

        <button
          className="flex items-center justify-center w-24 h-24 rounded-full hover:bg-white/10 transition-colors"
          onClick={onSettings}
        >
          <svg
            width="56"
            height="56"
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

// Chat Message Item Component
export function ChatMessageItem({
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

      {/* 내 메시지일 때는 프로필 이미지와 닉네임을 표시하지 않음 */}
    </div>
  );
}

// Chat Message List Component
export function ChatMessageList({
  messages = [],
  onLoadMore,
  isLoading = false,
  autoScroll = true,
}: ChatMessageListProps) {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleAudioPlay = useCallback(
    (messageId: string) => {
      if (playingAudioId && playingAudioId !== messageId) {
        setPlayingAudioId(null);
      }
      setPlayingAudioId(playingAudioId === messageId ? null : messageId);
    },
    [playingAudioId]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;
      if (scrollTop === 0 && onLoadMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, isLoading]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-0 py-4"
      onScroll={handleScroll}
    >
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      )}

      <div className="space-y-2">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            type={message.type}
            name={message.name}
            avatar={message.avatar}
            text={message.text}
            audio={
              message.audio
                ? {
                    ...message.audio,
                    isPlaying: playingAudioId === message.id,
                    onPlay: () => handleAudioPlay(message.id),
                  }
                : undefined
            }
            time={message.time}
            unreadCount={message.unreadCount}
          />
        ))}
      </div>

      <div ref={messagesEndRef} className="pb-32" />
    </div>
  );
}

// Chat Input Bar Component
export function ChatInputBar({
  onSendMessage,
  onSendAudio,
  onSendImage,
  onSendCalendar,
  placeholder = "메시지를 입력하세요",
  disabled = false,
}: ChatInputBarProps) {
  const [showActions, setShowActions] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  }, [message, onSendMessage, disabled]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onSendImage) {
        onSendImage(file);
      }
    },
    [onSendImage]
  );

  const handleAudioRecord = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  }, [isRecording]);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-30">
      <div
        className={`transition-transform duration-300 ease-in-out ${
          showActions ? "translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="bg-[#E9E9E9] px-4 pt-4 pb-6 flex flex-col items-center rounded-t-3xl shadow-lg">
          <div className="w-full flex items-center gap-3 mb-4">
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              onClick={() => setShowActions((v) => !v)}
              disabled={disabled}
            >
              +
            </button>

            <div className="flex-1 flex items-center bg-white rounded-2xl px-4 py-2 shadow-sm">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-base text-gray-800 placeholder-gray-500 disabled:opacity-50"
                placeholder={placeholder}
                disabled={disabled}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || disabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                message.trim() && !disabled
                  ? "bg-[#292929] hover:bg-[#1a1a1a] shadow-sm"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                className={
                  message.trim() && !disabled ? "text-white" : "text-gray-500"
                }
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {showActions && (
            <div className="flex justify-around w-full animate-slide-up">
              <button
                onClick={() => onSendCalendar?.()}
                className="flex flex-col items-center group"
                disabled={disabled}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-gray-700"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">일정</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center group"
                disabled={disabled}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-gray-700"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="21,15 16,10 5,21"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">앨범</span>
              </button>

              <button
                onClick={handleAudioRecord}
                className={`flex flex-col items-center group ${
                  isRecording ? "animate-pulse" : ""
                }`}
                disabled={disabled}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow ${
                    isRecording ? "bg-red-500" : "bg-white"
                  }`}
                >
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={isRecording ? "text-white" : "text-gray-700"}
                  >
                    <path
                      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M19 10v2a7 7 0 0 1-14 0v-2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="19"
                      x2="12"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="23"
                      x2="16"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">
                  {isRecording ? "녹음중..." : "음성"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// Chat Date Divider Component
export function ChatDateDivider({
  date,
  className = "",
}: {
  date?: string;
  className?: string;
}) {
  // 현재 날짜를 기본값으로 사용
  const currentDate =
    date ||
    new Date()
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, ".");

  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <span className="text-sm text-gray-500 font-medium">{currentDate}</span>
    </div>
  );
}
