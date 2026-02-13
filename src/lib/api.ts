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
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
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

// --- Family API Types ---

export interface Family {
  id: string
  name: string
  createdBy: string
  createdAt: string
}

export interface FamilyMember {
  id: string
  familyId: string
  userId: string
  nickname: string
  role: "PARENT" | "CHILD"
  joinedAt: string
}

export interface CreateFamilyRequest {
  name: string
}

// --- Quest API Types ---

export type QuestStatus = "ASSIGNED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "EXPIRED"

export interface Quest {
  id: string
  familyId: string
  assignedToUserId: string
  createdByUserId: string
  title: string
  description: string
  points: number
  dueAt: string
  status: QuestStatus
  createdAt: string
  updatedAt: string
}

export interface CreateQuestRequest {
  assignedToUserId: string
  title: string
  description: string
  points: number
  dueAt: string
}

export interface SubmitProofRequest {
  mediaId: string
  note?: string
}

export interface RejectQuestRequest {
  reason: string
}

export interface ListQuestsResponse {
  data: Quest[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// --- Proof API Types ---

export interface QuestProof {
  id: string
  questId: string
  submittedByUserId: string
  mediaId: string
  note: string
  createdAt: string
}

// --- Point API Types ---

export interface UserPoints {
  userId: string
  familyId: string
  totalPoints: number
  earnedAt: string
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

// --- Family API ---

export interface UserFamilyInfo {
  family: Family
  member: FamilyMember
}

export interface ListUserFamiliesResponse {
  data: UserFamilyInfo[]
}

export interface ListFamilyMembersResponse {
  data: FamilyMember[]
}

export const familyApi = {
  create: (data: CreateFamilyRequest) =>
    apiFetch<Family>("/v1/families", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addMember: (familyId: string, data: { userId: string; nickname?: string; role: "PARENT" | "CHILD" }) =>
    apiFetch<FamilyMember>(`/v1/families/${familyId}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMembers: (familyId: string) =>
    apiFetch<ListFamilyMembersResponse>(`/v1/families/${familyId}/members`),

  getUserFamilies: () =>
    apiFetch<ListUserFamiliesResponse>("/v1/users/me/families"),

  createInvitation: (familyId: string, data: { role: "PARENT" | "CHILD" }) =>
    apiFetch<InvitationInfo>(`/v1/families/${familyId}/invitations`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// --- Quest API ---

export const questApi = {
  list: (familyId: string, params?: { limit?: number; offset?: number; status?: QuestStatus }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", params.limit.toString())
    if (params?.offset) query.set("offset", params.offset.toString())
    if (params?.status) query.set("status", params.status)
    const queryString = query.toString()
    return apiFetch<ListQuestsResponse>(`/v1/families/${familyId}/quests${queryString ? `?${queryString}` : ""}`)
  },

  create: (familyId: string, data: CreateQuestRequest) =>
    apiFetch<Quest>(`/v1/families/${familyId}/quests`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitProof: (questId: string, data: SubmitProofRequest) =>
    apiFetch<QuestProof>(`/v1/quests/${questId}/proofs`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  approve: (questId: string) =>
    apiFetch<Quest>(`/v1/quests/${questId}/approve`, {
      method: "PUT",
    }),

  reject: (questId: string, data: RejectQuestRequest) =>
    apiFetch<Quest>(`/v1/quests/${questId}/reject`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// --- Point API ---

export const pointApi = {
  getUserPoints: (familyId: string, userId: string) =>
    apiFetch<UserPoints>(`/v1/families/${familyId}/users/${userId}/points`),
}
