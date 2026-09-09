import React from 'react'
import { Filter, RotateCcw, X, ChevronDown } from 'lucide-react'
import { InvestigationFilterState } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface InvestigationFiltersProps {
  filters: InvestigationFilterState
  onFilterChange: (key: keyof InvestigationFilterState, value: string) => void
  onResetFilters: () => void
  totalRecordsCount: number
  filteredRecordsCount: number
}

export const initialInvestigationFilterState: InvestigationFilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  mp: 'All',
  riskLevel: 'All',
  category: 'All',
  vendor: 'All',
  agency: 'All',
  anomalyType: 'All',
  financialYear: 'All',
  projectStatus: 'All',
  searchQuery: '',
}

const filterOptions = {
  states: ['All', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Bihar', 'Rajasthan', 'West Bengal', 'Tamil Nadu'],
  districts: ['All', 'Ahmednagar', 'Lucknow', 'Bangalore Urban', 'Muzaffarpur', 'Jodhpur', 'Malda', 'Nashik', 'Madurai'],
  constituencies: [
    'All',
    'Ahmednagar (MH-14)',
    'Lucknow East (UP-32)',
    'Bangalore South (KA-08)',
    'Muzaffarpur (BR-12)',
    'Jodhpur (RJ-03)',
    'Malda South (WB-19)',
    'Nashik (MH-20)',
    'Madurai (TN-12)',
  ],
  mps: [
    'All',
    'Rahul Sharma',
    'Smt. Aparna Sen',
    'Tejaswi M.',
    'Ajay Kumar Rai',
    'Vikramaditya S.',
    'Dr. S. Mukherjee',
    'Hemant Godse',
    'Su. Venkatesan',
  ],
  riskLevels: ['All', 'Critical', 'High', 'Medium', 'Low'],
  categories: [
    'All',
    'Water & Sanitation',
    'Roads & Transport',
    'Education & Tech',
    'Healthcare',
    'Urban Amenities',
    'Flood Relief',
  ],
  vendors: [
    'All',
    'Apex Infra Projects Ltd.',
    'Sai Krupa Construction Co.',
    'Bharat Civil & Electric Works',
    'Omkar Rural Enterprises',
  ],
  agencies: [
    'All',
    'Zila Parishad Ahmednagar',
    'PWD Division 1 Lucknow',
    'Zila Parishad Bangalore',
    'Rural Dev Dept Bihar',
    'Municipal Corporation Jodhpur',
    'Irrigation & Waterways Directorate',
    'APMC Nashik Division',
    'School Education Department TN',
  ],
  anomalyTypes: [
    'All',
    'Cost Inflation',
    'Payment Pattern',
    'Duplicate Works',
    'Vendor Concentration',
    'Completion Delay',
    'Procedural Violation',
    'Spatial Similarity',
  ],
  financialYears: ['All', 'FY 2025–26', 'FY 2024–25', 'FY 2023–24'],
  projectStatuses: ['All', 'Under Investigation', 'In Progress', 'Sanctioned', 'Completed'],
}

export const InvestigationFilters: React.FC<InvestigationFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalRecordsCount,
  filteredRecordsCount,
}) => {
  // Compute active chips (any filter not 'All' and not empty)
  const activeChips: { key: keyof InvestigationFilterState; label: string; value: string }[] = []

  const checkKeys: (keyof InvestigationFilterState)[] = [
    'state',
    'district',
    'constituency',
    'mp',
    'riskLevel',
    'category',
    'vendor',
    'agency',
    'anomalyType',
    'financialYear',
    'projectStatus',
  ]

  checkKeys.forEach((key) => {
    const val = filters[key]
    if (val && val !== 'All') {
      activeChips.push({
        key,
        label: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
        value: val,
      })
    }
  })

  return (
    <Card className="h-full">
      <CardHeader
        telemetry={`${filteredRecordsCount}/${totalRecordsCount} SCOPED`}
        action={
          activeChips.length > 0 ? (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 font-mono text-[10px] text-[#EF4444] hover:text-[#ff7070] px-2 py-0.5 rounded bg-[#401515]/40 border border-[#EF4444]/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          ) : undefined
        }
      >
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#3B82F6]" />
          <CardTitle>Investigation Filters</CardTitle>
          {activeChips.length > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 font-bold">
              {activeChips.length}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-3 overflow-y-auto max-h-[calc(100vh-210px)]">
        {/* Active Removable Chips */}
        {activeChips.length > 0 && (
          <div className="p-2 rounded bg-[#0A0E1A] border border-[#232D47] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#9AA5C1] font-bold">
                Active Filter Chips
              </span>
              <span className="text-[10px] font-mono text-[#667090]">{activeChips.length} applied</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#E7EBF5] border border-[#3B82F6]/40"
                >
                  <span className="text-[#9AA5C1]">{chip.label}:</span>
                  <span className="font-semibold text-[#adc6ff]">{chip.value}</span>
                  <button
                    onClick={() => onFilterChange(chip.key, 'All')}
                    className="ml-0.5 hover:text-[#EF4444] transition-colors cursor-pointer"
                    title={`Remove ${chip.label} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter Dropdowns Grid */}
        <div className="space-y-2.5 text-xs">
          {/* Geography Section */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              State Jurisdiction
            </label>
            <div className="relative">
              <select
                value={filters.state}
                onChange={(e) => onFilterChange('state', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.states.map((st) => (
                  <option key={st} value={st} className="bg-[#10182B] text-[#E7EBF5]">
                    {st === 'All' ? 'All States (25)' : st}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              District
            </label>
            <div className="relative">
              <select
                value={filters.district}
                onChange={(e) => onFilterChange('district', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.districts.map((d) => (
                  <option key={d} value={d} className="bg-[#10182B] text-[#E7EBF5]">
                    {d === 'All' ? 'All Districts' : d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Constituency */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Parliamentary Constituency
            </label>
            <div className="relative">
              <select
                value={filters.constituency}
                onChange={(e) => onFilterChange('constituency', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.constituencies.map((c) => (
                  <option key={c} value={c} className="bg-[#10182B] text-[#E7EBF5]">
                    {c === 'All' ? 'All Constituencies' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* MP */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Member of Parliament (MP)
            </label>
            <div className="relative">
              <select
                value={filters.mp}
                onChange={(e) => onFilterChange('mp', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.mps.map((mp) => (
                  <option key={mp} value={mp} className="bg-[#10182B] text-[#E7EBF5]">
                    {mp === 'All' ? 'All Electors / MPs' : mp}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          <div className="h-px bg-[#232D47] my-2" />

          {/* Risk Level */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Risk Level
            </label>
            <div className="relative">
              <select
                value={filters.riskLevel}
                onChange={(e) => onFilterChange('riskLevel', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.riskLevels.map((rl) => (
                  <option key={rl} value={rl} className="bg-[#10182B] text-[#E7EBF5]">
                    {rl === 'All' ? 'All Risk Levels' : rl}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Anomaly Type */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Primary Anomaly Type
            </label>
            <div className="relative">
              <select
                value={filters.anomalyType}
                onChange={(e) => onFilterChange('anomalyType', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.anomalyTypes.map((at) => (
                  <option key={at} value={at} className="bg-[#10182B] text-[#E7EBF5]">
                    {at === 'All' ? 'All Anomaly Patterns' : at}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Work Category */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Work Category
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c} className="bg-[#10182B] text-[#E7EBF5]">
                    {c === 'All' ? 'All Work Categories' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          <div className="h-px bg-[#232D47] my-2" />

          {/* Vendor */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Contractor / Vendor
            </label>
            <div className="relative">
              <select
                value={filters.vendor}
                onChange={(e) => onFilterChange('vendor', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.vendors.map((v) => (
                  <option key={v} value={v} className="bg-[#10182B] text-[#E7EBF5]">
                    {v === 'All' ? 'All Contracted Vendors' : v}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Implementing Agency */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Implementing Agency
            </label>
            <div className="relative">
              <select
                value={filters.agency}
                onChange={(e) => onFilterChange('agency', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.agencies.map((a) => (
                  <option key={a} value={a} className="bg-[#10182B] text-[#E7EBF5]">
                    {a === 'All' ? 'All Nodal Agencies' : a}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Financial Year */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Financial Year
            </label>
            <div className="relative">
              <select
                value={filters.financialYear}
                onChange={(e) => onFilterChange('financialYear', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.financialYears.map((fy) => (
                  <option key={fy} value={fy} className="bg-[#10182B] text-[#E7EBF5]">
                    {fy === 'All' ? 'All Financial Years' : fy}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>

          {/* Project Status */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase text-[#667090] font-bold tracking-wider">
              Project Status
            </label>
            <div className="relative">
              <select
                value={filters.projectStatus}
                onChange={(e) => onFilterChange('projectStatus', e.target.value)}
                className="w-full h-7 bg-[#0A0E1A] border border-[#232D47] rounded px-2 pr-6 text-xs text-[#E7EBF5] appearance-none focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                {filterOptions.projectStatuses.map((ps) => (
                  <option key={ps} value={ps} className="bg-[#10182B] text-[#E7EBF5]">
                    {ps === 'All' ? 'All Statuses' : ps}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
