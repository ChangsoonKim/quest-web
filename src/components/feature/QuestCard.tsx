import * as React from "react"
import { Calendar, Clock, CheckCircle2, XCircle, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PointBadge } from "@/components/ui/PointBadge"

export type QuestStatus = "pending" | "approved" | "rejected" | "completed"

export interface QuestCardProps extends React.ComponentProps<typeof Card> {
  title: string
  reward: number
  status: QuestStatus
  familyName: string
  dueDate: Date
  participantName?: string
}

const statusConfig: Record<QuestStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ElementType }> = {
  pending: { label: "진행 중", variant: "secondary", icon: Clock },
  approved: { label: "승인됨", variant: "default", icon: CheckCircle2 },
  rejected: { label: "반려됨", variant: "destructive", icon: XCircle },
  completed: { label: "완료", variant: "default", icon: CheckCircle2 },
}

export function QuestCard({
  title,
  reward,
  status,
  familyName,
  dueDate,
  participantName,
  className,
  ...props
}: QuestCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card className={cn("w-full max-w-sm overflow-hidden transition-all hover:shadow-md", className)} {...props}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className="w-fit text-xs font-normal text-muted-foreground">
            {familyName}
          </Badge>
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight">
            {title}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8 text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <PointBadge points={reward} size="md" />
          <Badge variant={config.variant} className="flex items-center gap-1">
            {StatusIcon && <StatusIcon className="h-3 w-3" />}
            {config.label}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{format(dueDate, "M월 d일 (EEE)", { locale: ko })}까지</span>
        </div>
        {participantName && (
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{participantName}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
