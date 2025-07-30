import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import { useChat } from "./hooks/useChat";
import { chatActions } from "@/store/chatStore";
import type { ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);

  const {
    messages,
    currentRoom,
    isLoading,
    isConnected,
    currentRoomId,
    error,
    hasMoreMessages,
    enterChatRoom,
    exitChatRoom,
    sendMessage,
    sendImage,
    sendCalendar,
    loadMoreMessages,
  } = useChat();

  // URL 파라미터로 채팅방 입장
  useEffect(() => {
    if (roomId && roomId !== currentRoomId) {
      const enterRoom = async () => {
        try {
          await enterChatRoom(roomId);
        } catch (error) {
          console.error("채팅방 입장 실패:", error);
          // 에러 발생 시 이전 페이지로 이동
          navigate(-1);
        }
      };
      enterRoom();
    }
  }, [roomId, currentRoomId, enterChatRoom, navigate]);

  // 연결 상태 표시
  useEffect(() => {
    if (error) {
      setShowConnectionStatus(true);
      const timer = setTimeout(() => setShowConnectionStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 컴포넌트 언마운트 시 채팅방 나가기
  useEffect(() => {
    return () => {
      if (currentRoomId) {
        exitChatRoom();
      }
    };
  }, [currentRoomId, exitChatRoom]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // ... existing code ...

  const handleConfirmLeave = useCallback(async () => {
    try {
      await exitChatRoom();
      navigate("/");
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      // 에러가 발생해도 페이지 이동
      navigate("/");
    }
  }, [exitChatRoom, navigate]);

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
    if (hasMoreMessages) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, loadMoreMessages]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        roomName={currentRoom?.roomName || "채팅방"}
        bandAvatar={currentRoom?.roomImage}
        onBack={handleBack}
        onMenuClick={() => setIsLeaveConfirmOpen(true)}
      />

      {/* 연결 상태 표시 */}
      {showConnectionStatus && error && (
        <div className="bg-red-500 text-white px-4 py-2 text-center text-sm">
          {error}
        </div>
      )}

      {/* WebSocket 연결 상태 표시 */}
      {!isConnected && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm">
          연결 중... 실시간 채팅이 제한됩니다.
        </div>
      )}

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
          disabled={!isConnected}
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
