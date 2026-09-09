import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Store,
  Layers,
  Download,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  MapPin,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react'
import { VendorProfile } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'

interface VendorProfileHeaderProps {
  vendor: VendorProfile
  onExportDossier: () => void
}

export const VendorProfileHeader: React.FC<VendorProfileHeaderProps> = ({
  vendor,
  onExportDossier,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-3 select-none">
      {/* 1. Breadcrumbs and Global Telemetry Indicator */}
      <div className="flex items-center justify-between border-b border-[#232D47] pb-2.5 pt-1">
        <div className="flex items-center gap-2">
          <Link
            to="/vendors"
            className="text-xs text-[#9AA5C1] hover:text-[#3B82F6] flex items-center gap-1 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vendors Directory</span>
          </Link>
          <span className="text-[#667090] text-xs">/</span>
          <span className="text-xs text-[#E7EBF5] font-mono font-bold truncate">
            {vendor.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="INTELLIGENCE ACTIVE" variant="synced" />
          <span className="font-mono text-[10px] text-[#667090] hidden sm:inline">
            UID: {vendor.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. Profile Header Banner */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3.5 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Vendor Identity & Flags */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg lg:text-xl font-bold text-[#E7EBF5] tracking-tight">
                {vendor.name}
              </h1>
              <RiskBadge
                level={vendor.riskLevel}
                score={vendor.riskScore}
                withPip={vendor.riskLevel === 'critical'}
                pulse={vendor.riskLevel === 'critical'}
                size="md"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9AA5C1] font-mono flex-wrap">
              <span className="flex items-center gap-1 text-[#E7EBF5] font-medium">
                <Store className="w-3.5 h-3.5 text-[#3B82F6]" />
                GSTIN: <span className="font-mono text-[#3B82F6]">{vendor.gstin}</span>
              </span>
              <span className="text-[#667090]">&bull;</span>
              <span>Reg State: {vendor.registeredState || 'India'}</span>
              <span className="text-[#667090]">&bull;</span>
              <span>Primary Sector: Infrastructure &amp; Works</span>
            </div>

            <p className="text-xs text-[#F59E0B] font-mono pt-0.5">
              Primary Anomaly Signal: <span className="text-[#E7EBF5]">{vendor.primaryAnomaly}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => navigate(`/assistant?type=vendor&id=${encodeURIComponent(vendor.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#38BDF8]/50 rounded text-xs text-[#38BDF8] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open AI Investigation Assistant with vendor context"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onExportDossier}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#E7EBF5] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={() => navigate(`/projects?vendor=${encodeURIComponent(vendor.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>View Projects</span>
            </button>

            <button
              onClick={() => navigate(`/cases?q=${encodeURIComponent(vendor.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#a5b4fc] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Related Cases</span>
            </button>

            <button
              onClick={() => navigate(`/investigation?vendor=${encodeURIComponent(vendor.name)}`)}
              className="px-2.5 py-1.5 bg-[#401515] hover:bg-[#521C1C] border border-[#EF4444]/60 rounded text-xs text-[#EF4444] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Open Investigation</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-[#232D47]/80">
          {/* 1. Projects */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
              TOTAL PROJECTS
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {vendor.activeWorks + vendor.completedWorks}
              </span>
              <span className="font-mono text-[10px] text-[#3B82F6]">
                ({vendor.activeWorks} active)
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              Across All Constituencies
            </span>
          </div>

          {/* 2. Total Disbursed */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              DISBURSED CAPITAL
            </span>
            <div className="mt-1">
              <span className="font-mono text-base font-bold text-[#22C55E]">
                {vendor.totalDisbursed}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              Total PFMS Tranches
            </span>
          </div>

          {/* 3. Flagged Works */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
              FLAGGED WORKS
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-[#EF4444]">
                {vendor.flaggedWorksCount}
              </span>
              <span className="font-mono text-[10px] text-[#EF4444]/80">
                ({vendor.flaggedPercentage}%)
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              Score: {vendor.riskScore}/100
            </span>
          </div>

          {/* 4. Geographic States */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#3B82F6]" />
              STATE PRESENCE
            </span>
            <div className="mt-1">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {vendor.states.length} States
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5 truncate">
              {vendor.states.map((s) => s.state).slice(0, 2).join(', ')}
              {vendor.states.length > 2 ? '...' : ''}
            </span>
          </div>

          {/* 5. Average Project Value */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#3B82F6]" />
              AVG PROJECT VALUE
            </span>
            <div className="mt-1">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {vendor.avgProjectValue}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              Contract Median Scale
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
