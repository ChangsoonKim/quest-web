// Media-forge upload utility
// Note: In production, this would use internal API key via backend proxy

const MEDIA_FORGE_URL = import.meta.env.VITE_MEDIA_FORGE_URL ?? "https://media-forge.nado.cloud"

export interface UploadResult {
  key: string
  url: string
}

export async function uploadToMediaForge(file: File): Promise<UploadResult> {
  // For now, we'll upload via the backend proxy
  // Backend should implement POST /api/v1/media/upload endpoint
  // that forwards to media-forge with internal API key
  
  const formData = new FormData()
  formData.append("file", file)

  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "/api"}/v1/media/upload`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(`Media upload failed: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  return {
    key: result.key,
    url: `${MEDIA_FORGE_URL}/api/v1/media/${result.key}`,
  }
}

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
