import React from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Layers,
} from 'lucide-react'
import { VendorRecord, VendorSortField } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

interface VendorDirectoryTableProps {
  vendors: VendorRecord[]
  sortField: VendorSortField
  sortOrder: 'asc' | 'desc'
  onSort: (field: VendorSortField) => void
  onSelectVendor: (vendor: VendorRecord) => void
  onViewProjects: (vendor: VendorRecord, e: React.MouseEvent) => void
  selectedVendorId?: string
  density?: 'standard' | 'dense'
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const VendorDirectoryTable: React.FC<VendorDirectoryTableProps> = ({
  vendors,
  sortField,
  sortOrder,
  onSort,
  onSelectVendor,
  onViewProjects,
  selectedVendorId,
  density = 'standard',
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const rowHeight = density === 'dense' ? 'py-1.5' : 'py-2.5'

  const renderSortIcon = (field: VendorSortField) => {
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
  const paginatedVendors = vendors.slice(startIndex, startIndex + pageSize)

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

              {/* 3. Vendor */}
              <th className="px-3 whitespace-nowrap">Vendor Name</th>

              {/* 4. GSTIN */}
              <th className="px-2.5 whitespace-nowrap">GSTIN</th>

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
              <th className="px-2 text-center whitespace-nowrap">Done</th>

              {/* 8. Total Sanctioned */}
              <th className="px-2.5 text-right whitespace-nowrap">Sanctioned</th>

              {/* 9. Total Disbursed */}
              <th
                onClick={() => onSort('totalDisbursed')}
                className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-end gap-1 group">
                  <span>Disbursed</span>
                  {renderSortIcon('totalDisbursed')}
                </div>
              </th>

              {/* 10. Flagged Works */}
              <th className="px-2 text-center whitespace-nowrap">Flagged</th>

              {/* 11. Flagged % */}
              <th
                onClick={() => onSort('flaggedPercentage')}
                className="px-2 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-center gap-1 group">
                  <span>Flagged %</span>
                  {renderSortIcon('flaggedPercentage')}
                </div>
              </th>

              {/* 12. Avg Project Value */}
              <th
                onClick={() => onSort('avgProjectValue')}
                className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
              >
                <div className="flex items-center justify-end gap-1 group">
                  <span>Avg Value</span>
                  {renderSortIcon('avgProjectValue')}
                </div>
              </th>

              {/* 13. Primary Anomaly */}
              <th className="px-3 whitespace-nowrap">Primary Anomaly Signal</th>

              {/* 14. Network Signal */}
              <th className="px-2.5 whitespace-nowrap">Network Signal</th>

              {/* 15. Action */}
              <th className="px-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#161F36]">
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-12 text-center text-[#9AA5C1]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-[#667090]" />
                    <span className="font-mono text-xs">No vendor intelligence records match the active criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVendors.map((v) => {
                const isSelected = selectedVendorId === v.id
                const isCrit = v.riskLevel === 'critical'
                const isHigh = v.riskLevel === 'high'

                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelectVendor(v)}
                    className={`hover:bg-[#161F36]/80 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#161F36] border-l-2 border-[#3B82F6]' : ''
                    }`}
                  >
                    {/* 1. Risk Badge */}
                    <td className={`${rowHeight} px-3 whitespace-nowrap align-middle`}>
                      <RiskBadge
                        level={v.riskLevel}
                        score={v.riskScore}
                        size="sm"
                        withPip={isCrit}
                        pulse={isCrit}
                      />
                    </td>

                    {/* 2. Score */}
                    <td className={`${rowHeight} px-2.5 text-center font-mono font-tabular font-bold align-middle`}>
                      <span className={isCrit ? 'text-[#EF4444]' : isHigh ? 'text-[#F59E0B]' : 'text-[#E7EBF5]'}>
                        {v.riskScore}
                      </span>
                    </td>

                    {/* 3. Vendor */}
                    <td className={`${rowHeight} px-3 whitespace-nowrap align-middle`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-[#667090] font-mono">
                          Reg: {v.registeredState || 'India'}
                        </span>
                      </div>
                    </td>

                    {/* 4. GSTIN */}
                    <td className={`${rowHeight} px-2.5 whitespace-nowrap font-mono text-[11px] text-[#9AA5C1] align-middle`}>
                      {v.gstin}
                    </td>

                    {/* 5. State Presence */}
                    <td className={`${rowHeight} px-2.5 whitespace-nowrap align-middle`}>
                      <div className="flex items-center gap-1">
                        {v.statePresence && v.statePresence.slice(0, 2).map((st) => (
                          <span
                            key={st}
                            className="px-1.5 py-0.2 rounded bg-[#0A0E1A] border border-[#232D47] text-[10px] font-mono text-[#9AA5C1]"
                          >
                            {st.slice(0, 3).toUpperCase()}
                          </span>
                        ))}
                        {v.statePresence && v.statePresence.length > 2 && (
                          <span className="text-[10px] font-mono text-[#667090]">
                            +{v.statePresence.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Active Works */}
                    <td className={`${rowHeight} px-2 text-center font-mono font-tabular text-[#E7EBF5] align-middle`}>
                      {v.activeWorks}
                    </td>

                    {/* 7. Completed Works */}
                    <td className={`${rowHeight} px-2 text-center font-mono font-tabular text-[#9AA5C1] align-middle`}>
                      {v.completedWorks ?? 0}
                    </td>

                    {/* 8. Total Sanctioned */}
                    <td className={`${rowHeight} px-2.5 text-right font-mono font-tabular text-[#9AA5C1] align-middle`}>
                      {v.totalSanctioned || '—'}
                    </td>

                    {/* 9. Total Disbursed */}
                    <td className={`${rowHeight} px-2.5 text-right font-mono font-tabular font-bold text-[#22C55E] align-middle`}>
                      {v.totalDisbursed}
                    </td>

                    {/* 10. Flagged Works */}
                    <td className={`${rowHeight} px-2 text-center font-mono font-tabular font-bold align-middle`}>
                      <span className={v.flaggedWorksCount > 0 ? (isCrit ? 'text-[#EF4444]' : 'text-[#F59E0B]') : 'text-[#667090]'}>
                        {v.flaggedWorksCount}
                      </span>
                    </td>

                    {/* 11. Flagged % */}
                    <td className={`${rowHeight} px-2 text-center font-mono font-tabular font-bold align-middle`}>
                      <span className={v.flaggedPercentage >= 50 ? 'text-[#EF4444]' : v.flaggedPercentage > 0 ? 'text-[#F59E0B]' : 'text-[#667090]'}>
                        {v.flaggedPercentage}%
                      </span>
                    </td>

                    {/* 12. Avg Project Value */}
                    <td className={`${rowHeight} px-2.5 text-right font-mono font-tabular text-[#E7EBF5] align-middle`}>
                      {v.avgProjectValue || '—'}
                    </td>

                    {/* 13. Primary Anomaly */}
                    <td className={`${rowHeight} px-3 text-[11px] align-middle max-w-[200px] truncate`}>
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[10px] font-sans inline-block truncate max-w-full ${
                          isCrit
                            ? 'bg-[#401515]/40 text-[#EF4444] border-[#EF4444]/30'
                            : isHigh
                            ? 'bg-[#3A2A0C]/40 text-[#F59E0B] border-[#F59E0B]/30'
                            : 'bg-[#0A0E1A] text-[#9AA5C1] border-[#232D47]'
                        }`}
                        title={v.primaryAnomaly}
                      >
                        {v.primaryAnomaly}
                      </span>
                    </td>

                    {/* 14. Network Signal */}
                    <td className={`${rowHeight} px-2.5 align-middle whitespace-nowrap`}>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#10182B] border border-[#232D47] text-[#3B82F6]">
                        <Layers className="w-2.5 h-2.5 text-[#3B82F6]" />
                        <span className="truncate max-w-[140px]" title={v.networkSignal || 'Signal Active'}>
                          {v.networkSignal || 'Standard Node'}
                        </span>
                      </span>
                    </td>

                    {/* 15. Actions */}
                    <td className={`${rowHeight} px-3 text-right whitespace-nowrap align-middle`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => onViewProjects(v, e)}
                          className="px-2 py-1 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-[10px] font-mono text-[#3B82F6] hover:text-[#E7EBF5] transition-colors cursor-pointer"
                          title={`Filter Project Ledger for ${v.name}`}
                        >
                          <span className="flex items-center gap-1">
                            <span>Projects</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectVendor(v)}
                          className="p-1 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
                          title="Open Contractor Profile"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#9AA5C1]" />
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

      {/* Pagination Strip */}
      <div className="px-3 py-2 border-t border-[#232D47] bg-[#0D1424] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#9AA5C1]">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#E7EBF5]">{totalCount > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-[#E7EBF5]">{Math.min(startIndex + pageSize, totalCount)}</strong> of{' '}
            <strong className="text-[#E7EBF5]">{totalCount}</strong> contractors
          </span>
          <span className="text-[#667090]">&bull;</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
              aria-label="Vendors per page"
              className="bg-[#0A0E1A] border border-[#232D47] rounded px-1.5 py-0.5 text-[#E7EBF5] text-[10px] focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-2 py-1 bg-[#161F36] hover:bg-[#232D47] disabled:opacity-30 disabled:pointer-events-none border border-[#232D47] rounded text-[10px] text-[#E7EBF5] transition-colors cursor-pointer"
          >
            Prev
          </button>
          <span className="px-2 text-[10px]">
            Page <strong className="text-[#E7EBF5]">{currentPage}</strong> of <strong className="text-[#E7EBF5]">{totalPages}</strong>
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-2 py-1 bg-[#161F36] hover:bg-[#232D47] disabled:opacity-30 disabled:pointer-events-none border border-[#232D47] rounded text-[10px] text-[#E7EBF5] transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
