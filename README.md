# Quest Web

가족 퀘스트 서비스의 웹 프론트엔드 애플리케이션입니다. 모바일 퍼스트로 설계된 퀘스트 관리 UI를 제공합니다.

## 기술 스택

| 카테고리 | 기술 | 버전 | 설명 |
|---------|------|------|------|
| **프레임워크** | [React](https://react.dev) | 19.2 | UI 라이브러리 |
| **빌드 도구** | [Vite](https://vite.dev) | 7.2 | 번들러 및 HMR |
| **언어** | [TypeScript](https://www.typescriptlang.org) | 5.9 | 타입 안전성 |
| **스타일링** | [Tailwind CSS](https://tailwindcss.com) | 4.1 | 유틸리티 퍼스트 CSS |
| **UI 컴포넌트** | [shadcn/ui](https://ui.shadcn.com) | - | Radix UI 기반 컴포넌트 |
| **아이콘** | [Lucide React](https://lucide.dev) | 0.563 | 아이콘 라이브러리 |
| **상태 관리** | [Zustand](https://zustand.docs.pmnd.rs) | 5.0 | 경량 상태 관리 |
| **데이터 패칭** | [TanStack Query](https://tanstack.com/query) | 5.90 | 서버 상태 관리 |
| **컴포넌트 문서** | [Storybook](https://storybook.js.org) | 10.2 | 컴포넌트 개발 및 문서화 |
| **테스트** | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) | 4.0 / 1.58 | 브라우저 기반 테스트 |
| **린트** | [ESLint](https://eslint.org) | 9.39 | 코드 품질 |
| **패키지 매니저** | [pnpm](https://pnpm.io) | - | 빠른 패키지 관리 |

## 시작하기

### 사전 요구 사항

- Node.js 20+
- pnpm

### 설치

```bash
pnpm install
```

### 개발 서버

```bash
pnpm dev
```

기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
pnpm build
```

### 프리뷰 (빌드 결과 확인)

```bash
pnpm preview
```

### 린트

```bash
pnpm lint
```

## Storybook

컴포넌트를 독립적으로 개발하고 문서화하기 위해 Storybook을 사용합니다.

### 실행

```bash
pnpm storybook
```

`http://localhost:6006`에서 Storybook UI가 열립니다.

### 빌드

```bash
pnpm build-storybook
```

정적 파일이 `storybook-static/` 디렉토리에 생성됩니다.

## 폴더 구조

```
quest-web/
├── .storybook/                 # Storybook 설정
│   ├── main.ts                 #   스토리 경로, 애드온, 프레임워크 설정
│   ├── preview.ts              #   글로벌 데코레이터 및 파라미터
│   └── vitest.setup.ts         #   Vitest 브라우저 테스트 셋업
├── public/                     # 정적 에셋
├── src/
│   ├── assets/                 # 이미지, 폰트 등 에셋
│   ├── components/
│   │   ├── feature/            # 비즈니스 로직이 포함된 기능 컴포넌트
│   │   │   ├── QuestCard.tsx   #   퀘스트 카드 (상태, 포인트, 마감일 표시)
│   │   │   └── PhotoUploader.tsx #   사진 촬영/업로드 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   └── QuestLayout.tsx #   모바일 퍼스트 앱 레이아웃 (헤더 + 하단 네비게이션)
│   │   └── ui/                 # 재사용 가능한 UI 프리미티브 (shadcn/ui)
│   │       ├── badge.tsx       #   뱃지 컴포넌트
│   │       ├── button.tsx      #   버튼 컴포넌트
│   │       ├── card.tsx        #   카드 컴포넌트
│   │       ├── input.tsx       #   인풋 컴포넌트
│   │       └── PointBadge.tsx  #   포인트 표시 뱃지
│   ├── hooks/                  # 커스텀 React 훅
│   ├── lib/
│   │   ├── api.ts              # API 클라이언트 (fetch 래퍼)
│   │   └── utils.ts            # 유틸리티 함수 (cn 등)
│   ├── pages/                  # 페이지 컴포넌트
│   │   └── QuestListPage.tsx   #   퀘스트 목록 페이지
│   ├── stores/                 # Zustand 스토어
│   ├── App.tsx                 # 앱 루트 컴포넌트
│   ├── index.css               # 글로벌 스타일 (Tailwind CSS 설정)
│   └── main.tsx                # 엔트리포인트 (React Query Provider 포함)
├── components.json             # shadcn/ui 설정
├── eslint.config.js            # ESLint 설정
├── index.html                  # HTML 엔트리포인트
├── package.json
├── tsconfig.json               # TypeScript 설정
└── vite.config.ts              # Vite 설정 (경로 별칭, Storybook 테스트)
```

### 컴포넌트 분류

| 디렉토리 | 용도 | 예시 |
|----------|------|------|
| `components/ui/` | 범용 UI 프리미티브. 비즈니스 로직 없음 | Button, Badge, Card, Input |
| `components/feature/` | 도메인 로직이 포함된 기능 컴포넌트 | QuestCard, PhotoUploader |
| `components/layout/` | 페이지 레이아웃 구조 | QuestLayout |
| `pages/` | 라우트에 대응하는 페이지 컴포넌트 | QuestListPage |

## 경로 별칭

`@/`를 통해 `src/` 디렉토리를 참조할 수 있습니다.

```typescript
// 사용 예시
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 서버 주소 | `/api` |

## 관련 문서

- [컴포넌트 개발 가이드](./docs/component-guide.md)
