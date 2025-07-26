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
import type { ChatMessage } from "@/types/chat";

export default function ChatDemoPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Demo messages from Figma design
  useEffect(() => {
    const demoMessages: ChatMessage[] = [
      {
        id: "1",
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        text: "안녕하세요 제 실력 먼저 보여드리죠",
        time: "AM 12:47",
      },
      {
        id: "2",
        type: "me",
        name: "Beck",
        avatar: "/src/assets/images/profile1.png",
        text: "안녕하세요 저는 Beck이에요 덤벼 ㅋㅋ",
        time: "AM 12:47",
      },
      {
        id: "3",
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        audio: {
          duration: 30,
          isPlaying: false,
          onPlay: () => console.log("Play audio"),
        },
        time: "AM 12:48",
      },
      {
        id: "4",
        type: "me",
        name: "Beck",
        avatar: "/src/assets/images/profile1.png",
        text: "와 칠 줄 아시네",
        time: "AM 12:52",
        unreadCount: 1,
      },
    ];

    setMessages(demoMessages);
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

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendAudio = useCallback((audioBlob: Blob) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      audio: {
        duration: 30,
        isPlaying: false,
        onPlay: () => console.log("Play audio"),
      },
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendImage = useCallback((imageFile: File) => {
    console.log("Image file:", imageFile);
  }, []);

  const handleSendCalendar = useCallback(() => {
    console.log("Calendar event creation");
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName="I'll kill you"
        bandAvatar="/src/assets/images/pierrot.png"
        onBack={handleBack}
        onSettings={handleSettings}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider date="2025.06.14" />
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
