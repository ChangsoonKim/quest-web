import type { AuthUser } from "@/stores/useAuthStore"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("quest-auth")
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    let message = `API error: ${res.status} ${res.statusText}`
    try {
      const json = JSON.parse(body)
      if (json.message) message = json.message
    } catch {
      // use default message
    }
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}

// --- Auth API Types ---

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface RegisterResponse {
  message: string
}

// --- Invitation API Types ---

export interface InvitationInfo {
  code: string
  familyId: string
  familyName: string
  role: string
  invitedBy: string
  expiresAt: string
}

export interface AcceptInvitationResponse {
  message: string
  familyId: string
}

// --- Auth API ---

export const authApi = {
  login: (data: LoginRequest) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// --- Invitation API ---

export const invitationApi = {
  getInfo: (code: string) =>
    apiFetch<InvitationInfo>(`/invitations/${code}`),

  accept: (code: string) =>
    apiFetch<AcceptInvitationResponse>(`/invitations/${code}/accept`, {
      method: "POST",
    }),
}
