import { cx } from '@/lib/utils'

interface BottomNavBarProps {
  active?: string
}

const navItems = [
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'practice', label: 'Practice', icon: 'style' },
  { id: 'sensei', label: 'Sensei', icon: 'record_voice_over' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

export default function BottomNavBar({ active = 'map' }: BottomNavBarProps) {
  const handleNavClick = (id: string) => {
    console.log('Navigate to:', id)
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md rounded-t-xl shadow-lg border-t-0 md:hidden">
      {navItems.map((item) => {
        const isActive = item.id === active
        const isFab = item.id === 'sensei'

        if (isFab) {
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cx(
                'flex flex-col items-center justify-center',
                'text-on-surface-variant dark:text-outline-variant p-2',
                'hover:text-secondary dark:hover:text-secondary-fixed-dim',
                'hover:scale-105 active:scale-90 transition-all duration-150',
                '-mt-8',
              )}
            >
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-on-primary shadow-lg border-4 border-surface-container-lowest">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <span className="font-label-caps text-label-caps mt-1">{item.label}</span>
            </button>
          )
        }

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cx(
              'flex flex-col items-center justify-center',
              'text-on-surface-variant dark:text-outline-variant p-2',
              'hover:text-secondary dark:hover:text-secondary-fixed-dim',
              'hover:scale-105 active:scale-90 transition-all duration-150',
              isActive && 'bg-primary-container dark:bg-primary-fixed-variant text-on-primary-container dark:text-on-primary-fixed-variant rounded-full px-4 py-1',
            )}
          >
            <span
              className="material-symbols-outlined text-2xl mb-1"
              style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
