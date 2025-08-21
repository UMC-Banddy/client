import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import { authStore } from "@/store/authStore";

import { chatActions } from "@/store/chatStore";
import { API_ENDPOINTS } from "@/constants";
import type { WebSocketMessage, WebSocketSendMessage } from "@/types/chat";

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body?: string;
}



class WebSocketService {
  private stompClient: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private unreadSubscription: StompSubscription | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private reconnectTimeoutRef: NodeJS.Timeout | null = null;
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private lastConnectionAttempt = 0;
  private connectionCooldown = 5000; // 5초 쿨다운

  constructor() {
    this.initClient();
  }

  private initClient() {
    // WS URL 결정: 로컬 개발 환경에서는 상대 경로 사용, 프로덕션에서는 전체 URL 사용
    const isLocalDev =
      import.meta.env.DEV && window.location.hostname === "localhost";

    let wsUrl: string;
    if (isLocalDev) {
      // 로컬 개발 환경: Vite 프록시를 통해 연결
      wsUrl = "/ws";
    } else {
      // 프로덕션 환경: 명시적 WS URL 또는 API BASE + /ws
      const explicitWsUrl = import.meta.env.VITE_WS_URL as string | undefined;
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://api.banddy.co.kr";
      wsUrl =
        explicitWsUrl && explicitWsUrl.length > 0
          ? explicitWsUrl
          : `${baseUrl}/ws`;
    }

    console.log(
      "WebSocket 연결 URL:",
      wsUrl,
      "환경:",
      isLocalDev ? "로컬 개발" : "프로덕션"
    );

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket", "xhr-streaming", "xhr-polling"],
          timeout: 5000,
          heartbeat: 25000,
        }),
      debug: (str: string) => {
        try {
          if (
            import.meta.env.DEV &&
            localStorage.getItem("STOMP_DEBUG") === "1"
          ) {
            console.log("STOMP Debug:", str);
          }
        } catch {
          // localStorage 접근 실패 시 무시
        }
      },
      // 라이브러리의 자동 재연결은 비활성화하고, 내부 handleReconnect 로직만 사용
      reconnectDelay: 0,
      heartbeatIncoming: 10000, // 서버 스펙에 맞게 조정
      heartbeatOutgoing: 10000, // 서버 스펙에 맞게 조정
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.stompClient) return;

    // 연결 성공 시
    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onConnect = (frame: Record<string, unknown>) => {
      console.log("WebSocket 연결 성공:", frame);
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.lastConnectionAttempt = Date.now();
      chatActions.setWebSocketConnected(true);

      // 연결 상태 주기적 체크 시작
      this.startConnectionCheck();
      
      // 연결 성공 즉시 unread 구독 시작
      try {
        this.subscribeToUnread((data) => {
          console.log("Unread 메시지 수신:", data);
          // 필요시 추가 처리 로직
        });
      } catch (error) {
        console.warn("Unread 구독 실패:", error);
      }
    };

    // 연결 실패 시
    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onStompError = (frame: Record<string, unknown>) => {
      console.error("STOMP 에러:", frame);
      this.isConnecting = false;
      chatActions.setWebSocketConnected(false);

      // 서버 에러가 아닌 클라이언트 에러인 경우에만 재연결 시도
      if ((frame.headers as Record<string, string>)?.message && !(frame.headers as Record<string, string>).message.includes("401")) {
        this.handleReconnect();
      }
    };

    // 웹소켓 에러 시
    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketError = (error: Record<string, unknown>) => {
      console.error("WebSocket 에러:", error);
      this.isConnecting = false;
      chatActions.setWebSocketConnected(false);

      // 네트워크 에러인 경우에만 재연결 시도
      if (error.type === "error" || error.type === "close") {
        this.handleReconnect();
      }
    };

    // 웹소켓 연결 종료 시
    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketClose = (event: Record<string, unknown>) => {
      console.log("WebSocket 연결 종료:", event);
      this.isConnecting = false;
      chatActions.setWebSocketConnected(false);

      // 정상 종료가 아닌 경우에만 재연결 시도
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };
  }

  private startConnectionCheck() {
    // 기존 체크 인터벌 정리
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    // 30초마다 연결 상태 체크
    this.connectionCheckInterval = setInterval(() => {
      if (
        this.stompClient &&
        !this.stompClient.connected &&
        this.stompClient.active
      ) {
        console.log("연결 상태 불일치 감지, 재연결 시도...");
        this.handleReconnect();
      }
    }, 30000);
  }

  private stopConnectionCheck() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  private handleReconnect() {
    // 쿨다운 체크
    const now = Date.now();
    if (now - this.lastConnectionAttempt < this.connectionCooldown) {
      console.log("재연결 쿨다운 중...");
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("최대 재연결 시도 횟수 초과");
      chatActions.setError(
        "연결을 복구할 수 없습니다. 페이지를 새로고침해주세요."
      );
      return;
    }

    if (this.isConnecting) {
      console.log("이미 연결 시도 중...");
      return;
    }

    // 기존 재연결 타이머 정리
    if (this.reconnectTimeoutRef) {
      clearTimeout(this.reconnectTimeoutRef);
    }

    this.reconnectAttempts++;
    this.isConnecting = true;
    this.lastConnectionAttempt = now;

    console.log(
      `재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    // 백오프 적용된 지연 시간
    const delay = Math.min(
      10000,
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    );

    this.reconnectTimeoutRef = setTimeout(() => {
      this.connect();
    }, delay);
  }

  async connect(): Promise<void> {
    // 쿨다운 체크
    const now = Date.now();
    if (now - this.lastConnectionAttempt < this.connectionCooldown) {
      throw new Error("연결 시도 쿨다운 중입니다.");
    }

    // 클라이언트 미생성 또는 이전에 inactive 상태면 재초기화
    if (!this.stompClient || (this.stompClient && !this.stompClient.active)) {
      this.initClient();
    }

    if (this.isConnecting) {
      throw new Error("이미 연결 시도 중입니다.");
    }

    return new Promise((resolve, reject) => {
      if (!this.stompClient) {
        reject(new Error("STOMP 클라이언트가 초기화되지 않았습니다."));
        return;
      }

      this.isConnecting = true;

      // 접속 시 헤더 설정 (서버 스펙에 맞게)
      const token = (authStore.accessToken || "").trim();
      // @ts-expect-error 타입 정의에 없지만 런타임에서 지원됨
      this.stompClient.connectHeaders = {
        "accept-version": "1.1,1.0", // 서버가 지원하는 버전
        "heart-beat": "10000,10000", // 서버 스펙에 맞게 조정
        Authorization: token || "", // Bearer 접두사 제거 (서버가 토큰만 기대하는 경우)
      } as unknown as Record<string, string>;

      // @stomp/stompjs v7.1.1에서는 activate() 메서드 사용
      try {
        this.stompClient.activate();
      } catch (error) {
        // activate 중 throw되는 경우도 재연결 루프로 넘김
        this.isConnecting = false;
        this.handleReconnect();
        reject(error);
        return;
      }

      // 연결 성공을 기다림 (최대 10초)
      const maxWaitTime = 10000;
      const startTime = Date.now();

      const checkConnection = () => {
        if (this.stompClient?.connected) {
          this.isConnecting = false;
          resolve();
        } else if (
          this.stompClient?.active &&
          Date.now() - startTime < maxWaitTime
        ) {
          // active 상태이지만 아직 connected가 아닌 경우, 계속 대기
          setTimeout(checkConnection, 100);
        } else {
          this.isConnecting = false;
          reject(new Error("WebSocket 연결 시간 초과"));
        }
      };

      // 초기 연결 체크
      setTimeout(checkConnection, 100);
    });
  }

  disconnect(): void {
    // 재연결 타이머 정리
    if (this.reconnectTimeoutRef) {
      clearTimeout(this.reconnectTimeoutRef);
      this.reconnectTimeoutRef = null;
    }

    // 연결 상태 체크 정리
    this.stopConnectionCheck();

    if (this.stompClient && this.stompClient.active) {
      // 모든 구독 해제
      this.unsubscribeAllRooms();
      this.unsubscribeUnread();

      // 연결 해제
      this.stompClient.deactivate().then(() => {
        console.log("WebSocket 연결 해제 완료");
        chatActions.setWebSocketConnected(false);
      });
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  // 그룹 채팅방 구독
  subscribeToGroupRoom(roomId: string, onMessage: (message: WebSocketMessage) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 이미 구독 중인 방이면 무시 (idempotent)
    if (this.subscriptions.has(roomId)) {
      console.log(`이미 ${roomId} 방에 구독 중입니다.`);
      return;
    }

    try {
      const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE_GROUP(roomId);
      const subscription = this.stompClient.subscribe(
        destination,
        (frame: StompFrame) => {
          try {
            const parsed = JSON.parse(frame.body || "");
            
            // MESSAGE 타입이고 data가 있는 경우만 처리
            if (parsed.type === "MESSAGE" && parsed.data) {
              const messageData = parsed.data;
              const payload: WebSocketMessage = {
                messageId: messageData.messageId,
                senderId: messageData.senderId,
                senderName: messageData.senderName,
                content: messageData.content,
                type: messageData.type || "TEXT",
                roomId: messageData.roomId,
                timestamp: messageData.timestamp
              };
              
              if (!payload.messageId) {
                console.warn("유효하지 않은 메시지 payload:", parsed);
                return;
              }
              
              console.log("실시간 메시지 수신:", payload);
              onMessage(payload);
            } else {
              console.warn("알 수 없는 메시지 형식:", parsed);
            }
          } catch (error) {
            console.error("메시지 파싱 에러:", error);
          }
        }
      );

      this.subscriptions.set(roomId, subscription);
      console.log(`그룹 채팅방 ${roomId} 구독 완료 (${destination})`);
    } catch (error) {
      console.error(`그룹 채팅방 ${roomId} 구독 실패:`, error);
      throw error;
    }
  }

  // 개인 채팅방 구독
  subscribeToPrivateRoom(roomId: string, onMessage: (message: WebSocketMessage) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 이미 구독 중인 방이면 무시 (idempotent)
    if (this.subscriptions.has(roomId)) {
      console.log(`이미 ${roomId} 방에 구독 중입니다.`);
      return;
    }

    try {
      const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE_PRIVATE(roomId);
      const subscription = this.stompClient.subscribe(
        destination,
        (frame: StompFrame) => {
          try {
            const parsed = JSON.parse(frame.body || "");
            
            // MESSAGE 타입이고 data가 있는 경우만 처리
            if (parsed.type === "MESSAGE" && parsed.data) {
              const messageData = parsed.data;
              const payload: WebSocketMessage = {
                messageId: messageData.messageId,
                senderId: messageData.senderId,
                senderName: messageData.senderName,
                content: messageData.content,
                type: messageData.type || "TEXT",
                roomId: messageData.roomId,
                timestamp: messageData.timestamp
              };
              
              if (!payload.messageId) {
                console.warn("유효하지 않은 메시지 payload:", parsed);
                return;
              }
              
              console.log("실시간 메시지 수신:", payload);
              onMessage(payload);
            } else {
              console.warn("알 수 없는 메시지 형식:", parsed);
            }
          } catch (error) {
            console.error("메시지 파싱 에러:", error);
          }
        }
      );

      this.subscriptions.set(roomId, subscription);
      console.log(`개인 채팅방 ${roomId} 구독 완료 (${destination})`);
    } catch (error) {
      console.error(`개인 채팅방 ${roomId} 구독 실패:`, error);
      throw error;
    }
  }

  // 안읽은 메시지(queue) 구독
  subscribeToUnread(onUnread: (data: unknown) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 이미 구독 중이면 무시 (idempotent)
    if (this.unreadSubscription) {
      console.log("이미 UNREAD 구독 중입니다.");
      return;
    }

    const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE_UNREAD;
    this.unreadSubscription = this.stompClient.subscribe(
      destination,
      (frame: StompFrame) => {
        try {
          const payload = JSON.parse(frame.body || "");
          console.log("UNREAD 수신:", payload);
          onUnread(payload);
        } catch (error) {
          console.error("UNREAD 파싱 에러:", error);
        }
      }
    );
    console.log(`안읽음 구독 시작 (${destination})`);
  }

  // 안읽음 구독 해제
  unsubscribeUnread(): void {
    if (this.unreadSubscription) {
      try {
        this.unreadSubscription.unsubscribe();
        this.unreadSubscription = null;
        console.log("안읽음 구독 해제 완료");
      } catch (error) {
        console.warn("안읽음 구독 해제 중 오류:", error);
        this.unreadSubscription = null;
      }
    }
  }

  // 특정 채팅방 구독 해제
  unsubscribeFromRoom(roomId: string) {
    const subscription = this.subscriptions.get(roomId);

    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(roomId);
        console.log(`채팅방 ${roomId} 구독 해제 완료`);
      } catch (error) {
        console.warn(`채팅방 ${roomId} 구독 해제 중 오류:`, error);
        // 오류가 발생해도 Map에서 제거
        this.subscriptions.delete(roomId);
      }
    }
  }

  // 모든 채팅방 구독 해제
  unsubscribeAllRooms() {
    this.subscriptions.forEach((subscription, key) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn(`채팅방 ${key} 구독 해제 중 오류:`, error);
      }
      console.log(`채팅방 ${key} 구독 해제 완료`);
    });
    this.subscriptions.clear();
  }

  // 메시지 전송 (서버 스펙에 맞게 수정)
  sendMessage(
    roomId: string,
    content: string,
    roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER",
    receiverId?: number
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 서버 스펙에 맞는 destination 형식: /app/chat/sendMessage/{roomId}
    const destination = `/app/chat/sendMessage/${roomId}`;

    // 서버가 기대하는 메시지 형식
    let messageBody: Record<string, unknown>;
    
    if (roomType === "PRIVATE" || roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER") {
      // 개인 채팅 형식
      messageBody = {
        receiverId,
        content,
        roomType: roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER" ? "BAND" : "PRIVATE"
      };
    } else {
      // 그룹 채팅 형식
      messageBody = {
        content,
        roomType: "GROUP"
      };
    }

    try {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(messageBody),
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
      console.log("메시지 전송:", { destination, body: messageBody });
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
      throw error;
    }
  }

  // 읽음 상태 전송 함수 (roomType에 따라 목적지 분기)
  sendLastRead(
    roomId: string,
    messageId: number,
    roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER"
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    let destination: string;
    if (
      roomType === "PRIVATE" ||
      roomType === "BAND-APPLICANT" ||
      roomType === "BAND-MANAGER"
    ) {
      destination = `/app/chat/private.lastRead/${roomId}`;
    } else {
      destination = `/app/chat/group.lastRead/${roomId}`;
    }

    try {
      this.stompClient.publish({
        destination,
        body: messageId.toString(),
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      });
      console.log("마지막 읽음 전송:", { roomId, messageId, roomType });
    } catch (error) {
      console.error("읽음 상태 전송 중 오류:", error);
    }
  }

  // 읽음 상태 전송 함수 (usePrivateChat에서 사용)
  sendReadStatus(roomId: string, messageId: number): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    const destination = `/app/chat/private.readStatus/${roomId}`;

    this.stompClient.publish({
      destination,
      body: messageId.toString(),
      headers: {
        "content-type": "text/plain;charset=UTF-8",
      },
    });
    console.log("읽음 상태 전송:", { roomId, messageId });
  }

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  getCurrentSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }
}

// 싱글톤 인스턴스
export const webSocketService = new WebSocketService();
export default webSocketService;
