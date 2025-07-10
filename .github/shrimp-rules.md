# Banddy 프로젝트 개발 가이드라인 (AI Agent 전용)

## 1. 프로젝트 구조 및 폴더 역할

- `src/pages/` : 라우트 단위 페이지 컴포넌트만 생성/수정한다. (예: HomePage, LoginPage)
- `src/pages/폴더/_components/` : 해당 페이지에서만 사용하는 전용 컴포넌트만 생성한다.
- `src/shared/ui/atoms|molecules|organisms/` : 공용 UI 컴포넌트만 생성/수정한다. (예: Button, Modal)
- `src/widgets/` : 전역 레이아웃, 네비게이션, BottomBar 등 앱 전체에서 쓰는 UI만 생성/수정한다.
- `src/assets/` : 이미지, 아이콘, SVG 등 리소스만 관리한다.
- `src/store/` : 전역 상태 관리 파일만 생성/수정한다.
- `src/styles/` : 글로벌 스타일(Tailwind, reset 등)만 관리한다.

## 2. 코드/파일 작성 규칙

- 반드시 목적에 맞는 폴더에 파일을 생성/수정한다.
- 공용 컴포넌트는 shared/ui/atoms|molecules|organisms에만 작성한다.
- 페이지 전용 컴포넌트는 pages/~/~/\_components에만 작성한다.
- 전역 UI(예: BottomBar)는 widgets/Layout에만 작성한다.
- import는 반드시 '@' alias를 사용한다. (예: import Button from '@/shared/ui/atoms/Button')
- Tailwind 유틸리티 클래스를 우선 사용한다. (불필요한 custom css 금지)
- 파일명, 폴더명은 PascalCase(컴포넌트), kebab-case(폴더/리소스)로 통일한다.
- 여러 파일을 동시에 수정해야 할 경우, 반드시 관련 파일을 모두 일관성 있게 수정한다.

## 3. 라우팅/페이지 관리 규칙

- src/app/router.tsx에서 모든 라우트를 관리한다.
- Layout을 통해 BottomBar 등 전역 UI가 항상 적용되도록 한다.
- SplashScreen 등 임시/테스트 화면은 라우트에 포함하지 않는다.
- 샘플 페이지와 실제 페이지는 명확히 구분한다.

## 4. 금지사항 (Prohibited)

- 공용 컴포넌트(shared/ui)에 페이지 전용 코드 작성 금지
- 전역 UI를 각 페이지에서 중복 렌더링 금지
- Tailwind 없이 custom css만 사용하는 것 금지
- import alias(@) 미사용 금지
- 라우트 구조를 src/app/router.tsx 외부에서 관리 금지
- 불필요한 임시/샘플/스플래시 화면 라우트 등록 금지

## 5. 예시/금지 예시

### ✅ 예시

- `src/pages/Home/_components/AlbumCarousel.tsx` : HomePage 전용 캐러셀 컴포넌트
- `src/shared/ui/atoms/CustomButton.tsx` : 모든 페이지에서 쓰는 공용 버튼
- `src/widgets/Layout/BottomBar.tsx` : 전역 하단 네비게이션 바
- `import Logo from '@/shared/ui/atoms/Logo'` : alias 사용

### ❌ 금지 예시

- `src/shared/ui/atoms/HomeAlbumCarousel.tsx` : 공용 폴더에 페이지 전용 컴포넌트 작성 금지
- `src/pages/Home/HomeBottomBar.tsx` : 전역 UI를 페이지에서 중복 구현 금지
- `import Button from '../../../../../shared/ui/atoms/Button'` : alias 미사용 금지
- `src/pages/SplashScreen.tsx` : 임시/테스트 화면 라우트 등록 금지

## 6. 작업 우선순위/판단 기준

- 폴더 구조와 목적에 맞는 위치에 파일을 생성/수정할 것
- 여러 파일을 동시에 수정해야 할 경우, 반드시 관련 파일을 모두 일관성 있게 수정할 것
- ambiguous(모호)한 요청이 있을 경우, 반드시 코드베이스를 직접 탐색하여 판단할 것

---
