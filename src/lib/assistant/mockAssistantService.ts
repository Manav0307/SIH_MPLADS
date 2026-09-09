import {
  AssistantMessage,
  AssistantContext,
} from '@/types/assistant'
import { mockProjects } from '@/data/projects'
import { mockVendors, getVendorProfile } from '@/data/vendors'
import { mockMps } from '@/data/mps'
import { mockAgencies } from '@/data/agencies'
import { mockProjectForensics } from '@/data/investigation'
import { getAllCases, getCaseById, findCaseForProject } from '@/lib/caseRegistry'

// 7 core required example prompts
export const EXAMPLE_PROMPTS = [
  'Why is this project high risk?',
  'Summarize the evidence.',
  'What anomalies are linked to this vendor?',
  'Which rules caused the risk score?',
  'What should an auditor investigate next?',
  'Show related projects.',
  'Explain the financial exposure.',
]

export function getSuggestedQuestions(context: AssistantContext | null): string[] {
  if (!context) {
    return EXAMPLE_PROMPTS
  }

  if (context.type === 'vendor') {
    return [
      'What anomalies are linked to this vendor?',
      'Explain the financial exposure.',
      'Show related projects.',
      'Which rules caused the risk score?',
      'What should an auditor investigate next?',
      'Summarize the evidence.',
      'Why is this project high risk?',
    ]
  }

  if (context.type === 'case') {
    return [
      'Why is this project high risk?',
      'Summarize the evidence.',
      'Which rules caused the risk score?',
      'Explain the financial exposure.',
      'What should an auditor investigate next?',
      'What anomalies are linked to this vendor?',
      'Show related projects.',
    ]
  }

  if (context.type === 'mp') {
    return [
      'Explain the financial exposure.',
      'Show related projects.',
      'Why is this project high risk?',
      'What should an auditor investigate next?',
      'Summarize the evidence.',
      'What anomalies are linked to this vendor?',
      'Which rules caused the risk score?',
    ]
  }

  if (context.type === 'agency') {
    return [
      'Explain the financial exposure.',
      'What anomalies are linked to this vendor?',
      'Which rules caused the risk score?',
      'What should an auditor investigate next?',
      'Show related projects.',
      'Summarize the evidence.',
      'Why is this project high risk?',
    ]
  }

  return EXAMPLE_PROMPTS
}

export function resolveContextFromParams(searchParams: URLSearchParams): AssistantContext | null {
  const typeParam = searchParams.get('type')?.toLowerCase()
  const idParam =
    searchParams.get('id') ||
    searchParams.get('caseId') ||
    searchParams.get('project') ||
    searchParams.get('projectId') ||
    searchParams.get('workCode') ||
    searchParams.get('vendor') ||
    searchParams.get('mp') ||
    searchParams.get('agency')

  if (!idParam && !typeParam) {
    // Default to the highest risk project as a sensible demonstration context
    const defaultProject = mockProjects[0]
    if (defaultProject) {
      return {
        type: 'project',
        id: defaultProject.id,
        title: defaultProject.title,
        workCode: defaultProject.workCode,
        riskScore: defaultProject.riskScore,
        riskLevel: defaultProject.riskLevel,
        location: `${defaultProject.district}, ${defaultProject.state}`,
        metadata: {
          Vendor: defaultProject.vendor,
          Agency: defaultProject.agency,
          MP: defaultProject.mpName,
        },
      }
    }
    return null
  }

  // 1. Case context
  if (typeParam === 'case' || idParam?.toUpperCase().startsWith('CASE-')) {
    const caseItem = getCaseById(idParam || '') || getAllCases()[0]
    if (caseItem) {
      return {
        type: 'case',
        id: caseItem.id,
        title: `${caseItem.id} — ${caseItem.projectTitle}`,
        workCode: caseItem.workCode,
        riskScore: caseItem.riskScore,
        riskLevel: caseItem.severity,
        location: `${caseItem.district}, ${caseItem.state}`,
        metadata: {
          Status: caseItem.status,
          Officer: caseItem.assignedOfficer.name,
          Disbursed: caseItem.project?.disbursedDisplay || '₹46.20 L',
          Exposure: caseItem.financialExposureDisplay || '₹31.50 L',
        },
      }
    }
  }

  // 2. Project context
  if (typeParam === 'project' || typeParam === 'investigation' || idParam?.startsWith('proj-') || idParam?.startsWith('PRJ-')) {
    const proj =
      mockProjects.find(
        (p) =>
          p.id.toLowerCase() === idParam?.toLowerCase() ||
          p.workCode.toLowerCase() === idParam?.toLowerCase()
      ) || mockProjects[0]

    if (proj) {
      return {
        type: 'project',
        id: proj.id,
        title: proj.title,
        workCode: proj.workCode,
        riskScore: proj.riskScore,
        riskLevel: proj.riskLevel,
        location: `${proj.district}, ${proj.state}`,
        metadata: {
          Vendor: proj.vendor,
          Agency: proj.agency,
          MP: proj.mpName,
          Sanctioned: proj.sanctionedDisplay,
          Disbursed: proj.disbursedDisplay,
        },
      }
    }
  }

  // 3. Vendor context
  if (typeParam === 'vendor') {
    const vendor =
      mockVendors.find(
        (v) =>
          v.name.toLowerCase() === idParam?.toLowerCase() ||
          v.id.toLowerCase() === idParam?.toLowerCase()
      ) || mockVendors[0]

    if (vendor) {
      return {
        type: 'vendor',
        id: vendor.id,
        title: vendor.name,
        subtitle: `GSTIN: ${vendor.gstin}`,
        riskScore: vendor.riskScore,
        riskLevel: vendor.riskLevel,
        location: vendor.registeredState || 'National',
        metadata: {
          ActiveWorks: `${vendor.activeWorks} active`,
          FlaggedRate: `${vendor.flaggedPercentage}% flagged`,
          Disbursed: vendor.totalDisbursed,
        },
      }
    }
  }

  // 4. MP context
  if (typeParam === 'mp') {
    const mp =
      mockMps.find(
        (m) =>
          m.id.toLowerCase() === idParam?.toLowerCase() ||
          m.name.toLowerCase() === idParam?.toLowerCase() ||
          m.constituency.toLowerCase() === idParam?.toLowerCase()
      ) || mockMps[0]

    if (mp) {
      return {
        type: 'mp',
        id: mp.id,
        title: `${mp.name} (${mp.house === 'LS' ? 'Lok Sabha' : 'Rajya Sabha'})`,
        subtitle: `Constituency: ${mp.constituency}, ${mp.state}`,
        riskScore: mp.riskScore,
        riskLevel: mp.riskLevel,
        location: `${mp.constituency}, ${mp.state}`,
        metadata: {
          Party: mp.party,
          Allocated: mp.allocatedDisplay,
          Utilization: `${mp.utilizationPercent}%`,
          FlaggedWorks: `${mp.flaggedProjectsCount} flagged`,
        },
      }
    }
  }

  // 5. Agency context
  if (typeParam === 'agency') {
    const agency =
      mockAgencies.find(
        (a) =>
          a.id.toLowerCase() === idParam?.toLowerCase() ||
          a.name.toLowerCase() === idParam?.toLowerCase()
      ) || mockAgencies[0]

    if (agency) {
      return {
        type: 'agency',
        id: agency.id,
        title: agency.name,
        subtitle: `Type: ${agency.agencyType}`,
        riskScore: agency.riskScore,
        riskLevel: agency.riskLevel,
        location: agency.statePresence.join(', ') || 'Multi-State',
        metadata: {
          ActiveWorks: `${agency.activeWorks} active`,
          Delayed: `${agency.delayedWorksCount} delayed`,
          Disbursed: agency.totalDisbursed,
        },
      }
    }
  }

  return null
}

export function generateAssistantResponse(
  query: string,
  context: AssistantContext | null
): AssistantMessage {
  const normalized = query.toLowerCase().trim()
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Resolve target project for reference data
  let targetProject = mockProjects[0]
  if (context?.type === 'project') {
    targetProject = mockProjects.find((p) => p.id === context.id || p.workCode === context.workCode) || mockProjects[0]
  } else if (context?.type === 'case') {
    const caseRec = getCaseById(context.id)
    if (caseRec) {
      targetProject = mockProjects.find((p) => p.id === caseRec.projectId || p.workCode === caseRec.workCode) || mockProjects[0]
    }
  } else if (context?.type === 'vendor') {
    targetProject = mockProjects.find((p) => p.vendor.toLowerCase() === context.title.toLowerCase()) || mockProjects[0]
  }

  const forensics = mockProjectForensics[targetProject.id] || mockProjectForensics['proj-001']
  const caseItem = findCaseForProject(targetProject.id) || getAllCases()[0]
  const vendorRecord = mockVendors.find((v) => v.name === targetProject.vendor) || mockVendors[0]
  const vendorProfile = getVendorProfile(vendorRecord.id) || getVendorProfile(vendorRecord.name)
  const agencyRecord = mockAgencies.find((a) => a.name === targetProject.agency) || mockAgencies[0]
  const mpRecord = mockMps.find((m) => m.name === targetProject.mpName) || mockMps[0]

  // MATCH PROMPTS DETERMINISTICALLY
  // 1. "Why is this project high risk?"
  if (
    normalized.includes('why') &&
    (normalized.includes('risk') || normalized.includes('score') || normalized.includes('flagged'))
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 96.8,
      confidenceLabel: 'High Assurance (CAG Forensic Audit Model)',
      text: `Project ${targetProject.workCode} (${targetProject.title}) is categorized as ${targetProject.riskLevel.toUpperCase()} RISK (${targetProject.riskScore}/100) due to a critical divergence between physical milestone execution (35%) and capital outflow (95.2%), compounded by procurement concentration with ${targetProject.vendor}. Three statutory fraud rules have triggered statutory holds under MoSPI guidelines.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: 'Physical Audit vs Disbursal Inversion',
          description: `Disbursed ₹${(targetProject.disbursedAmount / 100000).toFixed(2)} Lakhs (95.2%) while NIC Geospatial ground verification confirms physical progress stalled at 35%.`,
          status: 'critical',
          metric: '60.2% Physical Disconnect',
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Accelerated Premature Milestone Payouts',
          description: 'Implementing agency certified non-existent structural completion to release final tranches before monsoons.',
          status: 'critical',
          metric: 'Rule FIN-04 Triggered',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: 'Severe Fiscal Misappropriation Risk',
          description: 'Calculated composite risk score of 96/100 combining rule sanctions (34 pts), statistical cost variance (28 pts), and graph clustering (34 pts).',
          status: 'critical',
          metric: 'Score: 96/100',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: `Public Capital Exposure of ₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
          description: 'Unaccounted public treasury capital at risk of non-recovery; contractor has abandoned structural masonry.',
          status: 'alert',
          metric: '₹31.50 L Flagged',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Issue PFMS Stop-Payment & Invoke Bank Guarantee',
          description: 'Immediately freeze PFMS sub-treasury tranche transfers, attach earnest money deposit, and dispatch CAG field inspector.',
          status: 'active',
          metric: 'Immediate Enforcement',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-1',
          title: 'PFMS Disbursal Ledger Disconnect',
          description: `95.2% funds disbursed (₹${(targetProject.disbursedAmount / 100000).toFixed(2)} L) against only 35% verified physical completion.`,
          metric: '₹46.20 L Paid',
          severity: 'critical',
          route: `/cases?id=${caseItem.id}&tab=evidence`,
          targetType: 'case',
          targetId: caseItem.id,
        },
        {
          id: 'ev-2',
          title: 'GIS Satellite Ground Verification',
          description: 'Overhead imagery reveals rust on exposed rebar, no active labor workforce on site for >90 days.',
          metric: 'Overdue 180d',
          severity: 'high',
          route: `/investigation?project=${targetProject.id}`,
          targetType: 'project',
          targetId: targetProject.id,
        },
        {
          id: 'ev-3',
          title: 'Vendor Procurement Clustering',
          description: `${targetProject.vendor} secured 8 consecutive contracts in the same taluka in 14 days without competitive bids.`,
          metric: '8 Consecutive Awards',
          severity: 'high',
          route: `/vendors/${encodeURIComponent(targetProject.vendor)}`,
          targetType: 'vendor',
          targetId: vendorRecord.id,
        },
      ],
      ruleReferences: [
        {
          code: 'RULE-FIN-04',
          title: 'Disbursal-Progress Divergence',
          category: 'Financial Irregularity',
          weight: 34,
          status: 'TRIGGERED',
          description: 'Tranche release exceeds certified ground progress by more than 40%.',
        },
        {
          code: 'RULE-PROC-08',
          title: 'Split Tender Circumvention',
          category: 'Procurement Integrity',
          weight: 28,
          status: 'TRIGGERED',
          description: 'Works divided into multiple ₹49 Lakh parcels to avoid mandatory national e-tendering.',
        },
        {
          code: 'RULE-GEO-02',
          title: 'Spatial Proximity Clustering',
          category: 'Geospatial Intelligence',
          weight: 24,
          status: 'TRIGGERED',
          description: 'Duplicate GPS centroid overlap with previously completed drinking water scheme.',
        },
      ],
      financialExposure: {
        sanctioned: targetProject.sanctionedDisplay,
        disbursed: targetProject.disbursedDisplay,
        spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
        exposure: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
        variancePercent: '+280% vs District Benchmark',
      },
      relatedEntities: [
        {
          type: 'case',
          name: caseItem.id,
          id: caseItem.id,
          role: 'Active Statutory Audit Case',
          riskScore: caseItem.riskScore,
          riskLevel: caseItem.severity,
          route: `/cases?id=${caseItem.id}`,
        },
        {
          type: 'vendor',
          name: targetProject.vendor,
          id: vendorRecord.id,
          role: 'Contracted Execution Partner',
          riskScore: vendorRecord.riskScore,
          riskLevel: vendorRecord.riskLevel,
          route: `/vendors/${encodeURIComponent(targetProject.vendor)}`,
        },
        {
          type: 'agency',
          name: targetProject.agency,
          id: agencyRecord.id,
          role: 'Implementing Executing Authority',
          riskScore: agencyRecord.riskScore,
          riskLevel: agencyRecord.riskLevel,
          route: `/agencies/${encodeURIComponent(targetProject.agency)}`,
        },
        {
          type: 'mp',
          name: targetProject.mpName,
          id: mpRecord.id,
          role: 'Recommending Parliamentarian',
          riskScore: mpRecord.riskScore,
          riskLevel: mpRecord.riskLevel,
          route: `/mps/${encodeURIComponent(targetProject.mpName)}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-1',
          label: 'Open Statutory Case',
          actionType: 'open_case',
          route: `/cases?id=${caseItem.id}`,
        },
        {
          id: 'act-2',
          label: 'View Detailed Evidence',
          actionType: 'view_evidence',
          route: `/cases?id=${caseItem.id}&tab=evidence`,
        },
        {
          id: 'act-3',
          label: 'Investigate Project Dossier',
          actionType: 'investigate_project',
          route: `/investigation?project=${targetProject.id}`,
        },
        {
          id: 'act-4',
          label: 'Escalate to CAG Cell',
          actionType: 'escalate',
          route: `/cases?id=${caseItem.id}&action=escalate`,
        },
      ],
    }
  }

  // 2. "Summarize the evidence."
  if (
    normalized.includes('summarize') && normalized.includes('evidence') ||
    normalized.includes('evidence') && (normalized.includes('summary') || normalized.includes('what') || normalized.includes('list'))
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 98.2,
      confidenceLabel: 'Verified Multi-Source Corroboration',
      text: `Audit evidence synthesis for ${targetProject.workCode}: Four primary forensic artifacts corroborate non-compliance across PFMS, NIC GIS, and State Procurement Portals. Physical deliverables show an estimated deficit of ₹31.50 Lakhs between released payments and verified on-ground assets.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: '3-Way Corroboration (PFMS + NIC GIS + GeM)',
          description: 'Bank credit alerts registered on 12-Nov-2025; physical milestone certificate signed by unauthorized junior clerk.',
          status: 'critical',
          metric: '3 Independent Signals',
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Fabricated Measurement Book (MB) Entry',
          description: 'Measurement Book #MB-2025-88 contains copied cross-sectional dimensions from a 2023 municipal project.',
          status: 'critical',
          metric: 'MB Forgery Identified',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: 'Grade-A Forensic Irregularity',
          description: 'Evidence warrants formal issuance of Form-CAG-8 under Section 14 of the CAG DPC Act.',
          status: 'critical',
          metric: 'Statutory Grade A',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: 'Sanctioned Scheme Stoppage',
          description: 'Beneficiary village lacks clean potable water supply despite full utilization of annual MPLADS allocation.',
          status: 'alert',
          metric: '14,200 Citizens Impacted',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Empanel Field Inspection Team',
          description: 'Dispatch an Executive Engineer along with District Collector representatives for a physical core audit.',
          status: 'active',
          metric: 'Notice to Executive Engineer',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-mb',
          title: 'Forged Measurement Book Entries (#MB-88)',
          description: 'Identical handwriting and dimension readings copied from preceding completed road tender.',
          metric: 'MB #88 Vol 3',
          severity: 'critical',
          route: `/cases?id=${caseItem.id}&tab=evidence`,
          targetType: 'case',
          targetId: caseItem.id,
        },
        {
          id: 'ev-geo',
          title: 'ISRO Bhuvan High-Res Satellite Pass',
          description: 'Temporal comparison between Dec 2024 and Jan 2026 shows 0 square meters of new masonry completed.',
          metric: 'Bhuvan-3 v2.4',
          severity: 'critical',
          route: `/investigation?project=${targetProject.id}`,
          targetType: 'project',
          targetId: targetProject.id,
        },
        {
          id: 'ev-gem',
          title: 'GeM Procurement Non-Compliance',
          description: 'Materials purchased at 280% markup above GeM benchmark rates without competitive bid notes.',
          metric: '+280% Variance',
          severity: 'high',
          route: `/vendors/${encodeURIComponent(targetProject.vendor)}`,
          targetType: 'vendor',
          targetId: vendorRecord.id,
        },
      ],
      ruleReferences: [
        {
          code: 'RULE-FIN-04',
          title: 'Disbursal-Progress Divergence',
          category: 'Financial Irregularity',
          weight: 34,
          status: 'TRIGGERED',
        },
        {
          code: 'RULE-MB-01',
          title: 'Measurement Book Authenticity Validation',
          category: 'Statutory Verification',
          weight: 30,
          status: 'TRIGGERED',
        },
      ],
      financialExposure: {
        sanctioned: targetProject.sanctionedDisplay,
        disbursed: targetProject.disbursedDisplay,
        spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
        exposure: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
        variancePercent: '60.2% Physical Gap',
      },
      relatedEntities: [
        {
          type: 'case',
          name: caseItem.id,
          id: caseItem.id,
          role: 'Statutory Case File',
          riskScore: caseItem.riskScore,
          riskLevel: caseItem.severity,
          route: `/cases?id=${caseItem.id}`,
        },
        {
          type: 'project',
          name: targetProject.title,
          id: targetProject.id,
          role: 'Audited Work Code',
          riskScore: targetProject.riskScore,
          riskLevel: targetProject.riskLevel,
          route: `/investigation?project=${targetProject.id}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-view-ev',
          label: 'View Evidence Repository',
          actionType: 'view_evidence',
          route: `/cases?id=${caseItem.id}&tab=evidence`,
        },
        {
          id: 'act-note',
          label: 'Add Investigation Note',
          actionType: 'add_note',
          payload: { caseId: caseItem.id },
        },
        {
          id: 'act-case',
          label: 'Open Case Dossier',
          actionType: 'open_case',
          route: `/cases?id=${caseItem.id}`,
        },
      ],
    }
  }

  // 3. "What anomalies are linked to this vendor?"
  if (
    normalized.includes('vendor') &&
    (normalized.includes('anomaly') || normalized.includes('anomalies') || normalized.includes('linked') || normalized.includes('contractor'))
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 94.5,
      confidenceLabel: 'Procurement Graph Analysis',
      text: `Vendor Analysis for "${vendorRecord.name}": 4 primary anomaly patterns detected across ${vendorRecord.activeWorks + (vendorRecord.completedWorks || 0)} projects. Single-bidder award rate is ${vendorProfile?.concentration?.singleBidderRatePercent || 72}%, with ${vendorProfile?.concentration?.consecutiveAwardsCount || 8} consecutive awards granted in a single 14-day window. Total capital flagged across this vendor's network is ${vendorProfile?.flaggedCapital || '₹1.84 Cr'}.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: 'High Single-Bidder Concentration',
          description: `Contractor won ${vendorProfile?.concentration?.singleBidderRatePercent || 72}% of tenders with zero or disqualified competing bidders in the taluka.`,
          status: 'critical',
          metric: `${vendorProfile?.concentration?.singleBidderRatePercent || 72}% Solo Bids`,
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Procurement Cartelization Signal',
          description: 'Competing bids originated from the same IP subnet (103.24.12.x) and shared an identical notarized affidavit format.',
          status: 'critical',
          metric: 'Shared IP Cluster',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: `Vendor Risk Index: ${vendorRecord.riskScore}/100`,
          description: 'Categorized under High Procurement Cartelization Watchlist pursuant to CVC Circular 02/2024.',
          status: 'critical',
          metric: `${vendorRecord.riskScore} High Risk`,
        },
        impact: {
          label: 'Stage 4: Impact',
          title: `${vendorRecord.flaggedWorksCount} Stalled or Flagged Projects`,
          description: `Public treasury exposure of ${vendorProfile?.flaggedCapital || '₹1.84 Cr'} across 3 parliamentary constituencies.`,
          status: 'alert',
          metric: vendorProfile?.flaggedCapital || '₹1.84 Cr Exposure',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Initiate Debarment Review & Tax Cross-Audit',
          description: 'Refer GSTIN to Central Board of Indirect Taxes (CBIC) for invoice verification and review debarment.',
          status: 'active',
          metric: 'Referral to CVC / CBIC',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-v-1',
          title: 'Tender Submission Timestamp Inversion',
          description: 'Four tenders submitted within 9 minutes of e-portal tender release.',
          metric: '9 min velocity',
          severity: 'critical',
          route: `/vendors/${encodeURIComponent(vendorRecord.name)}`,
          targetType: 'vendor',
          targetId: vendorRecord.id,
        },
        {
          id: 'ev-v-2',
          title: 'Consecutive Taluka Contract Awards',
          description: `${vendorProfile?.concentration?.consecutiveAwardsCount || 8} consecutive works awarded by ${targetProject.agency}.`,
          metric: `${vendorProfile?.concentration?.consecutiveAwardsCount || 8} awards in 14d`,
          severity: 'high',
          route: `/vendors/${encodeURIComponent(vendorRecord.name)}`,
          targetType: 'vendor',
          targetId: vendorRecord.id,
        },
      ],
      ruleReferences: [
        {
          code: 'RULE-PROC-08',
          title: 'Procurement Cartelization & Ring Bidding',
          category: 'Tender Integrity',
          weight: 35,
          status: 'TRIGGERED',
        },
        {
          code: 'RULE-VEND-03',
          title: 'High Volume Clustering without Prequalification',
          category: 'Contractor Risk',
          weight: 25,
          status: 'TRIGGERED',
        },
      ],
      financialExposure: {
        sanctioned: vendorRecord.totalSanctioned || '₹3.45 Cr',
        disbursed: vendorRecord.totalDisbursed,
        spent: vendorRecord.totalSpent || '₹1.20 Cr',
        exposure: vendorProfile?.flaggedCapital || '₹1.84 Cr',
        variancePercent: `${vendorRecord.flaggedPercentage}% flagged portfolio`,
      },
      relatedEntities: [
        {
          type: 'vendor',
          name: vendorRecord.name,
          id: vendorRecord.id,
          role: 'Under Cartelization Scrutiny',
          riskScore: vendorRecord.riskScore,
          riskLevel: vendorRecord.riskLevel,
          route: `/vendors/${encodeURIComponent(vendorRecord.name)}`,
        },
        {
          type: 'agency',
          name: targetProject.agency,
          id: agencyRecord.id,
          role: 'Executing Award Authority',
          riskScore: agencyRecord.riskScore,
          riskLevel: agencyRecord.riskLevel,
          route: `/agencies/${encodeURIComponent(targetProject.agency)}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-v-profile',
          label: 'View Vendor Profile',
          actionType: 'view_vendor',
          route: `/vendors/${encodeURIComponent(vendorRecord.name)}`,
        },
        {
          id: 'act-v-projects',
          label: 'Investigate Vendor Projects',
          actionType: 'investigate_project',
          route: `/projects?vendor=${encodeURIComponent(vendorRecord.name)}`,
        },
        {
          id: 'act-v-case',
          label: 'Open Linked Cases',
          actionType: 'open_case',
          route: `/cases?q=${encodeURIComponent(vendorRecord.name)}`,
        },
      ],
    }
  }

  // 4. "Which rules caused the risk score?"
  if (
    normalized.includes('which rules') ||
    normalized.includes('rules caused') ||
    normalized.includes('rule breakdown') ||
    normalized.includes('caused the risk score') ||
    (normalized.includes('rules') && normalized.includes('score'))
  ) {
    const breakdown = forensics?.riskBreakdown || {
      ruleEngine: 34,
      statisticalEngine: 28,
      mlEngine: 34,
      consolidatedScore: 96,
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 99.1,
      confidenceLabel: 'Deterministic Rule Engine Telemetry',
      text: `Composite Risk Score of ${breakdown.consolidatedScore}/100 is generated by three decoupled detection engines: Rule Violation Engine (+${breakdown.ruleEngine} pts), Statistical Outlier Engine (+${breakdown.statisticalEngine} pts), and Graph ML Engine (+${breakdown.mlEngine} pts). Three specific statutory rules registered non-zero penalties.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: '3 Deterministic Engine Hits',
          description: 'Payment timing anomalies, cost dispersion >2.5 standard deviations, and high bipartite vendor graph centrality.',
          status: 'critical',
          metric: 'Score +96 pts',
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Multi-Vector Statutory Non-Compliance',
          description: 'Violations span Chapter IV (Sanctions), Chapter VII (Disbursals), and Rule 149 of General Financial Rules (GFR 2017).',
          status: 'critical',
          metric: '3 Rule Triggers',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: `Weight Attribution: Rule (${breakdown.ruleEngine}%) / Stat (${breakdown.statisticalEngine}%) / ML (${breakdown.mlEngine}%)`,
          description: 'Zero false-positive confidence due to empirical satellite and bank payment proof.',
          status: 'critical',
          metric: 'P(Anomaly) = 0.968',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: 'Statutory Audit Summon Requirement',
          description: 'Automated referral triggered for Principal Auditor General review under Section 13.',
          status: 'alert',
          metric: 'Audit Referral Level 1',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Generate Statutory Audit Observation Sheet',
          description: 'Issue preliminary inquiry summons to District Authority and Implementing Agency.',
          status: 'active',
          metric: 'Formal Audit Memo',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-r-1',
          title: 'Rule Engine Breakdown: Disbursal Timing',
          description: 'PFMS payment released before issuance of Third Party Inspection (TPI) certificate.',
          metric: '+34 Points',
          severity: 'critical',
          route: `/investigation?project=${targetProject.id}`,
          targetType: 'project',
          targetId: targetProject.id,
        },
        {
          id: 'ev-r-2',
          title: 'Statistical Variance: Category Median',
          description: 'Cost per linear kilometer is ₹12.4 Lakhs vs state median of ₹4.8 Lakhs.',
          metric: '+28 Points',
          severity: 'high',
          route: `/anomalies`,
          targetType: 'project',
          targetId: targetProject.id,
        },
      ],
      ruleReferences: [
        {
          code: 'RULE-FIN-04',
          title: 'Premature Disbursal before Physical Milestone',
          category: 'Public Finance Management',
          weight: 34,
          status: 'TRIGGERED',
          description: 'Funds disbursed exceed physical ground progress by >40%.',
        },
        {
          code: 'RULE-STAT-02',
          title: 'Expenditure Z-Score Outlier (>2.5σ)',
          category: 'Statistical Distribution',
          weight: 28,
          status: 'TRIGGERED',
          description: 'Sanctioned unit cost exceeds 99th percentile of comparable works.',
        },
        {
          code: 'RULE-ML-07',
          title: 'Bipartite Network Centrality Anomaly',
          category: 'Graph Intelligence',
          weight: 34,
          status: 'TRIGGERED',
          description: 'Abnormal concentration between contractor and allocating nodal officer.',
        },
      ],
      financialExposure: {
        sanctioned: targetProject.sanctionedDisplay,
        disbursed: targetProject.disbursedDisplay,
        spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
        exposure: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
        variancePercent: '+258% Cost Variance',
      },
      relatedEntities: [
        {
          type: 'project',
          name: targetProject.workCode,
          id: targetProject.id,
          role: 'Evaluated Work Code',
          riskScore: targetProject.riskScore,
          riskLevel: targetProject.riskLevel,
          route: `/investigation?project=${targetProject.id}`,
        },
        {
          type: 'case',
          name: caseItem.id,
          id: caseItem.id,
          role: 'Enforcement Case',
          riskScore: caseItem.riskScore,
          riskLevel: caseItem.severity,
          route: `/cases?id=${caseItem.id}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-rules-case',
          label: 'Review in Case Workspace',
          actionType: 'open_case',
          route: `/cases?id=${caseItem.id}`,
        },
        {
          id: 'act-rules-inv',
          label: 'Deconstruct in Investigation Explorer',
          actionType: 'investigate_project',
          route: `/investigation?project=${targetProject.id}`,
        },
      ],
    }
  }

  // 5. "What should an auditor investigate next?"
  if (
    normalized.includes('what should') ||
    normalized.includes('investigate next') ||
    normalized.includes('next step') ||
    normalized.includes('what next') ||
    normalized.includes('auditor investigate')
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 97.4,
      confidenceLabel: 'CAG Standard Operating Procedure (SOP)',
      text: `Recommended 4-Step Forensic Protocol for Auditor General Desk:\n1. Issue a PFMS Stop-Payment Notice to freeze unreleased tranches (Order #PFMS-2026-HOLD).\n2. Request certified Measurement Book #88 and concrete batch mix test certificates from the District Planning Officer.\n3. Conduct joint physical inspection using geotagged ground photographs.\n4. Verify bank account beneficiary details of ${targetProject.vendor} against GST e-invoices.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: 'Unspent Tranche at Risk',
          description: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} Lakhs remains liquid in commercial escrow account without ground assets.`,
          status: 'critical',
          metric: 'Actionable Liquidity',
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Imminent Final Settlement Risk',
          description: 'Agency has prepared final completion certification despite stalled works; approval imminent.',
          status: 'alert',
          metric: 'Tender Closing in 14d',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: 'High Risk of Permanent Treasury Loss',
          description: 'If final settlement is processed, recovery through revenue courts typically exceeds 48 months.',
          status: 'critical',
          metric: 'Irreversible Loss Risk',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: 'Statutory Scheme Accountability',
          description: 'Preserves fiscal integrity and prevents systemic precedent for duplicate payment drawal.',
          status: 'normal',
          metric: '₹31.50 L Preventative Save',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Execute Tranche Freeze & Issue Summons',
          description: 'Immediately trigger PFMS freeze in Case Management and assign Senior Audit Officer for physical visit.',
          status: 'active',
          metric: 'Priority Action',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-sop-1',
          title: 'Escrow Bank Account Status',
          description: 'Funds held in State Bank of India sub-treasury nodal account #XXXX9021.',
          metric: 'Liquid Funds',
          severity: 'high',
          route: `/cases?id=${caseItem.id}`,
          targetType: 'case',
          targetId: caseItem.id,
        },
      ],
      ruleReferences: [
        {
          code: 'SOP-AUD-01',
          title: 'CAG Pre-emptive Fiscal Safeguard Protocol',
          category: 'Audit Directive',
          weight: 40,
          status: 'EVALUATED',
        },
      ],
      financialExposure: {
        sanctioned: targetProject.sanctionedDisplay,
        disbursed: targetProject.disbursedDisplay,
        spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
        exposure: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
        variancePercent: 'Target for Immediate Recovery',
      },
      relatedEntities: [
        {
          type: 'case',
          name: caseItem.id,
          id: caseItem.id,
          role: 'Active Audit Case',
          riskScore: caseItem.riskScore,
          riskLevel: caseItem.severity,
          route: `/cases?id=${caseItem.id}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-freeze',
          label: 'Execute PFMS Tranche Hold',
          actionType: 'open_case',
          route: `/cases?id=${caseItem.id}`,
        },
        {
          id: 'act-note-rec',
          label: 'Add Inspection Note',
          actionType: 'add_note',
          payload: { caseId: caseItem.id },
        },
        {
          id: 'act-escalate',
          label: 'Escalate to Principal AG',
          actionType: 'escalate',
          route: `/cases?id=${caseItem.id}&action=escalate`,
        },
      ],
    }
  }

  // 6. "Show related projects."
  if (
    normalized.includes('related project') ||
    normalized.includes('show related') ||
    normalized.includes('similar project') ||
    normalized.includes('other works')
  ) {
    const sameVendorProjects = mockProjects.filter((p) => p.vendor === targetProject.vendor && p.id !== targetProject.id).slice(0, 3)
    const sameDistrictProjects = mockProjects.filter((p) => p.district === targetProject.district && p.id !== targetProject.id).slice(0, 2)

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 95.7,
      confidenceLabel: 'Network Cluster Intelligence',
      text: `Found ${sameVendorProjects.length + sameDistrictProjects.length} related projects sharing contractor, agency, or constituency linkages with ${targetProject.workCode}. A cross-project pattern of delayed physical progress alongside front-loaded disbursements is evident across ${targetProject.vendor}'s portfolio.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: 'Shared Execution Footprint',
          description: `${targetProject.vendor} holds ${vendorRecord.activeWorks} active MPLADS projects in ${targetProject.state}, with ${vendorRecord.flaggedPercentage}% flagged for inspection.`,
          status: 'alert',
          metric: `${vendorRecord.activeWorks} Works in Cluster`,
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Systemic Modus Operandi',
          description: 'Identical delay profiles (overdue >150 days) and inflated initial mobilization advances across all 3 sister works.',
          status: 'critical',
          metric: 'Replicated Pattern',
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: 'Portfolio-Level Contagion Risk',
          description: 'Aggregate portfolio risk rating exceeds 85/100, necessitating cluster-wide audit summons.',
          status: 'critical',
          metric: 'Cluster Score: 92/100',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: `Cumulative Capital at Risk: ${vendorProfile?.flaggedCapital || '₹1.84 Cr'}`,
          description: 'Potential multi-scheme insolvency if contractor defaults simultaneously across district works.',
          status: 'alert',
          metric: vendorProfile?.flaggedCapital || '₹1.84 Cr',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Consolidate into Comprehensive Case Group',
          description: 'Link sister work codes into an umbrella statutory investigation case.',
          status: 'active',
          metric: 'Group Enforcement',
        },
      },
      evidenceCitations: sameVendorProjects.map((p, idx) => ({
        id: `ev-rel-${idx}`,
        title: `${p.workCode} — ${p.title}`,
        description: `Disbursed: ${p.disbursedDisplay} | Status: ${p.status} | Risk: ${p.riskScore}/100`,
        metric: `${p.riskScore} Risk`,
        severity: p.riskLevel,
        route: `/investigation?project=${p.id}`,
        targetType: 'project' as const,
        targetId: p.id,
      })),
      ruleReferences: [
        {
          code: 'RULE-GEO-02',
          title: 'District Cluster Density Violation',
          category: 'Spatial Intelligence',
          weight: 22,
          status: 'TRIGGERED',
        },
      ],
      financialExposure: {
        sanctioned: vendorRecord.totalSanctioned || '₹3.45 Cr',
        disbursed: vendorRecord.totalDisbursed,
        spent: vendorRecord.totalSpent || '₹1.20 Cr',
        exposure: vendorProfile?.flaggedCapital || '₹1.84 Cr',
        variancePercent: 'Cluster Portfolio Exposure',
      },
      relatedEntities: sameVendorProjects.map((p) => ({
        type: 'project' as const,
        name: p.title,
        id: p.id,
        role: `${p.workCode} (${p.vendor})`,
        riskScore: p.riskScore,
        riskLevel: p.riskLevel,
        route: `/investigation?project=${p.id}`,
      })),
      recommendedActions: [
        {
          id: 'act-proj-all',
          label: 'View All Vendor Projects',
          actionType: 'investigate_project',
          route: `/projects?vendor=${encodeURIComponent(targetProject.vendor)}`,
        },
        {
          id: 'act-vendor-view',
          label: 'Inspect Vendor Profile',
          actionType: 'view_vendor',
          route: `/vendors/${encodeURIComponent(targetProject.vendor)}`,
        },
      ],
    }
  }

  // 7. "Explain the financial exposure."
  if (
    normalized.includes('financial exposure') ||
    normalized.includes('financial') ||
    normalized.includes('exposure') ||
    normalized.includes('fund') ||
    normalized.includes('disburs') ||
    normalized.includes('spent')
  ) {
    const unspentDisbursed = Math.max(0, targetProject.disbursedAmount - targetProject.spentAmount)
    const exposureDisplay = `₹${(unspentDisbursed / 100000).toFixed(2)} Lakhs`

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      isDemonstration: true,
      confidence: 99.4,
      confidenceLabel: 'PFMS Treasury Reconciled Data',
      text: `Financial Exposure Analysis for ${targetProject.workCode}: Total sanctioned allocation is ${targetProject.sanctionedDisplay}, of which ${targetProject.disbursedDisplay} (95.2%) has been disbursed from the district treasury into the vendor account. Only ₹${(targetProject.spentAmount / 100000).toFixed(2)} Lakhs has been physically converted into on-ground assets, leaving an immediate unverified fiscal exposure of ${exposureDisplay}.`,
      reasoningChain: {
        evidence: {
          label: 'Stage 1: Evidence',
          title: 'Treasury Disbursal Ledger Verification',
          description: `Direct Bank Transfer (DBT) confirmed by PFMS on 14-Oct-2025 (Reference #PFMS-DBT-8891).`,
          status: 'alert',
          metric: `${targetProject.disbursedDisplay} Released`,
        },
        finding: {
          label: 'Stage 2: Finding',
          title: 'Severe Execution Deficit',
          description: `Contractor expenditure vouchers total only ₹${(targetProject.spentAmount / 100000).toFixed(2)} L. Remainder unaccounted in milestone reports.`,
          status: 'critical',
          metric: `${exposureDisplay} Unaccounted`,
        },
        riskAssessment: {
          label: 'Stage 3: Risk Assessment',
          title: 'High Material Misstatement Risk',
          description: 'Direct breach of Rule 160 of GFR 2017 regarding non-submission of Utilization Certificate (UC).',
          status: 'critical',
          metric: 'UC Pending >120d',
        },
        impact: {
          label: 'Stage 4: Impact',
          title: 'Constituency Development Loss',
          description: 'Lapse of parliamentary funds without statutory asset creation; interest loss calculated at 8.5% p.a.',
          status: 'alert',
          metric: 'Statutory UC Lapse',
        },
        recommendedAction: {
          label: 'Stage 5: Recommended Action',
          title: 'Freeze Escrow & Issue Demand Notice',
          description: 'Direct District Treasury Officer to lock tranche and issue recovery summons to contractor.',
          status: 'active',
          metric: 'Recovery Demand',
        },
      },
      evidenceCitations: [
        {
          id: 'ev-fin-1',
          title: 'PFMS Disbursal Voucher #V-8812',
          description: `₹${(targetProject.disbursedAmount / 100000).toFixed(2)} L disbursed to ${targetProject.vendor}.`,
          metric: 'PFMS Voucher',
          severity: 'critical',
          route: `/cases?id=${caseItem.id}`,
          targetType: 'case',
          targetId: caseItem.id,
        },
        {
          id: 'ev-fin-2',
          title: 'Utilization Certificate (UC) Delay Notice',
          description: 'Statutory deadline expired 90 days ago; Form GFR-12A not submitted.',
          metric: 'Overdue 90d',
          severity: 'high',
          route: `/investigation?project=${targetProject.id}`,
          targetType: 'project',
          targetId: targetProject.id,
        },
      ],
      ruleReferences: [
        {
          code: 'RULE-FIN-04',
          title: 'Disbursal-Progress Divergence',
          category: 'Financial Irregularity',
          weight: 34,
          status: 'TRIGGERED',
        },
        {
          code: 'GFR-RULE-160',
          title: 'Mandatory Utilization Certificate Compliance',
          category: 'Statutory Finance',
          weight: 25,
          status: 'TRIGGERED',
        },
      ],
      financialExposure: {
        sanctioned: targetProject.sanctionedDisplay,
        disbursed: targetProject.disbursedDisplay,
        spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
        exposure: exposureDisplay,
        variancePercent: '+280% Disbursal Overhang',
      },
      relatedEntities: [
        {
          type: 'case',
          name: caseItem.id,
          id: caseItem.id,
          role: 'Active Audit Case',
          riskScore: caseItem.riskScore,
          riskLevel: caseItem.severity,
          route: `/cases?id=${caseItem.id}`,
        },
        {
          type: 'vendor',
          name: targetProject.vendor,
          id: vendorRecord.id,
          role: 'Recipient Contractor',
          riskScore: vendorRecord.riskScore,
          riskLevel: vendorRecord.riskLevel,
          route: `/vendors/${encodeURIComponent(targetProject.vendor)}`,
        },
        {
          type: 'agency',
          name: targetProject.agency,
          id: agencyRecord.id,
          role: 'Disbursing Agency',
          riskScore: agencyRecord.riskScore,
          riskLevel: agencyRecord.riskLevel,
          route: `/agencies/${encodeURIComponent(targetProject.agency)}`,
        },
      ],
      recommendedActions: [
        {
          id: 'act-fin-case',
          label: 'Open Case in Case Management',
          actionType: 'open_case',
          route: `/cases?id=${caseItem.id}`,
        },
        {
          id: 'act-fin-agency',
          label: 'Inspect Implementing Agency',
          actionType: 'view_agency',
          route: `/agencies/${encodeURIComponent(targetProject.agency)}`,
        },
        {
          id: 'act-fin-note',
          label: 'Record Fiscal Note',
          actionType: 'add_note',
          payload: { caseId: caseItem.id },
        },
      ],
    }
  }

  // DEFAULT / CONTEXTUAL RESPONSE for any other query
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp,
    isDemonstration: true,
    confidence: 93.8,
    confidenceLabel: 'Demonstration Engine Synthesis',
    text: `Forensic inquiry processed for "${query}". Cross-referencing against active MPLADS dataset: Target entity ${context?.title || targetProject.title} (${context?.workCode || targetProject.workCode}) exhibits elevated audit alerts. Risk score stands at ${context?.riskScore || targetProject.riskScore}/100 with ${targetProject.primaryAnomaly} flagged in the latest monitoring cycle.`,
    reasoningChain: {
      evidence: {
        label: 'Stage 1: Evidence',
        title: 'Query Telemetry Cross-Match',
        description: `Correlated query parameters with ${context?.type || 'project'} records in ${targetProject.district}, ${targetProject.state}.`,
        status: 'alert',
        metric: 'Telemetry Match',
      },
      finding: {
        label: 'Stage 2: Finding',
        title: 'Active Oversight Scrutiny',
        description: 'Records match registered anomaly patterns under CAG Sovereign Audit Directive.',
        status: 'critical',
        metric: 'Pattern Identified',
      },
      riskAssessment: {
        label: 'Stage 3: Risk Assessment',
        title: `Assigned Risk Level: ${(context?.riskLevel || targetProject.riskLevel).toUpperCase()}`,
        description: 'Weighted combination of financial disbursal gaps, vendor clustering, and timeline overdue metrics.',
        status: 'critical',
        metric: `Score: ${context?.riskScore || targetProject.riskScore}/100`,
      },
      impact: {
        label: 'Stage 4: Impact',
        title: `Public Capital Footprint: ${targetProject.disbursedDisplay}`,
        description: 'Disbursed public capital subject to mandatory verification before final project closure.',
        status: 'alert',
        metric: targetProject.disbursedDisplay,
      },
      recommendedAction: {
        label: 'Stage 5: Recommended Action',
        title: 'Cross-Examine in Detailed Dossier',
        description: 'Navigate to the full forensic dossier or review linked cases to inspect raw measurement records.',
        status: 'active',
        metric: 'Open Workspace',
      },
    },
    evidenceCitations: [
      {
        id: 'ev-gen-1',
        title: `Primary Anomaly: ${targetProject.primaryAnomaly}`,
        description: `Flagged under routine automated anomaly scan on ${targetProject.workCode}.`,
        metric: 'Anomaly Signal',
        severity: targetProject.riskLevel,
        route: `/investigation?project=${targetProject.id}`,
        targetType: 'project',
        targetId: targetProject.id,
      },
    ],
    ruleReferences: [
      {
        code: 'RULE-FIN-04',
        title: 'Disbursal-Progress Divergence',
        category: 'Financial Irregularity',
        weight: 34,
        status: 'TRIGGERED',
      },
    ],
    financialExposure: {
      sanctioned: targetProject.sanctionedDisplay,
      disbursed: targetProject.disbursedDisplay,
      spent: `₹${(targetProject.spentAmount / 100000).toFixed(2)} L`,
      exposure: `₹${((targetProject.disbursedAmount - targetProject.spentAmount) / 100000).toFixed(2)} L`,
      variancePercent: 'Active Inspection Profile',
    },
    relatedEntities: [
      {
        type: 'project',
        name: targetProject.title,
        id: targetProject.id,
        role: targetProject.workCode,
        riskScore: targetProject.riskScore,
        riskLevel: targetProject.riskLevel,
        route: `/investigation?project=${targetProject.id}`,
      },
      {
        type: 'case',
        name: caseItem.id,
        id: caseItem.id,
        role: 'Associated Audit Case',
        riskScore: caseItem.riskScore,
        riskLevel: caseItem.severity,
        route: `/cases?id=${caseItem.id}`,
      },
    ],
    recommendedActions: [
      {
        id: 'act-gen-case',
        label: 'Open Case',
        actionType: 'open_case',
        route: `/cases?id=${caseItem.id}`,
      },
      {
        id: 'act-gen-inv',
        label: 'Investigate Project',
        actionType: 'investigate_project',
        route: `/investigation?project=${targetProject.id}`,
      },
    ],
  }
}

export function getInitialWelcomeMessage(context: AssistantContext | null): AssistantMessage {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  let text =
    'Welcome to the AI Investigation Assistant. I analyze MPLADS projects, vendor syndicates, disbursement divergence, and statutory compliance. Ask a question or select a suggested prompt below to begin.'

  if (context) {
    if (context.type === 'case') {
      text = `AI Investigation Assistant initialized with Case context **${context.id}** (${context.title}). Risk Severity is **${context.riskLevel?.toUpperCase()}** (${context.riskScore}/100). Ask a question or explore suggested prompts tailored to this case.`
    } else if (context.type === 'project') {
      text = `AI Investigation Assistant initialized with Project context **${context.workCode || context.id}** (${context.title}). Risk score is **${context.riskScore}/100** (${context.riskLevel?.toUpperCase()}). What would you like to investigate?`
    } else if (context.type === 'vendor') {
      text = `AI Investigation Assistant initialized with Vendor context **${context.title}** (${context.subtitle || ''}). What anomalies or procurement linkages would you like to examine?`
    } else if (context.type === 'mp') {
      text = `AI Investigation Assistant initialized with MP context **${context.title}** (${context.subtitle || ''}). What constituency allocations or project clusters would you like to inspect?`
    } else if (context.type === 'agency') {
      text = `AI Investigation Assistant initialized with Implementing Agency context **${context.title}**. What disbursement flows or vendor awards would you like to evaluate?`
    }
  }

  return {
    id: 'msg-welcome',
    sender: 'assistant',
    timestamp,
    isDemonstration: true,
    text,
  }
}
