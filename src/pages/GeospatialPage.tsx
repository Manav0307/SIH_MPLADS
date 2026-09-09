import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  mockStateAnomalies,
  mockProjects,
  mockVendors,
} from '@/data'
import {
  ProjectRecord,
  StateAnomalyRecord,
} from '@/types'
import {
  GisWorkspaceMap,
  RegionAuditPanel,
  GisFilterBar,
  GisFilterState,
  initialGisFilterState,
  MapLayerType,
} from '@/components/geospatial'
import { ProjectDossierDrawer } from '@/components/dossier'
import { StatusPill } from '@/components/common/StatusPill'
import {
  Layers,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'

export const GeospatialPage: React.FC = () => {
  const [searchParams] = useSearchParams()

  // 1. Layer Selection State
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('risk')

  // 2. Filter State
  const [filters, setFilters] = useState<GisFilterState>(initialGisFilterState)

  // 3. Selected State / Region State
  const [selectedStateName, setSelectedStateName] = useState<string | undefined>(undefined)

  // 4. Project Dossier Drawer State
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Reactively synchronize URL query parameters
  useEffect(() => {
    const stateParam = searchParams.get('state')
    const districtParam = searchParams.get('district')
    const projectParam = searchParams.get('project') || searchParams.get('id') || searchParams.get('workCode')

    if (stateParam) {
      const match = mockStateAnomalies.find(
        (s) =>
          s.name.toLowerCase() === stateParam.toLowerCase() ||
          s.code.toLowerCase() === stateParam.toLowerCase()
      )
      if (match) {
        setSelectedStateName(match.name)
        setFilters((prev) => ({
          ...prev,
          state: match.name,
          district: districtParam || 'All',
        }))
      }
    }

    if (projectParam) {
      const targetProj = mockProjects.find(
        (p) =>
          p.id.toLowerCase() === projectParam.toLowerCase() ||
          p.workCode.toLowerCase() === projectParam.toLowerCase()
      )
      if (targetProj) {
        setSelectedProject(targetProj)
        setIsDrawerOpen(true)
        if (!stateParam) {
          setSelectedStateName(targetProj.state)
          setFilters((prev) => ({
            ...prev,
            state: targetProj.state,
            district: targetProj.district,
          }))
        }
      }
    }
  }, [searchParams])

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof GisFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))

    // If state filter changed to a specific state, synchronize selectedStateName
    if (key === 'state') {
      if (value === 'All') {
        setSelectedStateName(undefined)
      } else {
        setSelectedStateName(value)
      }
    }
  }, [])

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    setFilters(initialGisFilterState)
    setSelectedStateName(undefined)
  }, [])

  // Handle state selection from map marker or panel
  const handleSelectState = useCallback((stateName: string) => {
    setSelectedStateName(stateName)
    // If the state filter is not already set to this, update it
    setFilters((prev) => ({
      ...prev,
      state: stateName,
      district: 'All',
      constituency: 'All',
    }))
  }, [])

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedStateName(undefined)
    setFilters((prev) => ({
      ...prev,
      state: 'All',
      district: 'All',
      constituency: 'All',
    }))
  }, [])

  // Handle opening Project Dossier Drawer
  const handleOpenProjectDossier = useCallback((project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }, [])

  // Filtered projects based on active filters
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase()
        const matchesQuery =
          p.title.toLowerCase().includes(query) ||
          p.workCode.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query) ||
          p.district.toLowerCase().includes(query) ||
          p.constituency.toLowerCase().includes(query) ||
          p.vendor.toLowerCase().includes(query)

        if (!matchesQuery) return false
      }

      // State filter
      if (
        filters.state &&
        filters.state !== 'All' &&
        p.state.toLowerCase() !== filters.state.toLowerCase()
      ) {
        return false
      }

      // District filter
      if (
        filters.district &&
        filters.district !== 'All' &&
        p.district.toLowerCase() !== filters.district.toLowerCase()
      ) {
        return false
      }

      // Constituency filter
      if (
        filters.constituency &&
        filters.constituency !== 'All' &&
        p.constituency.toLowerCase() !== filters.constituency.toLowerCase()
      ) {
        return false
      }

      // Risk level filter
      if (filters.riskSeverity && filters.riskSeverity !== 'All') {
        if (filters.riskSeverity === 'critical' && p.riskScore <= 90) return false
        if (filters.riskSeverity === 'high' && (p.riskScore < 75 || p.riskScore > 90)) return false
        if (filters.riskSeverity === 'medium' && (p.riskScore < 50 || p.riskScore >= 75)) return false
        if (filters.riskSeverity === 'low' && p.riskScore >= 50) return false
      }

      // Category filter
      if (
        filters.category &&
        filters.category !== 'All' &&
        !p.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [filters])

  // Filtered states for the map
  const visibleStates = useMemo(() => {
    return mockStateAnomalies.filter((st) => {
      // If search query matches state
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase()
        const matches =
          st.name.toLowerCase().includes(q) ||
          st.code.toLowerCase().includes(q) ||
          filteredProjects.some((p) => p.state.toLowerCase() === st.name.toLowerCase())
        if (!matches) return false
      }

      // If state filter is active
      if (
        filters.state &&
        filters.state !== 'All' &&
        st.name.toLowerCase() !== filters.state.toLowerCase()
      ) {
        return false
      }

      // Risk level filter
      if (filters.riskSeverity && filters.riskSeverity !== 'All') {
        if (filters.riskSeverity === 'critical' && st.anomalyRate < 15) return false
        if (filters.riskSeverity === 'high' && (st.anomalyRate < 10 || st.anomalyRate >= 15))
          return false
        if (filters.riskSeverity === 'medium' && (st.anomalyRate < 5 || st.anomalyRate >= 10))
          return false
        if (filters.riskSeverity === 'low' && st.anomalyRate >= 5) return false
      }

      return true
    })
  }, [filters, filteredProjects])

  // Currently selected StateAnomalyRecord object
  const activeSelectedStateRecord = useMemo<StateAnomalyRecord | null>(() => {
    if (!selectedStateName) return null
    return (
      mockStateAnomalies.find(
        (s) => s.name.toLowerCase() === selectedStateName.toLowerCase()
      ) || null
    )
  }, [selectedStateName])

  // Aggregate KPI telemetry
  const totalMonitoredStates = mockStateAnomalies.length
  const criticalHotspotsCount = mockStateAnomalies.filter((s) => s.riskLevel === 'critical').length
  const totalDiscrepancyCr = mockStateAnomalies.reduce((acc, curr) => acc + curr.discrepancyCr, 0)
  const totalDuplicateGpsClusters = mockStateAnomalies.reduce(
    (acc, curr) => acc + curr.duplicateGpsCount,
    0
  )

  return (
    <div className="flex-1 flex flex-col gap-3 px-4 py-2 select-none">
      {/* Top Workspace Header & KPI Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#232D47] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Geospatial Intelligence &amp; GIS Workspace
            </h1>
            <StatusPill label="STAGE 1 OPERATIONAL" variant="synced" />
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#161F36] border border-[#232D47] font-mono text-[10px] text-[#9AA5C1]">
              LEAFLET ENGINE v1.9.4
            </span>
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            Interactive multi-layered spatial audit, thermal anomaly clustering, and verified state centroid projections across India.
          </p>
        </div>

        {/* Quick KPI readout chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] font-mono text-xs">
            <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="text-[#9AA5C1]">Monitored:</span>
            <strong className="text-[#E7EBF5]">{totalMonitoredStates} States</strong>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] font-mono text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-[#9AA5C1]">Critical States:</span>
            <strong className="text-[#EF4444]">{criticalHotspotsCount}</strong>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] font-mono text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[#9AA5C1]">Discrepancy:</span>
            <strong className="text-[#F59E0B]">₹{totalDiscrepancyCr.toFixed(1)} Cr</strong>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10182B] border border-[#232D47] font-mono text-xs">
            <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="text-[#9AA5C1]">GPS Overlaps:</span>
            <strong className="text-[#3B82F6]">{totalDuplicateGpsClusters}</strong>
          </div>
        </div>
      </div>

      {/* Forensic Filter & Query Toolbar */}
      <GisFilterBar
        filters={filters}
        states={mockStateAnomalies}
        projects={mockProjects}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Workspace Layout (Left: Leaflet GIS Map, Right: Region Audit Panel) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Central Map Canvas */}
        <div className="flex-1 min-w-0 flex flex-col">
          <GisWorkspaceMap
            states={visibleStates}
            projects={filteredProjects}
            selectedState={selectedStateName}
            activeLayer={activeLayer}
            viewMode={filters.viewMode}
            onSelectState={handleSelectState}
            onSelectLayer={setActiveLayer}
            onOpenProjectDossier={handleOpenProjectDossier}
          />
        </div>

        {/* Right Forensic Inspection Drawer / Panel */}
        <RegionAuditPanel
          selectedState={activeSelectedStateRecord}
          allStates={mockStateAnomalies}
          projects={filteredProjects}
          vendors={mockVendors}
          onSelectState={handleSelectState}
          onOpenProjectDossier={handleOpenProjectDossier}
          onClearSelection={handleClearSelection}
        />
      </div>

      {/* Project Dossier Slide-Over Drawer */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
