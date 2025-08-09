## Banddy 채팅 가이드 (Client)

본 문서는 Banddy 클라이언트에서 WebSocket(STOMP) + SockJS 기반 채팅을 사용하는 방법과 서버 OAS 스펙에 맞춘 REST/WS API 매핑, 구현 세부를 정리합니다.

### 1) 개요

- 실시간 통신: WebSocket 위 STOMP + SockJS 폴백
- 메시징 구조: pub/sub
  - 그룹 채팅: topic 브로드캐스트
  - 개인 채팅: queue 유니캐스트
- 상태: 안읽음 알림(`/user/queue/unread`), 읽음 처리(참가자별 timestamp 비교)

### 2) 핵심 개념

- WebSocket: 서버와 지속 연결 유지, 최초 핸드셰이크 이후 오버헤드 감소
- SockJS: 브라우저/네트워크 제약 시 폴백(웹소켓, xhr-streaming, xhr-polling)
- STOMP: 메시지 포맷/프레임 규격; 구독/전송 목적지 사용

### 3) 목적지(DESTINATION)

- 구독(SUBSCRIBE)
  - 그룹: `/topic/room/{roomId}`
  - 개인: `/user/queue/room/{roomId}`
  - 안읽음: `/user/queue/unread`
- 전송(SEND)
  - 메시지: `/app/chat/sendMessage/{roomId}`

### 4) 메시지 포맷 및 예시

- 전송 바디

```json
{
  "content": "안녕하세요!",
  "roomId": 42,
  "roomType": "GROUP", // PRIVATE | GROUP | BAND
  "receiverId": 23 // PRIVATE일 때 필수
}
```

- 수신: 정상 메시지(MESSAGE)

```json
{
  "type": "MESSAGE",
  "data": {
    "messageId": 184,
    "senderId": 23,
    "senderName": "채팅테스트2",
    "content": "안녕하세요!",
    "roomId": 42,
    "timestamp": "2025-08-08T04:09:17.77013405"
  }
}
```

- 수신: 안읽음 알림(UNREAD_MESSAGE)

```json
{
  "type": "UNREAD_MESSAGE",
  "data": {
    "senderId": 16,
    "roomId": 42,
    "content": "안녕하세요!",
    "timestamp": "2025-08-08T03:49:07.522807813"
  }
}
```

### 5) 연결 헤더(STOMP CONNECT)

```text
accept-version: 1.1,1.0
heart-beat: 10000,10000
Authorization: <ACCESS_TOKEN>
```

- 주의: WebSocket의 Authorization은 Bearer 접두어 없이 토큰 문자열만 전달
- REST 요청은 `Bearer <token>` 자동 부착(`src/api/API.ts` 인터셉터)

### 6) 클라이언트 구조 및 매핑

- 상수: `src/constants/index.ts`

  - `WEBSOCKET.SUBSCRIBE_GROUP(roomId) => /topic/room/{roomId}`
  - `WEBSOCKET.SUBSCRIBE_PRIVATE(roomId) => /user/queue/room/{roomId}`
  - `WEBSOCKET.SUBSCRIBE_UNREAD => /user/queue/unread`
  - `WEBSOCKET.SEND_MESSAGE(roomId) => /app/chat/sendMessage/{roomId}`
  - `CHAT.*` REST 엔드포인트 매핑(목록/생성/입장/퇴장/핀 등)

- 타입: `src/types/chat.ts`

  - `WebSocketSendMessage`에 `roomType`, `receiverId` 지원

- 서비스: `src/services/WebSocketService.ts`

  - 연결: `connect()` — STOMP 헤더(Authorization, heart-beat) 설정 후 activate
  - 구독: `subscribeToGroupRoom(roomId, onMessage)` / `subscribeToPrivateRoom(roomId, onMessage)` / `subscribeToUnread(onUnread)`
  - 전송: `sendMessage(roomId, content, roomType, receiverId?)`

- 훅: `src/pages/chat/hooks/useWebSocket.ts`

  - `joinRoom(roomId, roomType)` — 타입별 구독 분기
  - `sendMessage(content, roomType, receiverId?)`
  - 연결 시 `/user/queue/unread` 자동 구독(스토어 반영은 후속 작업)

- 훅: `src/pages/chat/hooks/useChat.ts`
  - `enterChatRoom(roomId, roomType)` — REST `join` → WS 구독 → 메시지 로드
  - `sendMessage(text, roomType, receiverId?)`
  - `getChatMessages()` 무한 스크롤(REST)

### 7) REST API(OAS) 매핑 요약

- 목록: GET `/api/chat/rooms` → `getChatRooms()`
- 그룹 생성: POST `/api/chat/rooms`(multipart) → `createGroupChat()`
- 그룹 수정: PATCH `/api/chat/rooms`(multipart) → `updateGroupChat()`
- 참여: POST `/api/chat/rooms/{roomId}/members/join` → `joinChatRoom()`
- 퇴장: POST `/api/chat/rooms/{roomId}/members/exit` → `leaveChatRoom()`
- 개인 생성/입장: POST `/api/chat/rooms/friends` → `createDirectChat()`
- 핀/해제: PATCH `/api/chat/rooms/pin|unpin` → `pinChatRoom()`, `unpinChatRoom()`
- 방 정보: GET `/api/chat/rooms/{roomId}` → `getChatRoomMembers()`(참가자 lastReadAt 포함)
- 메시지: GET `/api/chat/rooms/{roomId}/messages?cursor&limit` → `getChatMessages()`

### 8) 사용 예시(컴포넌트)

- 그룹 채팅 입장/전송

```ts
const { enterChatRoom, sendMessage } = useChat();
useEffect(() => {
  enterChatRoom("42", "GROUP");
}, []);
sendMessage("안녕하세요!", "GROUP");
```

- 개인 채팅 입장/전송

```ts
const { enterChatRoom, sendMessage } = useChat();
useEffect(() => {
  enterChatRoom("43", "PRIVATE");
}, []);
sendMessage("안녕하세요!", "PRIVATE", 23);
```

### 9) 안읽음/읽음 처리(클라이언트 전략)

- 안읽음: `/user/queue/unread` 수신 시 roomId별 카운트 증가(채팅방 목록 초기값 + 실시간 반영)
- 읽음:
  - 입장 시 `participantInfos.infos[*].timestamp`를 저장
  - 각 메시지 `timestamp`와 비교해 읽지 않은 인원 수 계산
  - (선택) 읽음 마크 전송/수신 엔드포인트가 확정되면 단일 WS 엔드포인트로 갱신 처리

### 10) 디버그/테스트

- 디버그 툴: `https://jiangxy.github.io/websocket-debug-tool/`
  - URL: `${VITE_API_BASE_URL}/ws` (SockJS는 http/https URL)
  - 헤더: `accept-version`, `heart-beat`, `Authorization: <token>`
  - SUBSCRIBE: `/topic/room/{roomId}` or `/user/queue/room/{roomId}` or `/user/queue/unread`
  - SEND: `/app/chat/sendMessage/{roomId}` + JSON 바디

### 11) 트러블슈팅

- 연결 실패: 토큰 만료/헤더 누락 여부 확인, 서버 CORS, SockJS 경로 확인(`/ws`)
- 구독 무반응: 목적지 경로 타입(topic/queue) 재확인, 구독 ID 중복/미해제 여부 확인
- 개인 채팅 전송 실패: `roomType: "PRIVATE"`, `receiverId` 포함 여부 확인
- 브로드캐스트 중복 수신: topic은 내 메시지도 수신됨(의도된 동작)

### 12) 참고 소스 경로

- `src/constants/index.ts`
- `src/types/chat.ts`
- `src/services/WebSocketService.ts`
- `src/pages/chat/hooks/useWebSocket.ts`
- `src/pages/chat/hooks/useChat.ts`
- `src/store/chatApi.ts`
