import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { VendorRiskContributor } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface VendorRiskAssessmentProps {
  contributors: VendorRiskContributor[]
  totalScore: number
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-[#401515]',
        border: 'border-[#EF4444]/40',
        text: 'text-[#EF4444]',
        label: 'CRITICAL',
      }
    case 'high':
      return {
        bg: 'bg-[#3A2A0C]',
        border: 'border-[#F59E0B]/40',
        text: 'text-[#F59E0B]',
        label: 'HIGH',
      }
    case 'medium':
      return {
        bg: 'bg-[#382F10]',
        border: 'border-[#EAB308]/40',
        text: 'text-[#EAB308]',
        label: 'MEDIUM',
      }
    default:
      return {
        bg: 'bg-[#0E2E1E]',
        border: 'border-[#22C55E]/40',
        text: 'text-[#22C55E]',
        label: 'LOW',
      }
  }
}

export const VendorRiskAssessment: React.FC<VendorRiskAssessmentProps> = ({
  contributors,
  totalScore,
}) => {
  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`ANOMALY ENGINE AUDIT // COMPOSITE SCORE: ${totalScore}/100`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            RISK CONTRIBUTORS
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Vendor Risk Assessment</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-[#9AA5C1]">
          Algorithmic breakdown of quantitative risk factors and procurement anomaly contributors.
          Scores reflect analytical patterns and mandate standard audit verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {contributors.map((c) => {
            const badge = getSeverityBadge(c.severity)
            return (
              <div
                key={c.id}
                className="bg-[#0A0E1A] border border-[#232D47] rounded p-2.5 flex flex-col justify-between space-y-2 hover:border-[#3B82F6]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9AA5C1]">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded border font-bold ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#E7EBF5]">
                      +{c.points} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[#E7EBF5]">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-[#9AA5C1] font-sans leading-relaxed">
                    {c.explanation}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
