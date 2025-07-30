![image](https://github.com/user-attachments/assets/b6f5d14a-2e8a-4ebd-b4b0-efc2eb714c6e)

# 🎸Banddy

## 0. Getting Started (시작하기)

```
npm install
npm run dev
```

[기획 링크](https://makeus-challenge.notion.site/1e6b57f4596b8023a319e9d63bde14db)

<br/>
<br/>

## 1. Project Overview (프로젝트 개요)

    •	프로젝트 이름: Banddy
    •	프로젝트 설명: 음악을 좋아하는 사람들을 위한 음악 중심 소셜 웹앱 (PWA)

<br/>
<br/>

## 2. Team Members (팀원 및 팀 소개)

|                                                           제로/정규은                                                           |                                                           준혁/최준혁                                                           |                                                           인고사/박세웅                                                           |                                                           주이/최현준                                                           |
| :-----------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/98a0bbc9-6289-4960-a213-5a1e4a2c1b4c" alt="제로" height="150" width="150"> | <img src="https://github.com/user-attachments/assets/8196cb7b-5347-49ca-a09e-9f868803c1c0" alt="준혁" height="150" width="150"> | <img src="https://github.com/user-attachments/assets/a7cbfdb9-46f8-4f15-956a-7f69402cd53c" alt="인고사" height="150" width="150"> | <img src="https://github.com/user-attachments/assets/175c0464-90e5-4b5a-8b12-1684e337c979" alt="주이" height="150" width="150"> |
|                                                               PL                                                                |                                                               FE                                                                |                                                                FE                                                                 |                                                               FE                                                                |
|                         [GitHub](https://makeus-challenge.notion.site/1e6b57f4596b8023a319e9d63bde14db)                         |                         [GitHub](https://makeus-challenge.notion.site/1e6b57f4596b8023a319e9d63bde14db)                         |                          [GitHub](https://makeus-challenge.notion.site/1e6b57f4596b8023a319e9d63bde14db)                          |                                               [GitHub](https://github.com/hywznn)                                               |

<br/>
<br/>

## 3. Key Features (주요 기능)

    •	회원가입 및 로그인
    •	소셜 로그인 및 이메일 회원가입 지원
    •	개인화된 음악 추천
    •	사용자의 선호도 기반 AI 추천 시스템
    •	음악 공유 및 소셜 기능
    •	사용자들이 자신의 플레이리스트를 공유 및 팔로우 가능
    •	이벤트 및 콘서트 정보 제공
    •	사용자 위치 기반 음악 이벤트 알림
    •	뮤지션 프로필 페이지
    •	아티스트별 프로필 및 앨범 관리

<br/>
<br/>

## 4. Tasks & Responsibilities (작업 및 역할 분담)

|        |                                                                                                                                   |                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 제로   | <img src="https://github.com/user-attachments/assets/98a0bbc9-6289-4960-a213-5a1e4a2c1b4c" alt="제로" height="150" width="150">   | <ul><li>회원가입/로그인</li><ul><li>사전테스트</li> |
| 준혁   | <img src="https://github.com/user-attachments/assets/8196cb7b-5347-49ca-a09e-9f868803c1c0" alt="준혁" height="150" width="150">   | <ul><li>조인</li>                                   |
| 인고사 | <img src="https://github.com/user-attachments/assets/a7cbfdb9-46f8-4f15-956a-7f69402cd53c" alt="인고사" height="150" width="150"> | <ul><li>MY페이지</li><li>                           |
| 주이   | <img src="https://github.com/user-attachments/assets/175c0464-90e5-4b5a-8b12-1684e337c979" alt="주이" height="150" width="150">   | <ul><li>메인/홈, 채팅 및 소켓</li>                  |

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
