import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[#10182B] border border-[#232D47]',
      elevated: 'bg-[#161F36] border border-[#232D47]',
      subtle: 'bg-[#0A0E1A] border border-[#232D47]',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg overflow-hidden flex flex-col text-[#E7EBF5]',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  telemetry?: React.ReactNode
  action?: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, telemetry, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'h-9 px-3 flex items-center justify-between border-b border-[#232D47] bg-[#0D1424] shrink-0',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 min-w-0">
          {children}
          {telemetry && (
            <span className="font-mono text-[11px] text-[#667090] shrink-0">
              {telemetry}
            </span>
          )}
        </div>
        {action && <div className="flex items-center gap-1 shrink-0">{action}</div>}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('text-[13px] font-semibold text-[#E7EBF5] tracking-tight truncate', className)}
      {...props}
    >
      {children}
    </h3>
  )
})
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('p-3 flex-1 min-h-0', className)} {...props} />
})
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-3 py-2 border-t border-[#232D47] bg-[#0D1424]/40 shrink-0 text-xs text-[#9AA5C1]', className)}
      {...props}
    />
  )
})
CardFooter.displayName = 'CardFooter'
