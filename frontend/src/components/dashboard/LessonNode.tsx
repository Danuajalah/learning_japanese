import type { Lesson, LessonStatus } from '@/types'
import { cx } from '@/lib/utils'

interface LessonNodeProps {
  lesson: Lesson
  position: 'left' | 'right' | 'center'
  showAnimation?: boolean
}

const statusConfig: Record<LessonStatus, {
  size: string
  bgColor: string
  textColor: string
  borderColor: string
  iconSize: string
  icon: string
  fill: number
  cardBg: string
  cardText: string
  cardBorder: string
}> = {
  completed: {
    size: 'w-20 h-20',
    bgColor: 'bg-primary',
    textColor: 'text-on-primary',
    borderColor: 'border-4 border-surface-container-lowest',
    iconSize: 'text-4xl',
    icon: 'star',
    fill: 1,
    cardBg: 'bg-surface-container-lowest',
    cardText: 'text-on-surface',
    cardBorder: 'border-surface-variant',
  },
  in_progress: {
    size: 'w-24 h-24',
    bgColor: 'bg-surface-container-lowest',
    textColor: 'text-primary',
    borderColor: 'border-4 border-primary',
    iconSize: 'text-5xl',
    icon: 'play_arrow',
    fill: 1,
    cardBg: 'bg-primary',
    cardText: 'text-on-primary',
    cardBorder: 'border-primary',
  },
  locked: {
    size: 'w-16 h-16',
    bgColor: 'bg-surface-variant',
    textColor: 'text-outline',
    borderColor: 'border-2 border-surface-container-lowest',
    iconSize: 'text-2xl',
    icon: 'lock',
    fill: 1,
    cardBg: 'bg-surface-container-lowest',
    cardText: 'text-on-surface',
    cardBorder: 'border-surface-variant',
  },
}

export default function LessonNode({ lesson, position, showAnimation = false }: LessonNodeProps) {
  const cfg = statusConfig[lesson.status]
  const isLocked = lesson.status === 'locked'

  const positionClasses = {
    left: 'ml-12',
    right: 'mr-12',
    center: 'mr-8',
  }

  return (
    <div className={cx(
      'flex flex-col items-center relative',
      'group cursor-pointer',
      'squish:active',
      isLocked && 'opacity-50',
      positionClasses[position],
    )}>
      {showAnimation && (
        <div className="absolute w-24 h-24 bg-primary-container rounded-full animate-ping opacity-50 z-0"></div>
      )}

      <div className={cx(
        'rounded-full flex items-center justify-center z-10',
        'hover:scale-105 transition-transform',
        cfg.size,
        cfg.bgColor,
        cfg.textColor,
        cfg.borderColor,
        lesson.status === 'in_progress' && 'shadow-xl',
        lesson.status === 'completed' && 'shadow-lg',
        lesson.status === 'locked' && 'shadow-sm',
      )}>
        <span
          className={cx('material-symbols-outlined', cfg.iconSize)}
          style={{ fontVariationSettings: `'FILL' ${cfg.fill}` }}
        >
          {cfg.icon}
        </span>
      </div>

      <div className={cx(
        'mt-3 px-4 py-2 rounded-xl shadow-sm border text-center',
        cfg.cardBg,
        cfg.cardBorder,
        lesson.status === 'in_progress' && 'shadow-md',
      )}>
        <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-1">
          Unit {lesson.unit_number}
        </p>
        <p className={cx(
          'font-headline-lg-mobile font-bold',
          lesson.status === 'in_progress' ? 'text-xl' : 'text-lg',
          cfg.cardText,
        )}>
          {lesson.title}
        </p>
      </div>
    </div>
  )
}
