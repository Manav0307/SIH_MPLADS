import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  AlertTriangle,
  CheckSquare,
  Square,
  FileText,
  ExternalLink,
  Layers,
  Database,
  Building,
  Store,
  UserCheck,
  Info,
  FolderKanban,
  Search,
} from 'lucide-react'
import { AnomalyFinding } from '@/lib/anomalyEngine/types'
import { EntityRelationshipPanel } from '@/components/common/EntityRelationshipPanel'
import { escalateToCase } from '@/lib/caseRegistry'

interface AnomalyEvidenceDrawerProps {
  finding: AnomalyFinding | null
  isOpen: boolean
  onClose: () => void
  onOpenProjectDossier?: (workCode: string) => void
}

export const AnomalyEvidenceDrawer: React.FC<AnomalyEvidenceDrawerProps> = ({
  finding,
  isOpen,
  onClose,
  onOpenProjectDossier,
}) => {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    freezeTranche: true,
    issueNotice: false,
    crossExamineGst: false,
    siteInspection: false,
  })

  if (!finding) return null

  const isCritical = finding.severity === 'critical'
  const isHigh = finding.severity === 'high'

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'vendor':
        return <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
      case 'agency':
        return <Building className="w-3.5 h-3.5 text-[#3B82F6]" />
      case 'mp':
        return <UserCheck className="w-3.5 h-3.5 text-[#adc6ff]" />
      default:
        return <Layers className="w-3.5 h-3.5 text-[#9AA5C1]" />
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#0A0E1A]/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Container */}
      <div
        className={`fixed top-14 right-0 bottom-0 w-full sm:w-[500px] bg-[#10182B] border-l border-[#232D47] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border uppercase ${
                  isCritical
                    ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                    : isHigh
                    ? 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                    : 'bg-[#161F36] text-[#EAB308] border-[#EAB308]/40'
                }`}
              >
                {finding.severity} • {finding.confidence}% CONFIDENCE
              </span>
              <span className="font-mono text-[10px] text-[#9AA5C1] bg-[#161F36] px-1.5 py-0.5 rounded border border-[#232D47] uppercase">
                {finding.category}
              </span>
            </div>

            <h2 className="font-sans text-sm font-bold text-[#E7EBF5] truncate mt-1.5" title={finding.ruleName}>
              {finding.ruleName}
            </h2>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[11px] text-[#3B82F6] font-bold">
                {finding.workCode}
              </span>
              <span className="text-[#667090] text-[10px]">•</span>
              <span className="font-mono text-[10px] text-[#9AA5C1]">
                ID: {finding.anomalyId}
              </span>
            </div>
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {/* Statutory Prudence Notice */}
          <div className="p-2.5 rounded bg-[#161F36]/60 border border-[#232D47] flex items-start gap-2.5 text-[11px] text-[#9AA5C1]">
            <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#E7EBF5]">Statutory Red Flag:</strong> This finding represents an explainable quantitative anomaly. It is not an accusation of fraud. Cross-examination of physical records is required.
            </p>
          </div>

          {/* 1. Forensic Red Flag Explanation */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#232D47] space-y-2">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider flex items-center justify-between">
              <span>Forensic Observation &amp; Explanation</span>
              <span className="font-mono text-[10px] text-[#EF4444] font-bold">
                Impact: {finding.financialImpactDisplay}
              </span>
            </div>
            <p className="text-[#E7EBF5] text-xs leading-relaxed font-sans bg-[#10182B] p-2.5 rounded border border-[#232D47]">
              {finding.explanation}
            </p>
          </div>

          {/* 2. Evidentiary Parameters & Field Telemetry */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#232D47] space-y-2.5">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Evidentiary Audit Parameters</span>
            </div>

            <div className="border border-[#232D47] rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-[#10182B] text-[#9AA5C1] border-b border-[#232D47]">
                    <th className="p-2 font-semibold">Parameter / Field</th>
                    <th className="p-2 font-semibold">Evaluated Value</th>
                    <th className="p-2 font-semibold text-right">Standard / Norm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232D47]">
                  {finding.evidenceFields.map((ev, idx) => (
                    <tr key={idx} className="hover:bg-[#161F36]/50 transition-colors">
                      <td className="p-2 text-[#E7EBF5]">
                        <div>{ev.label}</div>
                        {ev.notes && (
                          <span className="text-[9px] text-[#9AA5C1] block font-sans">
                            {ev.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-bold font-tabular">
                        <span
                          className={
                            ev.status === 'breached'
                              ? 'text-[#EF4444]'
                              : ev.status === 'warning'
                              ? 'text-[#F59E0B]'
                              : 'text-[#22C55E]'
                          }
                        >
                          {String(ev.value ?? 'NULL')}
                        </span>
                      </td>
                      <td className="p-2 text-right text-[#667090] font-tabular">
                        {ev.threshold ? String(ev.threshold) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Affected Entity & Jurisdictional Profile */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#232D47] space-y-2">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider flex items-center gap-1.5">
              {getEntityIcon(finding.affectedEntity.type)}
              <span>Affected Statutory Entity</span>
            </div>

            <div className="p-2.5 rounded bg-[#10182B] border border-[#232D47] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#667090] uppercase block">
                    {finding.affectedEntity.type.toUpperCase()} NAME
                  </span>
                  <span className="text-xs font-bold text-[#E7EBF5]">
                    {finding.affectedEntity.name}
                  </span>
                </div>
                {finding.affectedEntity.identifier && (
                  <div className="text-right">
                    <span className="text-[10px] text-[#667090] uppercase block">GSTIN / ID</span>
                    <span className="font-mono text-[11px] text-[#3B82F6] font-bold">
                      {finding.affectedEntity.identifier}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-[#232D47] pt-2">
                <div>
                  <span className="text-[#667090] block">Jurisdiction:</span>
                  <span className="text-[#E7EBF5]">{finding.district}, {finding.state}</span>
                </div>
                <div>
                  <span className="text-[#667090] block">Constituency:</span>
                  <span className="text-[#E7EBF5]">{finding.constituency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Cross-Dataset Provenance */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#232D47] space-y-2">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Cross-Dataset Provenance</span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[#9AA5C1]">Master Scheme Feed:</span>
                <span className="text-[#E7EBF5]">{finding.source}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[#9AA5C1]">Detection Timestamp:</span>
                <span className="text-[#3B82F6]">{finding.timestamp}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#10182B] border border-[#232D47]">
                <span className="text-[#9AA5C1]">Data Verification Layer:</span>
                <span className={finding.isDemoMock ? 'text-[#F59E0B]' : 'text-[#22C55E]'}>
                  {finding.isDemoMock ? 'Simulated Cache (Awaiting Upload)' : 'Deterministic Live Parse'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Recommended Statutory Audit Actions */}
          <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#232D47] space-y-2">
            <div className="font-sans text-[11px] font-semibold text-[#9AA5C1] uppercase tracking-wider">
              Statutory Next Steps Checklist
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div
                onClick={() => toggleCheck('freezeTranche')}
                className="flex items-start gap-2 p-1.5 rounded hover:bg-[#161F36] cursor-pointer transition-colors"
              >
                {checklist.freezeTranche ? (
                  <CheckSquare className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#667090] shrink-0 mt-0.5" />
                )}
                <span className={checklist.freezeTranche ? 'text-[#E7EBF5] font-semibold' : 'text-[#9AA5C1]'}>
                  Issue provisional stop-payment notice on PFMS tranche clearance
                </span>
              </div>

              <div
                onClick={() => toggleCheck('issueNotice')}
                className="flex items-start gap-2 p-1.5 rounded hover:bg-[#161F36] cursor-pointer transition-colors"
              >
                {checklist.issueNotice ? (
                  <CheckSquare className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#667090] shrink-0 mt-0.5" />
                )}
                <span className={checklist.issueNotice ? 'text-[#E7EBF5]' : 'text-[#9AA5C1]'}>
                  Summon Executive Engineer for physical measurement book verification
                </span>
              </div>

              <div
                onClick={() => toggleCheck('crossExamineGst')}
                className="flex items-start gap-2 p-1.5 rounded hover:bg-[#161F36] cursor-pointer transition-colors"
              >
                {checklist.crossExamineGst ? (
                  <CheckSquare className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#667090] shrink-0 mt-0.5" />
                )}
                <span className={checklist.crossExamineGst ? 'text-[#E7EBF5]' : 'text-[#9AA5C1]'}>
                  Cross-examine vendor bank ledger with GSTR-2B filing records
                </span>
              </div>

              <div
                onClick={() => toggleCheck('siteInspection')}
                className="flex items-start gap-2 p-1.5 rounded hover:bg-[#161F36] cursor-pointer transition-colors"
              >
                {checklist.siteInspection ? (
                  <CheckSquare className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#667090] shrink-0 mt-0.5" />
                )}
                <span className={checklist.siteInspection ? 'text-[#E7EBF5]' : 'text-[#9AA5C1]'}>
                  Deploy district flying squad for geo-tagged photographic inspection
                </span>
              </div>
            </div>
          </div>

          {/* 6. Entity Relationship Lineage Panel (Requirement #4) */}
          <EntityRelationshipPanel
            projectId={finding.projectId}
            workCode={finding.workCode}
            projectTitle={finding.projectTitle}
            vendorName={finding.affectedEntity.type === 'vendor' ? finding.affectedEntity.name : undefined}
            agencyName={finding.affectedEntity.type === 'agency' ? finding.affectedEntity.name : undefined}
            mpName={finding.affectedEntity.type === 'mp' ? finding.affectedEntity.name : undefined}
            state={finding.state}
            district={finding.district}
            riskLevel={finding.severity}
            compact
          />
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-[#0D1424] border-t border-[#232D47] flex items-center justify-between shrink-0 gap-2 flex-wrap">
          {/* Escalate to Case Action (Requirement #2) */}
          <button
            type="button"
            onClick={() => {
              const caseItem = escalateToCase({
                finding,
                projectId: finding.projectId,
                workCode: finding.workCode,
                reason: `Case escalated from Anomaly finding ${finding.anomalyId} (${finding.ruleName})`,
              })
              onClose()
              navigate(`/cases?id=${encodeURIComponent(caseItem.id)}`)
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#3A1E1E] hover:bg-[#522525] border border-[#EF4444]/40 text-[#f87171] font-mono text-xs font-semibold cursor-pointer transition-colors"
            title="Escalate Finding to Sovereign Audit Case"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Escalate to Case</span>
          </button>

          {/* Investigate Action (Requirement #5) */}
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/investigation?project=${encodeURIComponent(finding.projectId)}`)
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#10233F] hover:bg-[#163158] border border-[#3B82F6]/40 text-[#3B82F6] font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Investigate</span>
          </button>

          {onOpenProjectDossier && (
            <button
              type="button"
              onClick={() => onOpenProjectDossier(finding.workCode)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#161F36] hover:bg-[#202b4a] border border-[#3B82F6]/40 text-[#adc6ff] font-mono text-xs font-semibold cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Dossier</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => alert(`Exporting Evidence Slip for ${finding.anomalyId}...`)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] font-mono text-xs cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </>
  )
}
