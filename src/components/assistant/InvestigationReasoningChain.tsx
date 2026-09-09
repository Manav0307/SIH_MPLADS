import React, { useState } from 'react'
import {
  FileSearch,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { InvestigationReasoningChain as ChainType } from '@/types/assistant'
import { cn } from '@/lib/utils'

interface InvestigationReasoningChainProps {
  chain: ChainType
}

export const InvestigationReasoningChain: React.FC<InvestigationReasoningChainProps> = ({ chain }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const steps = [
    {
      key: 'evidence',
      number: '01',
      title: 'Evidence',
      subtitle: chain.evidence.title,
      description: chain.evidence.description,
      metric: chain.evidence.metric,
      icon: <FileSearch className="w-3.5 h-3.5" />,
      color: 'border-[#3B82F6]/50 text-[#38BDF8] bg-[#10233F]',
      badgeBg: 'bg-[#3B82F6]/10 text-[#38BDF8] border-[#3B82F6]/30',
    },
    {
      key: 'finding',
      number: '02',
      title: 'Finding',
      subtitle: chain.finding.title,
      description: chain.finding.description,
      metric: chain.finding.metric,
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      color: 'border-[#F59E0B]/50 text-[#FBBF24] bg-[#3A2A0C]',
      badgeBg: 'bg-[#F59E0B]/10 text-[#FBBF24] border-[#F59E0B]/30',
    },
    {
      key: 'riskAssessment',
      number: '03',
      title: 'Risk Assessment',
      subtitle: chain.riskAssessment.title,
      description: chain.riskAssessment.description,
      metric: chain.riskAssessment.metric,
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      color: 'border-[#EF4444]/60 text-[#F87171] bg-[#401515]',
      badgeBg: 'bg-[#EF4444]/10 text-[#F87171] border-[#EF4444]/40',
    },
    {
      key: 'impact',
      number: '04',
      title: 'Impact',
      subtitle: chain.impact.title,
      description: chain.impact.description,
      metric: chain.impact.metric,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      color: 'border-[#A855F7]/50 text-[#C084FC] bg-[#2A163E]',
      badgeBg: 'bg-[#A855F7]/10 text-[#C084FC] border-[#A855F7]/30',
    },
    {
      key: 'recommendedAction',
      number: '05',
      title: 'Recommended Action',
      subtitle: chain.recommendedAction.title,
      description: chain.recommendedAction.description,
      metric: chain.recommendedAction.metric,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: 'border-[#22C55E]/50 text-[#4ADE80] bg-[#0F3020]',
      badgeBg: 'bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/30',
    },
  ]

  return (
    <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-3 space-y-2.5">
      {/* Chain Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            Forensic Reasoning Chain
          </span>
          <span className="font-mono text-[9px] text-[#667090] hidden sm:inline">
            (Evidence &rarr; Finding &rarr; Risk &rarr; Impact &rarr; Action)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-mono text-[#9AA5C1] hover:text-[#E7EBF5] flex items-center gap-1 transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Expand Chain</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Chain Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
        {steps.map((step, idx) => (
          <div
            key={step.key}
            className={cn(
              'flex flex-col justify-between p-2.5 rounded border transition-all relative',
              step.color,
              !isExpanded && 'py-1.5'
            )}
          >
            {/* Step Top */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0">{step.icon}</span>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                    {step.title}
                  </span>
                </div>
                <span className="font-mono text-[9px] opacity-60">#{step.number}</span>
              </div>

              <h4 className="font-sans text-xs font-bold text-[#E7EBF5] leading-tight line-clamp-2">
                {step.subtitle}
              </h4>

              {isExpanded && (
                <p className="font-sans text-[11px] text-[#CAD2E2] leading-relaxed pt-1">
                  {step.description}
                </p>
              )}
            </div>

            {/* Step Metric Pill */}
            {step.metric && (
              <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
                <span
                  className={cn(
                    'font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border truncate max-w-full',
                    step.badgeBg
                  )}
                >
                  {step.metric}
                </span>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#667090] hidden md:block shrink-0 -mr-1" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
