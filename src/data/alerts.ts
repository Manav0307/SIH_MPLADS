import { AnomalyAlert, AlertFilterState, AlertSummaryKpis, AlertSeverity, AlertStatus } from '@/types'
import { mockProjects } from './projects'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'

function mapAnomalyCategory(primaryAnomaly: string, title: string): string {
  const text = (primaryAnomaly + ' ' + title).toLowerCase()
  if (text.includes('cost') || text.includes('inflation') || text.includes('2.8x') || text.includes('benchmark')) {
    return 'Cost Inflation'
  }
  if (text.includes('gps') || text.includes('duplicate') || text.includes('overlap') || text.includes('spatial')) {
    return 'Duplicate Spatial Footprint'
  }
  if (text.includes('vendor') || text.includes('cartel') || text.includes('concentration') || text.includes('bidder')) {
    return 'Vendor Cartel Concentration'
  }
  if (text.includes('disb') || text.includes('tranche') || text.includes('accelerated') || text.includes('48 hrs') || text.includes('advance')) {
    return 'Premature Disbursement'
  }
  if (text.includes('milestone') || text.includes('photo') || text.includes('ghost') || text.includes('progress')) {
    return 'Milestone Bypass & Ghost Progress'
  }
  if (text.includes('idle') || text.includes('stagnat') || text.includes('stalled') || text.includes('unspent') || text.includes('18 months') || text.includes('delay')) {
    return 'Prolonged Stagnation & Idle Funds'
  }
  if (text.includes('rate') || text.includes('pwd') || text.includes('ceiling') || text.includes('card')) {
    return 'Rate Card Discrepancy'
  }
  return 'Procedural Violation'
}

function getRelativeTime(index: number): string {
  const times = [
    '2 min ago',
    '7 min ago',
    '14 min ago',
    '26 min ago',
    '42 min ago',
    '1 hr ago',
    '2 hrs ago',
    '3 hrs ago',
    '4 hrs ago',
    '5 hrs ago',
    '6 hrs ago',
    '8 hrs ago',
    '10 hrs ago',
    '12 hrs ago',
    '15 hrs ago',
    '18 hrs ago',
    'Yesterday 09:15',
    'Yesterday 11:30',
    'Yesterday 14:05',
    'Yesterday 16:40',
    'Yesterday 18:20',
    'Yesterday 21:00',
    '2 days ago',
    '2 days ago',
    '3 days ago',
    '3 days ago',
    '4 days ago',
    '4 days ago',
    '5 days ago',
    '5 days ago',
  ]
  return times[index % times.length]
}

function getInitialStatus(index: number): AlertStatus {
  // We want exactly 42 active (New + Under Review + Escalated) and 4 resolved = 46 total
  if (index >= 42) return 'Resolved'
  if (index === 0 || index === 2 || index === 7 || index === 14) return 'Escalated'
  if (index % 3 === 0 || index === 1 || index === 5 || index === 9) return 'Under Review'
  return 'New'
}

// Generate alerts dynamically synchronized with Anomaly Engine findings
export const mockAlerts: AnomalyAlert[] = mockProjects.slice(0, 46).map((proj, idx) => {
  const engineResult = getDefaultEngineResult()
  const assessment = engineResult.assessments[proj.id]
  const topFinding = assessment?.findings && assessment.findings.length > 0 ? assessment.findings[0] : null

  const alertIdNumber = String(idx + 1).padStart(3, '0')
  const id = `ALT-2026-${alertIdNumber}`
  const severity = (assessment?.riskLevel || (proj.riskLevel === 'info' ? 'low' : proj.riskLevel)) as AlertSeverity
  const anomalyType = topFinding?.ruleName || mapAnomalyCategory(proj.primaryAnomaly || '', proj.title)
  const status = getInitialStatus(idx)
  const createdTime = getRelativeTime(idx)

  // Financial impact calculation aligned with Anomaly Engine
  const impactNum =
    topFinding?.financialImpact && topFinding.financialImpact > 0
      ? topFinding.financialImpact
      : proj.disbursedAmount > 0
      ? proj.disbursedAmount
      : Math.round(proj.sanctionedAmount * 0.75)

  const impactDisplay =
    topFinding?.financialImpactDisplay ||
    (impactNum >= 10000000
      ? `₹ ${(impactNum / 10000000).toFixed(2)} Cr`
      : `₹ ${(impactNum / 100000).toFixed(2)} L`)

  // Financial Year extraction
  let fy = 'FY 2024–25'
  if (proj.workCode.includes('25-26')) fy = 'FY 2025–26'
  else if (proj.workCode.includes('23-24')) fy = 'FY 2023–24'

  const whyFlagged =
    topFinding?.explanation ||
    proj.financialExecutionWarning ||
    (proj.violations && proj.violations.length > 0 ? proj.violations[0].description : '') ||
    `Statistical deviation of ${proj.primaryAnomaly} detected against state scheduled rate contracts.`

  const recommendedAction =
    proj.recommendedActions && proj.recommendedActions.length > 0
      ? proj.recommendedActions[0].label
      : 'Initiate field audit verification and halt electronic PFMS tranche clearance.'

  const recommendedActionsList =
    proj.recommendedActions && proj.recommendedActions.length > 0
      ? proj.recommendedActions.map((a) => ({ ...a }))
      : [
          { id: `act-${idx}-1`, label: 'Freeze PFMS electronic tranche pending physical audit', checked: true },
          { id: `act-${idx}-2`, label: 'Issue formal statutory explanation notice to Executive Engineer', checked: false },
          { id: `act-${idx}-3`, label: 'Cross-examine vendor bank ledger with GST e-invoices', checked: false },
        ]

  return {
    id,
    workCode: proj.workCode,
    projectId: proj.id,
    projectTitle: proj.title,
    severity,
    anomalyType,
    riskScore: proj.riskScore,
    financialImpact: impactDisplay,
    financialImpactNum: impactNum,
    state: proj.state,
    district: proj.district,
    constituency: proj.constituency,
    mpName: proj.mpName,
    agency: proj.agency,
    vendor: proj.vendor,
    vendorGst: proj.vendorGst,
    status,
    createdTime,
    createdDate: '2026-09-09',
    financialYear: fy,
    whyFlagged,
    recommendedAction,
    recommendedActionsList,
    notesCount: (idx % 4) + 1,
    escalatedTo: status === 'Escalated' ? 'MoSPI Statutory Enforcement Cell' : undefined,
    escalatedDate: status === 'Escalated' ? '09 Sep 2026 09:30 IST' : undefined,
    resolvedAt: status === 'Resolved' ? '09 Sep 2026 10:15 IST' : undefined,
    resolvedBy: status === 'Resolved' ? 'Dr. Rajeshwar Rao, Principal Auditor' : undefined,
    resolutionNote:
      status === 'Resolved'
        ? 'Remittance challan confirmed; recovery of duplicate disbursement completed under Section 14 of Public Moneys Recovery Act.'
        : undefined,
    project: proj,
  }
})

export const initialAlertFilterState: AlertFilterState = {
  state: 'All',
  district: 'All',
  constituency: 'All',
  mp: 'All',
  agency: 'All',
  vendor: 'All',
  riskSeverity: 'All',
  anomalyType: 'All',
  status: 'All',
  financialYear: 'All',
  searchQuery: '',
}

export function getAlertsSummaryKpis(alerts: AnomalyAlert[]): AlertSummaryKpis {
  const activeAlerts = alerts.filter((a) => a.status !== 'Resolved')
  const totalExposureNum = activeAlerts.reduce((sum, a) => sum + a.financialImpactNum, 0)
  const totalExposureLakhs = Math.round(totalExposureNum / 100000)

  const totalExposureDisplay =
    totalExposureNum >= 10000000
      ? `₹ ${(totalExposureNum / 10000000).toFixed(2)} Cr`
      : `₹ ${totalExposureLakhs} L`

  return {
    totalAlerts: alerts.length,
    activeCount: activeAlerts.length,
    criticalCount: alerts.filter((a) => a.severity === 'critical' && a.status !== 'Resolved').length,
    highCount: alerts.filter((a) => a.severity === 'high' && a.status !== 'Resolved').length,
    mediumCount: alerts.filter((a) => a.severity === 'medium' && a.status !== 'Resolved').length,
    lowCount: alerts.filter((a) => a.severity === 'low' && a.status !== 'Resolved').length,
    newCount: alerts.filter((a) => a.status === 'New').length,
    underReviewCount: alerts.filter((a) => a.status === 'Under Review').length,
    escalatedCount: alerts.filter((a) => a.status === 'Escalated').length,
    resolvedCount: alerts.filter((a) => a.status === 'Resolved').length,
    totalExposureLakhs,
    totalExposureDisplay,
  }
}
