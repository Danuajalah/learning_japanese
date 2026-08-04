import { cx } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:scale-102 active:scale-98 shadow-md hover:shadow-lg transition-all',
  secondary: 'border-2 border-primary text-primary bg-transparent hover:bg-primary-container hover:text-on-primary-container transition-all',
  icon: 'w-16 h-16 rounded-full flex items-center justify-center text-on-primary transition-all hover:scale-105 active:scale-90',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'font-label-caps text-label-caps font-bold rounded-xl',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        icon && 'icon-button',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
