import type { Meta, StoryObj } from "@storybook/react"
import { QuestCard } from "./QuestCard"

const meta = {
  title: "Feature/QuestCard",
  component: QuestCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["pending", "approved", "rejected", "completed"],
    },
    dueDate: {
      control: "date",
    },
  },
} satisfies Meta<typeof QuestCard>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: {
    title: "거실 청소하고 인증샷 찍기",
    reward: 500,
    status: "pending",
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "김철수",
  },
}

export const Approved: Story = {
  args: {
    title: "강아지 산책 시키기",
    reward: 1000,
    status: "approved",
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "김영희",
  },
}

export const Rejected: Story = {
  args: {
    title: "숙제 완료하기",
    reward: 300,
    status: "rejected",
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "김철수",
  },
}

export const Completed: Story = {
  args: {
    title: "설거지 하기",
    reward: 200,
    status: "completed",
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "이민수",
  },
}

export const LongTitle: Story = {
  args: {
    title: "매우 긴 제목의 퀘스트입니다. 두 줄까지 표시되고 그 이후는 말줄임표로 표시되어야 합니다. 확인해보세요.",
    reward: 5000,
    status: "pending",
    familyName: "우리 가족",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3일 후
  },
}
