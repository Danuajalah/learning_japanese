import { TopAppBar, BottomNavBar, DesktopNav, DailyGoalCard, LearningRoadmap } from '@/components'
import { LearningService } from '@/services/api'
import type { DailyGoal } from '@/types'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ completed: 0, total: 5, xp: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDailyGoal = async () => {
      const goal = await LearningService.getDailyGoal()
      setDailyGoal(goal)
      setLoading(false)
    }
    loadDailyGoal()
  }, [])

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 sakura-pattern">
      <TopAppBar />
      <DesktopNav active="map" />
      <main className="px-container-margin py-6 max-w-lg mx-auto md:max-w-4xl relative z-10">
        {!loading && <DailyGoalCard {...dailyGoal} />}
        <LearningRoadmap />
      </main>
      <BottomNavBar active="map" />
    </div>
  )
}
