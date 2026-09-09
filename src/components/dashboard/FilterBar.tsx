import React from 'react'
import { ChevronDown, X, RotateCcw } from 'lucide-react'
import { FilterState } from '@/types'

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onResetFilters: () => void
}

export const initialFilterState: FilterState = {
  state: 'All States (25)',
  district: 'All (36)',
  constituency: 'All',
  mp: 'All Electors',
  category: 'All Categories',
  vendor: 'All Listed',
  agency: 'All Agencies',
  riskSeverity: 'All Risk Profiles',
  amountRange: 'All Ranges',
  projectStatus: 'All Statuses',
  financialYear: 'FY 2025-26',
  searchQuery: '',
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  // Determine which filters are currently active (divergent from default)
  const activeChips: { key: keyof FilterState; label: string; isRisk?: boolean }[] = []

  if (filters.state && filters.state !== 'All States (25)' && filters.state !== 'All') {
    activeChips.push({ key: 'state', label: `State: ${filters.state}` })
  }
  if (filters.district && filters.district !== 'All (36)' && filters.district !== 'All') {
    activeChips.push({ key: 'district', label: `District: ${filters.district}` })
  }
  if (filters.constituency && filters.constituency !== 'All') {
    activeChips.push({ key: 'constituency', label: `Constituency: ${filters.constituency}` })
  }
  if (filters.mp && filters.mp !== 'All Electors' && filters.mp !== 'All') {
    activeChips.push({ key: 'mp', label: `MP: ${filters.mp}` })
  }
  if (filters.category && filters.category !== 'All Categories' && filters.category !== 'All') {
    activeChips.push({ key: 'category', label: `Category: ${filters.category}` })
  }
  if (filters.vendor && filters.vendor !== 'All Listed' && filters.vendor !== 'All') {
    activeChips.push({ key: 'vendor', label: `Vendor: ${filters.vendor}` })
  }
  if (filters.agency && filters.agency !== 'All Agencies' && filters.agency !== 'All') {
    activeChips.push({ key: 'agency', label: `Agency: ${filters.agency}` })
  }
  if (filters.riskSeverity && filters.riskSeverity !== 'All Risk Profiles' && filters.riskSeverity !== 'All') {
    activeChips.push({
      key: 'riskSeverity',
      label: `Risk: ${filters.riskSeverity}`,
      isRisk: true,
    })
  }
  if (filters.amountRange && filters.amountRange !== 'All Ranges' && filters.amountRange !== 'All') {
    activeChips.push({ key: 'amountRange', label: `Range: ${filters.amountRange}` })
  }
  if (filters.projectStatus && filters.projectStatus !== 'All Statuses' && filters.projectStatus !== 'All') {
    activeChips.push({ key: 'projectStatus', label: `Status: ${filters.projectStatus}` })
  }
  if (filters.financialYear && filters.financialYear !== 'FY 2025-26') {
    activeChips.push({ key: 'financialYear', label: `FY: ${filters.financialYear}` })
  }

  const handleRemoveChip = (key: keyof FilterState) => {
    onFilterChange(key, initialFilterState[key])
  }

  return (
    <div className="flex flex-col gap-2 py-2 border-b border-[#232D47] bg-[#0A0E1A]">
      {/* 11 Dropdowns Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
        {/* State */}
        <div className="relative min-w-[125px]">
          <select
            value={filters.state}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All States (25)">State: All (25)</option>
            <option value="Maharashtra">State: Maharashtra</option>
            <option value="Uttar Pradesh">State: Uttar Pradesh</option>
            <option value="Karnataka">State: Karnataka</option>
            <option value="Bihar">State: Bihar</option>
            <option value="Rajasthan">State: Rajasthan</option>
            <option value="West Bengal">State: West Bengal</option>
            <option value="Tamil Nadu">State: Tamil Nadu</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* District */}
        <div className="relative min-w-[115px]">
          <select
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All (36)">District: All (36)</option>
            <option value="Ahmednagar">Ahmednagar</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Bangalore Urban">Bangalore Urban</option>
            <option value="Muzaffarpur">Muzaffarpur</option>
            <option value="Jodhpur">Jodhpur</option>
            <option value="Malda">Malda</option>
            <option value="Nashik">Nashik</option>
            <option value="Madurai">Madurai</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Constituency */}
        <div className="relative min-w-[125px]">
          <select
            value={filters.constituency}
            onChange={(e) => onFilterChange('constituency', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All">Constituency: All</option>
            <option value="Ahmednagar (MH-14)">Ahmednagar (MH-14)</option>
            <option value="Lucknow East (UP-32)">Lucknow East (UP-32)</option>
            <option value="Bangalore South (KA-08)">Bangalore South (KA-08)</option>
            <option value="Muzaffarpur (BR-12)">Muzaffarpur (BR-12)</option>
            <option value="Jodhpur (RJ-03)">Jodhpur (RJ-03)</option>
            <option value="Malda South (WB-19)">Malda South (WB-19)</option>
            <option value="Nashik (MH-20)">Nashik (MH-20)</option>
            <option value="Madurai (TN-12)">Madurai (TN-12)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* MP */}
        <div className="relative min-w-[115px]">
          <select
            value={filters.mp}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Electors">MP: All Electors</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Smt. Aparna Sen">Smt. Aparna Sen</option>
            <option value="Tejaswi M.">Tejaswi M.</option>
            <option value="Ajay Kumar Rai">Ajay Kumar Rai</option>
            <option value="Vikramaditya S.">Vikramaditya S.</option>
            <option value="Dr. S. Mukherjee">Dr. S. Mukherjee</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Category */}
        <div className="relative min-w-[130px]">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Categories">Category: All Categories</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Roads & Transport">Roads & Transport</option>
            <option value="Education & Tech">Education & Tech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Urban Amenities">Urban Amenities</option>
            <option value="Flood Relief">Flood Relief</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Vendor */}
        <div className="relative min-w-[115px]">
          <select
            value={filters.vendor}
            onChange={(e) => onFilterChange('vendor', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Listed">Vendor: All Listed</option>
            <option value="Apex Infra Projects Ltd.">Apex Infra Ltd</option>
            <option value="Sai Krupa Construction Co.">Sai Krupa Const.</option>
            <option value="Bharat Civil & Electric Works">Bharat Civil Works</option>
            <option value="Omkar Rural Enterprises">Omkar Rural Enterprises</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Implementing Agency */}
        <div className="relative min-w-[120px]">
          <select
            value={filters.agency}
            onChange={(e) => onFilterChange('agency', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Agencies">Agency: All Agencies</option>
            <option value="Zila Parishad">Zila Parishad</option>
            <option value="PWD Division">PWD Division</option>
            <option value="Municipal Corporation">Municipal Corp</option>
            <option value="Rural Dev Dept">Rural Dev Dept</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Risk Severity */}
        <div className="relative min-w-[125px]">
          <select
            value={filters.riskSeverity}
            onChange={(e) => onFilterChange('riskSeverity', e.target.value)}
            className="w-full bg-[#401515]/40 border border-[#EF4444]/40 text-[#EF4444] rounded px-2 py-1 font-mono text-[10px] font-bold focus:outline-none appearance-none pr-5 cursor-pointer"
          >
            <option value="All Risk Profiles" className="bg-[#10182B] text-[#E7EBF5]">All Risk Profiles</option>
            <option value="Critical & High" className="bg-[#10182B] text-[#EF4444]">Risk: Critical & High</option>
            <option value="Critical Only (>90)" className="bg-[#10182B] text-[#EF4444]">Critical Only (&gt;90)</option>
            <option value="High Only (75-90)" className="bg-[#10182B] text-[#F59E0B]">High Only (75-90)</option>
            <option value="Medium/Low" className="bg-[#10182B] text-[#22C55E]">Medium &amp; Low (&lt;75)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#EF4444] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Amount Range */}
        <div className="relative min-w-[120px]">
          <select
            value={filters.amountRange}
            onChange={(e) => onFilterChange('amountRange', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Ranges">Range: All</option>
            <option value="< ₹25L">&lt; ₹25 Lakhs</option>
            <option value="₹25L - ₹50L">₹25L - ₹50L</option>
            <option value="₹50L - ₹1Cr">₹50L - ₹1 Cr</option>
            <option value="₹1Cr - ₹5Cr">₹1 Cr - ₹5 Cr</option>
            <option value="> ₹5Cr">&gt; ₹5 Cr</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Project Status */}
        <div className="relative min-w-[115px]">
          <select
            value={filters.projectStatus}
            onChange={(e) => onFilterChange('projectStatus', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="All Statuses">Status: All</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Sanctioned">Sanctioned</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* FY Filter */}
        <div className="relative min-w-[105px]">
          <select
            value={filters.financialYear}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#232D47] rounded px-2 py-1 text-[#E7EBF5] font-mono text-[10px] focus:outline-none focus:border-[#3B82F6] appearance-none pr-5 cursor-pointer"
          >
            <option value="FY 2025-26">FY 25-26</option>
            <option value="FY 2024-25">FY 24-25</option>
            <option value="FY 2023-24">FY 23-24</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#667090] absolute right-1.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Removable Active Filter Chips & Reset All */}
      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap font-mono text-[10px] select-none">
        <span className="text-[#667090] uppercase text-[10px] font-semibold">Active Filters:</span>

        {activeChips.length === 0 ? (
          <span className="text-[#667090] italic text-[10px]">None (National Dataset Active)</span>
        ) : (
          activeChips.map((chip) => (
            <span
              key={chip.key}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                chip.isRisk
                  ? 'bg-[#401515]/60 border-[#EF4444]/40 text-[#EF4444]'
                  : 'bg-[#161F36] border-[#232D47] text-[#E7EBF5]'
              }`}
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip.key)}
                className="hover:text-[#EF4444] ml-0.5 font-bold cursor-pointer"
                title={`Remove ${chip.label}`}
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
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset All ({activeChips.length} Active)</span>
          </button>
        )}
      </div>
    </div>
  )
}
