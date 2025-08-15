import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { authStore } from "@/store/authStore";

import { chatActions } from "@/store/chatStore";
import { API_ENDPOINTS } from "@/constants";
import type { WebSocketMessage, WebSocketSendMessage } from "@/types/chat";

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body?: string;
}

interface WebSocketError {
  message: string;
  type: string;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();
  private unreadSubscription: { unsubscribe: () => void } | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초
  private isConnecting = false;
  private lastErrorLogTime = 0;
  private errorLogIntervalMs = 5000;

  constructor() {
    this.initClient();
  }

  private initClient() {
    // WS URL 결정: VITE_WS_URL 우선 → VITE_API_BASE_URL + /ws → 상대경로 /ws
    const explicitWsUrl = import.meta.env.VITE_WS_URL as string | undefined;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const wsUrl =
      explicitWsUrl && explicitWsUrl.length > 0
        ? explicitWsUrl
        : `${baseUrl}/ws`;

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
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.stompClient) return;

    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onConnect = (frame: StompFrame) => {
      console.log("WebSocket 연결 성공:", frame);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      chatActions.setWebSocketConnected(true);
      chatActions.setError(null);
    };

    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onStompError = (frame: StompFrame) => {
      // 콘솔 스팸 방지를 위해 주기적으로만 출력
      const now = Date.now();
      if (now - this.lastErrorLogTime >= this.errorLogIntervalMs) {
        const message = frame?.headers?.message || "Unknown STOMP error";
        try {
          if (
            import.meta.env.DEV &&
            localStorage.getItem("STOMP_DEBUG") === "1"
          ) {
            console.warn(`STOMP ERROR: ${message}`);
          }
        } catch {
          // ignore
        }
        this.lastErrorLogTime = now;
      }
      chatActions.setError("WebSocket 연결 에러가 발생했습니다.");
      this.handleReconnect();
    };

    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketError = (error: WebSocketError) => {
      const now = Date.now();
      if (now - this.lastErrorLogTime >= this.errorLogIntervalMs) {
        try {
          if (
            import.meta.env.DEV &&
            localStorage.getItem("STOMP_DEBUG") === "1"
          ) {
            console.warn(`WebSocket ERROR: ${error?.message || "Unknown"}`);
          }
        } catch {
          // ignore
        }
        this.lastErrorLogTime = now;
      }
      chatActions.setError("WebSocket 연결이 끊어졌습니다.");
      this.handleReconnect();
    };

    // @ts-expect-error - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketClose = () => {
      try {
        if (
          import.meta.env.DEV &&
          localStorage.getItem("STOMP_DEBUG") === "1"
        ) {
          console.log("WebSocket 연결 종료");
        }
      } catch {
        // ignore
      }
      chatActions.setWebSocketConnected(false);
      this.subscriptions.clear();
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("최대 재연결 시도 횟수 초과");
      chatActions.setError(
        "연결을 복구할 수 없습니다. 페이지를 새로고침해주세요."
      );
      return;
    }

    if (this.isConnecting) return;

    this.reconnectAttempts++;
    this.isConnecting = true;

    console.log(
      `재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    // 서버 ERROR 프레임이 연속 발생할 때 콘솔 스팸 방지 및 백오프 적용
    const delay = Math.min(10000, this.reconnectDelay * this.reconnectAttempts);
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  async connect(): Promise<void> {
    // 클라이언트 미생성 또는 이전에 inactive 상태면 재초기화
    if (!this.stompClient || (this.stompClient && !this.stompClient.active)) {
      this.initClient();
    }
    if (this.isConnecting) return;

    return new Promise((resolve, reject) => {
      if (!this.stompClient) {
        reject(new Error("STOMP 클라이언트가 초기화되지 않았습니다."));
        return;
      }

      this.isConnecting = true;

      // 접속 시 헤더 설정 (Authorization, heart-beat 등)
      const token = (authStore.accessToken || "").trim();
      // @ts-expect-error 타입 정의에 없지만 런타임에서 지원됨
      this.stompClient.connectHeaders = {
        "accept-version": "1.2,1.1,1.0",
        "heart-beat": "4000,4000",
        Authorization: token ? `Bearer ${token}` : "",
      } as unknown as Record<string, string>;

      // @stomp/stompjs v7.1.1에서는 activate() 메서드 사용
      try {
        this.stompClient.activate();
      } catch {
        // activate 중 throw되는 경우도 재연결 루프로 넘김
        this.isConnecting = false;
        this.handleReconnect();
        return;
      }

      // 연결 성공을 기다림
      const checkConnection = () => {
        if (this.stompClient?.connected) {
          this.isConnecting = false;
          resolve();
        } else if (this.stompClient?.active) {
          // active 상태이지만 아직 connected가 아닌 경우
          setTimeout(checkConnection, 100);
        } else {
          this.isConnecting = false;
          reject(new Error("WebSocket 연결에 실패했습니다."));
        }
      };

      // 초기 연결 체크
      setTimeout(checkConnection, 100);
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // 연결 해제
      this.stompClient.deactivate().then(() => {
        console.log("WebSocket 연결 해제 완료");
        chatActions.setWebSocketConnected(false);
      });
    }
  }

  // 그룹 채팅방(topic) 구독
  subscribeToGroupRoom(
    roomId: string,
    onMessage: (message: WebSocketMessage) => void
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 기존 구독이 있다면 해제
    this.unsubscribeFromRoom(roomId);

    const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE_GROUP(roomId);

    const subscription = this.stompClient.subscribe(
      destination,
      (frame: StompFrame) => {
        try {
          const message: WebSocketMessage = JSON.parse(frame.body || "");
          console.log("실시간 메시지 수신:", message);
          onMessage(message);
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
        }
      }
    );

    this.subscriptions.set(roomId, subscription);
    console.log(`그룹 채팅방 ${roomId} 구독 완료 (${destination})`);
  }

  // 개인 채팅방(queue) 구독
  subscribeToPrivateRoom(
    roomId: string,
    onMessage: (message: WebSocketMessage) => void
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 기존 구독이 있다면 해제
    this.unsubscribeFromRoom(roomId);

    const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE_PRIVATE(roomId);

    const subscription = this.stompClient.subscribe(
      destination,
      (frame: StompFrame) => {
        try {
          const message: WebSocketMessage = JSON.parse(frame.body || "");
          console.log("실시간 메시지 수신:", message);
          onMessage(message);
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
        }
      }
    );

    this.subscriptions.set(roomId, subscription);
    console.log(`개인 채팅방 ${roomId} 구독 완료 (${destination})`);
  }

  // 안읽은 메시지(queue) 구독
  subscribeToUnread(onUnread: (data: unknown) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 기존 구독이 있다면 해제
    if (this.unreadSubscription) {
      this.unreadSubscription.unsubscribe();
      this.unreadSubscription = null;
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

  unsubscribeFromRoom(roomId: string): void {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      console.log(`채팅방 ${roomId} 구독 해제 완료`);
    }
  }

  sendMessage(
    roomId: string,
    content: string,
    roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP",
    receiverId?: number
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    const destination =
      roomType === "PRIVATE"
        ? API_ENDPOINTS.WEBSOCKET.SEND_MESSAGE_PRIVATE(roomId)
        : API_ENDPOINTS.WEBSOCKET.SEND_MESSAGE_GROUP(roomId);
    const message: WebSocketSendMessage = {
      content,
      roomId: parseInt(roomId, 10),
      roomType,
      receiverId: roomType === "PRIVATE" ? receiverId : undefined,
    };

    this.stompClient.publish({
      destination,
      body: JSON.stringify(message),
    });
    console.log("메시지 전송:", message);
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
