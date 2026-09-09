import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { IngestionTimelineEvent } from '@/types/dataSources'

interface IngestionTimelineProps {
  events: IngestionTimelineEvent[]
}

export const IngestionTimeline: React.FC<IngestionTimelineProps> = ({ events }) => {
  const getStatusIcon = (status: IngestionTimelineEvent['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
      default:
        return <Clock className="w-3.5 h-3.5 text-[#9AA5C1]" />
    }
  }

  const getStageBadge = (stage: IngestionTimelineEvent['stage']) => {
    return (
      <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#adc6ff] uppercase">
        {stage}
      </span>
    )
  }

  return (
    <Card className="select-none">
      <CardHeader telemetry="CHRONOLOGICAL INGEST LOG // AUDIT TRAIL">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Last-Ingestion Timeline & Audit Trail</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#232D47]">
          {events.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Pip */}
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10182B] border border-[#232D47] flex items-center justify-center">
                {getStatusIcon(evt.status)}
              </div>

              {/* Event Content */}
              <div className="p-2.5 rounded bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#E7EBF5] truncate">
                      {evt.datasetName}
                    </span>
                    {getStageBadge(evt.stage)}
                  </div>
                  <span className="font-mono text-[11px] text-[#667090] shrink-0">
                    {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#c2c6d6] font-sans leading-relaxed">{evt.summary}</p>

                {evt.recordsProcessed !== undefined && evt.recordsProcessed !== null && (
                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#667090] border-t border-[#232D47]/40">
                    <span>RECORDS PROCESSED:</span>
                    <span className="text-[#adc6ff] font-bold">
                      {evt.recordsProcessed.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
