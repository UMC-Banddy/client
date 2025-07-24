# Chat Components

피그마 디자인을 기반으로 구현된 재사용 가능한 채팅 컴포넌트들입니다.

## 📁 파일 구조

```
src/pages/chat/
├── _components/
│   ├── ChatHeader.tsx          # 채팅 헤더 컴포넌트
│   ├── ChatMessageItem.tsx     # 개별 메시지 아이템 컴포넌트
│   ├── ChatMessageList.tsx     # 메시지 리스트 컴포넌트
│   ├── ChatInputBar.tsx        # 메시지 입력 바 컴포넌트
│   ├── ChatDateDivider.tsx     # 날짜 구분선 컴포넌트
│   └── ChatInputActions.tsx    # 입력 액션 버튼들
├── ChatPage.tsx                # 메인 채팅 페이지
├── ChatDemoPage.tsx            # 채팅 데모 페이지
└── README.md                   # 이 파일
```

## 🎯 주요 기능

### 1. ChatHeader

- 밴드 정보 표시 (이름, 아바타, 상태)
- 뒤로가기 및 설정 버튼
- 모바일 상태바 표시 (옵션)

### 2. ChatMessageItem

- 텍스트 메시지 표시
- 오디오 메시지 재생 기능
- 읽지 않은 메시지 카운트
- 사용자별 아바타 및 이름 표시

### 3. ChatMessageList

- 메시지 스크롤 및 자동 스크롤
- 무한 스크롤 (이전 메시지 로드)
- 로딩 상태 표시

### 4. ChatInputBar

- 텍스트 메시지 입력
- 음성 메시지 녹음
- 이미지 첨부
- 일정 생성
- Enter 키로 메시지 전송

### 5. ChatDateDivider

- 날짜 구분선 표시

## 🚀 사용법

### 기본 사용법

```tsx
import {
  ChatHeader,
  ChatDateDivider,
  ChatMessageList,
  ChatInputBar,
  type ChatMessage,
} from "@/shared/components/ChatComponents";

export default function MyChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = (text: string) => {
    // 메시지 전송 로직
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName="밴드 이름"
        onBack={() => navigate(-1)}
        onSettings={() => console.log("설정")}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px]">
        <ChatDateDivider date="2025.06.14" />
        <ChatMessageList messages={messages} />
      </div>

      <ChatInputBar onSendMessage={handleSendMessage} />
    </main>
  );
}
```

### 고급 사용법

```tsx
// 커스텀 메시지 처리
const handleSendAudio = (audioBlob: Blob) => {
  // 오디오 메시지 처리
};

const handleSendImage = (imageFile: File) => {
  // 이미지 메시지 처리
};

const handleLoadMore = () => {
  // 이전 메시지 로드
};

<ChatInputBar
  onSendMessage={handleSendMessage}
  onSendAudio={handleSendAudio}
  onSendImage={handleSendImage}
  onSendCalendar={() => console.log("일정")}
  placeholder="메시지를 입력하세요..."
  disabled={false}
/>

<ChatMessageList
  messages={messages}
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
  autoScroll={true}
/>
```

## 🎨 스타일링

모든 컴포넌트는 Tailwind CSS를 사용하여 스타일링되어 있으며, 피그마 디자인과 일치하도록 구현되었습니다.

### 주요 색상

- 배경: `#121212` (다크 그레이)
- 헤더: `#181818` (다크 그레이)
- 채팅 영역: `#F3F3F3` (라이트 그레이)
- 내 메시지: `#292929` (다크 그레이)
- 상대방 메시지: `white`

### 반응형 디자인

- 모바일 우선 디자인
- 터치 친화적 인터페이스
- 적절한 터치 타겟 크기

## 🔧 커스터마이징

### Props 커스터마이징

```tsx
// ChatHeader 커스터마이징
<ChatHeader
  bandName="커스텀 밴드명"
  bandAvatar="/custom-avatar.png"
  bandStatus="커스텀 상태"
  showStatusBar={false}
  onBack={customBackHandler}
  onSettings={customSettingsHandler}
/>

// ChatInputBar 커스터마이징
<ChatInputBar
  placeholder="커스텀 플레이스홀더"
  disabled={isLoading}
  onSendMessage={customMessageHandler}
/>
```

### 스타일 커스터마이징

```tsx
// Tailwind 클래스로 스타일 오버라이드
<div className="[&_.chat-message]:bg-blue-500">
  <ChatMessageList messages={messages} />
</div>
```

## 📱 모바일 최적화

- 터치 제스처 지원
- 키보드 대응 레이아웃
- 스크롤 성능 최적화
- 배터리 효율적인 애니메이션

## 🔄 상태 관리

컴포넌트들은 React의 `useState`와 `useCallback`을 사용하여 최적화되어 있습니다.

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);

const handleSendMessage = useCallback((text: string) => {
  // 메시지 전송 로직
}, []);
```

## 🧪 테스트

`ChatDemoPage.tsx`를 통해 모든 기능을 테스트할 수 있습니다:

- 텍스트 메시지 전송
- 음성 메시지 녹음
- 이미지 첨부
- 일정 생성
- 무한 스크롤
- 자동 응답 시뮬레이션

## 📝 주의사항

1. **이미지 경로**: 아바타 이미지 경로가 올바른지 확인하세요
2. **타입 안전성**: TypeScript 타입을 정확히 사용하세요
3. **성능**: 대량의 메시지가 있을 때는 가상화를 고려하세요
4. **접근성**: 스크린 리더 지원을 위해 적절한 ARIA 라벨을 추가하세요

## 🔮 향후 개선사항

- [ ] 실시간 메시지 동기화
- [ ] 파일 업로드 진행률 표시
- [ ] 메시지 검색 기능
- [ ] 이모지 지원
- [ ] 메시지 편집/삭제
- [ ] 읽음 확인 기능
- [ ] 푸시 알림 지원
