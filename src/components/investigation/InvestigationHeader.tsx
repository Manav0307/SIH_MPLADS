import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldAlert, FileSearch, Clock, Sparkles } from 'lucide-react'
import { StatusPill } from '@/components/common/StatusPill'

interface InvestigationHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeInvestigationsCount?: number
  totalFlaggedSummons?: number
}

export const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeInvestigationsCount = 18,
  totalFlaggedSummons = 6,
}) => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#10182B] border-b border-[#232D47] px-4 py-3 select-none">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        {/* Title & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-6 h-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
              <FileSearch className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Forensic Investigation Explorer
            </h1>
            <StatusPill label="STAGE 6 OPERATIONAL" variant="live" />
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#401515] text-[#ffb4ab] border border-[#EF444440] uppercase font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              RESTRICTED // CAG STATUTORY DESK
            </span>
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5 font-sans">
            Cross-examine projects, anomalies, vendors and agencies
          </p>
        </div>

        {/* Telemetry Readouts */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Current Data Period */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E1A] border border-[#232D47]">
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#667090] uppercase leading-tight">Data Period</span>
              <span className="font-mono text-[11px] text-[#E7EBF5] font-semibold leading-tight">
                FY 2024–25 & FY 2025–26 (Active Quinquennium)
              </span>
            </div>
          </div>

          {/* Dataset Freshness */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E1A] border border-[#232D47]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#667090] uppercase leading-tight">Freshness</span>
              <span className="font-mono text-[11px] text-[#22C55E] font-semibold leading-tight">
                Synced 8m ago • PFMS + NIC GIS v2.4
              </span>
            </div>
          </div>

          {/* Active Investigation Count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#401515]/50 border border-[#EF4444]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#ffb4ab] uppercase leading-tight">Active Inquiries</span>
              <span className="font-mono text-[11px] text-[#EF4444] font-bold leading-tight">
                {activeInvestigationsCount} Active • {totalFlaggedSummons} Statutory Summons
              </span>
            </div>
          </div>

          {/* Ask AI Action Button */}
          <button
            type="button"
            onClick={() => navigate('/assistant?type=investigation')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161F36] hover:bg-[#232D47] border border-[#3B82F6]/50 text-[#38BDF8] font-mono text-xs font-bold transition-colors cursor-pointer"
            title="Open AI Investigation Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Prominent Investigation Search Field */}
      <div className="mt-3 relative">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 w-4 h-4 text-[#9AA5C1] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search project ID, MP, vendor, agency or anomaly... (Press '/' to focus)"
            className="w-full h-9 bg-[#0A0E1A] border border-[#232D47] rounded-md pl-9 pr-32 text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5 pointer-events-none">
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="pointer-events-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border border-[#232D47]"
              >
                Clear
              </button>
            )}
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#3B82F6] border border-[#3B82F6]/30 font-semibold">
              FORENSIC SEARCH
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
              /
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
