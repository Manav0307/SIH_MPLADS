import React, { useState, useMemo } from 'react'
import {
  PipelineStrip,
  FilterBar,
  initialFilterState,
  KpiGrid,
  CriticalProjectsTable,
} from '@/components/dashboard'
import { LiveAnomalyFeed } from '@/components/feed'
import {
  AnomalyMap,
  MapLayerControls,
  RegionLeaderboard,
  MapLayerType,
} from '@/components/geospatial'
import {
  LifespanFunnel,
  AgingMatrix,
  CostBenchmarkScatter,
} from '@/components/analytics'
import { VendorRiskTable } from '@/components/vendors'
import { ProjectDossierDrawer } from '@/components/dossier'
import {
  mockDashboardKpis,
  mockProjects,
  mockAnomalies,
  mockVendors,
  mockStateAnomalies,
  mockLifespanStages,
  mockAgingBuckets,
  mockScatterBenchmarkData,
} from '@/data'
import {
  ProjectRecord,
  AnomalyFeedItem,
  VendorRecord,
  FilterState,
  ScatterBenchmarkPoint,
} from '@/types'

export const OverviewPage: React.FC = () => {
  // Global filter state
  const [filters, setFilters] = useState<FilterState>(initialFilterState)

  // Map layer toggle
  const [activeMapLayer, setActiveMapLayer] = useState<MapLayerType>('risk')

  // Selected project for dossier slide-over drawer
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Selected vendor
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(undefined)

  // Filter change handler
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(initialFilterState)
    setSelectedVendorId(undefined)
  }

  // Open drawer with specific project
  const handleOpenProjectDossier = (project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  // Open drawer from anomaly feed item
  const handleSelectAnomalyFeed = (feedItem: AnomalyFeedItem) => {
    const matched = mockProjects.find(
      (p) => p.workCode === feedItem.workId || p.id === feedItem.projectId
    )
    if (matched) {
      handleOpenProjectDossier(matched)
    } else if (mockProjects[0]) {
      // Fallback
      handleOpenProjectDossier(mockProjects[0])
    }
  }

  // Open drawer from scatter plot point
  const handleSelectScatterPoint = (point: ScatterBenchmarkPoint) => {
    const matched = mockProjects.find(
      (p) => p.workCode === point.workCode || p.id === point.id
    )
    if (matched) {
      handleOpenProjectDossier(matched)
    }
  }

  // Select state from map or leaderboard
  const handleSelectState = (stateName: string) => {
    handleFilterChange('state', stateName)
  }

  // Select vendor
  const handleSelectVendor = (vendor: VendorRecord) => {
    setSelectedVendorId(vendor.id)
    handleFilterChange('vendor', vendor.name)
  }

  // Export intelligence briefing
  const handleExportBriefing = () => {
    alert(
      'Generating Consolidated MPLADS Sovereign Intelligence Briefing (PDF Dossier) for National Audit Command...'
    )
  }

  // Escalate batch
  const handleEscalateBatch = () => {
    alert('Statutory escalation batch dispatched for 16,079 prolonged sanction works to MoSPI Audit Cell.')
  }

  // Filtered projects based on active global filters
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      // State filter
      if (
        filters.state &&
        filters.state !== 'All States (25)' &&
        filters.state !== 'All' &&
        p.state.toLowerCase() !== filters.state.toLowerCase()
      ) {
        return false
      }

      // District filter
      if (
        filters.district &&
        filters.district !== 'All (36)' &&
        filters.district !== 'All' &&
        !p.district.toLowerCase().includes(filters.district.toLowerCase())
      ) {
        return false
      }

      // Constituency filter
      if (
        filters.constituency &&
        filters.constituency !== 'All' &&
        !p.constituency.toLowerCase().includes(filters.constituency.toLowerCase())
      ) {
        return false
      }

      // MP filter
      if (
        filters.mp &&
        filters.mp !== 'All Electors' &&
        filters.mp !== 'All' &&
        p.mpName.toLowerCase() !== filters.mp.toLowerCase()
      ) {
        return false
      }

      // Category filter
      if (
        filters.category &&
        filters.category !== 'All Categories' &&
        filters.category !== 'All' &&
        !p.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false
      }

      // Vendor filter
      if (
        filters.vendor &&
        filters.vendor !== 'All Listed' &&
        filters.vendor !== 'All' &&
        !p.vendor.toLowerCase().includes(filters.vendor.toLowerCase())
      ) {
        return false
      }

      // Agency filter
      if (
        filters.agency &&
        filters.agency !== 'All Agencies' &&
        filters.agency !== 'All' &&
        !p.agency.toLowerCase().includes(filters.agency.toLowerCase())
      ) {
        return false
      }

      // Risk severity filter
      if (
        filters.riskSeverity &&
        filters.riskSeverity !== 'All Risk Profiles' &&
        filters.riskSeverity !== 'All'
      ) {
        if (filters.riskSeverity === 'Critical & High') {
          if (p.riskLevel !== 'critical' && p.riskLevel !== 'high') return false
        } else if (filters.riskSeverity === 'Critical Only (>90)') {
          if (p.riskScore <= 90) return false
        } else if (filters.riskSeverity === 'High Only (75-90)') {
          if (p.riskScore < 75 || p.riskScore > 90) return false
        } else if (filters.riskSeverity === 'Medium/Low') {
          if (p.riskLevel !== 'medium' && p.riskLevel !== 'low') return false
        }
      }

      // Amount range filter
      if (
        filters.amountRange &&
        filters.amountRange !== 'All Ranges' &&
        filters.amountRange !== 'All'
      ) {
        if (filters.amountRange === '< ₹25L') {
          if (p.sanctionedAmount >= 2500000) return false
        } else if (filters.amountRange === '₹25L - ₹50L') {
          if (p.sanctionedAmount < 2500000 || p.sanctionedAmount > 5000000) return false
        } else if (filters.amountRange === '₹50L - ₹1Cr') {
          if (p.sanctionedAmount < 5000000 || p.sanctionedAmount > 10000000) return false
        } else if (filters.amountRange === '₹1Cr - ₹5Cr') {
          if (p.sanctionedAmount < 10000000 || p.sanctionedAmount > 50000000) return false
        } else if (filters.amountRange === '> ₹5Cr') {
          if (p.sanctionedAmount <= 50000000) return false
        }
      }

      // Status filter
      if (
        filters.projectStatus &&
        filters.projectStatus !== 'All Statuses' &&
        filters.projectStatus !== 'All' &&
        p.status.toLowerCase() !== filters.projectStatus.toLowerCase()
      ) {
        return false
      }

      return true
    })
  }, [filters])

  // Filtered anomalies feed
  const filteredAnomalies = useMemo(() => {
    return mockAnomalies.filter((a) => {
      if (
        filters.state &&
        filters.state !== 'All States (25)' &&
        filters.state !== 'All' &&
        a.state.toLowerCase() !== filters.state.toLowerCase()
      ) {
        return false
      }
      if (
        filters.riskSeverity &&
        filters.riskSeverity !== 'All Risk Profiles' &&
        filters.riskSeverity !== 'All'
      ) {
        if (filters.riskSeverity === 'Critical & High') {
          if (a.severity !== 'critical' && a.severity !== 'high') return false
        } else if (filters.riskSeverity === 'Critical Only (>90)') {
          if (a.riskScore <= 90) return false
        } else if (filters.riskSeverity === 'High Only (75-90)') {
          if (a.riskScore < 75 || a.riskScore > 90) return false
        }
      }
      return true
    })
  }, [filters])

  // Active state name for map highlight
  const selectedStateName =
    filters.state && filters.state !== 'All States (25)' && filters.state !== 'All'
      ? filters.state
      : undefined

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-6">
      {/* 1. HEADER, PIPELINE STRIP & FILTER BAR */}
      <div className="px-4">
        <PipelineStrip
          selectedFy={filters.financialYear}
          onSelectFy={(fy) => handleFilterChange('financialYear', fy)}
          onExportBriefing={handleExportBriefing}
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 2. ROW 1: KPI STRIP (4 Data-Dense Cards) */}
      <div className="px-4">
        <KpiGrid kpis={mockDashboardKpis} />
      </div>

      {/* 3. ROW 2: CRITICAL PROJECTS TABLE + LIVE ANOMALY FEED */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 px-4 pb-3">
        {/* Projects Table (Col 8) */}
        <div className="xl:col-span-8">
          <CriticalProjectsTable
            projects={filteredProjects}
            onSelectProject={handleOpenProjectDossier}
            selectedProjectId={selectedProject?.id}
          />
        </div>

        {/* Live Anomaly Feed (Col 4) */}
        <div className="xl:col-span-4">
          <LiveAnomalyFeed
            anomalies={filteredAnomalies}
            onSelectAnomaly={handleSelectAnomalyFeed}
          />
        </div>
      </div>

      {/* 4. ROW 3: GEOSPATIAL MAP + LIFESPAN FUNNEL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 px-4 pb-3">
        {/* Geospatial Intelligence (Col 7) */}
        <div className="xl:col-span-7 bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col overflow-hidden">
          <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
                Geospatial Anomaly Intelligence
              </h2>
            </div>
            <MapLayerControls
              activeLayer={activeMapLayer}
              onSelectLayer={setActiveMapLayer}
            />
          </div>

          <div className="p-3 flex flex-col lg:flex-row gap-3">
            <AnomalyMap
              states={mockStateAnomalies}
              selectedState={selectedStateName}
              activeLayer={activeMapLayer}
              onSelectState={handleSelectState}
            />
            <RegionLeaderboard
              states={mockStateAnomalies}
              selectedState={selectedStateName}
              onSelectState={handleSelectState}
              onOpenGisModule={() => {
                window.location.href = '/geospatial'
              }}
            />
          </div>
        </div>

        {/* Project Lifespan & Aging Funnel (Col 5) */}
        <div className="xl:col-span-5 bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col justify-between overflow-hidden">
          <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
                Project Lifespan &amp; Aging Funnel
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#9AA5C1]">Pipeline Attrition</span>
          </div>

          <div className="p-3 flex flex-col justify-between gap-3 flex-1">
            <LifespanFunnel stages={mockLifespanStages} />
            <AgingMatrix
              buckets={mockAgingBuckets}
              onEscalateBatch={handleEscalateBatch}
            />
          </div>
        </div>
      </div>

      {/* 5. ROW 4: VENDOR RISK & SCATTER PLOT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 px-4">
        {/* Vendor Risk Intelligence (Col 6) */}
        <div className="xl:col-span-6">
          <VendorRiskTable
            vendors={mockVendors}
            onSelectVendor={handleSelectVendor}
            selectedVendorId={selectedVendorId}
          />
        </div>

        {/* Cost vs Benchmark Scatter Analysis (Col 6) */}
        <div className="xl:col-span-6">
          <CostBenchmarkScatter
            data={mockScatterBenchmarkData}
            onSelectPoint={handleSelectScatterPoint}
          />
        </div>
      </div>

      {/* 6. FORENSIC INSPECTION DOSSIER (SLIDE-OVER DRAWER) */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default OverviewPage
