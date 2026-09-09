import React from 'react'
import {
  Clock,
  Send,
  CheckCircle,
  MapPin,
  Building,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { AnomalyAlert, AlertStatus } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { cn } from '@/lib/utils'

interface AlertQueueCardsProps {
  alerts: AnomalyAlert[]
  selectedAlertId: string | null
  onSelectAlert: (alert: AnomalyAlert) => void
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const AlertQueueCards: React.FC<AlertQueueCardsProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onUpdateStatus,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalItems = alerts.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedAlerts = alerts.slice(startIndex, startIndex + pageSize)

  const renderStatusBadge = (status: AlertStatus) => {
    const statusConfig = {
      New: {
        bg: 'bg-[#0E2A3A] text-[#38BDF8] border-[#38BDF8]/40',
        dot: 'bg-[#38BDF8]',
      },
      'Under Review': {
        bg: 'bg-[#2E280C] text-[#FACC15] border-[#FACC15]/40',
        dot: 'bg-[#FACC15]',
      },
      Escalated: {
        bg: 'bg-[#381B47] text-[#C084FC] border-[#C084FC]/40',
        dot: 'bg-[#C084FC]',
      },
      Resolved: {
        bg: 'bg-[#0F3020] text-[#4ADE80] border-[#4ADE80]/40',
        dot: 'bg-[#4ADE80]',
      },
    }

    const current = statusConfig[status] || statusConfig.New

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border select-none',
          current.bg
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', current.dot)} />
        <span>{status}</span>
      </span>
    )
  }

  if (paginatedAlerts.length === 0) {
    return (
      <div className="p-12 text-center border border-[#232D47] rounded-lg bg-[#10182B] space-y-2">
        <AlertOctagon className="w-8 h-8 text-[#667090] mx-auto" />
        <h3 className="text-sm font-semibold text-[#E7EBF5]">No Incident Alerts Found</h3>
        <p className="text-xs text-[#9AA5C1]">Try broadening your filter criteria or clearing search query.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 select-none">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paginatedAlerts.map((alert) => {
          const isSelected = selectedAlertId === alert.id
          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={cn(
                'p-3.5 rounded-lg bg-[#10182B] border transition-all cursor-pointer space-y-2.5 hover:border-[#3B82F6]',
                isSelected
                  ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50 bg-[#161F36]/60 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'border-[#232D47]'
              )}
            >
              {/* Card Header: ID, Severity, Status, Time */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#adc6ff]">
                    {alert.id}
                  </span>
                  <RiskBadge
                    level={alert.severity}
                    withPip
                    pulse={alert.severity === 'critical' && alert.status !== 'Resolved'}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {renderStatusBadge(alert.status)}
                </div>
              </div>

              {/* Title & Anomaly tag */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[#9AA5C1]">
                    {alert.anomalyType}
                  </span>
                  <span className="text-[10px] font-mono text-[#667090] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {alert.createdTime}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#E7EBF5] line-clamp-2 leading-snug">
                  {alert.projectTitle}
                </h4>
              </div>

              {/* Why Flagged snippet */}
              <p className="text-[11px] text-[#9AA5C1] line-clamp-2 font-sans bg-[#0A0E1A]/60 p-2 rounded border border-[#232D47]/60">
                {alert.whyFlagged}
              </p>

              {/* Meta strip: Entity, Location, Risk Score, Financial Impact */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#232D47]/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-[#9AA5C1] truncate">
                    <MapPin className="w-3 h-3 text-[#3B82F6] shrink-0" />
                    <span className="truncate">{alert.district}, {alert.state}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#9AA5C1] truncate">
                    <Building className="w-3 h-3 text-[#EAB308] shrink-0" />
                    <span className="truncate">{alert.vendor}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] text-[#9AA5C1]">Exposure:</span>
                    <span className="font-mono font-bold text-xs text-[#E7EBF5]">
                      {alert.financialImpact}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="text-[10px] text-[#9AA5C1]">Risk:</span>
                    <span
                      className={cn(
                        'font-bold',
                        alert.riskScore >= 90
                          ? 'text-[#EF4444]'
                          : alert.riskScore >= 75
                          ? 'text-[#F59E0B]'
                          : 'text-[#EAB308]'
                      )}
                    >
                      {alert.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between pt-1 border-t border-[#232D47]/60"
              >
                <span className="font-mono text-[10px] text-[#3B82F6] truncate max-w-[140px]">
                  {alert.workCode}
                </span>

                <div className="flex items-center gap-1.5">
                  {alert.status === 'New' && (
                    <button
                      onClick={() => onUpdateStatus(alert.id, 'Under Review')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161F36] hover:bg-[#1f2b4a] text-[#38BDF8] border border-[#38BDF8]/40 transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                  )}
                  {alert.status !== 'Escalated' && alert.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateStatus(alert.id, 'Escalated')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#381B47]/80 hover:bg-[#381B47] text-[#C084FC] border border-[#C084FC]/40 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Escalate</span>
                    </button>
                  )}
                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateStatus(alert.id, 'Resolved')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0F3020] hover:bg-[#14422c] text-[#4ADE80] border border-[#4ADE80]/40 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 pt-2 text-xs font-mono text-[#9AA5C1]">
        <div className="flex items-center gap-2">
          <span>Cards per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 px-2 rounded bg-[#10182B] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
          <span className="text-[11px] text-[#667090]">
            {totalItems > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 text-xs text-[#E7EBF5]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
