import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QuestLayout } from "@/components/layout/QuestLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PointBadge } from "@/components/ui/PointBadge"
import { questApi } from "@/lib/api"

export function PendingProofsPage() {
  const queryClient = useQueryClient()
  // TODO: Get familyId from user's family context
  const familyId = "temp-family-id"

  const { data, isLoading, error } = useQuery({
    queryKey: ["quests", familyId, "submitted"],
    queryFn: () => questApi.list(familyId, { status: "SUBMITTED" }),
  })

  const approveMutation = useMutation({
    mutationFn: (questId: string) => questApi.approve(questId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests", familyId] })
    },
    onError: (error) => {
      console.error("Failed to approve quest:", error)
      alert("승인에 실패했습니다.")
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ questId, reason }: { questId: string; reason: string }) =>
      questApi.reject(questId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests", familyId] })
    },
    onError: (error) => {
      console.error("Failed to reject quest:", error)
      alert("거절에 실패했습니다.")
    },
  })

  const handleReject = (questId: string) => {
    const reason = prompt("거절 사유를 입력하세요:")
    if (reason) {
      rejectMutation.mutate({ questId, reason })
    }
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
            인증 대기 목록을 불러오는데 실패했습니다.
          </p>
        </div>
      </QuestLayout>
    )
  }

  const quests = data?.data ?? []

  return (
    <QuestLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">인증 대기 목록</h1>
          <p className="text-sm text-muted-foreground">
            제출된 퀘스트 인증을 확인하고 승인하세요
          </p>
        </div>

        {quests.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">대기 중인 인증이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quests.map((quest) => (
              <div key={quest.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">{quest.title}</h3>
                      <PointBadge points={quest.points} />
                    </div>
                    {quest.description && (
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">SUBMITTED</Badge>
                    <span>완료: {new Date(quest.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(quest.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(quest.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      거절
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </QuestLayout>
  )
}
