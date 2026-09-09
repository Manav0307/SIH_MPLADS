import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  SlidersHorizontal,
} from 'lucide-react'
import { mockMps } from '@/data'
import { MpRecord, MpFilterState } from '@/types'
import { StatusPill } from '@/components/common/StatusPill'
import { SearchInput } from '@/components/common/SearchInput'
import {
  MpSummaryStrip,
  MpFilters,
  initialMpFilterState,
  MpRiskDistribution,
  FundUtilizationChart,
  TopRiskConstituencies,
  MpDirectoryTable,
  MpSortField,
} from '@/components/mps'

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

export const MPsPage: React.FC = () => {
  const navigate = useNavigate()

  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<MpFilterState>(initialMpFilterState)

  // 2. Sorting & Display State
  const [sortField, setSortField] = useState<MpSortField>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [density, setDensity] = useState<'standard' | 'dense'>('standard')

  // Filter handlers
  const handleFilterChange = useCallback((key: keyof MpFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialMpFilterState)
    setSearchQuery('')
  }, [])

  const handleSort = useCallback((field: MpSortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((old) => (old === 'asc' ? 'desc' : 'asc'))
        return field
      }
      setSortOrder('desc')
      return field
    })
  }, [])

  const handleSelectMp = useCallback((mp: MpRecord) => {
    navigate(`/mps/${mp.id}`)
  }, [navigate])

  // Extract filter options dynamically from data
  const filterOptions = useMemo(() => {
    const states = Array.from(new Set(mockMps.map((m) => m.state))).sort()
    const districts = Array.from(new Set(mockMps.map((m) => m.district))).sort()
    const constituencies = Array.from(new Set(mockMps.map((m) => m.constituency))).sort()
    const mps = Array.from(new Set(mockMps.map((m) => m.name))).sort()
    return { states, districts, constituencies, mps }
  }, [])

  // National telemetry derived from all records
  const nationalTelemetry = useMemo(() => {
    let totalAlloc = 0
    let totalSanc = 0
    let totalDisb = 0
    let totalFlagged = 0
    let totalProj = 0

    mockMps.forEach((m) => {
      totalAlloc += m.allocatedAmount
      totalSanc += m.sanctionedAmount
      totalDisb += m.disbursedAmount
      totalFlagged += m.flaggedProjectsCount
      totalProj += m.projectsCount
    })

    return {
      mpsCount: mockMps.length,
      constituenciesCount: mockMps.length,
      allocatedDisplay: formatCurrency(totalAlloc),
      sanctionedDisplay: formatCurrency(totalSanc),
      disbursedDisplay: formatCurrency(totalDisb),
      flaggedCount: totalFlagged,
      totalProjects: totalProj,
    }
  }, [])

  // 3. Primary Filtering and Search Logic
  const filteredMps = useMemo(() => {
    return mockMps.filter((m) => {
      // Global search (case-insensitive)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchName = m.name.toLowerCase().includes(q)
        const matchConstituency = m.constituency.toLowerCase().includes(q)
        const matchState = m.state.toLowerCase().includes(q)
        const matchDistrict = m.district.toLowerCase().includes(q)
        const matchParty = m.party.toLowerCase().includes(q)
        const matchAnomaly = m.primaryRisk.toLowerCase().includes(q)

        if (!matchName && !matchConstituency && !matchState && !matchDistrict && !matchParty && !matchAnomaly) {
          return false
        }
      }

      // State Filter
      if (filters.state && filters.state !== 'All') {
        if (m.state.toLowerCase() !== filters.state.toLowerCase()) return false
      }

      // District Filter
      if (filters.district && filters.district !== 'All') {
        if (!m.district.toLowerCase().includes(filters.district.toLowerCase())) return false
      }

      // Constituency Filter
      if (filters.constituency && filters.constituency !== 'All') {
        if (!m.constituency.toLowerCase().includes(filters.constituency.toLowerCase())) return false
      }

      // MP Filter
      if (filters.mp && filters.mp !== 'All') {
        if (m.name.toLowerCase() !== filters.mp.toLowerCase()) return false
      }

      // Risk Level Filter
      if (filters.riskLevel && filters.riskLevel !== 'All') {
        if (m.riskLevel.toLowerCase() !== filters.riskLevel.toLowerCase()) return false
      }

      // Financial Year Filter
      if (filters.financialYear && filters.financialYear !== 'All') {
        const hasFy = m.activityByFy.some(
          (a) => a.fy === filters.financialYear && a.projectsCount > 0
        )
        if (!hasFy) return false
      }

      // Amount Range Filter (based on sanctionedAmount)
      if (filters.amountRange && filters.amountRange !== 'All') {
        const amt = m.sanctionedAmount
        if (filters.amountRange === '< ₹10L') {
          if (amt >= 1000000) return false
        } else if (filters.amountRange === '₹10L–₹25L' || filters.amountRange === '₹10L - ₹25L') {
          if (amt < 1000000 || amt > 2500000) return false
        } else if (filters.amountRange === '₹25L–₹50L' || filters.amountRange === '₹25L - ₹50L') {
          if (amt < 2500000 || amt > 5000000) return false
        } else if (filters.amountRange === '₹50L–₹1Cr' || filters.amountRange === '₹50L - ₹1Cr') {
          if (amt < 5000000 || amt > 10000000) return false
        } else if (filters.amountRange === '₹1Cr–₹5Cr' || filters.amountRange === '₹1Cr - ₹5Cr') {
          if (amt < 10000000 || amt > 50000000) return false
        } else if (filters.amountRange === '> ₹5Cr') {
          if (amt <= 50000000) return false
        }
      }

      // Project Status Filter
      if (filters.projectStatus && filters.projectStatus !== 'All') {
        const s = filters.projectStatus.toLowerCase()
        if (s.includes('recommend') && m.statusBreakdown.recommended === 0) return false
        if (s.includes('sanction') && m.statusBreakdown.sanctioned === 0) return false
        if (s.includes('disburs') && m.statusBreakdown.disbursed === 0) return false
        if (s.includes('complete') && m.statusBreakdown.completed === 0) return false
        if (s.includes('stall') && m.statusBreakdown.stalled === 0) return false
      }

      return true
    })
  }, [searchQuery, filters])

  // 4. Sorting Logic
  const sortedMps = useMemo(() => {
    const list = [...filteredMps]
    list.sort((a, b) => {
      let valA: string | number = 0
      let valB: string | number = 0

      switch (sortField) {
        case 'riskScore':
          valA = a.riskScore
          valB = b.riskScore
          break
        case 'name':
          valA = a.name
          valB = b.name
          break
        case 'constituency':
          valA = a.constituency
          valB = b.constituency
          break
        case 'state':
          valA = a.state
          valB = b.state
          break
        case 'allocatedAmount':
          valA = a.allocatedAmount
          valB = b.allocatedAmount
          break
        case 'sanctionedAmount':
          valA = a.sanctionedAmount
          valB = b.sanctionedAmount
          break
        case 'disbursedAmount':
          valA = a.disbursedAmount
          valB = b.disbursedAmount
          break
        case 'utilizationPercent':
          valA = a.utilizationPercent
          valB = b.utilizationPercent
          break
        case 'projectsCount':
          valA = a.projectsCount
          valB = b.projectsCount
          break
        case 'flaggedProjectsCount':
          valA = a.flaggedProjectsCount
          valB = b.flaggedProjectsCount
          break
        default:
          valA = a.riskScore
          valB = b.riskScore
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0
      }
    })
    return list
  }, [filteredMps, sortField, sortOrder])

  // 5. Filtered Risk Distribution Counts
  const riskCounts = useMemo(() => {
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0

    filteredMps.forEach((m) => {
      if (m.riskLevel === 'critical') critical++
      else if (m.riskLevel === 'high') high++
      else if (m.riskLevel === 'medium') medium++
      else low++
    })

    return { critical, high, medium, low, total: filteredMps.length }
  }, [filteredMps])

  // 6. Filtered Summary Strip Metrics
  const filteredSummary = useMemo(() => {
    let alloc = 0
    let sanc = 0
    let disb = 0
    let flagged = 0
    let proj = 0

    filteredMps.forEach((m) => {
      alloc += m.allocatedAmount
      sanc += m.sanctionedAmount
      disb += m.disbursedAmount
      flagged += m.flaggedProjectsCount
      proj += m.projectsCount
    })

    const disbPct = sanc > 0 ? Math.round((disb / sanc) * 1000) / 10 : 0

    return {
      mpsCount: filteredMps.length,
      constituenciesCount: filteredMps.length,
      totalAllocated: formatCurrency(alloc),
      totalSanctioned: formatCurrency(sanc),
      totalDisbursed: formatCurrency(disb),
      disbursedPct: disbPct,
      flaggedCount: flagged,
      totalProjects: proj,
    }
  }, [filteredMps])

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = [
      'MP Name',
      'Parliamentary House',
      'Party',
      'Constituency',
      'Constituency Code',
      'State',
      'District',
      'Risk Level',
      'Risk Score',
      'Allocated Amount (INR)',
      'Sanctioned Amount (INR)',
      'Disbursed Amount (INR)',
      'Spent Amount (INR)',
      'Utilization %',
      'Works Count',
      'Flagged Works Count',
      'Primary Anomaly Flag',
    ]

    const rows = sortedMps.map((m) => [
      `"${m.name}"`,
      `"${m.house}"`,
      `"${m.party}"`,
      `"${m.constituency}"`,
      `"${m.constituencyCode}"`,
      `"${m.state}"`,
      `"${m.district}"`,
      m.riskLevel.toUpperCase(),
      m.riskScore,
      m.allocatedAmount,
      m.sanctionedAmount,
      m.disbursedAmount,
      m.spentAmount,
      m.utilizationPercent,
      m.projectsCount,
      m.flaggedProjectsCount,
      `"${m.primaryRisk.replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `MPLADS_Constituencies_Intelligence_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-8 px-4 space-y-3">
      {/* 1. Page Header & Top Readout Strip */}
      <div className="flex flex-col gap-2 pt-2 border-b border-[#232D47] pb-3 bg-[#0A0E1A]/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base lg:text-lg font-bold text-[#E7EBF5] tracking-tight">
                MPs & Constituencies Intelligence
              </h1>
              <StatusPill label="STAGE 1 READY" variant="synced" />
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
                PARLIAMENTARY OVERSIGHT // 18TH LOK SABHA
              </span>
            </div>
            <p className="text-xs text-[#9AA5C1] mt-0.5">
              Constituency-level fund utilization, risk and anomaly monitoring
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Density toggle */}
            <button
              onClick={() => setDensity((d) => (d === 'dense' ? 'standard' : 'dense'))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] hover:border-[#353946] text-[#9AA5C1] font-mono text-[11px] cursor-pointer transition-colors"
              title="Toggle Table Density"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#667090]" />
              <span>{density === 'dense' ? 'Dense' : 'Standard'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] hover:border-[#353946] text-[#9AA5C1] font-mono text-[11px] cursor-pointer transition-colors"
              title="Export Constituencies Intelligence CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Compact National Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono pt-1">
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between">
            <span className="text-[#667090] text-[10px] uppercase">MPs:</span>
            <span className="font-bold text-[#E7EBF5]">{nationalTelemetry.mpsCount}</span>
          </div>
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between">
            <span className="text-[#667090] text-[10px] uppercase">Constituencies:</span>
            <span className="font-bold text-[#E7EBF5]">{nationalTelemetry.constituenciesCount}</span>
          </div>
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between">
            <span className="text-[#667090] text-[10px] uppercase">Allocated:</span>
            <span className="font-bold text-[#E7EBF5]">{nationalTelemetry.allocatedDisplay}</span>
          </div>
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between">
            <span className="text-[#667090] text-[10px] uppercase">Sanctioned:</span>
            <span className="font-bold text-[#E7EBF5]">{nationalTelemetry.sanctionedDisplay}</span>
          </div>
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between">
            <span className="text-[#667090] text-[10px] uppercase">Disbursed:</span>
            <span className="font-bold text-[#22C55E]">{nationalTelemetry.disbursedDisplay}</span>
          </div>
          <div className="bg-[#10182B] px-2.5 py-1 rounded border border-[#232D47] flex items-center justify-between col-span-2 sm:col-span-1">
            <span className="text-[#EF4444] text-[10px] uppercase font-bold">Flagged Works:</span>
            <span className="font-bold text-[#EF4444]">{nationalTelemetry.flaggedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Global Search Field */}
      <div className="flex items-center gap-2">
        <SearchInput
          placeholder="Search MP, constituency, state, district, anomaly profile... (Press '/' to focus)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          scopeTag="MP DIRECTORY"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-2 py-1 text-xs font-mono text-[#9AA5C1] hover:text-[#E7EBF5] bg-[#10182B] border border-[#232D47] rounded cursor-pointer transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Combinable Filter Bar */}
      <MpFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        options={filterOptions}
      />

      {/* 4. National Summary KPI Strip */}
      <MpSummaryStrip
        mpsCount={filteredSummary.mpsCount}
        constituenciesCount={filteredSummary.constituenciesCount}
        totalAllocated={filteredSummary.totalAllocated}
        totalSanctioned={filteredSummary.totalSanctioned}
        totalDisbursed={filteredSummary.totalDisbursed}
        disbursedPct={filteredSummary.disbursedPct}
        flaggedCount={filteredSummary.flaggedCount}
        totalProjects={filteredSummary.totalProjects}
      />

      {/* 5. Risk Distribution Visualization */}
      <MpRiskDistribution
        critical={riskCounts.critical}
        high={riskCounts.high}
        medium={riskCounts.medium}
        low={riskCounts.low}
        total={riskCounts.total}
      />

      {/* 6. Fund Utilization Analysis Chart */}
      <FundUtilizationChart mps={filteredMps} />

      {/* 7. Top Risk Constituencies Section */}
      <TopRiskConstituencies mps={filteredMps} limit={12} />

      {/* 8. MP Directory Table */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-xs font-mono px-1">
          <span className="text-[#9AA5C1] uppercase font-semibold">
            Constituency Parliamentary Register ({sortedMps.length} Records)
          </span>
          <span className="text-[#667090] text-[10px]">
            CLICK ROW TO VIEW FULL PROFILE DOSSIER
          </span>
        </div>

        <MpDirectoryTable
          mps={sortedMps}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onSelectMp={handleSelectMp}
          density={density}
          onClearFilters={handleResetFilters}
        />
      </div>
    </div>
  )
}

export default MPsPage
