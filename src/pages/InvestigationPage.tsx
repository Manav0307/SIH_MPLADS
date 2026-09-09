import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  InvestigationHeader,
  InvestigationFilters,
  initialInvestigationFilterState,
  AnomalyClusterList,
  InvestigationResults,
  EvidencePanel,
} from '@/components/investigation'
import { ProjectDossierDrawer } from '@/components/dossier'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import { findCaseForProject } from '@/lib/caseRegistry'
import {
  mockProjects,
  mockAnomalyClusters,
  mockVendors,
  initialInvestigationNotes,
} from '@/data'
import {
  ProjectRecord,
  AnomalyCluster,
  InvestigationFilterState,
  InvestigationNote,
} from '@/types'

export const InvestigationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const targetId = searchParams.get('project') || searchParams.get('projectId') || searchParams.get('workCode')
  const initialSearch = searchParams.get('search') || searchParams.get('q') || ''

  // Global filter state for investigation
  const [filters, setFilters] = useState<InvestigationFilterState>(() => ({
    ...initialInvestigationFilterState,
    searchQuery: initialSearch,
    vendor: searchParams.get('vendor') || initialInvestigationFilterState.vendor,
    agency: searchParams.get('agency') || initialInvestigationFilterState.agency,
    state: searchParams.get('state') || initialInvestigationFilterState.state,
    mp: searchParams.get('mp') || initialInvestigationFilterState.mp,
  }))

  // Selected project for Evidence & Explainability panel
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(() => {
    if (targetId) {
      const match = mockProjects.find((p) => p.id === targetId || p.workCode === targetId)
      if (match) return match
    }
    return mockProjects[0] || null
  })

  // Synchronize target project dynamically when URL targetId changes
  React.useEffect(() => {
    if (targetId) {
      const match = mockProjects.find(
        (p) =>
          p.id.toLowerCase() === targetId.toLowerCase() ||
          p.workCode.toLowerCase() === targetId.toLowerCase()
      )
      if (match) setSelectedProject(match)
    }
  }, [targetId])

  // Synchronize filters when URL params change
  React.useEffect(() => {
    const v = searchParams.get('vendor')
    const a = searchParams.get('agency')
    const st = searchParams.get('state')
    const m = searchParams.get('mp')
    const q = searchParams.get('search') || searchParams.get('q')
    if (v || a || st || m || q) {
      setFilters((prev) => ({
        ...prev,
        vendor: v || prev.vendor,
        agency: a || prev.agency,
        state: st || prev.state,
        mp: m || prev.mp,
        searchQuery: q !== null && q !== undefined ? q : prev.searchQuery,
      }))
    }
  }, [searchParams])

  // Selected anomaly cluster
  const [selectedCluster, setSelectedCluster] = useState<AnomalyCluster | null>(mockAnomalyClusters[0] || null)

  // Dossier slide-over state (REUSING ProjectDossierDrawer)
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false)
  const [dossierProject, setDossierProject] = useState<ProjectRecord | null>(null)

  // Local investigation notes state
  const [notes, setNotes] = useState<InvestigationNote[]>(initialInvestigationNotes)

  // Search query sync
  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }))
  }

  // Filter change handler
  const handleFilterChange = (key: keyof InvestigationFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters(initialInvestigationFilterState)
    setSelectedCluster(null)
  }

  // Handle cluster selection
  const handleSelectCluster = (cluster: AnomalyCluster) => {
    if (selectedCluster?.id === cluster.id) {
      // Toggle off if already selected
      setSelectedCluster(null)
    } else {
      setSelectedCluster(cluster)
      // Pick first project of this cluster if available
      const firstClusterProj = mockProjects.find((p) =>
        cluster.relatedProjectIds.includes(p.id)
      )
      if (firstClusterProj) {
        setSelectedProject(firstClusterProj)
      }
    }
  }

  // Handle project selection
  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProject(project)
  }

  // Handle opening statutory dossier
  const handleOpenDossier = (project: ProjectRecord) => {
    setDossierProject(project)
    setIsDossierOpen(true)
  }

  // Handle adding notes
  const handleAddNote = (content: string) => {
    const targetId = selectedProject?.id || selectedCluster?.id || 'general'
    const newNote: InvestigationNote = {
      id: `note-${Date.now()}`,
      targetId,
      author: 'Principal Auditor (MoSPI Cell)',
      timestamp: 'Just now',
      content,
    }
    setNotes((prev) => [newNote, ...prev])
  }

  // Handle clearing notes
  const handleClearNotes = () => {
    if (confirm('Clear all local audit observations for this case?')) {
      const targetId = selectedProject?.id || selectedCluster?.id
      if (targetId) {
        setNotes((prev) => prev.filter((n) => n.targetId !== targetId))
      } else {
        setNotes([])
      }
    }
  }

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      // If a cluster is selected, optionally prioritize or restrict to cluster projects
      if (selectedCluster && selectedCluster.relatedProjectIds.length > 0) {
        if (!selectedCluster.relatedProjectIds.includes(p.id)) {
          // If other strict filters are not set, allow viewing all or filter to cluster
          // Keeping it within cluster projects when cluster is active
          return false
        }
      }

      // State
      if (filters.state && filters.state !== 'All' && p.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false
      }

      // District
      if (filters.district && filters.district !== 'All' && !p.district.toLowerCase().includes(filters.district.toLowerCase())) {
        return false
      }

      // Constituency
      if (filters.constituency && filters.constituency !== 'All' && !p.constituency.toLowerCase().includes(filters.constituency.toLowerCase())) {
        return false
      }

      // MP
      if (filters.mp && filters.mp !== 'All' && p.mpName.toLowerCase() !== filters.mp.toLowerCase()) {
        return false
      }

      // Risk Level
      if (filters.riskLevel && filters.riskLevel !== 'All') {
        if (p.riskLevel.toLowerCase() !== filters.riskLevel.toLowerCase()) {
          return false
        }
      }

      // Work Category
      if (filters.category && filters.category !== 'All' && !p.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }

      // Vendor
      if (filters.vendor && filters.vendor !== 'All' && !p.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) {
        return false
      }

      // Implementing Agency
      if (filters.agency && filters.agency !== 'All' && !p.agency.toLowerCase().includes(filters.agency.toLowerCase())) {
        return false
      }

      // Anomaly Type
      if (filters.anomalyType && filters.anomalyType !== 'All') {
        if (!p.primaryAnomaly.toLowerCase().includes(filters.anomalyType.toLowerCase())) {
          return false
        }
      }

      // Financial Year
      if (filters.financialYear && filters.financialYear !== 'All') {
        if (filters.financialYear === 'FY 2025–26' && !p.workCode.includes('25-26')) return false
        if (filters.financialYear === 'FY 2024–25' && !p.workCode.includes('24-25')) return false
        if (filters.financialYear === 'FY 2023–24' && !p.workCode.includes('23-24')) return false
      }

      // Project Status
      if (filters.projectStatus && filters.projectStatus !== 'All' && p.status !== filters.projectStatus) {
        return false
      }

      // Text search query
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim()
        const match =
          p.workCode.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.mpName.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.primaryAnomaly.toLowerCase().includes(q)

        if (!match) return false
      }

      return true
    })
  }, [filters, selectedCluster])

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-6">
      {/* 1. INVESTIGATION HEADER */}
      <InvestigationHeader
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        activeInvestigationsCount={18}
        totalFlaggedSummons={6}
      />

      {/* Global Investigation Context Breadcrumbs */}
      {selectedProject && (
        <div className="px-4 pt-2">
          <InvestigationBreadcrumbs
            caseId={findCaseForProject(selectedProject.id)?.id}
            caseTitle={findCaseForProject(selectedProject.id)?.projectTitle}
            anomalyTitle={selectedProject.primaryAnomaly}
            projectWorkCode={selectedProject.workCode}
            projectTitle={selectedProject.title}
            vendorName={selectedProject.vendor}
            agencyName={selectedProject.agency}
            mpName={selectedProject.mpName}
          />
        </div>
      )}

      {/* 2. THREE-PANEL FORENSIC WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 px-4 pt-3 items-start">
        {/* LEFT PANEL: Filters & Entity Explorer (Col 3 on xl) */}
        <div className="xl:col-span-3 sticky top-16">
          <InvestigationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalRecordsCount={mockProjects.length}
            filteredRecordsCount={filteredProjects.length}
          />
        </div>

        {/* CENTER PANEL: Detected Clusters + Investigation Results Ledger (Col 5 on xl) */}
        <div className="xl:col-span-5 space-y-3">
          {/* Anomaly Clusters */}
          <AnomalyClusterList
            clusters={mockAnomalyClusters}
            selectedClusterId={selectedCluster?.id}
            onSelectCluster={handleSelectCluster}
          />

          {/* Investigation Results Ledger */}
          <InvestigationResults
            projects={filteredProjects}
            selectedProjectId={selectedProject?.id}
            onSelectProject={handleSelectProject}
            onOpenDossier={handleOpenDossier}
          />
        </div>

        {/* RIGHT PANEL: Evidence & Explainability (Col 4 on xl) */}
        <div className="xl:col-span-4 sticky top-16">
          <EvidencePanel
            selectedProject={selectedProject}
            selectedCluster={selectedCluster}
            allProjects={mockProjects}
            allVendors={mockVendors}
            notes={notes}
            onAddNote={handleAddNote}
            onClearNotes={handleClearNotes}
            onOpenDossier={handleOpenDossier}
            onSelectProject={handleSelectProject}
          />
        </div>
      </div>

      {/* 3. STATUTORY PROJECT DOSSIER DRAWER (REUSING EXISTING COMPONENT) */}
      <ProjectDossierDrawer
        project={dossierProject}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  )
}

export default InvestigationPage
