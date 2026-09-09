import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  FolderOpen,
  Send,
  CheckCircle2,
  FileSignature,
  FileText,
  Lock,
  UserCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  IndianRupee,
} from 'lucide-react'
import {
  CaseRecord,
  CaseStatus,
} from '@/types/cases'
import { RiskBadge } from '@/components/common/RiskBadge'
import { Button } from '@/components/common/Button'
import { CaseEvidencePanel } from './CaseEvidencePanel'
import { CommandQuickActions } from '@/components/common/CommandQuickActions'
import { EntityRelationshipPanel } from '@/components/common/EntityRelationshipPanel'
import { cn } from '@/lib/utils'

interface CaseDetailWorkspaceProps {
  caseItem: CaseRecord
  onUpdateStatus: (caseId: string, newStatus: CaseStatus) => void
  onOpenAssignModal: () => void
  onOpenResolveModal: () => void
  onOpenPfmsModal: () => void
  onOpenDossierPreview: () => void
  onOpenProjectDossier: () => void
  onOpenAddEvidenceModal: () => void
  onToggleEvidenceVerification: (evidenceId: string) => void
  onMarkAllEvidenceVerified: () => void
  onAddNote: (content: string) => void
}

type WorkspaceTab = 'overview' | 'anomalies' | 'evidence' | 'timeline' | 'notes'

const workflowSteps: CaseStatus[] = [
  'New',
  'Under Review',
  'Field Verification',
  'Escalated',
  'Resolved',
]

export const CaseDetailWorkspace: React.FC<CaseDetailWorkspaceProps> = ({
  caseItem,
  onUpdateStatus,
  onOpenAssignModal,
  onOpenResolveModal,
  onOpenPfmsModal,
  onOpenDossierPreview,
  onOpenProjectDossier,
  onOpenAddEvidenceModal,
  onToggleEvidenceVerification,
  onMarkAllEvidenceVerified,
  onAddNote,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [newNoteText, setNewNoteText] = useState('')
  const noteInputRef = useRef<HTMLTextAreaElement>(null)

  const isCritical = caseItem.severity === 'critical'
  const isPfmsFrozen = caseItem.pfmsAction.status === 'Active Stop-Payment'
  const isEscalated = caseItem.status === 'Escalated'

  const currentStepIndex = workflowSteps.indexOf(caseItem.status)

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return
    onAddNote(newNoteText.trim())
    setNewNoteText('')
  }

  const focusNoteInput = () => {
    setActiveTab('notes')
    setTimeout(() => {
      noteInputRef.current?.focus()
    }, 100)
  }

  return (
    <div className="bg-[#10182B] rounded-lg border border-[#232D47] flex flex-col overflow-hidden select-none">
      {/* 1. Workspace Master Header */}
      <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold text-[#adc6ff]">
                {caseItem.id}
              </span>
              <span className="font-mono text-[10px] text-[#3B82F6] font-bold">
                {caseItem.workCode}
              </span>
              <RiskBadge
                level={caseItem.severity}
                score={caseItem.riskScore}
                size="sm"
                withPip={isCritical}
                pulse={isCritical}
              />
            </div>
            <h2 className="text-sm font-bold text-[#E7EBF5] truncate mt-0.5" title={caseItem.projectTitle}>
              {caseItem.projectTitle}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#9AA5C1] mt-0.5">
              <span>{caseItem.district}, {caseItem.state}</span>
              <span>•</span>
              <span>MP: {caseItem.mpName} ({caseItem.mpHouse})</span>
            </div>
          </div>
        </div>

        {/* Assigned Officer Chip */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-[#0A0E1A] p-1.5 rounded-lg border border-[#232D47]">
          <div className="w-7 h-7 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center font-mono text-[10px] font-bold text-[#adc6ff]">
            {caseItem.assignedOfficer.avatar || 'UA'}
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] font-medium text-[#E7EBF5] truncate max-w-[130px]">
              {caseItem.assignedOfficer.name}
            </span>
            <span className="text-[9px] font-mono text-[#667090] truncate max-w-[130px]">
              {caseItem.assignedOfficer.designation}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="compact"
            onClick={onOpenAssignModal}
            className="text-[10px] h-6 px-1.5 text-[#3B82F6] hover:text-[#adc6ff] border border-[#232D47]"
          >
            Reassign
          </Button>
        </div>
      </div>

      {/* 2. Interactive Status Workflow Stepper */}
      <div className="px-3.5 py-2.5 bg-[#0A0E1A] border-b border-[#232D47] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] gap-1">
          {workflowSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isPastOrCurrent = idx <= currentStepIndex

            return (
              <React.Fragment key={step}>
                <div
                  onClick={() => onUpdateStatus(caseItem.id, step)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer transition-all border',
                    isCurrent
                      ? 'bg-[#161F36] border-[#3B82F6] text-[#adc6ff] font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-[#10182B] border-[#22C55E]/40 text-[#22C55E]'
                      : 'bg-transparent border-transparent text-[#667090] hover:text-[#9AA5C1] hover:bg-[#10182B]'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]',
                      isCurrent
                        ? 'bg-[#3B82F6] text-white font-bold'
                        : isCompleted
                        ? 'bg-[#22C55E] text-black font-bold'
                        : 'bg-[#161F36] text-[#667090]'
                    )}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className="font-mono text-[11px] whitespace-nowrap uppercase">
                    {step}
                  </span>
                </div>

                {idx < workflowSteps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 min-w-[14px]',
                      isPastOrCurrent ? 'bg-[#3B82F6]/50' : 'bg-[#232D47]'
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* 3. Action Status Warning Banners */}
      {isPfmsFrozen && (
        <div className="bg-[#401515] border-b border-[#EF4444]/40 px-3.5 py-1.5 text-[11px] font-mono text-[#EF4444] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              PFMS STOP-PAYMENT ORDER ACTIVE: Tranche disbursement frozen (Order #{caseItem.pfmsAction.orderNumber || '2026'}).
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenPfmsModal}
            className="underline hover:text-white cursor-pointer shrink-0"
          >
            Manage Hold
          </button>
        </div>
      )}

      {isEscalated && (
        <div className="bg-[#10233F] border-b border-[#3B82F6]/40 px-3.5 py-1.5 text-[11px] font-mono text-[#3B82F6] flex items-center gap-2">
          <Send className="w-3.5 h-3.5 shrink-0" />
          <span>
            ESCALATED TO MoSPI STATUTORY ENFORCEMENT & CAG SPECIAL AUDIT CELL.
          </span>
        </div>
      )}

      {/* 4. Audit Actions Toolbar (Requirement #5) */}
      <div className="px-3.5 py-2 bg-[#0D1424] border-b border-[#232D47] flex items-center gap-1.5 flex-wrap overflow-x-auto">
        <span className="font-mono text-[10px] uppercase font-bold text-[#667090] mr-1">
          Audit Actions:
        </span>

        {/* Ask AI Action */}
        <button
          type="button"
          onClick={() => navigate(`/assistant?type=case&id=${encodeURIComponent(caseItem.id)}`)}
          className="h-7 px-2.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open AI Investigation Assistant with this case context"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Ask AI</span>
        </button>

        {/* Add Inspection Note */}
        <button
          type="button"
          onClick={focusNoteInput}
          className="h-7 px-2.5 rounded bg-[#10182B] hover:bg-[#161F36] text-[#E7EBF5] border border-[#232D47] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileSignature className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>Add Note</span>
        </button>

        {/* Assign Officer */}
        <button
          type="button"
          onClick={onOpenAssignModal}
          className="h-7 px-2.5 rounded bg-[#10182B] hover:bg-[#161F36] text-[#E7EBF5] border border-[#232D47] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Assign Officer</span>
        </button>

        {/* Escalate Case */}
        <button
          type="button"
          onClick={() => onUpdateStatus(caseItem.id, 'Escalated')}
          disabled={caseItem.status === 'Escalated'}
          className={cn(
            'h-7 px-2.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer',
            caseItem.status === 'Escalated'
              ? 'bg-[#401515]/40 text-[#EF4444]/60 border-[#EF4444]/20 cursor-not-allowed'
              : 'bg-[#401515] hover:bg-[#5a1e1e] text-[#EF4444] border-[#EF4444]/50'
          )}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{caseItem.status === 'Escalated' ? 'Escalated' : 'Escalate Case'}</span>
        </button>

        {/* Mark Evidence Verified */}
        <button
          type="button"
          onClick={onMarkAllEvidenceVerified}
          className="h-7 px-2.5 rounded bg-[#10182B] hover:bg-[#161F36] text-[#22C55E] border border-[#22C55E]/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mark Evidence Verified</span>
        </button>

        {/* Resolve Case */}
        <button
          type="button"
          onClick={onOpenResolveModal}
          className="h-7 px-2.5 rounded bg-[#0F3020] hover:bg-[#16432b] text-[#22C55E] border border-[#22C55E]/50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolve Case</span>
        </button>

        <div className="h-4 w-px bg-[#232D47] mx-1" />

        {/* PFMS Action */}
        <button
          type="button"
          onClick={onOpenPfmsModal}
          className={cn(
            'h-7 px-2.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer',
            isPfmsFrozen
              ? 'bg-[#401515] hover:bg-[#5a1e1e] text-[#EF4444] border-[#EF4444]/60'
              : 'bg-[#10233F] hover:bg-[#173059] text-[#3B82F6] border-[#3B82F6]/50'
          )}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isPfmsFrozen ? 'PFMS Stop-Payment Active' : 'PFMS Action'}</span>
        </button>

        {/* Generate Dossier Preview */}
        <button
          type="button"
          onClick={onOpenDossierPreview}
          className="h-7 px-2.5 rounded bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dossier Preview</span>
        </button>

        {/* Open Project Dossier Drawer (Existing component) */}
        <button
          type="button"
          onClick={onOpenProjectDossier}
          className="h-7 px-2 rounded bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border border-[#232D47] text-xs transition-colors cursor-pointer"
          title="Open Project Dossier Drawer"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Workspace Navigation Tabs */}
      <div className="px-3.5 bg-[#0A0E1A] border-b border-[#232D47] flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer',
            activeTab === 'overview'
              ? 'border-[#3B82F6] text-[#adc6ff] font-bold'
              : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5]'
          )}
        >
          Summary & Entities
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('anomalies')}
          className={cn(
            'px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
            activeTab === 'anomalies'
              ? 'border-[#3B82F6] text-[#adc6ff] font-bold'
              : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5]'
          )}
        >
          <span>Forensic Anomalies</span>
          <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#161F36] text-[#EF4444]">
            {caseItem.anomalyCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={cn(
            'px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
            activeTab === 'evidence'
              ? 'border-[#3B82F6] text-[#adc6ff] font-bold'
              : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5]'
          )}
        >
          <span>Evidence Panel</span>
          <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#161F36] text-[#22C55E]">
            {caseItem.evidence.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={cn(
            'px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
            activeTab === 'timeline'
              ? 'border-[#3B82F6] text-[#adc6ff] font-bold'
              : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5]'
          )}
        >
          <span>Timeline & History</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={cn(
            'px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
            activeTab === 'notes'
              ? 'border-[#3B82F6] text-[#adc6ff] font-bold'
              : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5]'
          )}
        >
          <span>Auditor Notes</span>
          <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#161F36] text-[#adc6ff]">
            {caseItem.notes.length}
          </span>
        </button>
      </div>

      {/* 6. Tab Content Workspace */}
      <div className="p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-320px)] text-xs">
        {/* TAB 1: Overview & Summary */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Executive Summary Card */}
            <div className="p-3.5 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                  Executive Audit Case Synopsis
                </span>
                <span className="font-mono text-[10px] text-[#22C55E]">
                  REGISTERED: {caseItem.createdDate}
                </span>
              </div>
              <p className="font-sans text-xs text-[#E7EBF5] leading-relaxed">
                {caseItem.summary}
              </p>
            </div>

            {/* Financial Exposure Forensics Card */}
            <div className="p-3.5 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Financial Exposure & Disbursal Discrepancy
                </span>
                <span className="font-mono text-xs font-bold text-[#EF4444]">
                  AT RISK: {caseItem.financialExposureDisplay}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                <div className="p-2 rounded bg-[#10182B] border border-[#232D47]">
                  <span className="text-[10px] text-[#667090] block">Sanctioned</span>
                  <div className="text-xs font-bold text-[#E7EBF5] mt-0.5">
                    {caseItem.project.sanctionedDisplay}
                  </div>
                </div>
                <div className="p-2 rounded bg-[#10182B] border border-[#232D47]">
                  <span className="text-[10px] text-[#667090] block">Disbursed (PFMS)</span>
                  <div className="text-xs font-bold text-[#EF4444] mt-0.5">
                    {caseItem.project.disbursedDisplay} ({caseItem.project.disbursedPercent}%)
                  </div>
                </div>
                <div className="p-2 rounded bg-[#10182B] border border-[#232D47]">
                  <span className="text-[10px] text-[#667090] block">Physical Stage</span>
                  <div className="text-xs font-bold text-[#F59E0B] mt-0.5">
                    {caseItem.project.progressPercent}% Stage
                  </div>
                </div>
                <div className="p-2 rounded bg-[#10182B] border border-[#232D47]">
                  <span className="text-[10px] text-[#667090] block">Capital At Risk</span>
                  <div className="text-xs font-bold text-[#EF4444] mt-0.5">
                    {caseItem.financialExposureDisplay}
                  </div>
                </div>
              </div>

              {caseItem.project.financialExecutionWarning && (
                <div className="p-2 rounded bg-[#401515]/30 border border-[#EF4444]/40 text-[#EF4444] text-[11px] font-mono flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{caseItem.project.financialExecutionWarning}</span>
                </div>
              )}
            </div>

            {/* Command-Center Quick Actions */}
            <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
              <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5 font-mono text-[10px]">
                <span className="uppercase font-bold text-[#9AA5C1] tracking-wider">
                  Command-Center Entity Actions
                </span>
                <span className="text-[#3B82F6]">DEEP-LINK ACTIVE</span>
              </div>
              <CommandQuickActions
                projectId={caseItem.projectId}
                workCode={caseItem.workCode}
                projectTitle={caseItem.projectTitle}
                caseId={caseItem.id}
                vendorName={caseItem.vendor}
                agencyName={caseItem.agency}
                mpName={caseItem.mpName}
                onOpenDossier={onOpenProjectDossier}
                size="standard"
                layout="wrap"
              />
            </div>

            {/* Reusable Entity Relationship Panel (Requirement #4) */}
            <EntityRelationshipPanel
              caseId={caseItem.id}
              projectId={caseItem.projectId}
              workCode={caseItem.workCode}
              projectTitle={caseItem.projectTitle}
              vendorName={caseItem.vendor}
              agencyName={caseItem.agency}
              mpName={caseItem.mpName}
              state={caseItem.state}
              district={caseItem.district}
              constituency={caseItem.constituency}
              anomaliesCount={caseItem.anomalyCount}
              riskScore={caseItem.riskScore}
              riskLevel={caseItem.severity}
            />
          </div>
        )}

        {/* TAB 2: Forensic Anomalies */}
        {activeTab === 'anomalies' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider">
                Tripartite Forensic Findings ({caseItem.anomalies.length} Detected)
              </span>
              <span className="font-mono text-[10px] text-[#EF4444] font-bold">
                COMPOSITE SCORE: {caseItem.riskScore}/100
              </span>
            </div>

            <div className="space-y-2">
              {caseItem.anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] hover:border-[#3B82F6]/60 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <RiskBadge level={anom.severity} size="sm" />
                      <strong className="text-white text-xs">{anom.title}</strong>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47]">
                        {anom.ruleId}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#EF4444]">
                      {anom.financialImpactDisplay}
                    </span>
                  </div>

                  <p className="font-sans text-[11px] text-[#CAD2E2] leading-relaxed">
                    {anom.explanation}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#232D47]/60 text-[10px] font-mono text-[#9AA5C1]">
                    <span>Category: <strong className="text-[#E7EBF5] uppercase">{anom.category}</strong></span>
                    <span>Detection Confidence: <strong className="text-[#22C55E]">{anom.confidence}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Evidence Panel (Requirement #4) */}
        {activeTab === 'evidence' && (
          <CaseEvidencePanel
            evidence={caseItem.evidence}
            onAddEvidenceClick={onOpenAddEvidenceModal}
            onToggleVerification={onToggleEvidenceVerification}
          />
        )}

        {/* TAB 4: Timeline & History */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {/* Investigation Lifecycle Timeline */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider block">
                Chronological Case Investigation Trail
              </span>
              <div className="space-y-2">
                {caseItem.timeline.map((event) => (
                  <div
                    key={event.id}
                    className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
                        <span>{event.timestamp}</span>
                        <span className="text-[#3B82F6] font-semibold">{event.actor}</span>
                      </div>
                      <div className="text-xs font-bold text-[#E7EBF5] mt-0.5">
                        {event.title}
                      </div>
                      <p className="text-[11px] text-[#9AA5C1] mt-0.5 font-sans leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Transition History */}
            <div className="space-y-2.5 pt-2 border-t border-[#232D47]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider block">
                Workflow Status Audit Trail (Immutable Log)
              </span>
              <div className="space-y-1.5 font-mono text-[10px]">
                {caseItem.statusHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-2 rounded bg-[#0A0E1A] border border-[#232D47] flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#9AA5C1]">{hist.fromStatus}</span>
                        <span className="text-[#3B82F6]">→</span>
                        <strong className="text-[#22C55E] uppercase">{hist.toStatus}</strong>
                        <span className="text-[#667090]">by {hist.changedBy}</span>
                      </div>
                      <div className="text-[#CAD2E2] font-sans text-[11px]">
                        {hist.remarks}
                      </div>
                    </div>
                    <span className="text-[#667090] shrink-0">{hist.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Auditor Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3.5">
            {/* Note input box */}
            <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
              <label className="block font-mono text-[10px] uppercase font-bold text-[#9AA5C1]">
                Record Audit Observation / Inspection Note
              </label>
              <textarea
                ref={noteInputRef}
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type forensic observation, field visit findings, or statutory instructions..."
                className="w-full p-2 rounded bg-[#10182B] border border-[#232D47] text-[#E7EBF5] text-xs font-sans placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#667090]">
                  Author: <strong className="text-[#adc6ff]">{caseItem.assignedOfficer.name}</strong>
                </span>
                <Button
                  type="button"
                  variant="primary"
                  size="compact"
                  disabled={!newNoteText.trim()}
                  onClick={handleSaveNote}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                >
                  Save Note
                </Button>
              </div>
            </div>

            {/* Notes log */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider block">
                Recorded Case Observations ({caseItem.notes.length})
              </span>
              {caseItem.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
                    <span className="text-[#3B82F6] font-semibold">{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                  <p className="font-sans text-xs text-[#E7EBF5] leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
