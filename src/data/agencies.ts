import {
  AgencyRecord,
  AgencyProfile,
  AgencyRiskContributor,
  AgencyStateSummary,
  AgencyVendorSummary,
  AgencyConstituencySummary,
  ProjectRecord,
  RiskLevel,
} from '@/types'
import { mockProjects } from './projects'
import { mockVendors } from './vendors'

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractFy(workCode: string, timelineDate?: string): string {
  if (workCode.includes('25-26')) return 'FY 2025-26'
  if (workCode.includes('24-25')) return 'FY 2024-25'
  if (workCode.includes('23-24')) return 'FY 2023-24'
  if (timelineDate) {
    if (timelineDate.includes('2025')) return 'FY 2025-26'
    if (timelineDate.includes('2024')) return 'FY 2024-25'
    if (timelineDate.includes('2023')) return 'FY 2023-24'
  }
  return 'FY 2024-25'
}

export function inferAgencyType(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('zila parishad') || lower.includes('panchayat')) {
    return 'Panchayati Raj / Zila Parishad'
  }
  if (lower.includes('pwd') || lower.includes('public works')) {
    return 'Public Works Department (PWD)'
  }
  if (lower.includes('rural dev') || lower.includes('rural infrastructure')) {
    return 'Rural Development Agency'
  }
  if (
    lower.includes('municipal') ||
    lower.includes('urban dev') ||
    lower.includes('corporation') ||
    lower.includes('ghmc') ||
    lower.includes('authority')
  ) {
    return 'Urban Local Body / Municipal Corp'
  }
  if (lower.includes('apmc') || lower.includes('mandi')) {
    return 'Agricultural Marketing (APMC)'
  }
  if (lower.includes('education') || lower.includes('school')) {
    return 'School Education Department'
  }
  if (
    lower.includes('irrigation') ||
    lower.includes('waterways') ||
    lower.includes('jal nigam') ||
    lower.includes('jal board')
  ) {
    return 'Water Resources & Irrigation'
  }
  return 'State Development Board / Corporation'
}

export function categorizeAnomaly(text: string): string {
  const lower = text.toLowerCase()
  if (
    lower.includes('cost') ||
    lower.includes('inflation') ||
    lower.includes('rate') ||
    lower.includes('median')
  ) {
    return 'Cost Inflation'
  }
  if (
    lower.includes('disburs') ||
    lower.includes('payment') ||
    lower.includes('tranche') ||
    lower.includes('unspent') ||
    lower.includes('advance') ||
    lower.includes('consecutive')
  ) {
    return 'Payment Pattern'
  }
  if (
    lower.includes('delay') ||
    lower.includes('overdue') ||
    lower.includes('pace') ||
    lower.includes('idle') ||
    lower.includes('dormant')
  ) {
    return 'Completion Delay'
  }
  if (
    lower.includes('vendor') ||
    lower.includes('cartel') ||
    lower.includes('directorship') ||
    lower.includes('bidder')
  ) {
    return 'Vendor Concentration'
  }
  if (
    lower.includes('duplicate') ||
    lower.includes('gps') ||
    lower.includes('spatial') ||
    lower.includes('overlap')
  ) {
    return 'Duplicate Works'
  }
  if (
    lower.includes('procedural') ||
    lower.includes('clearance') ||
    lower.includes('coastal') ||
    lower.includes('norm') ||
    lower.includes('dispute') ||
    lower.includes('signoff') ||
    lower.includes('qc') ||
    lower.includes('turnover') ||
    lower.includes('exif') ||
    lower.includes('timestamp')
  ) {
    return 'Procedural Violation'
  }
  return 'Spatial Similarity'
}

// Generate deterministic mockAgencies from mockProjects
export const mockAgencies: AgencyRecord[] = (() => {
  const agencyGroups: Record<string, ProjectRecord[]> = {}

  mockProjects.forEach((p) => {
    const rawName = p.agency ? p.agency.trim() : 'Public Works Department'
    if (!agencyGroups[rawName]) {
      agencyGroups[rawName] = []
    }
    agencyGroups[rawName].push(p)
  })

  return Object.entries(agencyGroups).map(([agencyName, projects]) => {
    const first = projects[0]
    const id = `agn-${slugify(agencyName)}`
    const agencyType = inferAgencyType(agencyName)

    let totalSanctioned = 0
    let totalDisbursed = 0
    let totalSpent = 0
    let flaggedCount = 0
    let completedCount = 0
    let delayedCount = 0
    let maxScore = 0
    let primaryAnomaly = first.primaryAnomaly || 'Nominal operational status'

    const statesSet = new Set<string>()
    const vendorCounts: Record<string, number> = {}
    const constCounts: Record<string, number> = {}

    projects.forEach((p) => {
      totalSanctioned += p.sanctionedAmount || 0
      totalDisbursed += p.disbursedAmount || 0
      totalSpent += p.spentAmount || 0

      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        flaggedCount++
      }

      if (p.status.toLowerCase().includes('complete')) {
        completedCount++
      }

      // Check delay indicators
      const isDelayed =
        p.agingDays > 60 ||
        p.status === 'Stalled' ||
        p.primaryAnomaly.toLowerCase().includes('delay') ||
        p.primaryAnomaly.toLowerCase().includes('dormant')
      if (isDelayed) {
        delayedCount++
      }

      if (p.riskScore > maxScore) {
        maxScore = p.riskScore
        primaryAnomaly = p.primaryAnomaly
      }

      if (p.state) statesSet.add(p.state)
      if (p.vendor) vendorCounts[p.vendor] = (vendorCounts[p.vendor] || 0) + 1
      if (p.constituency) constCounts[p.constituency] = (constCounts[p.constituency] || 0) + 1
    })

    const avgScore = Math.round(
      projects.reduce((acc, curr) => acc + (curr.riskScore || 0), 0) / projects.length
    )
    const effectiveRiskScore = Math.max(
      avgScore,
      maxScore >= 90 ? Math.round((avgScore + maxScore) / 2) : avgScore
    )

    let riskLevel: RiskLevel = 'low'
    if (effectiveRiskScore >= 85) riskLevel = 'critical'
    else if (effectiveRiskScore >= 70) riskLevel = 'high'
    else if (effectiveRiskScore >= 40) riskLevel = 'medium'

    const activeWorks = projects.length - completedCount
    const flaggedPercentage = Math.round((flaggedCount / projects.length) * 1000) / 10
    const avgProjectValueNum = Math.round(totalSanctioned / projects.length)
    const unutilizedAmountNum = Math.max(0, totalDisbursed - totalSpent)

    const topVendor = Object.entries(vendorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || first.vendor
    const topConstituency = Object.entries(constCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || first.constituency

    return {
      id,
      name: agencyName,
      agencyType,
      statePresence: Array.from(statesSet),
      activeWorks: activeWorks > 0 ? activeWorks : projects.length,
      completedWorks: completedCount,
      delayedWorksCount: delayedCount,
      totalSanctioned: formatCurrency(totalSanctioned),
      totalSanctionedNum: totalSanctioned,
      totalDisbursed: formatCurrency(totalDisbursed),
      totalDisbursedNum: totalDisbursed,
      totalSpent: formatCurrency(totalSpent),
      totalSpentNum: totalSpent,
      unutilizedAmount: formatCurrency(unutilizedAmountNum),
      unutilizedAmountNum,
      flaggedWorksCount: flaggedCount,
      flaggedPercentage,
      avgProjectValue: formatCurrency(avgProjectValueNum),
      avgProjectValueNum,
      primaryAnomaly,
      riskScore: effectiveRiskScore,
      riskLevel,
      topVendor,
      topConstituency,
    }
  })
})()

// Helper to get agency by ID or slug or name
export function getAgencyById(idOrSlug: string): AgencyRecord | undefined {
  if (!idOrSlug) return undefined
  const target = idOrSlug.toLowerCase().trim()
  return mockAgencies.find((a) => {
    const rawId = a.id.toLowerCase()
    const strippedId = rawId.replace(/^agn-/, '')
    const targetStripped = target.replace(/^agn-/, '')
    return (
      rawId === target ||
      strippedId === targetStripped ||
      slugify(a.name) === targetStripped ||
      a.name.toLowerCase() === target
    )
  })
}

// Helper to get agency projects
export function getAgencyProjects(agencyNameOrId: string): ProjectRecord[] {
  if (!agencyNameOrId) return []
  const agency = getAgencyById(agencyNameOrId)
  const targetName = agency ? agency.name.toLowerCase() : agencyNameOrId.toLowerCase().trim()
  return mockProjects.filter((p) => (p.agency || '').toLowerCase().trim() === targetName)
}

// Helper to get comprehensive AgencyProfile
export function getAgencyProfile(id: string): AgencyProfile | undefined {
  const agency = getAgencyById(id)
  if (!agency) return undefined

  const projects = getAgencyProjects(agency.name)

  // State grouping
  const stateMap: Record<string, { count: number; disbursed: number; flagged: number }> = {}

  // FY grouping
  const fyMap: Record<string, { disbursed: number; count: number }> = {
    'FY 2023-24': { disbursed: 0, count: 0 },
    'FY 2024-25': { disbursed: 0, count: 0 },
    'FY 2025-26': { disbursed: 0, count: 0 },
  }

  // Anomaly categorization
  const anomaliesCount: Record<string, number> = {
    'Cost Inflation': 0,
    'Payment Pattern': 0,
    'Completion Delay': 0,
    'Vendor Concentration': 0,
    'Duplicate Works': 0,
    'Spatial Similarity': 0,
    'Procedural Violation': 0,
  }

  // Status breakdown
  const statusMap = {
    recommended: 0,
    sanctioned: 0,
    ongoing: 0,
    completed: 0,
    stalled: 0,
    total: projects.length,
  }

  // Vendor map
  const vendorMap: Record<
    string,
    { count: number; disbursed: number; flagged: number; highestScore: number }
  > = {}

  // Constituency map
  const constMap: Record<
    string,
    { state: string; count: number; sanctioned: number; disbursed: number; flagged: number }
  > = {}

  let totalRecommended = 0

  projects.forEach((p) => {
    // State
    if (!stateMap[p.state]) {
      stateMap[p.state] = { count: 0, disbursed: 0, flagged: 0 }
    }
    stateMap[p.state].count++
    stateMap[p.state].disbursed += p.disbursedAmount || 0
    if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
      stateMap[p.state].flagged++
    }

    // FY
    const fy = extractFy(p.workCode, p.timeline?.sanctioned)
    if (fyMap[fy]) {
      fyMap[fy].disbursed += p.disbursedAmount || 0
      fyMap[fy].count++
    }

    // Anomaly
    const anomalyCategory = categorizeAnomaly(p.primaryAnomaly || '')
    if (anomaliesCount[anomalyCategory] !== undefined) {
      anomaliesCount[anomalyCategory]++
    }

    // Status
    const st = (p.status || '').toLowerCase()
    if (st.includes('recommend')) statusMap.recommended++
    else if (st.includes('sanction')) statusMap.sanctioned++
    else if (st.includes('complete')) statusMap.completed++
    else if (st.includes('stall') || st.includes('investigat')) statusMap.stalled++
    else statusMap.ongoing++

    // Vendors
    if (p.vendor) {
      if (!vendorMap[p.vendor]) {
        vendorMap[p.vendor] = { count: 0, disbursed: 0, flagged: 0, highestScore: p.riskScore || 0 }
      }
      vendorMap[p.vendor].count++
      vendorMap[p.vendor].disbursed += p.disbursedAmount || 0
      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        vendorMap[p.vendor].flagged++
      }
      if ((p.riskScore || 0) > vendorMap[p.vendor].highestScore) {
        vendorMap[p.vendor].highestScore = p.riskScore || 0
      }
    }

    // Constituencies
    if (p.constituency) {
      if (!constMap[p.constituency]) {
        constMap[p.constituency] = {
          state: p.state || 'Unknown',
          count: 0,
          sanctioned: 0,
          disbursed: 0,
          flagged: 0,
        }
      }
      constMap[p.constituency].count++
      constMap[p.constituency].sanctioned += p.sanctionedAmount || 0
      constMap[p.constituency].disbursed += p.disbursedAmount || 0
      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        constMap[p.constituency].flagged++
      }
    }

    totalRecommended += Math.round((p.sanctionedAmount || 0) * 1.08)
  })

  // Format States
  const states: AgencyStateSummary[] = Object.entries(stateMap).map(([stateName, data]) => ({
    state: stateName,
    projectsCount: data.count,
    disbursedAmount: data.disbursed,
    disbursedDisplay: formatCurrency(data.disbursed),
    flaggedCount: data.flagged,
    flaggedPercentage: Math.round((data.flagged / data.count) * 1000) / 10,
  }))

  // Format Disbursements by FY
  const disbursementsByFy = Object.entries(fyMap).map(([fy, data]) => ({
    fy,
    disbursedAmount: data.disbursed,
    disbursedDisplay: formatCurrency(data.disbursed),
    worksCount: data.count,
  }))

  // Format Vendors
  const vendorConcentration: AgencyVendorSummary[] = Object.entries(vendorMap)
    .sort((a, b) => b[1].disbursed - a[1].disbursed)
    .map(([vendorName, data]) => {
      const matchV = mockVendors.find(
        (v) => v.name.toLowerCase() === vendorName.toLowerCase()
      )
      let riskLevel: RiskLevel = 'low'
      if (data.highestScore >= 85) riskLevel = 'critical'
      else if (data.highestScore >= 70) riskLevel = 'high'
      else if (data.highestScore >= 40) riskLevel = 'medium'

      return {
        vendorName,
        vendorId: matchV?.id,
        projectsCount: data.count,
        disbursedAmount: data.disbursed,
        disbursedDisplay: formatCurrency(data.disbursed),
        flaggedPercentage: Math.round((data.flagged / data.count) * 1000) / 10,
        riskLevel,
      }
    })

  // Format Constituencies
  const constituencyFootprint: AgencyConstituencySummary[] = Object.entries(constMap)
    .sort((a, b) => b[1].sanctioned - a[1].sanctioned)
    .map(([constituency, data]) => ({
      constituency,
      state: data.state,
      projectsCount: data.count,
      sanctionedAmount: data.sanctioned,
      sanctionedDisplay: formatCurrency(data.sanctioned),
      disbursedAmount: data.disbursed,
      disbursedDisplay: formatCurrency(data.disbursed),
      flaggedPercentage: Math.round((data.flagged / data.count) * 1000) / 10,
    }))

  // Calculate Fund Flow Metrics
  const recommendedAmount = Math.max(totalRecommended, agency.totalSanctionedNum)
  const sanctionedAmount = agency.totalSanctionedNum
  const disbursedAmount = agency.totalDisbursedNum
  const spentAmount = agency.totalSpentNum
  const unutilizedAmount = Math.max(0, disbursedAmount - spentAmount)

  const sanctionedVsRecommendedPercent =
    recommendedAmount > 0 ? Math.round((sanctionedAmount / recommendedAmount) * 100) : 100
  const disbursedVsSanctionedPercent =
    sanctionedAmount > 0 ? Math.round((disbursedAmount / sanctionedAmount) * 100) : 0
  const spentVsDisbursedPercent =
    disbursedAmount > 0 ? Math.round((spentAmount / disbursedAmount) * 100) : 0

  // Risk Contributors with objective explanations
  const riskContributors: AgencyRiskContributor[] = []

  if (agency.delayedWorksCount > 0) {
    const delayPercent = Math.round((agency.delayedWorksCount / projects.length) * 100)
    riskContributors.push({
      id: 'rc-delay',
      category: 'Completion Delay',
      title: 'Execution Timeline Deviation',
      points: Math.min(25, 10 + agency.delayedWorksCount * 4),
      severity: delayPercent > 40 ? 'critical' : 'high',
      explanation: `${delayPercent}% of active works exceed the expected statutory implementation timeline (>60 days or stalled).`,
    })
  }

  if (agency.flaggedWorksCount > 0) {
    riskContributors.push({
      id: 'rc-anomaly',
      category: 'High Anomaly Exposure',
      title: 'Flagged Project Association',
      points: Math.min(30, 12 + agency.flaggedWorksCount * 6),
      severity: agency.flaggedPercentage > 50 ? 'critical' : 'high',
      explanation: `${agency.flaggedPercentage}% of executing works have been flagged by the rule engine for audit verification.`,
    })
  }

  if (disbursedVsSanctionedPercent > 85 && spentVsDisbursedPercent < 50) {
    riskContributors.push({
      id: 'rc-unutilized',
      category: 'Payment Pattern',
      title: 'Dormant Unspent Fund Accumulation',
      points: 15,
      severity: 'high',
      explanation: `Disbursement velocity is high (${disbursedVsSanctionedPercent}%) while physical utilization lags (${spentVsDisbursedPercent}%), leaving unutilized capital of ${formatCurrency(
        unutilizedAmount
      )}.`,
    })
  }

  if (anomaliesCount['Cost Inflation'] > 0) {
    riskContributors.push({
      id: 'rc-cost',
      category: 'Cost Deviation',
      title: 'Schedule of Rates Variance',
      points: 14,
      severity: 'medium',
      explanation: `${anomaliesCount['Cost Inflation']} work(s) exhibit unit-cost rates exceeding district benchmark schedules.`,
    })
  }

  if (vendorConcentration.length > 0 && vendorConcentration[0].projectsCount > 1) {
    const topV = vendorConcentration[0]
    riskContributors.push({
      id: 'rc-vendor',
      category: 'Vendor Concentration',
      title: 'Contractor Work Allocation Concentration',
      points: 12,
      severity: 'medium',
      explanation: `Single vendor (${topV.vendorName}) accounts for ${Math.round(
        (topV.projectsCount / projects.length) * 100
      )}% of total awarded projects under this agency.`,
    })
  }

  if (anomaliesCount['Duplicate Works'] > 0) {
    riskContributors.push({
      id: 'rc-geo',
      category: 'Spatial Duplication',
      title: 'GIS Proximity Overlap Signal',
      points: 18,
      severity: 'critical',
      explanation: `${anomaliesCount['Duplicate Works']} project(s) exhibit high spatial proximity or duplicate coordinate entries with pre-existing public assets.`,
    })
  }

  if (anomaliesCount['Procedural Violation'] > 0) {
    riskContributors.push({
      id: 'rc-proc',
      category: 'Procedural Violations',
      title: 'Quality & Milestone Verification Gap',
      points: 10,
      severity: 'medium',
      explanation: `${anomaliesCount['Procedural Violation']} project(s) lack required technical stage certificates or have inspection documentation variances.`,
    })
  }

  if (riskContributors.length === 0) {
    riskContributors.push({
      id: 'rc-nominal',
      category: 'Baseline Compliance',
      title: 'Normal Statutory Operational Status',
      points: 5,
      severity: 'low',
      explanation:
        'All executing works comply within acceptable variance thresholds under statutory MPLADS guidelines.',
    })
  }

  return {
    ...agency,
    states,
    riskContributors,
    disbursementsByFy,
    fundFlow: {
      recommendedAmount,
      recommendedDisplay: formatCurrency(recommendedAmount),
      sanctionedAmount,
      sanctionedDisplay: formatCurrency(sanctionedAmount),
      disbursedAmount,
      disbursedDisplay: formatCurrency(disbursedAmount),
      spentAmount,
      spentDisplay: formatCurrency(spentAmount),
      unutilizedAmount,
      unutilizedDisplay: formatCurrency(unutilizedAmount),
      sanctionedVsRecommendedPercent,
      disbursedVsSanctionedPercent,
      spentVsDisbursedPercent,
    },
    statusBreakdown: statusMap,
    anomaliesCount,
    vendorConcentration,
    constituencyFootprint,
  }
}

// Telemetry summary for directory page
export function getAgencyTelemetry(agencies: AgencyRecord[]) {
  const agenciesMonitored = agencies.length
  const activeAgencies = agencies.filter((a) => a.activeWorks > 0).length
  const highRiskAgencies = agencies.filter(
    (a) => a.riskLevel === 'critical' || a.riskLevel === 'high'
  ).length

  let flaggedProjectsCount = 0
  let totalDisbursedNum = 0
  let totalSanctionedNum = 0
  let totalProjectsCount = 0

  agencies.forEach((a) => {
    flaggedProjectsCount += a.flaggedWorksCount
    totalDisbursedNum += a.totalDisbursedNum
    totalSanctionedNum += a.totalSanctionedNum
    totalProjectsCount += a.activeWorks + a.completedWorks
  })

  return {
    agenciesMonitored,
    activeAgencies,
    highRiskAgencies,
    flaggedProjectsCount,
    projectsExecuted: totalProjectsCount,
    totalDisbursedDisplay: formatCurrency(totalDisbursedNum),
    totalDisbursedNum,
    totalSanctionedDisplay: formatCurrency(totalSanctionedNum),
    totalSanctionedNum,
  }
}

// Risk distribution for directory page
export function getAgencyRiskDistribution(agencies: AgencyRecord[]) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  agencies.forEach((a) => {
    if (a.riskLevel in counts) {
      counts[a.riskLevel as keyof typeof counts]++
    }
  })
  const total = agencies.length || 1

  return {
    critical: {
      count: counts.critical,
      percent: Math.round((counts.critical / total) * 100),
    },
    high: {
      count: counts.high,
      percent: Math.round((counts.high / total) * 100),
    },
    medium: {
      count: counts.medium,
      percent: Math.round((counts.medium / total) * 100),
    },
    low: {
      count: counts.low,
      percent: Math.round((counts.low / total) * 100),
    },
    total: agencies.length,
  }
}
