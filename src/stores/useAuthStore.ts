import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi, type LoginRequest, type RegisterRequest } from "@/lib/api"

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setAuth: (token: string, user: AuthUser) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const res = await authApi.login(credentials)
        set({
          token: res.access_token,
          user: res.user,
          isAuthenticated: true,
        })
      },

      register: async (data) => {
        await authApi.register(data)
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },
    }),
    {
      name: "quest-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
