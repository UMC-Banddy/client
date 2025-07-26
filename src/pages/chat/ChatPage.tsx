import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import FlagIcon from "@/assets/icons/chat/flag.svg";
import BlockIcon from "@/assets/icons/chat/block.svg";
import GetoutIcon from "@/assets/icons/chat/getout.svg";
import { useChat } from "./hooks/useChat";
import { chatActions } from "@/store/chatStore";
import type { ChatRoom } from "@/types/chat";

export default function ChatPage() {
  const navigate = useNavigate();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const {
    messages,
    currentRoom,
    isLoading,
    messagesEndRef,
    sendMessage,
    sendAudio,
    sendImage,
    sendCalendar,
    handleAudioPlay,
    loadMoreMessages,
    markMessageAsRead,
  } = useChat();

  // Initialize current room
  useEffect(() => {
    const defaultRoom: ChatRoom = {
      id: "1",
      name: "우리밴드 정상영업합니다",
      avatar: "/src/assets/images/profile1.png",
      lastMessage: "안녕하세요!",
      lastMessageTime: "AM 12:47",
      unreadCount: 0,
      isOnline: true,
    };

    chatActions.setCurrentRoom(defaultRoom);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSettings = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const handleReport = useCallback(() => {
    console.log("신고하기");
    setIsSettingsModalOpen(false);
  }, []);

  const handleBlock = useCallback(() => {
    console.log("차단하기");
    setIsSettingsModalOpen(false);
  }, []);

  const handleLeave = useCallback(() => {
    console.log("나가기");
    setIsSettingsModalOpen(false);
    navigate("/");
  }, [navigate]);

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleSendAudio = useCallback(
    (audioBlob: Blob) => {
      sendAudio(audioBlob);
    },
    [sendAudio]
  );

  const handleSendImage = useCallback(
    (imageFile: File) => {
      sendImage(imageFile);
    },
    [sendImage]
  );

  const handleSendCalendar = useCallback(() => {
    sendCalendar();
  }, [sendCalendar]);

  const handleLoadMore = useCallback(() => {
    loadMoreMessages();
  }, [loadMoreMessages]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName={currentRoom?.name || "우리밴드 정상영업합니다"}
        bandAvatar={currentRoom?.avatar || "/src/assets/images/profile1.png"}
        onBack={handleBack}
        onSettings={handleSettings}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider />
        <ChatMessageList
          messages={messages}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </div>

      <ChatInputBar
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onSendImage={handleSendImage}
        onSendCalendar={handleSendCalendar}
      />

      {/* Settings Modal */}
      <Modal open={isSettingsModalOpen} setOpen={setIsSettingsModalOpen}>
        <div className="bg-white rounded-[14px] p-4 min-w-[280px]">
          <div className="space-y-4">
            <button
              onClick={handleReport}
              className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img src={FlagIcon} alt="신고" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">신고</span>
            </button>

            <button
              onClick={handleBlock}
              className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img src={BlockIcon} alt="차단" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">차단</span>
            </button>

            <button
              onClick={handleLeave}
              className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img src={GetoutIcon} alt="나가기" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">나가기</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
