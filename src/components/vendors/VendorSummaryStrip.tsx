import React from 'react'
import { Store, ShieldAlert, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'

interface VendorSummaryStripProps {
  vendorsMonitored: number
  activeContractors: number
  highRiskVendors: number
  flaggedProjectsCount: number
  totalDisbursed: string
  avgProjectValue: string
}

export const VendorSummaryStrip: React.FC<VendorSummaryStripProps> = ({
  vendorsMonitored,
  activeContractors,
  highRiskVendors,
  flaggedProjectsCount,
  totalDisbursed,
  avgProjectValue,
}) => {
  const highRiskPct = vendorsMonitored > 0 ? ((highRiskVendors / vendorsMonitored) * 100).toFixed(1) : '0.0'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-[#0D1424] border border-[#232D47] rounded-lg p-2.5 select-none shadow-sm">
      {/* 1. Vendors Monitored */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <Store className="w-3 h-3 text-[#3B82F6]" />
          VENDORS MONITORED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {vendorsMonitored}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">
            ({activeContractors} ACTIVE)
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          GST-Registered Entities
        </span>
      </div>

      {/* 2. High-Risk Vendors */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
          HIGH-RISK VENDORS
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#EF4444]">
            {highRiskVendors}
          </span>
          <span className="font-mono text-[10px] text-[#EF4444]/80">
            ({highRiskPct}%)
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Risk Score &ge; 70 Threshold
        </span>
      </div>

      {/* 3. Flagged Vendor-Linked Projects */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#F59E0B] tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
          FLAGGED WORKS
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#F59E0B]">
            {flaggedProjectsCount}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">PROJECTS</span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Elevated Anomaly Linkage
        </span>
      </div>

      {/* 4. Total Disbursed */}
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
          PFMS Cleared Capital
        </span>
      </div>

      {/* 5. Average Project Value */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-[#3B82F6]" />
          AVG PROJECT VALUE
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {avgProjectValue}
          </span>
        </div>
        <span className="text-[10px] text-[#667090] font-mono mt-0.5">
          Per Contract Allocation
        </span>
      </div>
    </div>
  )
}
