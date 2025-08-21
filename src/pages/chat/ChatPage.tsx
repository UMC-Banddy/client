import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/ChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import Modal from "@/shared/components/MuiDialog";
import SessionSelectModal from "./_components/SessionSelectModal";
import profile1Img from "@/assets/images/profile1.png";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { useChat } from "./hooks/useChat";

export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [headerName, setHeaderName] = useState<string>("채팅");
  const [headerAvatar, setHeaderAvatar] = useState<string>(profile1Img);
  const [hasShownBotMessage, setHasShownBotMessage] = useState(false);

  // 실사용 훅 연결
  const {
    messages,
    isLoading,
    enterChatRoom,
    sendMessage,
    loadMoreMessages,
    exitChatRoom,
    addBandBotMessage,
  } = useChat();

  // Initialize current room and messages
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    const roomTypeParam = (searchParams.get("roomType") || "GROUP") as
      | "PRIVATE"
      | "GROUP"
      | "BAND-APPLICANT"
      | "BAND-MANAGER";
    if (roomId) {
      // REST join + WS subscribe + 메시지 로드
      enterChatRoom(roomId, roomTypeParam);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log("ChatPage 언마운트, 채팅방 정리 중...");
      exitChatRoom();
    };
  }, [searchParams, enterChatRoom, exitChatRoom]);

  // 뒤로가기 이벤트 처리
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("페이지 새로고침/닫기, 채팅방 정리 중...");
      exitChatRoom();
    };

    const handlePopState = () => {
      console.log("뒤로가기 감지, 채팅방 정리 중...");
      exitChatRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [exitChatRoom]);

  // Header용 밴드 정보 로드 + 첫 방문 봇 메시지 (밴드 관련일 때만)
  useEffect(() => {
    const roomTypeParam = (searchParams.get("roomType") || "GROUP") as
      | "PRIVATE"
      | "GROUP"
      | "BAND-APPLICANT"
      | "BAND-MANAGER";
    const roomId = searchParams.get("roomId");

    // 밴드 관련 채팅방이 아니면 무시
    if (
      (roomTypeParam !== "BAND-APPLICANT" &&
        roomTypeParam !== "BAND-MANAGER") ||
      !roomId
    )
      return;

    // 첫 방문 봇 메시지 표시 (한 번만)
    if (!hasShownBotMessage && messages.length === 0) {
      setHasShownBotMessage(true);
    }

    // 방 정보에서 bandId를 우선 시도 → 실패 시 모집 상세에서 추정
    (async () => {
      try {
        const res = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(roomId));
        const bandId = res?.data?.result?.bandId ?? res?.data?.bandId;
        if (bandId) {
          try {
            const detail = await API.get(
              API_ENDPOINTS.BANDS.DETAIL(String(bandId))
            );
            const d = detail?.data?.result || detail?.data || {};
            const name = d?.bandName || d?.name || headerName;
            const avatar = d?.profileImageUrl || headerAvatar;
            if (name) setHeaderName(String(name));
            if (avatar) setHeaderAvatar(String(avatar));

            // 첫 방문 안내 메시지가 필요한 경우(목록이 비어있을 때만 로컬 삽입)
            if (!hasShownBotMessage && (!messages || messages.length === 0)) {
              // 밴드방 봇 메시지: 밴드 소유자가 설정한 소개문(없으면 기본 문구)
              const intro: string =
                d?.description ||
                "밴드 채팅방입니다. 밴드 멤버들과 소통해보세요.";

              addBandBotMessage(roomTypeParam, {
                profileImageUrl: avatar,
                description: intro,
              });
            }
            return;
          } catch {}
        }
        // 대체: 모집 상세 시도
        if (bandId) {
          try {
            const recruit = await API.get(
              API_ENDPOINTS.RECRUITMENT.DETAIL(String(bandId))
            );
            const r = recruit?.data?.result || {};
            const name = r?.name || headerName;
            const avatar = r?.profileImageUrl || headerAvatar;
            if (name) setHeaderName(String(name));
            if (avatar) setHeaderAvatar(String(avatar));

            // 첫 방문 안내 메시지가 필요한 경우
            if (!hasShownBotMessage && (!messages || messages.length === 0)) {
              const intro: string =
                r?.description ||
                "밴드 채팅방입니다. 밴드 멤버들과 소통해보세요.";

              addBandBotMessage(roomTypeParam, {
                profileImageUrl: avatar,
                description: intro,
              });
            }
          } catch {}
        }
      } catch {}
    })();
  }, [searchParams, messages, hasShownBotMessage, addBandBotMessage]);

  const handleBack = useCallback(() => {
    exitChatRoom();
    navigate(-1);
  }, [navigate, exitChatRoom]);

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
    exitChatRoom();
    navigate("/");
  }, [navigate, exitChatRoom]);

  const handleSessionConfirm = useCallback((selectedSession: string) => {
    console.log("선택된 세션:", selectedSession);
    setShowSessionModal(false);
  }, []);

  // 데모용 단방향 메시지 전송
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const roomTypeParam = (searchParams.get("roomType") || "GROUP") as
        | "PRIVATE"
        | "GROUP"
        | "BAND-APPLICANT"
        | "BAND-MANAGER";
      const receiverIdParam = searchParams.get("receiverId");
      const receiverId = receiverIdParam ? Number(receiverIdParam) : undefined;
      // 훅을 통해 WS 전송 + 낙관적 추가는 훅 내부 처리
      sendMessage(text, roomTypeParam, receiverId);
    },
    [searchParams, sendMessage]
  );

  // 데모 핸들러 제거 (실사용 시 불필요)

  // 데모용 더 많은 메시지 로드 (실제로는 아무것도 하지 않음)
  const handleLoadMore = useCallback(() => {
    loadMoreMessages();
  }, [loadMoreMessages]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName={headerName}
        bandAvatar={headerAvatar}
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
