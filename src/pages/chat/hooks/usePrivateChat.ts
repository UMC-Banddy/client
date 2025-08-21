import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { webSocketService } from "@/services/WebSocketService";
import { getChatRooms, getPriChatMessages } from "@/store/chatApi";
import type { WebSocketMessage } from "@/types/chat";
import { useCurrentUser } from "@/features/setting/hooks/useCurrentUser";

interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  roomId: number;
  isRead?: boolean; // 읽음 상태
  readBy?: number[]; // 누가 읽었는지 (memberId 배열)
}

// 읽음 처리 관련 타입
interface ParticipantInfo {
  memberId: number;
  nickname: string;
  imageUrl: string | null;
  lastReadMessageId: number;
}

interface ReadMessage {
  memberId: number;
  nickname: string;
  roomId: number;
  messageId: number;
}



interface SendMessageRequest {
  roomId: number;
  receiverId: number;
  content: string;
}

export const usePrivateChat = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // 읽음 처리 관련 상태
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [lastSentReadMessageId, setLastSentReadMessageId] = useState<number>(0);

  // 채팅방 목록 조회
  const { data: chatRooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
  });

  // WebSocket 연결 상태 감지
  useEffect(() => {
    const checkConnection = () => {
      const connected = webSocketService.isConnected();
      if (connected !== isConnected) {
        console.log("🔌 WebSocket 연결 상태 변경:", isConnected, "→", connected);
        setIsConnected(connected);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000); // 5초로 변경
    return () => clearInterval(interval);
  }, [isConnected]);

  // 채팅방 입장
  const enterChatRoom = useCallback(async (roomId: number) => {
    if (currentRoomId === roomId) {
      console.log("이미 같은 채팅방에 있습니다.");
      return;
    }
    
    console.log("🎯 채팅방 입장:", roomId);
    setIsLoading(true);
    
    try {
      // WebSocket 연결 상태 확인 (이미 연결되어 있으면 연결 시도하지 않음)
      if (!webSocketService.isConnected()) {
        console.log("🔌 WebSocket 연결 시도...");
        await webSocketService.connect();
      } else {
        console.log("✅ WebSocket 이미 연결됨");
      }

      // 이전 채팅방 구독 해제
      if (currentRoomId) {
        webSocketService.unsubscribeFromRoom(currentRoomId.toString());
      }

      // 새 채팅방 구독
      webSocketService.subscribeToPrivateRoom(roomId.toString(), (message: WebSocketMessage) => {
        console.log("💬 개인채팅 메시지 수신 (원본):", message);
        
        // WebSocket 메시지 구조 확인 및 파싱
        let parsedMessage: WebSocketMessage;
        
        // 메시지가 {type: 'MESSAGE', data: {...}} 형태인지 확인
        const messageWithType = message as WebSocketMessage & { type?: string; data?: WebSocketMessage | ReadMessage };
        if (messageWithType.type === "MESSAGE" && messageWithType.data) {
          parsedMessage = messageWithType.data as WebSocketMessage;
          console.log("📋 파싱된 메시지:", parsedMessage);
        } else if (messageWithType.type === "READ" && messageWithType.data) {
          // 읽음 상태 메시지 처리
          const readMessage = messageWithType.data as ReadMessage;
          handleReadMessage(readMessage);
          return;
        } else if (message.messageId && message.content) {
          // 직접 WebSocketMessage 형태인 경우
          parsedMessage = message;
          console.log("📋 직접 메시지:", parsedMessage);
        } else {
          console.warn("⚠️ 알 수 없는 메시지 구조:", message);
          return;
        }
        
        // 메시지 데이터 검증
        if (!parsedMessage || !parsedMessage.content) {
          console.warn("⚠️ 유효하지 않은 메시지:", parsedMessage);
          return;
        }

        console.log("📋 메시지 데이터:", parsedMessage);
        
        // 현재 사용자 ID 확인
        const currentMemberId = currentUser?.memberId || 0;
        console.log("🔍 API memberId:", currentUser?.memberId, "파싱된 ID:", currentMemberId, "메시지 발신자 ID:", parsedMessage.senderId);
        
        // 본인이 보낸 메시지인 경우 (서버 응답)
        if (parsedMessage.senderId === currentMemberId) {
          console.log("🔄 본인이 보낸 메시지 감지 (서버 응답)");
          
          // 낙관적 업데이트된 메시지를 실제 메시지로 교체
          setMessages(prev => {
            const updatedMessages = prev.map(msg => {
              // 임시 ID로 생성된 낙관적 메시지를 찾아서 실제 메시지로 교체
              if (msg.senderId === currentMemberId && 
                  msg.content === parsedMessage.content && 
                  isTemporaryId(msg.messageId)) { // 임시 ID인지 확인
                console.log("🔄 낙관적 메시지를 실제 메시지로 교체:", msg.messageId, "→", parsedMessage.messageId);
                return {
                  ...msg,
                  messageId: parsedMessage.messageId || msg.messageId,
                  senderName: parsedMessage.senderName || msg.senderName,
                  timestamp: parsedMessage.timestamp || msg.timestamp,
                };
              }
              return msg;
            });
            return updatedMessages;
          });
          return;
        }
        
        // 상대방이 보낸 메시지인 경우
        console.log("📨 상대방 메시지 추가:", parsedMessage);
        setMessages(prev => [...prev, parsedMessage]);
        
        // 메시지 자동 스크롤
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });

      // 기존 메시지 히스토리 로드
      try {
        console.log("📚 기존 메시지 히스토리 로드 시작...");
        const response = await getPriChatMessages(roomId.toString());
        console.log("📋 API 응답:", response);
        
        if (response?.result?.messages) {
          // API에서 받은 메시지를 올바른 순서로 정렬 (오래된 메시지가 위에, 최신 메시지가 아래에)
          const chatMessages: ChatMessage[] = response.result.messages
            .slice() // 원본 배열 복사
            .reverse() // 배열을 역순으로 정렬하여 오래된 메시지가 앞에 오도록
            .map((msg) => {
              // timestamp에 시간대 표시자 추가 (Z가 없으면 UTC로 가정)
              let normalizedTimestamp = msg.timestamp;
              if (normalizedTimestamp && !normalizedTimestamp.endsWith("Z")) {
                normalizedTimestamp = normalizedTimestamp + "Z";
              }
              
              return {
                messageId: msg.messageId,
                senderId: msg.senderId,
                senderName: msg.senderName,
                content: msg.content,
                timestamp: normalizedTimestamp,
                roomId: roomId,
                isRead: false, // 기존 메시지는 기본적으로 안읽음
                readBy: [], // 아직 아무도 읽지 않음
              };
            });

          console.log("📝 로드된 메시지 개수:", chatMessages.length);
          console.log("📝 첫 번째 메시지 (가장 오래된):", chatMessages[0]);
          console.log("📝 마지막 메시지 (가장 최신):", chatMessages[chatMessages.length - 1]);
          
          setMessages(chatMessages);
          
          // 참가자 정보 초기화 (임시로 현재 사용자 정보 설정)
          const currentMemberId = currentUser?.memberId || 0;
          const initialParticipants: ParticipantInfo[] = [
            {
              memberId: currentMemberId,
              nickname: "나",
              imageUrl: null,
              lastReadMessageId: 0
            }
          ];
          setParticipants(initialParticipants);
          
          console.log("✅ 메시지 히스토리 로드 완료:", {
            roomId,
            messagesCount: chatMessages.length,
            participants: initialParticipants
          });
        } else {
          console.warn("⚠️ 메시지 데이터가 없습니다:", response);
          setMessages([]);
        }
      } catch (error) {
        console.error("❌ 메시지 히스토리 로드 실패:", error);
        setMessages([]);
      }

      setCurrentRoomId(roomId);
      console.log("✅ 채팅방 입장 완료:", roomId);
    } catch (error) {
      console.error("❌ 채팅방 입장 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentRoomId, currentUser?.memberId]); // currentUser?.memberId 의존성 추가

  // 채팅방 퇴장
  const leaveChatRoom = useCallback(async () => {
    if (!currentRoomId) {
      console.log("퇴장할 채팅방이 없습니다.");
      return;
    }

    console.log("🚪 채팅방 퇴장:", currentRoomId);
    
    try {
      // WebSocket 구독 해제
      webSocketService.unsubscribeFromRoom(currentRoomId.toString());
      
      // 상태 초기화
      setCurrentRoomId(null);
      setMessages([]);
      setParticipants([]);
      setLastSentReadMessageId(0);
      
      console.log("✅ 채팅방 퇴장 완료:", currentRoomId);
    } catch (error) {
      console.error("❌ 채팅방 퇴장 실패:", error);
    }
  }, [currentRoomId]);

  // 메시지 전송
  const sendMessageMutation = useMutation({
    mutationFn: async ({ roomId, receiverId, content }: SendMessageRequest) => {
      console.log("🔄 sendMessageMutation.mutationFn 실행");
      console.log("📋 전송 파라미터:", { roomId, receiverId, content });
      
      try {
        webSocketService.sendMessage(roomId.toString(), content, "PRIVATE", receiverId);
        console.log("✅ webSocketService.sendMessage 호출 완료");
        return { roomId, content };
      } catch (error) {
        console.error("❌ webSocketService.sendMessage 에러:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("🎉 sendMessageMutation.onSuccess 실행");
      console.log("📤 전송된 메시지:", variables);
      
      // 낙관적 업데이트: 발신자가 자신의 메시지를 즉시 볼 수 있도록
      const currentMemberId = currentUser?.memberId || 0;
      const temporaryId = Date.now();
      console.log("✨ 낙관적 업데이트 - 임시 ID 생성:", temporaryId);
      
      const optimisticMessage: ChatMessage = {
        messageId: temporaryId, // 임시 ID (나중에 서버 ID로 교체됨)
        senderId: currentMemberId,
        senderName: "나", // 임시 이름
        content: variables.content,
        timestamp: new Date().toISOString(),
        roomId: variables.roomId,
        isRead: true, // 본인이 보낸 메시지는 자동으로 읽음 처리
        readBy: [currentMemberId], // 본인이 읽음
      };
      
      console.log("✨ 낙관적 업데이트 메시지:", optimisticMessage);
      setMessages(prev => {
        const updatedMessages = [...prev, optimisticMessage];
        console.log("📝 낙관적 업데이트 완료:", updatedMessages.length, "개 메시지");
        return updatedMessages;
      });
      
      // 메시지 전송 후 채팅방 목록 업데이트
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
    onError: (error) => {
      console.error("❌ sendMessageMutation.onError:", error);
    },
  });

  // 읽음 상태 전송 함수
  const sendReadStatus = useCallback((messageId: number, roomId?: number) => {
    // roomId가 제공되지 않으면 currentRoomId 사용, 둘 다 없으면 실패
    const targetRoomId = roomId || currentRoomId;
    const webSocketConnected = webSocketService.isConnected();
    
    console.log("🔍 읽음 상태 전송 시도:", {
      messageId,
      targetRoomId,
      currentRoomId,
      isConnected,
      webSocketConnected
    });
    
    // 임시 ID인 경우 전송하지 않음
    if (isTemporaryId(messageId)) {
      console.log("🔄 임시 ID 메시지 - 읽음 상태 전송 제외:", messageId);
      return;
    }
    
    if (!targetRoomId || !webSocketConnected) {
      console.warn("⚠️ 읽음 상태 전송 실패: 채팅방이 없거나 연결되지 않음", {
        targetRoomId,
        currentRoomId,
        isConnected,
        webSocketConnected
      });
      return;
    }

    // 중복 전송 방지
    if (messageId <= lastSentReadMessageId) {
      console.log("🔄 중복 전송 방지:", messageId, "<==", lastSentReadMessageId);
      return;
    }

    try {
      // WebSocket으로 읽음 상태 전송
      // 개인 채팅은 PRIVATE 목적지로 전송
      webSocketService.sendLastRead(
        targetRoomId.toString(),
        messageId,
        "PRIVATE"
      );
      setLastSentReadMessageId(messageId);
      console.log("📖 읽음 상태 전송 성공:", messageId, "roomId:", targetRoomId);
    } catch (error) {
      console.error("❌ 읽음 상태 전송 실패:", error);
    }
  }, [currentRoomId, isConnected, lastSentReadMessageId]);

  // 읽음 상태 수신 처리 함수
  const handleReadMessage = useCallback((readMessage: ReadMessage) => {
    console.log("📖 읽음 상태 수신:", readMessage);
    
    // 참가자 정보 업데이트
    setParticipants(prev => {
      const updated = prev.map(participant => 
        participant.memberId === readMessage.memberId
          ? { ...participant, lastReadMessageId: readMessage.messageId }
          : participant
      );
      
      // 참가자가 없으면 추가
      if (!prev.find(p => p.memberId === readMessage.memberId)) {
        updated.push({
          memberId: readMessage.memberId,
          nickname: readMessage.nickname,
          imageUrl: null,
          lastReadMessageId: readMessage.messageId
        });
      }
      
      console.log("📖 참가자 정보 업데이트:", updated);
      return updated;
    });
    
    // 메시지 읽음 상태 업데이트
    setMessages(prev => 
      prev.map(message => {
        if (message.messageId <= readMessage.messageId) {
          // 해당 메시지까지 읽음 처리
          const currentReadBy = message.readBy || [];
          const updatedReadBy = currentReadBy.includes(readMessage.memberId) 
            ? currentReadBy 
            : [...currentReadBy, readMessage.memberId];
          
          return {
            ...message,
            isRead: true,
            readBy: updatedReadBy
          };
        }
        return message;
      })
    );
    
    console.log("📖 메시지 읽음 상태 업데이트 완료:", readMessage.messageId);
  }, []);



  // 임시 ID 식별 함수 (Date.now()로 생성된 큰 숫자)
  const isTemporaryId = useCallback((messageId: number) => {
    return messageId > 1000000000000; // 13자리 이상의 숫자는 임시 ID
  }, []);

  // 안읽은 메시지 수 계산 함수
  const getUnreadCount = useCallback(() => {
    if (messages.length === 0) return 0;
    
    const currentMemberId = currentUser?.memberId || 0;
    const currentParticipant = participants.find(p => p.memberId === currentMemberId);
    
    if (!currentParticipant) return 0;
    
    // 임시 ID를 제외하고 실제 서버 ID만 사용
    const serverMessageIds = messages
      .filter(m => !isTemporaryId(m.messageId))
      .map(m => m.messageId);
    
    if (serverMessageIds.length === 0) return 0;
    
    const lastMessageId = Math.max(...serverMessageIds);
    return Math.max(0, lastMessageId - currentParticipant.lastReadMessageId);
  }, [messages, participants, isTemporaryId]);

  // 메시지 읽음 상태 확인 함수
  const isMessageRead = useCallback((message: ChatMessage) => {
    const currentMemberId = currentUser?.memberId || 0;
    
    // 본인이 보낸 메시지는 항상 읽음
    if (message.senderId === currentMemberId) {
      return true;
    }
    
    // 다른 사람이 보낸 메시지는 readBy 배열에 현재 사용자가 있으면 읽음
    return message.readBy?.includes(currentMemberId) || false;
  }, [currentUser?.memberId]);

  // 메시지별 읽음 표시 여부 확인 함수
  const shouldShowReadIndicator = useCallback((message: ChatMessage) => {
    const currentMemberId = currentUser?.memberId || 0;
    
    // 임시 ID인 경우 읽음 표시하지 않음 (서버 응답 대기 중)
    if (isTemporaryId(message.messageId)) {
      console.log("🔄 임시 ID 메시지 - 읽음 표시 제외:", message.messageId);
      return false;
    }
    
    console.log("🔍 shouldShowReadIndicator 체크:", {
      messageId: message.messageId,
      senderId: message.senderId,
      currentMemberId,
      isRead: message.isRead,
      readBy: message.readBy,
      participants: participants.map(p => ({ memberId: p.memberId, lastReadMessageId: p.lastReadMessageId }))
    });
    
    // 본인이 보낸 메시지는 상대방이 읽었는지 확인
    if (message.senderId === currentMemberId) {
      // 상대방이 읽었으면 "1" 표시하지 않음
      const otherParticipants = participants.filter(p => p.memberId !== currentMemberId);
      const shouldShow = otherParticipants.some(p => p.lastReadMessageId < message.messageId);
      console.log("📤 본인 메시지 읽음 표시:", shouldShow);
      return shouldShow;
    }
    
    // 다른 사람이 보낸 메시지는 내가 읽지 않았으면 "1" 표시
    const isRead = isMessageRead(message);
    const shouldShow = !isRead;
    console.log("📥 상대방 메시지 읽음 표시:", shouldShow, "isRead:", isRead);
    return shouldShow;
  }, [participants, isMessageRead, isTemporaryId, currentUser?.memberId]);

  // 메시지 전송 함수
  const sendMessage = useCallback((content: string, receiverId: number) => {
    if (!currentRoomId) {
      console.error("❌ 현재 채팅방이 없습니다.");
      return;
    }

    sendMessageMutation.mutate({
      roomId: currentRoomId,
      receiverId,
      content,
    });
  }, [currentRoomId, sendMessageMutation]);

  return {
    currentRoomId,
    messages,
    chatRooms,
    isConnected,
    isLoading: isLoading || roomsLoading,
    enterChatRoom,
    sendMessage,
    leaveChatRoom,
    messageEndRef,
    // 읽음 처리 관련 함수들
    sendReadStatus,
    getUnreadCount,
    participants,
    isMessageRead,
    shouldShowReadIndicator,
  };
};
