import React from 'react'
import { MapPin, Globe2 } from 'lucide-react'
import { AgencyStateSummary } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface AgencyGeographicFootprintProps {
  states: AgencyStateSummary[]
}

export const AgencyGeographicFootprint: React.FC<AgencyGeographicFootprintProps> = ({
  states,
}) => {
  const maxDisbursed = Math.max(...states.map((s) => s.disbursedAmount), 1)

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`REGIONAL NODES // ${states.length} STATES`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            STATE FOOTPRINT
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Agency Geographic Footprint</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <p className="text-xs text-[#9AA5C1]">
          Operational presence across statutory state boundaries. Visualizes capital disbursement
          volume and anomaly exposure distribution per state.
        </p>

        <div className="space-y-2">
          {states.map((s) => {
            const widthPct = Math.min(100, Math.max(12, (s.disbursedAmount / maxDisbursed) * 100))
            const isHighRisk = s.flaggedPercentage >= 50

            return (
              <div
                key={s.state}
                className="bg-[#0A0E1A] border border-[#232D47] rounded p-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#E7EBF5]">
                    <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>{s.state}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
                    <span className="text-[#9AA5C1]">{s.projectsCount} works</span>
                    <span className="text-[#667090]">&bull;</span>
                    <span className="text-[#22C55E] font-bold">{s.disbursedDisplay}</span>
                    <span className="text-[#667090]">&bull;</span>
                    <span
                      className={`font-bold ${
                        isHighRisk
                          ? 'text-[#EF4444]'
                          : s.flaggedCount > 0
                          ? 'text-[#F59E0B]'
                          : 'text-[#667090]'
                      }`}
                    >
                      {s.flaggedPercentage}% Flagged
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-[#161F36] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={`h-full transition-all duration-300 ${
                      isHighRisk
                        ? 'bg-[#EF4444]'
                        : s.flaggedCount > 0
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#3B82F6]'
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
