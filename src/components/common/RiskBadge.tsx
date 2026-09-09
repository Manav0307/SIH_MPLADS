import React from 'react'
import { cn } from '@/lib/utils'
import { RiskLevel } from '@/types'

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel
  label?: string
  score?: number
  withPip?: boolean
  pulse?: boolean
  size?: 'sm' | 'md'
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  label,
  score,
  withPip = false,
  pulse = false,
  size = 'sm',
  className,
  ...props
}) => {
  const displayLabel = label || level.toUpperCase()

  const levelStyles: Record<RiskLevel, { container: string; pip: string; glow?: string }> = {
    critical: {
      container: 'bg-[#401515] border-[#EF444460] text-[#EF4444]',
      pip: 'bg-[#EF4444]',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.25)]',
    },
    high: {
      container: 'bg-[#3A2A0C] border-[#F59E0B60] text-[#F59E0B]',
      pip: 'bg-[#F59E0B]',
      glow: '',
    },
    medium: {
      container: 'bg-[#362E0C] border-[#EAB30860] text-[#EAB308]',
      pip: 'bg-[#EAB308]',
      glow: '',
    },
    low: {
      container: 'bg-[#0F3020] border-[#22C55E60] text-[#22C55E]',
      pip: 'bg-[#22C55E]',
      glow: '',
    },
    info: {
      container: 'bg-[#10233F] border-[#3B82F660] text-[#3B82F6]',
      pip: 'bg-[#3B82F6]',
      glow: '',
    },
  }

  const currentStyle = levelStyles[level]

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 leading-none',
    md: 'text-xs px-2 py-0.5 gap-1.5 leading-tight',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold uppercase tracking-wider rounded border select-none shrink-0',
        currentStyle.container,
        sizeStyles[size],
        currentStyle.glow,
        className
      )}
      {...props}
    >
      {withPip && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                currentStyle.pip
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', currentStyle.pip)} />
        </span>
      )}
      <span>{displayLabel}</span>
      {score !== undefined && (
        <span className="font-tabular ml-0.5 opacity-90 border-l border-current/30 pl-1">
          {score}
        </span>
      )}
    </span>
  )
}
