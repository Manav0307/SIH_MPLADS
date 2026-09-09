import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { BarChart3, TrendingUp, DollarSign, PieChart } from 'lucide-react'
import { MpRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface FundUtilizationChartProps {
  mps: MpRecord[]
}

export const FundUtilizationChart: React.FC<FundUtilizationChartProps> = ({ mps }) => {
  // Aggregate totals
  let totalRecommended = 0
  let totalSanctioned = 0
  let totalDisbursed = 0

  mps.forEach((m) => {
    totalRecommended += m.recommendedAmount
    totalSanctioned += m.sanctionedAmount
    totalDisbursed += m.disbursedAmount
  })

  const unutilized = Math.max(0, totalSanctioned - totalDisbursed)
  const sanctionedVsRecommendedPct = totalRecommended > 0
    ? ((totalSanctioned / totalRecommended) * 100).toFixed(1)
    : '0.0'
  const disbursedVsSanctionedPct = totalSanctioned > 0
    ? ((totalDisbursed / totalSanctioned) * 100).toFixed(1)
    : '0.0'

  // Prepare chart dataset (top 8 or slice for clean visual readability)
  const chartData = mps.slice(0, 10).map((m) => {
    const shortName = m.constituency.split('(')[0].trim()
    return {
      name: shortName,
      fullName: `${m.name} (${m.constituency})`,
      Recommended: Math.round((m.recommendedAmount / 10000000) * 100) / 100,
      Sanctioned: Math.round((m.sanctionedAmount / 10000000) * 100) / 100,
      Disbursed: Math.round((m.disbursedAmount / 10000000) * 100) / 100,
    }
  })

  const formatCr = (val: number) => `₹ ${(val / 10000000).toFixed(2)} Cr`

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`DATASET: ${mps.length} CONSTITUENCIES MONITORED`}
        action={
          <span className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] border border-[#22C55E60] px-2 py-0.5 rounded font-bold uppercase">
            PFMS VALIDATED
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>National Constituency Fund Utilization</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* KPI Strip: Sanctioned/Recommended %, Disbursed/Sanctioned %, Unutilized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0A0E1A] p-2.5 rounded-lg border border-[#232D47]">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#3B82F6]" />
              SANCTIONED / RECOMMENDED
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {sanctionedVsRecommendedPct}%
              </span>
              <span className="font-mono text-[10px] text-[#667090]">
                OF DPR PROPOSALS
              </span>
            </div>
          </div>

          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold flex items-center gap-1">
              <PieChart className="w-3 h-3 text-[#22C55E]" />
              DISBURSED / SANCTIONED
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-base font-bold text-[#22C55E]">
                {disbursedVsSanctionedPct}%
              </span>
              <span className="font-mono text-[10px] text-[#667090]">
                CAPITAL RELEASE
              </span>
            </div>
          </div>

          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#EF4444] uppercase font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#EF4444]" />
              UNUTILIZED SANCTION BALANCE
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-base font-bold text-[#EF4444]">
                {formatCr(unutilized)}
              </span>
              <span className="font-mono text-[10px] text-[#667090]">
                IDLE TREASURY
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="w-full h-56 pt-2">
          {chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-[#667090] font-sans">
              No constituency fund utilization records found for the selected filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={35}
                />
                <YAxis
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload
                      return (
                        <div className="bg-[#10182B] border border-[#232D47] p-2.5 rounded shadow-lg text-xs font-mono space-y-1">
                          <div className="text-[#E7EBF5] font-bold pb-1 border-b border-[#232D47]">
                            {item.fullName || label}
                          </div>
                          <div className="text-[#9AA5C1] flex items-center justify-between gap-3">
                            <span>Recommended:</span>
                            <span className="text-[#E7EBF5] font-semibold">₹ {item.Recommended} Cr</span>
                          </div>
                          <div className="text-[#3B82F6] flex items-center justify-between gap-3">
                            <span>Sanctioned:</span>
                            <span className="font-semibold">₹ {item.Sanctioned} Cr</span>
                          </div>
                          <div className="text-[#22C55E] flex items-center justify-between gap-3">
                            <span>Disbursed:</span>
                            <span className="font-semibold">₹ {item.Disbursed} Cr</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={8}
                  wrapperStyle={{
                    paddingBottom: '8px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}
                />
                <Bar
                  dataKey="Recommended"
                  fill="#424754"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="Sanctioned"
                  fill="#3B82F6"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="Disbursed"
                  fill="#22C55E"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
