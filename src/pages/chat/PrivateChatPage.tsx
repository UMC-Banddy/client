import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivateChat } from "./hooks/usePrivateChat";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/PrivateChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import profile1Img from "@/assets/images/profile1.png";
import type { ChatMessage as ChatMessageType, ChatRoomsResponse, ChatRoomInfo, MemberInfo } from "@/types/chat";

interface ChatRoom {
  roomId: number;
  chatName: string;
  imageUrl: string | null;
  // 개인채팅의 경우 memberInfo (단수), 그룹채팅의 경우 memberInfos (복수)
  memberInfo?: {
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
    lastReadMessageId: number; // API 응답과 일치하도록 수정
  };
  memberInfos?: Array<{
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
    lastReadMessageId: number; // API 응답과 일치하도록 수정
  }>;
  unreadCount: number;
  lastMessageAt: string | null;
  roomType: "PRIVATE" | "GROUP" | "BAND";
}

const PrivateChatPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentRoomId,
    messages,
    chatRooms,
    isConnected,
    isLoading,
    enterChatRoom,
    sendMessage,
    leaveChatRoom,
    shouldShowReadIndicator,
  } = usePrivateChat();

  const [selectedReceiverId, setSelectedReceiverId] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);

  // 개인채팅방만 필터링 (실제 API 응답 구조에 맞춤) - useMemo로 메모이제이션
  const privateChatRooms = useMemo(() => {
    return ((chatRooms as ChatRoomsResponse)?.result?.chatRoomInfos || [])
      .filter((room: ChatRoomInfo) => room.roomType === "PRIVATE")
      .map((room: ChatRoomInfo) => ({
        roomId: room.roomId,
        chatName: room.chatName,
        imageUrl: room.imageUrl,
        memberInfo: room.memberInfo, // 개인채팅은 memberInfo 사용
        memberInfos: room.memberInfos,
        unreadCount: room.unreadCount || 0,
        lastMessageAt: room.lastMessageAt,
        roomType: "PRIVATE" as const,
      }));
  }, [chatRooms]);

  // 현재 채팅방 정보 찾기
  useEffect(() => {
    if (currentRoomId && privateChatRooms.length > 0) {
      const room = privateChatRooms.find((r: ChatRoomInfo) => r.roomId === currentRoomId);
      if (room) {
        // ChatRoomInfo를 ChatRoom으로 변환
        const convertedRoom: ChatRoom = {
          roomId: room.roomId,
          chatName: room.chatName,
          imageUrl: room.imageUrl,
          memberInfo: room.memberInfo,
          memberInfos: room.memberInfos,
          unreadCount: room.unreadCount || 0,
          lastMessageAt: room.lastMessageAt,
          roomType: room.roomType,
        };
        setCurrentChatRoom(convertedRoom);
      } else {
        setCurrentChatRoom(null);
      }
    }
  }, [currentRoomId, privateChatRooms]);

  // ChatMessageList용 메시지 형식으로 변환
  const convertedMessages: ChatMessageType[] = messages.map((msg) => {
    const currentMemberId = parseInt(localStorage.getItem("memberId") || "0");
    const isMyMessage = msg.senderId === currentMemberId;
    const showReadIndicator = shouldShowReadIndicator(msg);
    
    console.log("🔄 메시지 변환:", {
      messageId: msg.messageId,
      senderId: msg.senderId,
      isMyMessage,
      showReadIndicator,
      isRead: msg.isRead,
      readBy: msg.readBy
    });
    
    return {
      id: msg.messageId.toString(),
      type: isMyMessage ? "me" : "other",
      name: msg.senderName,
      avatar: profile1Img, // 기본 이미지 사용
      text: msg.content,
      time: new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // 읽음 상태에 따라 "1" 표시 제어
      showReadIndicator,
    };
  });

  const handleSendMessage = (text: string) => {
    console.log("🔘 전송 버튼 클릭됨");
    console.log("📝 입력된 메시지:", text);
    console.log("👤 선택된 수신자 ID:", selectedReceiverId);
    console.log("🔗 WebSocket 연결 상태:", isConnected);
    console.log("🏠 현재 채팅방 ID:", currentRoomId);

    if (!text.trim()) {
      console.warn("⚠️ 메시지가 비어있음");
      return;
    }

    if (!selectedReceiverId) {
      console.error("❌ 수신자 ID가 설정되지 않았습니다. 채팅방을 다시 선택해주세요.");
      alert("채팅방을 다시 선택해주세요.");
      return;
    }

    if (!isConnected) {
      console.warn("⚠️ WebSocket이 연결되지 않음");
      alert("연결 상태를 확인해주세요.");
      return;
    }

    console.log("📤 메시지 전송 시도...");
    sendMessage(text, selectedReceiverId);
    console.log("✅ 메시지 전송 완료 (UI 업데이트)");
  };

  const handleEnterRoom = async (room: ChatRoomInfo) => {
    if (!room || !room.roomId) {
      console.error("❌ 유효하지 않은 채팅방:", room);
      return;
    }
    
    console.log("🎯 채팅방 입장 시도:", room.roomId);
    await enterChatRoom(room.roomId);
    
    // 상대방 ID 설정 (개인채팅이므로 상대방은 1명)
    const currentMemberId = parseInt(localStorage.getItem("memberId") || "0");
    console.log("🔍 현재 사용자 ID:", currentMemberId);
    
    if (room.roomType === "PRIVATE") {
      // 개인채팅의 경우 memberInfo 사용
      console.log("👥 개인채팅 멤버 정보:", room.memberInfo);
      
      if (!room.memberInfo) {
        console.error("❌ 개인채팅 멤버 정보가 없습니다. 채팅방 정보:", room);
        console.error("❌ 현재 사용자 ID:", currentMemberId);
        return;
      }
      
      // 개인채팅에서는 memberInfo가 상대방 정보
      setSelectedReceiverId(room.memberInfo.memberId);
      console.log("✅ 상대방 ID 설정 완료:", room.memberInfo.memberId);
    } else {
      // 그룹채팅의 경우 memberInfos 사용
      console.log("👥 그룹채팅 멤버 정보:", room.memberInfos);
      
      if (!room.memberInfos || room.memberInfos.length === 0) {
        console.error("❌ 그룹채팅 멤버 정보가 없습니다. 채팅방 정보:", room);
        console.error("❌ 현재 사용자 ID:", currentMemberId);
        return;
      }
      
      const otherMember = room.memberInfos.find((member: MemberInfo) => member.memberId !== currentMemberId);
      console.log("🎯 찾은 상대방:", otherMember);
      
      if (otherMember?.memberId) {
        setSelectedReceiverId(otherMember.memberId);
        console.log("✅ 상대방 ID 설정 완료:", otherMember.memberId);
      } else {
        console.error("❌ 상대방을 찾을 수 없음. 채팅방 정보:", room);
        console.error("❌ 현재 사용자 ID:", currentMemberId);
        console.error("❌ 채팅방 멤버:", room.memberInfos);
        
        // memberId가 유효하지 않으면 경고만 표시하고 수신자 ID 설정하지 않음
        if (!currentMemberId || currentMemberId === 0) {
          console.error("❌ 현재 사용자 ID가 유효하지 않아 수신자 ID를 설정할 수 없습니다.");
          return;
        }
        
        // 하드코딩된 값 제거 - 상대방을 찾을 수 없으면 메시지 전송 불가
        console.error("❌ 상대방을 찾을 수 없어 메시지 전송이 불가능합니다.");
        setSelectedReceiverId(null);
      }
    }
  };

  const handleBack = () => {
    if (currentRoomId) {
      leaveChatRoom();
    } else {
      navigate(-1);
    }
  };

  const handleLoadMore = () => {
    // 무한 스크롤 로직 (필요시 구현)
    console.log("더 많은 메시지 로드");
  };

  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "00:00";
      }
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("시간 포맷 에러:", error);
      return "00:00";
    }
  };

  // 채팅방이 선택되지 않은 경우 채팅방 목록 표시
  if (!currentRoomId) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#121212]">
        <div className="w-full bg-[#181818] pb-6">
          <div className="flex items-center justify-between px-6 pt-8 pb-5 h-32">
            <button
              className="flex items-center justify-center w-16 h-16 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => navigate(-1)}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-white">개인채팅</span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {privateChatRooms.map((room) => (
                <div
                  key={room.roomId}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                  onClick={() => handleEnterRoom(room)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {room.chatName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{room.chatName}</h3>
                    <p className="text-sm text-gray-500">
                      {room.lastMessageAt ? formatTime(room.lastMessageAt) : "새로운 채팅방"}
                    </p>
                  </div>
                  {room.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {room.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName={currentChatRoom?.chatName || "개인채팅"}
        bandAvatar={currentChatRoom?.imageUrl || profile1Img}
        onBack={handleBack}
        onReport={() => console.log("신고하기")}
        onBlock={() => console.log("차단하기")}
        onLeave={() => {
          leaveChatRoom();
          navigate(-1);
        }}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider />
        <ChatMessageList
          messages={convertedMessages}
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
    </div>
  );
};

export default PrivateChatPage;
