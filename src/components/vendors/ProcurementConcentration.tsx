import React from 'react'
import { PieChart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface ProcurementConcentrationProps {
  concentration: {
    projectSharePercent: number
    agencyConcentrationPercent: number
    constituencyConcentrationPercent: number
    categoryConcentrationPercent: number
    singleBidderRatePercent: number
    consecutiveAwardsCount: number
  }
}

export const ProcurementConcentration: React.FC<ProcurementConcentrationProps> = ({
  concentration,
}) => {
  const isHighConcentration =
    concentration.constituencyConcentrationPercent > 50 ||
    concentration.agencyConcentrationPercent > 50 ||
    concentration.consecutiveAwardsCount >= 6

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="HERFINDAHL-HIRSCHMAN CONCENTRATION RATIO AUDIT"
        action={
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
              isHighConcentration
                ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                : 'bg-[#10233F] text-[#3B82F6] border-[#3B82F6]/60'
            }`}
          >
            {isHighConcentration ? 'ELEVATED CONCENTRATION' : 'NORMAL DISTRIBUTION'}
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Procurement Concentration</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-[#9AA5C1]">
          Concentration ratios evaluate monopoly exposure and non-competitive repeat procurement
          across municipal divisions and state agencies.
        </p>

        {/* 5 Compact Metric Progress Bars */}
        <div className="space-y-2.5">
          {/* 1. Vendor Project Share */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5C1]">System Project Share:</span>
              <span className="font-bold text-[#E7EBF5]">
                {concentration.projectSharePercent}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#232D47]">
              <div
                style={{ width: `${Math.min(100, concentration.projectSharePercent * 4)}%` }}
                className="h-full bg-[#3B82F6] transition-all duration-300"
              />
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Share of all monitored regional MPLADS projects awarded to this entity
            </span>
          </div>

          {/* 2. Same Agency Share */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5C1]">Same Agency Concentration:</span>
              <span
                className={`font-bold ${
                  concentration.agencyConcentrationPercent > 50 ? 'text-[#EF4444]' : 'text-[#E7EBF5]'
                }`}
              >
                {concentration.agencyConcentrationPercent}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#232D47]">
              <div
                style={{ width: `${concentration.agencyConcentrationPercent}%` }}
                className={`h-full transition-all duration-300 ${
                  concentration.agencyConcentrationPercent > 50 ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                }`}
              />
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Proportion of vendor works originating from a single implementing department
            </span>
          </div>

          {/* 3. Same Constituency Share */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5C1]">Same Constituency Concentration:</span>
              <span
                className={`font-bold ${
                  concentration.constituencyConcentrationPercent > 50 ? 'text-[#EF4444]' : 'text-[#E7EBF5]'
                }`}
              >
                {concentration.constituencyConcentrationPercent}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#232D47]">
              <div
                style={{ width: `${concentration.constituencyConcentrationPercent}%` }}
                className={`h-full transition-all duration-300 ${
                  concentration.constituencyConcentrationPercent > 50 ? 'bg-[#EF4444]' : 'bg-[#22C55E]'
                }`}
              />
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Proportion of contracts executed within the same parliamentary constituency
            </span>
          </div>

          {/* 4. Category Concentration */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5C1]">Single Category Concentration:</span>
              <span className="font-bold text-[#E7EBF5]">
                {concentration.categoryConcentrationPercent}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#232D47]">
              <div
                style={{ width: `${concentration.categoryConcentrationPercent}%` }}
                className="h-full bg-[#3B82F6] transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Consecutive Awards KPI Box */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232D47]">
          <div className="bg-[#0A0E1A] p-2 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold block">
              CONSECUTIVE AWARDS
            </span>
            <span
              className={`font-mono text-sm font-bold block mt-0.5 ${
                concentration.consecutiveAwardsCount >= 6 ? 'text-[#EF4444]' : 'text-[#F59E0B]'
              }`}
            >
              {concentration.consecutiveAwardsCount} Contracts
            </span>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              Awarded sequentially in same division
            </span>
          </div>

          <div className="bg-[#0A0E1A] p-2 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold block">
              SINGLE-BIDDER RATIO
            </span>
            <span
              className={`font-mono text-sm font-bold block mt-0.5 ${
                concentration.singleBidderRatePercent > 30 ? 'text-[#EF4444]' : 'text-[#22C55E]'
              }`}
            >
              {concentration.singleBidderRatePercent}%
            </span>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              Tenders with single technical bidder
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
