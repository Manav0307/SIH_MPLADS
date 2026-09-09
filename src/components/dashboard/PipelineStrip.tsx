import React from 'react'
import {
  Calendar,
  SlidersHorizontal,
  Download,
  ArrowRight,
  Activity,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react'

interface PipelineStripProps {
  selectedFy: string
  onSelectFy: (fy: string) => void
  onExportBriefing: () => void
}

export const PipelineStrip: React.FC<PipelineStripProps> = ({
  selectedFy,
  onSelectFy,
  onExportBriefing,
}) => {
  return (
    <div className="flex flex-col gap-2 pt-2 border-b border-[#232D47] pb-3 bg-[#0A0E1A]/80">
      {/* Title & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-sans text-base lg:text-lg text-[#E7EBF5] tracking-tight font-bold">
              MPLADS Anomaly Intelligence
            </h1>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#401515]/60 text-[#EF4444] border border-[#EF4444]/40 font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
              DEFCON 2 MONITORING
            </span>
          </div>
          <p className="font-sans text-xs text-[#9AA5C1] mt-0.5">
            National implementation monitoring, statistical outlier detection, and sovereign public expenditure integrity.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Financial Year Selector */}
          <div className="relative">
            <div className="flex items-center bg-[#10182B] border border-[#232D47] rounded px-2.5 h-7 gap-1.5 text-[#9AA5C1] font-mono text-[11px] cursor-pointer hover:border-[#353946] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-[#667090]" />
              <select
                value={selectedFy}
                onChange={(e) => onSelectFy(e.target.value)}
                className="bg-transparent text-[#E7EBF5] font-mono text-[11px] focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                <option value="FY 2025-26" className="bg-[#10182B] text-[#E7EBF5]">FY 2025-26</option>
                <option value="FY 2024-25" className="bg-[#10182B] text-[#E7EBF5]">FY 2024-25</option>
                <option value="FY 2023-24" className="bg-[#10182B] text-[#E7EBF5]">FY 2023-24</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#667090] absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Quarter Selector */}
          <div className="relative">
            <div className="flex items-center bg-[#10182B] border border-[#232D47] rounded px-2.5 h-7 gap-1.5 text-[#9AA5C1] font-mono text-[11px] cursor-pointer hover:border-[#353946] transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#667090]" />
              <select
                defaultValue="All Monitored Quarters"
                className="bg-transparent text-[#E7EBF5] font-mono text-[11px] focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                <option value="All Monitored Quarters" className="bg-[#10182B] text-[#E7EBF5]">All Monitored Quarters</option>
                <option value="Q1 (Apr - Jun)" className="bg-[#10182B] text-[#E7EBF5]">Q1 (Apr - Jun)</option>
                <option value="Q2 (Jul - Sep)" className="bg-[#10182B] text-[#E7EBF5]">Q2 (Jul - Sep)</option>
                <option value="Q3 (Oct - Dec)" className="bg-[#10182B] text-[#E7EBF5]">Q3 (Oct - Dec)</option>
                <option value="Q4 (Jan - Mar)" className="bg-[#10182B] text-[#E7EBF5]">Q4 (Jan - Mar)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#667090] absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Export Briefing Button */}
          <button
            type="button"
            onClick={onExportBriefing}
            className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-sans font-semibold text-xs px-2.5 h-7 rounded border border-[#60A5FA] transition-colors shadow-xs cursor-pointer select-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Intelligence Briefing</span>
          </button>
        </div>
      </div>

      {/* AI Detection Pipeline Strip */}
      <div className="bg-[#10182B] border border-[#232D47] rounded p-1.5 flex items-center justify-between text-[#9AA5C1] font-mono text-[10px] overflow-x-auto gap-2 select-none">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#3B82F6] font-bold tracking-wider">DETECTION PIPELINE:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161F36] border border-[#232D47] text-[#E7EBF5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>Rule Engine (98 checks)</span>
          </div>

          <ArrowRight className="w-3 h-3 text-[#667090] shrink-0" />

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161F36] border border-[#232D47] text-[#E7EBF5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>Statistical Engine (Z-Score & IQR)</span>
          </div>

          <ArrowRight className="w-3 h-3 text-[#667090] shrink-0" />

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161F36] border border-[#232D47] text-[#E7EBF5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>ML Anomaly Engine (IsolationForest)</span>
          </div>

          <ArrowRight className="w-3 h-3 text-[#667090] shrink-0" />

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#10233F] border border-[#3B82F6]/40 text-[#3B82F6] font-bold">
            <Activity className="w-3 h-3" />
            <span>Consolidated Risk Score</span>
          </div>

          <ArrowRight className="w-3 h-3 text-[#667090] shrink-0" />

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#401515]/50 border border-[#EF4444]/50 text-[#EF4444] font-bold">
            <AlertTriangle className="w-3 h-3 animate-pulse" />
            <span>Automated Audit Alert</span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-[#667090] shrink-0 text-[10px]">
          <span>LATENCY: 42ms</span>
          <span>•</span>
          <span>ACCURACY: 98.6%</span>
        </div>
      </div>
    </div>
  )
}
