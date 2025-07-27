import React, { useState, useRef, useEffect } from "react";
import calendarIcon from "@/assets/icons/chat/calendar.svg";
import albumIcon from "@/assets/icons/chat/album.svg";
import recordIcon from "@/assets/icons/chat/record.svg";
import topArrowIcon from "@/assets/icons/chat/top-arrow.svg";

interface ChatInputBarProps {
  onSendMessage?: (message: string) => void;

  onSendImage?: (imageFile: File) => void;
  onSendCalendar?: () => void;
  placeholder?: string;
  disabled?: boolean;
  onShowActionsChange?: (show: boolean) => void;
}

export default function ChatInputBar({
  onSendMessage,
  onSendImage,
  onSendCalendar,
  placeholder = "메시지를 입력하세요",
  disabled = false,
  onShowActionsChange,
}: ChatInputBarProps) {
  const [showActions, setShowActions] = useState(false);

  // 부모 컴포넌트에 상태 변경 알림
  useEffect(() => {
    onShowActionsChange?.(showActions);
  }, [showActions, onShowActionsChange]);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage && !disabled) {
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
        className={`transition-all duration-300 ease-in-out ${
          showActions ? "translate-y-0" : "translate-y-0"
        }`}
        style={{
          minHeight: showActions ? "200px" : "auto",
          maxHeight: showActions ? "calc(100vh - 100px)" : "auto",
        }}
      >
        <div
          className="bg-gray-300 px-4 pt-4 pb-6 flex flex-col items-center shadow-lg"
          style={{
            paddingBottom: showActions
              ? "calc(1.5rem + env(safe-area-inset-bottom))"
              : "1.5rem",
          }}
        >
          {/* Input Bar */}
          <div className="w-full flex items-center gap-3 mb-4">
            <button
              className="w-10 h-10 flex items-center justify-center text-3xl font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 leading-none"
              onClick={() => setShowActions((v) => !v)}
              disabled={disabled}
            >
              {showActions ? "×" : "+"}
            </button>

            <div
              className={`flex items-center bg-white rounded-2xl px-4 py-2 shadow-sm ${
                showActions ? "flex-1" : "flex-1 max-w-[calc(100%-120px)]"
              }`}
            >
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

          {/* Action Buttons */}
          {showActions && (
            <div className="flex justify-around w-full animate-slide-up pb-4">
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
