import { QuestCard, type QuestStatus } from "@/components/feature/QuestCard"
import { QuestLayout } from "@/components/layout/QuestLayout"
import { PhotoUploader } from "@/components/feature/PhotoUploader"

const DUMMY_QUESTS = [
  {
    id: 1,
    title: "거실 청소하고 인증샷 찍기",
    reward: 500,
    status: "pending" as QuestStatus,
    familyName: "우리 가족",
    dueDate: new Date(),
  },
  {
    id: 2,
    title: "강아지 산책 시키기",
    reward: 1000,
    status: "approved" as QuestStatus,
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "김철수",
  },
  {
    id: 3,
    title: "숙제 완료하기",
    reward: 300,
    status: "rejected" as QuestStatus,
    familyName: "우리 가족",
    dueDate: new Date(),
    participantName: "김영희",
  },
]

export function QuestListPage() {
  return (
    <QuestLayout>
      <div className="space-y-6">
        <section className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">인증 대기 중</h2>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="mb-2 text-sm text-muted-foreground">오늘 완료한 퀘스트 인증을 올려주세요!</p>
                <PhotoUploader onFileSelect={(file) => console.log(file)} />
            </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">오늘의 퀘스트</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DUMMY_QUESTS.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                reward={quest.reward}
                status={quest.status}
                familyName={quest.familyName}
                dueDate={quest.dueDate}
                participantName={quest.participantName}
              />
            ))}
          </div>
        </section>
      </div>
    </QuestLayout>
  )
}
