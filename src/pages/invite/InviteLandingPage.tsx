import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/stores/useAuthStore"
import { invitationApi, ApiError, type InvitationInfo } from "@/lib/api"
import { Loader2, Users } from "lucide-react"

export function InviteLandingPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!code) return

    invitationApi
      .getInfo(code)
      .then(setInvitation)
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? "유효하지 않은 초대 링크입니다." : err.message)
        } else {
          setError("초대 정보를 불러올 수 없습니다.")
        }
      })
      .finally(() => setLoading(false))
  }, [code])

  async function handleAccept() {
    if (!code) return
    setAccepting(true)
    setError("")

    try {
      const res = await invitationApi.accept(code)
      navigate(`/?familyId=${res.familyId}`, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("초대 수락에 실패했습니다.")
      }
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">초대 링크 오류</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link to="/login">로그인 페이지로</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">가족 초대</CardTitle>
          <CardDescription>
            <span className="font-medium text-foreground">{invitation?.invitedBy}</span>님이{" "}
            <span className="font-medium text-foreground">{invitation?.familyName}</span>에
            초대했습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          역할: <span className="font-medium text-foreground">{invitation?.role}</span>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          {error && <p className="text-sm text-destructive">{error}</p>}

          {isAuthenticated ? (
            <Button className="w-full" onClick={handleAccept} disabled={accepting}>
              {accepting ? "수락 중..." : "초대 수락"}
            </Button>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link to={`/login?redirect=/invite/${code}`}>로그인 후 수락</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <Link
                  to={`/register?redirect=/invite/${code}`}
                  className="text-primary underline underline-offset-4"
                >
                  회원가입
                </Link>
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
