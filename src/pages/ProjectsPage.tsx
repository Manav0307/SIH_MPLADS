import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mockProjects } from '@/data'
import { ProjectRecord, FilterState, ProjectSortField } from '@/types'
import { ProjectDossierDrawer } from '@/components/dossier'
import {
  ProjectLedgerHeader,
  ProjectLedgerSearch,
  ProjectFilters,
  initialProjectFilterState,
  QuickRiskFilter,
  QuickRiskOption,
  ProjectSummaryStrip,
  RiskDistribution,
  ProjectsTable,
  ProjectPagination,
} from '@/components/ledger'

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vendorParam = searchParams.get('vendor')
  const searchParam = searchParams.get('search') || searchParams.get('q')

  // 1. Search and Filters State
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParam || '')
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...initialProjectFilterState,
    vendor: vendorParam || 'All',
  }))
  const [quickRisk, setQuickRisk] = useState<QuickRiskOption>('All')

  // 2. Table Controls State
  const [sortField, setSortField] = useState<ProjectSortField>('riskScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [density, setDensity] = useState<'standard' | 'dense'>('standard')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // 3. Dossier Slide-Over Drawer State
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  // Synchronize URL search parameters reactively
  useEffect(() => {
    const idParam = searchParams.get('id') || searchParams.get('projectId') || searchParams.get('workCode')
    const vendorP = searchParams.get('vendor')
    const agencyP = searchParams.get('agency')
    const mpP = searchParams.get('mp')
    const stateP = searchParams.get('state')
    const searchP = searchParams.get('search') || searchParams.get('q')
    const riskP = searchParams.get('risk')

    if (idParam) {
      const match = mockProjects.find(
        (p) =>
          p.id.toLowerCase() === idParam.toLowerCase() ||
          p.workCode.toLowerCase() === idParam.toLowerCase()
      )
      if (match) {
        setSelectedProject(match)
        setIsDrawerOpen(true)
      }
    }

    if (vendorP) {
      setFilters((prev) => ({ ...prev, vendor: vendorP }))
    }
    if (agencyP) {
      setFilters((prev) => ({ ...prev, agency: agencyP }))
    }
    if (stateP) {
      setFilters((prev) => ({ ...prev, state: stateP }))
    }
    if (searchP) {
      setSearchQuery(searchP)
    }
    if (mpP) {
      setSearchQuery(mpP)
    }
    if (riskP) {
      setQuickRisk(riskP as QuickRiskOption)
      setFilters((prev) => ({ ...prev, riskSeverity: riskP }))
    }
  }, [searchParams])

  // Handlers
  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialProjectFilterState)
    setQuickRisk('All')
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  const handleQuickRiskSelect = useCallback((risk: QuickRiskOption) => {
    setQuickRisk(risk)
    // Synchronize with filters.riskSeverity
    if (risk === 'All') {
      handleFilterChange('riskSeverity', 'All')
    } else {
      handleFilterChange('riskSeverity', risk)
    }
    setCurrentPage(1)
  }, [handleFilterChange])

  const handleSort = useCallback((field: ProjectSortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'))
        return field
      }
      setSortDirection('desc')
      return field
    })
    setCurrentPage(1)
  }, [])

  const handleOpenDrawer = useCallback((project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }, [])

  const handleInvestigate = useCallback((project: ProjectRecord) => {
    navigate(`/investigation?project=${project.id}`)
  }, [navigate])

  const handleToggleDensity = useCallback(() => {
    setDensity((prev) => (prev === 'dense' ? 'standard' : 'dense'))
  }, [])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }, [])

  // 4. Primary Filtering and Search Logic
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      // A. Global Search Matching
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchWorkCode = p.workCode.toLowerCase().includes(q)
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchState = p.state.toLowerCase().includes(q)
        const matchDistrict = p.district.toLowerCase().includes(q)
        const matchConstituency = p.constituency.toLowerCase().includes(q)
        const matchMp = p.mpName.toLowerCase().includes(q)
        const matchVendor = p.vendor.toLowerCase().includes(q)
        const matchAgency = p.agency.toLowerCase().includes(q)
        const matchAnomaly = p.primaryAnomaly.toLowerCase().includes(q)
        const matchViolations = p.violations.some(
          (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
        )

        if (
          !matchWorkCode &&
          !matchTitle &&
          !matchState &&
          !matchDistrict &&
          !matchConstituency &&
          !matchMp &&
          !matchVendor &&
          !matchAgency &&
          !matchAnomaly &&
          !matchViolations
        ) {
          return false
        }
      }

      // B. State Filter
      if (filters.state && filters.state !== 'All' && !filters.state.startsWith('All States')) {
        if (p.state.toLowerCase() !== filters.state.toLowerCase()) {
          return false
        }
      }

      // C. District Filter
      if (filters.district && filters.district !== 'All' && !filters.district.startsWith('All')) {
        if (!p.district.toLowerCase().includes(filters.district.toLowerCase())) {
          return false
        }
      }

      // D. Constituency Filter
      if (filters.constituency && filters.constituency !== 'All') {
        if (!p.constituency.toLowerCase().includes(filters.constituency.toLowerCase())) {
          return false
        }
      }

      // E. MP Filter
      if (filters.mp && filters.mp !== 'All' && !filters.mp.startsWith('All Electors')) {
        if (p.mpName.toLowerCase() !== filters.mp.toLowerCase()) {
          return false
        }
      }

      // F. Category Filter
      if (filters.category && filters.category !== 'All' && !filters.category.startsWith('All Categories')) {
        if (!p.category.toLowerCase().includes(filters.category.toLowerCase())) {
          return false
        }
      }

      // G. Vendor Filter
      if (filters.vendor && filters.vendor !== 'All' && !filters.vendor.startsWith('All Listed')) {
        if (!p.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) {
          return false
        }
      }

      // H. Implementing Agency Filter
      if (filters.agency && filters.agency !== 'All' && !filters.agency.startsWith('All Agencies')) {
        if (!p.agency.toLowerCase().includes(filters.agency.toLowerCase())) {
          return false
        }
      }

      // I. Risk Severity Filter
      if (filters.riskSeverity && filters.riskSeverity !== 'All' && !filters.riskSeverity.startsWith('All Risk')) {
        if (p.riskLevel.toLowerCase() !== filters.riskSeverity.toLowerCase()) {
          return false
        }
      }

      // J. Financial Year Filter
      if (filters.financialYear && filters.financialYear !== 'All') {
        if (filters.financialYear === 'FY 2025-26' && !p.workCode.includes('25-26')) return false
        if (filters.financialYear === 'FY 2024-25' && !p.workCode.includes('24-25')) return false
        if (filters.financialYear === 'FY 2023-24' && !p.workCode.includes('23-24')) return false
      }

      // K. Project Status Filter
      if (filters.projectStatus && filters.projectStatus !== 'All' && !filters.projectStatus.startsWith('All Statuses')) {
        if (p.status.toLowerCase() !== filters.projectStatus.toLowerCase()) {
          return false
        }
      }

      // L. Amount Range Filter (Based on sanctionedAmount)
      if (filters.amountRange && filters.amountRange !== 'All' && !filters.amountRange.startsWith('All Ranges')) {
        const amt = p.sanctionedAmount
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

      return true
    })
  }, [mockProjects, searchQuery, filters])

  // 5. Sorting Logic
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects]

    const parseDate = (dStr?: string): number => {
      if (!dStr) return 0
      const clean = dStr.split('(')[0].trim()
      const t = Date.parse(clean)
      return isNaN(t) ? 0 : t
    }

    list.sort((a, b) => {
      let valA: number | string = 0
      let valB: number | string = 0

      switch (sortField) {
        case 'riskScore':
          valA = a.riskScore
          valB = b.riskScore
          break
        case 'sanctionedAmount':
          valA = a.sanctionedAmount
          valB = b.sanctionedAmount
          break
        case 'disbursedAmount':
          valA = a.disbursedAmount
          valB = b.disbursedAmount
          break
        case 'spentAmount':
          valA = a.spentAmount
          valB = b.spentAmount
          break
        case 'agingDays':
          valA = a.agingDays
          valB = b.agingDays
          break
        case 'recommendedDate':
          valA = parseDate(a.timeline?.recommended)
          valB = parseDate(b.timeline?.recommended)
          break
        case 'sanctionDate':
          valA = parseDate(a.timeline?.sanctioned)
          valB = parseDate(b.timeline?.sanctioned)
          break
        default:
          valA = a.riskScore
          valB = b.riskScore
      }

      if (sortDirection === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0
      }
    })

    return list
  }, [filteredProjects, sortField, sortDirection])

  // 6. Pagination Logic
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedProjects.slice(start, start + pageSize)
  }, [sortedProjects, currentPage, pageSize])

  // 7. Telemetry & Summary Calculations
  const overallMetrics = useMemo(() => {
    let sanctioned = 0
    let disbursed = 0
    let flagged = 0

    mockProjects.forEach((p) => {
      sanctioned += p.sanctionedAmount
      disbursed += p.disbursedAmount
      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        flagged += 1
      }
    })

    const sanctionedCr = `₹ ${(sanctioned / 10000000).toFixed(2)} Cr`
    const disbursedCr = `₹ ${(disbursed / 10000000).toFixed(2)} Cr`

    return {
      totalMonitored: mockProjects.length,
      totalFlagged: flagged,
      totalSanctionedCr: sanctionedCr,
      totalDisbursedCr: disbursedCr,
    }
  }, [])

  // Filtered Summary Strip Metrics
  const filteredSummary = useMemo(() => {
    let sanctioned = 0
    let disbursed = 0
    let spent = 0
    let flagged = 0

    let critical = 0
    let high = 0
    let medium = 0
    let low = 0

    filteredProjects.forEach((p) => {
      sanctioned += p.sanctionedAmount
      disbursed += p.disbursedAmount
      spent += p.spentAmount
      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        flagged += 1
      }

      if (p.riskLevel === 'critical') critical += 1
      else if (p.riskLevel === 'high') high += 1
      else if (p.riskLevel === 'medium') medium += 1
      else low += 1
    })

    return {
      projectsCount: filteredProjects.length,
      totalSanctioned: sanctioned,
      totalDisbursed: disbursed,
      totalSpent: spent,
      flaggedCount: flagged,
      riskCounts: {
        all: filteredProjects.length,
        critical,
        high,
        medium,
        low,
      },
    }
  }, [filteredProjects])

  // 8. Client-Side CSV Export
  const handleExportCsv = useCallback(() => {
    const headers = [
      'Work ID',
      'Project',
      'State',
      'District',
      'Constituency',
      'MP',
      'Category',
      'Vendor',
      'Implementing Agency',
      'Risk',
      'Risk Score',
      'Recommended',
      'Sanctioned',
      'Disbursed',
      'Spent',
      'Status',
      'Delay',
      'Primary Anomaly',
    ]

    const rows = sortedProjects.map((p) => [
      `"${p.workCode}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      `"${p.constituency}"`,
      `"${p.mpName} (${p.mpHouse})"`,
      `"${p.category}"`,
      `"${p.vendor}"`,
      `"${p.agency}"`,
      p.riskLevel.toUpperCase(),
      p.riskScore,
      `"${p.timeline?.recommended || ''}"`,
      p.sanctionedAmount,
      p.disbursedAmount,
      p.spentAmount,
      `"${p.status}"`,
      `"${p.agingDisplay}"`,
      `"${p.primaryAnomaly.replace(/"/g, '""')}"`,
    ])

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `MPLADS_Projects_Ledger_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [sortedProjects])

  // Active filters summary string for empty state
  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = []
    if (searchQuery) parts.push(`Query: "${searchQuery}"`)
    if (filters.state && filters.state !== 'All') parts.push(`State: ${filters.state}`)
    if (filters.district && filters.district !== 'All') parts.push(`District: ${filters.district}`)
    if (filters.riskSeverity && filters.riskSeverity !== 'All') parts.push(`Risk: ${filters.riskSeverity}`)
    if (filters.amountRange && filters.amountRange !== 'All') parts.push(`Range: ${filters.amountRange}`)
    if (filters.projectStatus && filters.projectStatus !== 'All') parts.push(`Status: ${filters.projectStatus}`)
    return parts.join(' | ')
  }, [searchQuery, filters])

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-8 px-4 space-y-3">
      {/* 1. Page Header & Top Readout Strip */}
      <ProjectLedgerHeader
        totalMonitored={overallMetrics.totalMonitored}
        totalFlagged={overallMetrics.totalFlagged}
        totalSanctionedCr={overallMetrics.totalSanctionedCr}
        totalDisbursedCr={overallMetrics.totalDisbursedCr}
        lastSyncText="SYNCED 8 MIN AGO"
        density={density}
        onToggleDensity={handleToggleDensity}
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Global Search Field */}
      <ProjectLedgerSearch
        value={searchQuery}
        onChange={(q) => {
          setSearchQuery(q)
          setCurrentPage(1)
        }}
        onClear={() => setSearchQuery('')}
        totalMatches={searchQuery ? filteredProjects.length : undefined}
      />

      {/* 3. Combinable Filter Bar */}
      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Quick Risk Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <QuickRiskFilter
          selectedRisk={quickRisk}
          onSelectRisk={handleQuickRiskSelect}
          counts={filteredSummary.riskCounts}
        />
      </div>

      {/* 5. Filtered Data Summary Strip (Projects, Sanctioned, Disbursed, Spent, Flagged) */}
      <ProjectSummaryStrip
        projectsCount={filteredSummary.projectsCount}
        totalSanctioned={filteredSummary.totalSanctioned}
        totalDisbursed={filteredSummary.totalDisbursed}
        totalSpent={filteredSummary.totalSpent}
        flaggedCount={filteredSummary.flaggedCount}
      />

      {/* 6. Risk Distribution Visualization */}
      <RiskDistribution
        critical={filteredSummary.riskCounts.critical}
        high={filteredSummary.riskCounts.high}
        medium={filteredSummary.riskCounts.medium}
        low={filteredSummary.riskCounts.low}
        total={filteredSummary.projectsCount}
      />

      {/* 7. Main Project Ledger Table & Pagination */}
      <div className="space-y-0">
        <ProjectsTable
          projects={paginatedProjects}
          selectedProjectId={selectedProject?.id}
          sortField={sortField}
          sortDirection={sortDirection}
          density={density}
          isLoading={isRefreshing}
          onSelectProject={handleOpenDrawer}
          onInvestigate={handleInvestigate}
          onSort={handleSort}
          onClearFilters={handleResetFilters}
          activeFiltersSummary={activeFiltersSummary}
        />

        <ProjectPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={sortedProjects.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[25, 50, 100]}
        />
      </div>

      {/* 8. Forensic Dossier Slide-Over Drawer (Reusing existing component) */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default ProjectsPage
