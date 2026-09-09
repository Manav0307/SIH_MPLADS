import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DemoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string
  variant?: 'demo' | 'simulation' | 'mock' | 'system'
  size?: 'sm' | 'md'
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'DEMONSTRATION',
  variant = 'demo',
  size = 'sm',
  className,
  ...props
}) => {
  const variantStyles = {
    demo: 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/50',
    simulation: 'bg-[#10233F] text-[#3B82F6] border-[#3B82F6]/50',
    mock: 'bg-[#161F36] text-[#adc6ff] border-[#232D47]',
    system: 'bg-[#0A0E1A] text-[#9AA5C1] border-[#232D47]',
  }

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.2',
    md: 'text-[10px] px-2 py-0.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono font-bold uppercase tracking-wider rounded border select-none shrink-0',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <Sparkles className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </span>
  )
}
