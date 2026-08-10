export type LessonStatus = 'locked' | 'in_progress' | 'completed'

export interface LessonQuestion {
  id: string
  type: 'multiple_choice' | 'fill_blank' | 'true_false'
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
}

export interface Lesson {
  id: string
  unit_number: number
  title: string
  subtitle: string
  description: string
  content?: string
  questions: LessonQuestion[]
  difficulty: string
  content_type: string
  passing_score: number
  status: LessonStatus
  progress: number
  xp_reward: number
  estimated_minutes: number
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  xp: number
  level: number
  total_xp: number
  streak: number
  last_completed_at: string | null
}

export interface DailyGoal {
  completed: number
  total: number
  xp: number
}

export interface UserProfile {
  id: string
  display_name: string
  username: string | null
  bio: string | null
  birth_date: string | null
  gender: string | null
  phone: string | null
  avatar_url: string | null
  email: string
  level: number
  xp: number
}

export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
