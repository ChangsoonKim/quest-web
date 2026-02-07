import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PrivateRoute } from "@/components/router/PrivateRoute"
import { PublicRoute } from "@/components/router/PublicRoute"
import { QuestListPage } from "@/pages/QuestListPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { InviteLandingPage } from "@/pages/invite/InviteLandingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect to / if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Semi-public - accessible to everyone, shows different UI based on auth */}
        <Route path="/invite/:code" element={<InviteLandingPage />} />

        {/* Private routes - redirect to /login if not logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<QuestListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
