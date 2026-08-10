import { Link } from 'react-router-dom'

export default function BottomNavBar({ active = 'map' }: { active?: string }) {
  const navItems = [
    { id: 'map', label: 'Map', icon: 'map', path: '/' },
    { id: 'practice', label: 'Practice', icon: 'style', path: '/practice' },
    { id: 'sensei', label: 'Sensei', icon: 'record_voice_over', path: '/sensei' },
    { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe pt-1 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md rounded-t-xl shadow-lg border-t-0 md:hidden">
      {navItems.map((item) => {
        const isActive = item.id === active

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center rounded-full px-3 py-1.5 transition-all duration-150 active:scale-90 ${
              isActive
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-primary-container/50 hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
