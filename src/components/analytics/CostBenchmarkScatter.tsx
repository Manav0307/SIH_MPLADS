import React from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import { ScatterBenchmarkPoint } from '@/types'

interface CostBenchmarkScatterProps {
  data: ScatterBenchmarkPoint[]
  onSelectPoint: (point: ScatterBenchmarkPoint) => void
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ScatterBenchmarkPoint }>
}

const CustomScatterTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload
    return (
      <div className="bg-[#10182B] border border-[#232D47] p-2.5 rounded shadow-xl font-mono text-[11px] text-[#E7EBF5] max-w-xs select-none">
        <div className="font-bold text-[#3B82F6]">{pt.workCode}</div>
        <div className="font-sans text-xs text-[#E7EBF5] mt-0.5">{pt.title}</div>
        <div className="text-[10px] text-[#9AA5C1] mt-1">State: {pt.state}</div>
        <div className="mt-1.5 pt-1.5 border-t border-[#232D47] flex flex-col gap-0.5 text-[10px]">
          <div>Sanctioned: <span className="font-bold text-[#E7EBF5]">₹{pt.sanctionedLakhs.toFixed(1)} L</span></div>
          <div>Benchmark: <span className="font-bold text-[#9AA5C1]">₹{pt.expectedLakhs.toFixed(1)} L</span></div>
          <div className={pt.variancePercent > 50 ? 'text-[#EF4444] font-bold' : 'text-[#22C55E]'}>
            Variance: +{pt.variancePercent}%
          </div>
        </div>
        {pt.isOutlier && (
          <div className="mt-1.5 text-[9px] text-[#EF4444] font-bold uppercase tracking-wider bg-[#401515] px-1 py-0.5 rounded border border-[#EF4444]/30 text-center">
            Click to open forensic inspection
          </div>
        )}
      </div>
    )
  }
  return null
}

export const CostBenchmarkScatter: React.FC<CostBenchmarkScatterProps> = ({
  data,
  onSelectPoint,
}) => {
  // Split data into normal points and outliers for distinct styling if needed
  const outliers = data.filter((d) => d.isOutlier)

  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col overflow-hidden select-none h-full">
      {/* Header */}
      <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#3B82F6] font-bold">●</span>
          <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
            Sanctioned Cost vs Category Benchmark
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#EF4444] bg-[#401515] px-1.5 py-0.5 rounded border border-[#EF4444]/40 font-bold">
          Z-SCORE &gt; 2.5 OUTLIERS
        </span>
      </div>

      {/* Main Scatter Area */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="relative w-full h-[220px] bg-[#0A0E1A] rounded border border-[#232D47] p-2 overflow-hidden">
          {/* Axis Header Badges */}
          <span className="absolute top-1.5 left-2 font-mono text-[9px] text-[#667090] uppercase tracking-wider z-10 pointer-events-none">
            Expected Cost (State PWD Benchmark ₹ Lakhs) ↑
          </span>
          <span className="absolute bottom-1 right-2 font-mono text-[9px] text-[#667090] uppercase tracking-wider z-10 pointer-events-none">
            Sanctioned Cost (₹ Lakhs) →
          </span>

          {/* Floating Outlier Badges */}
          {outliers.map((o) => {
            if (o.workCode.includes('MH14')) {
              return (
                <div
                  key={o.id}
                  onClick={() => onSelectPoint(o)}
                  className="absolute top-9 left-28 bg-[#401515] text-[#ffdad6] border border-[#EF4444]/50 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold z-20 cursor-pointer hover:scale-105 transition-transform"
                >
                  {o.outlierLabel || 'WS/MH14: +182%'}
                </div>
              )
            }
            if (o.workCode.includes('UP32')) {
              return (
                <div
                  key={o.id}
                  onClick={() => onSelectPoint(o)}
                  className="absolute bottom-8 right-24 bg-[#401515] text-[#ffdad6] border border-[#EF4444]/50 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold z-20 cursor-pointer hover:scale-105 transition-transform"
                >
                  {o.outlierLabel || 'WS/UP32: +115%'}
                </div>
              )
            }
            return null
          })}

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 25, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid stroke="#232D47" strokeDasharray="3 3" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="sanctionedLakhs"
                name="Sanctioned Cost"
                unit="L"
                domain={[0, 110]}
                stroke="#667090"
                tick={{ fill: '#667090', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: '#232D47' }}
                tickLine={{ stroke: '#232D47' }}
              />
              <YAxis
                type="number"
                dataKey="expectedLakhs"
                name="Expected Cost"
                unit="L"
                domain={[0, 110]}
                stroke="#667090"
                tick={{ fill: '#667090', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: '#232D47' }}
                tickLine={{ stroke: '#232D47' }}
              />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#353946' }} />

              {/* 45 degree baseline */}
              <ReferenceLine
                segment={[
                  { x: 0, y: 0 },
                  { x: 100, y: 100 },
                ]}
                stroke="#3B82F6"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                opacity={0.7}
              />

              <Scatter
                data={data}
                onClick={(e: unknown) => {
                  const pt = (e as { payload?: ScatterBenchmarkPoint })?.payload
                  if (pt) {
                    onSelectPoint(pt)
                  }
                }}
                className="cursor-pointer"
              >
                {data.map((entry) => {
                  let fillColor = '#424754'
                  let strokeColor = 'transparent'
                  let strokeWidth = 0

                  if (entry.isOutlier) {
                    if (entry.riskLevel === 'critical') {
                      fillColor = '#EF4444'
                      strokeColor = '#ffffff'
                      strokeWidth = 1.5
                    } else {
                      fillColor = '#F59E0B'
                      strokeColor = '#ffffff'
                      strokeWidth = 1.5
                    }
                  }

                  return (
                    <Cell
                      key={entry.id}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                  )
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Details Strip */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono mt-3 pt-2 border-t border-[#232D47]">
          <div>
            <span className="text-[#667090]">Statistical Method:</span>
            <div className="text-[#E7EBF5] font-semibold">Tukey IQR + IsolationForest</div>
          </div>
          <div>
            <span className="text-[#667090]">Extreme Deviations (&gt;2.0x):</span>
            <div className="text-[#EF4444] font-bold">148 Works (₹18.9 Cr)</div>
          </div>
          <div className="text-right">
            <span className="text-[#667090]">Expected Cost Baseline:</span>
            <div className="text-[#3B82F6] font-semibold">MoSPI Schedule 2024-25</div>
          </div>
        </div>
      </div>
    </div>
  )
}
