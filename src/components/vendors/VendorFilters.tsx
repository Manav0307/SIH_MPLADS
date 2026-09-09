import React from 'react'
import { ChevronDown, X, RotateCcw, Filter } from 'lucide-react'
import { VendorFilterState } from '@/types'

export const initialVendorFilterState: VendorFilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  financialYear: 'All',
  riskLevel: 'All',
  category: 'All',
  agency: 'All',
  projectStatus: 'All',
  activityLevel: 'All',
  searchQuery: '',
}

interface VendorFiltersProps {
  filters: VendorFilterState
  onFilterChange: (key: keyof VendorFilterState, value: string) => void
  onResetFilters: () => void
  options?: {
    states?: string[]
    districts?: string[]
    constituencies?: string[]
    categories?: string[]
    agencies?: string[]
    financialYears?: string[]
  }
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({
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
    'Haryana',
    'Jharkhand',
  ]

  const districtOptions = options.districts || [
    'Ahmednagar',
    'Lucknow',
    'Bangalore Urban',
    'Muzaffarpur',
    'Jodhpur',
    'Malda',
    'Nashik',
    'Madurai',
    'Ernakulam',
    'Ahmedabad',
    'Kamrup',
    'Cuttack',
    'Amritsar',
    'Bhopal',
    'New Delhi',
    'Guntur',
    'Hyderabad',
    'Gurgaon',
    'Ranchi',
    'Pune',
    'Solapur',
  ]

  const constituencyOptions = options.constituencies || []

  const categoryOptions = options.categories || [
    'Water & Sanitation',
    'Rural Roads & Pavements',
    'Public Health Infrastructure',
    'Education & Skill Centers',
    'Irrigation & Flood Defense',
    'Renewable Energy',
    'Community Infrastructure',
  ]

  const agencyOptions = options.agencies || [
    'Zila Parishad',
    'PWD Division',
    'Municipal Corporation',
    'Rural Dev Dept',
    'Irrigation Directorate',
    'Water Supply Board',
  ]

  const fyOptions = options.financialYears || ['FY 2023-24', 'FY 2024-25', 'FY 2025-26']

  // Active filter chips calculation
  const activeChips: { key: keyof VendorFilterState; label: string; isRisk?: boolean }[] = []

  if (filters.state && filters.state !== 'All') {
    activeChips.push({ key: 'state', label: `State: ${filters.state}` })
  }
  if (filters.district && filters.district !== 'All') {
    activeChips.push({ key: 'district', label: `District: ${filters.district}` })
  }
  if (filters.constituency && filters.constituency !== 'All') {
    activeChips.push({ key: 'constituency', label: `Constituency: ${filters.constituency}` })
  }
  if (filters.financialYear && filters.financialYear !== 'All') {
    activeChips.push({ key: 'financialYear', label: `FY: ${filters.financialYear}` })
  }
  if (filters.riskLevel && filters.riskLevel !== 'All') {
    activeChips.push({ key: 'riskLevel', label: `Risk: ${filters.riskLevel}`, isRisk: true })
  }
  if (filters.category && filters.category !== 'All') {
    activeChips.push({ key: 'category', label: `Category: ${filters.category}` })
  }
  if (filters.agency && filters.agency !== 'All') {
    activeChips.push({ key: 'agency', label: `Agency: ${filters.agency}` })
  }
  if (filters.projectStatus && filters.projectStatus !== 'All') {
    activeChips.push({ key: 'projectStatus', label: `Status: ${filters.projectStatus}` })
  }
  if (filters.activityLevel && filters.activityLevel !== 'All') {
    activeChips.push({ key: 'activityLevel', label: `Activity: ${filters.activityLevel}` })
  }

  const handleRemoveChip = (key: keyof VendorFilterState) => {
    onFilterChange(key, initialVendorFilterState[key])
  }

  return (
    <div className="flex flex-col gap-2 py-2.5 px-3 bg-[#10182B] border border-[#232D47] rounded-lg shadow-sm">
      {/* 9 Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
        <div className="flex items-center gap-1 text-[#9AA5C1] font-mono text-[10px] font-semibold uppercase pr-1">
          <Filter className="w-3 h-3 text-[#3B82F6]" />
          <span>Filters:</span>
        </div>

        {/* 1. State */}
        <div className="relative min-w-[115px] flex-1 sm:flex-initial">
          <select
            value={filters.state}
            onChange={(e) => onFilterChange('state', e.target.value)}
            aria-label="Filter by state"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">State: All</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 2. District */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            aria-label="Filter by district"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">District: All</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 3. Constituency */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={filters.constituency}
            onChange={(e) => onFilterChange('constituency', e.target.value)}
            aria-label="Filter by constituency"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Constituency: All</option>
            {constituencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 4. Financial Year */}
        <div className="relative min-w-[95px] flex-1 sm:flex-initial">
          <select
            value={filters.financialYear}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            aria-label="Filter by financial year"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">FY: All</option>
            {fyOptions.map((fy) => (
              <option key={fy} value={fy}>
                {fy}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 5. Risk Level */}
        <div className="relative min-w-[95px] flex-1 sm:flex-initial">
          <select
            value={filters.riskLevel}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            aria-label="Filter by risk severity"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Risk: All</option>
            <option value="critical">Critical (&ge;85)</option>
            <option value="high">High (70-84)</option>
            <option value="medium">Medium (40-69)</option>
            <option value="low">Low (&lt;40)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 6. Work Category */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            aria-label="Filter by work category"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Category: All</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 7. Implementing Agency */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={filters.agency}
            onChange={(e) => onFilterChange('agency', e.target.value)}
            aria-label="Filter by implementing agency"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Agency: All</option>
            {agencyOptions.map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 8. Project Status */}
        <div className="relative min-w-[105px] flex-1 sm:flex-initial">
          <select
            value={filters.projectStatus}
            onChange={(e) => onFilterChange('projectStatus', e.target.value)}
            aria-label="Filter by project status"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Status: All</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Stalled">Stalled</option>
            <option value="Sanctioned">Sanctioned</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 9. Vendor Activity Level */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={filters.activityLevel}
            onChange={(e) => onFilterChange('activityLevel', e.target.value)}
            aria-label="Filter by vendor activity level"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Activity: All</option>
            <option value="high">High Activity (&gt;6 works)</option>
            <option value="medium">Moderate (4-6 works)</option>
            <option value="low">Limited (&le;3 works)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          disabled={activeChips.length === 0}
          title="Reset All Filters"
          className="px-2 py-1 bg-[#161F36] hover:bg-[#232D47] disabled:opacity-40 disabled:pointer-events-none border border-[#232D47] rounded text-[#9AA5C1] hover:text-[#E7EBF5] font-mono text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Filter Removable Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#232D47]/60">
          <span className="text-[10px] font-mono text-[#667090]">Active ({activeChips.length}):</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                chip.isRisk
                  ? 'bg-[#401515] border-[#EF4444]/40 text-[#EF4444]'
                  : 'bg-[#161F36] border-[#232D47] text-[#9AA5C1]'
              }`}
            >
              <span>{chip.label}</span>
              <button
                onClick={() => handleRemoveChip(chip.key)}
                className="hover:text-[#E7EBF5] transition-colors cursor-pointer"
                title={`Remove ${chip.label}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
          <button
            onClick={onResetFilters}
            className="text-[10px] font-mono text-[#3B82F6] hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
