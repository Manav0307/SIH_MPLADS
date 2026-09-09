import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'toolbar'
  size?: 'compact' | 'standard' | 'lg' | 'icon'
  icon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'standard', icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-sans transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer'

    const variantStyles = {
      primary:
        'bg-accent-blue hover:bg-accent-blue-hover text-white border border-accent-blue-border font-semibold shadow-xs',
      secondary:
        'bg-surface-elevated hover:bg-surface-border text-text-primary border border-surface-border',
      destructive:
        'bg-risk-critical-bg hover:bg-[#5A1E1E] text-risk-critical border border-risk-critical-border font-semibold',
      ghost:
        'bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-transparent',
      toolbar:
        'w-7 h-7 bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-transparent hover:border-surface-border rounded',
    }

    const sizeStyles = {
      compact: 'h-7 px-2 text-xs rounded',
      standard: 'h-8 px-3 text-xs rounded',
      lg: 'h-9 px-4 text-sm rounded-md',
      icon: 'w-7 h-7 p-0 rounded',
    }

    const currentSize = variant === 'toolbar' ? '' : sizeStyles[size]

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          currentSize,
          'gap-1.5',
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
