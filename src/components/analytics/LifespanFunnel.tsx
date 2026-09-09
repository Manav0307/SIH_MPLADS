import React from 'react'
import { LifespanStage } from '@/types'

interface LifespanFunnelProps {
  stages: LifespanStage[]
}

export const LifespanFunnel: React.FC<LifespanFunnelProps> = ({ stages }) => {
  return (
    <div className="flex flex-col gap-2 font-mono text-[10px] select-none">
      {stages.map((st) => {
        const isSanctioned = st.stageNumber === 2
        const isDisbursed = st.stageNumber === 3
        const isCompleted = st.stageNumber === 4

        const titleColor = isSanctioned
          ? 'text-[#3B82F6]'
          : isDisbursed
          ? 'text-[#22C55E]'
          : isCompleted
          ? 'text-[#9AA5C1]'
          : 'text-[#E7EBF5]'

        const barBg = isSanctioned
          ? 'bg-[#3B82F6]'
          : isDisbursed
          ? 'bg-[#22C55E]'
          : isCompleted
          ? 'bg-[#353946]'
          : 'bg-[#3B82F6]/70'

        const barText = isCompleted ? 'text-[#E7EBF5]' : 'text-white'

        return (
          <div key={st.stageNumber} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className={`${titleColor} font-bold`}>{st.title}</span>
              <span className={`${titleColor} font-bold`}>{st.worksDisplay}</span>
            </div>

            <div className="w-full bg-[#0A0E1A] h-3.5 rounded overflow-hidden p-0.5 border border-[#232D47]">
              <div
                className={`${barBg} h-full rounded flex items-center px-2 text-[9px] ${barText} font-bold transition-all duration-500`}
                style={{ width: `${st.percentage}%` }}
              >
                {st.capitalDisplay}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
