import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  RefreshCw,
} from 'lucide-react'
import {
  mockVendors,
  getVendorTelemetry,
  getVendorRiskDistribution,
  getVendorProjects,
  mockProjects,
} from '@/data'
import { VendorRecord, VendorFilterState, VendorSortField } from '@/types'
import { StatusPill } from '@/components/common/StatusPill'
import { SearchInput } from '@/components/common/SearchInput'
import {
  VendorSummaryStrip,
  VendorFilters,
  initialVendorFilterState,
  VendorRiskDistribution,
  VendorDirectoryTable,
} from '@/components/vendors'

export const VendorsPage: React.FC = () => {
  const navigate = useNavigate()

  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<VendorFilterState>(initialVendorFilterState)

  // 2. Sorting & Pagination State
  const [sortField, setSortField] = useState<VendorSortField>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [density] = useState<'standard' | 'dense'>('standard')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(25)
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(undefined)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Handlers
  const handleFilterChange = useCallback((key: keyof VendorFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialVendorFilterState)
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((field: VendorSortField) => {
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

  const handleSelectVendor = useCallback(
    (vendor: VendorRecord) => {
      setSelectedVendorId(vendor.id)
      navigate(`/vendors/${vendor.id}`)
    },
    [navigate]
  )

  const handleViewProjects = useCallback(
    (vendor: VendorRecord, e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/projects?vendor=${encodeURIComponent(vendor.name)}`)
    },
    [navigate]
  )

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 450)
  }, [])

  // Dynamic filter options extracted from mockProjects and mockVendors
  const filterOptions = useMemo(() => {
    const states = Array.from(new Set(mockProjects.map((p) => p.state))).sort()
    const districts = Array.from(new Set(mockProjects.map((p) => p.district))).sort()
    const constituencies = Array.from(new Set(mockProjects.map((p) => p.constituency))).sort()
    const categories = Array.from(new Set(mockProjects.map((p) => p.category))).sort()
    const agencies = Array.from(new Set(mockProjects.map((p) => p.agency))).sort()
    return { states, districts, constituencies, categories, agencies }
  }, [])

  // Map of vendor projects for deep filtering
  const vendorProjectsMap = useMemo(() => {
    const map = new Map<string, typeof mockProjects>()
    mockVendors.forEach((v) => {
      map.set(v.name.toLowerCase(), getVendorProjects(v.name))
    })
    return map
  }, [])

  // Filter and search logic
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((v) => {
      const vProjects = vendorProjectsMap.get(v.name.toLowerCase()) || []

      // A. Global Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchName = v.name.toLowerCase().includes(q)
        const matchGst = v.gstin.toLowerCase().includes(q)
        const matchState =
          (v.registeredState && v.registeredState.toLowerCase().includes(q)) ||
          (v.statePresence && v.statePresence.some((s) => s.toLowerCase().includes(q)))
        const matchAnomaly = v.primaryAnomaly.toLowerCase().includes(q)
        const matchSignal = v.networkSignal ? v.networkSignal.toLowerCase().includes(q) : false
        const matchProject = vProjects.some(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.workCode.toLowerCase().includes(q) ||
            p.mpName.toLowerCase().includes(q) ||
            p.constituency.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q)
        )

        if (!matchName && !matchGst && !matchState && !matchAnomaly && !matchSignal && !matchProject) {
          return false
        }
      }

      // B. State Filter
      if (filters.state && filters.state !== 'All') {
        const targetState = filters.state.toLowerCase()
        const matchesRegState = v.registeredState?.toLowerCase() === targetState
        const matchesPresence = v.statePresence?.some((s) => s.toLowerCase() === targetState)
        const matchesProjects = vProjects.some((p) => p.state.toLowerCase() === targetState)
        if (!matchesRegState && !matchesPresence && !matchesProjects) {
          return false
        }
      }

      // C. District Filter
      if (filters.district && filters.district !== 'All') {
        const targetDistrict = filters.district.toLowerCase()
        const matchesProjects = vProjects.some((p) => p.district.toLowerCase().includes(targetDistrict))
        if (!matchesProjects) {
          return false
        }
      }

      // D. Constituency Filter
      if (filters.constituency && filters.constituency !== 'All') {
        const targetConst = filters.constituency.toLowerCase()
        const matchesProjects = vProjects.some((p) => p.constituency.toLowerCase().includes(targetConst))
        if (!matchesProjects) {
          return false
        }
      }

      // E. Financial Year Filter
      if (filters.financialYear && filters.financialYear !== 'All') {
        const targetFy = filters.financialYear.toLowerCase()
        const matchesProjects = vProjects.some(
          (p) =>
            (p.workCode && p.workCode.toLowerCase().includes(targetFy.replace('fy ', '').slice(2, 7))) ||
            (p.timeline?.sanctioned && p.timeline.sanctioned.toLowerCase().includes(targetFy.slice(3, 7)))
        )
        if (!matchesProjects) {
          return false
        }
      }

      // F. Risk Level Filter
      if (filters.riskLevel && filters.riskLevel !== 'All') {
        if (v.riskLevel.toLowerCase() !== filters.riskLevel.toLowerCase()) {
          return false
        }
      }

      // G. Work Category Filter
      if (filters.category && filters.category !== 'All') {
        const targetCat = filters.category.toLowerCase()
        const matchesProjects = vProjects.some((p) => p.category.toLowerCase().includes(targetCat))
        if (!matchesProjects) {
          return false
        }
      }

      // H. Implementing Agency Filter
      if (filters.agency && filters.agency !== 'All') {
        const targetAgency = filters.agency.toLowerCase()
        const matchesProjects = vProjects.some((p) => p.agency.toLowerCase().includes(targetAgency))
        if (!matchesProjects) {
          return false
        }
      }

      // I. Project Status Filter
      if (filters.projectStatus && filters.projectStatus !== 'All') {
        const targetStatus = filters.projectStatus.toLowerCase()
        const matchesProjects = vProjects.some((p) => p.status.toLowerCase() === targetStatus)
        if (!matchesProjects) {
          return false
        }
      }

      // J. Vendor Activity Level Filter
      if (filters.activityLevel && filters.activityLevel !== 'All') {
        if (filters.activityLevel === 'high' && v.activeWorks <= 6) return false
        if (filters.activityLevel === 'medium' && (v.activeWorks < 4 || v.activeWorks > 6)) return false
        if (filters.activityLevel === 'low' && v.activeWorks > 3) return false
      }

      return true
    })
  }, [filters, searchQuery, vendorProjectsMap])

  // Sorting logic
  const sortedVendors = useMemo(() => {
    return [...filteredVendors].sort((a, b) => {
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
        case 'avgProjectValue':
          comparison = (b.avgProjectValueNum || 0) - (a.avgProjectValueNum || 0)
          break
        default:
          comparison = b.riskScore - a.riskScore
      }
      return sortOrder === 'asc' ? -comparison : comparison
    })
  }, [filteredVendors, sortField, sortOrder])

  // Telemetry derived from all vendors
  const telemetry = useMemo(() => getVendorTelemetry(mockVendors), [])

  // Risk distribution derived from filtered vendors
  const riskDistribution = useMemo(
    () => getVendorRiskDistribution(filteredVendors),
    [filteredVendors]
  )

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-12 px-4 space-y-4">
      {/* 1. Page Header & Live Telemetry Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232D47] pb-3 pt-2 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Vendor &amp; Contractor Network
            </h1>
            <StatusPill label="STAGE 9 ACTIVE" variant="synced" />
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            Contractor concentration, anomaly exposure and procurement intelligence
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
            title="Refresh procurement intelligence feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`} />
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
          placeholder="Search vendor, GSTIN, project, MP or constituency..."
          scopeTag="VENDORS: 10"
        />
      </div>

      {/* 3. Combinable Filters */}
      <VendorFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        options={filterOptions}
      />

      {/* 4. Vendor Risk Summary KPI Strip */}
      <VendorSummaryStrip
        vendorsMonitored={telemetry.vendorsMonitored}
        activeContractors={telemetry.activeContractors}
        highRiskVendors={telemetry.highRiskVendors}
        flaggedProjectsCount={telemetry.flaggedProjectsCount}
        totalDisbursed={telemetry.totalDisbursedDisplay}
        avgProjectValue={telemetry.avgProjectValueDisplay}
      />

      {/* 5. Vendor Risk Distribution Visualization */}
      <VendorRiskDistribution
        critical={riskDistribution.critical}
        high={riskDistribution.high}
        medium={riskDistribution.medium}
        low={riskDistribution.low}
        total={riskDistribution.total}
      />

      {/* 6. Primary Vendor Ledger (Dense Table with Sorting & Pagination) */}
      <VendorDirectoryTable
        vendors={sortedVendors}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectVendor={handleSelectVendor}
        onViewProjects={handleViewProjects}
        selectedVendorId={selectedVendorId}
        density={density}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={filteredVendors.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

export default VendorsPage

