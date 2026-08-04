import { useState, useEffect } from 'react'
import { Auth } from '@/services/api'
import type { UserProfile } from '@/types'
import { LearningService } from '@/services/api'

export default function TopAppBar() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dailyGoal, setDailyGoal] = useState<{ completed: number; total: number; xp: number }>({
    completed: 7,
    total: 5,
    xp: 1250,
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await Auth.getUser()
      if (user) {
        const p = await LearningService.getUserProfile()
        setProfile(p)
        const goal = await LearningService.getDailyGoal()
        setDailyGoal(goal)
      }
    }
    loadUser()
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-surface dark:bg-surface-container w-full">
      <div className="flex justify-between items-center w-full px-container-margin py-unit max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
            <img
              className="w-full h-full object-cover"
              alt="Avatar"
              src={profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX72G9rW_tB-mUQFiSNvYwcwH3UKticvwD1wOe4laDw0o0mDwnGrknYyCXVC3eDwV0GN4k1BwUsJHITKzZvCfjgN2YFvO8yWPsD4kHja2WVNLyYobofjhc3nSYpzVJfNnjwDHJM8EFKun9B6bo20H7VyjmuyJMSY2KTFdj9lhMpUpcXk47wmEPb-85JqPKRVVZt2g_NuvHSH1yqbtE4dqcLA1KXTWPPc3PqgtVyENmUFt3QWYwFgaI'}
            />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-primary-fixed-dim">
            Komorebi Learning
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-secondary-container">🔥</span>
          <span className="font-label-caps text-label-caps text-on-surface font-bold tracking-wide">
            {dailyGoal.completed} | {dailyGoal.xp} XP
          </span>
        </div>
      </div>
    </header>
  )
}
