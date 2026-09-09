import React from 'react'
import { Clock, AlertTriangle, CheckCircle2, CircleDot } from 'lucide-react'
import { InvestigationTimelineStage } from '@/types'

interface InvestigationTimelineProps {
  stages: InvestigationTimelineStage[]
  agingDays?: number
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  stages,
  agingDays = 180,
}) => {
  return (
    <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
        <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          Investigation Lifecycle Timeline
        </span>
        <span className="font-mono text-[10px] text-[#F59E0B] font-semibold">
          +{agingDays} DAYS IN ACTIVE PIPELINE
        </span>
      </div>

      <div className="relative pl-6 space-y-3">
        {/* Continuous vertical tracking line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#232D47]" />

        {stages.map((stage, idx) => {
          const isFlagged = stage.status === 'flagged'
          const isDelayed = stage.status === 'delayed'
          const isCompleted = stage.status === 'completed'

          return (
            <div key={idx} className="relative group">
              {/* Abnormal Gap Indicator between stages */}
              {stage.gapAlert && (
                <div className="mb-2 -ml-2 flex items-center gap-1.5 py-1 px-2 rounded bg-[#401515] border border-[#EF4444]/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 animate-bounce" />
                  <span className="font-mono text-[10px] text-[#ffdad6] font-bold tracking-tight">
                    ⚠️ {stage.gapAlert}
                  </span>
                </div>
              )}

              {/* Timeline Stage Node */}
              <div className="flex items-start gap-2.5">
                {/* Node Pip */}
                <div
                  className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border z-10 ${
                    isFlagged
                      ? 'bg-[#401515] border-[#EF4444] text-[#EF4444]'
                      : isDelayed
                      ? 'bg-[#3A2A0C] border-[#F59E0B] text-[#F59E0B]'
                      : isCompleted
                      ? 'bg-[#0F3020] border-[#22C55E] text-[#22C55E]'
                      : 'bg-[#161F36] border-[#232D47] text-[#9AA5C1]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : isFlagged ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <CircleDot className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Stage Info Card */}
                <div className="flex-1 bg-[#10182B] border border-[#232D47] rounded p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#E7EBF5] uppercase">
                      {stage.stage}
                    </span>
                    <span className="font-mono text-[10px] text-[#9AA5C1]">{stage.date}</span>
                  </div>

                  {stage.amountDisplay && (
                    <div className="mt-1 font-mono text-xs text-[#3B82F6] font-semibold">
                      {stage.amountDisplay}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#161F36] text-[10px] font-mono">
                    <span className="text-[#667090]">Status:</span>
                    <span
                      className={`font-semibold uppercase ${
                        isFlagged
                          ? 'text-[#EF4444]'
                          : isDelayed
                          ? 'text-[#F59E0B]'
                          : isCompleted
                          ? 'text-[#22C55E]'
                          : 'text-[#9AA5C1]'
                      }`}
                    >
                      {stage.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
