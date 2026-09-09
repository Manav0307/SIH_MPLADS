import React, { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  AlertOctagon,
  Search,
  RotateCw,
  FileSpreadsheet,
  Layers,
  Store,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Link2,
  FolderKanban,
} from 'lucide-react'
import { escalateToCase } from '@/lib/caseRegistry'
import {
  getDefaultEngineResult,
  runAnomalyEngine,
  filterFindings,
  ANOMALY_RULES,
} from '@/lib/anomalyEngine'
import {
  AnomalyFinding,
  AnomalySeverity,
  RuleCategory,
  EngineFilterOptions,
} from '@/lib/anomalyEngine/types'
import { AnomalyEvidenceDrawer } from '@/components/anomalies'
import { ProjectDossierDrawer } from '@/components/dossier'
import { mockProjects } from '@/data/projects'
import { ProjectRecord } from '@/types'

export const AnomaliesPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('search') || searchParams.get('q') || ''

  // Engine result state
  const [engineResult, setEngineResult] = useState(() => getDefaultEngineResult())
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedSeverity, setSelectedSeverity] = useState<AnomalySeverity | 'all'>('all')
  const [selectedRuleId, setSelectedRuleId] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | 'all'>('all')
  const [selectedEntityType, setSelectedEntityType] = useState<'all' | 'vendor' | 'agency' | 'mp' | 'project'>('all')

  // Selected finding for evidence drawer
  const [selectedFinding, setSelectedFinding] = useState<AnomalyFinding | null>(null)
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false)

  // Dossier drawer integration
  const [dossierProject, setDossierProject] = useState<ProjectRecord | null>(null)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  // Re-run evaluation
  const handleReRunEngine = () => {
    setIsEvaluating(true)
    setTimeout(() => {
      const refreshed = runAnomalyEngine(mockProjects)
      setEngineResult(refreshed)
      setIsEvaluating(false)
    }, 450)
  }

  // Open evidence drawer
  const handleInspectEvidence = (finding: AnomalyFinding) => {
    setSelectedFinding(finding)
    setIsEvidenceDrawerOpen(true)
  }

  // Open project dossier
  const handleOpenProjectDossier = (workCodeOrId: string) => {
    const matched = mockProjects.find(
      (p) => p.workCode === workCodeOrId || p.id === workCodeOrId
    )
    if (matched) {
      setDossierProject(matched)
      setIsDossierOpen(true)
    }
  }

  // Filtered findings
  const filteredFindings = useMemo(() => {
    const opts: EngineFilterOptions = {
      searchQuery,
      severity: selectedSeverity,
      ruleId: selectedRuleId,
      category: selectedCategory,
      entityType: selectedEntityType,
    }
    return filterFindings(engineResult.findings, opts)
  }, [engineResult, searchQuery, selectedSeverity, selectedRuleId, selectedCategory, selectedEntityType])

  // Category counts for quick filter cards
  const categoryStats = useMemo(() => {
    return [
      {
        id: 'financial',
        label: 'Financial & Disbursal',
        count: engineResult.summary.categoryCounts.financial || 0,
        icon: <Layers className="w-4 h-4 text-[#EF4444]" />,
        desc: 'Ceiling breaches & premature tranches',
      },
      {
        id: 'vendor',
        label: 'Vendor Cartel & Concentration',
        count: engineResult.summary.categoryCounts.vendor || 0,
        icon: <Store className="w-4 h-4 text-[#F59E0B]" />,
        desc: 'Repeated single bidder allocations',
      },
      {
        id: 'timeline',
        label: 'Timeline & Stagnant Funds',
        count: engineResult.summary.categoryCounts.timeline || 0,
        icon: <Clock className="w-4 h-4 text-[#EAB308]" />,
        desc: 'Overdue milestones & idle balances',
      },
      {
        id: 'cross_linkage',
        label: 'Cross-Dataset Reconciliation',
        count: engineResult.summary.categoryCounts.cross_linkage || 0,
        icon: <Link2 className="w-4 h-4 text-[#3B82F6]" />,
        desc: 'Duplicate work codes & quota mismatches',
      },
      {
        id: 'integrity',
        label: 'Data Integrity & Schemas',
        count: engineResult.summary.categoryCounts.integrity || 0,
        icon: <Database className="w-4 h-4 text-[#22C55E]" />,
        desc: 'Missing GSTIN & unassigned agencies',
      },
    ]
  }, [engineResult])

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-8 space-y-3.5 px-4 pt-1">
      {/* 1. TOP HEADER & SOVEREIGN TELEMETRY STRIP */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase font-bold text-[#22C55E] bg-[#0F3020] px-2 py-0.5 rounded border border-[#22C55E]/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              SOC ENGINE v14.0 // ACTIVE
            </span>
            <span className="font-mono text-[10px] text-[#9AA5C1] bg-[#161F36] px-2 py-0.5 rounded border border-[#232D47]">
              EVALUATED: {engineResult.summary.evaluatedProjectsCount} WORKS
            </span>
            <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] px-2 py-0.5 rounded border border-[#3B82F6]/40">
              CROSS-LINK: {engineResult.datasetLinkageStats.linkedDatasets}/{engineResult.datasetLinkageStats.totalDatasets} DATASETS
            </span>
          </div>

          <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight mt-1.5 flex items-center gap-2">
            <span>Automated Anomaly Detection Engine &amp; Cross-Dataset Linkage</span>
          </h1>

          <p className="text-xs text-[#9AA5C1] mt-0.5 font-sans">
            Deterministic statutory rule evaluation, financial exposure calculation, and cross-dataset reconciliation across MPLADS master ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReRunEngine}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161F36] hover:bg-[#202b4a] border border-[#3B82F6]/50 text-[#adc6ff] font-mono text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Evaluating Rules...' : 'Re-run Evaluation'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Exporting Statutory Anomaly Ledger (CSV / TSV)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] font-mono text-xs cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* 2. RULE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider font-semibold">
              Total Active Findings
            </span>
            <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="font-mono text-xl font-bold text-[#E7EBF5] mt-1 font-tabular">
            {engineResult.summary.totalFindings}
          </div>
          <div className="font-mono text-[10px] text-[#9AA5C1] mt-1 flex items-center justify-between border-t border-[#232D47] pt-1">
            <span>{engineResult.summary.criticalCount} Critical</span>
            <span>{engineResult.summary.highCount} High</span>
            <span>{engineResult.summary.mediumCount} Medium</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#10182B] border border-[#401515] bg-gradient-to-br from-[#10182B] to-[#1d0d0d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#EF4444] uppercase tracking-wider font-bold">
              Critical Red Flags
            </span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="font-mono text-xl font-bold text-[#EF4444] mt-1 font-tabular">
            {engineResult.summary.criticalCount}
          </div>
          <div className="font-mono text-[10px] text-[#9AA5C1] mt-1 border-t border-[#401515] pt-1">
            Requires immediate stop-payment or physical audit
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider font-semibold">
              Total Capital Exposure
            </span>
            <span className="font-mono text-[10px] text-[#F59E0B] font-bold">INR</span>
          </div>
          <div className="font-mono text-xl font-bold text-[#F59E0B] mt-1 font-tabular">
            {engineResult.summary.totalExposureDisplay}
          </div>
          <div className="font-mono text-[10px] text-[#9AA5C1] mt-1 border-t border-[#232D47] pt-1">
            Cumulative financial value linked to flagged works
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider font-semibold">
              Cross-Dataset Match Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="font-mono text-xl font-bold text-[#22C55E] mt-1 font-tabular">
            {engineResult.datasetLinkageStats.matchRate}%
          </div>
          <div className="font-mono text-[10px] text-[#9AA5C1] mt-1 border-t border-[#232D47] pt-1 flex items-center justify-between">
            <span>{engineResult.datasetLinkageStats.linkedVendorsCount} Vendors Linked</span>
            <span>{engineResult.datasetLinkageStats.linkedAgenciesCount} Agencies</span>
          </div>
        </div>
      </div>

      {/* 3. RULE CATEGORY QUICK FILTER CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {categoryStats.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? 'all' : (cat.id as RuleCategory))}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#161F36] border-[#3B82F6] ring-1 ring-[#3B82F6]'
                  : 'bg-[#10182B] border-[#232D47] hover:border-[#353946]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1 rounded bg-[#0A0E1A] border border-[#232D47]">
                  {cat.icon}
                </span>
                <span className="font-mono text-xs font-bold text-[#E7EBF5] font-tabular">
                  {cat.count}
                </span>
              </div>
              <div className="font-sans text-xs font-bold text-[#E7EBF5] mt-1 truncate">
                {cat.label}
              </div>
              <div className="text-[10px] text-[#667090] truncate font-sans">
                {cat.desc}
              </div>
            </div>
          )
        })}
      </div>

      {/* 4. FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#667090]" />
          <input
            type="text"
            placeholder="Search work code, project, vendor, agency, MP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-[#0A0E1A] border border-[#232D47] rounded text-xs text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] font-sans"
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Severity Pills */}
          <div className="flex items-center bg-[#0A0E1A] border border-[#232D47] rounded p-0.5 text-xs font-mono">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? sev === 'critical'
                      ? 'bg-[#401515] text-[#EF4444] border border-[#EF4444]/40'
                      : sev === 'high'
                      ? 'bg-[#3A2A0C] text-[#F59E0B] border border-[#F59E0B]/40'
                      : 'bg-[#161F36] text-[#adc6ff]'
                    : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Rule Filter Dropdown */}
          <select
            value={selectedRuleId}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            className="h-8 px-2 bg-[#0A0E1A] border border-[#232D47] rounded text-xs text-[#E7EBF5] font-sans focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Rules ({ANOMALY_RULES.length})</option>
            {ANOMALY_RULES.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>

          {/* Entity Filter Dropdown */}
          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value as any)}
            className="h-8 px-2 bg-[#0A0E1A] border border-[#232D47] rounded text-xs text-[#E7EBF5] font-sans focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Entities</option>
            <option value="agency">Agencies</option>
            <option value="vendor">Vendors</option>
            <option value="mp">Members of Parliament</option>
            <option value="project">Project Assets</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || selectedSeverity !== 'all' || selectedRuleId !== 'all' || selectedCategory !== 'all' || selectedEntityType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedSeverity('all')
                setSelectedRuleId('all')
                setSelectedCategory('all')
                setSelectedEntityType('all')
              }}
              className="text-xs font-mono text-[#3B82F6] hover:underline px-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 5. ANOMALY LEDGER TABLE */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg overflow-hidden flex flex-col">
        <div className="px-3.5 py-2.5 border-b border-[#232D47] bg-[#0D1424] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#E7EBF5] uppercase tracking-wider">
              Statutory Anomaly Ledger
            </span>
            <span className="font-mono text-[10px] text-[#9AA5C1] bg-[#161F36] px-1.5 py-0.5 rounded border border-[#232D47]">
              {filteredFindings.length} Active Findings
            </span>
          </div>

          <span className="font-mono text-[10px] text-[#667090]">
            Click row or &quot;Evidence&quot; to inspect audit details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0A0E1A] text-[#9AA5C1] font-mono text-[10px] uppercase tracking-wider border-b border-[#232D47]">
                <th className="p-2.5 font-semibold">Anomaly / Rule</th>
                <th className="p-2.5 font-semibold">Work Code &amp; Project</th>
                <th className="p-2.5 font-semibold">Affected Entity</th>
                <th className="p-2.5 font-semibold text-right">Exposure</th>
                <th className="p-2.5 font-semibold text-center">Severity</th>
                <th className="p-2.5 font-semibold text-center">Confidence</th>
                <th className="p-2.5 font-semibold">Provenance</th>
                <th className="p-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232D47] font-sans">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#667090] font-sans">
                    No anomaly findings match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredFindings.map((finding) => {
                  const isCrit = finding.severity === 'critical'
                  const isH = finding.severity === 'high'

                  return (
                    <tr
                      key={finding.anomalyId}
                      className="hover:bg-[#161F36] transition-colors cursor-pointer group"
                      onClick={() => handleInspectEvidence(finding)}
                    >
                      {/* Anomaly / Rule */}
                      <td className="p-2.5 max-w-[220px]">
                        <div className="font-mono text-[10px] text-[#adc6ff] font-bold truncate">
                          {finding.anomalyId}
                        </div>
                        <div className="font-sans text-xs font-semibold text-[#E7EBF5] truncate mt-0.5" title={finding.ruleName}>
                          {finding.ruleName}
                        </div>
                        <span className="font-mono text-[9px] text-[#9AA5C1] uppercase">
                          {finding.category}
                        </span>
                      </td>

                      {/* Work Code & Title */}
                      <td className="p-2.5 max-w-[260px]">
                        <div className="font-mono text-[11px] text-[#3B82F6] font-bold flex items-center gap-1.5">
                          <span>{finding.workCode}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenProjectDossier(finding.workCode)
                            }}
                            className="text-[#9AA5C1] hover:text-[#adc6ff] cursor-pointer"
                            title="Open Project Dossier"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-[#E7EBF5] truncate mt-0.5" title={finding.projectTitle}>
                          {finding.projectTitle}
                        </div>
                        <div className="font-mono text-[10px] text-[#667090]">
                          {finding.district}, {finding.state}
                        </div>
                      </td>

                      {/* Affected Entity */}
                      <td className="p-2.5 max-w-[180px]">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px] uppercase font-bold text-[#9AA5C1] bg-[#0A0E1A] px-1 py-0.2 rounded border border-[#232D47]">
                            {finding.affectedEntity.type}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#E7EBF5] truncate mt-0.5" title={finding.affectedEntity.name}>
                          {finding.affectedEntity.name}
                        </div>
                        {finding.affectedEntity.identifier && (
                          <div className="font-mono text-[9px] text-[#667090] truncate">
                            {finding.affectedEntity.identifier}
                          </div>
                        )}
                      </td>

                      {/* Financial Impact */}
                      <td className="p-2.5 text-right font-mono font-bold font-tabular">
                        <span className={isCrit ? 'text-[#EF4444]' : isH ? 'text-[#F59E0B]' : 'text-[#E7EBF5]'}>
                          {finding.financialImpactDisplay}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="p-2.5 text-center font-mono">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border inline-block ${
                            isCrit
                              ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                              : isH
                              ? 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                              : 'bg-[#161F36] text-[#EAB308] border-[#EAB308]/40'
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="p-2.5 text-center font-mono font-bold font-tabular text-[#22C55E]">
                        {finding.confidence}%
                      </td>

                      {/* Source */}
                      <td className="p-2.5 font-mono text-[10px] text-[#9AA5C1] max-w-[150px] truncate" title={finding.source}>
                        {finding.source}
                      </td>

                      {/* Action */}
                      <td className="p-2.5 text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const caseItem = escalateToCase({
                                finding,
                                projectId: finding.projectId,
                                workCode: finding.workCode,
                                reason: `Case escalated from Anomaly ${finding.anomalyId} (${finding.ruleName})`,
                              })
                              navigate(`/cases?id=${encodeURIComponent(caseItem.id)}`)
                            }}
                            className="px-2 py-1 rounded bg-[#3A1E1E] hover:bg-[#522525] border border-[#EF4444]/40 text-[#f87171] text-[10px] font-bold cursor-pointer transition-colors inline-flex items-center gap-1"
                            title="Escalate Finding to Formal Case"
                          >
                            <FolderKanban className="w-3 h-3" />
                            <span>Escalate</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleInspectEvidence(finding)
                            }}
                            className="px-2 py-1 rounded bg-[#161F36] hover:bg-[#202b4a] border border-[#232D47] group-hover:border-[#3B82F6]/50 text-[#adc6ff] text-[10px] font-bold cursor-pointer transition-colors inline-flex items-center gap-1"
                          >
                            <span>Evidence</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SLIDE-OVER EVIDENCE DRAWER */}
      <AnomalyEvidenceDrawer
        finding={selectedFinding}
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        onOpenProjectDossier={handleOpenProjectDossier}
      />

      {/* 7. REUSABLE PROJECT DOSSIER DRAWER */}
      <ProjectDossierDrawer
        project={dossierProject}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  )
}
