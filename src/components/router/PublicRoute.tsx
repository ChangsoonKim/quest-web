import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

export function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [searchParams] = useSearchParams()

  if (isAuthenticated) {
    const redirectTo = searchParams.get("redirect") ?? "/"
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
