import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@mui/material";
import calendarIcon from "@/assets/icons/chat/calendar.svg";
import albumIcon from "@/assets/icons/chat/album.svg";
import recordIcon from "@/assets/icons/chat/record.svg";
import topArrowIcon from "@/assets/icons/chat/top-arrow.svg";
import profile1Img from "@/assets/images/profile1.png";
import backIcon from "@/assets/icons/back.svg";
// ... existing code ...

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
  onSendAudio?: (duration: number) => void;
  onSendImage?: (imageFile: File) => void;
  onSendCalendar?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

// Chat Header Component
export function ChatHeader({
  bandName = "우리밴드 정상영업합니다",
  bandAvatar = profile1Img,
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
            src={backIcon}
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
                      ? "bg-[#292929] text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md"
                  }`}
                >
                  {/* 재생 버튼 */}
                  <button
                    onClick={audio.onPlay}
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
                  <span
                    className={`text-xs mr-2 whitespace-nowrap ${
                      isMe ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    0초
                  </span>
                  <div className="w-20 mx-2">
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
                  <span
                    className={`text-xs ml-2 whitespace-nowrap ${
                      isMe ? "text-white/70" : "text-gray-500"
                    }`}
                  >
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
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

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
    setShowAudioModal(true);
  }, []);

  const handleStartRecording = useCallback(() => {
    setShowAudioModal(false);
    setShowRecordingModal(true);
    setIsRecording(true);
    setRecordingTime(0);
    // 실제 녹음 로직은 여기에 구현
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // interval을 저장하여 정지 시 clear할 수 있도록 함
    recordingIntervalRef.current = interval;
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    setShowRecordingModal(false);
    setShowSendConfirmModal(true);
    // interval 정리
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    // 녹음 정지 로직
    console.log("녹음 완료:", recordingTime, "초");
  }, [recordingTime]);

  const handleSendRecording = useCallback(() => {
    // 녹음 파일 전송 로직
    console.log("녹음 파일 전송:", recordingTime, "초");
    onSendAudio?.(recordingTime);
    setShowSendConfirmModal(false);
    setRecordingTime(0);
  }, [recordingTime, onSendAudio]);

  const handleCancelRecording = useCallback(() => {
    setShowSendConfirmModal(false);
    setRecordingTime(0);
  }, []);

  const handleFileUpload = useCallback(() => {
    audioFileInputRef.current?.click();
  }, []);

  const handleAudioFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("audio/")) {
        setAudioFile(file);
      }
    },
    []
  );

  const handleSendAudio = useCallback(() => {
    if (audioFile) {
      // 오디오 파일 전송 로직
      console.log("오디오 파일 전송:", audioFile);
      setAudioFile(null);
      setShowAudioModal(false);
    }
  }, [audioFile]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-30">
      <div
        className={`transition-transform duration-300 ease-in-out ${
          showActions ? "translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="bg-gray-300 px-4 pt-4 pb-6 flex flex-col items-center shadow-lg">
          <div className="w-full flex items-center gap-3 mb-4">
            <button
              className="w-10 h-10 flex items-center justify-center text-3xl font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 shadow-sm transition-all"
            >
              <img src={topArrowIcon} alt="전송" className="w-5 h-5" />
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
                  <img src={calendarIcon} alt="일정" className="w-8 h-8" />
                </div>
                <span className="text-xs text-gray-700">일정</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center group"
                disabled={disabled}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={albumIcon} alt="앨범" className="w-8 h-8" />
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
                  <img src={recordIcon} alt="음성" className="w-8 h-8" />
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
      <input
        ref={audioFileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioFileSelect}
        className="hidden"
      />

      {/* Audio Modal */}
      <Dialog
        open={showAudioModal}
        onClose={() => setShowAudioModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: "#E9E9E9",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogContent sx={{ padding: "24px" }}>
          <div className="space-y-4">
            {/* Header */}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">음성</h3>
            </div>

            {/* Recording Section */}
            {!audioFile && (
              <div className="space-y-3">
                <button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-full py-4 px-6 rounded-xl text-left transition-all ${
                    isRecording
                      ? "text-red-700"
                      : "text-gray-800 hover:text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">지금 녹음</span>
                    {isRecording && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={handleFileUpload}
                  className="w-full py-4 px-6 rounded-xl text-left text-gray-800 hover:text-gray-600 transition-all"
                >
                  <span className="font-medium">파일에서 찾기</span>
                </button>
              </div>
            )}

            {/* Audio File Preview */}
            {audioFile && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {audioFile.name}
                        </p>
                        <p className="text-sm text-gray-500">오디오 파일</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAudioFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAudioModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSendAudio}
                    className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recording Modal */}
      <Dialog
        open={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: "#E9E9E9",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogContent sx={{ padding: "32px 24px" }}>
          <div className="text-center space-y-6">
            {/* Recording Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-12 h-12 text-white"
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
                {/* Ripple Effect */}
                <div className="absolute inset-0 w-24 h-24 bg-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Recording Status */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                녹음 중...
              </h3>
              <p className="text-3xl font-mono text-red-600 font-bold">
                {formatTime(recordingTime)}
              </p>
            </div>

            {/* Stop Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStopRecording}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Instructions */}
            <p className="text-sm text-gray-600">
              정지 버튼을 눌러 녹음을 완료하세요
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Modal */}
      <Dialog
        open={showSendConfirmModal}
        onClose={() => setShowSendConfirmModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: "#E9E9E9",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogContent sx={{ padding: "24px" }}>
          <div className="text-center space-y-6">
            {/* Recording Info */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-gray-600"
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
              <p className="text-lg font-semibold text-gray-800">녹음 완료</p>
              <p className="text-2xl font-mono text-gray-600 font-bold">
                {formatTime(recordingTime)}
              </p>
            </div>

            {/* Confirmation Message */}
            <p className="text-base text-gray-700">
              이 녹음을 전송하시겠습니까?
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCancelRecording}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSendRecording}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                전송
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
