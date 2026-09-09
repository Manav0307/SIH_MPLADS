import React from 'react'
import { Users, MapPin, Landmark, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'

interface MpSummaryStripProps {
  mpsCount: number
  constituenciesCount: number
  totalAllocated: string
  totalSanctioned: string
  totalDisbursed: string
  disbursedPct: number
  flaggedCount: number
  totalProjects: number
}

export const MpSummaryStrip: React.FC<MpSummaryStripProps> = ({
  mpsCount,
  constituenciesCount,
  totalAllocated,
  totalSanctioned,
  totalDisbursed,
  disbursedPct,
  flaggedCount,
  totalProjects,
}) => {
  const flaggedPct = totalProjects > 0 ? ((flaggedCount / totalProjects) * 100).toFixed(1) : '0.0'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#0D1424] border border-[#232D47] rounded-lg p-2.5 select-none shadow-sm">
      {/* 1. MPs Monitored */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <Users className="w-3 h-3 text-[#3B82F6]" />
          MPS MONITORED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {mpsCount}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">PARLIAMENTARY</span>
        </div>
      </div>

      {/* 2. Constituencies */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#3B82F6]" />
          CONSTITUENCIES
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {constituenciesCount}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">ELECTORAL</span>
        </div>
      </div>

      {/* 3. Allocated */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <Landmark className="w-3 h-3 text-[#9AA5C1]" />
          ALLOCATED
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {totalAllocated}
          </span>
        </div>
      </div>

      {/* 4. Sanctioned */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
          SANCTIONED
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {totalSanctioned}
          </span>
        </div>
      </div>

      {/* 5. Disbursed */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-[#22C55E]" />
          DISBURSED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#22C55E]">
            {totalDisbursed}
          </span>
          <span className="font-mono text-[10px] text-[#22C55E]/80">({disbursedPct}%)</span>
        </div>
      </div>

      {/* 6. Flagged */}
      <div className="flex flex-col border-l border-[#232D47] pl-3 col-span-2 sm:col-span-1">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
          FLAGGED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#EF4444]">
            {flaggedCount}
          </span>
          <span className="font-mono text-[10px] text-[#EF4444]/80">({flaggedPct}%)</span>
        </div>
      </div>
    </div>
  )
}
