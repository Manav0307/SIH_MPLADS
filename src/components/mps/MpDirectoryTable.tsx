import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, AlertTriangle } from 'lucide-react'
import { MpRecord } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

export type MpSortField =
  | 'riskScore'
  | 'name'
  | 'constituency'
  | 'state'
  | 'allocatedAmount'
  | 'sanctionedAmount'
  | 'disbursedAmount'
  | 'utilizationPercent'
  | 'projectsCount'
  | 'flaggedProjectsCount'

interface MpDirectoryTableProps {
  mps: MpRecord[]
  sortField: MpSortField
  sortOrder: 'asc' | 'desc'
  onSort: (field: MpSortField) => void
  onSelectMp: (mp: MpRecord) => void
  density?: 'standard' | 'dense'
  onClearFilters?: () => void
}

export const MpDirectoryTable: React.FC<MpDirectoryTableProps> = ({
  mps,
  sortField,
  sortOrder,
  onSort,
  onSelectMp,
  density = 'standard',
  onClearFilters,
}) => {
  const rowHeight = density === 'dense' ? 'py-1.5' : 'py-2.5'

  const renderSortIcon = (field: MpSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#667090] opacity-40 group-hover:opacity-100 transition-opacity" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#3B82F6]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#3B82F6]" />
    )
  }

  return (
    <div className="w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#10182B] select-none shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-8 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
            {/* 1. Risk */}
            <th className="px-3 whitespace-nowrap">Risk</th>

            {/* 2. MP */}
            <th
              onClick={() => onSort('name')}
              className="px-2.5 whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center gap-1 group">
                <span>MP Name</span>
                {renderSortIcon('name')}
              </div>
            </th>

            {/* 3. Constituency */}
            <th
              onClick={() => onSort('constituency')}
              className="px-2.5 whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center gap-1 group">
                <span>Constituency</span>
                {renderSortIcon('constituency')}
              </div>
            </th>

            {/* 4. State */}
            <th
              onClick={() => onSort('state')}
              className="px-2.5 whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center gap-1 group">
                <span>State</span>
                {renderSortIcon('state')}
              </div>
            </th>

            {/* 5. Allocated */}
            <th
              onClick={() => onSort('allocatedAmount')}
              className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-end gap-1 group">
                <span>Allocated</span>
                {renderSortIcon('allocatedAmount')}
              </div>
            </th>

            {/* 6. Sanctioned */}
            <th
              onClick={() => onSort('sanctionedAmount')}
              className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-end gap-1 group">
                <span>Sanctioned</span>
                {renderSortIcon('sanctionedAmount')}
              </div>
            </th>

            {/* 7. Disbursed */}
            <th
              onClick={() => onSort('disbursedAmount')}
              className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-end gap-1 group">
                <span>Disbursed</span>
                {renderSortIcon('disbursedAmount')}
              </div>
            </th>

            {/* 8. Utilization % */}
            <th
              onClick={() => onSort('utilizationPercent')}
              className="px-2.5 text-right whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-end gap-1 group">
                <span>Utilization</span>
                {renderSortIcon('utilizationPercent')}
              </div>
            </th>

            {/* 9. Projects */}
            <th
              onClick={() => onSort('projectsCount')}
              className="px-2 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-center gap-1 group">
                <span>Works</span>
                {renderSortIcon('projectsCount')}
              </div>
            </th>

            {/* 10. Flagged Projects */}
            <th
              onClick={() => onSort('flaggedProjectsCount')}
              className="px-2 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-center gap-1 group text-[#EF4444]">
                <span>Flagged</span>
                {renderSortIcon('flaggedProjectsCount')}
              </div>
            </th>

            {/* 11. Risk Score */}
            <th
              onClick={() => onSort('riskScore')}
              className="px-2 text-center whitespace-nowrap cursor-pointer hover:text-[#E7EBF5] transition-colors"
            >
              <div className="flex items-center justify-center gap-1 group">
                <span>Score</span>
                {renderSortIcon('riskScore')}
              </div>
            </th>

            {/* 12. Primary Risk */}
            <th className="px-3 whitespace-nowrap min-w-[200px]">Primary Anomaly Profile</th>

            {/* Action arrow */}
            <th className="w-8 px-2 text-center"></th>
          </tr>
        </thead>

        <tbody>
          {mps.length === 0 ? (
            <tr>
              <td colSpan={13} className="py-12 text-center font-sans text-xs text-[#667090]">
                <div className="flex flex-col items-center justify-center gap-2">
                  <p>No parliamentary constituencies found matching your current filter criteria.</p>
                  {onClearFilters && (
                    <button
                      onClick={onClearFilters}
                      className="px-3 py-1 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono cursor-pointer transition-colors"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            mps.map((mp) => {
              const isCrit = mp.riskLevel === 'critical'

              return (
                <tr
                  key={mp.id}
                  onClick={() => onSelectMp(mp)}
                  className="border-b border-[#161F36] hover:bg-[#161F36] cursor-pointer transition-colors group"
                >
                  {/* 1. Risk */}
                  <td className={`px-3 ${rowHeight} whitespace-nowrap border-l-2 border-l-transparent group-hover:border-l-[#3B82F6]`}>
                    <RiskBadge
                      level={mp.riskLevel}
                      score={mp.riskScore}
                      withPip={isCrit}
                      pulse={isCrit}
                      size="sm"
                    />
                  </td>

                  {/* 2. MP */}
                  <td className={`px-2.5 ${rowHeight} whitespace-nowrap`}>
                    <div className="font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
                      <span>{mp.name}</span>
                      <span className="font-mono text-[10px] text-[#9AA5C1] px-1 py-0.2 rounded bg-[#0A0E1A] border border-[#232D47]">
                        {mp.house}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#667090] font-sans">
                      {mp.party} &bull; {mp.term.split('(')[0]}
                    </div>
                  </td>

                  {/* 3. Constituency */}
                  <td className={`px-2.5 ${rowHeight} whitespace-nowrap`}>
                    <div className="font-mono text-xs text-[#E7EBF5] font-medium">
                      {mp.constituency}
                    </div>
                    <div className="text-[10px] text-[#667090] font-mono">
                      CODE: {mp.constituencyCode}
                    </div>
                  </td>

                  {/* 4. State */}
                  <td className={`px-2.5 ${rowHeight} whitespace-nowrap`}>
                    <div className="text-xs text-[#E7EBF5] font-medium">
                      {mp.state}
                    </div>
                    <div className="text-[10px] text-[#667090] font-sans">
                      {mp.district}
                    </div>
                  </td>

                  {/* 5. Allocated */}
                  <td className={`px-2.5 ${rowHeight} text-right font-mono font-tabular text-[#9AA5C1] whitespace-nowrap`}>
                    {mp.allocatedDisplay}
                  </td>

                  {/* 6. Sanctioned */}
                  <td className={`px-2.5 ${rowHeight} text-right font-mono font-tabular text-[#E7EBF5] font-semibold whitespace-nowrap`}>
                    {mp.sanctionedDisplay}
                  </td>

                  {/* 7. Disbursed */}
                  <td className={`px-2.5 ${rowHeight} text-right font-mono font-tabular text-[#22C55E] font-semibold whitespace-nowrap`}>
                    {mp.disbursedDisplay}
                  </td>

                  {/* 8. Utilization % */}
                  <td className={`px-2.5 ${rowHeight} text-right font-mono font-tabular whitespace-nowrap`}>
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-[#0A0E1A] rounded overflow-hidden border border-[#232D47] hidden sm:block">
                        <div
                          style={{ width: `${Math.min(100, mp.utilizationPercent)}%` }}
                          className={`h-full ${
                            mp.utilizationPercent < 50
                              ? 'bg-[#EF4444]'
                              : mp.utilizationPercent < 75
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#22C55E]'
                          }`}
                        />
                      </div>
                      <span className={`font-semibold ${
                        mp.utilizationPercent < 50
                          ? 'text-[#EF4444]'
                          : mp.utilizationPercent < 75
                          ? 'text-[#F59E0B]'
                          : 'text-[#22C55E]'
                      }`}>
                        {mp.utilizationPercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* 9. Projects */}
                  <td className={`px-2 ${rowHeight} text-center font-mono font-tabular text-[#E7EBF5] whitespace-nowrap`}>
                    {mp.projectsCount}
                  </td>

                  {/* 10. Flagged Projects */}
                  <td className={`px-2 ${rowHeight} text-center font-mono font-tabular whitespace-nowrap`}>
                    {mp.flaggedProjectsCount > 0 ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#401515] border border-[#EF4444]/40 text-[#EF4444] font-bold text-[10px]">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {mp.flaggedProjectsCount}
                      </span>
                    ) : (
                      <span className="text-[#22C55E] text-xs font-medium">0</span>
                    )}
                  </td>

                  {/* 11. Risk Score */}
                  <td className={`px-2 ${rowHeight} text-center font-mono font-tabular font-bold whitespace-nowrap ${
                    mp.riskScore >= 85
                      ? 'text-[#EF4444]'
                      : mp.riskScore >= 70
                      ? 'text-[#F59E0B]'
                      : mp.riskScore >= 40
                      ? 'text-[#EAB308]'
                      : 'text-[#22C55E]'
                  }`}>
                    {mp.riskScore}
                  </td>

                  {/* 12. Primary Risk */}
                  <td className={`px-3 ${rowHeight} text-xs text-[#9AA5C1] max-w-[240px]`}>
                    <div className="truncate" title={mp.primaryRisk}>
                      {mp.primaryRisk}
                    </div>
                  </td>

                  {/* Action chevron */}
                  <td className={`px-2 ${rowHeight} text-center text-[#667090] group-hover:text-[#3B82F6] transition-colors`}>
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
