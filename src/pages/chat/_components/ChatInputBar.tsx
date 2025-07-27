import React, { useState, useRef, useEffect } from "react";

interface ChatInputBarProps {
  onSendMessage?: (message: string) => void;
  onSendAudio?: (audioBlob: Blob) => void;
  onSendImage?: (imageFile: File) => void;
  onSendCalendar?: () => void;
  placeholder?: string;
  disabled?: boolean;
  onShowActionsChange?: (show: boolean) => void;
}

export default function ChatInputBar({
  onSendMessage,
  onSendAudio,
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
          className="bg-[#E9E9E9] px-4 pt-4 pb-6 flex flex-col items-center rounded-t-3xl shadow-lg"
          style={{
            paddingBottom: showActions
              ? "calc(1.5rem + env(safe-area-inset-bottom))"
              : "1.5rem",
          }}
        >
          {/* Input Bar */}
          <div className="w-full flex items-center gap-3 mb-4">
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 leading-none"
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

          {/* Action Buttons */}
          {showActions && (
            <div className="flex justify-around w-full animate-slide-up pb-4">
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
