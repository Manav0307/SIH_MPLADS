import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { GitMerge, ArrowRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { JoinKeyDefinition } from '@/types/dataSources'

interface JoinKeyMonitoringPanelProps {
  joinKeys: JoinKeyDefinition[]
}

export const JoinKeyMonitoringPanel: React.FC<JoinKeyMonitoringPanelProps> = ({ joinKeys }) => {
  const getStatusBadge = (status: JoinKeyDefinition['status']) => {
    switch (status) {
      case 'Linked':
        return (
          <span className="font-mono text-[10px] font-bold text-[#22C55E] bg-[#0F3020] border border-[#22C55E40] px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> LINKED
          </span>
        )
      case 'Partial':
        return (
          <span className="font-mono text-[10px] font-bold text-[#F59E0B] bg-[#3A2A0C] border border-[#F59E0B40] px-2 py-0.5 rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> PARTIAL
          </span>
        )
      case 'Pending Ingestion':
        return (
          <span className="font-mono text-[10px] font-bold text-[#667090] bg-[#161F36] border border-[#232D47] px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        )
      case 'Unresolved':
        return (
          <span className="font-mono text-[10px] font-bold text-[#EF4444] bg-[#401515] border border-[#EF444440] px-2 py-0.5 rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> UNRESOLVED
          </span>
        )
    }
  }

  return (
    <Card className="select-none h-full">
      <CardHeader telemetry="RELATIONAL INTEGRITY // 6 KEYS">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Join-Key Monitoring & Referential Integrity</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2.5">
        <div className="space-y-2">
          {joinKeys.map((jk) => {
            const isAssessed = jk.matchRate !== null

            return (
              <div
                key={jk.keyName}
                className="p-2.5 rounded-lg bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors space-y-2"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#E7EBF5] truncate">
                      {jk.keyName}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#9AA5C1]">
                      {jk.joinType}
                    </span>
                  </div>
                  {getStatusBadge(jk.status)}
                </div>

                {/* Relational Link Flow */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-[#adc6ff] bg-[#0D1424] px-1.5 py-0.5 rounded border border-[#232D47] truncate max-w-[160px]">
                    {jk.sourceDataset}
                  </span>
                  <span className="text-[#667090]">:</span>
                  <span className="text-[#9AA5C1]">{jk.sourceColumn}</span>

                  <ArrowRight className="w-3 h-3 text-[#3B82F6] shrink-0 mx-0.5" />

                  <span className="text-[#4ae176] bg-[#0D1424] px-1.5 py-0.5 rounded border border-[#232D47] truncate max-w-[160px]">
                    {jk.targetDataset}
                  </span>
                  <span className="text-[#667090]">:</span>
                  <span className="text-[#9AA5C1]">{jk.targetColumn}</span>
                </div>

                {/* Progress bar and metrics */}
                <div className="pt-1.5 border-t border-[#232D47] flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="w-full max-w-[140px] h-1.5 rounded-full bg-[#0A0E1A] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isAssessed && jk.matchRate! >= 95
                            ? 'bg-[#22C55E]'
                            : isAssessed && jk.matchRate! >= 80
                            ? 'bg-[#F59E0B]'
                            : isAssessed
                            ? 'bg-[#EF4444]'
                            : 'bg-[#232D47]'
                        }`}
                        style={{ width: isAssessed ? `${jk.matchRate}%` : '0%' }}
                      />
                    </div>
                    <span className="text-[11px] text-[#9AA5C1] tabular-nums">
                      {isAssessed ? `${jk.matchRate?.toFixed(1)}% Match` : '— Match (Pending Ingest)'}
                    </span>
                  </div>

                  <div className="shrink-0 text-[11px] text-[#667090]">
                    {jk.orphanCount !== null ? (
                      <span className={jk.orphanCount > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}>
                        {jk.orphanCount} Orphans
                      </span>
                    ) : (
                      <span>— Orphans</span>
                    )}
                  </div>
                </div>

                {/* Statutory explanation */}
                <p className="text-[11px] text-[#9AA5C1] font-sans leading-tight">
                  {jk.description}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
