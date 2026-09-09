import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'accent' | 'success'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-mono font-bold uppercase tracking-wider select-none rounded shrink-0'

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2 py-0.5 leading-tight',
  }

  const variantStyles = {
    default: 'bg-surface-elevated text-text-secondary border border-surface-border',
    outline: 'bg-transparent text-text-secondary border border-surface-border',
    secondary: 'bg-[#1b1f2c] text-[#dfe2f3] border border-surface-border',
    accent: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30',
    success: 'bg-risk-low-bg text-risk-low border border-risk-low-border',
  }

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
