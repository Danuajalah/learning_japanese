import type { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
  onClick?: () => void
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  const isLocked = lesson.status === 'locked'
  const isCompleted = lesson.status === 'completed'
  const isActive = lesson.status === 'in_progress'

  const getStatusColor = () => {
    if (isLocked) return 'bg-surface-variant text-outline'
    if (isCompleted) return 'bg-primary text-on-primary'
    if (isActive) return 'bg-secondary text-on-secondary'
    return 'bg-outline text-on-primary'
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl p-5 shadow-sm border transition-all cursor-pointer
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-102 active:scale-98'}
        ${isCompleted ? 'border-primary bg-primary-container/10' : 'border-surface-variant bg-surface-container-lowest'}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${getStatusColor()}
        `}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${isCompleted ? 1 : 0}` }}>
            {isLocked ? 'lock' : isCompleted ? 'check_circle' : 'play_arrow'}
          </span>
        </span>
        <span className="font-label-caps text-label-caps text-outline text-xs uppercase tracking-wider">
          Unit {lesson.unit_number}
        </span>
      </div>

      <h3 className={`
        font-headline-lg-mobile text-headline-lg-mobile font-bold mb-1
        ${isLocked ? 'text-outline' : 'text-on-surface'}
      `}>
        {lesson.title}
      </h3>

      {lesson.subtitle && (
        <p className="font-body-md text-sm text-on-surface-variant mb-2">
          {lesson.subtitle}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-xs text-on-surface-variant">
          {lesson.estimated_minutes} min
        </span>
        <span className="font-label-caps text-label-caps text-xs text-on-surface-variant">
          {lesson.xp_reward} XP
        </span>
      </div>
    </div>
  )
}
