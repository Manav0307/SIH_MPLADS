import React from 'react'
import { cn } from '@/lib/utils'

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string
  variant?: 'live' | 'alert' | 'synced' | 'neutral'
  pulse?: boolean
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = 'live',
  pulse = true,
  className,
  ...props
}) => {
  const variantStyles = {
    live: {
      pill: 'bg-risk-low-bg/60 border-risk-low-border text-risk-low',
      dot: 'bg-risk-low',
    },
    alert: {
      pill: 'bg-risk-critical-bg/60 border-risk-critical-border text-risk-critical',
      dot: 'bg-risk-critical',
    },
    synced: {
      pill: 'bg-risk-info-bg/60 border-risk-info-border text-risk-info',
      dot: 'bg-risk-info',
    },
    neutral: {
      pill: 'bg-surface-elevated border-surface-border text-text-secondary',
      dot: 'bg-text-muted',
    },
  }

  const { pill, dot } = variantStyles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border select-none',
        pill,
        className
      )}
      {...props}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {pulse && (
          <span
            className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dot)}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', dot)} />
      </span>
      <span>{label}</span>
    </span>
  )
}
