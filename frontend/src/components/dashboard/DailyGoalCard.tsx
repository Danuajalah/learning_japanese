import { cx } from '@/lib/utils'

interface DailyGoalProps {
  completed: number
  total: number
  xp: number
}

export default function DailyGoalCard({ completed, total }: DailyGoalProps) {
  const percentage = Math.round((completed / total) * 100)

  return (
    <section
      className={cx(
        'bg-surface-container-lowest rounded-xl p-5 mb-8 shadow-sm border border-surface-variant relative overflow-hidden',
        'group hover:shadow-md transition-shadow'
      )}
    >
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-9xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          target
        </span>
      </div>
      <div className="relative z-10">
        <h2 className="font-label-caps text-label-caps text-outline mb-1 uppercase">
          Daily Goal
        </h2>
        <div className="flex justify-between items-end mb-3">
          <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {completed}/{total} Lessons
          </p>
          <span className="font-label-caps text-label-caps text-primary bg-primary-container px-2 py-1 rounded-md">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  )
}
