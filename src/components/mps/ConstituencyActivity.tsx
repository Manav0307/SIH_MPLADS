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
import { Calendar, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface ConstituencyActivityProps {
  activityByFy: {
    fy: string
    projectsCount: number
    sanctionedAmount: number
  }[]
  constituencyName: string
}

export const ConstituencyActivity: React.FC<ConstituencyActivityProps> = ({
  activityByFy,
  constituencyName,
}) => {
  const activeFys = activityByFy.filter((a) => a.projectsCount > 0)
  const isLimitedData = activeFys.length < 3

  const chartData = activityByFy.map((a) => ({
    fy: a.fy,
    Works: a.projectsCount,
    SanctionedCr: Math.round((a.sanctionedAmount / 10000000) * 100) / 100,
  }))

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`TIME SERIES: 3 FISCAL CYCLES // ${activeFys.length} ACTIVE`}
        action={
          isLimitedData ? (
            <span className="font-mono text-[10px] text-[#F59E0B] bg-[#3A2A0C] border border-[#F59E0B60] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
              <Info className="w-2.5 h-2.5" />
              PARTIAL HISTORICAL FEED
            </span>
          ) : (
            <span className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] border border-[#22C55E60] px-2 py-0.5 rounded font-bold uppercase">
              COMPLETE CYCLE
            </span>
          )
        }
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Constituency Activity Over Time</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Fiscal Year Breakdown Strip */}
        <div className="grid grid-cols-3 gap-2">
          {activityByFy.map((a) => (
            <div
              key={a.fy}
              className="p-2 bg-[#0A0E1A] border border-[#232D47] rounded-lg select-none"
            >
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold block">
                {a.fy}
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-[#E7EBF5]">
                  {a.projectsCount} {a.projectsCount === 1 ? 'Work' : 'Works'}
                </span>
                <span className="font-mono text-[10px] text-[#3B82F6] font-semibold">
                  ₹ {(a.sanctionedAmount / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recharts Bar Chart */}
        <div className="w-full h-44 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
              <XAxis
                dataKey="fy"
                stroke="#667090"
                tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#667090"
                tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#667090"
                tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `₹${v}Cr`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-[#10182B] border border-[#232D47] p-2 rounded shadow-lg text-xs font-mono space-y-1">
                        <div className="text-[#E7EBF5] font-bold border-b border-[#232D47] pb-1">
                          {label} &bull; {constituencyName}
                        </div>
                        <div className="text-[#3B82F6] flex items-center justify-between gap-3">
                          <span>Projects Sanctioned:</span>
                          <span className="font-bold">{data.Works}</span>
                        </div>
                        <div className="text-[#22C55E] flex items-center justify-between gap-3">
                          <span>Sanctioned Capital:</span>
                          <span className="font-bold">₹ {data.SanctionedCr} Cr</span>
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
                  paddingBottom: '4px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="Works"
                fill="#3B82F6"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                yAxisId="right"
                dataKey="SanctionedCr"
                name="Capital (Cr)"
                fill="#22C55E"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {isLimitedData && (
          <p className="text-[10px] text-[#667090] font-mono italic">
            * Note: Limited historical ingestion depth available. Historical audit logs reflect active parliamentary tenure records only.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
