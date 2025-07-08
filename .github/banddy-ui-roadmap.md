# Banddy Home & 공통 UI 구현 로드맵

## 1. 프로젝트 환경 점검 및 세팅

- Tailwind, alias(@), 라우팅 구조, 글로벌 스타일(index.css) 정상 적용 확인
- assets(icons, logos, images) 폴더 리소스 정리

## 2. 공통 컴포넌트(Atoms) 우선 구현

- Logo (white-star.svg)
- TagList (태그 리스트)
- JoinButton (JOIN + 로고)
- CustomButton (기본 버튼)

## 3. 공통 컴포넌트(Molecules/Organisms) 확장

- Modal, Carousel 등 재사용 가능한 복합 컴포넌트 필요시 구현

## 4. 전역 레이아웃/네비게이션 구현

- Layout (Outlet, BottomBar 포함)
- BottomBar (하단 네비게이션, 아이콘 4개)

## 5. HomePage 전용 컴포넌트 구현

- AlbumCarousel (좌우 무한 캐러셀, 앨범 이미지/제목/설명/하단 아이콘)
- HomePage 상단 로고/태그/캐러셀/하단 바 전체 조립

## 6. 스타일/반응형/UX 디테일링

- Tailwind로 여백, 폰트, 색상, 그림자 등 피그마와 최대한 유사하게 커스텀
- 모바일/데스크탑 반응형, 다크/라이트 테마 대응

## 7. 테스트 및 피드백

- 실제 기기/브라우저에서 UI 확인
- 피그마와 비교, 세부 수정 및 리팩토링

---

**Tip:**

- 각 단계별로 컴포넌트/스타일을 완성한 뒤, HomePage에서 실제로 조립해가며 진행하면 효율적입니다.
- 공통 컴포넌트는 최대한 재사용성을 고려해 설계하세요.
- 리소스(아이콘, 이미지 등)가 부족하면 즉시 요청하세요.

**이 로드맵을 따라가면 Banddy Home 및 공통 UI를 빠르고 일관성 있게 완성할 수 있습니다!**
