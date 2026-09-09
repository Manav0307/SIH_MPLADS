import React from 'react'
import {
  Landmark,
  CheckCircle2,
  Receipt,
  AlertOctagon,
} from 'lucide-react'
import { DashboardKpis } from '@/types'

interface KpiGridProps {
  kpis: DashboardKpis
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3">
      {/* Card 1: Total Allocated */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group hover:border-[#353946] transition-colors select-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
              TOTAL ALLOCATED
            </span>
            <Landmark className="w-4 h-4 text-[#667090] group-hover:text-[#3B82F6] transition-colors" />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-xl lg:text-[22px] font-bold text-[#E7EBF5] tracking-tight">
              {kpis.totalAllocated.amount}
            </span>
            <span className="font-mono text-[10px] text-[#22C55E] font-bold bg-[#0F3020] border border-[#22C55E]/30 px-1.5 py-0.5 rounded">
              {kpis.totalAllocated.yoy}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#9AA5C1] font-sans text-[11px] mb-2.5">
            <span>{kpis.totalAllocated.constituencies}</span>
            <span className="font-mono text-[10px] text-[#667090]">{kpis.totalAllocated.cap}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0A0E1A] h-1.5 rounded overflow-hidden">
          <div className="bg-[#3B82F6] h-full rounded transition-all" style={{ width: `${kpis.totalAllocated.percent}%` }} />
        </div>
      </div>

      {/* Card 2: Total Sanctioned */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors select-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
              TOTAL SANCTIONED
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-xl lg:text-[22px] font-bold text-[#3B82F6] tracking-tight">
              {kpis.totalSanctioned.amount}
            </span>
            <span className="font-mono text-[10px] text-[#3B82F6] font-bold bg-[#10233F] border border-[#3B82F6]/30 px-1.5 py-0.5 rounded">
              {kpis.totalSanctioned.percent}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[#9AA5C1] font-sans text-[11px] mb-2.5">
            <span>{kpis.totalSanctioned.works}</span>
            <span className="font-mono text-[10px] text-[#667090]">{kpis.totalSanctioned.target}</span>
          </div>
        </div>

        <div className="w-full bg-[#0A0E1A] h-1.5 rounded overflow-hidden">
          <div className="bg-[#3B82F6] h-full rounded transition-all" style={{ width: `${kpis.totalSanctioned.percent}%` }} />
        </div>
      </div>

      {/* Card 3: Total Disbursed */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group hover:border-[#22C55E]/50 transition-colors select-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
              TOTAL DISBURSED
            </span>
            <Receipt className="w-4 h-4 text-[#22C55E]" />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-xl lg:text-[22px] font-bold text-[#22C55E] tracking-tight">
              {kpis.totalDisbursed.amount}
            </span>
            <span className="font-mono text-[10px] text-[#22C55E] font-bold bg-[#0F3020] border border-[#22C55E]/30 px-1.5 py-0.5 rounded">
              {kpis.totalDisbursed.percent}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[#9AA5C1] font-sans text-[11px] mb-2.5">
            <span>{kpis.totalDisbursed.unspent}</span>
            <span className="font-mono text-[10px] text-[#667090]">{kpis.totalDisbursed.pfms}</span>
          </div>
        </div>

        <div className="w-full bg-[#0A0E1A] h-1.5 rounded overflow-hidden">
          <div className="bg-[#22C55E] h-full rounded transition-all" style={{ width: `${kpis.totalDisbursed.percent}%` }} />
        </div>
      </div>

      {/* Card 4: Flagged Projects */}
      <div className="bg-[#10182B] border border-[#EF4444]/50 rounded-lg p-3 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#10182B] via-[#10182B] to-[#401515]/30 shadow-xs select-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">
              FLAGGED PROJECTS
            </span>
            <span className="font-mono text-[9px] text-[#EF4444] font-bold bg-[#401515] px-1.5 py-0.5 rounded border border-[#EF4444]/40 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#EF4444] animate-ping" />
              CRITICAL RISK ELEVATED
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-xl lg:text-[22px] font-bold text-[#EF4444] tracking-tight flex items-center gap-1.5">
              <AlertOctagon className="w-5 h-5 text-[#EF4444] shrink-0" />
              {kpis.flaggedProjects.count.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-[#EF4444] font-bold">
              {kpis.flaggedProjects.worksPercent}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#9AA5C1] font-sans text-[11px] mb-2.5">
            <span className="text-[#ffb4ab]">{kpis.flaggedProjects.capital}</span>
            <span className="font-mono text-[10px] text-[#EF4444] font-bold">{kpis.flaggedProjects.newToday} NEW TODAY</span>
          </div>
        </div>

        <div className="w-full bg-[#0A0E1A] h-1.5 rounded overflow-hidden">
          <div className="bg-[#EF4444] h-full rounded transition-all" style={{ width: `${kpis.flaggedProjects.criticalPercent}%` }} />
        </div>
      </div>
    </div>
  )
}
