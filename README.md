![image](https://github.com/user-attachments/assets/b6f5d14a-2e8a-4ebd-b4b0-efc2eb714c6e)

# 🎸Banddy

## Project Overview (프로젝트 개요)

 •	프로젝트 이름: Banddy
 •	프로젝트 설명: 음악을 좋아하는 사람들을 위한 음악 중심 소셜 웹앱 (PWA)


- 배포주소 : https://www.banddy.click/
- TestID :
- TestPW :

- [기획 링크](https://makeus-challenge.notion.site/1e6b57f4596b8023a319e9d63bde14db)

<br/>
<br/>


<br/>
<br/>

## 1. Team Members (팀원 및 팀 소개)

|                                                           제로/정규은                                                           |                                                           준혁/최준혁                                                           |                                                           인고사/박세웅                                                           |                                                           주이/최현준                                                           |
| :-----------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/98a0bbc9-6289-4960-a213-5a1e4a2c1b4c" alt="제로" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/8196cb7b-5347-49ca-a09e-9f868803c1c0" alt="준혁" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/a7cbfdb9-46f8-4f15-956a-7f69402cd53c" alt="인고사" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/175c0464-90e5-4b5a-8b12-1684e337c979" alt="주이" width="150" height="150"> |
|                                                               **PL**                                                                |                                                               **FE**                                                                |                                                                **FE**                                                                 |                                                               **FE**                                                                |
|                         [GitHub](https://github.com/)                         |                         [GitHub](https://github.com/)                         |                          [GitHub](https://github.com/)                          |                                               [GitHub](https://github.com/hywznn)                                               |



<br/>
<br/>

## 2. 개발 환경/기술

- 런타임/도구
	- React 19, TypeScript 5, Vite 7, React Router 7
	- 모듈 번들링/개발 서버: Vite
	- 패키지 매니저: npm
- UI/스타일
	- MUI 7 + Emotion, Tailwind CSS 4
	- SVG 핸들링: vite-plugin-svgr
- 상태/데이터
	- 서버 상태: @tanstack/react-query v5
	- 클라이언트 상태: Zustand, Valtio
- 네트워킹/실시간
	- HTTP: Axios
	- 실시간: SockJS + @stomp/stompjs
- 품질 관리
	- 정적 분석: ESLint 9
	- 타입 체크: tsc --noEmit
- 협업/배포/디자인
	- 협업: GitHub, Notion
	- 배포: Vercel, AWS(배포 스크립트 제공, scripts/deploy-aws.sh)
	- 디자인: Figma
- PWA
	- 플러그인: vite-plugin-pwa (현재 Service Worker 이슈로 비활성화 상태)


## 3. Key Features (주요 기능)

- 회원가입/로그인: 이메일 기반 가입/로그인, 세션 유지
- 취향 기반 추천: 사전테스트 결과로 홈 추천/맞춤 콘텐츠 제공
- 밴드 탐색/상세: 밴드 정보, 구성원, 플레이리스트, 선호 탭 제공
- 아카이브 관리: 아티스트/앨범/트랙 저장·폴더링, 앨범 상세 조회
- 검색/자동완성: 아티스트/앨범/트랙 검색 및 자동완성 지원
- 프로필 관리: 자기소개, 세션/레벨, 선호 장르/아티스트 편집
- 소셜 인터랙션: 팔로우, 좋아요, 댓글
- 알림 시스템: 친구요청/채팅/시스템 알림, 읽음 처리
- 실시간 채팅: 그룹/개인 채팅, STOMP/SockJS 기반, 읽음 상태 전송
- Join 플로우: 밴드 생성(곡/장르/아티스트), 채팅 개설, 모집글 관리
- PWA 지향: 오프라인·설치형 UX 준비(현 시점 SW 비활성)
- 접근 제어: 보호 라우트로 인증 요구 경로 관리

<br/>
<br/>

## 4. 프로젝트 폴더 구조

```
├── DEPLOYMENT.md
├── GITHUB_SECRETS_SETUP.md
├── README.md
├── eslint.config.cjs
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── documents
│   └── chat
│       ├── README.md
│       ├── v1.md
│       ├── v2.md
│       └── v3.md
├── public
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── fonts
│   │   ├── HakgyoansimBareondotumB.otf
│   │   ├── HakgyoansimBareondotumB.ttf
│   │   ├── HakgyoansimBareondotumR.otf
│   │   └── ...
│   ├── manifest.json
│   └── styles
│       └── style.css
├── scripts
│   ├── deploy-aws.sh
│   └── setup-aws.sh
└── src
    ├── App.css
    ├── index.css
    ├── main.tsx
    ├── api
    │   └── API.ts
    ├── app
    │   └── router.tsx
    ├── assets
    │   ├── icons
    │   │   ├── archive
    │   │   │   ├── additem.svg
    │   │   │   ├── back.svg
    │   │   │   └── ...
    │   │   ├── bottombar
    │   │   │   ├── chat.svg
    │   │   │   ├── home.svg
    │   │   │   └── ...
    │   │   ├── chat
    │   │   ├── home
    │   │   ├── join
    │   │   ├── login
    │   │   ├── my
    │   │   ├── notification
    │   │   ├── pretest
    │   │   ├── profile
    │   │   ├── setting
    │   │   └── ...
    │   ├── images
    │   │   ├── guitar-boy.svg
    │   │   ├── home-album1.svg
    │   │   └── ...
    │   ├── logos
    │   │   ├── Banddy.svg
    │   │   ├── LOGO1.svg
    │   │   └── ...
    │   └── splash-main.png
    ├── constants
    │   └── index.ts
    ├── features
    │   ├── archive
    │   │   ├── hooks
    │   │   │   ├── useAddArtistsToFolder.ts
    │   │   │   ├── useAlbumDetail.ts
    │   │   │   └── ...
    │   │   └── utils
    │   │       └── colorMapping.ts
    │   ├── band
    │   │   └── hooks
    │   │       ├── keys.ts
    │   │       └── useBandData.ts
    │   ├── my
    │   │   └── hooks
    │   │       └── useProfile.ts
    │   ├── notification
    │   │   └── hooks
    │   │       ├── useFriendRequestActions.ts
    │   │       └── ...
    │   ├── pretest
    │   │   └── hooks
    │   │       ├── keys.ts
    │   │       └── useSurveyData.ts
    │   ├── profile
    │   │   └── hooks
    │   │       ├── useOtherProfile.ts
    │   │       └── ...
    │   └── setting
    │       └── hooks
    │           ├── useAuth.ts
    │           └── ...
    ├── pages
    │   ├── Archive
    │   │   ├── _components
    │   │   │   ├── ActionBar.tsx
    │   │   │   ├── ArchiveGrid.tsx
    │   │   │   └── ...
    │   │   ├── AddPage.tsx
    │   │   ├── Album
    │   │   │   ├── AlbumDetailPage.tsx
    │   │   │   └── ...
    │   │   ├── ArchivePage.tsx
    │   │   ├── Artist
    │   │   │   ├── ArtistGrid.tsx
    │   │   │   └── ...
    │   │   └── Music
    │   │       ├── _components
    │   │       │   ├── AddFolderModal.tsx
    │   │       │   └── ...
    │   │       ├── MusicGrid.tsx
    │   │       └── ...
    │   ├── Artist
    │   │   ├── ArtistDetailPage.tsx
    │   │   └── ArtistsPage.tsx
    │   ├── Band
    │   │   ├── BandChatPage.tsx
    │   │   └── BandDetailPage.tsx
    │   ├── chat
    │   │   ├── _components
    │   │   │   ├── ChatDateDivider.tsx
    │   │   │   └── ...
    │   │   ├── hooks
    │   │   │   ├── useChat.ts
    │   │   │   └── useWebSocket.ts
    │   │   ├── ChatPage.tsx
    │   │   ├── ChatDemoPage.tsx
    │   │   └── PrivateChatPage.tsx
    │   ├── Home
    │   │   ├── _components
    │   │   │   ├── BandCarousel.tsx
    │   │   │   └── ...
    │   │   ├── BandDetailPage
    │   │   │   ├── PeoplePage.tsx
    │   │   │   └── ...
    │   │   ├── GuestHomePage.tsx
    │   │   └── HomePage.tsx
    │   ├── Join
    │   │   ├── _components
    │   │   │   ├── band_recruit
    │   │   │   │   ├── BandMenuContentBtn.tsx
    │   │   │   │   └── ...
    │   │   │   ├── chat
    │   │   │   ├── create_band
    │   │   │   ├── saved_band
    │   │   │   ├── JoinHeader.tsx
    │   │   │   └── ...
    │   │   ├── _constants
    │   │   │   ├── genres.ts
    │   │   │   └── regions.ts
    │   │   ├── _utils
    │   │   │   ├── parseToKoreanText.ts
    │   │   │   └── showMembers.ts
    │   │   ├── BandRecruit.tsx
    │   │   ├── create_band
    │   │   │   ├── CreateBand.tsx
    │   │   │   ├── CreateBandArtist.tsx
    │   │   │   └── ...
    │   │   ├── CreateChat.tsx
    │   │   ├── CreateChat2.tsx
    │   │   ├── saved_band
    │   │   │   ├── SavedBand.tsx
    │   │   │   └── SavedBandDetail.tsx
    │   │   └── JoinChangeChatInfo.tsx
    │   ├── Login
    │   │   ├── _components
    │   │   │   └── LoginInputField.tsx
    │   │   └── LoginPage.tsx
    │   ├── Manual
    │   │   └── ManualPage.tsx
    │   ├── My
    │   │   ├── _components
    │   │   │   ├── Archive
    │   │   │   │   ├── ArchiveItem.tsx
    │   │   │   │   └── ...
    │   │   │   ├── HashTagList.tsx
    │   │   │   └── ...
    │   │   └── MyPage.tsx
    │   ├── NotFound
    │   │   └── NotFoundPage.tsx
    │   ├── Notification
    │   │   ├── _components
    │   │   │   ├── NotificationItem.tsx
    │   │   │   └── ...
    │   │   ├── NotificationDetailPage.tsx
    │   │   └── NotificationPage.tsx
    │   ├── pretest
    │   │   ├── artist
    │   │   ├── session
    │   │   └── profile
    │   └── Profile
    │       ├── _components
    │       │   ├── ProfileActionButtons.tsx
    │       │   └── ...
    │       ├── OtherProfile.tsx
    │       └── ProfileDetailPage.tsx
    ├── services
    │   └── WebSocketService.ts
    ├── shared
    │   ├── components
    │   │   ├── AuthProvider.tsx
    │   │   ├── ChatComponents.tsx
    │   │   └── CommonBtn.tsx
    │   ├── styles
    │   │   └── fonts.css
    │   ├── ui
    │   │   ├── atoms
    │   │   │   ├── CustomButton.tsx
    │   │   │   └── ...
    │   │   ├── molecules
    │   │   │   └── TagList.tsx
    │   │   └── organisms
    │   │       ├── JoinBandModal.tsx
    │   │       └── ProfileRequestModal.tsx
    │   └── utils
    │       └── authCleanup.ts
    ├── store
    │   ├── albumApi.ts
    │   ├── artistApi.ts
    │   ├── auth.ts
    │   └── ...
    ├── types
    │   ├── album.ts
    │   ├── artist.ts
    │   └── ...
    └── widgets
        └── Layout
            ├── BottomBar.tsx
            ├── Header.tsx
            └── Layout.tsx
```


<br/>
<br/>

## 5. Technology Stack (기술 스택)

### Frontend

기본 프레임워크/라이브러리

- React
- TypeScript
- Vite
- Vite-plugin-pwa

Style

- Tailwind CSS

State Management

- Valtio

Animation

- Framer Motion

### Backend

[Spring | Backend repository](https://github.com/UMC-Banddy/server)

### Cooperation

• GitHub
• Notion

<br/>
<br/>

## 6. Project Structure (프로젝트 구조) - 미수정

```
banddy/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── src/
│   ├── assets/             # 이미지, 폰트 등 정적 파일
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── hooks/              # 커스텀 훅 모음
│   ├── pages/              # 페이지 컴포넌트
│   ├── utils/                # 공통 유틸리티 함수
│   ├── api/                  # API 통신 로직
│   ├── App.tsx            # 메인 컴포넌트
│   ├── main.tsx           # 엔트리 포인트
│   ├── index.css          # 글로벌 CSS
│   └── firebaseConfig.ts # Firebase 초기화
├── .gitignore
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md
```

<br/>
<br/>

## 7. Development Workflow (개발 워크플로우)

### Branch Strategy

• Main Branch: 배포 가능한 상태 유지
• Develop Branch: 개발 및 테스트 통합 브랜치
• Feature/{기능명}: 개별 기능 개발 브랜치

<br/>
<br/>

## 8. Coding Convention

### 문장 종료

```
console.log("Hello Banddy!");
```

### 명명 규칙

• 상수: 대문자 + 스네이크 케이스 (const MAX_USER_COUNT)
• 변수 및 함수: 카멜 케이스 (const isLoading)
• 이벤트 핸들러: on으로 시작 (onClick, onChange)
• boolean 반환 값: is, has로 시작 (isAuthenticated)
• 배열 변수: 복수형 (const users)
• 커스텀 훅: use로 시작 (useUserAuth)

### 블록 구문

if (isLoading) {
return 'Loading';
}

### 함수 선언

const fetchPlaylist = async () => {};

### 태그 네이밍 (컴포넌트)

<Container>
  <ContentArea>
    <Playlist />
  </ContentArea>
</Container>

### 파일 및 폴더 네이밍

```
	•	폴더: 카멜케이스 (components, hooks)
	•	컴포넌트: 파스칼 케이스 (Playlist.jsx)
	•	그 외: 카멜케이스 (useAuth.js)
```

<br/>
<br/>

## 9. 커밋 컨벤션

### 기본 구조

```
type: subject

body

Type
	•	feat: 기능 추가
	•	fix: 버그 수정
	•	docs: 문서 작업
	•	style: 코드 포맷 수정
	•	refactor: 코드 리팩토링
	•	chore: 설정 및 빌드

예시

feat: 플레이리스트 공유 기능 구현

(사용자가 만든 플레이리스트를 소셜 미디어로 공유 가능)

refactor: useAuth 훅 최적화

(불필요한 상태 업데이트 제거 및 성능 최적화)
```
