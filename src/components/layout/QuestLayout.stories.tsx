import type { Meta, StoryObj } from "@storybook/react"
import { QuestLayout } from "./QuestLayout"
import { QuestCard } from "@/components/feature/QuestCard"

const meta = {
  title: "Layout/QuestLayout",
  component: QuestLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof QuestLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">홈</h1>
        <p className="text-muted-foreground">스크롤 테스트를 위한 긴 콘텐츠...</p>
        {Array.from({ length: 10 }).map((_, i) => (
          <QuestCard
            key={i}
            title={`퀘스트 ${i + 1}`}
            reward={100 * (i + 1)}
            status="pending"
            familyName="우리 가족"
            dueDate={new Date()}
          />
        ))}
      </div>
    ),
  },
}
