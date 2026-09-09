import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  FolderOpen,
  Sparkles,
  Layers,
  ChevronRight,
  FileSearch,
} from 'lucide-react'
import {
  ProjectRecord,
  AnomalyCluster,
  VendorRecord,
  InvestigationNote,
} from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'
import { RiskBreakdown } from './RiskBreakdown'
import { FinancialForensics } from './FinancialForensics'
import { InvestigationTimeline } from './InvestigationTimeline'
import { VendorNetwork } from './VendorNetwork'
import { RelatedEntities } from './RelatedEntities'
import { InvestigationActions } from './InvestigationActions'
import { InvestigationNotes, InvestigationNotesHandle } from './InvestigationNotes'
import { getProjectForensicDetail } from '@/data/investigation'

interface EvidencePanelProps {
  selectedProject: ProjectRecord | null
  selectedCluster: AnomalyCluster | null
  allProjects: ProjectRecord[]
  allVendors: VendorRecord[]
  notes: InvestigationNote[]
  onAddNote: (content: string) => void
  onClearNotes: () => void
  onOpenDossier: (project: ProjectRecord) => void
  onSelectProject: (project: ProjectRecord) => void
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  selectedProject,
  selectedCluster,
  allProjects,
  allVendors,
  notes,
  onAddNote,
  onClearNotes,
  onOpenDossier,
  onSelectProject,
}) => {
  const navigate = useNavigate()
  const notesRef = useRef<InvestigationNotesHandle>(null)

  // Empty State: when neither is selected
  if (!selectedProject && !selectedCluster) {
    return (
      <Card className="h-full select-none">
        <CardHeader telemetry="STANDBY">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#9AA5C1]" />
            <CardTitle>Evidence & Explainability</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-24 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
            <FileSearch className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-[#E7EBF5]">
              No Entity Selected for Cross-Examination
            </h3>
            <p className="text-xs text-[#9AA5C1] leading-relaxed font-sans">
              Select an anomaly cluster or project to begin investigation. The forensic explainability
              engine will decompose risk scores, reconstruct financial trails, and project vendor networks.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If a project is selected (primary deep-dive inspection)
  if (selectedProject) {
    const forensicDetail = getProjectForensicDetail(selectedProject)
    const isCritical = selectedProject.riskLevel === 'critical'

    // Projects by same vendor for vendor network
    const vendorProjects = allProjects.filter((p) => p.vendor === selectedProject.vendor)
    const vendorRecord = allVendors.find((v) => v.name === selectedProject.vendor)

    // Project-specific notes
    const projectNotes = notes.filter((n) => n.targetId === selectedProject.id)

    return (
      <Card className="h-full select-none flex flex-col">
        <CardHeader
          telemetry={`DOSSIER #${selectedProject.workCode}`}
          action={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigate(`/assistant?type=project&id=${encodeURIComponent(selectedProject.id)}`)}
                className="flex items-center gap-1 font-mono text-[10px] text-[#38BDF8] hover:text-[#7dd3fc] px-2 py-0.5 rounded bg-[#10233F] border border-[#38BDF8]/40 cursor-pointer transition-colors"
                title="Ask AI Assistant about this project"
              >
                <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                <span>Ask AI</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenDossier(selectedProject)}
                className="flex items-center gap-1 font-mono text-[10px] text-[#3B82F6] hover:text-[#60a5fa] px-2 py-0.5 rounded bg-[#161F36] border border-[#3B82F6]/40 cursor-pointer transition-colors"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Full Dossier</span>
              </button>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
            <CardTitle>Evidence & Explainability</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-3 space-y-3 overflow-y-auto flex-1 max-h-[calc(100vh-210px)]">
          {/* Header Metric Banner */}
          <div className="p-3 rounded-lg bg-[#0D1424] border border-[#232D47] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#adc6ff]">
                  {selectedProject.workCode}
                </span>
                <RiskBadge
                  level={selectedProject.riskLevel}
                  score={selectedProject.riskScore}
                  size="sm"
                  withPip={isCritical}
                  pulse={isCritical}
                />
              </div>
              <h4 className="text-xs font-bold text-[#E7EBF5] mt-1 line-clamp-1" title={selectedProject.title}>
                {selectedProject.title}
              </h4>
              <div className="text-[10px] font-mono text-[#9AA5C1] mt-0.5">
                {selectedProject.district}, {selectedProject.state} • {selectedProject.category}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono text-[10px] text-[#667090] uppercase block">
                Detection Confidence
              </span>
              <span className="font-mono text-sm font-extrabold text-[#22C55E] font-tabular">
                {forensicDetail.detectionConfidence}%
              </span>
            </div>
          </div>

          {/* Section: "Why This Was Flagged" */}
          <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
            <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                Why This Was Flagged (Evidence Contributors)
              </span>
              <span className="font-mono text-[10px] text-[#EF4444]">
                +{forensicDetail.riskBreakdown.consolidatedScore} TOTAL IMPACT
              </span>
            </div>

            <div className="space-y-1.5">
              {forensicDetail.evidenceContributors.map((contrib) => (
                <div
                  key={contrib.id}
                  className="p-2 rounded bg-[#10182B] border border-[#161F36] hover:border-[#232D47] transition-colors space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <RiskBadge level={contrib.severity} size="sm" />
                      <span className="font-mono text-[11px] font-bold text-[#E7EBF5] uppercase">
                        {contrib.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#EF4444] font-tabular">
                      +{contrib.points} points
                    </span>
                  </div>

                  <p className="font-sans text-[11px] text-[#9AA5C1] leading-relaxed">
                    {contrib.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 1. Multi-Engine Risk Score Breakdown */}
          <RiskBreakdown
            breakdown={forensicDetail.riskBreakdown}
            riskLevel={selectedProject.riskLevel}
          />

          {/* 2. Financial Forensics */}
          <FinancialForensics data={forensicDetail.financialForensics} />

          {/* 3. Lifecycle Timeline */}
          <InvestigationTimeline
            stages={forensicDetail.timeline}
            agingDays={selectedProject.agingDays}
          />

          {/* 4. Related Entities */}
          <RelatedEntities
            currentProject={selectedProject}
            allProjects={allProjects}
            allVendors={allVendors}
            onSelectProject={onSelectProject}
          />

          {/* 5. Vendor Network */}
          <VendorNetwork
            currentProject={selectedProject}
            vendorProjects={vendorProjects}
            vendorRecord={vendorRecord}
            onSelectProject={onSelectProject}
          />

          {/* 6. Auditor Actions */}
          <InvestigationActions
            project={selectedProject}
            onOpenDossier={onOpenDossier}
            onFocusNotes={() => notesRef.current?.focusInput()}
          />

          {/* 7. Investigation Notes */}
          <InvestigationNotes
            ref={notesRef}
            notes={projectNotes}
            onAddNote={onAddNote}
            onClearNotes={onClearNotes}
            targetTitle={selectedProject.workCode}
          />
        </CardContent>
      </Card>
    )
  }

  // Fallback: Anomaly Cluster is selected
  if (!selectedCluster) return null

  const clusterProjects = allProjects.filter((p) =>
    selectedCluster.relatedProjectIds.includes(p.id)
  )

  return (
    <Card className="h-full select-none flex flex-col">
      <CardHeader telemetry={`CLUSTER ${selectedCluster.id}`}>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Cluster Forensic Context</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3 overflow-y-auto flex-1 max-h-[calc(100vh-210px)]">
        {/* Cluster Metric Header */}
        <div className="p-3 rounded-lg bg-[#0D1424] border border-[#232D47] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#adc6ff]">
                {selectedCluster.id}
              </span>
              <RiskBadge
                level={selectedCluster.riskLevel}
                score={selectedCluster.riskScore}
                size="sm"
              />
            </div>
            <span className="font-mono text-xs text-[#22C55E] bg-[#0F3020] px-2 py-0.5 rounded border border-[#22C55E]/30 font-semibold">
              {selectedCluster.confidence}% CONFIDENCE
            </span>
          </div>

          <h3 className="font-sans text-sm font-bold text-[#E7EBF5]">
            {selectedCluster.title}
          </h3>

          <p className="font-sans text-xs text-[#9AA5C1] leading-relaxed">
            {selectedCluster.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#161F36] text-xs font-mono">
            <div>
              <span className="text-[#667090] block text-[10px]">Total Exposure:</span>
              <span className="text-[#EF4444] font-bold text-sm">
                {selectedCluster.totalExposureDisplay}
              </span>
            </div>
            <div>
              <span className="text-[#667090] block text-[10px]">Linked Projects:</span>
              <span className="text-[#E7EBF5] font-bold text-sm">
                {selectedCluster.projectCount} Works
              </span>
            </div>
          </div>
        </div>

        {/* Clustered Projects List */}
        <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
          <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider">
              Flagged Projects In This Cluster ({clusterProjects.length})
            </span>
            <span className="font-mono text-[10px] text-[#667090]">SELECT TO INSPECT</span>
          </div>

          <div className="space-y-1.5">
            {clusterProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="flex items-center justify-between p-2 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 cursor-pointer transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-xs font-bold text-[#adc6ff]">
                    {p.workCode}
                  </span>
                  <div className="font-sans text-xs text-[#E7EBF5] truncate mt-0.5">
                    {p.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs text-[#EF4444] font-bold">
                    {p.disbursedDisplay}
                  </span>
                  <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#E7EBF5]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Cluster Notes */}
        <InvestigationNotes
          ref={notesRef}
          notes={notes.filter((n) => n.targetId === selectedCluster.id)}
          onAddNote={onAddNote}
          onClearNotes={onClearNotes}
          targetTitle={selectedCluster.id}
        />
      </CardContent>
    </Card>
  )
}
