import {
  ProjectRecord,
  EvidenceContributor,
  RiskScoreBreakdown,
  FinancialForensicsData,
  InvestigationTimelineStage,
  InvestigationNote,
} from '@/types'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'

// Map of project-specific evidence contributors and breakdown data
export interface ProjectForensicDetail {
  riskBreakdown: RiskScoreBreakdown
  evidenceContributors: EvidenceContributor[]
  financialForensics: FinancialForensicsData
  timeline: InvestigationTimelineStage[]
  detectionConfidence: number
}

export const mockProjectForensics: Record<string, ProjectForensicDetail> = {
  'proj-001': {
    detectionConfidence: 96.8,
    riskBreakdown: {
      ruleEngine: 34,
      statisticalEngine: 28,
      mlEngine: 34,
      consolidatedScore: 96,
    },
    evidenceContributors: [
      {
        id: 'ec-1',
        title: 'COST ANOMALY',
        points: 28,
        severity: 'critical',
        explanation: 'Sanctioned cost is 2.8× the Maharashtra Rural Water Supply category median benchmark.',
      },
      {
        id: 'ec-2',
        title: 'PAYMENT IRREGULARITY',
        points: 26,
        severity: 'critical',
        explanation: '95.2% funds disbursed (₹46.20 L) while ground audit confirms only 35% physical completion.',
      },
      {
        id: 'ec-3',
        title: 'VENDOR CONCENTRATION',
        points: 22,
        severity: 'high',
        explanation: 'Vendor Apex Infra Ltd. secured 8 consecutive contracts in the same taluka within 14 calendar days.',
      },
      {
        id: 'ec-4',
        title: 'COMPLETION DELAY',
        points: 20,
        severity: 'high',
        explanation: 'Project timeline overdue by 180 days; foundation remains incomplete with rusted rebars.',
      },
    ],
    financialForensics: {
      recommendedAmount: 5200000,
      recommendedDisplay: '₹ 52.00 L',
      sanctionedAmount: 4850000,
      sanctionedDisplay: '₹ 48.50 L',
      disbursedAmount: 4620000,
      disbursedDisplay: '₹ 46.20 L',
      spentAmount: 1840000,
      spentDisplay: '₹ 18.40 L',
      benchmarkAmount: 1720000,
      benchmarkDisplay: '₹ 17.20 L',
      disbursedPercent: 95.2,
      spentVsDisbursedPercent: 39.8,
      costVsBenchmarkPercent: 282.0,
      discrepancyNote: 'Disbursement of ₹28.50 L released without required GIS milestone certification.',
    },
    timeline: [
      { stage: 'Recommended', date: '14 May 2024', status: 'completed', amountDisplay: '₹ 52.00 L' },
      { stage: 'Sanctioned', date: '02 Jul 2024', status: 'completed', amountDisplay: '₹ 48.50 L' },
      {
        stage: 'Disbursed',
        date: '18 Aug 2024',
        status: 'flagged',
        amountDisplay: '₹ 46.20 L (95.2%)',
        gapAlert: 'ACCELERATED TRANCHE: 95% released within 47 days without 2nd inspection',
      },
      { stage: 'Physical Progress', date: 'Jan 2025', status: 'delayed', amountDisplay: '35% Completed', gapAlert: '180 DAY OVERDUE' },
      { stage: 'Completion', date: '31 Dec 2024', status: 'delayed', gapAlert: 'Incomplete / Stalled' },
    ],
  },
  'proj-002': {
    detectionConfidence: 94.5,
    riskBreakdown: {
      ruleEngine: 32,
      statisticalEngine: 27,
      mlEngine: 35,
      consolidatedScore: 94,
    },
    evidenceContributors: [
      {
        id: 'ec-5',
        title: 'SPATIAL SIMILARITY',
        points: 35,
        severity: 'critical',
        explanation: 'Geo-centroid exhibits 98% spatial overlap with UP State Highway Fund Scheme #UP-PWD-2023-441.',
      },
      {
        id: 'ec-6',
        title: 'COST INFLATION',
        points: 29,
        severity: 'critical',
        explanation: 'Sanctioned at ₹82.0 L versus standard benchmark of ₹38.0 L for concrete rural pavement (+115%).',
      },
      {
        id: 'ec-7',
        title: 'PROCEDURAL DEVIATION',
        points: 18,
        severity: 'high',
        explanation: '97% funds released within 60 days of sanction without mandatory 2nd phase quality certificate.',
      },
      {
        id: 'ec-8',
        title: 'COMPLETION DELAY',
        points: 12,
        severity: 'medium',
        explanation: 'Project exceeds contractual completion deadline by 240 days.',
      },
    ],
    financialForensics: {
      recommendedAmount: 8500000,
      recommendedDisplay: '₹ 85.00 L',
      sanctionedAmount: 8200000,
      sanctionedDisplay: '₹ 82.00 L',
      disbursedAmount: 7950000,
      disbursedDisplay: '₹ 79.50 L',
      spentAmount: 3280000,
      spentDisplay: '₹ 32.80 L',
      benchmarkAmount: 3800000,
      benchmarkDisplay: '₹ 38.00 L',
      disbursedPercent: 97.0,
      spentVsDisbursedPercent: 41.3,
      costVsBenchmarkPercent: 215.8,
      discrepancyNote: 'Duplicate spatial asset allocation flagged: potential double-billing of pre-existing state road.',
    },
    timeline: [
      { stage: 'Recommended', date: '10 Jan 2024', status: 'completed', amountDisplay: '₹ 85.00 L' },
      { stage: 'Sanctioned', date: '22 Mar 2024', status: 'completed', amountDisplay: '₹ 82.00 L' },
      { stage: 'Disbursed', date: '15 May 2024', status: 'flagged', amountDisplay: '₹ 79.50 L (97.0%)' },
      { stage: 'Physical Progress', date: 'Nov 2024', status: 'delayed', amountDisplay: '40% Progress', gapAlert: '240 DAY STAGNATION' },
      { stage: 'Completion', date: '15 Nov 2024', status: 'delayed', gapAlert: 'Overdue / Forensic Hold' },
    ],
  },
  'proj-003': {
    detectionConfidence: 91.2,
    riskBreakdown: {
      ruleEngine: 28,
      statisticalEngine: 26,
      mlEngine: 34,
      consolidatedScore: 88,
    },
    evidenceContributors: [
      {
        id: 'ec-9',
        title: 'VENDOR CONCENTRATION',
        points: 34,
        severity: 'high',
        explanation: 'Cartel bidding pattern: 3 participating bidders submitted tenders from identical gateway IP within 8 mins.',
      },
      {
        id: 'ec-10',
        title: 'COST INFLATION',
        points: 26,
        severity: 'high',
        explanation: 'Solar inverters billed at ₹1.45 L each against GeM portal government benchmark of ₹62,000 (+134%).',
      },
      {
        id: 'ec-11',
        title: 'PROCEDURAL DEVIATION',
        points: 18,
        severity: 'high',
        explanation: 'Contract split into multiple micro-tenders to bypass higher administrative sanction threshold.',
      },
      {
        id: 'ec-12',
        title: 'COMPLETION DELAY',
        points: 10,
        severity: 'medium',
        explanation: 'Anganwadi rooftop installation uncommissioned for 95 days beyond scheduled date.',
      },
    ],
    financialForensics: {
      recommendedAmount: 3800000,
      recommendedDisplay: '₹ 38.00 L',
      sanctionedAmount: 3500000,
      sanctionedDisplay: '₹ 35.00 L',
      disbursedAmount: 3400000,
      disbursedDisplay: '₹ 34.00 L',
      spentAmount: 1925000,
      spentDisplay: '₹ 19.25 L',
      benchmarkAmount: 1800000,
      benchmarkDisplay: '₹ 18.00 L',
      disbursedPercent: 97.1,
      spentVsDisbursedPercent: 56.6,
      costVsBenchmarkPercent: 194.4,
      discrepancyNote: 'Hardware pricing deviates 2.34x from standard GeM portal schedules.',
    },
    timeline: [
      { stage: 'Recommended', date: '05 Aug 2024', status: 'completed', amountDisplay: '₹ 38.00 L' },
      { stage: 'Sanctioned', date: '18 Sep 2024', status: 'completed', amountDisplay: '₹ 35.00 L' },
      { stage: 'Disbursed', date: '01 Nov 2024', status: 'completed', amountDisplay: '₹ 34.00 L' },
      { stage: 'Physical Progress', date: 'Feb 2025', status: 'in_progress', amountDisplay: '55% Installed', gapAlert: 'BATTERY STORAGE UNCOMMISSIONED' },
      { stage: 'Completion', date: '28 Feb 2025', status: 'delayed', gapAlert: 'Pending Inspection' },
    ],
  },
  'proj-004': {
    detectionConfidence: 89.0,
    riskBreakdown: {
      ruleEngine: 31,
      statisticalEngine: 24,
      mlEngine: 30,
      consolidatedScore: 85,
    },
    evidenceContributors: [
      {
        id: 'ec-13',
        title: 'PAYMENT IRREGULARITY',
        points: 32,
        severity: 'high',
        explanation: 'Tranche #2 released without mandatory NIC geo-tagged photo verification uploaded to MPLADS portal.',
      },
      {
        id: 'ec-14',
        title: 'COMPLETION DELAY',
        points: 28,
        severity: 'high',
        explanation: 'Zero physical labor activity detected on site for 195 consecutive days; foundation remains stagnant.',
      },
      {
        id: 'ec-15',
        title: 'PROCEDURAL DEVIATION',
        points: 15,
        severity: 'medium',
        explanation: 'False progress certificate submitted by local junior engineer certifying 60% completion against 20% ground truth.',
      },
      {
        id: 'ec-16',
        title: 'COST DEVIATION',
        points: 10,
        severity: 'medium',
        explanation: 'Civil construction rate 1.4x standard Bihar PWD schedule of rates.',
      },
    ],
    financialForensics: {
      recommendedAmount: 7000000,
      recommendedDisplay: '₹ 70.00 L',
      sanctionedAmount: 6500000,
      sanctionedDisplay: '₹ 65.00 L',
      disbursedAmount: 4200000,
      disbursedDisplay: '₹ 42.00 L',
      spentAmount: 1300000,
      spentDisplay: '₹ 13.00 L',
      benchmarkAmount: 4200000,
      benchmarkDisplay: '₹ 42.00 L',
      disbursedPercent: 64.6,
      spentVsDisbursedPercent: 31.0,
      costVsBenchmarkPercent: 154.8,
      discrepancyNote: 'Milestone payment released without ground photo verification.',
    },
    timeline: [
      { stage: 'Recommended', date: '12 Nov 2023', status: 'completed', amountDisplay: '₹ 70.00 L' },
      { stage: 'Sanctioned', date: '15 Feb 2024', status: 'completed', amountDisplay: '₹ 65.00 L' },
      { stage: 'Disbursed', date: '20 Apr 2024', status: 'flagged', amountDisplay: '₹ 42.00 L' },
      { stage: 'Physical Progress', date: 'Oct 2024', status: 'delayed', amountDisplay: '20% Ground Work', gapAlert: '310 DAY STAGNATION / ABANDONED' },
      { stage: 'Completion', date: '30 Oct 2024', status: 'delayed', gapAlert: 'Severe Overdue' },
    ],
  },
}

// Single Source: Compute forensic detail using Anomaly Engine assessments
export function getProjectForensicDetail(project: ProjectRecord): ProjectForensicDetail {
  const engineResult = getDefaultEngineResult()
  const assessment = engineResult.assessments[project.id]

  // If mockProjectForensics explicitly defined, enrich with engine assessment
  if (mockProjectForensics[project.id]) {
    const base = mockProjectForensics[project.id]
    if (assessment && assessment.findings.length > 0) {
      return {
        ...base,
        detectionConfidence: assessment.confidence,
        evidenceContributors: assessment.scoreContributors.map((c, i) => ({
          id: `ec-eng-${project.id}-${i}`,
          title: c.title.toUpperCase(),
          points: c.points,
          severity: c.severity,
          explanation: c.explanation,
        })),
      }
    }
    return base
  }

  const score = assessment?.overallScore || project.riskScore
  const rule = Math.round(score * 0.45)
  const stat = Math.round(score * 0.30)
  const ml = Math.max(0, score - rule - stat)

  const evidenceContributors: EvidenceContributor[] =
    assessment && assessment.scoreContributors.length > 0
      ? assessment.scoreContributors.map((c, i) => ({
          id: `ec-eng-${project.id}-${i}`,
          title: c.title.toUpperCase(),
          points: c.points,
          severity: c.severity,
          explanation: c.explanation,
        }))
      : [
          {
            id: `ec-gen-1-${project.id}`,
            title: 'COST DEVIATION',
            points: Math.round(score * 0.32),
            severity: project.riskLevel,
            explanation: `Sanctioned amount deviates significantly from standard state rate schedule for ${project.category}.`,
          },
          {
            id: `ec-gen-2-${project.id}`,
            title: 'PAYMENT IRREGULARITY',
            points: Math.round(score * 0.28),
            severity: project.riskLevel === 'critical' ? 'critical' : 'high',
            explanation: `${project.disbursedPercent}% funds disbursed against only ${project.progressPercent}% physical progress.`,
          },
          {
            id: `ec-gen-3-${project.id}`,
            title: 'COMPLETION DELAY',
            points: Math.round(score * 0.24),
            severity: project.agingDays > 120 ? 'high' : 'medium',
            explanation: `Project has remained in sanction/disbursement pipeline for ${project.agingDays} days without stage clearance.`,
          },
          {
            id: `ec-gen-4-${project.id}`,
            title: 'PROCEDURAL DEVIATION',
            points: Math.round(score * 0.16),
            severity: 'medium',
            explanation: `Implementing agency ${project.agency} bypassed statutory stage inspection protocol.`,
          },
        ]

  return {
    detectionConfidence: assessment?.confidence || Math.min(99, Math.max(75, Math.round(score * 0.95 + 5))),
    riskBreakdown: {
      ruleEngine: rule,
      statisticalEngine: stat,
      mlEngine: ml,
      consolidatedScore: score,
    },
    evidenceContributors,
    financialForensics: {
      recommendedAmount: Math.round(project.sanctionedAmount * 1.08),
      recommendedDisplay: `₹ ${(project.sanctionedAmount * 1.08 / 100000).toFixed(2)} L`,
      sanctionedAmount: project.sanctionedAmount,
      sanctionedDisplay: project.sanctionedDisplay,
      disbursedAmount: project.disbursedAmount,
      disbursedDisplay: project.disbursedDisplay,
      spentAmount: project.spentAmount,
      spentDisplay: `₹ ${(project.spentAmount / 100000).toFixed(2)} L`,
      benchmarkAmount: Math.round(project.sanctionedAmount * 0.55),
      benchmarkDisplay: `₹ ${(project.sanctionedAmount * 0.55 / 100000).toFixed(2)} L`,
      disbursedPercent: project.disbursedPercent,
      spentVsDisbursedPercent: Math.round((project.spentAmount / (project.disbursedAmount || 1)) * 100),
      costVsBenchmarkPercent: Math.round((project.sanctionedAmount / (project.sanctionedAmount * 0.55 || 1)) * 100),
      discrepancyNote: `${project.primaryAnomaly}`,
    },
    timeline: [
      { stage: 'Recommended', date: project.timeline.recommended, status: 'completed' },
      { stage: 'Sanctioned', date: project.timeline.sanctioned, status: 'completed' },
      {
        stage: 'Disbursed',
        date: project.timeline.disbursed,
        status: project.disbursedPercent > 90 ? 'flagged' : 'completed',
        gapAlert: `${project.agingDays} DAY PIPELINE DURATION`,
      },
      { stage: 'Physical Progress', date: 'Current', status: 'in_progress', amountDisplay: `${project.progressPercent}% progress` },
      { stage: 'Completion', date: project.timeline.completionTarget, status: 'delayed', gapAlert: 'Overdue Target' },
    ],
  }
}

// Initial investigation notes mock
export const initialInvestigationNotes: InvestigationNote[] = [
  {
    id: 'note-001',
    targetId: 'proj-001',
    author: 'Principal Auditor (MoSPI Cell)',
    timestamp: 'Yesterday 16:42 IST',
    content:
      'Preliminary rate analysis indicates 2.8x inflation over Maharashtra water grid schedule. Summoned EE (Sanitation) for physical measurement book cross-examination.',
  },
  {
    id: 'note-002',
    targetId: 'proj-002',
    author: 'Chief Forensic Engineer (GIS Lab)',
    timestamp: '08 Sep 2026 11:15 IST',
    content:
      'Centroid match confirmed with UP State Highway Fund scheme. Potential double dipping across central MPLADS and state budget heads.',
  },
]
