export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          email: string | null
          level: number | null
          xp: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          email?: string | null
          level?: number | null
          xp?: number | null
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          level?: number | null
          xp?: number | null
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          unit_number: number
          status: string
          xp_reward: number
          estimated_minutes: number
          order_index: number
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          subtitle?: string | null
          description?: string | null
          unit_number: number
          status: string
          xp_reward: number
          estimated_minutes: number
          order_index: number
          color?: string | null
        }
        Update: {
          title?: string
          subtitle?: string | null
          description?: string | null
          status?: string
          xp_reward?: number
          estimated_minutes?: number
          order_index?: number
          color?: string | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          xp: number
          level: number
          total_xp: number
          streak: number
          last_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          lesson_id: string
          xp?: number
          level?: number
          total_xp?: number
          streak?: number
          last_completed_at?: string | null
        }
        Update: {
          xp?: number
          level?: number
          total_xp?: number
          streak?: number
          last_completed_at?: string | null
        }
      }
      daily_goals: {
        Row: {
          id: string
          user_id: string
          completed: number
          total: number
          xp: number
          date: string
        }
        Insert: {
          user_id: string
          completed: number
          total: number
          xp: number
          date: string
        }
        Update: {
          completed?: number
          total?: number
          xp?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_lessons: {
        Args: { user_id: string }
        Returns: {
          id: string
          title: string
          status: string
          progress: number
          unit_number: number
        }[]
      }
      get_daily_goal: {
        Args: { user_id: string }
        Returns: {
          completed: number
          total: number
          xp: number
        }
      }
      complete_lesson: {
        Args: {
          user_id: string
          lesson_id: string
          xp_earned: number
        }
        Returns: boolean
      }
    }
  }
}
