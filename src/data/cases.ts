import {
  CaseRecord,
  CaseOfficer,
  CaseSeverity,
  CaseStatus,
  CaseAnomalyFinding,
  CaseEvidenceItem,
  CaseTimelineEvent,
  CaseStatusHistory,
  CasePfmsAction,
  CaseFilterState,
  CaseSummaryKpis,
} from '@/types/cases'
import { mockProjects } from './projects'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'
import { initialInvestigationNotes } from './investigation'

export const auditOfficers: CaseOfficer[] = [
  {
    id: 'off-1',
    name: 'Dr. Rajeshwar Rao, IA&AS',
    designation: 'Principal Auditor General',
    department: 'MoSPI / CAG Sovereign Audit Command',
    badge: 'CAG-PAG-01',
    avatar: 'RR',
    contactEmail: 'r.rao.iaas@cag.gov.in',
  },
  {
    id: 'off-2',
    name: 'Sunil Sharma, IA&AS',
    designation: 'Director of Audit',
    department: 'Infrastructure & Forensic Projects Cell',
    badge: 'CAG-DIR-04',
    avatar: 'SS',
    contactEmail: 's.sharma@mospi.gov.in',
  },
  {
    id: 'off-3',
    name: 'Priya Nair',
    designation: 'Senior Audit Officer',
    department: 'Forensic Accounting & PFMS Disbursal Desk',
    badge: 'CAG-SAO-12',
    avatar: 'PN',
    contactEmail: 'priya.nair@cag.gov.in',
  },
  {
    id: 'off-4',
    name: 'Vikram Malhotra',
    designation: 'Executive Engineer & Field Inspector',
    department: 'National Ground Verification Wing',
    badge: 'MoSPI-EE-08',
    avatar: 'VM',
    contactEmail: 'v.malhotra@nic.in',
  },
  {
    id: 'off-5',
    name: 'Anjali Deshmukh',
    designation: 'Joint Director (GIS)',
    department: 'ISRO Bhuvan GIS & Geospatial Audit Lab',
    badge: 'MoSPI-GIS-03',
    avatar: 'AD',
    contactEmail: 'a.deshmukh@isro.gov.in',
  },
  {
    id: 'off-6',
    name: 'K. S. Ramanathan',
    designation: 'Chief Accounts Officer',
    department: 'PFMS Public Financial Management Division',
    badge: 'PFMS-CAO-02',
    avatar: 'KR',
    contactEmail: 'ks.ramanathan@pfms.gov.in',
  },
  {
    id: 'off-none',
    name: 'Unassigned',
    designation: 'Pending Officer Allocation',
    department: 'Central Audit Intake Registry',
    badge: 'INTAKE',
    avatar: 'UA',
  },
]

export const initialCaseFilterState: CaseFilterState = {
  searchQuery: '',
  status: 'All',
  severity: 'All',
  officer: 'All',
  state: 'All',
  district: 'All',
  anomalyType: 'All',
}

const relativeUpdatedTimes = [
  '4 min ago',
  '12 min ago',
  '28 min ago',
  '45 min ago',
  '1 hr ago',
  '2 hrs ago',
  '3 hrs ago',
  '5 hrs ago',
  '8 hrs ago',
  'Yesterday 11:20',
  'Yesterday 16:45',
  '2 days ago',
]

const statusWorkflowCycle: CaseStatus[] = [
  'Under Review',
  'New',
  'Field Verification',
  'Escalated',
  'Under Review',
  'Resolved',
  'New',
  'Field Verification',
  'Escalated',
  'Under Review',
  'Resolved',
  'New',
  'Field Verification',
  'Escalated',
  'Under Review',
  'Resolved',
  'New',
  'Field Verification',
  'Escalated',
  'Under Review',
  'Resolved',
  'New',
  'Field Verification',
  'Escalated',
]

export function buildDeterministicCases(): CaseRecord[] {
  const engineResult = getDefaultEngineResult()
  const { findings, assessments } = engineResult

  // Pick top 24 flagged projects from mockProjects
  const candidateProjects = mockProjects.slice(0, 24)

  return candidateProjects.map((project, idx) => {
    const caseNum = String(idx + 1).padStart(3, '0')
    const caseId = `CASE-2026-${caseNum}`
    const status = statusWorkflowCycle[idx % statusWorkflowCycle.length]
    const assignedOfficer =
      status === 'New' && idx % 2 === 1
        ? auditOfficers[6] // Unassigned
        : auditOfficers[idx % 6]

    const assessment = assessments[project.id]
    const projectFindings = findings.filter((f) => f.projectId === project.id)

    // Ensure at least 1-4 anomaly findings per case
    const anomalies: CaseAnomalyFinding[] =
      projectFindings.length > 0
        ? projectFindings.map((f) => ({
            id: f.anomalyId,
            ruleId: f.ruleId,
            title: f.ruleName,
            category: f.category,
            severity: f.severity,
            explanation: f.explanation,
            financialImpact: f.financialImpact,
            financialImpactDisplay: f.financialImpactDisplay,
            confidence: f.confidence,
          }))
        : [
            {
              id: `anom-${project.id}-1`,
              ruleId: 'RULE-COST-01',
              title: project.primaryAnomaly || 'Cost Schedule Benchmark Deviation',
              category: 'cost',
              severity: project.riskLevel === 'info' ? 'low' : project.riskLevel,
              explanation: `${project.title} flagged for anomalous capital variance exceeding scheduled norm in ${project.district}.`,
              financialImpact: Math.round(project.sanctionedAmount * 0.4),
              financialImpactDisplay: `₹ ${((project.sanctionedAmount * 0.4) / 100000).toFixed(2)} L`,
              confidence: 94.2,
            },
          ]

    const effectiveScore = assessment?.overallScore || project.riskScore
    const severity: CaseSeverity =
      effectiveScore >= 85 ? 'critical' : effectiveScore >= 70 ? 'high' : effectiveScore >= 50 ? 'medium' : 'low'

    // Financial exposure calculation: sum of anomaly impacts or disbursed amount
    const financialExposure =
      anomalies.reduce((sum, a) => sum + (a.financialImpact || 0), 0) ||
      (project.disbursedAmount > 0 ? project.disbursedAmount : project.sanctionedAmount)

    const financialExposureDisplay =
      financialExposure >= 10000000
        ? `₹ ${(financialExposure / 10000000).toFixed(2)} Cr`
        : `₹ ${(financialExposure / 100000).toFixed(2)} L`

    // Generate evidence items
    const evidence: CaseEvidenceItem[] = [
      {
        id: `ev-${project.id}-1`,
        title: `ISRO Bhuvan High-Res Satellite Pass (Pass ID: BHU-26-${(100 + idx)})`,
        source: 'ISRO Bhuvan Spatial Geo-Portal',
        sourceType: 'satellite',
        timestamp: '07 Sep 2026 10:14 IST',
        verificationStatus: status === 'Resolved' || status === 'Field Verification' ? 'Verified' : 'Pending Review',
        verifiedBy: status === 'Resolved' ? 'Anjali Deshmukh (Joint Director GIS)' : undefined,
        verifiedAt: status === 'Resolved' ? '08 Sep 2026' : undefined,
        previewType: 'image',
        previewThumbnail: project.evidenceImages?.[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=400&q=80',
        fileSize: '14.8 MB GeoTIFF',
        hash: `SHA256:7f${(idx * 73 + 19).toString(16).padStart(6, '0')}8c4d29f0e1b`,
        coordinates: {
          lat: 18.5204 + (idx * 0.12),
          lng: 73.8567 + (idx * 0.09),
        },
        notes: 'Centroid cross-referenced against Survey of India GIS raster. No physical foundation identified.',
      },
      {
        id: `ev-${project.id}-2`,
        title: `PFMS Tranche Disbursal Ledger (#PFMS-TR-${project.workCode.slice(-6)})`,
        source: 'Public Financial Management System (PFMS API Gateway)',
        sourceType: 'ledger',
        timestamp: '04 Sep 2026 14:32 IST',
        verificationStatus: 'Verified',
        verifiedBy: 'K. S. Ramanathan (CAO PFMS Desk)',
        verifiedAt: '05 Sep 2026',
        previewType: 'ledger',
        fileSize: '842 KB Encrypted XML',
        hash: `SHA256:9a${(idx * 41 + 83).toString(16).padStart(6, '0')}ef501c238b`,
        notes: `Direct electronic transfer of ${project.disbursedDisplay} executed without prerequisite stage completion certificate.`,
      },
      {
        id: `ev-${project.id}-3`,
        title: `State PWD Measurement Book #MB-${(412 + idx)} (Sanction Cross-Check)`,
        source: 'District Executive Engineer Office, Inspection Record',
        sourceType: 'measurement_book',
        timestamp: '01 Sep 2026 09:00 IST',
        verificationStatus: status === 'Field Verification' ? 'Pending Review' : status === 'Resolved' ? 'Verified' : 'Unverified',
        previewType: 'document',
        fileSize: '3.4 MB Scanned Dossier',
        hash: `SHA256:3c${(idx * 59 + 27).toString(16).padStart(6, '0')}d71a804e12`,
        notes: `Measurement recorded at 35% physical progress despite 95% fund release. Signature discrepancy noted.`,
      },
    ]

    // If project has site evidence images, include as field photo
    if (project.evidenceImages && project.evidenceImages.length > 0) {
      evidence.push({
        id: `ev-${project.id}-4`,
        title: `On-Site Forensic Field Photo (${project.evidenceImages[0].caption})`,
        source: 'MoSPI National Ground Audit Cell (Field Unit 4)',
        sourceType: 'field_photo',
        timestamp: '29 Aug 2026 16:20 IST',
        verificationStatus: status === 'Resolved' ? 'Verified' : 'Pending Review',
        verifiedBy: status === 'Resolved' ? 'Vikram Malhotra (Executive Engineer)' : undefined,
        verifiedAt: status === 'Resolved' ? '30 Aug 2026' : undefined,
        previewType: 'image',
        previewThumbnail: project.evidenceImages[0].url,
        fileSize: '6.2 MB RAW JPEG',
        hash: `SHA256:bb${(idx * 31 + 45).toString(16).padStart(6, '0')}682f913d50`,
        notes: project.evidenceImages[0].watermark || 'Timestamped geo-coordinate camera capture.',
      })
    }

    // Generate timeline events
    const timeline: CaseTimelineEvent[] = [
      {
        id: `tl-${caseId}-1`,
        date: '02 Sep 2026',
        timestamp: '02 Sep 2026 08:30 IST',
        title: 'Anomaly Ingestion & Automatic Case Creation',
        description: `Case automatically generated by MPLADS SOC Anomaly Engine v2.4 following multi-engine risk score computation of ${effectiveScore}.`,
        type: 'system',
        actor: 'Statutory Anomaly Engine',
        badgeColor: 'text-[#3B82F6]',
      },
      {
        id: `tl-${caseId}-2`,
        date: '03 Sep 2026',
        timestamp: '03 Sep 2026 11:15 IST',
        title: `Officer Assigned: ${assignedOfficer.name}`,
        description: `Case allocated to ${assignedOfficer.department} for preliminary forensic examination and rate schedule cross-checks.`,
        type: 'officer',
        actor: 'Audit Coordination Cell',
        badgeColor: 'text-[#adc6ff]',
      },
    ]

    if (status === 'Field Verification' || status === 'Escalated' || status === 'Resolved') {
      timeline.push({
        id: `tl-${caseId}-3`,
        date: '05 Sep 2026',
        timestamp: '05 Sep 2026 15:40 IST',
        title: 'Ground Inspection Summons & Geo-Verification Notice',
        description: `Statutory inspection order dispatched to District Executive Engineer, ${project.district}. Physical measurement book summoned.`,
        type: 'field',
        actor: 'Vikram Malhotra, Executive Engineer',
        badgeColor: 'text-[#F59E0B]',
      })
    }

    if (status === 'Escalated') {
      timeline.push({
        id: `tl-${caseId}-4`,
        date: '07 Sep 2026',
        timestamp: '07 Sep 2026 17:00 IST',
        title: 'Escalated to MoSPI / CAG Central Enforcement Cell',
        description: `High financial exposure discrepancy (${financialExposureDisplay}) escalated for formal statutory enquiry and vendor blacklist consideration.`,
        type: 'escalation',
        actor: 'Dr. Rajeshwar Rao, Principal Auditor General',
        badgeColor: 'text-[#EF4444]',
      })
    }

    if (status === 'Resolved') {
      timeline.push({
        id: `tl-${caseId}-5`,
        date: '08 Sep 2026',
        timestamp: '08 Sep 2026 18:30 IST',
        title: 'Case Resolved & Statutory Compliance Clearance Issued',
        description: `Audit findings reconciled with recovery order of excess disbursement and revised physical milestone verification.`,
        type: 'resolution',
        actor: 'Dr. Rajeshwar Rao, Principal Auditor General',
        badgeColor: 'text-[#22C55E]',
      })
    }

    // Generate status history
    const statusHistory: CaseStatusHistory[] = [
      {
        id: `sh-${caseId}-1`,
        fromStatus: 'New',
        toStatus: status === 'New' ? 'New' : 'Under Review',
        changedBy: 'Statutory Intake System',
        timestamp: '02 Sep 2026 08:35 IST',
        remarks: 'Case registered into Sovereign Audit Queue upon detection of anomalous cost & disbursement pattern.',
      },
    ]

    if (status === 'Field Verification') {
      statusHistory.push({
        id: `sh-${caseId}-2`,
        fromStatus: 'Under Review',
        toStatus: 'Field Verification',
        changedBy: assignedOfficer.name,
        timestamp: '05 Sep 2026 14:10 IST',
        remarks: 'Discrepancy confirmed in satellite orthophoto. Field measurement book physical verification warranted.',
      })
    } else if (status === 'Escalated') {
      statusHistory.push(
        {
          id: `sh-${caseId}-2`,
          fromStatus: 'Under Review',
          toStatus: 'Field Verification',
          changedBy: assignedOfficer.name,
          timestamp: '04 Sep 2026 10:00 IST',
          remarks: 'Ground verification failed to reconcile ₹48.50 L expenditure with physical milestones.',
        },
        {
          id: `sh-${caseId}-3`,
          fromStatus: 'Field Verification',
          toStatus: 'Escalated',
          changedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
          timestamp: '07 Sep 2026 16:50 IST',
          remarks: 'Escalated to MoSPI / CAG Central Enforcement Cell for statutory penalty & PFMS freeze review.',
        }
      )
    } else if (status === 'Resolved') {
      statusHistory.push(
        {
          id: `sh-${caseId}-2`,
          fromStatus: 'Under Review',
          toStatus: 'Field Verification',
          changedBy: assignedOfficer.name,
          timestamp: '04 Sep 2026 09:00 IST',
          remarks: 'Field audit completed with physical measurements.',
        },
        {
          id: `sh-${caseId}-3`,
          fromStatus: 'Field Verification',
          toStatus: 'Resolved',
          changedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
          timestamp: '08 Sep 2026 18:25 IST',
          remarks: 'Statutory recovery order executed. Corrected milestone certified in PFMS registry.',
        }
      )
    }

    // Default notes
    const notes = initialInvestigationNotes.filter((n) => n.targetId === project.id)
    if (notes.length === 0) {
      notes.push({
        id: `note-${caseId}-init`,
        targetId: project.id,
        author: assignedOfficer.name,
        timestamp: '03 Sep 2026 14:00 IST',
        content: `Audit examination initiated. Rate schedule comparison indicates ${project.primaryAnomaly || 'deviation from standard norms'}.`,
      })
    }

    // PFMS action details
    const isPfmsFrozen = status === 'Escalated' || idx === 0 || idx === 7
    const pfmsAction: CasePfmsAction = {
      hasAction: isPfmsFrozen,
      actionType: isPfmsFrozen ? 'Stop-Payment Hold (Full Freeze)' : 'None',
      orderNumber: isPfmsFrozen ? `PFMS-STOP-2026-${(800 + idx)}` : undefined,
      amount: financialExposure,
      amountDisplay: financialExposureDisplay,
      reason: isPfmsFrozen
        ? 'Statutory stop-payment issued under MoSPI Section 14 Oversight pending forensic recovery.'
        : '',
      authorizedBy: isPfmsFrozen ? 'Dr. Rajeshwar Rao, Principal Auditor General' : undefined,
      timestamp: isPfmsFrozen ? '07 Sep 2026 17:10 IST' : undefined,
      status: isPfmsFrozen ? 'Active Stop-Payment' : 'Normal',
      supportingEvidence: isPfmsFrozen ? [`ev-${project.id}-1`, `ev-${project.id}-2`] : [],
    }

    const summary = `${project.title} (${project.workCode}) located in ${project.district}, ${project.state} has been flagged for ${project.primaryAnomaly}. Sanctioned at ${project.sanctionedDisplay} with ${project.disbursedDisplay} disbursed (${project.disbursedPercent}%), while physical stage is verified at only ${project.progressPercent}%. Contracted to ${project.vendor}.`

    return {
      id: caseId,
      workCode: project.workCode,
      projectId: project.id,
      projectTitle: project.title,
      severity,
      riskScore: effectiveScore,
      anomalyCount: anomalies.length,
      project,
      vendor: project.vendor,
      vendorGst: project.vendorGst || '27AAACA9921D1Z4',
      agency: project.agency,
      financialExposure,
      financialExposureDisplay,
      assignedOfficer,
      status,
      lastUpdated: relativeUpdatedTimes[idx % relativeUpdatedTimes.length],
      createdDate: '02 Sep 2026',
      state: project.state,
      district: project.district,
      constituency: project.constituency,
      mpName: project.mpName,
      mpHouse: project.mpHouse,
      category: project.category,
      summary,
      anomalies,
      evidence,
      timeline,
      notes,
      statusHistory,
      pfmsAction,
    }
  })
}

export const mockCases: CaseRecord[] = buildDeterministicCases()

export function getCaseSummaryKpis(cases: CaseRecord[]): CaseSummaryKpis {
  const openCases = cases.filter((c) => c.status !== 'Resolved').length
  const criticalCases = cases.filter((c) => c.severity === 'critical' && c.status !== 'Resolved').length
  const underFieldVerification = cases.filter((c) => c.status === 'Field Verification').length
  const escalated = cases.filter((c) => c.status === 'Escalated').length
  const resolved = cases.filter((c) => c.status === 'Resolved').length

  const totalFinancialExposure = cases
    .filter((c) => c.status !== 'Resolved')
    .reduce((sum, c) => sum + (c.financialExposure || 0), 0)

  const totalFinancialExposureDisplay =
    totalFinancialExposure >= 10000000
      ? `₹ ${(totalFinancialExposure / 10000000).toFixed(2)} Cr`
      : `₹ ${(totalFinancialExposure / 100000).toFixed(2)} L`

  return {
    openCases,
    criticalCases,
    underFieldVerification,
    escalated,
    resolved,
    totalFinancialExposure,
    totalFinancialExposureDisplay,
  }
}
