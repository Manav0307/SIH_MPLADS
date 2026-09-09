import React from 'react'
import { ChevronDown, X, RotateCcw, Filter } from 'lucide-react'
import { MpFilterState } from '@/types'

export const initialMpFilterState: MpFilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  mp: 'All',
  financialYear: 'All',
  riskLevel: 'All',
  amountRange: 'All',
  projectStatus: 'All',
  searchQuery: '',
}

interface MpFiltersProps {
  filters: MpFilterState
  onFilterChange: (key: keyof MpFilterState, value: string) => void
  onResetFilters: () => void
  options?: {
    states?: string[]
    districts?: string[]
    constituencies?: string[]
    mps?: string[]
  }
}

export const MpFilters: React.FC<MpFiltersProps> = ({
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
  const mpOptions = options.mps || []

  // Active filter chips calculation
  const activeChips: { key: keyof MpFilterState; label: string; isRisk?: boolean }[] = []

  if (filters.state && filters.state !== 'All') {
    activeChips.push({ key: 'state', label: `State: ${filters.state}` })
  }
  if (filters.district && filters.district !== 'All') {
    activeChips.push({ key: 'district', label: `District: ${filters.district}` })
  }
  if (filters.constituency && filters.constituency !== 'All') {
    activeChips.push({ key: 'constituency', label: `Constituency: ${filters.constituency}` })
  }
  if (filters.mp && filters.mp !== 'All') {
    activeChips.push({ key: 'mp', label: `MP: ${filters.mp}` })
  }
  if (filters.financialYear && filters.financialYear !== 'All') {
    activeChips.push({ key: 'financialYear', label: `FY: ${filters.financialYear}` })
  }
  if (filters.riskLevel && filters.riskLevel !== 'All') {
    activeChips.push({ key: 'riskLevel', label: `Risk: ${filters.riskLevel}`, isRisk: true })
  }
  if (filters.amountRange && filters.amountRange !== 'All') {
    activeChips.push({ key: 'amountRange', label: `Sanction: ${filters.amountRange}` })
  }
  if (filters.projectStatus && filters.projectStatus !== 'All') {
    activeChips.push({ key: 'projectStatus', label: `Status: ${filters.projectStatus}` })
  }

  const handleRemoveChip = (key: keyof MpFilterState) => {
    onFilterChange(key, initialMpFilterState[key])
  }

  return (
    <div className="flex flex-col gap-2 py-2.5 px-3 bg-[#10182B] border border-[#232D47] rounded-lg shadow-sm">
      {/* 8 Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
        <div className="flex items-center gap-1 text-[#9AA5C1] font-mono text-[10px] font-semibold uppercase pr-1">
          <Filter className="w-3 h-3 text-[#3B82F6]" />
          <span>Filters:</span>
        </div>

        {/* 1. State */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
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
        <div className="relative min-w-[115px] flex-1 sm:flex-initial">
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
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
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

        {/* 4. MP */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={filters.mp}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            aria-label="Filter by MP"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">MP: All</option>
            {mpOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 5. Financial Year */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={filters.financialYear}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            aria-label="Filter by financial year"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">FY: All</option>
            <option value="FY 2025-26">FY 2025-26</option>
            <option value="FY 2024-25">FY 2024-25</option>
            <option value="FY 2023-24">FY 2023-24</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 6. Risk Level */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={filters.riskLevel}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            aria-label="Filter by risk level"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Risk: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 7. Amount Range */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={filters.amountRange}
            onChange={(e) => onFilterChange('amountRange', e.target.value)}
            aria-label="Filter by sanctioned amount range"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Sanction: All</option>
            <option value="< ₹10L">&lt; ₹10 Lakhs</option>
            <option value="₹10L–₹25L">₹10L – ₹25 Lakhs</option>
            <option value="₹25L–₹50L">₹25L – ₹50 Lakhs</option>
            <option value="₹50L–₹1Cr">₹50L – ₹1 Crore</option>
            <option value="₹1Cr–₹5Cr">₹1Cr – ₹5 Crores</option>
            <option value="> ₹5Cr">&gt; ₹5 Crores</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 8. Project Status */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
          <select
            value={filters.projectStatus}
            onChange={(e) => onFilterChange('projectStatus', e.target.value)}
            aria-label="Filter by project status"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Status: All</option>
            <option value="Recommended">Recommended</option>
            <option value="Sanctioned">Sanctioned</option>
            <option value="Disbursed">Disbursed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Stalled">Stalled</option>
            <option value="Under Review">Under Review</option>
            <option value="Under Investigation">Under Investigation</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Removable Active Chips & Reset All */}
      <div className="flex items-center gap-1.5 pt-1 flex-wrap font-mono text-[10px] select-none border-t border-[#232D47]/60">
        <span className="text-[#667090] uppercase text-[10px] font-semibold">Active:</span>

        {activeChips.length === 0 ? (
          <span className="text-[#667090] italic text-[10px]">None &bull; Complete MP directory active</span>
        ) : (
          activeChips.map((chip) => (
            <span
              key={chip.key}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                chip.isRisk
                  ? 'bg-[#401515] border-[#EF4444]/60 text-[#EF4444]'
                  : 'bg-[#161F36] border-[#232D47] text-[#E7EBF5]'
              }`}
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip.key)}
                className="hover:text-[#EF4444] ml-0.5 font-bold cursor-pointer transition-colors"
                title={`Remove filter: ${chip.label}`}
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))
        )}

        {activeChips.length > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[#3B82F6] hover:underline ml-2 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1 cursor-pointer"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset All ({activeChips.length})</span>
          </button>
        )}
      </div>
    </div>
  )
}
