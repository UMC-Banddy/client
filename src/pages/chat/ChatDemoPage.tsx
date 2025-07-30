import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import { useChat } from "./hooks/useChat";
import { chatActions } from "@/store/chatStore";
import type { ChatMessage } from "@/types/chat";
import { webSocketService } from "@/services/WebSocketService";

const ChatDemoPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("1"); // 데모용 기본 채팅방 ID
  const [connectionStatus, setConnectionStatus] = useState("연결 안됨");
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([]);

  const {
    isConnected,
    currentRoomId,
    error,
    sendMessage: sendWebSocketMessage,
  } = useChat();

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
    setTestMessages(demoMessages);
  }, []);

  // WebSocket 연결 상태 모니터링
  useEffect(() => {
    const checkConnection = () => {
      if (webSocketService.isConnected()) {
        setConnectionStatus("연결됨");
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
        setTestMessages((prev) => [...prev, newMessage]);
      });
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      setConnectionStatus("연결 실패");
    }
  }, [roomId]);

  // 메시지 전송 테스트
  const sendTestMessage = useCallback(
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
        setTestMessages((prev) => [...prev, newMessage]);
      } else {
        alert("WebSocket이 연결되지 않았습니다.");
      }
    },
    [roomId]
  );

  const handleConfirmLeave = () => {
    if (webSocketService.isConnected()) {
      webSocketService.disconnect();
    }
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 연결 상태 표시 */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm">WebSocket 상태:</span>
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
            <span className="text-sm">채팅방: {roomId}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={testConnection}
              className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
            >
              연결 테스트
            </button>
            <button
              onClick={() =>
                setRoomId((prev) => (parseInt(prev) + 1).toString())
              }
              className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-700"
            >
              채팅방 변경
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-400 text-sm">오류: {error}</div>
        )}
      </div>

      {/* 채팅 헤더 */}
      <ChatHeader
        title="WebSocket 데모 채팅"
        onBack={() => setIsOpen(true)}
        onFlag={() => setSessionModalOpen(true)}
      />

      {/* 채팅 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessageList messages={testMessages} />
      </div>

      {/* 채팅 입력 바 */}
      <ChatInputBar
        onSendMessage={sendTestMessage}
        disabled={!webSocketService.isConnected()}
      />

      {/* 나가기 확인 모달 */}
      <Modal open={isOpen} setOpen={setIsOpen}>
        <div className="bg-white text-black p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-bold mb-4">채팅방 나가기</h3>
          <p className="mb-6">정말로 채팅방을 나가시겠습니까?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleConfirmLeave}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              나가기
            </button>
          </div>
        </div>
      </Modal>

      {/* 세션 선택 모달 */}
      <SessionSelectModal
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
      />
    </div>
  );
};

export default ChatDemoPage;
