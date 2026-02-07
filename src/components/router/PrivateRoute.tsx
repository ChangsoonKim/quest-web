import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Outlet />
}
