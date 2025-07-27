import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
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
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 부모 컴포넌트에 상태 변경 알림
  useEffect(() => {
    onShowActionsChange?.(showActions);
  }, [showActions, onShowActionsChange]);

  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

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
    setShowAudioModal(true);
  };

  const handleStartRecording = () => {
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
  };

  const handleStopRecording = () => {
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
  };

  const handleSendRecording = () => {
    // 녹음 파일 전송 로직
    console.log("녹음 파일 전송:", recordingTime, "초");
    setShowSendConfirmModal(false);
    setRecordingTime(0);
  };

  const handleCancelRecording = () => {
    setShowSendConfirmModal(false);
    setRecordingTime(0);
  };

  const handleFileUpload = () => {
    audioFileInputRef.current?.click();
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  const handleSendAudio = () => {
    if (audioFile) {
      // 오디오 파일 전송 로직
      console.log("오디오 파일 전송:", audioFile);
      setAudioFile(null);
      setShowAudioModal(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

      {/* Hidden file inputs */}
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
              <h3 className="ml-2 text-lg font-semibold text-gray-800">음성</h3>
            </div>

            {/* Recording Section */}
            {!audioFile && (
              <div className="space-y-3">
                <button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-full py-4 px-2 rounded-xl text-left transition-all ${
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
                  className="w-full py-4 px-2 rounded-xl text-left text-gray-800 hover:text-gray-600 transition-all"
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
