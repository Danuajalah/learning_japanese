import { supabase } from './supabase'
import type { Lesson, UserProgress, DailyGoal, UserProfile, ApiResponse, Conversation, ChatMessage } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const { data: { session } } = await supabase.auth.getSession()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      return { success: false, message: result.message || 'API request failed', data: null as T }
    }

    return await response.json()
  } catch (error) {
    console.error('API fetch error:', error)
    return { success: false, message: 'Network error', data: null as T }
  }
}

export class LearningService {
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const res = await apiFetch<UserProfile>('/user')
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async getLessons(): Promise<Lesson[]> {
    try {
      const res = await apiFetch<Lesson[]>('/lessons')
      if (!res.success) return []
      return res.data || []
    } catch {
      return []
    }
  }

  static async getLesson(id: string): Promise<Lesson | null> {
    try {
      const res = await apiFetch<Lesson>(`/lessons/${id}`)
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async getDailyGoal(): Promise<DailyGoal> {
    try {
      const res = await apiFetch<DailyGoal>('/progress/daily-goal')
      if (!res.success) return { completed: 0, total: 5, xp: 0 }
      return res.data || { completed: 0, total: 5, xp: 0 }
    } catch {
      return { completed: 0, total: 5, xp: 0 }
    }
  }

  static async getUserProgress(): Promise<UserProgress | null> {
    try {
      const res = await apiFetch<UserProgress>('/progress')
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async updateLessonProgress(lessonId: string, xpEarned: number): Promise<boolean> {
    try {
      const res = await apiFetch(`/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ xp_earned: xpEarned }),
      })
      return res.success
    } catch {
      return false
    }
  }

  static async submitAnswer(lessonId: string, answer: string): Promise<{
    success: boolean
    correct: boolean
    score: number
    correct_count: number
    total_questions: number
    xp_earned: number
    passed: boolean
    message: string
  } | null> {
    try {
      const res = await apiFetch<{
        success: boolean
        correct: boolean
        score: number
        correct_count: number
        total_questions: number
        xp_earned: number
        passed: boolean
        message: string
      }>(`/lessons/${lessonId}/submit-answer`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      })
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async updateProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const res = await apiFetch<UserProfile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }
}

export class SenseiService {
  static async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiFetch<Conversation[]>('/sensei/conversations')
      if (!res.success) return []
      return res.data || []
    } catch {
      return []
    }
  }

  static async createConversation(): Promise<Conversation | null> {
    try {
      const res = await apiFetch<Conversation>('/sensei/conversations', {
        method: 'POST',
      })
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async getConversation(id: string): Promise<{ conversation: Conversation; messages: ChatMessage[] } | null> {
    try {
      const res = await apiFetch<{ conversation: Conversation; messages: ChatMessage[] }>(`/sensei/conversations/${id}`)
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  static async deleteConversation(id: string): Promise<boolean> {
    try {
      const res = await apiFetch(`/sensei/conversations/${id}`, {
        method: 'DELETE',
      })
      return res.success
    } catch {
      return false
    }
  }

  static async streamMessage(
    conversationId: string,
    message: string,
    onChunk: (content: string, done: boolean) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch(`${API_BASE_URL}/sensei/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
      signal,
    })

    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(result.message || 'Failed to send message')
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Streaming not supported')

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        let eventEnd: number
        while ((eventEnd = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, eventEnd).trim()
          buffer = buffer.slice(eventEnd + 2)

          if (!event) continue

          const dataLine = event.split('\n').find((l) => l.startsWith('data: '))
          if (dataLine) {
            const jsonStr = dataLine.slice(6).trim()
            const data = JSON.parse(jsonStr)
            onChunk(data.content, data.done)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

export const Auth = {
  signUpWithPassword: async (email: string, password: string, fullName?: string, username?: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...(fullName && { full_name: fullName }),
          ...(username && { user_name: username }),
        },
      },
    })
  },

  signInWithPassword: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  signIn: async (email: string) => {
    return await supabase.auth.signInWithOtp({ email })
  },

  signInWithGoogle: async (redirectTo?: string) => {
    const redirectPath = redirectTo || window.location.origin
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectPath}/auth/callback`,
      },
    })
  },

  handleOAuthCallback: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
}
