import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QuestCard, type QuestStatus } from "@/components/feature/QuestCard"
import { QuestLayout } from "@/components/layout/QuestLayout"
import { PhotoUploader } from "@/components/feature/PhotoUploader"
import { questApi, type Quest } from "@/lib/api"
import { useFamilyStore } from "@/stores/useFamilyStore"
import { uploadToMediaForge } from "@/lib/media-forge"

// Map backend status to QuestCard status
function mapQuestStatus(status: string): QuestStatus {
  const statusMap: Record<string, QuestStatus> = {
    ASSIGNED: "pending",
    SUBMITTED: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    EXPIRED: "rejected",
  }
  return statusMap[status] ?? "pending"
}

export function QuestListPage() {
  const queryClient = useQueryClient()
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const currentFamily = useFamilyStore((state) => state.getCurrentFamily())
  const familyId = currentFamily?.id

  const { data, isLoading, error } = useQuery({
    queryKey: ["quests", familyId],
    queryFn: () => questApi.list(familyId!),
    enabled: !!familyId,
  })

  const submitProofMutation = useMutation({
    mutationFn: async ({ questId, file }: { questId: string; file: File }) => {
      // Upload to media-forge first
      const uploadResult = await uploadToMediaForge(file)
      // Then submit proof with media key
      return questApi.submitProof(questId, { mediaId: uploadResult.key })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests", familyId] })
      setSelectedQuestId(null)
    },
    onError: (error) => {
      console.error("Failed to submit proof:", error)
      alert("인증 제출에 실패했습니다.")
    },
  })

  const handleFileSelect = (file: File) => {
    if (!selectedQuestId) {
      alert("먼저 퀘스트를 선택하세요.")
      return
    }

    submitProofMutation.mutate({ questId: selectedQuestId, file })
  }

  if (isLoading) {
    return (
      <QuestLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </QuestLayout>
    )
  }

  if (error) {
    return (
      <QuestLayout>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            퀘스트 목록을 불러오는데 실패했습니다.
          </p>
        </div>
      </QuestLayout>
    )
  }

  const quests = data?.data ?? []
  const pendingQuests = quests.filter((q) => q.status === "ASSIGNED")

  return (
    <QuestLayout>
      <div className="space-y-6">
        {pendingQuests.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">인증 대기 중</h2>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <p className="mb-2 text-sm text-muted-foreground">오늘 완료한 퀘스트 인증을 올려주세요!</p>
              {selectedQuestId && (
                <p className="mb-2 text-xs text-muted-foreground">
                  선택된 퀘스트: {quests.find((q) => q.id === selectedQuestId)?.title}
                </p>
              )}
              <PhotoUploader onFileSelect={handleFileSelect} />
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">오늘의 퀘스트</h2>
          {quests.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">할당된 퀘스트가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quests.map((quest: Quest) => (
                <div
                  key={quest.id}
                  className={`cursor-pointer ${selectedQuestId === quest.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => quest.status === "ASSIGNED" && setSelectedQuestId(quest.id)}
                >
                  <QuestCard
                    title={quest.title}
                    reward={quest.points}
                    status={mapQuestStatus(quest.status)}
                    familyName="우리 가족"
                    dueDate={new Date(quest.dueAt)}
                    participantName={quest.status !== "ASSIGNED" ? "완료됨" : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </QuestLayout>
  )
}
