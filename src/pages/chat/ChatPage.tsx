import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import type { ChatMessage } from "@/types/chat";
import profile1Img from "@/assets/images/profile1.png";
import { useChat } from "./hooks/useChat";

export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // 실사용 훅 연결
  const { messages, isLoading, enterChatRoom, sendMessage, loadMoreMessages } =
    useChat();

  // Initialize current room and messages
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    const roomTypeParam = (searchParams.get("roomType") || "GROUP") as
      | "GROUP"
      | "PRIVATE"
      | "BAND";
    if (roomId) {
      // REST join + WS subscribe + 메시지 로드
      enterChatRoom(roomId, roomTypeParam);
    }
  }, [searchParams, enterChatRoom]);

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

  // 데모용 단방향 메시지 전송
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const roomTypeParam = (searchParams.get("roomType") || "GROUP") as
        | "GROUP"
        | "PRIVATE"
        | "BAND";
      const receiverIdParam = searchParams.get("receiverId");
      const receiverId = receiverIdParam ? Number(receiverIdParam) : undefined;
      // 훅을 통해 WS 전송 + 낙관적 추가는 훅 내부 처리
      sendMessage(text, roomTypeParam, receiverId);
    },
    [searchParams, sendMessage]
  );

  // 데모용 이미지 전송
  const handleSendImage = useCallback((imageFile: File) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: profile1Img,
      text: `📷 이미지: ${imageFile.name}`,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      unreadCount: 0,
    };

    setMessages((prev) => [...prev, newMessage]);
    console.log("이미지 전송됨:", imageFile.name);
  }, []);

  // 데모용 캘린더 전송
  const handleSendCalendar = useCallback(() => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: profile1Img,
      text: "📅 연습 일정을 확인해주세요!",
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      unreadCount: 0,
    };

    setMessages((prev) => [...prev, newMessage]);
    console.log("캘린더 전송됨");
  }, []);

  // 데모용 오디오 전송
  const handleSendAudio = useCallback((duration: number) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: profile1Img,
      audio: {
        duration: duration,
        isPlaying: false,
        onPlay: () => {
          console.log("내 오디오 재생 시작:", duration, "초");
        },
      },
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      unreadCount: 0,
    };

    setMessages((prev) => [...prev, newMessage]);
    console.log("오디오 전송됨:", duration, "초");
  }, []);

  // 데모용 더 많은 메시지 로드 (실제로는 아무것도 하지 않음)
  const handleLoadMore = useCallback(() => {
    console.log("더 많은 메시지 로드 시도 (데모에서는 아무것도 하지 않음)");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName={currentRoom?.roomName || "우리밴드 정상영업합니다"}
        bandAvatar={currentRoom?.roomImage || profile1Img}
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
