import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import { useChat } from "./hooks/useChat";
import { chatActions } from "@/store/chatStore";
import type { ChatRoom, ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const navigate = useNavigate();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(true);

  const {
    messages,
    currentRoom,
    isLoading,
    sendMessage,
    sendImage,
    sendCalendar,
    loadMoreMessages,
  } = useChat();

  // Initialize current room and messages
  useEffect(() => {
    const defaultRoom: ChatRoom = {
      id: "1",
      name: "우리밴드 정상영업합니다",
      avatar: "/src/assets/images/profile1.png",
      lastMessage: `안녕하세요! 누룽지밴드입니다.

저희 밴드에 관심을 가져 주셔서 감사합니다. 아래 양식에 맞추어 메시지 보내주시면 감사드리겠습니다.

📅 지원 마감: 7/30
📅 합격자 발표: 8/1

📝 지원 양식:
• 이름, 나이, 연락처
• 거주 지역(시군구)
• 가능한 연습 요일
• SNS(선택사항)
• 지원 영상 or 녹음

📧 지원 영상/녹음은 banddy79@gmail.com으로 보내주세요!

❓ 문의사항이 있으면 이 채팅방에 남겨주시면 빠르게 확인하고 답장 드리겠습니다.

🎤 보컬 지원자 분들은 아래 오디션 곡 영상/녹음을 보내주세요!
⚠️ 노래방에서 부른 영상은 지양해주시면 감사드리겠습니다.

🎵 여자보컬
• (필수) 혜성 - 윤하
• (선택) 본인의 매력이 잘 드러나는 자유곡 1곡

🎵 남자보컬
• (필수) 겁쟁이 - 버즈
• (선택) 본인의 매력이 잘 드러나는 자유곡 1곡`,
      lastMessageTime: "AM 12:47",
      unreadCount: 0,
      isOnline: true,
    };

    chatActions.setCurrentRoom(defaultRoom);

    // Add initial message with unreadCount
    const initialMessage: ChatMessage = {
      id: "1",
      type: "other",
      name: "밴드",
      avatar: "/src/assets/images/profile1.png",
      text: `안녕하세요! 누룽지밴드입니다.

저희 밴드에 관심을 가져 주셔서 감사합니다. 아래 양식에 맞추어 메시지 보내주시면 감사드리겠습니다.

📅 지원 마감: 7/30
📅 합격자 발표: 8/1

📝 지원 양식:
• 이름, 나이, 연락처
• 거주 지역(시군구)
• 가능한 연습 요일
• SNS(선택사항)
• 지원 영상 or 녹음

📧 지원 영상/녹음은 banddy79@gmail.com으로 보내주세요!

❓ 문의사항이 있으면 이 채팅방에 남겨주시면 빠르게 확인하고 답장 드리겠습니다.

🎤 보컬 지원자 분들은 아래 오디션 곡 영상/녹음을 보내주세요!
⚠️ 노래방에서 부른 영상은 지양해주시면 감사드리겠습니다.

🎵 여자보컬
• (필수) 혜성 - 윤하
• (선택) 본인의 매력이 잘 드러나는 자유곡 1곡

🎵 남자보컬
• (필수) 겁쟁이 - 버즈
• (선택) 본인의 매력이 잘 드러나는 자유곡 1곡`,
      time: "오후 3:08",
      unreadCount: 1,
    };

    chatActions.setMessages([initialMessage]);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleReport = useCallback(() => {
    console.log("신고하기");
  }, []);

  const handleBlock = useCallback(() => {
    console.log("차단하기");
  }, []);

  const handleLeave = useCallback(() => {
    setIsLeaveConfirmOpen(true);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    console.log("채팅방 나가기 확인");
    navigate("/");
  }, [navigate]);

  const handleSessionConfirm = useCallback((selectedSession: string) => {
    console.log("선택된 세션:", selectedSession);
    setShowSessionModal(false);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
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

  const handleSendAudio = useCallback(
    (duration: number) => {
      // 오디오 메시지 생성 및 전송
      const audioMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "me",
        name: "나",
        avatar: "/src/assets/images/profile1.png",
        audio: {
          duration: duration,
          isPlaying: false,
          onPlay: () => {
            console.log("내 오디오 재생 시작:", duration, "초");
            // 실제 오디오 재생 로직은 여기에 구현
          },
        },
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        unreadCount: 0,
      };

      // 메시지 목록에 추가
      const currentMessages = messages || [];
      chatActions.setMessages([...currentMessages, audioMessage]);
    },
    [messages]
  );

  const handleLoadMore = useCallback(() => {
    loadMoreMessages();
  }, [loadMoreMessages]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName={currentRoom?.name || "우리밴드 정상영업합니다"}
        bandAvatar={currentRoom?.avatar || "/src/assets/images/profile1.png"}
        onBack={handleBack}
        onReport={handleReport}
        onBlock={handleBlock}
        onLeave={handleLeave}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider />
        <ChatMessageList
          messages={messages}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
        {/* 하단 여백 - 입력창 상태에 따라 동적 조정 */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showActions ? "h-32" : "h-4"
          }`}
        ></div>
      </div>

      {/* ChatInputBar를 고정 위치로 변경 */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <ChatInputBar
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onSendCalendar={handleSendCalendar}
          onSendAudio={handleSendAudio}
          onShowActionsChange={setShowActions}
        />
      </div>

      {/* Leave Confirmation Modal */}
      <Modal open={isLeaveConfirmOpen} setOpen={setIsLeaveConfirmOpen}>
        <div className="bg-gray-50 rounded-[20px] p-6 min-w-[320px] min-h-[220px] flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-black mb-3">채팅방 나가기</h2>
            <p className="text-black text-base">채팅방에서 나가시겠습니까?</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsLeaveConfirmOpen(false)}
              className="flex-1 py-3 px-4 rounded-[25px] font-medium transition-colors bg-gray-200 text-red-600 hover:bg-gray-300 min-w-[100px]"
            >
              아니오
            </button>
            <button
              onClick={handleConfirmLeave}
              className="flex-1 py-3 px-4 rounded-[25px] font-medium transition-colors bg-red-600 text-white hover:bg-red-700 min-w-[100px]"
            >
              예
            </button>
          </div>
        </div>
      </Modal>

      {/* 세션 선택 모달 */}
      <SessionSelectModal
        open={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={handleSessionConfirm}
      />
    </div>
  );
}
