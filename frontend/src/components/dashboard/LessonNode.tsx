import type { Lesson } from '@/types'
import { cx } from '@/lib/utils'

interface LessonNodeProps {
  lesson: Lesson
  marginLeft?: string
  marginRight?: string
  onClick?: () => void
}

const statusConfig = {
  completed: {
    circle: 'w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border-4 border-surface-container-lowest z-10 hover:scale-105 transition-transform',
    icon: 'star',
    iconSize: 'text-4xl',
    card: 'mt-3 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-surface-variant text-center',
    titleClass: 'text-on-surface text-lg font-bold',
  },
  in_progress: {
    circle: 'w-24 h-24 rounded-full bg-surface-container-lowest border-4 border-primary text-primary flex items-center justify-center shadow-xl z-10 hover:scale-105 transition-transform',
    icon: 'play_arrow',
    iconSize: 'text-5xl',
    card: 'mt-4 bg-primary px-5 py-3 rounded-xl shadow-md text-center',
    titleClass: 'text-on-primary text-xl font-bold',
  },
  locked: {
    circle: 'w-16 h-16 rounded-full bg-surface-variant text-outline flex items-center justify-center shadow-sm border-2 border-surface-container-lowest z-10',
    icon: 'lock',
    iconSize: 'text-2xl',
    card: 'mt-2 text-center',
    titleClass: 'text-outline text-sm font-semibold',
  },
}

export default function LessonNode({ lesson, marginLeft, marginRight, onClick }: LessonNodeProps) {
  const cfg = statusConfig[lesson.status as keyof typeof statusConfig]
  const isLocked = lesson.status === 'locked'

  return (
    <div className={cx(
      'flex flex-col items-center group cursor-pointer squish',
      isLocked && 'opacity-50',
      marginLeft,
      marginRight,
    )} onClick={() => !isLocked && onClick && onClick()}>
      {lesson.status === 'in_progress' && (
        <div className="absolute w-24 h-24 bg-primary-container rounded-full animate-ping opacity-50 z-0"></div>
      )}

      <div className={cx('rounded-full flex items-center justify-center', cfg.circle)}>
        <span
          className={cx('material-symbols-outlined', cfg.iconSize)}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {cfg.icon}
        </span>
      </div>

      <div className={cx(cfg.card)}>
        {lesson.status !== 'locked' && (
          <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-1">
            Unit {lesson.unit_number}
          </p>
        )}
        <p className={cx('font-headline-lg-mobile', cfg.titleClass)}>
          {lesson.title}
        </p>
      </div>
    </div>
  )
}
