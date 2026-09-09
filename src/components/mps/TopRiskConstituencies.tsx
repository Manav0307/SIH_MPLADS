import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { MpRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface TopRiskConstituenciesProps {
  mps: MpRecord[]
  limit?: number
}

export const TopRiskConstituencies: React.FC<TopRiskConstituenciesProps> = ({
  mps,
  limit = 12,
}) => {
  const navigate = useNavigate()

  const topConstituencies = [...mps]
    .sort((a, b) => b.riskScore - a.riskScore || b.flaggedProjectsCount - a.flaggedProjectsCount)
    .slice(0, limit)

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`RANKED BY STATISTICAL ANOMALY INDEX // TOP ${topConstituencies.length}`}
        action={
          <span className="font-mono text-[10px] text-[#EF4444] bg-[#401515] border border-[#EF444460] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
            PRIORITY AUDIT
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Highest-Risk Constituencies</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-2 space-y-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {topConstituencies.map((mp, index) => {
            const isTop3 = index < 3
            return (
              <div
                key={mp.id}
                onClick={() => navigate(`/mps/${mp.id}`)}
                className={`flex flex-col p-2.5 rounded-lg border transition-all cursor-pointer group select-none ${
                  isTop3
                    ? 'bg-[#161F36] hover:bg-[#1E294B] border-[#EF4444]/40 hover:border-[#EF4444]'
                    : 'bg-[#0D1424] hover:bg-[#161F36] border-[#232D47] hover:border-[#3B82F6]/60'
                }`}
              >
                {/* Header: Rank, Constituency & Risk Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isTop3
                          ? 'bg-[#401515] text-[#EF4444] border border-[#EF4444]/60'
                          : 'bg-[#10182B] text-[#9AA5C1] border border-[#232D47]'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#E7EBF5] truncate group-hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                        <span>{mp.constituency}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#3B82F6] shrink-0" />
                      </div>
                      <div className="text-[10px] text-[#667090] font-sans">
                        {mp.state} &bull; {mp.district}
                      </div>
                    </div>
                  </div>

                  <RiskBadge
                    level={mp.riskLevel}
                    score={mp.riskScore}
                    withPip={mp.riskLevel === 'critical'}
                    pulse={isTop3}
                    size="sm"
                  />
                </div>

                {/* MP name & Parliamentary House */}
                <div className="mt-2 pt-1.5 border-t border-[#232D47]/60 flex items-center justify-between text-xs font-sans">
                  <div className="text-[#9AA5C1] truncate">
                    <span className="text-[#667090]">MP:</span>{' '}
                    <span className="text-[#E7EBF5] font-medium">{mp.name}</span>
                    <span className="text-[10px] text-[#667090] font-mono ml-1">({mp.house})</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#9AA5C1] shrink-0">
                    {mp.party}
                  </div>
                </div>

                {/* Metrics: Flagged Projects & Disbursed */}
                <div className="grid grid-cols-2 gap-2 mt-2 bg-[#0A0E1A]/80 p-1.5 rounded border border-[#232D47]/80 text-[10px] font-mono">
                  <div>
                    <span className="text-[#667090] uppercase block">FLAGGED</span>
                    <span className="text-[#EF4444] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                      {mp.flaggedProjectsCount} of {mp.projectsCount} works
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#667090] uppercase block">DISBURSED</span>
                    <span className="text-[#22C55E] font-bold">
                      {mp.disbursedDisplay}
                    </span>
                  </div>
                </div>

                {/* Primary Anomaly */}
                <div className="mt-2 text-[10px] text-[#F59E0B] bg-[#3A2A0C]/40 border border-[#F59E0B]/30 rounded p-1.5 line-clamp-1">
                  <span className="font-mono font-bold uppercase text-[#F59E0B]/80 text-[9px] mr-1">ANOMALY:</span>
                  {mp.primaryRisk}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
