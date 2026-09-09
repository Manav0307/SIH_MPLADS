import React, { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FolderKanban,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  Columns,
  Maximize2,
} from 'lucide-react'
import {
  CaseSummaryCards,
  CaseFiltersBar,
  CaseQueueTable,
  CaseDetailWorkspace,
  DossierPreviewModal,
  PfmsActionModal,
  AssignOfficerModal,
  AddEvidenceModal,
  ResolveCaseModal,
} from '@/components/cases'
import { ProjectDossierDrawer } from '@/components/dossier'
import {
  auditOfficers,
  initialCaseFilterState,
  getCaseSummaryKpis,
} from '@/data/cases'
import {
  CaseRecord,
  CaseStatus,
  CaseOfficer,
  CaseEvidenceItem,
  CasePfmsAction,
  CaseFilterState,
  CaseSortField,
} from '@/types/cases'
import { ProjectRecord } from '@/types'
import { useCaseRegistry } from '@/lib/caseRegistry'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import { cn } from '@/lib/utils'

export const CasesPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const targetCaseId =
    searchParams.get('id') ||
    searchParams.get('caseId') ||
    searchParams.get('project') ||
    searchParams.get('workCode')

  // 1. Reactive Case Registry State
  const { cases: registryCases } = useCaseRegistry()
  const [cases, setCases] = useState<CaseRecord[]>(registryCases)

  React.useEffect(() => {
    setCases(registryCases)
  }, [registryCases])

  // 2. Filters & Search State
  const [filters, setFilters] = useState<CaseFilterState>(() => ({
    ...initialCaseFilterState,
    searchQuery: searchParams.get('q') || searchParams.get('search') || '',
  }))

  const [sortField, setSortField] = useState<CaseSortField>('riskScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [layoutMode, setLayoutMode] = useState<'split' | 'queue-only'>('split')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 3. Selection State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    if (targetCaseId) {
      const match = cases.find(
        (c) =>
          c.id.toLowerCase() === targetCaseId.toLowerCase() ||
          c.workCode.toLowerCase() === targetCaseId.toLowerCase() ||
          c.projectId.toLowerCase() === targetCaseId.toLowerCase()
      )
      if (match) return match.id
    }
    return cases[0]?.id || 'CASE-2026-001'
  })

  // Synchronize selection dynamically when URL searchParams change
  React.useEffect(() => {
    if (targetCaseId) {
      const match = cases.find(
        (c) =>
          c.id.toLowerCase() === targetCaseId.toLowerCase() ||
          c.workCode.toLowerCase() === targetCaseId.toLowerCase() ||
          c.projectId.toLowerCase() === targetCaseId.toLowerCase()
      )
      if (match) {
        setSelectedCaseId(match.id)
      }
    }
  }, [targetCaseId, cases])

  // 4. Modal States
  const [isDossierPreviewOpen, setIsDossierPreviewOpen] = useState(false)
  const [isPfmsModalOpen, setIsPfmsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false)
  const [projectForDrawer, setProjectForDrawer] = useState<ProjectRecord | null>(null)

  // 5. Toast Feedback Banner State
  const [toastMessage, setToastMessage] = useState<{
    text: string
    type: 'success' | 'warning' | 'info' | 'critical'
  } | null>(null)

  const showToast = useCallback(
    (text: string, type: 'success' | 'warning' | 'info' | 'critical' = 'info') => {
      setToastMessage({ text, type })
      setTimeout(() => setToastMessage(null), 4000)
    },
    []
  )

  // Currently Selected Case Object
  const selectedCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || cases[0] || null
  }, [cases, selectedCaseId])

  // KPI Calculations
  const kpis = useMemo(() => getCaseSummaryKpis(cases), [cases])

  // Extract Unique States for Filter
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(cases.map((c) => c.state))).sort()
  }, [cases])

  // Filter & Sort Logic
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Search Query
        if (filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase().trim()
          const matches =
            c.id.toLowerCase().includes(q) ||
            c.workCode.toLowerCase().includes(q) ||
            c.projectTitle.toLowerCase().includes(q) ||
            c.vendor.toLowerCase().includes(q) ||
            c.agency.toLowerCase().includes(q) ||
            c.assignedOfficer.name.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q)
          if (!matches) return false
        }

        // Status Filter
        if (filters.status !== 'All') {
          if (filters.status === 'Open') {
            if (c.status === 'Resolved') return false
          } else if (c.status.toLowerCase() !== filters.status.toLowerCase()) {
            return false
          }
        }

        // Severity Filter
        if (filters.severity !== 'All') {
          if (c.severity.toLowerCase() !== filters.severity.toLowerCase()) {
            return false
          }
        }

        // Officer Filter
        if (filters.officer !== 'All') {
          if (c.assignedOfficer.name.toLowerCase() !== filters.officer.toLowerCase()) {
            return false
          }
        }

        // State Filter
        if (filters.state !== 'All') {
          if (c.state.toLowerCase() !== filters.state.toLowerCase()) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        let valA: number | string = 0
        let valB: number | string = 0

        switch (sortField) {
          case 'riskScore':
            valA = a.riskScore
            valB = b.riskScore
            break
          case 'financialExposure':
            valA = a.financialExposure
            valB = b.financialExposure
            break
          case 'anomalyCount':
            valA = a.anomalyCount
            valB = b.anomalyCount
            break
          case 'id':
            valA = a.id
            valB = b.id
            break
          case 'lastUpdated':
            valA = a.lastUpdated
            valB = b.lastUpdated
            break
          default:
            valA = a.riskScore
            valB = b.riskScore
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'desc' ? valB - valA : valA - valB
        } else {
          const strA = String(valA).toLowerCase()
          const strB = String(valB).toLowerCase()
          return sortDirection === 'desc'
            ? strB.localeCompare(strA)
            : strA.localeCompare(strB)
        }
      })
  }, [cases, filters, sortField, sortDirection])

  // Handlers for Filters
  const handleFilterChange = (key: keyof CaseFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters(initialCaseFilterState)
  }

  // Status Workflow Transition (Requirement #2 & #5)
  const handleUpdateStatus = useCallback(
    (caseId: string, newStatus: CaseStatus) => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === caseId) {
            const oldStatus = c.status
            if (oldStatus === newStatus) return c

            const newHistory = [
              ...c.statusHistory,
              {
                id: `sh-${caseId}-${Date.now()}`,
                fromStatus: oldStatus,
                toStatus: newStatus,
                changedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
                timestamp: 'Today 15:25 IST',
                remarks: `Status workflow transitioned from ${oldStatus} to ${newStatus}.`,
              },
            ]

            const newTimeline = [
              ...c.timeline,
              {
                id: `tl-${caseId}-${Date.now()}`,
                date: '09 Sep 2026',
                timestamp: 'Today 15:25 IST',
                title: `Case Status Updated to ${newStatus}`,
                description: `Statutory workflow stage transitioned from ${oldStatus} to ${newStatus}.`,
                type: (newStatus === 'Escalated'
                  ? 'escalation'
                  : newStatus === 'Resolved'
                  ? 'resolution'
                  : newStatus === 'Field Verification'
                  ? 'field'
                  : 'system') as any,
                actor: 'Principal Auditor General',
                badgeColor:
                  newStatus === 'Resolved'
                    ? 'text-[#22C55E]'
                    : newStatus === 'Escalated'
                    ? 'text-[#EF4444]'
                    : 'text-[#3B82F6]',
              },
            ]

            return {
              ...c,
              status: newStatus,
              lastUpdated: 'Just now',
              statusHistory: newHistory,
              timeline: newTimeline,
            }
          }
          return c
        })
      )

      showToast(
        `Case ${caseId} workflow transitioned to '${newStatus}'.`,
        newStatus === 'Escalated'
          ? 'critical'
          : newStatus === 'Resolved'
          ? 'success'
          : 'info'
      )
    },
    [showToast]
  )

  // Reassign Officer
  const handleAssignOfficer = useCallback(
    (newOfficer: CaseOfficer, memo: string) => {
      if (!selectedCase) return

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            const newHistory = [
              ...c.statusHistory,
              {
                id: `sh-assign-${Date.now()}`,
                fromStatus: c.status,
                toStatus: c.status,
                changedBy: 'Statutory Allocation Desk',
                timestamp: 'Today 15:26 IST',
                remarks: `Assigned to ${newOfficer.name} (${newOfficer.designation}). Memo: ${memo}`,
              },
            ]

            const newTimeline = [
              ...c.timeline,
              {
                id: `tl-assign-${Date.now()}`,
                date: '09 Sep 2026',
                timestamp: 'Today 15:26 IST',
                title: `Officer Assigned: ${newOfficer.name}`,
                description: memo,
                type: 'officer' as const,
                actor: 'Audit Coordination Cell',
                badgeColor: 'text-[#3B82F6]',
              },
            ]

            return {
              ...c,
              assignedOfficer: newOfficer,
              lastUpdated: 'Just now',
              statusHistory: newHistory,
              timeline: newTimeline,
            }
          }
          return c
        })
      )

      showToast(
        `Case ${selectedCase.id} successfully assigned to ${newOfficer.name}.`,
        'success'
      )
    },
    [selectedCase, showToast]
  )

  // Add Inspection Note
  const handleAddNote = useCallback(
    (content: string) => {
      if (!selectedCase) return

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            const newNote = {
              id: `note-${c.id}-${Date.now()}`,
              targetId: c.projectId,
              author: c.assignedOfficer.name,
              timestamp: 'Today 15:27 IST',
              content,
            }

            return {
              ...c,
              notes: [newNote, ...c.notes],
              lastUpdated: 'Just now',
            }
          }
          return c
        })
      )

      showToast(`Inspection note recorded for Case ${selectedCase.id}.`, 'info')
    },
    [selectedCase, showToast]
  )

  // Toggle Evidence Verification
  const handleToggleEvidenceVerification = useCallback(
    (evidenceId: string) => {
      if (!selectedCase) return

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            const updatedEvidence = c.evidence.map((ev) => {
              if (ev.id === evidenceId) {
                const isNowVerified = ev.verificationStatus !== 'Verified'
                return {
                  ...ev,
                  verificationStatus: isNowVerified
                    ? ('Verified' as const)
                    : ('Pending Review' as const),
                  verifiedBy: isNowVerified
                    ? c.assignedOfficer.name
                    : undefined,
                  verifiedAt: isNowVerified ? 'Today 15:28 IST' : undefined,
                }
              }
              return ev
            })

            return {
              ...c,
              evidence: updatedEvidence,
              lastUpdated: 'Just now',
            }
          }
          return c
        })
      )

      showToast(
        `Evidence verification status updated for Case ${selectedCase.id}.`,
        'info'
      )
    },
    [selectedCase, showToast]
  )

  // Mark All Evidence Verified
  const handleMarkAllEvidenceVerified = useCallback(() => {
    if (!selectedCase) return

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCase.id) {
          const updated = c.evidence.map((ev) => ({
            ...ev,
            verificationStatus: 'Verified' as const,
            verifiedBy: c.assignedOfficer.name,
            verifiedAt: 'Today 15:28 IST',
          }))

          return {
            ...c,
            evidence: updated,
            lastUpdated: 'Just now',
          }
        }
        return c
      })
    )

    showToast(
      `All evidence items for Case ${selectedCase.id} marked as Verified.`,
      'success'
    )
  }, [selectedCase, showToast])

  // Add Custom Evidence
  const handleAddEvidence = useCallback(
    (item: CaseEvidenceItem) => {
      if (!selectedCase) return

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            return {
              ...c,
              evidence: [item, ...c.evidence],
              lastUpdated: 'Just now',
            }
          }
          return c
        })
      )

      showToast(
        `New evidence '${item.title}' appended to Case ${selectedCase.id}.`,
        'success'
      )
    },
    [selectedCase, showToast]
  )

  // Execute PFMS Action
  const handleExecutePfmsAction = useCallback(
    (action: CasePfmsAction) => {
      if (!selectedCase) return

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            const isFreeze = action.actionType !== 'Release Stop-Payment Hold'
            const newTimeline = [
              ...c.timeline,
              {
                id: `tl-pfms-${Date.now()}`,
                date: '09 Sep 2026',
                timestamp: 'Today 15:30 IST',
                title: `PFMS Action: ${action.actionType}`,
                description: action.reason,
                type: 'pfms' as const,
                actor: 'Dr. Rajeshwar Rao, Principal Auditor General',
                badgeColor: isFreeze ? 'text-[#EF4444]' : 'text-[#22C55E]',
              },
            ]

            return {
              ...c,
              pfmsAction: action,
              lastUpdated: 'Just now',
              timeline: newTimeline,
            }
          }
          return c
        })
      )

      showToast(
        action.actionType === 'Release Stop-Payment Hold'
          ? `PFMS Stop-Payment released for ${selectedCase.workCode}.`
          : `PFMS Stop-Payment Order issued for ${selectedCase.workCode} (${action.amountDisplay}).`,
        action.actionType === 'Release Stop-Payment Hold' ? 'success' : 'critical'
      )
    },
    [selectedCase, showToast]
  )

  // Resolve Case
  const handleResolveCase = useCallback(
    (resolutionCategory: string, remarks: string) => {
      if (!selectedCase) return

      handleUpdateStatus(selectedCase.id, 'Resolved')

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCase.id) {
            const newNote = {
              id: `note-resolve-${Date.now()}`,
              targetId: c.projectId,
              author: 'Dr. Rajeshwar Rao, Principal Auditor General',
              timestamp: 'Today 15:31 IST',
              content: `STATUTORY CLOSURE CERTIFICATE [${resolutionCategory}]: ${remarks}`,
            }

            return {
              ...c,
              notes: [newNote, ...c.notes],
            }
          }
          return c
        })
      )

      showToast(
        `Case ${selectedCase.id} successfully resolved and certified.`,
        'success'
      )
    },
    [selectedCase, handleUpdateStatus, showToast]
  )

  // Open Project Dossier Drawer (Existing component)
  const handleOpenProjectDossier = useCallback(
    (c: CaseRecord) => {
      setProjectForDrawer(c.project)
      setIsProjectDrawerOpen(true)
    },
    []
  )

  // Quick Telemetry Refresh
  const handleRefreshTelemetry = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('Live statutory case queue synchronized with Anomaly Engine.', 'info')
    }, 600)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 py-4 space-y-4 max-w-7xl mx-auto w-full select-none">
      {/* 1. Page Header & Control Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232D47]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6] shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#E7EBF5] tracking-tight leading-none">
                Statutory Case Management & Audit Workflow
              </h1>
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10233F] text-[#3B82F6] border border-[#3B82F6]/40">
                SOC v2.4
              </span>
            </div>
            <p className="text-xs text-[#9AA5C1] mt-1 font-sans">
              Tripartite Anomaly Intake • Formal Ground Verification • PFMS Disbursal Control • CAG Sovereign Clearance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle (Split vs Queue Only) */}
          <div className="flex items-center rounded-lg bg-[#10182B] border border-[#232D47] p-0.5">
            <button
              type="button"
              onClick={() => setLayoutMode('split')}
              className={cn(
                'px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer',
                layoutMode === 'split'
                  ? 'bg-[#161F36] text-[#adc6ff] font-semibold'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
              )}
              title="Split Master-Detail View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('queue-only')}
              className={cn(
                'px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer',
                layoutMode === 'queue-only'
                  ? 'bg-[#161F36] text-[#adc6ff] font-semibold'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
              )}
              title="Full Queue Table View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Queue</span>
            </button>
          </div>

          {/* Telemetry Refresh */}
          <button
            type="button"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            className="h-8 px-2.5 rounded bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border border-[#232D47] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-[#3B82F6]')} />
            <span className="hidden sm:inline">Sync SOC</span>
          </button>
        </div>
      </div>

      {/* 2. Toast Notification Banner */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-16 right-6 z-50 p-3 rounded-lg border shadow-xl flex items-center gap-2.5 text-xs font-mono animate-in slide-in-from-top-2 duration-200 select-none max-w-md',
            toastMessage.type === 'success' && 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]/50',
            toastMessage.type === 'critical' && 'bg-[#401515] text-[#EF4444] border-[#EF4444]/60',
            toastMessage.type === 'warning' && 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/50',
            toastMessage.type === 'info' && 'bg-[#10233F] text-[#3B82F6] border-[#3B82F6]/50'
          )}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {toastMessage.type === 'critical' && <AlertOctagon className="w-4 h-4 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 shrink-0" />}
          <span className="leading-snug">{toastMessage.text}</span>
        </div>
      )}

      {/* Investigation Lineage Context */}
      {selectedCase && (
        <InvestigationBreadcrumbs
          caseItem={{ id: selectedCase.id, workCode: selectedCase.workCode, title: selectedCase.projectTitle }}
          projectItem={{ id: selectedCase.projectId, workCode: selectedCase.workCode, title: selectedCase.projectTitle }}
          vendorItem={{ name: selectedCase.vendor }}
          agencyItem={{ name: selectedCase.agency }}
          mpItem={{ name: selectedCase.mpName, constituency: selectedCase.constituency }}
        />
      )}

      {/* 3. Dashboard Summary Cards (Requirement #8) */}
      <CaseSummaryCards
        kpis={kpis}
        activeStatus={filters.status}
        activeSeverity={filters.severity}
        onSelectStatus={(st) => handleFilterChange('status', st)}
        onSelectSeverity={(sev) => handleFilterChange('severity', sev)}
      />

      {/* 4. Filters & Search Bar (Requirement #1) */}
      <CaseFiltersBar
        filters={filters}
        sortField={sortField}
        sortDirection={sortDirection}
        officers={auditOfficers.filter((o) => o.id !== 'off-none')}
        states={uniqueStates}
        totalCases={cases.length}
        filteredCount={filteredCases.length}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onSortChange={setSortField}
        onToggleSortDirection={() =>
          setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))
        }
      />

      {/* 5. Main Workspace Layout */}
      {layoutMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1 min-h-0">
          {/* Left: Case Queue Table (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#9AA5C1]">
              <span>
                ACTIVE QUEUE ({filteredCases.length})
              </span>
              <span className="text-[#667090]">
                Click row to inspect workspace
              </span>
            </div>
            <CaseQueueTable
              cases={filteredCases}
              selectedCaseId={selectedCaseId}
              onSelectCase={(c) => setSelectedCaseId(c.id)}
              onOpenDossier={(c) => handleOpenProjectDossier(c)}
            />
          </div>

          {/* Right: Case Detail Workspace (7 cols on lg) */}
          <div className="lg:col-span-7">
            {selectedCase ? (
              <CaseDetailWorkspace
                caseItem={selectedCase}
                onUpdateStatus={handleUpdateStatus}
                onOpenAssignModal={() => setIsAssignModalOpen(true)}
                onOpenResolveModal={() => setIsResolveModalOpen(true)}
                onOpenPfmsModal={() => setIsPfmsModalOpen(true)}
                onOpenDossierPreview={() => setIsDossierPreviewOpen(true)}
                onOpenProjectDossier={() => handleOpenProjectDossier(selectedCase)}
                onOpenAddEvidenceModal={() => setIsAddEvidenceModalOpen(true)}
                onToggleEvidenceVerification={handleToggleEvidenceVerification}
                onMarkAllEvidenceVerified={handleMarkAllEvidenceVerified}
                onAddNote={handleAddNote}
              />
            ) : (
              <div className="p-12 text-center bg-[#10182B] rounded-lg border border-[#232D47] text-[#9AA5C1]">
                <ShieldAlert className="w-8 h-8 mx-auto text-[#667090] mb-2" />
                <h3 className="text-sm font-bold text-[#E7EBF5]">No Case Selected</h3>
                <p className="text-xs text-[#667090] mt-1">
                  Select a case from the queue to open the forensic audit workspace.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Queue Table Layout */
        <div className="space-y-4">
          <CaseQueueTable
            cases={filteredCases}
            selectedCaseId={selectedCaseId}
            onSelectCase={(c) => {
              setSelectedCaseId(c.id)
              setLayoutMode('split')
            }}
            onOpenDossier={(c) => handleOpenProjectDossier(c)}
          />
        </div>
      )}

      {/* 6. Modals & Drawers */}
      {selectedCase && (
        <>
          {/* Dossier Print-Ready Compliance Preview Modal (Requirement #6) */}
          <DossierPreviewModal
            isOpen={isDossierPreviewOpen}
            caseItem={selectedCase}
            onClose={() => setIsDossierPreviewOpen(false)}
          />

          {/* PFMS Stop-Payment / Review Action Modal (Requirement #7) */}
          <PfmsActionModal
            isOpen={isPfmsModalOpen}
            caseItem={selectedCase}
            onClose={() => setIsPfmsModalOpen(false)}
            onExecutePfmsAction={handleExecutePfmsAction}
          />

          {/* Assign Officer Modal (Requirement #5) */}
          <AssignOfficerModal
            isOpen={isAssignModalOpen}
            caseId={selectedCase.id}
            workCode={selectedCase.workCode}
            currentOfficer={selectedCase.assignedOfficer}
            onClose={() => setIsAssignModalOpen(false)}
            onAssignOfficer={handleAssignOfficer}
          />

          {/* Add Evidence Modal (Requirement #4) */}
          <AddEvidenceModal
            isOpen={isAddEvidenceModalOpen}
            caseId={selectedCase.id}
            workCode={selectedCase.workCode}
            onClose={() => setIsAddEvidenceModalOpen(false)}
            onAddEvidence={handleAddEvidence}
          />

          {/* Resolve Case Modal (Requirement #5) */}
          <ResolveCaseModal
            isOpen={isResolveModalOpen}
            caseId={selectedCase.id}
            workCode={selectedCase.workCode}
            projectTitle={selectedCase.projectTitle}
            financialExposureDisplay={selectedCase.financialExposureDisplay}
            onClose={() => setIsResolveModalOpen(false)}
            onResolveCase={handleResolveCase}
          />
        </>
      )}

      {/* Existing Project Dossier Drawer (Reused as specified) */}
      <ProjectDossierDrawer
        project={projectForDrawer}
        isOpen={isProjectDrawerOpen}
        onClose={() => {
          setIsProjectDrawerOpen(false)
          setProjectForDrawer(null)
        }}
      />
    </div>
  )
}
