import React from 'react'
import {
  Search,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { CaseFilterState, CaseSortField, CaseOfficer } from '@/types/cases'
import { cn } from '@/lib/utils'

interface CaseFiltersBarProps {
  filters: CaseFilterState
  sortField: CaseSortField
  sortDirection: 'asc' | 'desc'
  officers: CaseOfficer[]
  states: string[]
  totalCases: number
  filteredCount: number
  onFilterChange: (key: keyof CaseFilterState, value: string) => void
  onResetFilters: () => void
  onSortChange: (field: CaseSortField) => void
  onToggleSortDirection: () => void
}

const statusOptions = [
  'All',
  'New',
  'Under Review',
  'Field Verification',
  'Escalated',
  'Resolved',
]

const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low']

export const CaseFiltersBar: React.FC<CaseFiltersBarProps> = ({
  filters,
  sortField,
  sortDirection,
  officers,
  states,
  totalCases,
  filteredCount,
  onFilterChange,
  onResetFilters,
  onSortChange,
  onToggleSortDirection,
}) => {
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.status !== 'All' ||
    filters.severity !== 'All' ||
    filters.officer !== 'All' ||
    filters.state !== 'All'

  return (
    <div className="p-3 bg-[#10182B] rounded-lg border border-[#232D47] space-y-2.5 select-none">
      {/* Top row: Search & Primary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#9AA5C1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search by Case ID, Project, Work Code, Vendor, Agency, Officer..."
            className="w-full h-8 pl-9 pr-3 rounded bg-[#0A0E1A] border border-[#232D47] text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9AA5C1] hover:text-[#E7EBF5]"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {statusOptions.map((st) => {
            const isSelected = filters.status.toLowerCase() === st.toLowerCase()
            return (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange('status', st)}
                className={cn(
                  'h-7 px-2.5 rounded text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer border',
                  isSelected
                    ? 'bg-[#161F36] text-[#adc6ff] border-[#3B82F6] font-semibold'
                    : 'bg-[#0A0E1A] text-[#9AA5C1] border-[#232D47] hover:bg-[#161F36] hover:text-[#E7EBF5]'
                )}
              >
                {st}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom row: Dropdowns, Sorters, and Counts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#232D47]/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667090] text-[11px] font-mono">Severity:</span>
            <select
              value={filters.severity}
              onChange={(e) => onFilterChange('severity', e.target.value)}
              className="h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              {severityOptions.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          {/* Officer Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667090] text-[11px] font-mono">Officer:</span>
            <select
              value={filters.officer}
              onChange={(e) => onFilterChange('officer', e.target.value)}
              className="h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6] max-w-[170px] truncate"
            >
              <option value="All">All Officers</option>
              {officers.map((off) => (
                <option key={off.id} value={off.name}>
                  {off.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667090] text-[11px] font-mono">State:</span>
            <select
              value={filters.state}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667090] text-[11px] font-mono">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as CaseSortField)}
              className="h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="riskScore">Risk Score</option>
              <option value="financialExposure">Financial Exposure</option>
              <option value="lastUpdated">Last Updated</option>
              <option value="anomalyCount">Anomaly Count</option>
              <option value="id">Case ID</option>
            </select>

            <button
              type="button"
              onClick={onToggleSortDirection}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#0A0E1A] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36]"
              title={`Sort ${sortDirection === 'desc' ? 'Descending' : 'Ascending'}`}
            >
              {sortDirection === 'desc' ? (
                <ArrowDown className="w-3.5 h-3.5" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-7 px-2 text-[11px] font-mono rounded bg-transparent hover:bg-[#161F36] text-[#EF4444] border border-[#EF4444]/40 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Telemetry Counter */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9AA5C1]">
          <span>
            Showing <strong className="text-[#adc6ff]">{filteredCount}</strong> of{' '}
            <strong className="text-[#E7EBF5]">{totalCases}</strong> cases
          </span>
        </div>
      </div>
    </div>
  )
}
