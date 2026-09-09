import React from 'react'
import { ChevronDown, X, RotateCcw, Filter } from 'lucide-react'
import { AgencyFilterState } from '@/types'

export const initialAgencyFilterState: AgencyFilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  mp: 'All',
  agencyType: 'All',
  agency: 'All',
  category: 'All',
  riskLevel: 'All',
  financialYear: 'All',
  projectStatus: 'All',
  amountRange: 'All',
  searchQuery: '',
}

interface AgencyFiltersProps {
  filters: AgencyFilterState
  onFilterChange: (key: keyof AgencyFilterState, value: string) => void
  onResetFilters: () => void
  options?: {
    states?: string[]
    districts?: string[]
    constituencies?: string[]
    mps?: string[]
    agencyTypes?: string[]
    agencies?: string[]
    categories?: string[]
    financialYears?: string[]
    projectStatuses?: string[]
    amountRanges?: string[]
  }
}

export const AgencyFilters: React.FC<AgencyFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  options = {},
}) => {
  const stateOptions = options.states || [
    'Maharashtra',
    'Uttar Pradesh',
    'Karnataka',
    'Bihar',
    'Rajasthan',
    'West Bengal',
    'Tamil Nadu',
    'Kerala',
    'Gujarat',
    'Assam',
    'Odisha',
    'Punjab',
    'Madhya Pradesh',
    'Delhi',
    'Andhra Pradesh',
    'Telangana',
  ]

  const districtOptions = options.districts || []
  const constituencyOptions = options.constituencies || []
  const mpOptions = options.mps || []

  const agencyTypeOptions = options.agencyTypes || [
    'Panchayati Raj / Zila Parishad',
    'Public Works Department (PWD)',
    'Rural Development Agency',
    'Urban Local Body / Municipal Corp',
    'Agricultural Marketing (APMC)',
    'School Education Department',
    'Water Resources & Irrigation',
    'State Development Board / Corporation',
  ]

  const agencyOptions = options.agencies || []

  const categoryOptions = options.categories || [
    'Water & Sanitation',
    'Roads & Pathways',
    'Public Health',
    'Education & Tech',
    'Irrigation & Flood Defense',
    'Community Infrastructure',
    'Flood Relief',
  ]

  const riskOptions = ['Critical', 'High', 'Medium', 'Low']

  const fyOptions = options.financialYears || ['FY 2025-26', 'FY 2024-25', 'FY 2023-24']

  const statusOptions = options.projectStatuses || [
    'Recommended',
    'Sanctioned',
    'In Progress',
    'Completed',
    'Stalled',
    'Under Investigation',
    'Under Review',
  ]

  const amountRangeOptions = options.amountRanges || [
    '< ₹ 25 L',
    '₹ 25 L - ₹ 50 L',
    '₹ 50 L - ₹ 1 Cr',
    '₹ 1 Cr - ₹ 5 Cr',
    '> ₹ 5 Cr',
  ]

  // Count active filters (ignoring searchQuery)
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => key !== 'searchQuery' && value !== 'All' && value !== ''
  )

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="space-y-2 bg-[#0D1424] border border-[#232D47] rounded-lg p-2.5 select-none">
      {/* 1. Main Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {/* State Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">State</label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All States</option>
              {stateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* District Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">District</label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => onFilterChange('district', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Districts</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Constituency Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Constituency</label>
          <div className="relative">
            <select
              value={filters.constituency}
              onChange={(e) => onFilterChange('constituency', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Constituencies</option>
              {constituencyOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* MP Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">MP</label>
          <div className="relative">
            <select
              value={filters.mp}
              onChange={(e) => onFilterChange('mp', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All MPs</option>
              {mpOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Agency Type Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Agency Type</label>
          <div className="relative">
            <select
              value={filters.agencyType}
              onChange={(e) => onFilterChange('agencyType', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Agency Types</option>
              {agencyTypeOptions.map((at) => (
                <option key={at} value={at}>
                  {at}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Agency Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Agency</label>
          <div className="relative">
            <select
              value={filters.agency}
              onChange={(e) => onFilterChange('agency', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Agencies</option>
              {agencyOptions.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Secondary Row of Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 border-t border-[#232D47]/60">
        {/* Work Category Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Work Category</label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Risk Level Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Risk Level</label>
          <div className="relative">
            <select
              value={filters.riskLevel}
              onChange={(e) => onFilterChange('riskLevel', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Risk Levels</option>
              {riskOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Financial Year Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Financial Year</label>
          <div className="relative">
            <select
              value={filters.financialYear}
              onChange={(e) => onFilterChange('financialYear', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All FYs</option>
              {fyOptions.map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Project Status Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Project Status</label>
          <div className="relative">
            <select
              value={filters.projectStatus}
              onChange={(e) => onFilterChange('projectStatus', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Amount Range Filter */}
        <div className="relative">
          <label className="block text-[10px] font-mono text-[#9AA5C1] uppercase mb-0.5">Amount Range</label>
          <div className="relative">
            <select
              value={filters.amountRange}
              onChange={(e) => onFilterChange('amountRange', e.target.value)}
              className="w-full bg-[#10182B] border border-[#232D47] rounded px-2 py-1 text-xs text-[#E7EBF5] appearance-none pr-6 focus:border-[#3B82F6] focus:outline-none cursor-pointer truncate font-mono"
            >
              <option value="All">All Amounts</option>
              {amountRangeOptions.map((ar) => (
                <option key={ar} value={ar}>
                  {ar}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#9AA5C1] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Filter Chips and Reset All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#232D47]">
          <span className="text-[10px] font-mono text-[#9AA5C1] uppercase flex items-center gap-1 mr-1">
            <Filter className="w-2.5 h-2.5 text-[#3B82F6]" />
            Active:
          </span>

          {activeFilters.map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161F36] border border-[#232D47] rounded font-mono text-[10px] text-[#E7EBF5]"
            >
              <span className="text-[#9AA5C1] capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="font-semibold text-[#3B82F6]">{val}</span>
              <button
                type="button"
                onClick={() => onFilterChange(key as keyof AgencyFilterState, 'All')}
                className="hover:text-[#EF4444] transition-colors ml-0.5 cursor-pointer"
                title={`Remove ${key} filter`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onResetFilters}
            className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-[#EF4444] hover:bg-[#EF4444]/10 rounded border border-[#EF4444]/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  )
}
