import React from 'react'
import { Store, ArrowRight } from 'lucide-react'
import { VendorRecord } from '@/types'

interface VendorRiskTableProps {
  vendors: VendorRecord[]
  onSelectVendor: (vendor: VendorRecord) => void
  selectedVendorId?: string
}

export const VendorRiskTable: React.FC<VendorRiskTableProps> = ({
  vendors,
  onSelectVendor,
  selectedVendorId,
}) => {
  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col overflow-hidden select-none h-full">
      {/* Table Header Strip */}
      <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#F59E0B]" />
          <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
            Vendor Risk Intelligence &amp; Cartel Detection
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            // trigger filter or general vendor link
            if (vendors[0]) onSelectVendor(vendors[0])
          }}
          className="font-mono text-[10px] text-[#3B82F6] hover:underline font-bold cursor-pointer"
        >
          All 340 Vendors →
        </button>
      </div>

      {/* Dense Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left font-sans text-xs">
          <thead>
            <tr className="bg-[#0D1424] border-b border-[#232D47] text-[#9AA5C1] font-sans text-[11px] uppercase font-semibold">
              <th className="py-2 px-3">Vendor Entity</th>
              <th className="py-2 px-2 text-center">Active</th>
              <th className="py-2 px-2 text-right">Disbursed</th>
              <th className="py-2 px-2 text-center">Flagged Works</th>
              <th className="py-2 px-3">Primary Anomaly Flag</th>
              <th className="py-2 px-3 text-right">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#161F36]">
            {vendors.map((v) => {
              const isSelected = selectedVendorId === v.id
              const isCrit = v.riskLevel === 'critical'
              const isHigh = v.riskLevel === 'high'

              return (
                <tr
                  key={v.id}
                  onClick={() => onSelectVendor(v)}
                  className={`hover:bg-[#161F36] transition-colors cursor-pointer group ${
                    isSelected ? 'bg-[#161F36]' : ''
                  }`}
                >
                  <td className="py-2 px-3 align-middle">
                    <div className="font-sans font-semibold text-[#E7EBF5] text-xs group-hover:text-[#3B82F6] transition-colors">
                      {v.name}
                    </div>
                    <div className="text-[10px] text-[#9AA5C1] font-mono">
                      GST: {v.gstin}
                    </div>
                  </td>

                  <td className="py-2 px-2 text-center font-mono text-[#E7EBF5] align-middle">
                    {v.activeWorks}
                  </td>

                  <td className="py-2 px-2 text-right font-mono font-bold text-[#E7EBF5] align-middle">
                    {v.totalDisbursed}
                  </td>

                  <td className="py-2 px-2 text-center align-middle">
                    <span
                      className={`font-mono font-bold ${
                        isCrit ? 'text-[#EF4444]' : isHigh ? 'text-[#F59E0B]' : 'text-[#E7EBF5]'
                      }`}
                    >
                      {v.flaggedWorksCount} ({v.flaggedPercentage}%)
                    </span>
                  </td>

                  <td className="py-2 px-3 text-[#9AA5C1] text-[11px] align-middle">
                    <span
                      className={`px-1.5 py-0.5 rounded border text-[10px] font-sans inline-block ${
                        isCrit
                          ? 'bg-[#401515]/30 text-[#EF4444] border-[#EF4444]/30'
                          : isHigh
                          ? 'bg-[#3A2A0C]/30 text-[#F59E0B] border-[#F59E0B]/30'
                          : 'bg-[#10182B] text-[#E7EBF5] border-[#232D47]'
                      }`}
                    >
                      {v.primaryAnomaly}
                    </span>
                  </td>

                  <td className="py-2 px-3 text-right align-middle">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                        isCrit
                          ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                          : isHigh
                          ? 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                          : 'bg-[#161F36] text-[#E7EBF5] border-[#232D47]'
                      }`}
                    >
                      {v.riskScore} {isCrit ? 'CRIT' : isHigh ? 'HIGH' : 'MED'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cartel Notice Footer */}
      <div className="p-2 border-t border-[#232D47] bg-[#0A0E1A] flex items-center justify-between text-[11px] font-mono text-[#9AA5C1]">
        <span>Cartel analysis flags entities sharing registered addresses, DIN numbers, or IP origins.</span>
        <button
          type="button"
          onClick={() => {
            if (vendors[0]) onSelectVendor(vendors[0])
          }}
          className="text-[#3B82F6] hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Investigate Director Graphs</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
