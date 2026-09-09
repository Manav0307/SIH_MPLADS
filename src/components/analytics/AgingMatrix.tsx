import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { AgingBucket } from '@/types'

interface AgingMatrixProps {
  buckets: AgingBucket[]
  onEscalateBatch?: () => void
}

export const AgingMatrix: React.FC<AgingMatrixProps> = ({
  buckets,
  onEscalateBatch,
}) => {
  return (
    <div className="bg-[#0D1424] border border-[#232D47] rounded p-2.5 flex flex-col select-none">
      {/* Title & Held Capital */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
          Aging of 16,079 Works Stuck in &quot;Sanctioned&quot;
        </span>
        <span className="font-mono text-[10px] text-[#EF4444] font-bold bg-[#401515] px-1.5 py-0.5 rounded border border-[#EF4444]/40">
          ₹292 Cr HELD
        </span>
      </div>

      {/* 5 Buckets Grid */}
      <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
        {buckets.map((b) => {
          const isCrit = b.statusType === 'crit'
          const isHigh = b.statusType === 'high'
          const isWatch = b.statusType === 'watch'

          const containerClass = isCrit
            ? 'bg-[#401515]/40 border-[#EF4444]/50'
            : isHigh
            ? 'bg-[#3A2A0C]/40 border-[#F59E0B]/40'
            : 'bg-[#10182B] border-[#232D47]'

          const numberClass = isCrit
            ? 'text-[#EF4444]'
            : isHigh
            ? 'text-[#F59E0B]'
            : isWatch
            ? 'text-[#9AA5C1]'
            : 'text-[#E7EBF5]'

          const tagClass = isCrit
            ? 'text-[#EF4444] font-bold'
            : isHigh
            ? 'text-[#F59E0B]'
            : isWatch
            ? 'text-[#F59E0B]'
            : 'text-[#22C55E]'

          return (
            <div
              key={b.range}
              className={`p-1.5 rounded border ${containerClass} flex flex-col items-center justify-center`}
            >
              <div
                className={`text-[9px] ${
                  isCrit ? 'text-[#EF4444] font-bold' : isHigh ? 'text-[#F59E0B] font-bold' : 'text-[#667090]'
                }`}
              >
                {b.range}
              </div>
              <div className={`text-xs font-bold ${numberClass} mt-0.5 font-tabular`}>
                {b.count.toLocaleString()}
              </div>
              <div className={`text-[9px] ${tagClass}`}>{b.label}</div>
            </div>
          )
        })}
      </div>

      {/* Bottom Alert & Escalate Action */}
      <div className="flex items-center justify-between text-[11px] font-sans text-[#9AA5C1] mt-2 pt-1.5 border-t border-[#232D47]">
        <span className="text-[#EF4444] flex items-center gap-1 font-semibold text-[11px]">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>₹94.0 Cr public capital frozen &gt;24 months without progress</span>
        </span>

        <button
          type="button"
          onClick={onEscalateBatch}
          className="font-mono text-[10px] text-[#3B82F6] hover:underline flex items-center gap-0.5 font-bold cursor-pointer shrink-0"
        >
          <span>Escalate Batch</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
