import { useState, useEffect } from 'react'
import LessonNode from './LessonNode'
import type { Lesson } from '@/types'
import { LearningService } from '@/services/api'
import { Auth } from '@/services/api'

const sampleLessons: Lesson[] = [
  {
    id: '1',
    unit_number: 1,
    title: 'Hiragana (ひらがな)',
    subtitle: '',
    description: 'Learn hiragana characters',
    status: 'completed',
    progress: 100,
    xp_reward: 50,
    estimated_minutes: 15,
  },
  {
    id: '2',
    unit_number: 2,
    title: 'Katakana (カタカナ)',
    subtitle: '',
    description: 'Learn katakana characters',
    status: 'completed',
    progress: 100,
    xp_reward: 50,
    estimated_minutes: 15,
  },
  {
    id: '3',
    unit_number: 3,
    title: 'N5 Grammar Intro',
    subtitle: '',
    description: 'Basic Japanese grammar patterns',
    status: 'in_progress',
    progress: 30,
    xp_reward: 100,
    estimated_minutes: 30,
  },
  {
    id: '4',
    unit_number: 4,
    title: 'Basic Greetings',
    subtitle: '',
    description: 'Common Japanese greetings',
    status: 'locked',
    progress: 0,
    xp_reward: 50,
    estimated_minutes: 10,
  },
  {
    id: '5',
    unit_number: 5,
    title: 'Numbers & Time',
    subtitle: '',
    description: 'Counting and telling time',
    status: 'locked',
    progress: 0,
    xp_reward: 50,
    estimated_minutes: 10,
  },
]

const positions = ['left', 'right', 'center', 'right', 'left'] as const

export default function LearningRoadmap() {
  const [lessons, setLessons] = useState<Lesson[]>(sampleLessons)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const user = await Auth.getUser()
      if (user) {
        setLoading(true)
        const data = await LearningService.getLessons()
        if (data.length > 0) setLessons(data)
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <section className="relative pt-4 pb-12">
        <div className="text-center py-12 text-on-surface-variant">
          Loading roadmap...
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-4 pb-12">
      <div className="path-line h-full top-0"></div>
      <div className="flex flex-col gap-16 relative z-10">
        {lessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            position={positions[index % positions.length]}
            showAnimation={lesson.status === 'in_progress'}
          />
        ))}
      </div>
    </section>
  )
}
