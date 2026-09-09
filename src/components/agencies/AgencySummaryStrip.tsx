import React from 'react'
import {
  Building2,
  ShieldAlert,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'

interface AgencySummaryStripProps {
  agenciesMonitored: number
  activeAgencies: number
  highRiskAgencies: number
  projectsExecuted: number
  totalSanctioned: string
  totalDisbursed: string
  flaggedProjectsCount: number
}

export const AgencySummaryStrip: React.FC<AgencySummaryStripProps> = ({
  agenciesMonitored,
  activeAgencies,
  highRiskAgencies,
  projectsExecuted,
  totalSanctioned,
  totalDisbursed,
  flaggedProjectsCount,
}) => {
  const highRiskPct =
    agenciesMonitored > 0
      ? ((highRiskAgencies / agenciesMonitored) * 100).toFixed(1)
      : '0.0'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#0D1424] border border-[#232D47] rounded-lg p-2.5 select-none shadow-sm">
      {/* 1. Agencies Monitored */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <Building2 className="w-3 h-3 text-[#3B82F6]" />
          AGENCIES MONITORED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {agenciesMonitored}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">
            ({activeAgencies} ACTIVE)
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Executing Authorities
        </span>
      </div>

      {/* 2. High-Risk Agencies */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
          HIGH-RISK AGENCIES
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#EF4444]">
            {highRiskAgencies}
          </span>
          <span className="font-mono text-[10px] text-[#EF4444]/80">
            ({highRiskPct}%)
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Risk Score &ge; 70 Threshold
        </span>
      </div>

      {/* 3. Projects Executed */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <FolderKanban className="w-3 h-3 text-[#3B82F6]" />
          PROJECTS EXECUTED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {projectsExecuted}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">WORKS</span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Across All Departments
        </span>
      </div>

      {/* 4. Total Sanctioned */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
          TOTAL SANCTIONED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {totalSanctioned}
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Statutory Capital Approved
        </span>
      </div>

      {/* 5. Total Disbursed */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-[#22C55E]" />
          TOTAL DISBURSED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#22C55E]">
            {totalDisbursed}
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          PFMS Released Capital
        </span>
      </div>

      {/* 6. Flagged Projects */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#F59E0B] tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
          FLAGGED PROJECTS
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#F59E0B]">
            {flaggedProjectsCount}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">WORKS</span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Audit Intervention Required
        </span>
      </div>
    </div>
  )
}
