import React from 'react'
import { Download, RefreshCw, Layers } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { StatusPill } from '@/components/common/StatusPill'

interface ProjectLedgerHeaderProps {
  totalMonitored: number
  totalFlagged: number
  totalSanctionedCr: string
  totalDisbursedCr: string
  lastSyncText?: string
  density: 'standard' | 'dense'
  onToggleDensity: () => void
  onExportCsv: () => void
  onRefresh: () => void
  isRefreshing?: boolean
}

export const ProjectLedgerHeader: React.FC<ProjectLedgerHeaderProps> = ({
  totalMonitored,
  totalFlagged,
  totalSanctionedCr,
  totalDisbursedCr,
  lastSyncText = 'SYNCED 8 MIN AGO',
  density,
  onToggleDensity,
  onExportCsv,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col gap-3 border-b border-[#232D47] pb-3 pt-2 bg-[#0A0E1A]">
      {/* Top row: Title, Subtitle, and Top-Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Project Portfolio Ledger
            </h1>
            <StatusPill label="STAGE 1 READY" variant="synced" pulse={false} />
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5 font-sans">
            National register of monitored MPLADS works &bull; Sovereign statutory audit ledger
          </p>
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Density Control */}
          <Button
            variant="secondary"
            size="compact"
            onClick={onToggleDensity}
            title={`Toggle density: currently ${density}`}
            icon={<Layers className="w-3.5 h-3.5 text-[#9AA5C1]" />}
          >
            <span className="font-mono text-[11px] uppercase">
              {density === 'dense' ? 'Dense SOC' : 'Standard'}
            </span>
          </Button>

          {/* Refresh Action */}
          <Button
            variant="secondary"
            size="compact"
            onClick={onRefresh}
            title="Refresh national telemetry ledger"
            icon={
              <RefreshCw
                className={`w-3 h-3 text-[#9AA5C1] ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`}
              />
            }
          >
            <span className="font-mono text-[11px] uppercase">
              {isRefreshing ? 'Syncing...' : 'Sync'}
            </span>
          </Button>

          {/* Export CSV */}
          <Button
            variant="primary"
            size="compact"
            onClick={onExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            <span className="font-mono text-[11px] uppercase tracking-wider">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Compact Telemetry Readout Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {/* Monitored Works */}
        <div className="bg-[#10182B] border border-[#232D47] rounded p-2 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
            MONITORED
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
              {totalMonitored.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-[#667090] font-bold uppercase">WORKS</span>
          </div>
        </div>

        {/* Flagged Works */}
        <div className="bg-[#10182B] border border-[#EF444440] rounded p-2 flex flex-col justify-between bg-gradient-to-br from-[#401515]/20 to-transparent">
          <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
            FLAGGED
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-tabular text-sm font-bold text-[#EF4444]">
              {totalFlagged.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-[#EF4444]/80 font-semibold">
              ({totalMonitored > 0 ? ((totalFlagged / totalMonitored) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>

        {/* Sanctioned */}
        <div className="bg-[#10182B] border border-[#232D47] rounded p-2 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
            SANCTIONED
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
              {totalSanctionedCr}
            </span>
          </div>
        </div>

        {/* Disbursed */}
        <div className="bg-[#10182B] border border-[#232D47] rounded p-2 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
            DISBURSED
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-tabular text-sm font-bold text-[#3B82F6]">
              {totalDisbursedCr}
            </span>
          </div>
        </div>

        {/* Data Freshness */}
        <div className="bg-[#10182B] border border-[#232D47] rounded p-2 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
            DATA STATUS
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="font-mono text-[10px] font-bold text-[#22C55E] uppercase truncate">
              {lastSyncText}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
