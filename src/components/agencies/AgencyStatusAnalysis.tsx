import React from 'react'
import { CheckCircle2, Clock, AlertTriangle, Layers, PlayCircle, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface StatusBreakdown {
  recommended: number
  sanctioned: number
  ongoing: number
  completed: number
  stalled: number
  total: number
}

interface AgencyStatusAnalysisProps {
  statusBreakdown: StatusBreakdown
}

export const AgencyStatusAnalysis: React.FC<AgencyStatusAnalysisProps> = ({
  statusBreakdown,
}) => {
  const total = statusBreakdown.total || 1

  const statuses = [
    {
      key: 'recommended',
      label: 'Recommended',
      count: statusBreakdown.recommended,
      percent: Math.round((statusBreakdown.recommended / total) * 100),
      color: '#9AA5C1',
      bg: 'bg-[#161F36]',
      icon: <FileText className="w-3.5 h-3.5 text-[#9AA5C1]" />,
    },
    {
      key: 'sanctioned',
      label: 'Sanctioned',
      count: statusBreakdown.sanctioned,
      percent: Math.round((statusBreakdown.sanctioned / total) * 100),
      color: '#3B82F6',
      bg: 'bg-[#10233F]',
      icon: <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />,
    },
    {
      key: 'ongoing',
      label: 'Ongoing / Active',
      count: statusBreakdown.ongoing,
      percent: Math.round((statusBreakdown.ongoing / total) * 100),
      color: '#22C55E',
      bg: 'bg-[#0E2E1E]',
      icon: <PlayCircle className="w-3.5 h-3.5 text-[#22C55E]" />,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: statusBreakdown.completed,
      percent: Math.round((statusBreakdown.completed / total) * 100),
      color: '#06B6D4',
      bg: 'bg-[#083344]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#06B6D4]" />,
    },
    {
      key: 'stalled',
      label: 'Stalled / Delayed',
      count: statusBreakdown.stalled,
      percent: Math.round((statusBreakdown.stalled / total) * 100),
      color: '#EF4444',
      bg: 'bg-[#401515]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />,
      isAlert: true,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="PROJECT LIFECYCLE AUDIT // PROGRESSION STAGES"
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            EXECUTION STATUS
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Execution Status</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Horizontal Stacked Progression Bar */}
        <div className="h-3 w-full bg-[#0A0E1A] rounded overflow-hidden flex border border-[#232D47]">
          {statuses.map((st) =>
            st.percent > 0 ? (
              <div
                key={st.key}
                style={{ width: `${st.percent}%`, backgroundColor: st.color }}
                className="h-full transition-all duration-300"
                title={`${st.label}: ${st.count} (${st.percent}%)`}
              />
            ) : null
          )}
        </div>

        {/* Status Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {statuses.map((st) => (
            <div
              key={st.key}
              className={`p-2.5 rounded border transition-colors flex flex-col justify-between ${
                st.isAlert && st.count > 0
                  ? 'bg-[#401515]/30 border-[#EF4444]/40'
                  : 'bg-[#0A0E1A] border-[#232D47]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
                  {st.icon}
                  {st.label}
                </span>
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: st.color }}
                >
                  {st.percent}%
                </span>
              </div>

              <div className="flex items-baseline gap-1 mt-2">
                <span
                  className={`font-mono text-base font-bold ${
                    st.isAlert && st.count > 0 ? 'text-[#EF4444]' : 'text-[#E7EBF5]'
                  }`}
                >
                  {st.count}
                </span>
                <span className="text-[10px] text-[#667090] font-mono">
                  {st.count === 1 ? 'work' : 'works'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {statusBreakdown.stalled > 0 && (
          <div className="flex items-center gap-2 p-2 bg-[#401515]/20 border border-[#EF4444]/30 rounded text-xs text-[#EF4444] font-mono">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong>Execution Alert:</strong> {statusBreakdown.stalled} work(s) are currently
              stalled or under active inspection due to timeline overruns.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
