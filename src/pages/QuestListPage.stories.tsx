import type { Meta, StoryObj } from "@storybook/react"
import { QuestListPage } from "@/pages/QuestListPage"

const meta = {
  title: "Pages/QuestListPage",
  component: QuestListPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuestListPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
