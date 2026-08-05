import { Link } from 'react-router-dom'

const iconMap: Record<string, string> = {
  map: 'map',
  practice: 'style',
  sensei: 'record_voice_over',
  profile: 'person',
}

const navItemsData = [
  { id: 'map', label: 'Map', icon: 'map', path: '/' },
  { id: 'practice', label: 'Practice', icon: 'style', path: '/practice' },
  { id: 'sensei', label: 'Sensei', icon: 'record_voice_over', path: '/sensei' },
  { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' },
]

export default function DesktopNav({ active = 'map' }: { active?: string }) {
  return (
    <nav className="hidden md:flex fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-surface-container-lowest shadow-md rounded-full px-6 py-2 z-50 items-center gap-8 border border-surface-variant">
      {navItemsData.map((item) => {
        const isActive = item.id === active
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`
              flex items-center gap-2 font-label-caps text-label-caps
              transition-colors
              ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}
            `}
          >
            <span
              className="material-symbols-outlined"
              {...(isActive && { style: { fontVariationSettings: "'FILL' 1" } })}
            >
              {iconMap[item.id]}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
