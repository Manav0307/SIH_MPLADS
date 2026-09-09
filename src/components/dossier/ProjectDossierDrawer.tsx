import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  X,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  CheckSquare,
  Square,
  FileText,
  Send,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { ProjectRecord } from '@/types'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'
import { escalateToCase, findCaseForProject } from '@/lib/caseRegistry'
import { CommandQuickActions } from '@/components/common/CommandQuickActions'
import { EntityRelationshipPanel } from '@/components/common/EntityRelationshipPanel'
import { DemoBadge } from '@/components/common/DemoBadge'

interface ProjectDossierDrawerProps {
  project: ProjectRecord | null
  isOpen: boolean
  onClose: () => void
}

export const ProjectDossierDrawer: React.FC<ProjectDossierDrawerProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const [isFrozen, setIsFrozen] = useState(false)
  const [isEscalated, setIsEscalated] = useState(false)
  const [actionChecks, setActionChecks] = useState<Record<string, boolean>>({})

  if (!project) return null

  const activeCase = findCaseForProject(project.id) || findCaseForProject(project.workCode)
  const engineAssessment = getDefaultEngineResult().assessments[project.id]
  const effectiveRiskLevel = engineAssessment?.riskLevel || project.riskLevel
  const effectiveRiskScore = engineAssessment?.overallScore || project.riskScore
  const isCritical = effectiveRiskLevel === 'critical'
  const isHigh = effectiveRiskLevel === 'high'

  const toggleAction = (id: string) => {
    setActionChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleFreezeTranche = () => {
    setIsFrozen(!isFrozen)
  }

  const handleEscalate = () => {
    const caseRec = escalateToCase({ project })
    setIsEscalated(true)
    setTimeout(() => {
      navigate(`/cases?id=${caseRec.id}`)
    }, 400)
  }

  const handleDownloadPdf = () => {
    alert(`Downloading Comprehensive Statutory Audit Dossier for ${project.workCode} (PDF)...`)
  }

  return (
    <>
      {/* Backdrop Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#0A0E1A]/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Slide-Over Container */}
      <div
        className={`fixed top-14 right-0 bottom-8 w-full sm:w-[480px] bg-[#10182B] border-l border-[#232D47] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                  isCritical
                    ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                    : isHigh
                    ? 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                    : 'bg-[#161F36] text-[#EAB308] border-[#EAB308]/40'
                }`}
              >
                {effectiveRiskScore} {effectiveRiskLevel.toUpperCase()}
              </span>
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase">
                {project.status}
              </span>
              <DemoBadge label="DEMO DOSSIER" variant="simulation" size="sm" />
            </div>

            <h2 className="font-sans text-sm font-bold text-[#E7EBF5] truncate mt-1" title={project.title}>
              {project.title}
            </h2>

            <span className="font-mono text-[10px] text-[#3B82F6] font-bold">
              {project.workCode}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#161F36] text-[#667090] hover:text-[#E7EBF5] transition-colors cursor-pointer shrink-0"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Status Feedback Banners */}
        {isFrozen && (
          <div className="bg-[#401515] border-b border-[#EF4444]/40 px-3.5 py-1.5 text-[11px] font-mono text-[#EF4444] flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>PFMS TRANCHE LOCKED // Statutory stop-payment notice issued.</span>
          </div>
        )}
        {isEscalated && (
          <div className="bg-[#10233F] border-b border-[#3B82F6]/40 px-3.5 py-1.5 text-[11px] font-mono text-[#3B82F6] flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            <span>ESCALATED TO CAG DISTRICT AUDIT CELL // Priority: High.</span>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 font-sans text-xs">
          {/* 1. Administrative Metadata Card */}
          <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2">
              Administrative Dossier
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-[#667090] block text-[10px]">State / District:</span>
                <Link
                  to={`/geospatial?state=${encodeURIComponent(project.state)}&district=${encodeURIComponent(project.district)}`}
                  className="text-[#E7EBF5] font-semibold hover:text-[#3B82F6] hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>{project.state}, {project.district}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#3B82F6] opacity-70 shrink-0" />
                </Link>
              </div>
              <div>
                <span className="text-[#667090] block text-[10px]">Recommending MP:</span>
                <Link
                  to={`/mps/${encodeURIComponent(project.mpName)}`}
                  className="text-[#E7EBF5] font-semibold hover:text-[#3B82F6] hover:underline flex items-center gap-1 transition-colors truncate"
                  title={project.mpName}
                >
                  <span className="truncate">{project.mpName} ({project.mpHouse})</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#3B82F6] opacity-70 shrink-0" />
                </Link>
              </div>
              <div>
                <span className="text-[#667090] block text-[10px]">Implementing Agency:</span>
                <Link
                  to={`/agencies/${encodeURIComponent(project.agency)}`}
                  className="text-[#E7EBF5] font-semibold truncate block hover:text-[#3B82F6] hover:underline transition-colors"
                  title={project.agency}
                >
                  {project.agency}
                </Link>
              </div>
              <div>
                <span className="text-[#667090] block text-[10px]">Contracted Vendor:</span>
                <Link
                  to={`/vendors/${encodeURIComponent(project.vendor)}`}
                  className="text-[#F59E0B] font-semibold truncate block hover:text-[#60A5FA] hover:underline transition-colors"
                  title={project.vendor}
                >
                  {project.vendor}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Command Actions */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <div className="font-sans text-[10px] font-semibold text-[#667090] uppercase tracking-wider mb-2">
              Command Actions
            </div>
            <CommandQuickActions
              projectId={project.id}
              workCode={project.workCode}
              projectTitle={project.title}
              caseId={activeCase?.id}
              vendorName={project.vendor}
              agencyName={project.agency}
              mpName={project.mpName}
            />
          </div>

          {/* Entity Relationship Topology */}
          <EntityRelationshipPanel
            projectId={project.id}
            workCode={project.workCode}
            projectTitle={project.title}
            vendorName={project.vendor}
            agencyName={project.agency}
            mpName={project.mpName}
            state={project.state}
            district={project.district}
            caseId={activeCase?.id}
          />

          {/* 2. Financial Discrepancy Card */}
          <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2">
              Financial Execution Discrepancy
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono mb-2">
              <div className="p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[10px] text-[#667090]">Sanctioned</span>
                <div className="text-xs text-[#E7EBF5] font-bold mt-0.5">
                  {project.sanctionedDisplay}
                </div>
              </div>
              <div className="p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[10px] text-[#667090]">Disbursed (PFMS)</span>
                <div className="text-xs text-[#EF4444] font-bold mt-0.5">
                  {project.disbursedDisplay} ({project.disbursedPercent}%)
                </div>
              </div>
              <div className="p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[10px] text-[#667090]">Physical Stage</span>
                <div className="text-xs text-[#F59E0B] font-bold mt-0.5">
                  {project.progressPercent}% Verified
                </div>
              </div>
            </div>

            {project.financialExecutionWarning && (
              <div className="p-2 rounded bg-[#401515]/30 border border-[#EF4444]/40 text-[#EF4444] text-[11px] flex items-start gap-2 mt-2">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{project.financialExecutionWarning}</span>
              </div>
            )}
          </div>

          {/* 3. Statutory Timeline */}
          <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2">
              Statutory Lifecycle Timeline
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#667090]" />
                <div>
                  <span className="text-[#667090] text-[9px] block">Recommended</span>
                  <span className="text-[#E7EBF5]">{project.timeline.recommended}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#3B82F6]" />
                <div>
                  <span className="text-[#667090] text-[9px] block">Sanctioned</span>
                  <span className="text-[#E7EBF5]">{project.timeline.sanctioned}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#22C55E]" />
                <div>
                  <span className="text-[#667090] text-[9px] block">Disbursed</span>
                  <span className="text-[#E7EBF5]">{project.timeline.disbursed}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#EF4444]" />
                <div>
                  <span className="text-[#667090] text-[9px] block">Target Completion</span>
                  <span className="text-[#EF4444] font-bold">{project.timeline.completionTarget}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Forensic Rule Violations */}
          <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Forensic Rule Findings (Audit Engine)</span>
              {engineAssessment && (
                <span className="font-mono text-[9px] text-[#22C55E]">
                  {engineAssessment.confidence}% CONFIDENCE
                </span>
              )}
            </div>
            <ul className="space-y-2.5 text-[11px]">
              {engineAssessment && engineAssessment.findings.length > 0 ? (
                engineAssessment.findings.map((f) => (
                  <li key={f.anomalyId} className="flex items-start gap-2 text-[#E7EBF5]">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        f.severity === 'critical' ? 'text-[#EF4444]' : f.severity === 'high' ? 'text-[#F59E0B]' : 'text-[#3B82F6]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-white">{f.ruleName}</strong>
                        <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47]">
                          {f.severity}
                        </span>
                        <span className="font-mono text-[9px] text-[#EF4444]">
                          {f.financialImpactDisplay}
                        </span>
                      </div>
                      <span className="text-[#9AA5C1] block mt-0.5">{f.explanation}</span>
                    </div>
                  </li>
                ))
              ) : (
                project.violations.map((v) => (
                  <li key={v.id} className="flex items-start gap-2 text-[#E7EBF5]">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        v.severity === 'critical' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                      }`}
                    />
                    <div>
                      <strong className="text-white">{v.title}:</strong>{' '}
                      <span className="text-[#9AA5C1]">{v.description}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 5. Recommended Statutory Actions (Interactive Checkboxes) */}
          <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2">
              Recommended Statutory Actions
            </div>
            <div className="space-y-1.5 text-[11px]">
              {project.recommendedActions.map((act) => {
                const checked = actionChecks[act.id] !== undefined ? actionChecks[act.id] : act.checked
                return (
                  <div
                    key={act.id}
                    onClick={() => toggleAction(act.id)}
                    className="flex items-start gap-2 p-1.5 rounded hover:bg-[#161F36] cursor-pointer transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#667090] shrink-0 mt-0.5" />
                    )}
                    <span className={checked ? 'text-[#E7EBF5]' : 'text-[#9AA5C1]'}>
                      {act.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 6. Geo-Tagged Site Imagery & Evidence */}
          {project.evidenceImages && project.evidenceImages.length > 0 && (
            <div className="bg-[#0A0E1A] p-3 rounded border border-[#232D47]">
              <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider mb-2">
                Geo-Tagged Site Imagery &amp; Audit Photographic Evidence
              </div>
              <div className="grid grid-cols-2 gap-2">
                {project.evidenceImages.map((img, idx) => (
                  <div key={idx} className="relative rounded overflow-hidden border border-[#232D47] group">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    {img.watermark && (
                      <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.2 rounded font-mono text-[8px] text-[#EF4444] font-bold">
                        {img.watermark}
                      </div>
                    )}
                    <div className="p-1 bg-[#10182B] text-[9px] text-[#9AA5C1] truncate" title={img.caption}>
                      {img.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-3 bg-[#0D1424] border-t border-[#232D47] flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFreezeTranche}
            className={`flex-1 font-sans font-bold text-xs py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isFrozen
                ? 'bg-[#22C55E] hover:bg-[#16a34a] text-white'
                : 'bg-[#EF4444] hover:bg-[#dc2626] text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isFrozen ? 'Unfreeze Tranche' : 'Freeze PFMS Tranche'}</span>
          </button>

          <button
            type="button"
            onClick={handleEscalate}
            className="flex-1 bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] font-sans font-bold text-xs py-1.5 px-2 rounded border border-[#232D47] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>{activeCase ? 'Open Audit Case' : 'Escalate to Case'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/assistant?type=project&id=${encodeURIComponent(project.id)}`)
            }}
            className="p-1.5 px-2 bg-[#161F36] hover:bg-[#232D47] text-[#38BDF8] border border-[#38BDF8]/40 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
            title="Ask AI Assistant about this project"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Ask AI</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="p-1.5 bg-[#161F36] hover:bg-[#232D47] text-[#3B82F6] rounded border border-[#232D47] transition-colors cursor-pointer"
            title="Download Full PDF Dossier"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
