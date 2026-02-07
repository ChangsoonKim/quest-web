import type { Meta, StoryObj } from "@storybook/react"
import { PointBadge } from "./PointBadge"

const meta = {
  title: "UI/PointBadge",
  component: PointBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    points: {
      control: "number",
    },
  },
} satisfies Meta<typeof PointBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    points: 100,
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    points: 50,
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    points: 5000,
  },
}

export const HighPoints: Story = {
  args: {
    points: 150000,
  },
}
