import React, { useState } from 'react'
import {
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react'
import { AlertFilterState } from '@/types'
import { cn } from '@/lib/utils'

interface AlertFiltersBarProps {
  filters: AlertFilterState
  onFilterChange: (key: keyof AlertFilterState, value: string) => void
  onResetFilters: () => void
  uniqueStates: string[]
  uniqueDistricts: string[]
  uniqueConstituencies: string[]
  uniqueMps: string[]
  uniqueAgencies: string[]
  uniqueVendors: string[]
  uniqueAnomalyTypes: string[]
  uniqueFys: string[]
  totalCount: number
  filteredCount: number
  viewMode: 'table' | 'cards'
  onViewModeChange: (mode: 'table' | 'cards') => void
  density: 'standard' | 'dense'
  onDensityChange: (density: 'standard' | 'dense') => void
}

export const AlertFiltersBar: React.FC<AlertFiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  uniqueStates,
  uniqueDistricts,
  uniqueConstituencies,
  uniqueMps,
  uniqueAgencies,
  uniqueVendors,
  uniqueAnomalyTypes,
  uniqueFys,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  density,
  onDensityChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Count active non-default filters
  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'searchQuery') return val.trim() !== ''
    return val !== 'All' && val !== ''
  }).length

  return (
    <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] space-y-2.5 select-none">
      {/* 1. Primary Top Row: Search + Quick Selects + View Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA5C1]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search by Alert ID, Project, Work Code, MP, Vendor, Agency, District..."
            className="w-full h-8 pl-8 pr-8 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA5C1] hover:text-[#E7EBF5]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Trays */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* State Filter */}
          <select
            value={filters.state}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">All States</option>
            {uniqueStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Anomaly Type Filter */}
          <select
            value={filters.anomalyType}
            onChange={(e) => onFilterChange('anomalyType', e.target.value)}
            className="h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6] cursor-pointer max-w-[150px]"
          >
            <option value="All">All Anomaly Types</option>
            {uniqueAnomalyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Toggle All Filters Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'h-8 px-2.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors cursor-pointer',
              isExpanded || activeFiltersCount > 0
                ? 'bg-[#161F36] border-[#3B82F6] text-[#adc6ff]'
                : 'bg-[#0A0E1A] border-[#232D47] text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#3B82F6] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-180')} />
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="h-8 px-2 rounded text-xs text-[#EF4444] bg-[#401515]/30 border border-[#EF4444]/40 hover:bg-[#401515] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="h-4 w-px bg-[#232D47]" />

          {/* View Mode Switcher */}
          <div className="flex items-center rounded border border-[#232D47] overflow-hidden">
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={cn(
                'w-8 h-8 flex items-center justify-center transition-colors cursor-pointer',
                viewMode === 'table'
                  ? 'bg-[#161F36] text-[#adc6ff]'
                  : 'bg-[#0A0E1A] text-[#9AA5C1] hover:text-[#E7EBF5]'
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              title="Cards View"
              className={cn(
                'w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border-l border-[#232D47]',
                viewMode === 'cards'
                  ? 'bg-[#161F36] text-[#adc6ff]'
                  : 'bg-[#0A0E1A] text-[#9AA5C1] hover:text-[#E7EBF5]'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Density toggle (for table) */}
          {viewMode === 'table' && (
            <button
              onClick={() => onDensityChange(density === 'standard' ? 'dense' : 'standard')}
              title={`Switch to ${density === 'standard' ? 'Compact' : 'Standard'} rows`}
              className="h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[10px] font-mono text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
            >
              {density === 'standard' ? 'STD' : 'DENSE'}
            </button>
          )}
        </div>
      </div>

      {/* 2. Secondary Collapsible Row: Detailed Forensic Filters */}
      {isExpanded && (
        <div className="pt-2 border-t border-[#232D47] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* District Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">District</label>
            <select
              value={filters.district}
              onChange={(e) => onFilterChange('district', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All Districts</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Constituency Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">Constituency</label>
            <select
              value={filters.constituency}
              onChange={(e) => onFilterChange('constituency', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All Constituencies</option>
              {uniqueConstituencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* MP Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">Member of Parliament</label>
            <select
              value={filters.mp}
              onChange={(e) => onFilterChange('mp', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All MPs</option>
              {uniqueMps.map((mp) => (
                <option key={mp} value={mp}>
                  {mp}
                </option>
              ))}
            </select>
          </div>

          {/* Agency Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">Implementing Agency</label>
            <select
              value={filters.agency}
              onChange={(e) => onFilterChange('agency', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All Agencies</option>
              {uniqueAgencies.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">Contractor / Vendor</label>
            <select
              value={filters.vendor}
              onChange={(e) => onFilterChange('vendor', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All Vendors</option>
              {uniqueVendors.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Financial Year Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#9AA5C1] uppercase">Financial Year</label>
            <select
              value={filters.financialYear}
              onChange={(e) => onFilterChange('financialYear', e.target.value)}
              className="w-full h-7 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="All">All FYs</option>
              {uniqueFys.map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 3. Match Count Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5C1] pt-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#E7EBF5]">{filteredCount}</strong> of {totalCount} total alert records
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-[#adc6ff]">
              ({totalCount - filteredCount} filtered out)
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#667090]">
          Sovereign MPLADS Real-Time Audit Feed
        </span>
      </div>
    </div>
  )
}
