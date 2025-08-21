import { useState, useCallback, useEffect, useRef } from "react";
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
import { useWebSocket } from "./hooks/useWebSocket";
// import { authStore } from "@/store/authStore"; // eslint 에러로 인해 임시 주석

export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [headerName, setHeaderName] = useState<string>("채팅");
  const [headerAvatar, setHeaderAvatar] = useState<string>(profile1Img);
  const [hasShownBotMessage, setHasShownBotMessage] = useState(false);

  // StrictMode 이중 마운트 방지
  const mountedOnceRef = useRef(false);
  const currentRoomIdRef = useRef<string | null>(null);
  const currentRoomTypeRef = useRef<string | null>(null);

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

  // WebSocket 훅에서 leaveRoom 가져오기
  const { leaveRoom } = useWebSocket();

  // Initialize current room and messages - roomId/roomType 변경 시에만 실행
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    const roomTypeParam = searchParams.get("roomType") as
      | "PRIVATE"
      | "GROUP"
      | "BAND-APPLICANT"
      | "BAND-MANAGER"
      | null;

    // roomId나 roomType이 변경되었을 때만 실행
    if (
      roomId !== currentRoomIdRef.current ||
      roomTypeParam !== currentRoomTypeRef.current
    ) {
      currentRoomIdRef.current = roomId;
      currentRoomTypeRef.current = roomTypeParam;

      if (roomId && roomTypeParam) {
        console.log(`채팅방 변경 감지: ${roomId} (${roomTypeParam})`);
        // REST join + WS subscribe + 메시지 로드
        enterChatRoom(roomId, roomTypeParam);
      }
    }

    // 컴포넌트 언마운트 시 정리 (더 안전하게)
    return () => {
      console.log("ChatPage 언마운트, 채팅방 정리 중...");
      // 비동기 함수를 동기적으로 처리
      try {
        exitChatRoom();
      } catch (error) {
        console.warn("ChatPage cleanup 중 오류:", error);
      }
    };
  }, [searchParams]); // searchParams만 의존성으로 사용

  // 뒤로가기 이벤트 처리 - 한 번만 등록
  useEffect(() => {
    if (mountedOnceRef.current) return; // StrictMode 이중 마운트 방지
    mountedOnceRef.current = true;

    const handleBeforeUnload = () => {
      console.log("페이지 새로고침/닫기, 채팅방 정리 중...");
      try {
        exitChatRoom();
      } catch (error) {
        console.warn("beforeunload cleanup 중 오류:", error);
      }
    };

    const handlePopState = () => {
      console.log("뒤로가기 감지, 구독만 해제 중...");
      try {
        // 뒤로가기 시에는 구독만 해제하고 채팅방을 나가지 않음
        leaveRoom();
      } catch (error) {
        console.warn("popstate 구독 해제 중 오류:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []); // 빈 의존성 배열

  // Header용 채팅방 정보 로드 + 첫 방문 봇 메시지
  useEffect(() => {
    const roomTypeParam = searchParams.get("roomType") as
      | "PRIVATE"
      | "GROUP"
      | "BAND-APPLICANT"
      | "BAND-MANAGER"
      | null;
    const roomId = searchParams.get("roomId");

    if (!roomId || !roomTypeParam) return;

    console.log(`채팅방 헤더 정보 로드 시작: ${roomId} (${roomTypeParam})`);

    // 첫 방문 봇 메시지 표시 (밴드 관련일 때만)
    if (
      (roomTypeParam === "BAND-APPLICANT" ||
        roomTypeParam === "BAND-MANAGER") &&
      !hasShownBotMessage &&
      messages.length === 0
    ) {
      setHasShownBotMessage(true);
    }

    // 채팅방 타입별 헤더 정보 로드
    const loadHeaderInfo = async () => {
      try {
        if (roomTypeParam === "PRIVATE") {
          // 개인 채팅방: 상대방 프로필 정보 로드
          await loadPrivateChatHeader(roomId);
        } else if (roomTypeParam === "GROUP") {
          // 그룹 채팅방: 그룹 정보 로드
          await loadGroupChatHeader(roomId);
        } else if (
          roomTypeParam === "BAND-APPLICANT" ||
          roomTypeParam === "BAND-MANAGER"
        ) {
          // 밴드 채팅방: 밴드 정보 로드
          await loadBandChatHeader(roomId, roomTypeParam);
        }
      } catch (error) {
        console.error("채팅방 헤더 정보 로드 실패:", error);
      }
    };

    loadHeaderInfo();
  }, [searchParams, hasShownBotMessage, messages.length]);

  // 개인 채팅방 헤더 정보 로드
  const loadPrivateChatHeader = async (roomId: string) => {
    try {
      console.log("개인 채팅방 헤더 정보 로드 중...");

      // 채팅방 멤버 정보 조회
      const res = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(roomId));
      const members =
        res?.data?.result?.memberInfos || res?.data?.memberInfos || [];

      // 상대방 정보 찾기 (현재 사용자 제외)
      // TODO: 현재 사용자 ID를 가져오는 방법 구현 필요
      // const currentUserId = authStore.user?.memberId;
      const otherMember = members.find(
        (member: { memberId: number }) => member.memberId !== 0
      ); // 임시로 0 제외

      if (otherMember) {
        const name = otherMember.nickname || "알 수 없음";
        const avatar = otherMember.profileImageUrl || headerAvatar;

        setHeaderName(name);
        setHeaderAvatar(avatar);

        console.log("개인 채팅방 헤더 설정:", { name, avatar });
      }
    } catch (error) {
      console.warn("개인 채팅방 헤더 정보 조회 실패:", error);
    }
  };

  // 그룹 채팅방 헤더 정보 로드
  const loadGroupChatHeader = async (roomId: string) => {
    try {
      console.log("그룹 채팅방 헤더 정보 로드 중...");

      // 그룹 채팅방 정보 조회 (ROOM_MEMBERS 엔드포인트 사용)
      const res = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(roomId));
      const roomInfo = res?.data?.result || res?.data || {};

      const name = roomInfo.chatName || roomInfo.name || "그룹 채팅방";
      const avatar = roomInfo.imageUrl || headerAvatar;

      setHeaderName(name);
      setHeaderAvatar(avatar);

      console.log("그룹 채팅방 헤더 설정:", { name, avatar });
    } catch (error) {
      console.warn("그룹 채팅방 헤더 정보 조회 실패:", error);
      // 기본값 설정
      setHeaderName("그룹 채팅방");
    }
  };

  // 밴드 채팅방 헤더 정보 로드
  const loadBandChatHeader = async (roomId: string, roomType: string) => {
    try {
      console.log("밴드 채팅방 헤더 정보 로드 중...");

      // 방 정보에서 bandId를 우선 시도 → 실패 시 모집 상세에서 추정
      const res = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(roomId));
      const bandId = res?.data?.result?.bandId ?? res?.data?.bandId;

      if (bandId) {
        try {
          // 밴드 상세 정보 조회
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

            addBandBotMessage(roomType, {
              profileImageUrl: avatar,
              description: intro,
            });
          }

          console.log("밴드 채팅방 헤더 설정:", { name, avatar });
          return;
        } catch (error) {
          console.warn("밴드 상세 정보 조회 실패:", error);
        }

        // 대체: 모집 상세 시도
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

            addBandBotMessage(roomType, {
              profileImageUrl: avatar,
              description: intro,
            });
          }

          console.log("모집 상세로 밴드 채팅방 헤더 설정:", { name, avatar });
        } catch (error) {
          console.warn("모집 상세 정보 조회 실패:", error);
        }
      }
    } catch (error) {
      console.warn("밴드 채팅방 헤더 정보 조회 실패:", error);
    }
  };

  const handleBack = useCallback(() => {
    try {
      leaveRoom(); // WebSocket 구독만 해제
      console.log("뒤로가기: 채팅방 구독 해제 완료");
    } catch (error) {
      console.warn("뒤로가기 구독 해제 중 오류:", error);
    } finally {
      navigate(-1); // 이전 화면으로 이동
    }
  }, [leaveRoom, navigate]);

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
