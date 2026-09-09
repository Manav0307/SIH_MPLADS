import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  FileQuestion,
  Copy,
} from 'lucide-react'
import { DataQualityWarning } from '@/types/dataSources'

interface DataQualityWarningsPanelProps {
  warnings: DataQualityWarning[]
}

export const DataQualityWarningsPanel: React.FC<DataQualityWarningsPanelProps> = ({ warnings }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'critical' | 'high' | 'medium'>(
    'ALL'
  )

  const filteredWarnings =
    selectedSeverity === 'ALL'
      ? warnings
      : warnings.filter((w) => w.severity === selectedSeverity)

  const criticalCount = warnings.filter((w) => w.severity === 'critical').length
  const highCount = warnings.filter((w) => w.severity === 'high').length
  const mediumCount = warnings.filter((w) => w.severity === 'medium').length

  const getSeverityBadge = (severity: DataQualityWarning['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#401515] border border-[#EF444440] text-[#EF4444] uppercase">
            CRITICAL
          </span>
        )
      case 'high':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#3A2A0C] border border-[#F59E0B40] text-[#F59E0B] uppercase">
            HIGH RISK
          </span>
        )
      case 'medium':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#362E0C] border border-[#EAB30840] text-[#EAB308] uppercase">
            MEDIUM
          </span>
        )
      case 'info':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10233F] border border-[#3B82F640] text-[#3B82F6] uppercase">
            INFO
          </span>
        )
    }
  }

  const getTypeIcon = (type: DataQualityWarning['type']) => {
    switch (type) {
      case 'missing_file':
        return <FileQuestion className="w-3.5 h-3.5 text-[#EF4444]" />
      case 'duplicate_record':
        return <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />
      case 'null_identifier':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EAB308]" />
      default:
        return <Info className="w-3.5 h-3.5 text-[#3B82F6]" />
    }
  }

  return (
    <Card className="select-none h-full">
      <CardHeader
        telemetry={`${warnings.length} AUDIT WARNINGS ACTIVE`}
        action={
          <div className="flex items-center gap-1">
            {(['ALL', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-[#161F36] text-[#adc6ff] border border-[#3B82F6] font-bold'
                    : 'text-[#667090] hover:text-[#9AA5C1]'
                }`}
              >
                {sev.toUpperCase()}
              </button>
            ))}
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Data-Quality Summary & Statutory Warnings</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* Data Quality Summary Cards */}
        <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#232D47]">
          <div className="p-2 rounded bg-[#0D1424] border border-[#232D47] flex flex-col">
            <span className="text-[10px] font-mono text-[#EF4444]">CRITICAL BLOCKERS</span>
            <span className="text-base font-mono font-bold text-[#EF4444] tabular-nums mt-0.5">
              {criticalCount}
            </span>
            <span className="text-[9px] font-mono text-[#667090]">Missing masters</span>
          </div>

          <div className="p-2 rounded bg-[#0D1424] border border-[#232D47] flex flex-col">
            <span className="text-[10px] font-mono text-[#F59E0B]">HIGH DELAYS</span>
            <span className="text-base font-mono font-bold text-[#F59E0B] tabular-nums mt-0.5">
              {highCount}
            </span>
            <span className="text-[9px] font-mono text-[#667090]">Pending uploads</span>
          </div>

          <div className="p-2 rounded bg-[#0D1424] border border-[#232D47] flex flex-col">
            <span className="text-[10px] font-mono text-[#EAB308]">NULL CONCERNS</span>
            <span className="text-base font-mono font-bold text-[#EAB308] tabular-nums mt-0.5">
              {mediumCount}
            </span>
            <span className="text-[9px] font-mono text-[#667090]">Missing geo/agencies</span>
          </div>
        </div>

        {/* Warnings List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredWarnings.map((w) => (
            <div
              key={w.id}
              className={`p-2.5 rounded-lg border space-y-1.5 transition-colors ${
                w.severity === 'critical'
                  ? 'bg-[#16141F] border-[#EF444430] hover:border-[#EF4444]'
                  : w.severity === 'high'
                  ? 'bg-[#181820] border-[#F59E0B30] hover:border-[#F59E0B]'
                  : 'bg-[#161F36] border-[#232D47] hover:border-[#3B82F6]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {getTypeIcon(w.type)}
                  <span className="font-mono text-xs font-bold text-[#E7EBF5] truncate">
                    {w.title}
                  </span>
                </div>
                {getSeverityBadge(w.severity)}
              </div>

              <div className="text-[10px] font-mono text-[#9AA5C1] flex items-center justify-between">
                <span className="text-[#adc6ff] bg-[#0A0E1A] px-1 py-0.2 rounded border border-[#232D47] truncate max-w-[240px]">
                  {w.datasetName}
                </span>
                <span className="text-[#667090]">{w.timestamp}</span>
              </div>

              <p className="text-xs text-[#c2c6d6] font-sans leading-relaxed">{w.description}</p>

              <div className="pt-1.5 border-t border-[#232D47]/60 space-y-1 text-[11px] font-sans">
                <div className="flex items-baseline gap-1 text-[#ffb4ab]">
                  <span className="font-mono text-[10px] font-bold text-[#EF4444] uppercase shrink-0">
                    Forensic Impact:
                  </span>
                  <span>{w.impact}</span>
                </div>
                <div className="flex items-baseline gap-1 text-[#9AA5C1]">
                  <span className="font-mono text-[10px] font-bold text-[#3B82F6] uppercase shrink-0">
                    Remediation:
                  </span>
                  <span>{w.remediation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
