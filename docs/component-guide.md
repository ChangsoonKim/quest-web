# 컴포넌트 개발 가이드

Quest Web 프로젝트에서 컴포넌트를 개발할 때 따라야 하는 규칙과 패턴을 설명합니다.

## 컴포넌트 계층 구조

컴포넌트는 역할에 따라 세 계층으로 분류합니다.

```
src/components/
├── ui/          # Layer 1: UI 프리미티브
├── feature/     # Layer 2: 기능 컴포넌트
└── layout/      # Layer 3: 레이아웃 컴포넌트
```

### Layer 1: `ui/` — UI 프리미티브

- shadcn/ui 기반의 범용 컴포넌트
- 비즈니스 로직 없음, 순수 프레젠테이션
- `class-variance-authority`(CVA)로 variant 관리
- 예시: `Button`, `Badge`, `Card`, `Input`

```tsx
// ui/ 컴포넌트 예시: variant와 size를 props로 받는 패턴
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-input",
    },
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}
```

### Layer 2: `feature/` — 기능 컴포넌트

- 도메인 로직이 포함된 컴포넌트
- `ui/` 컴포넌트를 조합하여 구성
- 상태, 이벤트 핸들러, 데이터 변환 로직 포함 가능
- 예시: `QuestCard`, `PhotoUploader`

```tsx
// feature/ 컴포넌트 예시
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PointBadge } from "@/components/ui/PointBadge"

interface QuestCardProps {
  title: string
  reward: number
  status: "pending" | "approved" | "rejected" | "completed"
}

export function QuestCard({ title, reward, status }: QuestCardProps) {
  return (
    <Card>
      <CardContent>
        <h3>{title}</h3>
        <PointBadge points={reward} />
        <Badge variant={status === "approved" ? "default" : "secondary"}>
          {status}
        </Badge>
      </CardContent>
    </Card>
  )
}
```

### Layer 3: `layout/` — 레이아웃 컴포넌트

- 페이지의 골격 구조를 정의
- 헤더, 네비게이션, 컨텐츠 영역 배치
- `children` prop으로 컨텐츠를 주입받음
- 예시: `QuestLayout`

```tsx
// layout/ 컴포넌트 예시
interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        {/* 헤더 내용 */}
      </header>
      <main className="flex-1 p-4">{children}</main>
      <nav className="fixed bottom-0 border-t bg-background">
        {/* 하단 네비게이션 */}
      </nav>
    </div>
  )
}
```

## 새 컴포넌트 추가하기

### 1. shadcn/ui 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add <component-name>
```

`components/ui/`에 자동 생성됩니다. `components.json`에 설정된 경로 별칭을 사용합니다.

### 2. 커스텀 컴포넌트 작성

적절한 계층 디렉토리에 파일을 생성합니다.

```
src/components/feature/MyComponent.tsx          # 컴포넌트
src/components/feature/MyComponent.stories.tsx   # Storybook 스토리
```

## Storybook 스토리 작성

모든 컴포넌트는 반드시 Storybook 스토리를 함께 작성합니다.

### 기본 구조

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MyComponent } from "./MyComponent"

const meta = {
  title: "Feature/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "기본 상태",
  },
}

export const WithLongText: Story = {
  args: {
    title: "아주 긴 텍스트를 가진 컴포넌트의 모습을 확인합니다",
  },
}
```

### 스토리 네이밍 규칙

`title` 필드에 계층에 맞는 경로를 사용합니다.

| 계층 | title 예시 |
|------|-----------|
| `ui/` | `"UI/Button"`, `"UI/PointBadge"` |
| `feature/` | `"Feature/QuestCard"`, `"Feature/PhotoUploader"` |
| `layout/` | `"Layout/QuestLayout"` |
| `pages/` | `"Pages/QuestListPage"` |

### 주요 variant를 스토리로 작성

컴포넌트의 모든 주요 상태를 개별 스토리로 작성합니다.

```tsx
// 상태별 스토리 예시
export const Pending: Story = {
  args: { status: "pending" },
}

export const Approved: Story = {
  args: { status: "approved" },
}

export const Rejected: Story = {
  args: { status: "rejected" },
}
```

## 스타일링 규칙

### Tailwind CSS 사용

- 인라인 `style` 대신 Tailwind 유틸리티 클래스를 사용합니다.
- 클래스 병합이 필요한 경우 `cn()` 유틸리티를 사용합니다.

```tsx
import { cn } from "@/lib/utils"

// cn()으로 조건부 클래스와 외부 className을 안전하게 병합
<div className={cn("rounded-lg border p-4", isActive && "border-primary", className)} />
```

### 시맨틱 색상 토큰

Tailwind CSS 설정에 정의된 시맨틱 토큰을 사용합니다.

| 토큰 | 용도 |
|------|------|
| `bg-background` / `text-foreground` | 기본 배경/텍스트 |
| `bg-primary` / `text-primary-foreground` | 주요 강조 |
| `bg-secondary` / `text-secondary-foreground` | 보조 강조 |
| `bg-muted` / `text-muted-foreground` | 비활성/보조 텍스트 |
| `bg-destructive` | 삭제/위험 액션 |
| `bg-card` | 카드 배경 |
| `border` | 기본 테두리 |

### 반응형 디자인

모바일 퍼스트로 작성하고, 필요시 브레이크포인트를 추가합니다.

```tsx
// 모바일: 1열, sm: 2열, lg: 3열
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id} />
  ))}
</div>
```

## 임포트 규칙

`@/` 경로 별칭을 사용합니다.

```tsx
// 올바른 사용
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useQuestStore } from "@/stores/questStore"

// 피해야 할 사용
import { Button } from "../../components/ui/button"
import { Button } from "../../../components/ui/button"
```

## 체크리스트

새 컴포넌트를 추가할 때 아래 항목을 확인합니다.

- [ ] 적절한 계층 디렉토리에 배치 (`ui/`, `feature/`, `layout/`)
- [ ] Storybook 스토리 작성 (`.stories.tsx`)
- [ ] 주요 variant/상태별 스토리 포함
- [ ] `cn()`으로 className 병합 처리
- [ ] 시맨틱 색상 토큰 사용
- [ ] 모바일 퍼스트 반응형 적용
- [ ] `@/` 경로 별칭 사용
- [ ] `pnpm lint` 통과
