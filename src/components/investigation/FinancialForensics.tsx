import React from 'react'
import { Landmark, AlertTriangle } from 'lucide-react'
import { FinancialForensicsData } from '@/types'

interface FinancialForensicsProps {
  data: FinancialForensicsData
}

export const FinancialForensics: React.FC<FinancialForensicsProps> = ({ data }) => {
  // Find maximum amount for proportional bar display
  const maxAmount = Math.max(
    data.recommendedAmount,
    data.sanctionedAmount,
    data.disbursedAmount,
    data.spentAmount,
    data.benchmarkAmount || 1
  )

  const getWidthPercent = (amount: number) => {
    return `${Math.max(5, Math.min(100, (amount / maxAmount) * 100))}%`
  }

  return (
    <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
        <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-[#3B82F6]" />
          Financial Forensics Comparison
        </span>
        <span className="font-mono text-[10px] text-[#EF4444] font-semibold">
          DISCREPANCY DETECTED
        </span>
      </div>

      {/* Discrepancy Alert Callout */}
      {data.discrepancyNote && (
        <div className="flex items-start gap-2 p-2 rounded bg-[#401515]/60 border border-[#EF4444]/40 text-xs">
          <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#ffdad6] font-sans">
            <span className="font-bold text-[#EF4444]">FORENSIC AUDIT FLAG: </span>
            {data.discrepancyNote}
          </div>
        </div>
      )}

      {/* Comparative Horizontal Bars */}
      <div className="space-y-2 text-xs">
        {/* Recommended */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#9AA5C1]">1. MP Recommended</span>
            <span className="text-[#E7EBF5] font-semibold">{data.recommendedDisplay}</span>
          </div>
          <div className="w-full bg-[#161F36] h-2 rounded overflow-hidden">
            <div
              className="bg-[#3B82F6] h-full rounded transition-all duration-500"
              style={{ width: getWidthPercent(data.recommendedAmount) }}
            />
          </div>
        </div>

        {/* Sanctioned */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#9AA5C1]">2. Admin Sanctioned</span>
            <span className="text-[#E7EBF5] font-semibold">{data.sanctionedDisplay}</span>
          </div>
          <div className="w-full bg-[#161F36] h-2 rounded overflow-hidden">
            <div
              className="bg-[#9AA5C1] h-full rounded transition-all duration-500"
              style={{ width: getWidthPercent(data.sanctionedAmount) }}
            />
          </div>
        </div>

        {/* Disbursed */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#EF4444] font-bold">3. Tranches Disbursed</span>
            <span className="text-[#EF4444] font-bold font-tabular">{data.disbursedDisplay}</span>
          </div>
          <div className="w-full bg-[#161F36] h-2 rounded overflow-hidden">
            <div
              className="bg-[#EF4444] h-full rounded transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              style={{ width: getWidthPercent(data.disbursedAmount) }}
            />
          </div>
        </div>

        {/* Spent */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#9AA5C1]">4. Physical Work Spent (Reported)</span>
            <span className="text-[#EAB308] font-semibold font-tabular">{data.spentDisplay}</span>
          </div>
          <div className="w-full bg-[#161F36] h-2 rounded overflow-hidden">
            <div
              className="bg-[#EAB308] h-full rounded transition-all duration-500"
              style={{ width: getWidthPercent(data.spentAmount) }}
            />
          </div>
        </div>

        {/* Benchmark */}
        <div className="space-y-0.5 pt-1">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#667090]">Category Standard Benchmark</span>
            <span className="text-[#22C55E] font-semibold font-tabular">{data.benchmarkDisplay}</span>
          </div>
          <div className="w-full bg-[#161F36] h-1.5 rounded overflow-hidden">
            <div
              className="bg-[#22C55E]/70 h-full rounded transition-all duration-500"
              style={{ width: getWidthPercent(data.benchmarkAmount) }}
            />
          </div>
        </div>
      </div>

      {/* Discrepancy Ratios Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#232D47]">
        {/* Disbursed / Sanctioned % */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <span className="text-[9px] font-mono text-[#9AA5C1] uppercase leading-tight">
            Disbursed / Sanctioned
          </span>
          <span
            className={`font-mono text-sm font-bold mt-1 font-tabular ${
              data.disbursedPercent >= 90 ? 'text-[#EF4444]' : 'text-[#E7EBF5]'
            }`}
          >
            {data.disbursedPercent.toFixed(1)}%
          </span>
          <span className="text-[9px] font-mono text-[#667090]">
            {data.disbursedPercent >= 90 ? 'High Burn Pace' : 'Normal Rate'}
          </span>
        </div>

        {/* Spent / Disbursed % */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <span className="text-[9px] font-mono text-[#9AA5C1] uppercase leading-tight">
            Spent / Disbursed
          </span>
          <span
            className={`font-mono text-sm font-bold mt-1 font-tabular ${
              data.spentVsDisbursedPercent < 50 ? 'text-[#EF4444]' : 'text-[#22C55E]'
            }`}
          >
            {data.spentVsDisbursedPercent.toFixed(1)}%
          </span>
          <span className="text-[9px] font-mono text-[#667090]">
            {data.spentVsDisbursedPercent < 50 ? 'Idle in Account' : 'Utilized'}
          </span>
        </div>

        {/* Cost vs Benchmark % */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] flex flex-col">
          <span className="text-[9px] font-mono text-[#9AA5C1] uppercase leading-tight">
            Cost vs Benchmark
          </span>
          <span
            className={`font-mono text-sm font-bold mt-1 font-tabular ${
              data.costVsBenchmarkPercent > 150 ? 'text-[#EF4444]' : 'text-[#F59E0B]'
            }`}
          >
            +{data.costVsBenchmarkPercent - 100}%
          </span>
          <span className="text-[9px] font-mono text-[#EF4444] font-semibold">
            {data.costVsBenchmarkPercent > 150 ? 'Severe Inflation' : 'Within Band'}
          </span>
        </div>
      </div>
    </div>
  )
}
