import type { Meta, StoryObj } from "@storybook/react"
import { PhotoUploader } from "./PhotoUploader"

const meta = {
  title: "Feature/PhotoUploader",
  component: PhotoUploader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onFileSelect: { action: "fileSelected" },
    onClear: { action: "cleared" },
  },
} satisfies Meta<typeof PhotoUploader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithPreview: Story = {
  args: {
    initialPreviewUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  },
}
