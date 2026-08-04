import { navItemsData } from '@/data/navItems'

const iconMap: Record<string, string> = {
  map: 'map',
  practice: 'style',
  sensei: 'record_voice_over',
  profile: 'person',
}

export default function DesktopNav({ active = 'map' }: { active?: string }) {
  return (
    <nav className="hidden md:flex fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-surface-container-lowest shadow-md rounded-full px-6 py-2 z-50 items-center gap-8 border border-surface-variant">
      {navItemsData.map((item) => {
        const isActive = item.id === active
        return (
          <a
            key={item.id}
            href="#"
            className={`
              flex items-center gap-2 font-label-caps text-label-caps
              transition-colors
              ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}
            `}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>
              {iconMap[item.id]}
            </span>
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
