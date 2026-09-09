import React from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  FolderKanban,
  Store,
  Users,
  Building2,
  X,
  ExternalLink,
  ShieldAlert,
  Search,
} from 'lucide-react'
import { AssistantContext } from '@/types/assistant'
import { cn } from '@/lib/utils'

interface AssistantContextIndicatorProps {
  context: AssistantContext | null
  onClearContext: () => void
  onSelectContextModal?: () => void
}

export const AssistantContextIndicator: React.FC<AssistantContextIndicatorProps> = ({
  context,
  onClearContext,
  onSelectContextModal,
}) => {
  if (!context) {
    return (
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 text-xs text-[#9AA5C1]">
          <span className="w-2 h-2 rounded-full bg-[#667090]" />
          <span className="font-mono text-[11px] text-[#9AA5C1]">
            Global Intelligence Context (No specific entity pinned)
          </span>
        </div>

        {onSelectContextModal && (
          <button
            type="button"
            onClick={onSelectContextModal}
            className="text-[10px] font-mono text-[#3B82F6] hover:text-[#adc6ff] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>Pin Entity Context</span>
          </button>
        )}
      </div>
    )
  }

  const getTargetUrl = () => {
    switch (context.type) {
      case 'case':
        return `/cases?id=${encodeURIComponent(context.id)}`
      case 'project':
        return `/investigation?project=${encodeURIComponent(context.id)}`
      case 'vendor':
        return `/vendors/${encodeURIComponent(context.title)}`
      case 'mp':
        return `/mps/${encodeURIComponent(context.id)}`
      case 'agency':
        return `/agencies/${encodeURIComponent(context.id)}`
      default:
        return '/'
    }
  }

  const getTypeIcon = () => {
    switch (context.type) {
      case 'case':
        return <Briefcase className="w-3.5 h-3.5 text-[#A855F7]" />
      case 'project':
        return <FolderKanban className="w-3.5 h-3.5 text-[#38BDF8]" />
      case 'vendor':
        return <Store className="w-3.5 h-3.5 text-[#3B82F6]" />
      case 'mp':
        return <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
      case 'agency':
        return <Building2 className="w-3.5 h-3.5 text-[#22C55E]" />
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-[#9AA5C1]" />
    }
  }

  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg px-3.5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 select-none shadow-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded bg-[#0A0E1A] border border-[#232D47] flex items-center justify-center shrink-0">
          {getTypeIcon()}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47] uppercase">
              {context.type.toUpperCase()} CONTEXT
            </span>

            {context.workCode && (
              <span className="font-mono text-[10px] text-[#38BDF8] font-semibold">
                {context.workCode}
              </span>
            )}

            {context.riskScore !== undefined && (
              <span
                className={cn(
                  'font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border',
                  context.riskLevel === 'critical'
                    ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                    : 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                )}
              >
                {context.riskScore}/100 RISK
              </span>
            )}

            <span className="text-xs font-bold text-[#E7EBF5] truncate max-w-sm">
              {context.title}
            </span>
          </div>

          {context.metadata && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#9AA5C1] flex-wrap">
              {Object.entries(context.metadata).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="text-[#667090]">{k}:</span>
                  <span className="text-[#CAD2E2]">{v}</span>
                  <span className="text-[#232D47]">&bull;</span>
                </span>
              ))}
              {context.location && (
                <span className="text-[#667090]">{context.location}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        <Link
          to={getTargetUrl()}
          className="px-2 py-1 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-[11px] text-[#38BDF8] font-mono flex items-center gap-1 transition-colors"
        >
          <span>Inspect {context.type}</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <button
          type="button"
          onClick={onClearContext}
          className="p-1 rounded hover:bg-[#161F36] text-[#667090] hover:text-[#E7EBF5] transition-colors border border-transparent hover:border-[#232D47] cursor-pointer"
          title="Clear Context"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
