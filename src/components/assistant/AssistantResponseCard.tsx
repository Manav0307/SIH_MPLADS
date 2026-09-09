import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  IndianRupee,
  FileText,
  Briefcase,
  Store,
  Building2,
  Users,
  FolderKanban,
  Sparkles,
  Send,
  FileSignature,
  Layers,
} from 'lucide-react'
import {
  AssistantMessage,
  AssistantAction,
} from '@/types/assistant'
import { InvestigationReasoningChain } from './InvestigationReasoningChain'
import { EvidenceReferenceCard } from '@/components/common/EvidenceReferenceCard'
import { DemoBadge } from '@/components/common/DemoBadge'
import { cn } from '@/lib/utils'

interface AssistantResponseCardProps {
  message: AssistantMessage
  onAddNotePrompt?: (caseId?: string) => void
}

export const AssistantResponseCard: React.FC<AssistantResponseCardProps> = ({
  message,
  onAddNotePrompt,
}) => {
  const navigate = useNavigate()
  const [copied, setCopied] = useState<boolean>(false)

  const isUser = message.sender === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  const handleActionClick = (action: AssistantAction) => {
    if (action.actionType === 'add_note') {
      if (onAddNotePrompt) {
        onAddNotePrompt(action.payload?.caseId)
      } else if (action.route) {
        navigate(action.route)
      }
      return
    }

    if (action.route) {
      navigate(action.route)
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end select-none">
        <div className="max-w-2xl bg-[#161F36] border border-[#232D47] text-[#E7EBF5] rounded-xl px-4 py-3 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[#9AA5C1]">
            <span className="flex items-center gap-1 font-bold text-[#adc6ff]">
              <User className="w-3.5 h-3.5" />
              Auditor Prompt
            </span>
            <span>{message.timestamp}</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#E7EBF5] leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start select-none w-full">
      <div className="w-full bg-[#10182B] border border-[#232D47] rounded-xl overflow-hidden shadow-md space-y-3.5 pb-3">
        {/* 1. Response Header & Demonstration Watermark Banner */}
        <div className="p-3 bg-[#0D1424] border-b border-[#232D47] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#161F36] border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6]">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#E7EBF5]">
                  AI Investigation Assistant
                </span>
                <DemoBadge label="DEMONSTRATION" variant="demo" size="sm" />
              </div>
              <span className="font-mono text-[9px] text-[#667090]">
                Sovereign Audit Intelligence Protocol &bull; MoSPI / CAG Spec
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {message.confidence && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0A0E1A] border border-[#232D47]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="font-mono text-[10px] text-[#22C55E] font-bold">
                  {message.confidence}% Confidence
                </span>
                {message.confidenceLabel && (
                  <span className="font-mono text-[9px] text-[#667090] hidden sm:inline">
                    &bull; {message.confidenceLabel}
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors border border-[#232D47] cursor-pointer"
              title="Copy response text"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Concise Natural Answer */}
        <div className="px-4">
          <p className="font-sans text-xs sm:text-sm text-[#E7EBF5] leading-relaxed whitespace-pre-line font-normal">
            {message.text}
          </p>
        </div>

        {/* 3. Investigation Reasoning View (5-Step Chain) */}
        {message.reasoningChain && (
          <div className="px-4">
            <InvestigationReasoningChain chain={message.reasoningChain} />
          </div>
        )}

        {/* 4. Financial Exposure Readouts */}
        {message.financialExposure && (
          <div className="px-4">
            <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-[#3B82F6]" />
                Financial Exposure Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#10182B] p-2 rounded border border-[#232D47]">
                  <span className="text-[9px] text-[#667090] block uppercase">Sanctioned</span>
                  <span className="text-xs text-[#E7EBF5] font-bold">
                    {message.financialExposure.sanctioned}
                  </span>
                </div>
                <div className="bg-[#10182B] p-2 rounded border border-[#232D47]">
                  <span className="text-[9px] text-[#667090] block uppercase">Disbursed</span>
                  <span className="text-xs text-[#38BDF8] font-bold">
                    {message.financialExposure.disbursed}
                  </span>
                </div>
                <div className="bg-[#10182B] p-2 rounded border border-[#232D47]">
                  <span className="text-[9px] text-[#667090] block uppercase">Physical Spent</span>
                  <span className="text-xs text-[#22C55E] font-bold">
                    {message.financialExposure.spent}
                  </span>
                </div>
                <div className="bg-[#401515] p-2 rounded border border-[#EF4444]/40">
                  <span className="text-[9px] text-[#FCA5A5] block uppercase">Flagged Exposure</span>
                  <span className="text-xs text-[#EF4444] font-extrabold">
                    {message.financialExposure.exposure}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Evidence Citations (Clickable Navigation) */}
        {message.evidenceCitations && message.evidenceCitations.length > 0 && (
          <div className="px-4 space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#EAB308]" />
              Cited Evidence Artifacts ({message.evidenceCitations.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {message.evidenceCitations.map((citation) => (
                <EvidenceReferenceCard
                  key={citation.id}
                  title={citation.title}
                  description={citation.description}
                  route={citation.route}
                  source={citation.targetType}
                  sourceType={citation.targetType}
                  severity={citation.severity}
                  metric={citation.metric}
                />
              ))}
            </div>
          </div>
        )}

        {/* 6. Rule & Anomaly References */}
        {message.ruleReferences && message.ruleReferences.length > 0 && (
          <div className="px-4 space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
              Triggered Statutory Rules ({message.ruleReferences.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {message.ruleReferences.map((rule) => (
                <div
                  key={rule.code}
                  className="px-2.5 py-1.5 rounded bg-[#0A0E1A] border border-[#232D47] flex items-center gap-2 font-mono text-[10px]"
                >
                  <span className="text-[#EF4444] font-bold">{rule.code}</span>
                  <span className="text-[#667090]">&bull;</span>
                  <span className="text-[#CAD2E2] truncate max-w-[200px]">{rule.title}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#161F36] text-[#38BDF8] text-[9px]">
                    +{rule.weight} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Related Entities */}
        {message.relatedEntities && message.relatedEntities.length > 0 && (
          <div className="px-4 space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#A855F7]" />
              Related Forensic Entities
            </span>
            <div className="flex flex-wrap gap-2">
              {message.relatedEntities.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => navigate(entity.route)}
                  className="px-2.5 py-1 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                >
                  {entity.type === 'case' && <Briefcase className="w-3 h-3 text-[#A855F7]" />}
                  {entity.type === 'vendor' && <Store className="w-3 h-3 text-[#3B82F6]" />}
                  {entity.type === 'agency' && <Building2 className="w-3 h-3 text-[#22C55E]" />}
                  {entity.type === 'mp' && <Users className="w-3 h-3 text-[#F59E0B]" />}
                  {entity.type === 'project' && <FolderKanban className="w-3 h-3 text-[#38BDF8]" />}
                  <span className="text-[#E7EBF5] font-semibold">{entity.name}</span>
                  <span className="text-[10px] text-[#667090]">({entity.role})</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#667090]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. Recommended Next Actions Toolbar */}
        {message.recommendedActions && message.recommendedActions.length > 0 && (
          <div className="px-4 pt-1 border-t border-[#232D47]/80 space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1]">
              Recommended Auditor Actions:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.recommendedActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    'px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border',
                    action.actionType === 'escalate'
                      ? 'bg-[#401515] hover:bg-[#521C1C] text-[#EF4444] border-[#EF4444]/40'
                      : action.actionType === 'open_case'
                      ? 'bg-[#10233F] hover:bg-[#1A3358] text-[#38BDF8] border-[#38BDF8]/40'
                      : 'bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] border-[#232D47]'
                  )}
                >
                  {action.actionType === 'open_case' && <Briefcase className="w-3.5 h-3.5" />}
                  {action.actionType === 'view_evidence' && <FileText className="w-3.5 h-3.5 text-[#EAB308]" />}
                  {action.actionType === 'investigate_project' && <FolderKanban className="w-3.5 h-3.5 text-[#38BDF8]" />}
                  {action.actionType === 'view_vendor' && <Store className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  {action.actionType === 'view_agency' && <Building2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                  {action.actionType === 'escalate' && <Send className="w-3.5 h-3.5 text-[#EF4444]" />}
                  {action.actionType === 'add_note' && <FileSignature className="w-3.5 h-3.5 text-[#F59E0B]" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
