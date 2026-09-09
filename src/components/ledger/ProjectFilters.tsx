import React from 'react'
import { ChevronDown, X, RotateCcw, Filter } from 'lucide-react'
import { FilterState } from '@/types'

export interface ProjectFilterOptions {
  states: string[]
  districts: string[]
  constituencies: string[]
  mps: string[]
  categories: string[]
  vendors: string[]
  agencies: string[]
}

export const initialProjectFilterState: FilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  mp: 'All',
  category: 'All',
  vendor: 'All',
  agency: 'All',
  riskSeverity: 'All',
  amountRange: 'All',
  projectStatus: 'All',
  financialYear: 'All',
  searchQuery: '',
}

interface ProjectFiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onResetFilters: () => void
  options?: Partial<ProjectFilterOptions>
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  options = {},
}) => {
  // Available lists with fallback defaults
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
  ]

  const constituencyOptions = options.constituencies || []

  const mpOptions = options.mps || [
    'Rahul Sharma',
    'Smt. Aparna Sen',
    'Tejaswi M.',
    'Ajay Kumar Rai',
    'Vikramaditya S.',
    'Dr. S. Mukherjee',
    'Hemant Godse',
    'Su. Venkatesan',
    'Shashi Tharoor',
    'Hiren Patel',
    'Gaurav Gogoi',
    'Pinaki Misra',
    'Harpal Singh Cheema',
    'Pragya Singh',
    'Manoj Tiwari',
    'Kesineni Srinivas',
    'Asaduddin Owaisi',
    'Rao Inderjit Singh',
    'Sanjay Seth',
    'Supriya Sule',
  ]

  const categoryOptions = options.categories || [
    'Water & Sanitation',
    'Roads & Transport',
    'Education & Tech',
    'Healthcare',
    'Urban Amenities',
    'Flood Relief',
    'Community Infrastructure',
    'Renewable Energy',
    'Sports & Culture',
    'Irrigation Works',
  ]

  const vendorOptions = options.vendors || [
    'Apex Infra Projects Ltd.',
    'Sai Krupa Construction Co.',
    'Bharat Civil & Electric Works',
    'Omkar Rural Enterprises',
    'Vardhman Tech Infrastructures',
    'National Highway Concessionaires',
    'Pragati Green Energy Solutions',
    'Deccan Builders & Engineers',
    'Surya Solar Grid Systems',
    'Trident Watertech Solutions',
  ]

  const agencyOptions = options.agencies || [
    'Zila Parishad',
    'PWD Division 1',
    'Rural Dev Dept',
    'Municipal Corporation',
    'APMC Division',
    'School Education Department',
    'Irrigation & Waterways Directorate',
  ]

  // Active filter chips calculation
  const activeChips: { key: keyof FilterState; label: string; isRisk?: boolean }[] = []

  if (filters.state && filters.state !== 'All' && !filters.state.startsWith('All States')) {
    activeChips.push({ key: 'state', label: `State: ${filters.state}` })
  }
  if (filters.district && filters.district !== 'All' && !filters.district.startsWith('All')) {
    activeChips.push({ key: 'district', label: `District: ${filters.district}` })
  }
  if (filters.constituency && filters.constituency !== 'All') {
    activeChips.push({ key: 'constituency', label: `Constituency: ${filters.constituency}` })
  }
  if (filters.mp && filters.mp !== 'All' && !filters.mp.startsWith('All Electors')) {
    activeChips.push({ key: 'mp', label: `MP: ${filters.mp}` })
  }
  if (filters.category && filters.category !== 'All' && !filters.category.startsWith('All Categories')) {
    activeChips.push({ key: 'category', label: `Category: ${filters.category}` })
  }
  if (filters.vendor && filters.vendor !== 'All' && !filters.vendor.startsWith('All Listed')) {
    activeChips.push({ key: 'vendor', label: `Vendor: ${filters.vendor}` })
  }
  if (filters.agency && filters.agency !== 'All' && !filters.agency.startsWith('All Agencies')) {
    activeChips.push({ key: 'agency', label: `Agency: ${filters.agency}` })
  }
  if (filters.riskSeverity && filters.riskSeverity !== 'All' && !filters.riskSeverity.startsWith('All Risk')) {
    activeChips.push({
      key: 'riskSeverity',
      label: `Risk: ${filters.riskSeverity}`,
      isRisk: true,
    })
  }
  if (filters.amountRange && filters.amountRange !== 'All' && !filters.amountRange.startsWith('All Ranges')) {
    activeChips.push({ key: 'amountRange', label: `Sanction: ${filters.amountRange}` })
  }
  if (filters.projectStatus && filters.projectStatus !== 'All' && !filters.projectStatus.startsWith('All Statuses')) {
    activeChips.push({ key: 'projectStatus', label: `Status: ${filters.projectStatus}` })
  }
  if (filters.financialYear && filters.financialYear !== 'All') {
    activeChips.push({ key: 'financialYear', label: `FY: ${filters.financialYear}` })
  }

  const handleRemoveChip = (key: keyof FilterState) => {
    onFilterChange(key, initialProjectFilterState[key])
  }

  return (
    <div className="flex flex-col gap-2 py-2.5 px-3 bg-[#10182B] border border-[#232D47] rounded-lg">
      {/* 11 Dropdowns Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
        <div className="flex items-center gap-1 text-[#9AA5C1] font-mono text-[10px] font-semibold uppercase pr-1">
          <Filter className="w-3 h-3 text-[#3B82F6]" />
          <span>Filters:</span>
        </div>

        {/* 1. State */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
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
        {constituencyOptions.length > 0 && (
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
        )}

        {/* 4. MP */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
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

        {/* 5. Work Category */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            aria-label="Filter by category"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Category: All</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 6. Vendor */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={filters.vendor}
            onChange={(e) => onFilterChange('vendor', e.target.value)}
            aria-label="Filter by vendor"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Vendor: All</option>
            {vendorOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 7. Implementing Agency */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={filters.agency}
            onChange={(e) => onFilterChange('agency', e.target.value)}
            aria-label="Filter by implementing agency"
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer hover:border-[#3B82F6]/50"
          >
            <option value="All">Agency: All</option>
            {agencyOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 8. Risk Level */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
          <select
            value={filters.riskSeverity}
            onChange={(e) => onFilterChange('riskSeverity', e.target.value)}
            aria-label="Filter by risk severity"
            className={`w-full border rounded px-2 py-1 font-mono text-[10px] font-bold focus:outline-none appearance-none pr-5 cursor-pointer ${
              filters.riskSeverity === 'Critical'
                ? 'bg-[#401515] border-[#EF4444] text-[#EF4444]'
                : filters.riskSeverity === 'High'
                ? 'bg-[#3A2A0C] border-[#F59E0B] text-[#F59E0B]'
                : filters.riskSeverity === 'Medium'
                ? 'bg-[#362E0C] border-[#EAB308] text-[#EAB308]'
                : filters.riskSeverity === 'Low'
                ? 'bg-[#0F3020] border-[#22C55E] text-[#22C55E]'
                : 'bg-[#0A0E1A] border-[#232D47] text-[#E7EBF5]'
            }`}
          >
            <option value="All" className="bg-[#10182B] text-[#E7EBF5]">Risk: All</option>
            <option value="Critical" className="bg-[#10182B] text-[#EF4444]">Critical (&gt;90)</option>
            <option value="High" className="bg-[#10182B] text-[#F59E0B]">High (70-90)</option>
            <option value="Medium" className="bg-[#10182B] text-[#EAB308]">Medium (40-69)</option>
            <option value="Low" className="bg-[#10182B] text-[#22C55E]">Low (&lt;40)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* 9. Financial Year */}
        <div className="relative min-w-[105px] flex-1 sm:flex-initial">
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

        {/* 10. Project Status */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
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

        {/* 11. Amount Range */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
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
      </div>

      {/* Removable Filter Chips & Reset All Action */}
      <div className="flex items-center gap-1.5 pt-1 flex-wrap font-mono text-[10px] select-none border-t border-[#232D47]/60">
        <span className="text-[#667090] uppercase text-[10px] font-semibold">Active:</span>

        {activeChips.length === 0 ? (
          <span className="text-[#667090] italic text-[10px]">None &bull; Complete register visible</span>
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
