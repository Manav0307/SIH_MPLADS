import React from 'react'
import { Network, Store, FileText, ChevronRight } from 'lucide-react'
import { ProjectRecord, VendorRecord } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

interface VendorNetworkProps {
  currentProject: ProjectRecord
  vendorProjects: ProjectRecord[]
  vendorRecord?: VendorRecord
  onSelectProject: (project: ProjectRecord) => void
}

export const VendorNetwork: React.FC<VendorNetworkProps> = ({
  currentProject,
  vendorProjects,
  vendorRecord,
  onSelectProject,
}) => {
  const vendorName = currentProject.vendor
  const vendorGst = currentProject.vendorGst || '27AAACA9921D1Z4'

  const riskScore = vendorRecord?.riskScore || (currentProject.riskLevel === 'critical' ? 94 : 84)
  const flaggedCount = vendorRecord?.flaggedWorksCount || vendorProjects.length
  const totalDisbursed = vendorRecord?.totalDisbursed || '₹34.8 Cr'

  return (
    <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
        <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-[#3B82F6]" />
          Vendor Contract Syndicate Tree
        </span>
        <span className="font-mono text-[10px] text-[#667090]">NETWORK TOPOLOGY</span>
      </div>

      {/* Root Vendor Node */}
      <div className="p-2.5 rounded bg-[#10182B] border border-[#232D47] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="font-sans text-xs font-bold text-[#E7EBF5]">{vendorName}</h5>
              <span className="font-mono text-[10px] text-[#9AA5C1]">GSTIN: {vendorGst}</span>
            </div>
          </div>
          <RiskBadge
            level={riskScore >= 90 ? 'critical' : 'high'}
            score={riskScore}
            size="sm"
          />
        </div>

        {/* Vendor Telemetry Strip */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#161F36] text-[10px] font-mono">
          <div className="p-1 rounded bg-[#0A0E1A] border border-[#232D47]">
            <span className="text-[#667090] block">Vendor Risk</span>
            <span className="text-[#EF4444] font-bold">{riskScore}/100</span>
          </div>
          <div className="p-1 rounded bg-[#0A0E1A] border border-[#232D47]">
            <span className="text-[#667090] block">Flagged Works</span>
            <span className="text-[#F59E0B] font-bold">{flaggedCount} Projects</span>
          </div>
          <div className="p-1 rounded bg-[#0A0E1A] border border-[#232D47]">
            <span className="text-[#667090] block">Total Payout</span>
            <span className="text-[#E7EBF5] font-bold">{totalDisbursed}</span>
          </div>
        </div>
      </div>

      {/* Tree Visualization with Branch Lines */}
      <div className="space-y-1 pl-2">
        <span className="font-mono text-[10px] uppercase text-[#667090] font-bold">
          Associated Contract Nodes ({vendorProjects.length}):
        </span>

        <div className="space-y-1.5 mt-1 font-mono text-xs">
          {vendorProjects.map((p, idx) => {
            const isLast = idx === vendorProjects.length - 1
            const isCurrent = p.id === currentProject.id

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className={`flex items-center gap-2 p-1.5 rounded transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#161F36] border border-[#3B82F6]/60 text-[#adc6ff]'
                    : 'bg-[#10182B]/60 hover:bg-[#161F36] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5]'
                }`}
              >
                {/* Branch Line Symbol */}
                <span className="text-[#667090] font-mono select-none">
                  {isLast ? '└──' : '├──'}
                </span>

                <FileText className="w-3 h-3 text-[#3B82F6] shrink-0" />

                <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                  <div className="truncate">
                    <span className="font-bold text-[11px] text-[#E7EBF5]">{p.workCode}</span>
                    <span className="text-[10px] text-[#9AA5C1] ml-1.5 truncate hidden sm:inline">
                      {p.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-[#EF4444] font-tabular font-bold">
                      {p.disbursedDisplay}
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                        p.riskLevel === 'critical'
                          ? 'bg-[#401515] text-[#EF4444]'
                          : 'bg-[#3A2A0C] text-[#F59E0B]'
                      }`}
                    >
                      {p.riskScore}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-3 h-3 text-[#667090] shrink-0" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
