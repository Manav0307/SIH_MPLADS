import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, RefreshCw } from 'lucide-react'
import {
  mockAgencies,
  getAgencyTelemetry,
  getAgencyRiskDistribution,
  getAgencyProjects,
  mockProjects,
} from '@/data'
import { AgencyRecord, AgencyFilterState, AgencySortField } from '@/types'
import { StatusPill } from '@/components/common/StatusPill'
import { SearchInput } from '@/components/common/SearchInput'
import {
  AgencySummaryStrip,
  AgencyFilters,
  initialAgencyFilterState,
  AgencyRiskDistribution,
  AgencyDirectoryTable,
} from '@/components/agencies'

export const AgenciesPage: React.FC = () => {
  const navigate = useNavigate()

  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<AgencyFilterState>(initialAgencyFilterState)

  // 2. Sorting & Pagination State
  const [sortField, setSortField] = useState<AgencySortField>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [density] = useState<'standard' | 'dense'>('standard')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(25)
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | undefined>(undefined)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Handlers
  const handleFilterChange = useCallback((key: keyof AgencyFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialAgencyFilterState)
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((field: AgencySortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((old) => (old === 'asc' ? 'desc' : 'asc'))
        return field
      }
      setSortOrder('desc')
      return field
    })
    setCurrentPage(1)
  }, [])

  const handleSelectAgency = useCallback(
    (agency: AgencyRecord) => {
      setSelectedAgencyId(agency.id)
      navigate(`/agencies/${agency.id}`)
    },
    [navigate]
  )

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 450)
  }, [])

  // Dynamic filter options extracted from mockProjects and mockAgencies
  const filterOptions = useMemo(() => {
    const states = Array.from(new Set(mockProjects.map((p) => p.state))).sort()
    const districts = Array.from(new Set(mockProjects.map((p) => p.district))).sort()
    const constituencies = Array.from(new Set(mockProjects.map((p) => p.constituency))).sort()
    const mps = Array.from(new Set(mockProjects.map((p) => p.mpName))).sort()
    const agencyTypes = Array.from(new Set(mockAgencies.map((a) => a.agencyType))).sort()
    const agencies = Array.from(new Set(mockAgencies.map((a) => a.name))).sort()
    const categories = Array.from(new Set(mockProjects.map((p) => p.category))).sort()
    return { states, districts, constituencies, mps, agencyTypes, agencies, categories }
  }, [])

  // Map of agency projects for deep filtering
  const agencyProjectsMap = useMemo(() => {
    const map = new Map<string, typeof mockProjects>()
    mockAgencies.forEach((a) => {
      map.set(a.name.toLowerCase(), getAgencyProjects(a.name))
    })
    return map
  }, [])

  // Filter and search logic
  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter((a) => {
      const aProjects = agencyProjectsMap.get(a.name.toLowerCase()) || []

      // A. Global Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchName = a.name.toLowerCase().includes(q)
        const matchType = a.agencyType.toLowerCase().includes(q)
        const matchState = a.statePresence.some((s) => s.toLowerCase().includes(q))
        const matchAnomaly = a.primaryAnomaly.toLowerCase().includes(q)
        const matchBase = a.topConstituency ? a.topConstituency.toLowerCase().includes(q) : false
        const matchVendor = a.topVendor ? a.topVendor.toLowerCase().includes(q) : false
        const matchProject = aProjects.some(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.workCode.toLowerCase().includes(q) ||
            p.mpName.toLowerCase().includes(q) ||
            p.constituency.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q)
        )

        if (
          !matchName &&
          !matchType &&
          !matchState &&
          !matchAnomaly &&
          !matchBase &&
          !matchVendor &&
          !matchProject
        ) {
          return false
        }
      }

      // B. State Filter
      if (filters.state && filters.state !== 'All') {
        const targetState = filters.state.toLowerCase()
        const matchesPresence = a.statePresence.some((s) => s.toLowerCase() === targetState)
        const matchesProjects = aProjects.some((p) => p.state.toLowerCase() === targetState)
        if (!matchesPresence && !matchesProjects) {
          return false
        }
      }

      // C. District Filter
      if (filters.district && filters.district !== 'All') {
        const targetDistrict = filters.district.toLowerCase()
        const matchesProjects = aProjects.some((p) =>
          p.district.toLowerCase().includes(targetDistrict)
        )
        if (!matchesProjects) {
          return false
        }
      }

      // D. Constituency Filter
      if (filters.constituency && filters.constituency !== 'All') {
        const targetConst = filters.constituency.toLowerCase()
        const matchesProjects = aProjects.some((p) =>
          p.constituency.toLowerCase().includes(targetConst)
        )
        if (!matchesProjects) {
          return false
        }
      }

      // E. MP Filter
      if (filters.mp && filters.mp !== 'All') {
        const targetMp = filters.mp.toLowerCase()
        const matchesProjects = aProjects.some((p) =>
          p.mpName.toLowerCase().includes(targetMp)
        )
        if (!matchesProjects) {
          return false
        }
      }

      // F. Agency Type Filter
      if (filters.agencyType && filters.agencyType !== 'All') {
        if (a.agencyType.toLowerCase() !== filters.agencyType.toLowerCase()) {
          return false
        }
      }

      // G. Agency Filter
      if (filters.agency && filters.agency !== 'All') {
        if (a.name.toLowerCase() !== filters.agency.toLowerCase()) {
          return false
        }
      }

      // H. Work Category Filter
      if (filters.category && filters.category !== 'All') {
        const targetCat = filters.category.toLowerCase()
        const matchesProjects = aProjects.some((p) =>
          p.category.toLowerCase().includes(targetCat)
        )
        if (!matchesProjects) {
          return false
        }
      }

      // I. Risk Level Filter
      if (filters.riskLevel && filters.riskLevel !== 'All') {
        if (a.riskLevel.toLowerCase() !== filters.riskLevel.toLowerCase()) {
          return false
        }
      }

      // J. Financial Year Filter
      if (filters.financialYear && filters.financialYear !== 'All') {
        const targetFy = filters.financialYear.toLowerCase()
        const matchesProjects = aProjects.some(
          (p) =>
            (p.workCode &&
              p.workCode.toLowerCase().includes(targetFy.replace('fy ', '').slice(2, 7))) ||
            (p.timeline?.sanctioned &&
              p.timeline.sanctioned.toLowerCase().includes(targetFy.slice(3, 7)))
        )
        if (!matchesProjects) {
          return false
        }
      }

      // K. Project Status Filter
      if (filters.projectStatus && filters.projectStatus !== 'All') {
        const targetStatus = filters.projectStatus.toLowerCase()
        const matchesProjects = aProjects.some((p) =>
          p.status.toLowerCase().includes(targetStatus)
        )
        if (!matchesProjects) {
          return false
        }
      }

      // L. Amount Range Filter
      if (filters.amountRange && filters.amountRange !== 'All') {
        const val = a.totalSanctionedNum
        if (filters.amountRange === '< ₹ 25 L' && val >= 2500000) return false
        if (
          filters.amountRange === '₹ 25 L - ₹ 50 L' &&
          (val < 2500000 || val > 5000000)
        )
          return false
        if (
          filters.amountRange === '₹ 50 L - ₹ 1 Cr' &&
          (val < 5000000 || val > 10000000)
        )
          return false
        if (
          filters.amountRange === '₹ 1 Cr - ₹ 5 Cr' &&
          (val < 10000000 || val > 50000000)
        )
          return false
        if (filters.amountRange === '> ₹ 5 Cr' && val <= 50000000) return false
      }

      return true
    })
  }, [filters, searchQuery, agencyProjectsMap])

  // Sorting logic
  const sortedAgencies = useMemo(() => {
    return [...filteredAgencies].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'riskScore':
          comparison = b.riskScore - a.riskScore
          break
        case 'totalDisbursed':
          comparison = b.totalDisbursedNum - a.totalDisbursedNum
          break
        case 'flaggedPercentage':
          comparison = b.flaggedPercentage - a.flaggedPercentage
          break
        case 'activeWorks':
          comparison = b.activeWorks - a.activeWorks
          break
        case 'delayedWorks':
          comparison = b.delayedWorksCount - a.delayedWorksCount
          break
        case 'avgProjectValue':
          comparison = (b.avgProjectValueNum || 0) - (a.avgProjectValueNum || 0)
          break
        default:
          comparison = b.riskScore - a.riskScore
      }
      return sortOrder === 'asc' ? -comparison : comparison
    })
  }, [filteredAgencies, sortField, sortOrder])

  // Telemetry derived from all agencies
  const telemetry = useMemo(() => getAgencyTelemetry(mockAgencies), [])

  // Risk distribution derived from filtered agencies
  const riskDistribution = useMemo(
    () => getAgencyRiskDistribution(filteredAgencies),
    [filteredAgencies]
  )

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-12 px-4 space-y-4">
      {/* 1. Page Header & Live Telemetry Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232D47] pb-3 pt-2 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Implementing Agencies Intelligence
            </h1>
            <StatusPill label="STAGE 10 ACTIVE" variant="synced" />
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            Agency execution performance, fund flow and anomaly monitoring
          </p>
        </div>

        {/* Telemetry and Freshness Tag */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#10182B] border border-[#232D47] text-[#9AA5C1]">
            <Clock className="w-3 h-3 text-[#3B82F6]" />
            <span>Data Freshness: 12m ago (PFMS Synced)</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-1 rounded bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
            title="Refresh implementing agency intelligence feed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* 2. Global Search Bar */}
      <div className="w-full">
        <SearchInput
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search agency, project, MP, constituency or state..."
          scopeTag={`AGENCIES: ${mockAgencies.length}`}
        />
      </div>

      {/* 3. Combinable Filters */}
      <AgencyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        options={filterOptions}
      />

      {/* 4. KPI Strip */}
      <AgencySummaryStrip
        agenciesMonitored={telemetry.agenciesMonitored}
        activeAgencies={telemetry.activeAgencies}
        highRiskAgencies={telemetry.highRiskAgencies}
        projectsExecuted={telemetry.projectsExecuted}
        totalSanctioned={telemetry.totalSanctionedDisplay}
        totalDisbursed={telemetry.totalDisbursedDisplay}
        flaggedProjectsCount={telemetry.flaggedProjectsCount}
      />

      {/* 5. Agency Risk Distribution */}
      <AgencyRiskDistribution
        critical={riskDistribution.critical}
        high={riskDistribution.high}
        medium={riskDistribution.medium}
        low={riskDistribution.low}
        total={riskDistribution.total}
      />

      {/* 6. Primary Agency Ledger */}
      <AgencyDirectoryTable
        agencies={sortedAgencies}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectAgency={handleSelectAgency}
        selectedAgencyId={selectedAgencyId}
        density={density}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={filteredAgencies.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

export default AgenciesPage
