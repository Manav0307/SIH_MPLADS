import React from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Building2,
  Clock,
} from 'lucide-react'
import { AgencyRecord, AgencySortField } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

interface AgencyDirectoryTableProps {
  agencies: AgencyRecord[]
  sortField: AgencySortField
  sortOrder: 'asc' | 'desc'
  onSort: (field: AgencySortField) => void
  onSelectAgency: (agency: AgencyRecord) => void
  selectedAgencyId?: string
  density?: 'standard' | 'dense'
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const AgencyDirectoryTable: React.FC<AgencyDirectoryTableProps> = ({
  agencies,
  sortField,
  sortOrder,
  onSort,
  onSelectAgency,
  selectedAgencyId,
  density = 'standard',
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const rowHeight = density === 'dense' ? 'py-1.5' : 'py-2.5'

  const renderSortIcon = (field: AgencySortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 text-[#667090] opacity-40 group-hover:opacity-100 transition-opacity" />
      )
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#3B82F6]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#3B82F6]" />
    )
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedAgencies = agencies.slice(startIndex, startIndex + pageSize)

  return (
    <div className="w-full flex flex-col border border-[#232D47] rounded-lg bg-[#10182B] select-none shadow-sm overflow-hidden">
      {/* Dense Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left font-sans text-xs">
          <thead>
            <tr className="h-8 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
              {/* 1. Risk */}
              <th className="px-3 whitespace-nowrap">Risk</th>

              {/* 2. Risk Score */}
              <th
                onClick={() => onSort('riskScore')}
                className="px-2.5 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-center gap-1 group">
                  <span>Score</span>
                  {renderSortIcon('riskScore')}
                </div>
              </th>

              {/* 3. Agency */}
              <th className="px-3 whitespace-nowrap">Agency</th>

              {/* 4. Agency Type */}
              <th className="px-2.5 whitespace-nowrap">Agency Type</th>

              {/* 5. State Presence */}
              <th className="px-2.5 whitespace-nowrap">State Presence</th>

              {/* 6. Active Works */}
              <th
                onClick={() => onSort('activeWorks')}
                className="px-2 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-center gap-1 group">
                  <span>Active</span>
                  {renderSortIcon('activeWorks')}
                </div>
              </th>

              {/* 7. Completed Works */}
              <th className="px-2 text-center whitespace-nowrap">Completed</th>

              {/* 8. Total Sanctioned */}
              <th className="px-3 text-right whitespace-nowrap">Total Sanctioned</th>

              {/* 9. Total Disbursed */}
              <th
                onClick={() => onSort('totalDisbursed')}
                className="px-3 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-end gap-1 group">
                  <span>Total Disbursed</span>
                  {renderSortIcon('totalDisbursed')}
                </div>
              </th>

              {/* 10. Flagged Works */}
              <th className="px-2 text-center whitespace-nowrap">Flagged</th>

              {/* 11. Flagged % */}
              <th
                onClick={() => onSort('flaggedPercentage')}
                className="px-2.5 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-center gap-1 group">
                  <span>Flagged %</span>
                  {renderSortIcon('flaggedPercentage')}
                </div>
              </th>

              {/* 12. Avg Project Value */}
              <th
                onClick={() => onSort('avgProjectValue')}
                className="px-3 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-end gap-1 group">
                  <span>Avg Value</span>
                  {renderSortIcon('avgProjectValue')}
                </div>
              </th>

              {/* 13. Delayed Works */}
              <th
                onClick={() => onSort('delayedWorks')}
                className="px-2.5 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-center gap-1 group">
                  <span>Delayed</span>
                  {renderSortIcon('delayedWorks')}
                </div>
              </th>

              {/* 14. Primary Anomaly */}
              <th className="px-3 whitespace-nowrap min-w-[180px]">Primary Anomaly</th>

              {/* 15. Action */}
              <th className="px-3 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#232D47]/60 font-sans">
            {paginatedAgencies.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-12 text-center text-[#9AA5C1] font-mono text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="w-8 h-8 text-[#667090]" />
                    <span>No implementing agencies match the applied forensic filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAgencies.map((agency) => {
                const isSelected = selectedAgencyId === agency.id
                const isCritical = agency.riskLevel === 'critical'
                const isHigh = agency.riskLevel === 'high'

                return (
                  <tr
                    key={agency.id}
                    onClick={() => onSelectAgency(agency)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#161F36] border-l-2 border-[#3B82F6]'
                        : 'hover:bg-[#161F36]/60'
                    }`}
                  >
                    {/* 1. Risk */}
                    <td className={`px-3 ${rowHeight} whitespace-nowrap`}>
                      <RiskBadge level={agency.riskLevel} />
                    </td>

                    {/* 2. Risk Score */}
                    <td className={`px-2.5 ${rowHeight} text-center whitespace-nowrap font-mono`}>
                      <span
                        className={`font-bold font-tabular text-xs px-1.5 py-0.5 rounded ${
                          isCritical
                            ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30'
                            : isHigh
                            ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30'
                            : agency.riskLevel === 'medium'
                            ? 'text-[#EAB308] bg-[#EAB308]/10'
                            : 'text-[#22C55E] bg-[#22C55E]/10'
                        }`}
                      >
                        {agency.riskScore}
                      </span>
                    </td>

                    {/* 3. Agency Name */}
                    <td className={`px-3 ${rowHeight} whitespace-nowrap`}>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate">
                          {agency.name}
                        </span>
                        {agency.topConstituency && (
                          <span className="text-[10px] text-[#667090] font-mono truncate">
                            Base: {agency.topConstituency}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 4. Agency Type */}
                    <td className={`px-2.5 ${rowHeight} whitespace-nowrap`}>
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#0A0E1A] border border-[#232D47] text-[#9AA5C1] truncate max-w-[140px]">
                        {agency.agencyType}
                      </span>
                    </td>

                    {/* 5. State Presence */}
                    <td className={`px-2.5 ${rowHeight} whitespace-nowrap`}>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-[#9AA5C1]">
                        {agency.statePresence.slice(0, 2).map((st) => (
                          <span
                            key={st}
                            className="px-1.5 py-0.2 rounded bg-[#161F36] text-[10px] text-[#adc6ff]"
                          >
                            {st}
                          </span>
                        ))}
                        {agency.statePresence.length > 2 && (
                          <span className="text-[9px] text-[#667090]">
                            +{agency.statePresence.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Active Works */}
                    <td className={`px-2 ${rowHeight} text-center whitespace-nowrap font-mono font-tabular text-xs text-[#E7EBF5]`}>
                      {agency.activeWorks}
                    </td>

                    {/* 7. Completed Works */}
                    <td className={`px-2 ${rowHeight} text-center whitespace-nowrap font-mono font-tabular text-xs text-[#667090]`}>
                      {agency.completedWorks}
                    </td>

                    {/* 8. Total Sanctioned */}
                    <td className={`px-3 ${rowHeight} text-right whitespace-nowrap font-mono font-tabular text-xs text-[#9AA5C1]`}>
                      {agency.totalSanctioned}
                    </td>

                    {/* 9. Total Disbursed */}
                    <td className={`px-3 ${rowHeight} text-right whitespace-nowrap font-mono font-tabular text-xs font-semibold text-[#22C55E]`}>
                      {agency.totalDisbursed}
                    </td>

                    {/* 10. Flagged Works */}
                    <td className={`px-2 ${rowHeight} text-center whitespace-nowrap font-mono font-tabular text-xs`}>
                      <span
                        className={
                          agency.flaggedWorksCount > 0
                            ? 'text-[#F59E0B] font-bold'
                            : 'text-[#667090]'
                        }
                      >
                        {agency.flaggedWorksCount}
                      </span>
                    </td>

                    {/* 11. Flagged % */}
                    <td className={`px-2.5 ${rowHeight} text-center whitespace-nowrap font-mono font-tabular text-xs`}>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[11px] ${
                          agency.flaggedPercentage >= 60
                            ? 'bg-[#EF4444]/15 text-[#EF4444] font-bold'
                            : agency.flaggedPercentage >= 30
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] font-medium'
                            : 'text-[#9AA5C1]'
                        }`}
                      >
                        {agency.flaggedPercentage}%
                      </span>
                    </td>

                    {/* 12. Avg Project Value */}
                    <td className={`px-3 ${rowHeight} text-right whitespace-nowrap font-mono font-tabular text-xs text-[#9AA5C1]`}>
                      {agency.avgProjectValue}
                    </td>

                    {/* 13. Delayed Works */}
                    <td className={`px-2.5 ${rowHeight} text-center whitespace-nowrap font-mono font-tabular text-xs`}>
                      {agency.delayedWorksCount > 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#EF4444]/10 text-[#EF4444] font-bold">
                          <Clock className="w-2.5 h-2.5" />
                          {agency.delayedWorksCount}
                        </span>
                      ) : (
                        <span className="text-[#667090]">0</span>
                      )}
                    </td>

                    {/* 14. Primary Anomaly */}
                    <td className={`px-3 ${rowHeight} whitespace-nowrap`}>
                      <div
                        className="text-[11px] text-[#9AA5C1] truncate max-w-[200px]"
                        title={agency.primaryAnomaly}
                      >
                        {agency.primaryAnomaly}
                      </div>
                    </td>

                    {/* 15. Action */}
                    <td className={`px-3 ${rowHeight} text-right whitespace-nowrap font-mono`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectAgency(agency)
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[11px] text-[#3B82F6] hover:text-[#adc6ff] border border-[#232D47] transition-colors cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[#232D47] bg-[#0D1424] text-xs font-mono text-[#9AA5C1] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#E7EBF5]">{totalCount === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong className="text-[#E7EBF5]">
              {Math.min(startIndex + pageSize, totalCount)}
            </strong>{' '}
            of <strong className="text-[#E7EBF5]">{totalCount}</strong> agencies
          </span>

          <div className="flex items-center gap-1 ml-3 border-l border-[#232D47] pl-3">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
              className="bg-[#10182B] border border-[#232D47] text-[#E7EBF5] rounded px-1.5 py-0.5 text-xs cursor-pointer focus:outline-none focus:border-[#3B82F6]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
            className="px-2 py-0.5 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Prev
          </button>
          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="px-2 py-0.5 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
