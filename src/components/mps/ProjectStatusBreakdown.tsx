import React from 'react'
import { CheckCircle2, Clock, PlayCircle, AlertOctagon, FileCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface ProjectStatusBreakdownProps {
  statusBreakdown: {
    recommended: number
    sanctioned: number
    disbursed: number
    completed: number
    stalled: number
  }
}

export const ProjectStatusBreakdown: React.FC<ProjectStatusBreakdownProps> = ({
  statusBreakdown,
}) => {
  const total =
    statusBreakdown.recommended +
    statusBreakdown.sanctioned +
    statusBreakdown.disbursed +
    statusBreakdown.completed +
    statusBreakdown.stalled

  const stages = [
    {
      name: 'Recommended',
      count: statusBreakdown.recommended,
      icon: <Clock className="w-3.5 h-3.5 text-[#9AA5C1]" />,
      color: 'bg-[#424754]',
      textColor: 'text-[#9AA5C1]',
      border: 'border-[#232D47]',
    },
    {
      name: 'Sanctioned',
      count: statusBreakdown.sanctioned,
      icon: <FileCheck className="w-3.5 h-3.5 text-[#3B82F6]" />,
      color: 'bg-[#1D4ED8]',
      textColor: 'text-[#3B82F6]',
      border: 'border-[#3B82F6]/40',
    },
    {
      name: 'Disbursed',
      count: statusBreakdown.disbursed,
      icon: <PlayCircle className="w-3.5 h-3.5 text-[#22C55E]" />,
      color: 'bg-[#15803D]',
      textColor: 'text-[#22C55E]',
      border: 'border-[#22C55E]/40',
    },
    {
      name: 'Completed',
      count: statusBreakdown.completed,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />,
      color: 'bg-[#0284C7]',
      textColor: 'text-[#38BDF8]',
      border: 'border-[#38BDF8]/40',
    },
    {
      name: 'Stalled',
      count: statusBreakdown.stalled,
      icon: <AlertOctagon className="w-3.5 h-3.5 text-[#EF4444]" />,
      color: 'bg-[#EF4444]',
      textColor: 'text-[#EF4444]',
      border: 'border-[#EF4444]/60',
      isStalled: true,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`TOTAL PORTFOLIO: ${total} WORKS`}
        action={
          statusBreakdown.stalled > 0 ? (
            <span className="font-mono text-[10px] text-[#EF4444] bg-[#401515] border border-[#EF444460] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
              <AlertOctagon className="w-2.5 h-2.5" />
              {statusBreakdown.stalled} STALLED WORKS DETECTED
            </span>
          ) : (
            <span className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] border border-[#22C55E60] px-2 py-0.5 rounded font-bold uppercase">
              ALL ACTIVE
            </span>
          )
        }
      >
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Project Lifecycle & Execution Status</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stage Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 select-none">
          {stages.map((stage) => {
            const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0
            return (
              <div
                key={stage.name}
                className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all ${
                  stage.isStalled && stage.count > 0
                    ? 'bg-[#401515]/30 border-[#EF4444]/60'
                    : 'bg-[#0A0E1A] border-[#232D47]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] truncate">
                    {stage.name}
                  </span>
                  {stage.icon}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className={`font-mono text-base font-bold ${stage.textColor}`}>
                    {stage.count}
                  </span>
                  <span className="font-mono text-[10px] text-[#667090]">
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Horizontal Visual Funnel Bar */}
        <div className="h-2.5 w-full bg-[#0A0E1A] rounded overflow-hidden flex border border-[#232D47]">
          {stages.map((stage) => {
            if (stage.count === 0 || total === 0) return null
            const widthPct = (stage.count / total) * 100
            return (
              <div
                key={stage.name}
                style={{ width: `${widthPct}%` }}
                className={`${stage.color} h-full transition-all duration-300`}
                title={`${stage.name}: ${stage.count} (${widthPct.toFixed(1)}%)`}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
