import React from 'react'
import {
  FolderKanban,
  AlertOctagon,
  MapPin,
  Send,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react'
import { CaseSummaryKpis } from '@/types/cases'
import { cn } from '@/lib/utils'

interface CaseSummaryCardsProps {
  kpis: CaseSummaryKpis
  activeStatus: string
  activeSeverity: string
  onSelectStatus: (status: string) => void
  onSelectSeverity: (severity: string) => void
}

export const CaseSummaryCards: React.FC<CaseSummaryCardsProps> = ({
  kpis,
  activeStatus,
  activeSeverity,
  onSelectStatus,
  onSelectSeverity,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 select-none">
      {/* 1. Open Cases */}
      <div
        onClick={() => {
          onSelectStatus(activeStatus === 'Open' ? 'All' : 'Open')
          onSelectSeverity('All')
        }}
        className={cn(
          'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#3B82F6]',
          activeStatus === 'Open'
            ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50 bg-[#10233F]/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
            : 'border-[#232D47]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1] group-hover:text-[#adc6ff]">
            Open Cases
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]" />
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#E7EBF5] font-tabular">
            {kpis.openCases}
          </span>
          <span className="text-[10px] font-mono text-[#9AA5C1]">Active</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
          <FolderKanban className="w-3 h-3 text-[#3B82F6]" />
          <span>Under Oversight</span>
        </div>
      </div>

      {/* 2. Critical Cases */}
      <div
        onClick={() => {
          onSelectSeverity(activeSeverity === 'critical' ? 'All' : 'critical')
        }}
        className={cn(
          'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#EF4444]',
          activeSeverity === 'critical'
            ? 'border-[#EF4444] ring-1 ring-[#EF4444]/50 bg-[#401515]/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
            : 'border-[#232D47]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#EF4444]">
            Critical Cases
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]" />
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#EF4444] font-tabular">
            {kpis.criticalCases}
          </span>
          <span className="text-[10px] font-mono text-[#EF4444]/80 font-semibold">Priority 1</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#EF4444]/80">
          <AlertOctagon className="w-3 h-3 text-[#EF4444]" />
          <span>Score ≥ 85</span>
        </div>
      </div>

      {/* 3. Under Field Verification */}
      <div
        onClick={() => {
          onSelectStatus(activeStatus === 'Field Verification' ? 'All' : 'Field Verification')
        }}
        className={cn(
          'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#F59E0B]',
          activeStatus === 'Field Verification'
            ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/50 bg-[#3A2A0C]/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
            : 'border-[#232D47]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B]">
            Field Verification
          </span>
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#E7EBF5] font-tabular">
            {kpis.underFieldVerification}
          </span>
          <span className="text-[10px] font-mono text-[#F59E0B]">On-Site</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
          <MapPin className="w-3 h-3 text-[#F59E0B]" />
          <span>EE Ground Audit</span>
        </div>
      </div>

      {/* 4. Escalated */}
      <div
        onClick={() => {
          onSelectStatus(activeStatus === 'Escalated' ? 'All' : 'Escalated')
        }}
        className={cn(
          'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#F43F5E]',
          activeStatus === 'Escalated'
            ? 'border-[#F43F5E] ring-1 ring-[#F43F5E]/50 bg-[#401515]/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
            : 'border-[#232D47]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#F43F5E]">
            Escalated
          </span>
          <div className="w-2 h-2 rounded-full bg-[#F43F5E]" />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#E7EBF5] font-tabular">
            {kpis.escalated}
          </span>
          <span className="text-[10px] font-mono text-[#F43F5E]">CAG / MoSPI</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
          <Send className="w-3 h-3 text-[#F43F5E]" />
          <span>Enforcement Cell</span>
        </div>
      </div>

      {/* 5. Resolved */}
      <div
        onClick={() => {
          onSelectStatus(activeStatus === 'Resolved' ? 'All' : 'Resolved')
        }}
        className={cn(
          'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#22C55E]',
          activeStatus === 'Resolved'
            ? 'border-[#22C55E] ring-1 ring-[#22C55E]/50 bg-[#0F3020]/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
            : 'border-[#232D47]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#22C55E]">
            Resolved
          </span>
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#22C55E] font-tabular">
            {kpis.resolved}
          </span>
          <span className="text-[10px] font-mono text-[#22C55E]">Closed</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
          <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
          <span>Statutory Cleared</span>
        </div>
      </div>

      {/* 6. Total Financial Exposure */}
      <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1]">
            Financial Exposure
          </span>
          <IndianRupee className="w-3.5 h-3.5 text-[#F59E0B]" />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#F59E0B] font-tabular">
            {kpis.totalFinancialExposureDisplay}
          </span>
          <span className="text-[10px] font-mono text-[#9AA5C1]">At Risk</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
          <span className="font-mono text-[#3B82F6]">PFMS Discrepancy</span>
        </div>
      </div>
    </div>
  )
}
