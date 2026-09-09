import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  StateAnomalyRecord,
  ProjectRecord,
  VendorRecord,
} from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'
import {
  AlertOctagon,
  Building2,
  ExternalLink,
  FileText,
  MapPin,
  X,
  Compass,
  Shield,
  ShieldAlert,
  FileSpreadsheet,
} from 'lucide-react'

interface RegionAuditPanelProps {
  selectedState: StateAnomalyRecord | null
  allStates: StateAnomalyRecord[]
  projects: ProjectRecord[]
  vendors: VendorRecord[]
  onSelectState: (stateName: string) => void
  onOpenProjectDossier: (project: ProjectRecord) => void
  onClearSelection: () => void
}

export const RegionAuditPanel: React.FC<RegionAuditPanelProps> = ({
  selectedState,
  allStates,
  projects,
  vendors,
  onSelectState,
  onOpenProjectDossier,
  onClearSelection,
}) => {
  const navigate = useNavigate()

  // State-specific projects from mockProjects
  const stateProjects = useMemo(() => {
    if (!selectedState) return []
    return projects.filter(
      (p) => p.state.toLowerCase() === selectedState.name.toLowerCase()
    )
  }, [projects, selectedState])

  // Total disbursed in this state among loaded mock projects
  const totalDisbursedFromProjects = useMemo(() => {
    return stateProjects.reduce((acc, curr) => acc + curr.disbursedAmount, 0)
  }, [stateProjects])

  // Vendors active in this state
  const stateVendors = useMemo(() => {
    if (!selectedState) return []
    return vendors.filter((v) => {
      if (v.registeredState?.toLowerCase() === selectedState.name.toLowerCase()) return true
      if (v.statePresence?.some((s) => s.toLowerCase() === selectedState.name.toLowerCase())) return true
      if (stateProjects.some((p) => p.vendor.toLowerCase() === v.name.toLowerCase())) return true
      return false
    })
  }, [vendors, selectedState, stateProjects])

  // Primary anomaly for the region
  const primaryAnomalyInfo = useMemo(() => {
    if (!selectedState) return null
    // Check if any project in this state has an anomaly description
    const matchedProject = stateProjects.find((p) => p.primaryAnomaly)
    if (matchedProject) {
      return matchedProject.primaryAnomaly
    }

    if (selectedState.anomalyRate >= 15) {
      return 'Severe Cost Outlier Inflation & Rapid Milestone Bypass'
    } else if (selectedState.anomalyRate >= 10) {
      return 'Vendor Concentration Cartel & Stage-Gate Discrepancy'
    } else if (selectedState.duplicateGpsCount >= 10) {
      return 'Duplicate Spatial Footprint & Proximity Collision Alert'
    } else {
      return 'Standard Progress Monitoring & Execution Velocity Watch'
    }
  }, [selectedState, stateProjects])

  // If no state is selected, display National Audit Overview summary card
  if (!selectedState) {
    const totalFlaggedWorks = allStates.reduce((acc, curr) => acc + curr.flaggedWorks, 0)
    const totalDiscrepancyCr = allStates.reduce((acc, curr) => acc + curr.discrepancyCr, 0)
    const criticalStatesCount = allStates.filter((s) => s.riskLevel === 'critical').length

    return (
      <div className="w-full lg:w-96 bg-[#10182B] border border-[#232D47] rounded-lg p-4 flex flex-col justify-between select-none shadow-xl shrink-0 overflow-y-auto max-h-[650px]">
        <div className="space-y-4">
          <div className="border-b border-[#232D47] pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#3B82F6] uppercase font-bold tracking-wider">
                GIS Audit Command
              </span>
              <StatusPill label="LIVE TELEMETRY" variant="live" />
            </div>
            <h2 className="text-base font-bold text-[#E7EBF5] mt-1">National Risk Summary</h2>
            <p className="text-xs text-[#9AA5C1] mt-0.5">
              Click any state marker or centroid on the map to inspect its jurisdictional audit dossier.
            </p>
          </div>

          {/* National Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47]">
              <span className="text-[10px] font-mono text-[#9AA5C1] uppercase block">Monitored States</span>
              <span className="text-lg font-bold font-mono text-[#E7EBF5]">{allStates.length}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47]">
              <span className="text-[10px] font-mono text-[#9AA5C1] uppercase block">Critical Hotspots</span>
              <span className="text-lg font-bold font-mono text-[#EF4444]">{criticalStatesCount} States</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47]">
              <span className="text-[10px] font-mono text-[#9AA5C1] uppercase block">Total Flagged Works</span>
              <span className="text-lg font-bold font-mono text-[#F59E0B]">{totalFlaggedWorks.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47]">
              <span className="text-[10px] font-mono text-[#9AA5C1] uppercase block">Discrepancy Capital</span>
              <span className="text-lg font-bold font-mono text-[#EF4444]">₹{totalDiscrepancyCr.toFixed(1)} Cr</span>
            </div>
          </div>

          {/* Priority State Watchlist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-[#9AA5C1] uppercase">
                High-Risk Jurisdictions
              </span>
              <span className="font-mono text-[10px] text-[#667090]">Sorted by Anomaly</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {allStates
                .slice()
                .sort((a, b) => b.anomalyRate - a.anomalyRate)
                .slice(0, 5)
                .map((st) => (
                  <div
                    key={st.code}
                    onClick={() => onSelectState(st.name)}
                    className="p-2 rounded bg-[#0D1424] hover:bg-[#161F36] border border-[#232D47] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#E7EBF5]">{st.name}</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 bg-[#161F36] text-[#9AA5C1] rounded border border-[#232D47]">
                          {st.code}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#9AA5C1] mt-0.5">
                        {st.flaggedWorks} works • {st.flaggedCapital}
                      </div>
                    </div>
                    <RiskBadge level={st.riskLevel} score={Math.round(st.anomalyRate * 5.8)} />
                  </div>
                ))}
            </div>
          </div>

          {/* Centroid Data Verification Notice */}
          <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#9AA5C1] leading-relaxed">
              <strong className="text-[#E7EBF5]">Centroid-Based Spatial Mapping:</strong> All map vectors are anchored to official State Administrative Centroids (Survey of India benchmarks). Project-level coordinates pending physical field audit telemetry.
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#232D47] mt-3 space-y-1.5">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="w-full py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] text-[#3B82F6] font-mono text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Browse Full National Ledger</span>
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="py-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#a5b4fc] font-mono text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#818cf8]" />
              <span>All Cases</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/investigation')}
              className="py-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#EF4444] font-mono text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Investigation</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active Selected State Audit View
  return (
    <div className="w-full lg:w-96 bg-[#10182B] border border-[#232D47] rounded-lg p-3.5 flex flex-col justify-between select-none shadow-2xl shrink-0 overflow-y-auto max-h-[650px]">
      <div className="space-y-3.5">
        {/* Panel Header */}
        <div className="border-b border-[#232D47] pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#161F36] border border-[#232D47] font-mono text-[10px] font-bold text-[#3B82F6]">
                {selectedState.code}
              </span>
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
                Regional Audit Dossier
              </span>
            </div>
            <button
              type="button"
              onClick={onClearSelection}
              className="w-6 h-6 rounded flex items-center justify-center text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36] transition-colors cursor-pointer"
              title="Close Panel / Reset"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <h2 className="text-base font-bold text-[#E7EBF5]">{selectedState.name}</h2>
            <RiskBadge
              level={selectedState.riskLevel}
              score={Math.round(selectedState.anomalyRate * 5.8)}
              pulse={selectedState.riskLevel === 'critical'}
            />
          </div>

          {/* Official Centroid Telemetry Callout */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9AA5C1] mt-1 bg-[#0A0E1A] px-2 py-1 rounded border border-[#232D47]">
            <Compass className="w-3 h-3 text-[#3B82F6] shrink-0" />
            <span>
              Centroid: {selectedState.latitude.toFixed(4)}°N, {selectedState.longitude.toFixed(4)}°E
            </span>
          </div>
        </div>

        {/* Risk & Anomaly Score Card */}
        <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#9AA5C1] font-semibold">
              Jurisdictional Risk Metric
            </span>
            <span className="text-xs font-mono font-bold text-[#EF4444]">
              {selectedState.anomalyRate.toFixed(1)}% Anomaly Rate
            </span>
          </div>

          {/* Anomaly Bar Gauge */}
          <div className="w-full h-1.5 bg-[#161F36] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                selectedState.riskLevel === 'critical'
                  ? 'bg-[#EF4444]'
                  : selectedState.riskLevel === 'high'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#3B82F6]'
              }`}
              style={{ width: `${Math.min(100, selectedState.anomalyRate * 5)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[9px] font-mono text-[#667090] uppercase block">Flagged Capital</span>
              <span className="text-xs font-mono font-bold text-[#EF4444]">
                {selectedState.flaggedCapital}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#667090] uppercase block">Disbursed Amount</span>
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                {totalDisbursedFromProjects > 0
                  ? `₹ ${(totalDisbursedFromProjects / 100000).toFixed(1)} L`
                  : selectedState.flaggedCapital}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#667090] uppercase block">Financial Discrepancy</span>
              <span className="text-xs font-mono font-bold text-[#E7EBF5]">
                ₹{selectedState.discrepancyCr} Cr
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#667090] uppercase block">Flagged Works</span>
              <span className="text-xs font-mono font-bold text-[#F59E0B]">
                {selectedState.flaggedWorks} Works
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] font-mono text-[#667090] uppercase block">Duplicate GPS Works</span>
              <span className="text-xs font-mono font-bold text-[#3B82F6]">
                {selectedState.duplicateGpsCount} Spatial Footprint Clusters
              </span>
            </div>
          </div>
        </div>

        {/* Main Anomaly Callout */}
        <div className="p-2.5 rounded bg-[#401515]/30 border border-[#EF4444]/30 space-y-1">
          <div className="flex items-center gap-1.5 text-[#EF4444] font-mono text-[10px] font-bold uppercase">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
            <span>Primary Statutory Anomaly</span>
          </div>
          <p className="text-[11px] text-[#E7EBF5] font-medium leading-snug">
            {primaryAnomalyInfo}
          </p>
        </div>

        {/* Flagged Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="font-mono text-[11px] font-bold text-[#E7EBF5] uppercase">
                Flagged Projects ({stateProjects.length})
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#667090]">Click for Dossier</span>
          </div>

          {stateProjects.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {stateProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onOpenProjectDossier(p)}
                  className="p-2 rounded bg-[#0D1424] hover:bg-[#161F36] border border-[#232D47] cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[11px] font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] line-clamp-1">
                      {p.title}
                    </span>
                    <RiskBadge level={p.riskLevel} score={p.riskScore} />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#9AA5C1] mt-1">
                    <span>{p.constituency}</span>
                    <strong className="text-[#E7EBF5]">{p.disbursedDisplay}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[11px] text-[#9AA5C1] text-center">
              No detailed dossier projects sampled in current mock batch for {selectedState.name}. {selectedState.flaggedWorks} works tracked in aggregate statutory database.
            </div>
          )}
        </div>

        {/* Top Vendors Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#EAB308]" />
              <span className="font-mono text-[11px] font-bold text-[#E7EBF5] uppercase">
                Top Vendors in Jurisdiction ({stateVendors.length})
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#667090]">High Concentration</span>
          </div>

          {stateVendors.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {stateVendors.map((v) => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/vendors/${v.id}`)}
                  className="p-2 rounded bg-[#0D1424] hover:bg-[#161F36] border border-[#232D47] cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#E7EBF5] group-hover:text-[#3B82F6] block truncate">
                      {v.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#9AA5C1]">
                      GST: {v.gstin} • {v.totalDisbursed}
                    </span>
                  </div>
                  <RiskBadge level={v.riskLevel} score={v.riskScore} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[10px] font-mono text-[#9AA5C1] text-center">
              {selectedState.vendorDensity} high-risk contractors active in state registry.
            </div>
          )}
        </div>
      </div>

      {/* Action Footer with Deep Navigation */}
      <div className="pt-3 border-t border-[#232D47] mt-3 space-y-1.5">
        <button
          type="button"
          onClick={() => navigate(`/projects?state=${encodeURIComponent(selectedState.name)}`)}
          className="w-full py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] text-[#3B82F6] font-mono text-[11px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Filter Ledger for {selectedState.name}</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => navigate(`/cases?state=${encodeURIComponent(selectedState.name)}`)}
            className="w-full py-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#a5b4fc] font-mono text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Shield className="w-3 h-3 text-[#818cf8]" />
            <span>State Cases</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/investigation?state=${encodeURIComponent(selectedState.name)}`)}
            className="w-full py-1.5 bg-[#0D1424] hover:bg-[#161F36] border border-[#232D47] text-[#EF4444] font-mono text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Investigate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
