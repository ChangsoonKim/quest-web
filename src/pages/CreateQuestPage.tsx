import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { QuestLayout } from "@/components/layout/QuestLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { questApi, type CreateQuestRequest } from "@/lib/api"

export function CreateQuestPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CreateQuestRequest>({
    assignedToUserId: "",
    title: "",
    description: "",
    points: 100,
    dueAt: new Date().toISOString().split("T")[0],
  })

  // TODO: Get familyId from user's family context
  const familyId = "temp-family-id"

  const createMutation = useMutation({
    mutationFn: (data: CreateQuestRequest) => questApi.create(familyId, data),
    onSuccess: () => {
      navigate("/")
    },
    onError: (error) => {
      console.error("Failed to create quest:", error)
      alert("퀘스트 생성에 실패했습니다.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <QuestLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">새 퀘스트 만들기</h1>
          <p className="text-sm text-muted-foreground">가족 구성원에게 할당할 퀘스트를 만드세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              퀘스트 제목 *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 거실 청소하기"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              설명
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="퀘스트에 대한 자세한 설명"
              className="min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedTo" className="text-sm font-medium">
              담당자 *
            </label>
            <Input
              id="assignedTo"
              value={formData.assignedToUserId}
              onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
              placeholder="User ID"
              required
            />
            <p className="text-xs text-muted-foreground">
              TODO: 가족 구성원 선택 드롭다운으로 변경
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="points" className="text-sm font-medium">
                포인트 *
              </label>
              <Input
                id="points"
                type="number"
                min={1}
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueAt" className="text-sm font-medium">
                완료 기한 *
              </label>
              <Input
                id="dueAt"
                type="date"
                value={formData.dueAt}
                onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "생성 중..." : "퀘스트 생성"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </QuestLayout>
  )
}
