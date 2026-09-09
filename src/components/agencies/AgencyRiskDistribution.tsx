import React from 'react'
import { ShieldAlert } from 'lucide-react'

interface RiskCategory {
  count: number
  percent: number
}

interface AgencyRiskDistributionProps {
  critical: RiskCategory
  high: RiskCategory
  medium: RiskCategory
  low: RiskCategory
  total: number
}

export const AgencyRiskDistribution: React.FC<AgencyRiskDistributionProps> = ({
  critical,
  high,
  medium,
  low,
  total,
}) => {
  if (total === 0) return null

  const critPct = critical.percent
  const highPct = high.percent
  const medPct = medium.percent
  const lowPct = low.percent

  return (
    <div className="flex flex-col gap-1.5 p-2.5 bg-[#10182B] border border-[#232D47] rounded-lg select-none">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#3B82F6]" />
          Agency Risk Exposure Distribution
        </span>
        <span className="font-mono text-[10px] text-[#667090]">
          Total Monitored: {total} Agencies
        </span>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="h-2.5 w-full bg-[#0A0E1A] rounded overflow-hidden flex border border-[#232D47]">
        {critPct > 0 && (
          <div
            style={{ width: `${critPct}%` }}
            className="bg-[#EF4444] h-full transition-all duration-300"
            title={`Critical: ${critical.count} (${critPct}%)`}
          />
        )}
        {highPct > 0 && (
          <div
            style={{ width: `${highPct}%` }}
            className="bg-[#F59E0B] h-full transition-all duration-300"
            title={`High: ${high.count} (${highPct}%)`}
          />
        )}
        {medPct > 0 && (
          <div
            style={{ width: `${medPct}%` }}
            className="bg-[#EAB308] h-full transition-all duration-300"
            title={`Medium: ${medium.count} (${medPct}%)`}
          />
        )}
        {lowPct > 0 && (
          <div
            style={{ width: `${lowPct}%` }}
            className="bg-[#22C55E] h-full transition-all duration-300"
            title={`Low: ${low.count} (${lowPct}%)`}
          />
        )}
      </div>

      {/* Legend & Count */}
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-0.5 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#EF4444]" />
          <span className="text-[#EF4444] font-bold">CRITICAL (&ge;85): {critical.count}</span>
          <span className="text-[#667090]">({critPct}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#F59E0B]" />
          <span className="text-[#F59E0B] font-bold">HIGH (70-84): {high.count}</span>
          <span className="text-[#667090]">({highPct}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#EAB308]" />
          <span className="text-[#EAB308] font-bold">MEDIUM (40-69): {medium.count}</span>
          <span className="text-[#667090]">({medPct}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#22C55E]" />
          <span className="text-[#22C55E] font-bold">LOW (&lt;40): {low.count}</span>
          <span className="text-[#667090]">({lowPct}%)</span>
        </div>
      </div>
    </div>
  )
}
