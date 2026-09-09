import React from 'react'
import { Link } from 'react-router-dom'
import { Store, ExternalLink } from 'lucide-react'

import { AgencyVendorSummary } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface AgencyVendorConcentrationProps {
  vendors: AgencyVendorSummary[]
}

export const AgencyVendorConcentration: React.FC<AgencyVendorConcentrationProps> = ({
  vendors,
}) => {
  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`ALLOCATION CONCENTRATION // ${vendors.length} CONTRACTORS`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            PROCUREMENT FOOTPRINT
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Vendor Concentration</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="h-7 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
                <th className="px-3 whitespace-nowrap">Vendor</th>
                <th className="px-2.5 text-center whitespace-nowrap">Projects</th>
                <th className="px-3 text-right whitespace-nowrap">Disbursed</th>
                <th className="px-2.5 text-center whitespace-nowrap">Flagged %</th>
                <th className="px-3 text-right whitespace-nowrap">Risk</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#232D47]/60">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#9AA5C1] font-mono text-xs">
                    No vendor concentration records recorded.
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.vendorName} className="hover:bg-[#161F36]/60 transition-colors">
                    {/* Vendor Name & Link */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      {v.vendorId ? (
                        <Link
                          to={`/vendors/${v.vendorId}`}
                          className="font-medium text-[#E7EBF5] hover:text-[#3B82F6] transition-colors inline-flex items-center gap-1 group"
                        >
                          <span className="truncate max-w-[200px]">{v.vendorName}</span>
                          <ExternalLink className="w-3 h-3 text-[#667090] group-hover:text-[#3B82F6] opacity-60 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ) : (
                        <span className="font-medium text-[#E7EBF5] truncate max-w-[200px] block">
                          {v.vendorName}
                        </span>
                      )}
                    </td>

                    {/* Projects */}
                    <td className="px-2.5 py-2 text-center whitespace-nowrap font-mono text-xs text-[#E7EBF5]">
                      {v.projectsCount}
                    </td>

                    {/* Disbursed */}
                    <td className="px-3 py-2 text-right whitespace-nowrap font-mono text-xs text-[#22C55E]">
                      {v.disbursedDisplay}
                    </td>

                    {/* Flagged % */}
                    <td className="px-2.5 py-2 text-center whitespace-nowrap font-mono text-xs">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[11px] ${
                          v.flaggedPercentage >= 60
                            ? 'bg-[#EF4444]/15 text-[#EF4444] font-bold'
                            : v.flaggedPercentage >= 30
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] font-medium'
                            : 'text-[#9AA5C1]'
                        }`}
                      >
                        {v.flaggedPercentage}%
                      </span>
                    </td>

                    {/* Risk */}
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <RiskBadge level={v.riskLevel} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-2.5 border-t border-[#232D47] bg-[#0A0E1A]/60 text-[10px] text-[#667090] font-mono leading-relaxed">
          Statutory Note: Vendor concentration indicates contractor work volume distribution. Multi-vendor
          association patterns require corroboration and do not infer collusive bidding unless supported by
          directorship or spatial overlap evidence.
        </div>
      </CardContent>
    </Card>
  )
}
