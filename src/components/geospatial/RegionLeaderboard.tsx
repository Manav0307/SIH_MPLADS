import React from 'react'
import { ArrowRight } from 'lucide-react'
import { StateAnomalyRecord } from '@/types'

interface RegionLeaderboardProps {
  states: StateAnomalyRecord[]
  selectedState?: string
  onSelectState: (stateName: string) => void
  onOpenGisModule?: () => void
}

export const RegionLeaderboard: React.FC<RegionLeaderboardProps> = ({
  states,
  selectedState,
  onSelectState,
  onOpenGisModule,
}) => {
  // Take top 4 priority anomaly states
  const topStates = [...states]
    .sort((a, b) => b.anomalyRate - a.anomalyRate)
    .slice(0, 4)

  return (
    <div className="w-full lg:w-56 flex flex-col gap-2 shrink-0 justify-between select-none">
      <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
        Top Anomaly Regions
      </div>

      <div className="flex flex-col gap-1.5">
        {topStates.map((st) => {
          const isSelected = selectedState === st.name
          const borderClass =
            st.anomalyRate >= 15
              ? 'border-l-[#EF4444]'
              : st.anomalyRate >= 10
              ? 'border-l-[#F59E0B]'
              : 'border-l-[#3B82F6]'

          const textRateClass =
            st.anomalyRate >= 15
              ? 'text-[#EF4444]'
              : st.anomalyRate >= 10
              ? 'text-[#F59E0B]'
              : 'text-[#3B82F6]'

          return (
            <div
              key={st.code}
              onClick={() => onSelectState(st.name)}
              className={`p-2 rounded bg-[#0D1424] border-l-2 ${borderClass} border border-[#232D47] hover:bg-[#161F36] transition-colors cursor-pointer ${
                isSelected ? 'bg-[#161F36] ring-1 ring-[#3B82F6]/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-[#E7EBF5] text-xs">
                  {st.name}
                </span>
                <span className={`font-mono text-[10px] ${textRateClass} font-bold`}>
                  {st.anomalyRate.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[#9AA5C1] text-[10px] font-mono mt-1">
                <span>{st.flaggedWorks} Flagged Works</span>
                <span className={`${textRateClass} font-semibold`}>
                  {st.flaggedCapital}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onOpenGisModule}
        className="w-full text-center py-1.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[#3B82F6] font-mono text-[10px] font-bold border border-[#232D47] flex items-center justify-center gap-1 transition-colors cursor-pointer"
      >
        <span>Open Interactive GIS Module</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  )
}
