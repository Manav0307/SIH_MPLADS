import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { getVendorProfile, getVendorProjects } from '@/data'
import { ProjectRecord } from '@/types'
import { ProjectDossierDrawer } from '@/components/dossier'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import {
  VendorProfileHeader,
  VendorRiskAssessment,
  VendorFinancials,
  VendorProjectPortfolio,
  VendorGeographicFootprint,
  VendorNetwork,
  ProcurementConcentration,
  VendorAnomalyBreakdown,
  VendorRelatedEntities,
  VendorInvestigationActions,
} from '@/components/vendors'

export const VendorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Dossier slide-over state
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  // Find vendor profile record
  const vendor = useMemo(() => (id ? getVendorProfile(id) : undefined), [id])

  // Get all projects for this vendor
  const projects = useMemo(() => (vendor ? getVendorProjects(vendor.name) : []), [vendor])

  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  const handleExportDossier = () => {
    if (!vendor) return
    const dossierText = `
================================================================================
NATIONAL MPLADS AUDIT COMMAND — VENDOR FORENSIC DOSSIER
================================================================================
Entity Name:           ${vendor.name}
GSTIN:                 ${vendor.gstin}
Registered State:      ${vendor.registeredState || 'N/A'}
Risk Score:            ${vendor.riskScore}/100 [Level: ${vendor.riskLevel.toUpperCase()}]
Primary Anomaly Flag:  ${vendor.primaryAnomaly}
Network Signal:        ${vendor.networkSignal || 'None'}

FINANCIAL SUMMARY:
- Total Sanctioned:    ${vendor.totalSanctioned}
- Total Disbursed:     ${vendor.totalDisbursed}
- Total Spent:         ${vendor.totalSpent}
- Flagged Capital:     ${vendor.flaggedCapital}
- Active Works:        ${vendor.activeWorks}
- Completed Works:     ${vendor.completedWorks}
- Flagged Works:       ${vendor.flaggedWorksCount} (${vendor.flaggedPercentage}%)

CONCENTRATION ANALYSIS:
- Project Share:       ${vendor.concentration.projectSharePercent}%
- Agency Share:        ${vendor.concentration.agencyConcentrationPercent}%
- Constituency Share:  ${vendor.concentration.constituencyConcentrationPercent}%
- Single-Bidder Ratio: ${vendor.concentration.singleBidderRatePercent}%
- Consecutive Awards:  ${vendor.concentration.consecutiveAwardsCount}

RISK CONTRIBUTORS:
${vendor.riskContributors
  .map(
    (rc) =>
      `[+${rc.points} pts] [${rc.severity.toUpperCase()}] ${rc.category} - ${rc.title}\n  ${rc.explanation}`
  )
  .join('\n')}

EXPORT TIMESTAMP: ${new Date().toISOString()}
Generated for statutory auditor review under MPLADS Sovereign Intelligence Protocol.
================================================================================
`.trim()

    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Vendor-Dossier-${vendor.id}-${vendor.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-3 select-none">
        <div className="w-12 h-12 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#EF4444]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#E7EBF5]">Vendor Record Not Found</h2>
        <p className="text-xs text-[#9AA5C1] max-w-md">
          No contractor matching token <code className="text-[#3B82F6] font-mono">{id}</code> exists
          in the active procurement registry.
        </p>
        <button
          onClick={() => navigate('/vendors')}
          className="mt-2 px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Vendors &amp; Contractors Directory</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-12 px-4 space-y-4">
      {/* 1. Profile Header with Banner, Actions, and KPI Strip */}
      <VendorProfileHeader
        vendor={vendor}
        onExportDossier={handleExportDossier}
      />

      {/* Global Investigation Context Breadcrumbs */}
      <InvestigationBreadcrumbs vendorName={vendor.name} />

      {/* 2. Section: Vendor Risk Assessment (Contributors, Points, Explanations) */}
      <VendorRiskAssessment
        contributors={vendor.riskContributors}
        totalScore={vendor.riskScore}
      />

      {/* 3. Section: Financials & Annual Disbursement Flow (Recharts Bar Chart) */}
      <VendorFinancials
        totalSanctioned={vendor.totalSanctioned}
        totalDisbursed={vendor.totalDisbursed}
        totalSpent={vendor.totalSpent}
        flaggedCapital={vendor.flaggedCapital}
        disbursementsByFy={vendor.disbursementsByFy}
      />

      {/* 4. Section: Procurement Concentration & Vendor Anomaly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ProcurementConcentration concentration={vendor.concentration} />
        <VendorAnomalyBreakdown anomaliesCount={vendor.anomaliesCount} />
      </div>

      {/* 5. Section: Geographic Footprint & Contractor Network Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <VendorGeographicFootprint states={vendor.states} />
        <VendorNetwork
          nodes={vendor.networkNodes}
          links={vendor.networkLinks}
          vendorName={vendor.name}
        />
      </div>

      {/* 6. Section: Vendor Project Portfolio Table */}
      <VendorProjectPortfolio
        projects={projects}
        onSelectProject={handleSelectProject}
      />

      {/* 7. Section: Related Entities (MPs, Constituencies, Agencies) */}
      <VendorRelatedEntities
        projects={projects}
        onSelectProject={handleSelectProject}
      />

      {/* 8. Section: Investigation Actions */}
      <VendorInvestigationActions
        vendor={vendor}
        onExportDossier={handleExportDossier}
      />

      {/* 9. Shared Forensic Dossier Drawer */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default VendorProfilePage
