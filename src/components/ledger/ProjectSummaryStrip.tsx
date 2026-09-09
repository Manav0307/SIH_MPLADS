import React from 'react'

interface ProjectSummaryStripProps {
  projectsCount: number
  totalSanctioned: number
  totalDisbursed: number
  totalSpent: number
  flaggedCount: number
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

export const ProjectSummaryStrip: React.FC<ProjectSummaryStripProps> = ({
  projectsCount,
  totalSanctioned,
  totalDisbursed,
  totalSpent,
  flaggedCount,
}) => {
  const disbursedPct = totalSanctioned > 0 ? ((totalDisbursed / totalSanctioned) * 100).toFixed(1) : '0.0'
  const spentPct = totalDisbursed > 0 ? ((totalSpent / totalDisbursed) * 100).toFixed(1) : '0.0'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#0D1424] border border-[#232D47] rounded-lg p-2.5 select-none">
      {/* 1. Projects */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
          PROJECTS
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {projectsCount.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-[#667090]">ACTIVE</span>
        </div>
      </div>

      {/* 2. Sanctioned */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
          SANCTIONED
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5]">
            {formatCurrency(totalSanctioned)}
          </span>
        </div>
      </div>

      {/* 3. Disbursed */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
          DISBURSED
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#3B82F6]">
            {formatCurrency(totalDisbursed)}
          </span>
          <span className="font-mono text-[10px] text-[#3B82F6]/70">({disbursedPct}%)</span>
        </div>
      </div>

      {/* 4. Spent */}
      <div className="flex flex-col border-l border-[#232D47] pl-3">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider">
          SPENT
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#22C55E]">
            {formatCurrency(totalSpent)}
          </span>
          <span className="font-mono text-[10px] text-[#22C55E]/70">({spentPct}% of disb)</span>
        </div>
      </div>

      {/* 5. Flagged */}
      <div className="flex flex-col border-l border-[#232D47] pl-3 col-span-2 sm:col-span-1">
        <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          FLAGGED
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono font-tabular text-sm font-bold text-[#EF4444]">
            {flaggedCount.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-[#EF4444]/80">
            ({projectsCount > 0 ? ((flaggedCount / projectsCount) * 100).toFixed(1) : 0}%)
          </span>
        </div>
      </div>
    </div>
  )
}
