import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import { chatActions } from "@/store/chatStore";
import type { ChatMessage } from "@/types/chat";
import { webSocketService } from "@/services/WebSocketService";

export default function ChatDemoPage() {
  const navigate = useNavigate();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [roomId, setRoomId] = useState("1"); // 데모용 기본 채팅방 ID
  const [connectionStatus, setConnectionStatus] = useState("연결 안됨");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데모용 초기 메시지
  useEffect(() => {
    const demoMessages: ChatMessage[] = [
      {
        id: "1",
        type: "other",
        name: "시스템",
        avatar: "/api/placeholder/40/40",
        text: "WebSocket 데모 채팅방에 오신 것을 환영합니다!",
        time: new Date().toLocaleTimeString(),
      },
      {
        id: "2",
        type: "other",
        name: "시스템",
        avatar: "/api/placeholder/40/40",
        text: "메시지를 입력하고 전송해보세요.",
        time: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(demoMessages);
  }, []);

  // WebSocket 연결 상태 모니터링
  useEffect(() => {
    const checkConnection = () => {
      if (webSocketService.isConnected()) {
        setConnectionStatus("연결됨");
        setError(null);
      } else {
        setConnectionStatus("연결 안됨");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket 연결 테스트
  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus("연결 중...");
      setError(null);
      await webSocketService.connect();
      setConnectionStatus("연결 성공!");

      // 채팅방 구독
      webSocketService.subscribeToRoom(roomId, (message) => {
        const newMessage: ChatMessage = {
          id: message.messageId.toString(),
          type: "other",
          name: message.senderName,
          avatar: "/api/placeholder/40/40",
          text: message.content,
          time: new Date(message.timestamp).toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      });
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      setConnectionStatus("연결 실패");
      setError("WebSocket 연결에 실패했습니다.");
    }
  }, [roomId]);

  // 연결 상태 표시
  useEffect(() => {
    if (error) {
      setShowConnectionStatus(true);
      const timer = setTimeout(() => setShowConnectionStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    if (webSocketService.isConnected()) {
      webSocketService.disconnect();
    }
    setIsLeaveConfirmOpen(false);
    navigate("/");
  }, [navigate]);

  const handleSessionConfirm = useCallback((selectedSession: string) => {
    console.log("선택된 세션:", selectedSession);
    setShowSessionModal(false);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (webSocketService.isConnected()) {
        webSocketService.sendMessage(roomId, text);

        // 로컬 메시지 추가 (낙관적 업데이트)
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "me",
          name: "나",
          avatar: "/api/placeholder/40/40",
          text,
          time: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      } else {
        alert("WebSocket이 연결되지 않았습니다.");
      }
    },
    [roomId]
  );

  const handleSendImage = useCallback((imageFile: File) => {
    console.log("이미지 전송:", imageFile);
    // 데모용 이미지 메시지 추가
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: "/api/placeholder/40/40",
      image: URL.createObjectURL(imageFile),
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendCalendar = useCallback(() => {
    console.log("캘린더 이벤트 생성");
    // 데모용 캘린더 메시지 추가
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: "/api/placeholder/40/40",
      text: "캘린더 이벤트가 생성되었습니다.",
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSendAudio = useCallback((duration: number) => {
    // 데모용 오디오 메시지 생성
    const audioMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "나",
      avatar: "/api/placeholder/40/40",
      audio: {
        duration: duration,
        isPlaying: false,
        onPlay: () => {
          console.log("내 오디오 재생 시작:", duration, "초");
        },
      },
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, audioMessage]);
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // 데모용 로딩 시뮬레이션
    setTimeout(() => {
      const oldMessages: ChatMessage[] = [
        {
          id: "old-1",
          type: "other",
          name: "시스템",
          avatar: "/api/placeholder/40/40",
          text: "이전 메시지입니다.",
          time: new Date(Date.now() - 86400000).toLocaleTimeString(),
        },
      ];
      setMessages((prev) => [...oldMessages, ...prev]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      {/* WebSocket 연결 상태 표시 */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">WebSocket 상태:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                connectionStatus === "연결됨"
                  ? "bg-green-600"
                  : connectionStatus === "연결 중..."
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {connectionStatus}
            </span>
            <span className="text-sm text-white">채팅방: {roomId}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={testConnection}
              className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 text-white"
            >
              연결 테스트
            </button>
            <button
              onClick={() =>
                setRoomId((prev) => (parseInt(prev) + 1).toString())
              }
              className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-700 text-white"
            >
              채팅방 변경
            </button>
          </div>
        </div>
      </div>

      <ChatHeader
        bandName="WebSocket 데모 채팅"
        bandAvatar="/api/placeholder/40/40"
        onBack={handleBack}
        onReport={handleReport}
        onBlock={handleBlock}
        onLeave={handleLeave}
      />

      {/* 연결 상태 표시 */}
      {showConnectionStatus && error && (
        <div className="bg-red-500 text-white px-4 py-2 text-center text-sm">
          {error}
        </div>
      )}

      {/* WebSocket 연결 상태 표시 */}
      {connectionStatus !== "연결됨" && (
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
          disabled={connectionStatus !== "연결됨"}
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
