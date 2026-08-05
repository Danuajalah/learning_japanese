import { SenseiAvatarImage } from '@/data/senseiAssets'

interface SenseiCharacterProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export default function SenseiCharacter({ size = 'md', animate = true }: SenseiCharacterProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 md:w-20 md:h-20',
    md: 'w-40 h-40 md:w-56 md:h-56',
    lg: 'w-48 h-48 md:w-64 md:h-64',
  }

  return (
    <div className={`rounded-full bg-tertiary-container/30 relative flex items-center justify-center ${sizeClasses[size]} ${animate ? 'bouncing' : ''}`}>
      <img className="w-4/5 h-4/5 object-contain z-10 relative" src={SenseiAvatarImage} alt="Virtual Sensei" />
      <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl -z-10"></div>
      <span className="material-symbols-outlined absolute top-2 right-2 text-primary opacity-50 rotate-12" style={{ fontSize: '20px' }}>
        stars
      </span>
      <span className="material-symbols-outlined absolute bottom-2 left-2 text-secondary opacity-50 -rotate-12" style={{ fontSize: '16px' }}>
        auto_awesome
      </span>
    </div>
  )
}
