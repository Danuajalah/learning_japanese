import { supabase } from './supabase'
import type { Lesson, UserProgress, DailyGoal, UserProfile, ApiResponse } from '../types'

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
    } catch (error) {
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
}

export const Auth = {
  signIn: async (email: string) => {
    return await supabase.auth.signInWithOtp({ email })
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
}
