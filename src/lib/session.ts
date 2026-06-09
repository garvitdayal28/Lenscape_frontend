// User session helpers — stores the Lenscape JWT issued by the backend.

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export interface SessionData {
  token: string
  userId: string
  name: string
  email: string
  profileComplete: boolean
}

export function saveSession(data: SessionData) {
  localStorage.setItem('lenscape_user_token', data.token)
  localStorage.setItem('lenscape_user_id', data.userId)
  localStorage.setItem('lenscape_user_name', data.name || '')
  localStorage.setItem('lenscape_user_email', data.email)
  localStorage.setItem('lenscape_profile_complete', data.profileComplete ? 'true' : 'false')
}

export function getToken() {
  return localStorage.getItem('lenscape_user_token')
}

export function clearSession() {
  localStorage.removeItem('lenscape_user_token')
  localStorage.removeItem('lenscape_user_id')
  localStorage.removeItem('lenscape_user_name')
  localStorage.removeItem('lenscape_user_email')
  localStorage.removeItem('lenscape_profile_complete')
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export async function verifySession(): Promise<SessionData | null> {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(`${API}/api/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.valid) {
      clearSession()
      return null
    }
    return {
      token,
      userId: data.userId,
      name: data.name,
      email: data.email,
      profileComplete: data.profileComplete,
    }
  } catch {
    return null
  }
}
