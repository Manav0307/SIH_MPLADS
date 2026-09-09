import React from 'react'
import { Users2, Info, AlertCircle, Database } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface DemographicParityProps {
  constituencyName: string
  stateName: string
  // Optional real data slots ready for future Census/Delimitation pipeline ingestion
  populationShare?: number
  fundShare?: number
  parityGap?: number
  parityIndicator?: string
}

export const DemographicParity: React.FC<DemographicParityProps> = ({
  constituencyName,
  stateName,
  populationShare,
  fundShare,
  parityGap,
  parityIndicator,
}) => {
  const isDataAvailable = populationShare !== undefined && fundShare !== undefined

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="DEMOGRAPHIC REGISTRY // STATUTORY CENSUS MAPPING"
        action={
          <span className="font-mono text-[10px] text-[#9AA5C1] bg-[#161F36] border border-[#232D47] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <Database className="w-2.5 h-2.5 text-[#3B82F6]" />
            CENSUS ETL: PENDING
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Demographic Funding Parity</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Official Audit Notice */}
        <div className="p-2.5 bg-[#0D1424] border border-[#232D47] rounded-lg text-xs font-sans space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#9AA5C1] uppercase">
            <Info className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
            <span>Audit Notice // Demographic Microdata Integration</span>
          </div>
          <p className="text-[11px] text-[#9AA5C1] leading-relaxed">
            Per national auditing standards, demographic parity analysis evaluates whether developmental allocations reflect proportional population distributions. Funding variations are evaluated as <strong className="text-[#E7EBF5]">Funding Distribution Deviation</strong> indicators, not prima facie evidence of irregularity.
          </p>
        </div>

        {/* Parity Comparison Grid: Ready for future dataset plug-in */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* 1. Population Share */}
          <div className="p-2.5 bg-[#0A0E1A] border border-[#232D47] rounded-lg">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] block">
              POPULATION SHARE
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              {isDataAvailable ? (
                <span className="font-mono text-base font-bold text-[#E7EBF5]">
                  {populationShare?.toFixed(2)}%
                </span>
              ) : (
                <span className="font-mono text-sm font-bold text-[#667090] tracking-wider">
                  --
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              {isDataAvailable ? 'State Electorate Ratio' : 'Awaiting Census Delimitation Ingestion'}
            </span>
          </div>

          {/* 2. Fund Share */}
          <div className="p-2.5 bg-[#0A0E1A] border border-[#232D47] rounded-lg">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] block">
              FUND SHARE
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              {isDataAvailable ? (
                <span className="font-mono text-base font-bold text-[#3B82F6]">
                  {fundShare?.toFixed(2)}%
                </span>
              ) : (
                <span className="font-mono text-sm font-bold text-[#667090] tracking-wider">
                  --
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              {isDataAvailable ? 'State Total Sanction Ratio' : 'Awaiting Census Delimitation Ingestion'}
            </span>
          </div>

          {/* 3. Parity Gap (Difference in percentage points) */}
          <div className="p-2.5 bg-[#0A0E1A] border border-[#232D47] rounded-lg">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] block">
              PARITY GAP (PPT)
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              {isDataAvailable ? (
                <span className="font-mono text-base font-bold text-[#E7EBF5]">
                  {(parityGap ?? 0) >= 0 ? `+${parityGap?.toFixed(2)}` : parityGap?.toFixed(2)} pts
                </span>
              ) : (
                <span className="font-mono text-sm font-bold text-[#667090] tracking-wider">
                  --
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              Difference in Percentage Points
            </span>
          </div>

          {/* 4. Parity Indicator */}
          <div className="p-2.5 bg-[#0A0E1A] border border-[#232D47] rounded-lg">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] block">
              PARITY STATUS
            </span>
            <div className="mt-1">
              {isDataAvailable ? (
                <span className="font-mono text-xs font-bold text-[#22C55E]">
                  {parityIndicator || 'Normal Distribution'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#9AA5C1] px-1.5 py-0.5 rounded bg-[#161F36] border border-[#232D47]">
                  <AlertCircle className="w-2.5 h-2.5 text-[#F59E0B]" />
                  FEED OFFLINE
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#667090] font-sans block mt-0.5">
              Statutory Census Dataset Required
            </span>
          </div>
        </div>

        {/* Data Honesty Disclaimer Box */}
        <div className="p-2 rounded bg-[#0A0E1A]/60 border border-[#232D47]/60 text-[10px] text-[#667090] flex items-center justify-between">
          <span>Target Scope: {constituencyName} ({stateName})</span>
          <span className="font-mono">DATA INTEGRITY // ZERO SYNTHETIC DEMOGRAPHICS FABRICATED</span>
        </div>
      </CardContent>
    </Card>
  )
}
