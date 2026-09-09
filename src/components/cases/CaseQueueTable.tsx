import React from 'react'
import {
  ChevronRight,
  FolderOpen,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { CaseRecord } from '@/types/cases'
import { RiskBadge } from '@/components/common/RiskBadge'
import { cn } from '@/lib/utils'

interface CaseQueueTableProps {
  cases: CaseRecord[]
  selectedCaseId: string | null
  onSelectCase: (c: CaseRecord) => void
  onOpenDossier: (c: CaseRecord) => void
}

export const CaseQueueTable: React.FC<CaseQueueTableProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onOpenDossier,
}) => {
  const getStatusBadge = (status: CaseRecord['status']) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#10233F] text-[#3B82F6] border border-[#3B82F6]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            New
          </span>
        )
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#362E0C] text-[#EAB308] border border-[#EAB308]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
            Under Review
          </span>
        )
      case 'Field Verification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#3A2A0C] text-[#F59E0B] border border-[#F59E0B]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            Field Verification
          </span>
        )
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#401515] text-[#EF4444] border border-[#EF4444]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
            Escalated
          </span>
        )
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#0F3020] text-[#22C55E] border border-[#22C55E]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Resolved
          </span>
        )
      default:
        return null
    }
  }

  if (cases.length === 0) {
    return (
      <div className="p-12 text-center bg-[#10182B] rounded-lg border border-[#232D47] text-[#9AA5C1] space-y-2">
        <ShieldCheck className="w-8 h-8 text-[#667090] mx-auto" />
        <p className="text-sm font-semibold text-[#E7EBF5]">No Cases Found</p>
        <p className="text-xs text-[#667090]">
          Adjust filters or search query to view statutory audit cases.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#232D47] overflow-hidden bg-[#10182B] select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D1424] border-b border-[#232D47] font-mono text-[10px] uppercase text-[#9AA5C1] tracking-wider">
              <th className="py-2.5 px-3">Case ID</th>
              <th className="py-2.5 px-3">Severity & Risk</th>
              <th className="py-2.5 px-3">Project & Work Code</th>
              <th className="py-2.5 px-3">Vendor / Agency</th>
              <th className="py-2.5 px-3 text-right">Exposure</th>
              <th className="py-2.5 px-3">Assigned Officer</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Updated</th>
              <th className="py-2.5 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232D47]/60">
            {cases.map((c) => {
              const isSelected = selectedCaseId === c.id
              const isCritical = c.severity === 'critical'

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className={cn(
                    'transition-colors cursor-pointer group',
                    isSelected
                      ? 'bg-[#161F36] text-[#E7EBF5]'
                      : 'hover:bg-[#131D31] text-[#CAD2E2]'
                  )}
                >
                  {/* Case ID & Findings badge */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-[#adc6ff] group-hover:text-white">
                        {c.id}
                      </span>
                      <span className="font-mono text-[10px] text-[#667090] mt-0.5">
                        {c.anomalyCount} {c.anomalyCount === 1 ? 'finding' : 'findings'}
                      </span>
                    </div>
                  </td>

                  {/* Severity & Risk Score */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <RiskBadge
                        level={c.severity}
                        score={c.riskScore}
                        size="sm"
                        withPip={isCritical}
                        pulse={isCritical}
                      />
                    </div>
                  </td>

                  {/* Project Title & Work Code */}
                  <td className="py-2.5 px-3 max-w-[280px]">
                    <div className="truncate font-medium text-[#E7EBF5]" title={c.projectTitle}>
                      {c.projectTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[#9AA5C1] truncate">
                      <span className="text-[#3B82F6]">{c.workCode}</span>
                      <span>•</span>
                      <span>{c.district}, {c.state}</span>
                    </div>
                  </td>

                  {/* Vendor & Agency */}
                  <td className="py-2.5 px-3 max-w-[200px]">
                    <div className="truncate text-xs font-medium text-[#E7EBF5]" title={c.vendor}>
                      {c.vendor}
                    </div>
                    <div className="truncate text-[10px] text-[#667090] mt-0.5" title={c.agency}>
                      {c.agency}
                    </div>
                  </td>

                  {/* Financial Exposure */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-xs text-[#F59E0B] font-tabular">
                      {c.financialExposureDisplay}
                    </span>
                    <span className="block text-[10px] font-mono text-[#667090]">
                      At Risk
                    </span>
                  </td>

                  {/* Assigned Officer */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center font-mono text-[10px] font-bold text-[#adc6ff] shrink-0">
                        {c.assignedOfficer.avatar || 'UA'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-xs text-[#E7EBF5] font-medium max-w-[130px]">
                          {c.assignedOfficer.name}
                        </span>
                        <span className="truncate text-[10px] text-[#667090] max-w-[130px]">
                          {c.assignedOfficer.designation}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>

                  {/* Last Updated */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-[#9AA5C1]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#667090]" />
                      <span>{c.lastUpdated}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenDossier(c)
                        }}
                        className="p-1 rounded hover:bg-[#232D47] text-[#9AA5C1] hover:text-[#3B82F6] transition-colors cursor-pointer"
                        title="Open Statutory Project Dossier"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-transform',
                        isSelected ? 'text-[#3B82F6] translate-x-0.5' : 'text-[#667090]'
                      )} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
