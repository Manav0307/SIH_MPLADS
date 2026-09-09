import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { getAgencyProfile, getAgencyProjects } from '@/data'
import { ProjectRecord } from '@/types'
import { ProjectDossierDrawer } from '@/components/dossier'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import {
  AgencyProfileHeader,
  AgencyRiskAssessment,
  AgencyFundFlow,
  AgencyDisbursementTrend,
  AgencyProjectPortfolio,
  AgencyStatusAnalysis,
  AgencyAnomalyBreakdown,
  AgencyVendorConcentration,
  AgencyConstituencyFootprint,
  AgencyGeographicFootprint,
  AgencyRelatedEntities,
  AgencyInvestigationActions,
} from '@/components/agencies'

export const AgencyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Dossier slide-over state
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  // Find agency profile record
  const agency = useMemo(() => (id ? getAgencyProfile(id) : undefined), [id])

  // Get all projects for this agency
  const projects = useMemo(() => (agency ? getAgencyProjects(agency.name) : []), [agency])

  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  const handleExportDossier = () => {
    if (!agency) return
    const dossierText = `
================================================================================
NATIONAL MPLADS AUDIT COMMAND — IMPLEMENTING AGENCY FORENSIC DOSSIER
================================================================================
Agency Name:            ${agency.name}
Agency Type:            ${agency.agencyType}
Jurisdiction Base:      ${agency.topConstituency || 'Multi-Constituency'}
Risk Score:             ${agency.riskScore}/100 [Level: ${agency.riskLevel.toUpperCase()}]
Primary Anomaly Signal: ${agency.primaryAnomaly}

FINANCIAL & EXECUTION TELEMETRY:
- Total Sanctioned:     ${agency.totalSanctioned}
- Total Disbursed:      ${agency.totalDisbursed}
- Total Spent:          ${agency.totalSpent}
- Unutilized Balance:   ${agency.unutilizedAmount}
- Active Works:         ${agency.activeWorks}
- Completed Works:      ${agency.completedWorks}
- Delayed Works:        ${agency.delayedWorksCount}
- Flagged Works:        ${agency.flaggedWorksCount} (${agency.flaggedPercentage}%)
- Avg Project Value:    ${agency.avgProjectValue}

FUND FLOW CONVERSION RATIOS:
- Sanctioned / Recommended: ${agency.fundFlow.sanctionedVsRecommendedPercent}%
- Disbursed / Sanctioned:  ${agency.fundFlow.disbursedVsSanctionedPercent}%
- Spent / Disbursed:       ${agency.fundFlow.spentVsDisbursedPercent}%

EXECUTION STATUS BREAKDOWN:
- Recommended: ${agency.statusBreakdown.recommended}
- Sanctioned:  ${agency.statusBreakdown.sanctioned}
- Ongoing:     ${agency.statusBreakdown.ongoing}
- Completed:   ${agency.statusBreakdown.completed}
- Stalled:     ${agency.statusBreakdown.stalled}

RISK CONTRIBUTORS:
${agency.riskContributors
  .map(
    (rc) =>
      `[+${rc.points} points] [${rc.severity.toUpperCase()}] ${rc.category} - ${rc.title}\n  ${rc.explanation}`
  )
  .join('\n')}

TOP CONTRACTORS & VENDORS:
${agency.vendorConcentration
  .slice(0, 5)
  .map(
    (v) =>
      `- ${v.vendorName}: ${v.projectsCount} works, Disbursed: ${v.disbursedDisplay}, Flagged: ${v.flaggedPercentage}%`
  )
  .join('\n')}

CONSTITUENCY SPREAD:
${agency.constituencyFootprint
  .slice(0, 5)
  .map(
    (c) =>
      `- ${c.constituency} (${c.state}): ${c.projectsCount} works, Sanctioned: ${c.sanctionedDisplay}`
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
    link.download = `Agency-Dossier-${agency.id}-${agency.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!agency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-3 select-none">
        <div className="w-12 h-12 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#EF4444]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#E7EBF5]">Implementing Agency Record Not Found</h2>
        <p className="text-xs text-[#9AA5C1] max-w-md">
          No executing authority matching identifier{' '}
          <code className="text-[#3B82F6] font-mono">{id}</code> exists in the active registry.
        </p>
        <button
          onClick={() => navigate('/agencies')}
          className="mt-2 px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Implementing Agencies Directory</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-12 px-4 space-y-4">
      {/* 1. Profile Header with Banner, Actions, and KPI Strip */}
      <AgencyProfileHeader agency={agency} onExportDossier={handleExportDossier} />

      {/* Global Investigation Context Breadcrumbs */}
      <InvestigationBreadcrumbs agencyName={agency.name} />

      {/* 2. Section: Agency Risk Assessment (Contributors, Points, Explanations) */}
      <AgencyRiskAssessment
        contributors={agency.riskContributors}
        totalScore={agency.riskScore}
      />

      {/* 3. Section: Fund Flow Analysis & Disbursement Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AgencyFundFlow fundFlow={agency.fundFlow} />
        <AgencyDisbursementTrend disbursementsByFy={agency.disbursementsByFy} />
      </div>

      {/* 4. Section: Execution Status & Agency Anomaly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AgencyStatusAnalysis statusBreakdown={agency.statusBreakdown} />
        <AgencyAnomalyBreakdown anomaliesCount={agency.anomaliesCount} />
      </div>

      {/* 5. Section: Vendor Concentration & Constituency Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AgencyVendorConcentration vendors={agency.vendorConcentration} />
        <AgencyConstituencyFootprint constituencies={agency.constituencyFootprint} />
      </div>

      {/* 6. Section: Geographic Footprint & Related Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AgencyGeographicFootprint states={agency.states} />
        <AgencyRelatedEntities projects={projects} onSelectProject={handleSelectProject} />
      </div>

      {/* 7. Section: Agency Project Portfolio Table */}
      <AgencyProjectPortfolio projects={projects} onSelectProject={handleSelectProject} />

      {/* 8. Section: Investigation Actions */}
      <AgencyInvestigationActions agency={agency} onExportDossier={handleExportDossier} />

      {/* 9. Shared Forensic Dossier Drawer */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default AgencyProfilePage
