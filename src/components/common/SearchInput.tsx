import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  shortcut?: string
  scopeTag?: string
  size?: 'compact' | 'standard'
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      placeholder = "Search projects, MPs, vendors, agencies, villages... (Press '/' to focus)",
      shortcut = '/',
      scopeTag = 'DB: ALL',
      size = 'compact',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    // Merge internal ref with forwarded ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === '/' &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const heightClass = size === 'compact' ? 'h-7' : 'h-8'

    return (
      <div className="relative flex items-center w-full">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'w-full bg-[#0A0E1A] border border-[#232D47] rounded pl-8 pr-20 text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] transition-colors',
            heightClass,
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
          {scopeTag && (
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
              {scopeTag}
            </span>
          )}
          {shortcut && (
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
              {shortcut}
            </span>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
