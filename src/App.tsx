import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PrivateRoute } from "@/components/router/PrivateRoute"
import { PublicRoute } from "@/components/router/PublicRoute"
import { QuestListPage } from "@/pages/QuestListPage"
import { CreateQuestPage } from "@/pages/CreateQuestPage"
import { PendingProofsPage } from "@/pages/PendingProofsPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { InviteLandingPage } from "@/pages/invite/InviteLandingPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/quests/new" element={<CreateQuestPage />} />
            <Route path="/proofs/pending" element={<PendingProofsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
