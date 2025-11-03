import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, asChild, ...props }, ref) => {
    const baseClassName = cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-primary text-white hover:bg-primary-hover hover:scale-[1.02] shadow-sm hover:shadow-md':
          variant === 'primary',
        'border-2 border-primary text-primary hover:bg-primary hover:text-white':
          variant === 'secondary',
        'text-primary hover:bg-primary/10': variant === 'ghost',
        'px-4 py-2 text-sm': size === 'sm',
        'px-6 py-3 text-base': size === 'md',
        'px-8 py-4 text-lg': size === 'lg',
      },
      className
    )

    if (asChild && typeof children === 'object' && children !== null && 'type' in children) {
      const child = children as React.ReactElement<any>
      return <child.type {...child.props} className={cn(baseClassName, child.props.className)} />
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={baseClassName}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
