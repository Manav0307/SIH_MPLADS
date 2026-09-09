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
import { Landmark, TrendingUp, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface VendorFinancialsProps {
  totalSanctioned: string
  totalDisbursed: string
  totalSpent: string
  flaggedCapital: string
  disbursementsByFy: {
    fy: string
    disbursedAmount: number
    disbursedDisplay: string
    worksCount: number
  }[]
}

export const VendorFinancials: React.FC<VendorFinancialsProps> = ({
  totalSanctioned,
  totalDisbursed,
  totalSpent,
  flaggedCapital,
  disbursementsByFy,
}) => {
  return (
    <Card className="w-full">
      <CardHeader
        telemetry="PFMS TREASURY AUDIT // CAPITAL UTILIZATION DISPERSION"
        action={
          <span className="font-mono text-[10px] text-[#22C55E] bg-[#0E2E1E] border border-[#22C55E]/40 px-2 py-0.5 rounded font-bold uppercase">
            FINANCIAL AUDIT
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Financials &amp; Annual Disbursement Flow</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Financial KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0E1A] p-2.5 rounded-lg border border-[#232D47]">
          {/* 1. Total Sanctioned */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold flex items-center gap-1">
              <Landmark className="w-3 h-3 text-[#9AA5C1]" />
              TOTAL SANCTIONED
            </span>
            <div className="mt-0.5">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {totalSanctioned}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Approved Project DPR Value
            </span>
          </div>

          {/* 2. Total Disbursed */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#22C55E] uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              TOTAL DISBURSED
            </span>
            <div className="mt-0.5">
              <span className="font-mono text-base font-bold text-[#22C55E]">
                {totalDisbursed}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Total PFMS Tranches Released
            </span>
          </div>

          {/* 3. Total Spent */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#3B82F6] uppercase font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#3B82F6]" />
              TOTAL SPENT (GROUND)
            </span>
            <div className="mt-0.5">
              <span className="font-mono text-base font-bold text-[#3B82F6]">
                {totalSpent}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Verified Physical Expenditure
            </span>
          </div>

          {/* 4. Flagged Capital */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#EF4444] uppercase font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
              FLAGGED CAPITAL
            </span>
            <div className="mt-0.5">
              <span className="font-mono text-base font-bold text-[#EF4444]">
                {flaggedCapital}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-sans">
              Capital in High-Risk Works
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA5C1]">
            <span>Vendor Disbursement by Financial Year</span>
            <span className="text-[10px] text-[#667090]">Values in ₹ Crores</span>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={disbursementsByFy}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
                <XAxis
                  dataKey="fy"
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-[#10182B] border border-[#232D47] p-2 rounded shadow-lg text-xs font-mono">
                          <span className="text-[#9AA5C1]">{data.fy}: </span>
                          <span className="text-[#22C55E] font-bold">{data.disbursedDisplay}</span>
                          <div className="text-[10px] text-[#667090] mt-0.5">
                            {data.worksCount} projects executed
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="disbursedAmount"
                  name="Disbursed (₹ Cr)"
                  fill="#22C55E"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
