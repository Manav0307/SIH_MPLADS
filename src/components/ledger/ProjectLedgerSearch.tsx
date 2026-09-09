import React from 'react'
import { Search, X } from 'lucide-react'

interface ProjectLedgerSearchProps {
  value: string
  onChange: (query: string) => void
  onClear: () => void
  placeholder?: string
  totalMatches?: number
}

export const ProjectLedgerSearch: React.FC<ProjectLedgerSearchProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search Work ID, project, MP, constituency, vendor or agency...',
  totalMatches,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

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

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 w-4 h-4 text-[#9AA5C1] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Global search across all project ledger fields"
        className="w-full bg-[#0A0E1A] border border-[#232D47] rounded-md pl-9 pr-24 py-2 text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
      />
      <div className="absolute right-2.5 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-[#667090] hover:text-[#E7EBF5] p-0.5 rounded cursor-pointer"
            title="Clear search query"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {totalMatches !== undefined && (
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
            {totalMatches} MATCHES
          </span>
        )}

        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#667090] border border-[#232D47] hidden sm:inline-block">
          /
        </kbd>
      </div>
    </div>
  )
}
