import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface AnomalyBreakdownProps {
  anomaliesCount: Record<string, number>
}

export const AnomalyBreakdown: React.FC<AnomalyBreakdownProps> = ({
  anomaliesCount,
}) => {
  const categories = [
    { key: 'Cost Inflation', color: '#EF4444', label: 'Cost Inflation / Unreasonable Rates' },
    { key: 'Payment Pattern', color: '#F59E0B', label: 'Payment Pattern / Rapid Tranches' },
    { key: 'Completion Delay', color: '#EAB308', label: 'Completion Delay / Overdue Milestones' },
    { key: 'Vendor Concentration', color: '#8B5CF6', label: 'Vendor Concentration / Cartel Bidding' },
    { key: 'Duplicate Works', color: '#EC4899', label: 'Duplicate Works / Spatial GPS Overlap' },
    { key: 'Procedural Violation', color: '#3B82F6', label: 'Procedural Violation / Missing Approvals' },
    { key: 'Spatial Similarity', color: '#14B8A6', label: 'Spatial Similarity / Adjacent Clones' },
  ]

  const maxVal = Math.max(1, ...Object.values(anomaliesCount))
  const totalAnomalies = Object.values(anomaliesCount).reduce((a, b) => a + b, 0)

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`${totalAnomalies} DETECTED ANOMALY MARKERS`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F660] px-2 py-0.5 rounded font-bold uppercase">
            FORENSIC SIGNATURE
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
          <CardTitle>Anomaly Profile</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {categories.map((cat) => {
          const count = anomaliesCount[cat.key] || 0
          const barWidthPct = totalAnomalies > 0 ? (count / maxVal) * 100 : 0
          const sharePct = totalAnomalies > 0 ? ((count / totalAnomalies) * 100).toFixed(0) : '0'

          return (
            <div key={cat.key} className="space-y-1 select-none">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-sans text-xs text-[#E7EBF5] font-medium truncate">
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="text-[#E7EBF5] font-bold font-tabular">{count}</span>
                  <span className="text-[#667090] text-[10px]">({sharePct}%)</span>
                </div>
              </div>

              {/* Analytical Bar */}
              <div className="h-2 w-full bg-[#0A0E1A] rounded overflow-hidden border border-[#232D47]">
                <div
                  style={{
                    width: `${barWidthPct}%`,
                    backgroundColor: cat.color,
                  }}
                  className="h-full rounded transition-all duration-300"
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
