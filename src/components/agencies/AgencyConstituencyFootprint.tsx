import React from 'react'
import { MapPin } from 'lucide-react'
import { AgencyConstituencySummary } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface AgencyConstituencyFootprintProps {
  constituencies: AgencyConstituencySummary[]
}

export const AgencyConstituencyFootprint: React.FC<AgencyConstituencyFootprintProps> = ({
  constituencies,
}) => {
  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`JURISDICTION SPREAD // ${constituencies.length} CONSTITUENCIES`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            CONSTITUENCY SPREAD
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Constituency Footprint</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="h-7 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
                <th className="px-3 whitespace-nowrap">Constituency</th>
                <th className="px-2.5 whitespace-nowrap">State</th>
                <th className="px-2 text-center whitespace-nowrap">Projects</th>
                <th className="px-3 text-right whitespace-nowrap">Sanctioned</th>
                <th className="px-3 text-right whitespace-nowrap">Disbursed</th>
                <th className="px-2.5 text-center whitespace-nowrap">Flagged %</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#232D47]/60">
              {constituencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#9AA5C1] font-mono text-xs">
                    No constituency footprint recorded.
                  </td>
                </tr>
              ) : (
                constituencies.map((c) => (
                  <tr key={c.constituency} className="hover:bg-[#161F36]/60 transition-colors">
                    {/* Constituency */}
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-[#E7EBF5]">
                      {c.constituency}
                    </td>

                    {/* State */}
                    <td className="px-2.5 py-2 whitespace-nowrap text-[#9AA5C1] font-mono text-xs">
                      {c.state}
                    </td>

                    {/* Projects */}
                    <td className="px-2 py-2 text-center whitespace-nowrap font-mono text-xs text-[#E7EBF5]">
                      {c.projectsCount}
                    </td>

                    {/* Sanctioned */}
                    <td className="px-3 py-2 text-right whitespace-nowrap font-mono text-xs text-[#9AA5C1]">
                      {c.sanctionedDisplay}
                    </td>

                    {/* Disbursed */}
                    <td className="px-3 py-2 text-right whitespace-nowrap font-mono text-xs text-[#22C55E]">
                      {c.disbursedDisplay}
                    </td>

                    {/* Flagged % */}
                    <td className="px-2.5 py-2 text-center whitespace-nowrap font-mono text-xs">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[11px] ${
                          c.flaggedPercentage >= 60
                            ? 'bg-[#EF4444]/15 text-[#EF4444] font-bold'
                            : c.flaggedPercentage >= 30
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] font-medium'
                            : 'text-[#9AA5C1]'
                        }`}
                      >
                        {c.flaggedPercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
