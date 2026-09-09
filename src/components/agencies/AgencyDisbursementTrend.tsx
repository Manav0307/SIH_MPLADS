import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Calendar, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface FyDisbursement {
  fy: string
  disbursedAmount: number
  disbursedDisplay: string
  worksCount: number
}

interface AgencyDisbursementTrendProps {
  disbursementsByFy: FyDisbursement[]
}

export const AgencyDisbursementTrend: React.FC<AgencyDisbursementTrendProps> = ({
  disbursementsByFy,
}) => {
  // Filter out FYs with no disbursements or works to assess data availability
  const activeFys = disbursementsByFy.filter((d) => d.disbursedAmount > 0 || d.worksCount > 0)
  const isLimitedData = activeFys.length <= 1

  // Format chart data in Lakhs
  const chartData = disbursementsByFy.map((d) => ({
    fy: d.fy,
    amountLakhs: Number((d.disbursedAmount / 100000).toFixed(1)),
    display: d.disbursedDisplay,
    worksCount: d.worksCount,
  }))

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="TEMPORAL PFMS DISBURSEMENTS // ANNUAL AUDIT CADENCE"
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            ANNUAL TREND
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Disbursement Trend</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLimitedData && (
          <div className="flex items-start gap-2 p-2 bg-[#10233F]/50 border border-[#3B82F6]/40 rounded text-[11px] text-[#9AA5C1] font-mono">
            <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#E7EBF5]">Limited Temporal Span:</strong> Historical
              multi-year longitudinal trend data is currently limited to active PFMS recording
              cycles for this executing authority.
            </span>
          </div>
        )}

        <div className="h-44 w-full bg-[#0A0E1A] p-2.5 rounded-lg border border-[#232D47]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
              <XAxis
                dataKey="fy"
                stroke="#667090"
                tick={{ fill: '#9AA5C1', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#232D47' }}
              />
              <YAxis
                stroke="#667090"
                tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#232D47' }}
                unit=" L"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-[#10182B] border border-[#232D47] p-2 rounded shadow-lg font-mono text-xs">
                        <p className="font-bold text-[#E7EBF5]">{data.fy}</p>
                        <p className="text-[#22C55E]">Disbursed: {data.display}</p>
                        <p className="text-[#9AA5C1]">Works Executed: {data.worksCount}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amountLakhs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table for FYs */}
        <div className="grid grid-cols-3 gap-2">
          {disbursementsByFy.map((d) => (
            <div
              key={d.fy}
              className="p-2 bg-[#0A0E1A] border border-[#232D47] rounded flex flex-col justify-between"
            >
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase">{d.fy}</span>
              <span className="font-mono text-xs font-bold text-[#E7EBF5] mt-1">
                {d.disbursedDisplay}
              </span>
              <span className="text-[10px] text-[#667090] font-mono">
                {d.worksCount} works recorded
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
