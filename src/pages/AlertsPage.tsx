import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RefreshCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  Send,
  Clock,
} from 'lucide-react'
import {
  AlertKpiStrip,
  AlertFiltersBar,
  AlertQueueTable,
  AlertQueueCards,
  AlertDetailPanel,
} from '@/components/alerts'
import { ProjectDossierDrawer } from '@/components/dossier'
import { StatusPill } from '@/components/common/StatusPill'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import {
  mockAlerts,
  initialAlertFilterState,
  getAlertsSummaryKpis,
} from '@/data'
import {
  AnomalyAlert,
  AlertFilterState,
  AlertSortField,
  AlertStatus,
  ProjectRecord,
} from '@/types'

export const AlertsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || searchParams.get('q') || ''
  const targetAlertId = searchParams.get('id') || searchParams.get('alertId')

  // 1. Alerts master state (allows interactive status updates)
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(mockAlerts)

  // 2. Filters & search state
  const [filters, setFilters] = useState<AlertFilterState>(() => ({
    ...initialAlertFilterState,
    searchQuery: initialSearch,
  }))

  // 3. Selection & View controls
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(() => {
    if (targetAlertId) {
      const match = mockAlerts.find((a) => a.id === targetAlertId || a.workCode === targetAlertId)
      if (match) return match.id
    }
    return mockAlerts[0]?.id || null
  })

  // Synchronize selection when URL targetAlertId changes
  useEffect(() => {
    if (targetAlertId) {
      const match = alerts.find(
        (a) =>
          a.id.toLowerCase() === targetAlertId.toLowerCase() ||
          a.workCode.toLowerCase() === targetAlertId.toLowerCase() ||
          a.projectId.toLowerCase() === targetAlertId.toLowerCase()
      )
      if (match) {
        setSelectedAlertId(match.id)
      }
    }
  }, [targetAlertId, alerts])

  const [sortField, setSortField] = useState<AlertSortField>('riskScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [density, setDensity] = useState<'standard' | 'dense'>('standard')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // 4. Dossier Drawer Integration
  const [dossierProject, setDossierProject] = useState<ProjectRecord | null>(null)
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false)

  // 5. Toast Feedback Banner
  const [toastMessage, setToastMessage] = useState<{
    text: string
    type: 'review' | 'escalated' | 'resolved' | 'export' | 'info'
  } | null>(null)

  const showToast = (text: string, type: 'review' | 'escalated' | 'resolved' | 'export' | 'info' = 'info') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter change handler
  const handleFilterChange = useCallback((key: keyof AlertFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1)
  }, [])

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    setFilters(initialAlertFilterState)
    setCurrentPage(1)
  }, [])

  // Status workflow transition handler
  const handleUpdateStatus = useCallback((alertId: string, newStatus: AlertStatus) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const updated = { ...a, status: newStatus }
          if (newStatus === 'Escalated') {
            updated.escalatedTo = 'MoSPI Statutory Enforcement Cell'
            updated.escalatedDate = 'Today 14:35 IST'
          } else if (newStatus === 'Resolved') {
            updated.resolvedAt = 'Today 14:35 IST'
            updated.resolvedBy = 'Principal Auditor (MoSPI Cell)'
            updated.resolutionNote =
              'Statutory compliance clearance issued following field measurement verification and treasury reconciliation.'
          }
          return updated
        }
        return a
      })
    )

    if (newStatus === 'Under Review') {
      showToast(`Alert ${alertId} marked Under Review. Assigned to principal audit examiner.`, 'review')
    } else if (newStatus === 'Escalated') {
      showToast(`Alert ${alertId} ESCALATED to MoSPI Statutory Enforcement Cell & CAG Oversight.`, 'escalated')
    } else if (newStatus === 'Resolved') {
      showToast(`Alert ${alertId} successfully marked Resolved with audit closure record.`, 'resolved')
    }
  }, [])

  // Open Dossier handler
  const handleOpenDossier = useCallback((project: ProjectRecord) => {
    setDossierProject(project)
    setIsDossierOpen(true)
  }, [])

  // Export Evidence handler
  const handleExportEvidence = useCallback((alert: AnomalyAlert) => {
    const brief = {
      alertId: alert.id,
      workCode: alert.workCode,
      projectTitle: alert.projectTitle,
      severity: alert.severity.toUpperCase(),
      riskScore: alert.riskScore,
      anomalyType: alert.anomalyType,
      financialImpact: alert.financialImpact,
      state: alert.state,
      district: alert.district,
      constituency: alert.constituency,
      mpName: alert.mpName,
      agency: alert.agency,
      vendor: alert.vendor,
      gstin: alert.vendorGst || 'N/A',
      whyFlagged: alert.whyFlagged,
      recommendedActions: alert.recommendedActionsList.map((a) => a.label),
      generatedAt: new Date().toISOString(),
      statutoryAuthority: 'MoSPI / CAG Sovereign Audit Intelligence',
    }

    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Audit-Evidence-${alert.id}-${alert.workCode.replace(/\//g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast(`Forensic evidence dossier downloaded for ${alert.id} (${alert.workCode}).`, 'export')
  }, [])

  // Quick refresh telemetry handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('Real-time audit telemetry stream refreshed. 0 new anomalies detected in last cycle.', 'info')
    }, 600)
  }

  // Extract unique values for filters
  const uniqueStates = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.state))).sort(), [])
  const uniqueDistricts = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.district))).sort(), [])
  const uniqueConstituencies = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.constituency))).sort(), [])
  const uniqueMps = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.mpName))).sort(), [])
  const uniqueAgencies = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.agency))).sort(), [])
  const uniqueVendors = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.vendor))).sort(), [])
  const uniqueAnomalyTypes = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.anomalyType))).sort(), [])
  const uniqueFys = useMemo(() => Array.from(new Set(mockAlerts.map((a) => a.financialYear))).sort(), [])

  // Filtered and Sorted Alerts
  const filteredAlerts = useMemo(() => {
    const result = alerts.filter((alert) => {
      // State
      if (filters.state !== 'All' && alert.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false
      }
      // District
      if (filters.district !== 'All' && !alert.district.toLowerCase().includes(filters.district.toLowerCase())) {
        return false
      }
      // Constituency
      if (filters.constituency !== 'All' && !alert.constituency.toLowerCase().includes(filters.constituency.toLowerCase())) {
        return false
      }
      // MP
      if (filters.mp !== 'All' && alert.mpName.toLowerCase() !== filters.mp.toLowerCase()) {
        return false
      }
      // Agency
      if (filters.agency !== 'All' && !alert.agency.toLowerCase().includes(filters.agency.toLowerCase())) {
        return false
      }
      // Vendor
      if (filters.vendor !== 'All' && !alert.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) {
        return false
      }
      // Risk Severity
      if (filters.riskSeverity !== 'All' && alert.severity.toLowerCase() !== filters.riskSeverity.toLowerCase()) {
        return false
      }
      // Anomaly Type
      if (filters.anomalyType !== 'All' && !alert.anomalyType.toLowerCase().includes(filters.anomalyType.toLowerCase())) {
        return false
      }
      // Status
      if (filters.status !== 'All' && alert.status !== filters.status) {
        return false
      }
      // Financial Year
      if (filters.financialYear !== 'All' && alert.financialYear !== filters.financialYear) {
        return false
      }
      // Free-text Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim()
        const matches =
          alert.id.toLowerCase().includes(q) ||
          alert.workCode.toLowerCase().includes(q) ||
          alert.projectTitle.toLowerCase().includes(q) ||
          alert.state.toLowerCase().includes(q) ||
          alert.district.toLowerCase().includes(q) ||
          alert.constituency.toLowerCase().includes(q) ||
          alert.mpName.toLowerCase().includes(q) ||
          alert.vendor.toLowerCase().includes(q) ||
          alert.agency.toLowerCase().includes(q) ||
          alert.anomalyType.toLowerCase().includes(q) ||
          alert.whyFlagged.toLowerCase().includes(q)

        if (!matches) return false
      }
      return true
    })

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'riskScore') {
        comparison = a.riskScore - b.riskScore
      } else if (sortField === 'financialImpact') {
        comparison = a.financialImpactNum - b.financialImpactNum
      } else if (sortField === 'createdTime') {
        comparison = a.id.localeCompare(b.id)
      } else if (sortField === 'severity') {
        const order = { critical: 4, high: 3, medium: 2, low: 1 }
        comparison = (order[a.severity] || 0) - (order[b.severity] || 0)
      } else if (sortField === 'status') {
        const order = { New: 4, 'Under Review': 3, Escalated: 2, Resolved: 1 }
        comparison = (order[a.status] || 0) - (order[b.status] || 0)
      } else {
        comparison = a.id.localeCompare(b.id)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [alerts, filters, sortField, sortDirection])

  // Active selected alert object
  const selectedAlert = useMemo(() => {
    return alerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0] || null
  }, [alerts, selectedAlertId, filteredAlerts])

  // KPIs across current master alerts list
  const kpis = useMemo(() => getAlertsSummaryKpis(alerts), [alerts])

  // Sorting header click handler
  const handleSortChange = (field: AlertSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="space-y-3.5 pb-8 select-none text-[#E7EBF5]">
      {/* 1. Page Header & Live Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#232D47] pb-3 pt-2">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Anomaly Alerts & Statutory Incident Management
            </h1>
            <StatusPill
              label={`${kpis.activeCount} ACTIVE INCIDENTS`}
              variant={kpis.criticalCount > 0 ? 'alert' : 'live'}
            />
            <span className="text-[10px] font-mono bg-[#161F36] text-[#adc6ff] px-2 py-0.5 rounded border border-[#232D47]">
              STEP 12 AUDIT TRIAGE
            </span>
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            Real-time telemetry event stream, statistical deviations, and high-priority statutory trigger alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            title="Refresh Telemetry Stream"
            className="h-8 px-2.5 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`} />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'escalated'
              ? 'bg-[#381B47] border-[#C084FC] text-[#E9D5FF]'
              : toastMessage.type === 'resolved'
              ? 'bg-[#0F3020] border-[#4ADE80] text-[#86EFAC]'
              : toastMessage.type === 'review'
              ? 'bg-[#2E280C] border-[#FACC15] text-[#FEF08A]'
              : 'bg-[#10233F] border-[#3B82F6] text-[#BFDBFE]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'escalated' && <Send className="w-4 h-4 text-[#C084FC]" />}
            {toastMessage.type === 'resolved' && <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />}
            {toastMessage.type === 'review' && <Clock className="w-4 h-4 text-[#FACC15]" />}
            {toastMessage.type === 'export' && <Download className="w-4 h-4 text-[#3B82F6]" />}
            {toastMessage.type === 'info' && <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />}
            <span className="font-sans font-medium">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[10px] font-mono uppercase tracking-wider opacity-70 hover:opacity-100 px-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Investigation Lineage Context */}
      {selectedAlert && (
        <InvestigationBreadcrumbs
          findingItem={{ id: selectedAlert.id, title: selectedAlert.anomalyType }}
          projectItem={{ id: selectedAlert.projectId, workCode: selectedAlert.workCode, title: selectedAlert.projectTitle }}
          vendorItem={{ name: selectedAlert.vendor }}
          agencyItem={{ name: selectedAlert.agency }}
          mpItem={{ name: selectedAlert.mpName, constituency: selectedAlert.constituency }}
        />
      )}

      {/* 2. Top Statistics / KPI Strip */}
      <AlertKpiStrip
        kpis={kpis}
        activeSeverityFilter={filters.riskSeverity}
        onSelectSeverityFilter={(sev) => handleFilterChange('riskSeverity', sev)}
        activeStatusFilter={filters.status}
        onSelectStatusFilter={(st) => handleFilterChange('status', st)}
      />

      {/* 3. Search and Multi-Criteria Filter Controls */}
      <AlertFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        uniqueStates={uniqueStates}
        uniqueDistricts={uniqueDistricts}
        uniqueConstituencies={uniqueConstituencies}
        uniqueMps={uniqueMps}
        uniqueAgencies={uniqueAgencies}
        uniqueVendors={uniqueVendors}
        uniqueAnomalyTypes={uniqueAnomalyTypes}
        uniqueFys={uniqueFys}
        totalCount={alerts.length}
        filteredCount={filteredAlerts.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        density={density}
        onDensityChange={setDensity}
      />

      {/* 4. Two-Panel Triage Workspace (Queue + Forensic Explainability Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: Alert Queue List / Table (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-2">
          {viewMode === 'table' ? (
            <AlertQueueTable
              alerts={filteredAlerts}
              selectedAlertId={selectedAlert?.id || null}
              onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
              onUpdateStatus={handleUpdateStatus}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              density={density}
            />
          ) : (
            <AlertQueueCards
              alerts={filteredAlerts}
              selectedAlertId={selectedAlert?.id || null}
              onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
              onUpdateStatus={handleUpdateStatus}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>

        {/* Right Column: Detailed Evidence / Explainability Panel (5 cols on xl, sticky) */}
        <div className="xl:col-span-5 sticky top-16 max-h-[calc(100vh-5rem)]">
          <AlertDetailPanel
            alert={selectedAlert}
            onUpdateStatus={handleUpdateStatus}
            onOpenDossier={handleOpenDossier}
            onExportEvidence={handleExportEvidence}
          />
        </div>
      </div>

      {/* 5. Statutory Project Dossier Drawer (REUSED EXISTING COMPONENT) */}
      <ProjectDossierDrawer
        project={dossierProject}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  )
}

export default AlertsPage
