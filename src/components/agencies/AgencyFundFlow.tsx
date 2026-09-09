import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { CheckCircle2, DollarSign, Landmark, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface FundFlowData {
  recommendedAmount: number
  recommendedDisplay: string
  sanctionedAmount: number
  sanctionedDisplay: string
  disbursedAmount: number
  disbursedDisplay: string
  spentAmount: number
  spentDisplay: string
  unutilizedAmount: number
  unutilizedDisplay: string
  sanctionedVsRecommendedPercent: number
  disbursedVsSanctionedPercent: number
  spentVsDisbursedPercent: number
}

interface AgencyFundFlowProps {
  fundFlow: FundFlowData
}

export const AgencyFundFlow: React.FC<AgencyFundFlowProps> = ({ fundFlow }) => {
  // Prepare chart data in Lakhs
  const chartData = [
    {
      stage: 'Recommended',
      amountLakhs: Number((fundFlow.recommendedAmount / 100000).toFixed(1)),
      display: fundFlow.recommendedDisplay,
      color: '#9AA5C1',
    },
    {
      stage: 'Sanctioned',
      amountLakhs: Number((fundFlow.sanctionedAmount / 100000).toFixed(1)),
      display: fundFlow.sanctionedDisplay,
      color: '#3B82F6',
    },
    {
      stage: 'Disbursed',
      amountLakhs: Number((fundFlow.disbursedAmount / 100000).toFixed(1)),
      display: fundFlow.disbursedDisplay,
      color: '#22C55E',
    },
    {
      stage: 'Spent',
      amountLakhs: Number((fundFlow.spentAmount / 100000).toFixed(1)),
      display: fundFlow.spentDisplay,
      color: '#EAB308',
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="TREASURY CONVERSION EFFICIENCY // CAPITAL AUDIT"
        action={
          <span className="font-mono text-[10px] text-[#22C55E] bg-[#0E2E1E] border border-[#22C55E]/40 px-2 py-0.5 rounded font-bold uppercase">
            FUND CONVERSION
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Agency Fund Flow</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 1. Comparison Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0E1A] p-2.5 rounded-lg border border-[#232D47]">
          {/* Recommended */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold flex items-center gap-1">
              <Landmark className="w-3 h-3 text-[#9AA5C1]" />
              RECOMMENDED
            </span>
            <span className="font-mono text-base font-bold text-[#E7EBF5] mt-0.5">
              {fundFlow.recommendedDisplay}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">MP Proposal Baseline</span>
          </div>

          {/* Sanctioned */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#3B82F6] uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
              SANCTIONED
            </span>
            <span className="font-mono text-base font-bold text-[#3B82F6] mt-0.5">
              {fundFlow.sanctionedDisplay}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">Administrative Approval</span>
          </div>

          {/* Disbursed */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#22C55E] uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              DISBURSED
            </span>
            <span className="font-mono text-base font-bold text-[#22C55E] mt-0.5">
              {fundFlow.disbursedDisplay}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">PFMS Tranches Released</span>
          </div>

          {/* Spent */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
            <span className="font-mono text-[10px] text-[#EAB308] uppercase font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#EAB308]" />
              SPENT (GROUND)
            </span>
            <span className="font-mono text-base font-bold text-[#EAB308] mt-0.5">
              {fundFlow.spentDisplay}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">Physical Expenditure</span>
          </div>
        </div>

        {/* 2. Conversion Ratios & Unutilized Alert Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-[#10182B] border border-[#232D47] rounded flex flex-col justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase">Sanctioned / Recommended</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {fundFlow.sanctionedVsRecommendedPercent}%
              </span>
              <span className="text-[10px] text-[#667090] font-mono">Approval Rate</span>
            </div>
          </div>

          <div className="p-2 bg-[#10182B] border border-[#232D47] rounded flex flex-col justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase">Disbursed / Sanctioned</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-base font-bold text-[#22C55E]">
                {fundFlow.disbursedVsSanctionedPercent}%
              </span>
              <span className="text-[10px] text-[#667090] font-mono">Release Velocity</span>
            </div>
          </div>

          <div className="p-2 bg-[#10182B] border border-[#232D47] rounded flex flex-col justify-between">
            <span className="font-mono text-[10px] text-[#9AA5C1] uppercase">Spent / Disbursed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-base font-bold text-[#EAB308]">
                {fundFlow.spentVsDisbursedPercent}%
              </span>
              <span className="text-[10px] text-[#667090] font-mono">Ground Execution</span>
            </div>
          </div>

          <div className="p-2 bg-[#10182B] border border-[#232D47] rounded flex flex-col justify-between">
            <span className="font-mono text-[10px] text-[#F59E0B] uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
              Unutilized Amount
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-base font-bold text-[#F59E0B]">
                {fundFlow.unutilizedDisplay}
              </span>
              <span className="text-[10px] text-[#667090] font-mono">Parked Capital</span>
            </div>
          </div>
        </div>

        {/* 3. Recharts Visualization */}
        <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232D47]/60">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1]">
              Capital Pipeline Comparison (₹ in Lakhs)
            </span>
            <span className="font-mono text-[10px] text-[#667090]">
              Audited PFMS Transaction Log
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
                <XAxis
                  dataKey="stage"
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
                      const item = payload[0].payload
                      return (
                        <div className="bg-[#10182B] border border-[#232D47] p-2 rounded shadow-lg font-mono text-xs">
                          <p className="font-bold text-[#E7EBF5]">{item.stage}</p>
                          <p className="text-[#3B82F6]">Amount: {item.display}</p>
                          <p className="text-[10px] text-[#667090]">
                            ₹ {item.amountLakhs.toLocaleString()} Lakhs
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="amountLakhs" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
