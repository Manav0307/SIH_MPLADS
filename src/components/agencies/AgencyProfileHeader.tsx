import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Download,
  AlertTriangle,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Shield,
  ShieldAlert,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react'

import { AgencyProfile } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'

interface AgencyProfileHeaderProps {
  agency: AgencyProfile
  onExportDossier: () => void
}

export const AgencyProfileHeader: React.FC<AgencyProfileHeaderProps> = ({
  agency,
  onExportDossier,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-3 select-none">
      {/* 1. Breadcrumbs and Global Telemetry Indicator */}
      <div className="flex items-center justify-between border-b border-[#232D47] pb-2.5 pt-1">
        <div className="flex items-center gap-2">
          <Link
            to="/agencies"
            className="text-xs text-[#9AA5C1] hover:text-[#3B82F6] flex items-center gap-1 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Implementing Agencies Directory</span>
          </Link>
          <span className="text-[#667090] text-xs">/</span>
          <span className="text-xs text-[#E7EBF5] font-mono font-bold truncate">
            {agency.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="AGENCY AUDIT READY" variant="synced" />
          <span className="font-mono text-[10px] text-[#667090] hidden sm:inline">
            UID: {agency.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. Profile Header Banner */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3.5 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Agency Identity & Risk */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg lg:text-xl font-bold text-[#E7EBF5] tracking-tight">
                {agency.name}
              </h1>
              <RiskBadge
                level={agency.riskLevel}
                score={agency.riskScore}
                withPip={agency.riskLevel === 'critical'}
                pulse={agency.riskLevel === 'critical'}
                size="md"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9AA5C1] font-mono flex-wrap">
              <span className="flex items-center gap-1 text-[#E7EBF5] font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                Type: <span className="text-[#3B82F6]">{agency.agencyType}</span>
              </span>
              <span className="text-[#667090]">&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9AA5C1]" />
                States: {agency.statePresence.join(', ') || 'N/A'}
              </span>
              {agency.topConstituency && (
                <>
                  <span className="text-[#667090]">&bull;</span>
                  <span>Primary Base: {agency.topConstituency}</span>
                </>
              )}
            </div>

            {/* Primary Anomaly Signal */}
            <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-mono pt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Primary Anomaly Signal:{' '}
                <strong className="text-[#E7EBF5] font-normal">{agency.primaryAnomaly}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => navigate(`/assistant?type=agency&id=${encodeURIComponent(agency.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#38BDF8]/50 rounded text-xs text-[#38BDF8] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open AI Investigation Assistant with Agency context"
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
              onClick={() => navigate(`/projects?agency=${encodeURIComponent(agency.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>View Projects</span>
            </button>

            <button
              onClick={() => navigate(`/cases?q=${encodeURIComponent(agency.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#a5b4fc] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Related Cases</span>
            </button>

            <button
              onClick={() => navigate(`/investigation?agency=${encodeURIComponent(agency.name)}`)}
              className="px-2.5 py-1.5 bg-[#401515] hover:bg-[#521C1C] border border-[#EF4444]/60 rounded text-xs text-[#EF4444] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Open Investigation</span>
            </button>

            <button
              onClick={() => navigate('/agencies')}
              className="px-2.5 py-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded text-xs text-[#9AA5C1] hover:text-[#E7EBF5] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </div>
        </div>

        {/* 3. Agency Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#232D47]/70">
          {/* States */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#3B82F6]" />
              States Presence
            </span>
            <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5] mt-0.5">
              {agency.statePresence.length} {agency.statePresence.length === 1 ? 'State' : 'States'}
            </span>
            <span className="text-[10px] text-[#667090] font-mono truncate">
              {agency.statePresence.join(', ') || 'National'}
            </span>
          </div>

          {/* Active Works */}
          <div className="flex flex-col border-l border-[#232D47] pl-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
              <FolderKanban className="w-3 h-3 text-[#3B82F6]" />
              Active Works
            </span>
            <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5] mt-0.5">
              {agency.activeWorks}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">
              In Execution
            </span>
          </div>

          {/* Completed Works */}
          <div className="flex flex-col border-l border-[#232D47] pl-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
              Completed Works
            </span>
            <span className="font-mono font-tabular text-sm font-bold text-[#22C55E] mt-0.5">
              {agency.completedWorks}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">
              Statutory Sign-Off Done
            </span>
          </div>

          {/* Flagged Works */}
          <div className="flex flex-col border-l border-[#232D47] pl-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#F59E0B] tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
              Flagged Works
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono font-tabular text-sm font-bold text-[#F59E0B]">
                {agency.flaggedWorksCount}
              </span>
              <span className="font-mono text-[10px] text-[#667090]">
                ({agency.flaggedPercentage}%)
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono">
              Elevated Risk Signal
            </span>
          </div>

          {/* Sanctioned */}
          <div className="flex flex-col border-l border-[#232D47] pl-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
              Sanctioned
            </span>
            <span className="font-mono font-tabular text-sm font-bold text-[#E7EBF5] mt-0.5">
              {agency.totalSanctioned}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">
              Approved Allocation
            </span>
          </div>

          {/* Disbursed */}
          <div className="flex flex-col border-l border-[#232D47] pl-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              Disbursed
            </span>
            <span className="font-mono font-tabular text-sm font-bold text-[#22C55E] mt-0.5">
              {agency.totalDisbursed}
            </span>
            <span className="text-[10px] text-[#667090] font-mono">
              PFMS Released
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
