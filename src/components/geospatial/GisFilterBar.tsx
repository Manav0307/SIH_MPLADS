import React, { useMemo } from 'react'
import { Search, RotateCcw, Filter, MapPin, Layers } from 'lucide-react'
import { StateAnomalyRecord, ProjectRecord } from '@/types'

export interface GisFilterState {
  searchQuery: string
  state: string
  district: string
  constituency: string
  riskSeverity: string
  category: string
  viewMode: 'state' | 'constituency'
}

export const initialGisFilterState: GisFilterState = {
  searchQuery: '',
  state: 'All',
  district: 'All',
  constituency: 'All',
  riskSeverity: 'All',
  category: 'All',
  viewMode: 'state',
}

interface GisFilterBarProps {
  filters: GisFilterState
  states: StateAnomalyRecord[]
  projects: ProjectRecord[]
  onFilterChange: (key: keyof GisFilterState, value: string) => void
  onResetFilters: () => void
}

export const GisFilterBar: React.FC<GisFilterBarProps> = ({
  filters,
  states,
  projects,
  onFilterChange,
  onResetFilters,
}) => {
  // Dynamically derive available districts based on selected state
  const availableDistricts = useMemo(() => {
    let filtered = projects
    if (filters.state && filters.state !== 'All') {
      filtered = filtered.filter(
        (p) => p.state.toLowerCase() === filters.state.toLowerCase()
      )
    }
    const set = new Set<string>()
    filtered.forEach((p) => {
      if (p.district) set.add(p.district)
    })
    return Array.from(set).sort()
  }, [projects, filters.state])

  // Dynamically derive available constituencies based on selected state & district
  const availableConstituencies = useMemo(() => {
    let filtered = projects
    if (filters.state && filters.state !== 'All') {
      filtered = filtered.filter(
        (p) => p.state.toLowerCase() === filters.state.toLowerCase()
      )
    }
    if (filters.district && filters.district !== 'All') {
      filtered = filtered.filter(
        (p) => p.district.toLowerCase() === filters.district.toLowerCase()
      )
    }
    const set = new Set<string>()
    filtered.forEach((p) => {
      if (p.constituency) set.add(p.constituency)
    })
    return Array.from(set).sort()
  }, [projects, filters.state, filters.district])

  // Dynamically derive categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set).sort()
  }, [projects])

  // Count active non-default filters
  const activeCount = useMemo(() => {
    let count = 0
    if (filters.searchQuery.trim()) count++
    if (filters.state !== 'All') count++
    if (filters.district !== 'All') count++
    if (filters.constituency !== 'All') count++
    if (filters.riskSeverity !== 'All') count++
    if (filters.category !== 'All') count++
    return count
  }, [filters])

  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-2.5 shadow-md flex flex-col gap-2 select-none">
      {/* Top row: Search input + View Mode switch + Reset button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#667090]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search state, district, constituency, work code, project..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0A0E1A] border border-[#232D47] rounded text-xs text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] font-mono transition-colors"
          />
        </div>

        {/* View Mode Toggle (State vs Constituency Centroid Clusters) */}
        <div className="flex items-center gap-1 bg-[#0A0E1A] p-0.5 rounded border border-[#232D47] font-mono text-[11px]">
          <button
            type="button"
            onClick={() => onFilterChange('viewMode', 'state')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.viewMode === 'state'
                ? 'bg-[#3B82F6] text-white font-bold shadow-xs'
                : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>State Centroids</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('viewMode', 'constituency')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.viewMode === 'constituency'
                ? 'bg-[#3B82F6] text-white font-bold shadow-xs'
                : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Constituency Clusters</span>
          </button>
        </div>

        {/* Reset Filters button */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] text-[#EF4444] font-mono text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 border-t border-[#232D47]/60">
        {/* State Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase text-[#9AA5C1] flex items-center gap-1">
            <Filter className="w-2.5 h-2.5 text-[#3B82F6]" />
            <span>State</span>
          </label>
          <select
            value={filters.state}
            onChange={(e) => {
              onFilterChange('state', e.target.value)
              onFilterChange('district', 'All')
              onFilterChange('constituency', 'All')
            }}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">All States ({states.length})</option>
            {states.map((st) => (
              <option key={st.code} value={st.name}>
                {st.name} ({st.anomalyRate.toFixed(1)}%)
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase text-[#9AA5C1]">District</label>
          <select
            value={filters.district}
            onChange={(e) => {
              onFilterChange('district', e.target.value)
              onFilterChange('constituency', 'All')
            }}
            disabled={availableDistricts.length === 0}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer disabled:opacity-40"
          >
            <option value="All">All Districts ({availableDistricts.length})</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Constituency Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase text-[#9AA5C1]">Constituency</label>
          <select
            value={filters.constituency}
            onChange={(e) => onFilterChange('constituency', e.target.value)}
            disabled={availableConstituencies.length === 0}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer disabled:opacity-40"
          >
            <option value="All">All ({availableConstituencies.length})</option>
            {availableConstituencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Severity Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase text-[#9AA5C1]">Risk Level</label>
          <select
            value={filters.riskSeverity}
            onChange={(e) => onFilterChange('riskSeverity', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="critical">Critical (&gt;90 / &gt;15%)</option>
            <option value="high">High (75-90 / 10-15%)</option>
            <option value="medium">Medium (50-75 / 5-10%)</option>
            <option value="low">Low (&lt;50 / &lt;5%)</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase text-[#9AA5C1]">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
