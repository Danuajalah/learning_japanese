import { TopAppBar, BottomNavBar, DesktopNav, LessonCard } from '@/components'
import { LearningService } from '@/services/api'
import type { Lesson } from '@/types'
import { useEffect, useState } from 'react'

export default function Practice() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLessons = async () => {
      const data = await LearningService.getLessons()
      setLessons(data)
      setLoading(false)
    }
    loadLessons()
  }, [])

  if (loading) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="practice" />
        <div className="pt-20 max-w-4xl mx-auto px-container-margin pb-24 text-center text-on-surface-variant">
          Loading practice sessions...
        </div>
        <BottomNavBar active="practice" />
      </>
    )
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="practice" />
      <main className="pt-20 pb-24 max-w-4xl mx-auto px-container-margin">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">
          Practice
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-card-gap">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => console.log('Start lesson:', lesson.id)}
            />
          ))}
        </div>
      </main>
      <BottomNavBar active="practice" />
    </>
  )
}
