import React from 'react'
import { Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface AgencyAnomalyBreakdownProps {
  anomaliesCount: Record<string, number>
}

export const AgencyAnomalyBreakdown: React.FC<AgencyAnomalyBreakdownProps> = ({
  anomaliesCount,
}) => {
  const anomalyOrder = [
    'Cost Inflation',
    'Payment Pattern',
    'Completion Delay',
    'Vendor Concentration',
    'Duplicate Works',
    'Spatial Similarity',
    'Procedural Violation',
  ]

  const maxVal = Math.max(...Object.values(anomaliesCount), 1)
  const totalAnomalies = Object.values(anomaliesCount).reduce((acc, curr) => acc + curr, 0)

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`TOTAL OBSERVATIONS: ${totalAnomalies} // 7 FORENSIC VECTORS`}
        action={
          <span className="font-mono text-[10px] text-[#F59E0B] bg-[#3A2A0C] border border-[#F59E0B]/40 px-2 py-0.5 rounded font-bold uppercase">
            ANOMALY AUDIT
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#F59E0B]" />
          <CardTitle>Agency-Linked Anomalies</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <p className="text-xs text-[#9AA5C1]">
          Incidence of identified anomaly patterns across all executing works, milestone
          certifications, and physical inspections under this authority.
        </p>

        <div className="space-y-2">
          {anomalyOrder.map((cat) => {
            const count = anomaliesCount[cat] || 0
            const pct = Math.min(100, Math.max(6, (count / maxVal) * 100))

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#E7EBF5] text-[11px]">{cat}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-bold ${
                        count > 2
                          ? 'text-[#EF4444]'
                          : count > 0
                          ? 'text-[#F59E0B]'
                          : 'text-[#667090]'
                      }`}
                    >
                      {count}
                    </span>
                    <span className="text-[#667090] text-[10px]">
                      ({totalAnomalies > 0 ? ((count / totalAnomalies) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#232D47]">
                  <div
                    style={{ width: `${count > 0 ? pct : 0}%` }}
                    className={`h-full transition-all duration-300 ${
                      count > 2
                        ? 'bg-[#EF4444]'
                        : count > 0
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
