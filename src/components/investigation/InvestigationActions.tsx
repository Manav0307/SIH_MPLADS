import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Send,
  FileDown,
  Eye,
  CheckCircle2,
  FileSignature,
  FolderKanban,
} from 'lucide-react'
import { ProjectRecord } from '@/types'
import { Button } from '@/components/common/Button'
import { escalateToCase } from '@/lib/caseRegistry'

interface InvestigationActionsProps {
  project: ProjectRecord
  onOpenDossier: (project: ProjectRecord) => void
  onFocusNotes: () => void
}

export const InvestigationActions: React.FC<InvestigationActionsProps> = ({
  project,
  onOpenDossier,
  onFocusNotes,
}) => {
  const navigate = useNavigate()
  const [escalated, setEscalated] = useState(false)
  const [underReview, setUnderReview] = useState(project.status === 'Under Investigation')
  const [exported, setExported] = useState(false)

  const handleEscalateToCase = () => {
    const caseItem = escalateToCase({
      project,
      reason: `Case escalated from Forensic Investigation Workspace (#${project.workCode})`,
    })
    navigate(`/cases?id=${encodeURIComponent(caseItem.id)}`)
  }

  const handleEscalate = () => {
    setEscalated(true)
    setTimeout(() => setEscalated(false), 3000)
  }

  const handleToggleReview = () => {
    setUnderReview((prev) => !prev)
  }

  const handleExportEvidence = () => {
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  return (
    <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2.5 select-none">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
        <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <FileSignature className="w-3.5 h-3.5 text-[#3B82F6]" />
          Statutory Auditor Actions
        </span>
        <span className="font-mono text-[10px] text-[#22C55E]">CAG POWERS ACTIVE</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Escalate to Formal Case (Requirement #2) */}
        <button
          type="button"
          onClick={handleEscalateToCase}
          className="h-8 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#3A1E1E] hover:bg-[#522525] text-[#f87171] border border-[#EF4444]/50 transition-all cursor-pointer col-span-2 font-mono"
          title="Escalate Finding to Sovereign Audit Case"
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Escalate to Sovereign Audit Case</span>
        </button>

        {/* Open Project Dossier Drawer */}
        <Button
          variant="primary"
          size="standard"
          className="w-full text-xs font-semibold col-span-2 bg-[#3B82F6] hover:bg-[#2563EB]"
          onClick={() => onOpenDossier(project)}
          icon={<FolderOpen className="w-4 h-4" />}
        >
          Open Statutory Project Dossier
        </Button>

        {/* Escalate for Inspection */}
        <button
          onClick={handleEscalate}
          className={`h-8 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            escalated
              ? 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]'
              : 'bg-[#401515] hover:bg-[#5A1E1E] text-[#EF4444] border-[#EF4444]/50'
          }`}
        >
          {escalated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Escalated to MoSPI</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Escalate for Inspection</span>
            </>
          )}
        </button>

        {/* Mark Under Review */}
        <button
          onClick={handleToggleReview}
          className={`h-8 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            underReview
              ? 'bg-[#161F36] text-[#adc6ff] border-[#3B82F6]/60'
              : 'bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] border-[#232D47]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>{underReview ? 'Under Formal Review' : 'Mark Under Review'}</span>
        </button>

        {/* Add Investigation Note */}
        <button
          onClick={onFocusNotes}
          className="h-8 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#10182B] hover:bg-[#161F36] text-[#E7EBF5] border border-[#232D47] transition-all cursor-pointer"
        >
          <FileSignature className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>Add Forensic Note</span>
        </button>

        {/* Export Evidence */}
        <button
          onClick={handleExportEvidence}
          className={`h-8 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            exported
              ? 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]'
              : 'bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border-[#232D47]'
          }`}
        >
          <FileDown className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>{exported ? 'Evidence Bundle Ready' : 'Export Evidence ZIP'}</span>
        </button>
      </div>
    </div>
  )
}
