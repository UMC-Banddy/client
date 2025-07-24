import React, { useState, useRef } from "react";
import CalendarIcon from "@/assets/icons/chat/calendar.svg?react";
import AlbumIcon from "@/assets/icons/chat/album.svg?react";
import VoiceIcon from "@/assets/icons/chat/record.svg?react";

interface ChatInputBarProps {
  onSendMessage?: (message: string) => void;
  onSendAudio?: (audioBlob: Blob) => void;
  onSendImage?: (imageFile: File) => void;
  onSendCalendar?: () => void;
  placeholder?: string;
}

export default function ChatInputBar({
  onSendMessage,
  onSendAudio,
  onSendImage,
  onSendCalendar,
  placeholder = "메시지를 입력하세요",
}: ChatInputBarProps) {
  const [showActions, setShowActions] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendImage) {
      onSendImage(file);
    }
  };

  const handleAudioRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 z-30">
      <div
        className={`transition-transform duration-300 ease-in-out ${
          showActions ? "translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="bg-[#E9E9E9] px-4 pt-4 pb-6 flex flex-col items-center rounded-t-3xl shadow-lg">
          {/* Input Bar */}
          <div className="w-full flex items-center gap-3 mb-4">
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => setShowActions((v) => !v)}
            >
              +
            </button>

            <div className="flex-1 flex items-center bg-white rounded-2xl px-4 py-2 shadow-sm">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-base text-gray-800 placeholder-gray-500"
                placeholder={placeholder}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                message.trim()
                  ? "bg-[#292929] hover:bg-[#1a1a1a] shadow-sm"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                className={message.trim() ? "text-white" : "text-gray-500"}
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

          {/* Action Buttons */}
          {showActions && (
            <div className="flex justify-around w-full">
              <button
                onClick={() => onSendCalendar?.()}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <CalendarIcon className="w-8 h-8 text-gray-700" />
                </div>
                <span className="text-xs text-gray-700">일정</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <AlbumIcon className="w-8 h-8 text-gray-700" />
                </div>
                <span className="text-xs text-gray-700">앨범</span>
              </button>

              <button
                onClick={handleAudioRecord}
                className={`flex flex-col items-center group ${
                  isRecording ? "animate-pulse" : ""
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow ${
                    isRecording ? "bg-red-500" : "bg-white"
                  }`}
                >
                  <VoiceIcon
                    className={`w-8 h-8 ${
                      isRecording ? "text-white" : "text-gray-700"
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-700">
                  {isRecording ? "녹음중..." : "음성"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
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
