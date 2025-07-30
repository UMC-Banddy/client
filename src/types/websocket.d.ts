declare module "sockjs-client" {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: any);
    readyState: number;
    url: string;
    onopen: ((event: any) => void) | null;
    onclose: ((event: any) => void) | null;
    onmessage: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    close(code?: number, reason?: string): void;
    send(data: string): void;
  }
}

declare module "@stomp/stompjs" {
  export interface StompHeaders {
    [key: string]: string;
  }

  export interface StompFrame {
    command: string;
    headers: StompHeaders;
    body: string;
  }

  export interface StompSubscription {
    id: string;
    unsubscribe(): void;
  }

  export interface StompClient {
    connected: boolean;
    connectedVersion: string;
    active: boolean;

    activate(): void;
    deactivate(): Promise<void>;

    connect(
      headers?: StompHeaders,
      connectCallback?: (frame?: StompFrame) => void,
      errorCallback?: (error: string | StompFrame) => void
    ): void;

    disconnect(disconnectCallback?: () => void, headers?: StompHeaders): void;

    subscribe(
      destination: string,
      callback: (message: StompFrame) => void,
      headers?: StompHeaders
    ): StompSubscription;

    publish(destination: string, body?: string, headers?: StompHeaders): void;
    publish(options: {
      destination: string;
      body?: string;
      headers?: StompHeaders;
    }): void;

    send(destination: string, headers?: StompHeaders, body?: string): void;
  }

  export class Client implements StompClient {
    constructor(config?: any);
    connected: boolean;
    connectedVersion: string;
    active: boolean;

    activate(): void;
    deactivate(): Promise<void>;

    connect(
      headers?: StompHeaders,
      connectCallback?: (frame?: StompFrame) => void,
      errorCallback?: (error: string | StompFrame) => void
    ): void;

    disconnect(disconnectCallback?: () => void, headers?: StompHeaders): void;

    subscribe(
      destination: string,
      callback: (message: StompFrame) => void,
      headers?: StompHeaders
    ): StompSubscription;

    publish(destination: string, body?: string, headers?: StompHeaders): void;
    publish(options: {
      destination: string;
      body?: string;
      headers?: StompHeaders;
    }): void;

    send(destination: string, headers?: StompHeaders, body?: string): void;
  }

  export const VERSIONS: {
    V1_0: string;
    V1_1: string;
    V1_2: string;
    supportedVersions: () => string[];
  };

  export const Stomp: {
    over: (ws: any) => Client;
    client: typeof Client;
  };
}
