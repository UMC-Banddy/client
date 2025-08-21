import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePrivateChat } from "./hooks/usePrivateChat";
import ChatHeader from "./_components/ChatHeader";
import ChatDateDivider from "./_components/ChatDateDivider";
import ChatMessageList from "./_components/PrivateChatMessageList";
import ChatInputBar from "./_components/ChatInputBar";
import profile1Img from "@/assets/icons/profile/no_img.svg";
import type { ChatMessage as ChatMessageType, ChatRoomsResponse, ChatRoomInfo, MemberInfo } from "@/types/chat";
import { useCurrentUser } from "@/features/setting/hooks/useCurrentUser";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

interface ChatRoom {
  roomId: number;
  chatName: string;
  imageUrl: string | null;
  // 개인채팅의 경우 memberInfo (단수)
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
  roomType: "PRIVATE" | "GROUP" | "BAND" | "BAND-APPLICANT" | "BAND-MANAGER";
}

const PrivateChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL에서 roomId와 roomType 파라미터 읽기
  const urlRoomId = searchParams.get("roomId");
  const urlRoomType = searchParams.get("roomType");
  
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

  // 개인채팅방과 밴드 채팅방 필터링 (실제 API 응답 구조에 맞춤) - useMemo로 메모이제이션
  const privateChatRooms = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allRooms: any[] = [];
    
    ((chatRooms as ChatRoomsResponse)?.result?.chatRoomInfos || []).forEach((room: ChatRoomInfo) => {
      if (room.roomType === "PRIVATE" || room.roomType === "BAND-APPLICANT") {
        // 일반적인 채팅방 (PRIVATE, BAND-APPLICANT)
        allRooms.push({
          roomId: room.roomId,
          chatName: room.chatName,
          imageUrl: room.imageUrl,
          memberInfo: room.memberInfo,
          unreadCount: room.unreadCount || 0,
          lastMessageAt: room.lastMessageAt,
          roomType: room.roomType,
        });
      } else if (room.roomType === "BAND-MANAGER") {
        // BAND-MANAGER는 chatRoomInfo 배열을 평탄화
        console.log("🔍 BAND-MANAGER 처리:", room);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bandRoom = room as any;
        if (bandRoom.chatRoomInfo && Array.isArray(bandRoom.chatRoomInfo)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bandRoom.chatRoomInfo.forEach((chatRoom: any) => {
            allRooms.push({
              roomId: chatRoom.roomId,
              chatName: `${bandRoom.bandName} - ${chatRoom.session}`,
              imageUrl: bandRoom.bandImageUrl,
              memberInfo: chatRoom.memberInfo,
              memberInfos: [chatRoom.memberInfo],
              unreadCount: chatRoom.unreadCount || 0,
              lastMessageAt: chatRoom.lastMessageAt,
              roomType: "BAND-MANAGER",
              session: chatRoom.session,
              passFail: chatRoom.passFail,
            });
          });
        }
      }
    });
    
    return allRooms;
  }, [chatRooms]);

  // URL 파라미터가 있으면 바로 해당 채팅방으로 입장
  useEffect(() => {
    console.log("🔍 URL 파라미터 처리 시작:", {
      urlRoomId,
      urlRoomType,
      privateChatRoomsLength: privateChatRooms.length,
      currentRoomId
    });
    
    if (urlRoomId && urlRoomType && privateChatRooms.length > 0) {
      const roomId = parseInt(urlRoomId);
      console.log("🔍 채팅방 찾기 시도:", roomId);
      
      const room = privateChatRooms.find((r: ChatRoomInfo) => r.roomId === roomId);
      console.log("🔍 찾은 채팅방:", room);
      
      if (room && currentRoomId !== roomId) {
        console.log("🎯 URL 파라미터로 채팅방 입장:", roomId, "타입:", urlRoomType);
        enterChatRoom(roomId, room.roomType);
        handleEnterRoom(room);
      } else {
        if (!room) {
          console.error("❌ 해당 roomId의 채팅방을 찾을 수 없음:", roomId);
          console.log("❌ 현재 채팅방 목록:", privateChatRooms.map(r => ({ roomId: r.roomId, roomType: r.roomType })));
        } else if (currentRoomId === roomId) {
          console.log("ℹ️ 이미 해당 채팅방에 있음:", roomId);
        }
      }
    } else {
      if (!urlRoomId) console.log("ℹ️ urlRoomId 없음");
      if (!urlRoomType) console.log("ℹ️ urlRoomType 없음");
      if (privateChatRooms.length === 0) console.log("ℹ️ privateChatRooms가 비어있음");
    }
  }, [urlRoomId, urlRoomType, privateChatRooms, currentRoomId]); // enterChatRoom 제거, currentRoomId 추가

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
          memberInfos: room.memberInfos?.map((member: MemberInfo) => ({
            memberId: member.memberId,
            nickname: member.nickname,
            profileImageUrl: member.profileImageUrl,
            lastReadMessageId: member.lastReadMessageId || 0, // undefined인 경우 0으로 기본값 설정
          })),
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

  const { data: currentUser } = useCurrentUser();
  
  // ChatMessageList용 메시지 형식으로 변환
  const convertedMessages: ChatMessageType[] = messages.map((msg) => {
    const currentMemberId = currentUser?.memberId || 0;
    const isMyMessage = msg.senderId === currentMemberId;
    const showReadIndicator = shouldShowReadIndicator(msg);
    
    // 프로필 이미지 결정
    let avatar = profile1Img; // 기본값
    if (isMyMessage) {
      // 내 메시지인 경우 현재 사용자의 프로필 이미지 사용
      avatar = currentUser?.profileImageUrl || profile1Img;
    } else {
      // 상대방 메시지인 경우 현재 채팅방의 상대방 프로필 이미지 사용
      if (currentChatRoom?.memberInfo?.profileImageUrl) {
        avatar = currentChatRoom.memberInfo.profileImageUrl;
      } else if (currentChatRoom?.memberInfos && currentChatRoom.memberInfos.length > 0) {
        // memberInfos에서 상대방 찾기
        const otherMember = currentChatRoom.memberInfos.find(
          member => member.memberId !== currentMemberId
        );
        if (otherMember?.profileImageUrl) {
          avatar = otherMember.profileImageUrl;
        }
      }
    }
    
    console.log("🔄 메시지 변환:", {
      messageId: msg.messageId,
      senderId: msg.senderId,
      isMyMessage,
      showReadIndicator,
      isRead: msg.isRead,
      readBy: msg.readBy,
      avatar: avatar
    });
    
    return {
      id: msg.messageId.toString(),
      type: isMyMessage ? "me" : "other",
      name: msg.senderName,
      avatar: avatar, // 실제 프로필 이미지 사용
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
    console.log("🔍 채팅방 정보:", {
      roomId: room.roomId,
      roomType: room.roomType,
      chatName: room.chatName
    });
    
    await enterChatRoom(room.roomId, room.roomType);
    
    // 상대방 ID 설정 (개인채팅이므로 상대방은 1명)
    const currentMemberId = currentUser?.memberId || 0;
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
    } else if (room.roomType === "BAND-APPLICANT" || room.roomType === "BAND-MANAGER") {
      // 밴드 채팅방의 경우 API로 참가자 정보 조회
      try {
        console.log("🎸 밴드 채팅방 참가자 정보 조회 중...");
        const response = await API.get(API_ENDPOINTS.CHAT.ROOM_MEMBERS(room.roomId.toString()));
        const data = response.data;
        
        if (data.isSuccess && data.result?.participantInfos?.infos) {
          const participants = data.result.participantInfos.infos;
          console.log("👥 밴드 채팅방 참가자들:", participants);
          
          // 현재 사용자가 아닌 다른 참가자를 찾기
          const otherParticipant = participants.find(
            (participant: { memberId: number }) => participant.memberId !== currentMemberId
          );
          
          if (otherParticipant?.memberId) {
            setSelectedReceiverId(otherParticipant.memberId);
            console.log("✅ 밴드 채팅방 상대방 ID 설정 완료:", otherParticipant.memberId);
          } else {
            console.error("❌ 밴드 채팅방에서 상대방을 찾을 수 없음");
            console.error("❌ 현재 사용자 ID:", currentMemberId);
            console.error("❌ 참가자 목록:", participants);
            setSelectedReceiverId(null);
          }
        } else {
          console.error("❌ 밴드 채팅방 참가자 정보가 없습니다:", data);
          setSelectedReceiverId(null);
        }
      } catch (error) {
        console.error("❌ 밴드 채팅방 참가자 정보 조회 중 오류:", error);
        setSelectedReceiverId(null);
      }
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
      navigate(-1); // 채팅방 퇴장 후 뒤로가기
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

  // URL 파라미터가 있으면 채팅방 목록을 보여주지 않음
  // 채팅방이 선택되지 않은 경우 채팅방 목록 표시
  if (!currentRoomId && !urlRoomId) {
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

  // 뒤로가기 이벤트 처리
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentRoomId) {
        console.log("페이지 새로고침/닫기 감지, 채팅방 정리 중...");
        leaveChatRoom();
      }
    };

    const handlePopState = () => {
      if (currentRoomId) {
        console.log("뒤로가기 감지, 채팅방 정리 중...");
        leaveChatRoom();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentRoomId, leaveChatRoom]);

  // 컴포넌트 언마운트 시 채팅방 정리
  useEffect(() => {
    return () => {
      console.log("PrivateChatPage 언마운트, 채팅방 정리 중...");
      if (currentRoomId) {
        leaveChatRoom();
      }
    };
  }, [currentRoomId, leaveChatRoom]);

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
