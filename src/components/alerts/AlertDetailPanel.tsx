import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  AlertTriangle,
  FolderOpen,
  Search,
  Download,
  Send,
  CheckCircle,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  FolderKanban,
} from 'lucide-react'
import { AnomalyAlert, AlertStatus, ProjectRecord } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBreakdown } from '@/components/investigation/RiskBreakdown'
import { FinancialForensics } from '@/components/investigation/FinancialForensics'
import { EntityRelationshipPanel } from '@/components/common/EntityRelationshipPanel'
import { escalateToCase, findCaseForProject } from '@/lib/caseRegistry'
import { getProjectForensicDetail } from '@/data/investigation'
import { cn } from '@/lib/utils'

interface AlertDetailPanelProps {
  alert: AnomalyAlert | null
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void
  onOpenDossier: (project: ProjectRecord) => void
  onExportEvidence: (alert: AnomalyAlert) => void
}

export const AlertDetailPanel: React.FC<AlertDetailPanelProps> = ({
  alert,
  onUpdateStatus,
  onOpenDossier,
  onExportEvidence,
}) => {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState(false)
  const [actionChecks, setActionChecks] = useState<Record<string, boolean>>({})

  if (!alert) {
    return (
      <Card className="h-full select-none">
        <CardHeader telemetry="STANDBY">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#9AA5C1]" />
            <CardTitle>Evidence & Explainability Panel</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-24 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-[#E7EBF5]">
              Select an Alert for Forensic Triage
            </h3>
            <p className="text-xs text-[#9AA5C1] leading-relaxed font-sans">
              Click any incident in the triage queue to inspect why it was flagged, decompose multi-engine risk
              contributors, review comparative financial forensics, and trigger statutory escalation actions.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const project = alert.project
  const forensicDetail = project ? getProjectForensicDetail(project) : null
  const linkedCase = findCaseForProject(alert.workCode) || findCaseForProject(alert.projectId) || findCaseForProject(alert.project?.id || '')

  const handleCopyId = () => {
    navigator.clipboard?.writeText(alert.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const toggleAction = (id: string, initialChecked: boolean) => {
    setActionChecks((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !initialChecked,
    }))
  }

  const isChecked = (id: string, initialChecked: boolean) => {
    return actionChecks[id] !== undefined ? actionChecks[id] : initialChecked
  }

  return (
    <Card className="h-full flex flex-col select-none overflow-hidden border-[#232D47] bg-[#10182B]">
      {/* 1. Header with ID, Risk Score, Severity, and Timestamp */}
      <CardHeader telemetry={`TRIGGER // ${alert.id}`} className="border-b border-[#232D47] pb-3 shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#adc6ff] flex items-center gap-1.5 bg-[#0A0E1A] px-2 py-0.5 rounded border border-[#232D47]">
              {alert.id}
              <button
                onClick={handleCopyId}
                title="Copy Alert ID"
                className="text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
              </button>
            </span>
            <RiskBadge
              level={alert.severity}
              withPip
              pulse={alert.severity === 'critical' && alert.status !== 'Resolved'}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[#9AA5C1] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#667090]" />
              {alert.createdTime}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#161F36] text-[#E7EBF5] border border-[#232D47] font-bold">
              {alert.status}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* Title & Anomaly Tag */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] bg-[#0E2A3A] px-2 py-0.5 rounded border border-[#38BDF8]/40">
              {alert.anomalyType}
            </span>
            <span className="text-[10px] font-mono text-[#9AA5C1]">
              {alert.financialYear}
            </span>
          </div>
          <h2 className="text-sm font-bold text-[#E7EBF5] leading-snug">
            {alert.projectTitle}
          </h2>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#9AA5C1]">
            <span className="text-[#3B82F6]">{alert.workCode}</span>
            <span>•</span>
            <span>{alert.district}, {alert.state}</span>
          </div>
        </div>

        {/* Status Callout Banner if Escalated or Resolved */}
        {alert.status === 'Escalated' && (
          <div className="p-2.5 rounded-lg bg-[#381B47]/70 border border-[#C084FC]/50 flex items-start gap-2 text-xs">
            <Send className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-[#E9D5FF] font-mono text-[11px]">
                ESCALATED TO STATUTORY ENFORCEMENT
              </div>
              <p className="text-[#C084FC] text-[11px]">
                Transmitted to {alert.escalatedTo || 'MoSPI Central Audit Cell'} on {alert.escalatedDate || '09 Sep 2026'}.
                Physical summons and site LiDAR audit queued.
              </p>
            </div>
          </div>
        )}

        {alert.status === 'Resolved' && (
          <div className="p-2.5 rounded-lg bg-[#0F3020]/70 border border-[#4ADE80]/50 flex items-start gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-[#86EFAC] font-mono text-[11px]">
                INCIDENT RESOLVED
              </div>
              <p className="text-[#4ADE80] text-[11px]">
                {alert.resolutionNote || 'All flagged discrepancies reconciled and statutory clearance verified.'}
              </p>
              <div className="text-[10px] font-mono text-[#86EFAC]/80">
                Resolved by {alert.resolvedBy || 'Chief Auditor'} on {alert.resolvedAt || '09 Sep 2026'}.
              </div>
            </div>
          </div>
        )}

        {/* 3. Status Workflow Action Bar */}
        <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1] font-bold">
              Workflow State Transitions
            </span>
            <span className="text-[10px] font-mono text-[#667090]">STEP 12 AUDIT TRIAGE</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onUpdateStatus(alert.id, 'Under Review')}
              disabled={alert.status === 'Under Review'}
              className={cn(
                'h-7 px-2 rounded text-xs font-mono font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer select-none',
                alert.status === 'Under Review'
                  ? 'bg-[#2E280C] text-[#FACC15] border-[#FACC15] ring-1 ring-[#FACC15]/40 opacity-90'
                  : 'bg-[#10182B] text-[#9AA5C1] border-[#232D47] hover:bg-[#161F36] hover:text-[#E7EBF5]'
              )}
            >
              <Clock className="w-3 h-3 text-[#FACC15]" />
              <span>Under Review</span>
            </button>

            <button
              onClick={() => onUpdateStatus(alert.id, 'Escalated')}
              disabled={alert.status === 'Escalated'}
              className={cn(
                'h-7 px-2 rounded text-xs font-mono font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer select-none',
                alert.status === 'Escalated'
                  ? 'bg-[#381B47] text-[#C084FC] border-[#C084FC] ring-1 ring-[#C084FC]/40 opacity-90'
                  : 'bg-[#10182B] text-[#9AA5C1] border-[#232D47] hover:bg-[#161F36] hover:text-[#E7EBF5]'
              )}
            >
              <Send className="w-3 h-3 text-[#C084FC]" />
              <span>Escalate</span>
            </button>

            <button
              onClick={() => onUpdateStatus(alert.id, 'Resolved')}
              disabled={alert.status === 'Resolved'}
              className={cn(
                'h-7 px-2 rounded text-xs font-mono font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer select-none',
                alert.status === 'Resolved'
                  ? 'bg-[#0F3020] text-[#4ADE80] border-[#4ADE80] ring-1 ring-[#4ADE80]/40 opacity-90'
                  : 'bg-[#10182B] text-[#9AA5C1] border-[#232D47] hover:bg-[#161F36] hover:text-[#E7EBF5]'
              )}
            >
              <CheckCircle className="w-3 h-3 text-[#4ADE80]" />
              <span>Resolve</span>
            </button>
          </div>
        </div>

        {/* 4. Action Buttons (Escalate to Case, Open Dossier, Open Investigation, Export Evidence) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {linkedCase ? (
            <button
              type="button"
              onClick={() => navigate(`/cases?id=${encodeURIComponent(linkedCase.id)}`)}
              className="h-8 px-2 rounded text-xs font-semibold bg-[#10233F] hover:bg-[#1f2b4a] text-[#38BDF8] border border-[#38BDF8]/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="View Existing Case"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span className="truncate">View Existing Case</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const caseItem = escalateToCase({
                  alert,
                  project: alert.project,
                  reason: `Case escalated from Anomaly Alert #${alert.id} (${alert.anomalyType})`,
                })
                navigate(`/cases?id=${encodeURIComponent(caseItem.id)}`)
              }}
              className="h-8 px-2 rounded text-xs font-semibold bg-[#3A1E1E] hover:bg-[#522525] text-[#f87171] border border-[#EF4444]/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Escalate to Sovereign Audit Case"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span className="truncate">Open Case</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const caseItem = linkedCase || escalateToCase({
                alert,
                project: alert.project,
                reason: `Case escalated from Anomaly Alert #${alert.id} (${alert.anomalyType})`,
              })
              navigate(`/cases?id=${encodeURIComponent(caseItem.id)}`)
            }}
            className="h-8 px-2 rounded text-xs font-semibold bg-[#3A1E1E] hover:bg-[#522525] text-[#f87171] border border-[#EF4444]/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Escalate to Case"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="truncate">Escalate to Case</span>
          </button>

          {project && (
            <button
              type="button"
              onClick={() => onOpenDossier(project)}
              className="h-8 px-2 rounded text-xs font-semibold bg-[#161F36] hover:bg-[#1f2b4a] text-[#adc6ff] border border-[#3B82F6]/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="truncate">Open Dossier</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(`/investigation?project=${encodeURIComponent(alert.projectId)}`)}
            className="h-8 px-2 rounded text-xs font-semibold bg-[#161F36] hover:bg-[#1f2b4a] text-[#E7EBF5] border border-[#232D47] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="truncate">View Evidence</span>
          </button>

          <button
            type="button"
            onClick={() => onExportEvidence(alert)}
            className="h-8 px-2 rounded text-xs font-semibold bg-[#161F36] hover:bg-[#1f2b4a] text-[#E7EBF5] border border-[#232D47] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="truncate">Export Evidence</span>
          </button>
        </div>

        {/* 5. Why Flagged Section */}
        <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#EF4444] font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Why Flagged (Statutory Audit Trigger)</span>
          </div>
          <p className="text-xs text-[#E7EBF5] leading-relaxed font-sans">
            {alert.whyFlagged}
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#9AA5C1] border-t border-[#232D47]/60">
            <span>Primary Anomaly: {alert.anomalyType}</span>
            <span className="text-[#EF4444] font-bold">Capital Exposure: {alert.financialImpact}</span>
          </div>
        </div>

        {/* 6. Multi-Engine Risk Contributors Breakdown */}
        {forensicDetail && (
          <div className="space-y-2">
            <RiskBreakdown
              breakdown={forensicDetail.riskBreakdown}
              riskLevel={alert.severity}
            />

            {/* Itemized Contributors */}
            <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1] font-bold block border-b border-[#232D47] pb-1">
                Risk Contributors & Point Deductions
              </span>
              <div className="space-y-1.5">
                {forensicDetail.evidenceContributors.map((ec) => (
                  <div
                    key={ec.id}
                    className="p-2 rounded bg-[#10182B] border border-[#232D47] flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <RiskBadge level={ec.severity} size="sm" />
                        <span className="font-mono text-[11px] font-bold text-[#E7EBF5]">
                          {ec.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9AA5C1] font-sans leading-snug">
                        {ec.explanation}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#EF4444] shrink-0 font-tabular">
                      +{ec.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. Financial Forensics Comparison */}
        {forensicDetail && (
          <FinancialForensics data={forensicDetail.financialForensics} />
        )}

        {/* 8. Reusable Entity Relationship Panel (Requirement #4) */}
        <EntityRelationshipPanel
          projectId={alert.projectId}
          workCode={alert.workCode}
          projectTitle={alert.projectTitle}
          vendorName={alert.vendor}
          agencyName={alert.agency}
          mpName={alert.mpName}
          state={alert.state}
          district={alert.district}
          constituency={alert.constituency}
          riskScore={alert.riskScore}
          riskLevel={alert.severity}
        />

        {/* 9. Recommended Statutory Actions Checklist */}
        <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
          <div className="flex items-center justify-between border-b border-[#232D47] pb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1] font-bold">
              Recommended Statutory Actions
            </span>
            <span className="text-[10px] font-mono text-[#3B82F6]">
              CAG COMPLIANCE DIRECTIVES
            </span>
          </div>

          <div className="space-y-1.5">
            {alert.recommendedActionsList.map((action) => {
              const checked = isChecked(action.id, action.checked)
              return (
                <div
                  key={action.id}
                  onClick={() => toggleAction(action.id, action.checked)}
                  className={cn(
                    'p-2 rounded border transition-colors cursor-pointer flex items-start gap-2 text-xs',
                    checked
                      ? 'bg-[#10233F]/40 border-[#3B82F6]/50 text-[#E7EBF5]'
                      : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5]'
                  )}
                >
                  <div className="mt-0.5 shrink-0 text-[#3B82F6]">
                    {checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#667090]" />}
                  </div>
                  <span className="font-sans leading-snug">{action.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
