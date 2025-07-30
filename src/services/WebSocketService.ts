import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { chatActions } from "@/store/chatStore";
import { API_ENDPOINTS } from "@/constants";
import type { WebSocketMessage, WebSocketSendMessage } from "@/types/chat";

class WebSocketService {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, any> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초
  private isConnecting = false;

  constructor() {
    this.initClient();
  }

  private initClient() {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    // SockJS는 HTTP URL을 사용해야 함 (ws://로 변환하지 않음)
    const wsUrl = baseUrl + "/ws";

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str: string) => {
        if (import.meta.env.DEV) {
          console.log("STOMP Debug:", str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.stompClient) return;

    // @ts-ignore - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onConnect = (frame: any) => {
      console.log("WebSocket 연결 성공:", frame);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      chatActions.setWebSocketConnected(true);
      chatActions.setError(null);
    };

    // @ts-ignore - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onStompError = (frame: any) => {
      console.error("STOMP 에러:", frame);
      chatActions.setError("WebSocket 연결 에러가 발생했습니다.");
      this.handleReconnect();
    };

    // @ts-ignore - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketError = (error: any) => {
      console.error("WebSocket 에러:", error);
      chatActions.setError("WebSocket 연결이 끊어졌습니다.");
      this.handleReconnect();
    };

    // @ts-ignore - STOMP 클라이언트의 이벤트 핸들러들
    this.stompClient.onWebSocketClose = () => {
      console.log("WebSocket 연결 종료");
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

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  async connect(): Promise<void> {
    if (!this.stompClient || this.isConnecting) return;

    return new Promise((resolve, reject) => {
      if (!this.stompClient) {
        reject(new Error("STOMP 클라이언트가 초기화되지 않았습니다."));
        return;
      }

      this.isConnecting = true;

      this.stompClient.connect(
        {},
        () => {
          this.isConnecting = false;
          resolve();
        },
        (error: any) => {
          this.isConnecting = false;
          console.error("WebSocket 연결 실패:", error);
          reject(error);
        }
      );
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // 연결 해제
      this.stompClient.disconnect(() => {
        console.log("WebSocket 연결 해제 완료");
        chatActions.setWebSocketConnected(false);
      });
    }
  }

  subscribeToRoom(
    roomId: string,
    onMessage: (message: WebSocketMessage) => void
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    // 기존 구독이 있다면 해제
    this.unsubscribeFromRoom(roomId);

    const destination = API_ENDPOINTS.WEBSOCKET.SUBSCRIBE(roomId);

    const subscription = this.stompClient.subscribe(
      destination,
      (frame: any) => {
        try {
          const message: WebSocketMessage = JSON.parse(frame.body);
          console.log("실시간 메시지 수신:", message);
          onMessage(message);
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
        }
      }
    );

    this.subscriptions.set(roomId, subscription);
    console.log(`채팅방 ${roomId} 구독 완료`);
  }

  unsubscribeFromRoom(roomId: string): void {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      console.log(`채팅방 ${roomId} 구독 해제 완료`);
    }
  }

  sendMessage(roomId: string, content: string): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return;
    }

    const destination = API_ENDPOINTS.WEBSOCKET.SEND_MESSAGE(roomId);
    const message: WebSocketSendMessage = {
      content,
      roomId: parseInt(roomId),
    };

    this.stompClient.send(destination, {}, JSON.stringify(message));
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
