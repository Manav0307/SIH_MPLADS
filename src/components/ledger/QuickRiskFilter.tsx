import React from 'react'

export type QuickRiskOption = 'All' | 'Critical' | 'High' | 'Medium' | 'Low'

interface QuickRiskFilterProps {
  selectedRisk: QuickRiskOption
  onSelectRisk: (risk: QuickRiskOption) => void
  counts: {
    all: number
    critical: number
    high: number
    medium: number
    low: number
  }
}

export const QuickRiskFilter: React.FC<QuickRiskFilterProps> = ({
  selectedRisk,
  onSelectRisk,
  counts,
}) => {
  const tabs: {
    id: QuickRiskOption
    label: string
    count: number
    activeClass: string
    inactiveClass: string
    dotClass: string
  }[] = [
    {
      id: 'All',
      label: 'ALL',
      count: counts.all,
      activeClass: 'bg-[#161F36] text-[#E7EBF5] border-[#3B82F6]',
      inactiveClass: 'text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36]/60 border-[#232D47]',
      dotClass: 'bg-[#9AA5C1]',
    },
    {
      id: 'Critical',
      label: 'CRITICAL',
      count: counts.critical,
      activeClass: 'bg-[#401515] text-[#EF4444] border-[#EF4444]',
      inactiveClass: 'text-[#EF4444]/80 hover:text-[#EF4444] hover:bg-[#401515]/40 border-[#EF4444]/30',
      dotClass: 'bg-[#EF4444]',
    },
    {
      id: 'High',
      label: 'HIGH',
      count: counts.high,
      activeClass: 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]',
      inactiveClass: 'text-[#F59E0B]/80 hover:text-[#F59E0B] hover:bg-[#3A2A0C]/40 border-[#F59E0B]/30',
      dotClass: 'bg-[#F59E0B]',
    },
    {
      id: 'Medium',
      label: 'MEDIUM',
      count: counts.medium,
      activeClass: 'bg-[#362E0C] text-[#EAB308] border-[#EAB308]',
      inactiveClass: 'text-[#EAB308]/80 hover:text-[#EAB308] hover:bg-[#362E0C]/40 border-[#EAB308]/30',
      dotClass: 'bg-[#EAB308]',
    },
    {
      id: 'Low',
      label: 'LOW',
      count: counts.low,
      activeClass: 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]',
      inactiveClass: 'text-[#22C55E]/80 hover:text-[#22C55E] hover:bg-[#0F3020]/40 border-[#22C55E]/30',
      dotClass: 'bg-[#22C55E]',
    },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto select-none py-1">
      <span className="font-mono text-[10px] text-[#667090] uppercase font-semibold mr-1 shrink-0">
        Risk Filter:
      </span>
      {tabs.map((tab) => {
        const isSelected = selectedRisk === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectRisk(tab.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
              isSelected ? tab.activeClass : tab.inactiveClass
            }`}
            aria-pressed={isSelected}
          >
            {tab.id !== 'All' && (
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tab.dotClass}`} />
            )}
            <span>{tab.label}</span>
            <span
              className={`font-tabular px-1 py-0.2 rounded text-[10px] ${
                isSelected ? 'bg-black/30' : 'bg-[#10182B]'
              }`}
            >
              {tab.count.toLocaleString()}
            </span>
          </button>
        )
      })}
    </div>
  )
}
