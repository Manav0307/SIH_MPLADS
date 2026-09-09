import React from 'react'
import { Cpu, Scale, BrainCircuit, ShieldCheck } from 'lucide-react'
import { RiskScoreBreakdown, RiskLevel } from '@/types'

interface RiskBreakdownProps {
  breakdown: RiskScoreBreakdown
  riskLevel: RiskLevel
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ breakdown, riskLevel }) => {
  const isCritical = riskLevel === 'critical'
  const isHigh = riskLevel === 'high'

  const scoreColor = isCritical
    ? 'text-[#EF4444]'
    : isHigh
    ? 'text-[#F59E0B]'
    : 'text-[#EAB308]'

  const scoreBg = isCritical
    ? 'bg-[#401515] border-[#EF4444]/40'
    : isHigh
    ? 'bg-[#3A2A0C] border-[#F59E0B]/40'
    : 'bg-[#362E0C] border-[#EAB308]/40'

  return (
    <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2.5 select-none">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
        <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-[#3B82F6]" />
          Multi-Engine Risk Score Breakdown
        </span>
        <span className="font-mono text-[10px] text-[#667090]">TRIPARTITE MODEL V4</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Rule Engine */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-[#9AA5C1] font-mono">
            <Scale className="w-3 h-3 text-[#3B82F6]" />
            <span>Rule Engine</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#E7EBF5] font-tabular">
              {breakdown.ruleEngine}
            </span>
            <span className="text-[10px] font-mono text-[#667090]">/ 40 max</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#161F36] h-1 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#3B82F6] h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.ruleEngine / 40) * 100)}%` }}
            />
          </div>
        </div>

        {/* Statistical Engine */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-[#9AA5C1] font-mono">
            <Cpu className="w-3 h-3 text-[#EAB308]" />
            <span>Statistical</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#E7EBF5] font-tabular">
              {breakdown.statisticalEngine}
            </span>
            <span className="text-[10px] font-mono text-[#667090]">/ 30 max</span>
          </div>
          <div className="w-full bg-[#161F36] h-1 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#EAB308] h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.statisticalEngine / 30) * 100)}%` }}
            />
          </div>
        </div>

        {/* ML Engine */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-[#9AA5C1] font-mono">
            <ShieldCheck className="w-3 h-3 text-[#EF4444]" />
            <span>ML Engine</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#E7EBF5] font-tabular">
              {breakdown.mlEngine}
            </span>
            <span className="text-[10px] font-mono text-[#667090]">/ 30 max</span>
          </div>
          <div className="w-full bg-[#161F36] h-1 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#EF4444] h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.mlEngine / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Consolidated Total Strip */}
      <div className={`flex items-center justify-between p-2 rounded border ${scoreBg}`}>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase font-bold text-[#E7EBF5] leading-tight">
            Consolidated Risk Score
          </span>
          <span className="text-[10px] font-mono text-[#9AA5C1] leading-tight">
            Weighted harmonic ensemble of statutory, statistical & graph embeddings
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono text-xl font-extrabold font-tabular ${scoreColor}`}>
            {breakdown.consolidatedScore}
          </span>
          <span className="font-mono text-[10px] text-[#9AA5C1]">/ 100</span>
        </div>
      </div>
    </div>
  )
}
