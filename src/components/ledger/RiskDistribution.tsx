import React from 'react'

interface RiskDistributionProps {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({
  critical,
  high,
  medium,
  low,
  total,
}) => {
  if (total === 0) {
    return null
  }

  const critPct = (critical / total) * 100
  const highPct = (high / total) * 100
  const medPct = (medium / total) * 100
  const lowPct = (low / total) * 100

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-[#10182B] border border-[#232D47] rounded-lg select-none">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
          Risk Severity Distribution
        </span>
        <span className="font-mono text-[10px] text-[#667090]">
          Total Monitored: {total.toLocaleString()}
        </span>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="h-3 w-full bg-[#0A0E1A] rounded overflow-hidden flex border border-[#232D47]">
        {critPct > 0 && (
          <div
            style={{ width: `${critPct}%` }}
            className="bg-[#EF4444] h-full transition-all duration-300"
            title={`Critical: ${critical} (${critPct.toFixed(1)}%)`}
          />
        )}
        {highPct > 0 && (
          <div
            style={{ width: `${highPct}%` }}
            className="bg-[#F59E0B] h-full transition-all duration-300"
            title={`High: ${high} (${highPct.toFixed(1)}%)`}
          />
        )}
        {medPct > 0 && (
          <div
            style={{ width: `${medPct}%` }}
            className="bg-[#EAB308] h-full transition-all duration-300"
            title={`Medium: ${medium} (${medPct.toFixed(1)}%)`}
          />
        )}
        {lowPct > 0 && (
          <div
            style={{ width: `${lowPct}%` }}
            className="bg-[#22C55E] h-full transition-all duration-300"
            title={`Low: ${low} (${lowPct.toFixed(1)}%)`}
          />
        )}
      </div>

      {/* Legend & Count */}
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-0.5 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#EF4444]" />
          <span className="text-[#EF4444] font-bold">CRITICAL: {critical}</span>
          <span className="text-[#667090]">({critPct.toFixed(1)}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#F59E0B]" />
          <span className="text-[#F59E0B] font-bold">HIGH: {high}</span>
          <span className="text-[#667090]">({highPct.toFixed(1)}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#EAB308]" />
          <span className="text-[#EAB308] font-bold">MEDIUM: {medium}</span>
          <span className="text-[#667090]">({medPct.toFixed(1)}%)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#22C55E]" />
          <span className="text-[#22C55E] font-bold">LOW: {low}</span>
          <span className="text-[#667090]">({lowPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  )
}
