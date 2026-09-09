import React from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Send,
  CheckCircle,
  Eye,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { AnomalyAlert, AlertSortField, AlertStatus } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { cn } from '@/lib/utils'

interface AlertQueueTableProps {
  alerts: AnomalyAlert[]
  selectedAlertId: string | null
  onSelectAlert: (alert: AnomalyAlert) => void
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void
  sortField: AlertSortField
  sortDirection: 'asc' | 'desc'
  onSortChange: (field: AlertSortField) => void
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  density: 'standard' | 'dense'
}

export const AlertQueueTable: React.FC<AlertQueueTableProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onUpdateStatus,
  sortField,
  sortDirection,
  onSortChange,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  density,
}) => {
  // Pagination calculations
  const totalItems = alerts.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedAlerts = alerts.slice(startIndex, startIndex + pageSize)

  const renderSortIcon = (field: AlertSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#3B82F6]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#3B82F6]" />
    )
  }

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

  const rowPaddingClass = density === 'dense' ? 'py-1.5 px-2.5' : 'py-2.5 px-3'

  return (
    <div className="flex flex-col h-full space-y-2 select-none">
      {/* 1. Main Data Table */}
      <div className="w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#10182B] shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-8 border-b border-[#232D47] bg-[#0A0E1A]/80 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#9AA5C1]">
              <th
                onClick={() => onSortChange('id')}
                className="px-3 cursor-pointer hover:text-[#E7EBF5] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Alert ID / Age</span>
                  {renderSortIcon('id')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('severity')}
                className="px-3 cursor-pointer hover:text-[#E7EBF5] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Severity</span>
                  {renderSortIcon('severity')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('riskScore')}
                className="px-3 cursor-pointer hover:text-[#E7EBF5] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  {renderSortIcon('riskScore')}
                </div>
              </th>
              <th className="px-3 whitespace-nowrap">Anomaly Trigger</th>
              <th className="px-3 whitespace-nowrap">Project / Entity</th>
              <th className="px-3 whitespace-nowrap">Location</th>
              <th
                onClick={() => onSortChange('financialImpact')}
                className="px-3 cursor-pointer hover:text-[#E7EBF5] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Impact Exposure</span>
                  {renderSortIcon('financialImpact')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('status')}
                className="px-3 cursor-pointer hover:text-[#E7EBF5] transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Workflow</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th className="px-3 text-right whitespace-nowrap">Triage Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="h-32 text-center text-xs text-[#667090] font-sans"
                >
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <AlertOctagon className="w-6 h-6 text-[#667090] mb-1" />
                    <span>No anomaly alerts found matching the current filter criteria.</span>
                    <span className="text-[10px] text-[#667090]">
                      Try resetting filters or adjusting search queries.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert) => {
                const isSelected = selectedAlertId === alert.id
                return (
                  <tr
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className={cn(
                      'group transition-colors border-b border-[#161F36] hover:bg-[#161F36] cursor-pointer',
                      isSelected && 'bg-[#161F36]/90'
                    )}
                  >
                    {/* Alert ID & Created Time */}
                    <td
                      className={cn(
                        rowPaddingClass,
                        'whitespace-nowrap transition-all',
                        isSelected && 'border-l-2 border-l-[#3B82F6] pl-[10px]'
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-[#adc6ff] group-hover:underline">
                          {alert.id}
                        </span>
                        <span className="font-mono text-[10px] text-[#9AA5C1] flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-[#667090]" />
                          {alert.createdTime}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap')}>
                      <RiskBadge
                        level={alert.severity}
                        withPip
                        pulse={alert.severity === 'critical' && alert.status !== 'Resolved'}
                        size="sm"
                      />
                    </td>

                    {/* Risk Score */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap font-mono font-tabular')}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-xs font-bold',
                            alert.riskScore >= 90
                              ? 'text-[#EF4444]'
                              : alert.riskScore >= 75
                              ? 'text-[#F59E0B]'
                              : 'text-[#EAB308]'
                          )}
                        >
                          {alert.riskScore}
                        </span>
                        <div className="w-10 bg-[#0A0E1A] h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              alert.riskScore >= 90
                                ? 'bg-[#EF4444]'
                                : alert.riskScore >= 75
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#EAB308]'
                            )}
                            style={{ width: `${alert.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Anomaly Type */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap')}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans bg-[#161F36] border border-[#232D47] text-[#E7EBF5]">
                        {alert.anomalyType}
                      </span>
                    </td>

                    {/* Project / Entity */}
                    <td className={cn(rowPaddingClass, 'max-w-[220px]')}>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-semibold text-[#E7EBF5] truncate">
                          {alert.projectTitle}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9AA5C1] truncate mt-0.5">
                          <span className="text-[#3B82F6]">{alert.workCode}</span>
                          <span>•</span>
                          <span className="truncate">{alert.vendor}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap')}>
                      <div className="flex flex-col text-xs">
                        <span className="text-[#E7EBF5]">{alert.district}</span>
                        <span className="text-[10px] text-[#9AA5C1] font-mono">
                          {alert.state}
                        </span>
                      </div>
                    </td>

                    {/* Financial Impact */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap text-right font-mono font-tabular')}>
                      <span className="text-xs font-bold text-[#E7EBF5]">
                        {alert.financialImpact}
                      </span>
                    </td>

                    {/* Status */}
                    <td className={cn(rowPaddingClass, 'whitespace-nowrap text-center')}>
                      {renderStatusBadge(alert.status)}
                    </td>

                    {/* Triage Quick Actions */}
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className={cn(rowPaddingClass, 'whitespace-nowrap text-right')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {alert.status === 'New' && (
                          <button
                            onClick={() => onUpdateStatus(alert.id, 'Under Review')}
                            title="Mark Under Review"
                            className="px-2 py-1 rounded text-[10px] font-mono bg-[#161F36] hover:bg-[#1f2b4a] text-[#38BDF8] border border-[#38BDF8]/40 transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        )}
                        {alert.status !== 'Escalated' && alert.status !== 'Resolved' && (
                          <button
                            onClick={() => onUpdateStatus(alert.id, 'Escalated')}
                            title="Escalate to MoSPI / CAG"
                            className="p-1 rounded text-[#C084FC] hover:bg-[#3B174F] transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {alert.status !== 'Resolved' && (
                          <button
                            onClick={() => onUpdateStatus(alert.id, 'Resolved')}
                            title="Mark Resolved"
                            className="p-1 rounded text-[#4ADE80] hover:bg-[#0F3020] transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectAlert(alert)}
                          title="View Forensic Evidence"
                          className="p-1 rounded text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Pagination Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 pt-1 text-xs font-mono text-[#9AA5C1]">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 px-2 rounded bg-[#10182B] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-[11px] text-[#667090]">
            {totalItems > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
          </span>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
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
            title="Next Page"
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Last Page"
            className="p-1 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
