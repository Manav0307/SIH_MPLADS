import React from 'react'
import { Activity, ShieldAlert, Cpu } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="h-7 bg-[#0A0E1A] border-t border-[#232D47] px-4 flex items-center justify-between text-[11px] font-mono text-[#667090] select-none shrink-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span>GATEWAY: CONNECTED</span>
        </div>
        <span className="text-[#232D47]">|</span>
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-[#3B82F6]" />
          <span>ML ENGINE: ISOLATION_FOREST (v3.2)</span>
        </div>
        <span className="text-[#232D47] hidden md:inline">|</span>
        <div className="hidden md:flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#9AA5C1]" />
          <span>PIPELINE LATENCY: 42ms</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[#EF4444]">
          <ShieldAlert className="w-3 h-3" />
          <span className="uppercase">DEFCON 2 MONITORING</span>
        </div>
        <span className="text-[#232D47]">|</span>
        <span className="text-[#9AA5C1]">CAG STATUTORY AUDIT CELL (NEW DELHI)</span>
      </div>
    </footer>
  )
}
