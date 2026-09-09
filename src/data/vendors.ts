import {
  VendorRecord,
  VendorProfile,
  VendorRiskContributor,
  VendorNetworkNode,
  VendorNetworkLink,
  VendorStateSummary,
  ProjectRecord,
  RiskLevel,
} from '@/types'
import { mockProjects } from './projects'

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

function extractFy(workCode: string, timelineDate?: string): string {
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

function categorizeAnomaly(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('cost') || lower.includes('inflation') || lower.includes('rate') || lower.includes('median')) {
    return 'Cost Inflation'
  }
  if (lower.includes('disburs') || lower.includes('payment') || lower.includes('tranche') || lower.includes('unspent') || lower.includes('consecutive')) {
    return 'Payment Pattern'
  }
  if (lower.includes('delay') || lower.includes('overdue') || lower.includes('pace') || lower.includes('idle')) {
    return 'Completion Delay'
  }
  if (lower.includes('vendor') || lower.includes('cartel') || lower.includes('directorship') || lower.includes('bidder')) {
    return 'Vendor Concentration'
  }
  if (lower.includes('duplicate') || lower.includes('gps') || lower.includes('spatial') || lower.includes('overlap')) {
    return 'Duplicate Works'
  }
  if (lower.includes('procedural') || lower.includes('clearance') || lower.includes('coastal') || lower.includes('norm') || lower.includes('dispute') || lower.includes('signoff')) {
    return 'Procedural Violation'
  }
  return 'Spatial Similarity'
}

const vendorIdMap: Record<string, string> = {
  'Apex Infra Projects Ltd.': 'ven-001',
  'Sai Krupa Construction Co.': 'ven-002',
  'Bharat Civil & Electric Works': 'ven-003',
  'Omkar Rural Enterprises': 'ven-004',
  'Vardhman Tech Infrastructures': 'ven-005',
  'National Highway Concessionaires': 'ven-006',
  'Deccan Builders & Engineers': 'ven-007',
  'Pragati Green Energy Solutions': 'ven-008',
  'Trident Watertech Solutions': 'ven-009',
  'Surya Solar Grid Systems': 'ven-010',
}

const networkSignalsMap: Record<string, string> = {
  'ven-001': 'Cluster Signal (8 works in 1 taluka)',
  'ven-002': 'GIS Duplicate Centroid Overlap',
  'ven-003': 'Single-Bidder (3 common directors)',
  'ven-004': 'Milestone Bypass & Photo Gap',
  'ven-005': 'Cross-District Allocation Surge',
  'ven-006': 'State Highway Scheme Overlap',
  'ven-007': 'Accelerated Multi-Tranche Velocity',
  'ven-008': 'Directorship Linkage Detected',
  'ven-009': 'Rapid Milestone Release Signal',
  'ven-010': 'Sole Bidder Concentration Flag',
}

const registeredStateMap: Record<string, string> = {
  'ven-001': 'Maharashtra',
  'ven-002': 'Uttar Pradesh',
  'ven-003': 'Karnataka',
  'ven-004': 'Bihar',
  'ven-005': 'Kerala',
  'ven-006': 'Gujarat',
  'ven-007': 'Odisha',
  'ven-008': 'Punjab',
  'ven-009': 'Delhi',
  'ven-010': 'Gujarat',
}

const consecutiveAwardsMap: Record<string, number> = {
  'ven-001': 8,
  'ven-002': 5,
  'ven-003': 6,
  'ven-004': 7,
  'ven-005': 3,
  'ven-006': 4,
  'ven-007': 4,
  'ven-008': 3,
  'ven-009': 4,
  'ven-010': 3,
}

// Generate deterministic mockVendors from mockProjects
export const mockVendors: VendorRecord[] = (() => {
  const vendorGroups: Record<string, ProjectRecord[]> = {}

  mockProjects.forEach((p) => {
    if (!vendorGroups[p.vendor]) {
      vendorGroups[p.vendor] = []
    }
    vendorGroups[p.vendor].push(p)
  })

  return Object.entries(vendorGroups).map(([vendorName, projects]) => {
    const first = projects[0]
    const id = vendorIdMap[vendorName] || `ven-${Math.floor(100 + Math.random() * 900)}`
    const gstin = first.vendorGst || '27AAACA9921D1Z4'

    let totalSanctioned = 0
    let totalDisbursed = 0
    let totalSpent = 0
    let flaggedCount = 0
    let completedCount = 0
    let maxScore = 0
    let primaryAnomaly = first.primaryAnomaly

    const statesSet = new Set<string>()
    const agencyCounts: Record<string, number> = {}
    const constCounts: Record<string, number> = {}

    projects.forEach((p) => {
      totalSanctioned += p.sanctionedAmount
      totalDisbursed += p.disbursedAmount
      totalSpent += p.spentAmount

      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        flaggedCount++
      }

      if (p.status.toLowerCase().includes('complete')) {
        completedCount++
      }

      if (p.riskScore > maxScore) {
        maxScore = p.riskScore
        primaryAnomaly = p.primaryAnomaly
      }

      statesSet.add(p.state)
      agencyCounts[p.agency] = (agencyCounts[p.agency] || 0) + 1
      constCounts[p.constituency] = (constCounts[p.constituency] || 0) + 1
    })

    const avgScore = Math.round(
      projects.reduce((acc, curr) => acc + curr.riskScore, 0) / projects.length
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

    // Top agency and constituency
    const topAgency = Object.entries(agencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || first.agency
    const topConstituency = Object.entries(constCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || first.constituency

    return {
      id,
      name: vendorName,
      gstin,
      activeWorks: activeWorks > 0 ? activeWorks : projects.length,
      completedWorks: completedCount,
      totalSanctioned: formatCurrency(totalSanctioned),
      totalSanctionedNum: totalSanctioned,
      totalDisbursed: formatCurrency(totalDisbursed),
      totalDisbursedNum: totalDisbursed,
      totalSpent: formatCurrency(totalSpent),
      totalSpentNum: totalSpent,
      flaggedWorksCount: flaggedCount,
      flaggedPercentage,
      avgProjectValue: formatCurrency(avgProjectValueNum),
      avgProjectValueNum,
      primaryAnomaly,
      riskScore: effectiveRiskScore,
      riskLevel,
      statePresence: Array.from(statesSet),
      networkSignal: networkSignalsMap[id] || 'Procurement Anomaly Flag',
      registeredState: registeredStateMap[id] || first.state,
      consecutiveAwards: consecutiveAwardsMap[id] || 3,
      topAgency,
      topConstituency,
    }
  })
})()

// Helper to get vendor by ID or name or slug
export function getVendorById(id: string): VendorRecord | undefined {
  if (!id) return undefined
  const target = id.toLowerCase().trim()
  return mockVendors.find(
    (v) =>
      v.id.toLowerCase() === target ||
      v.name.toLowerCase() === target ||
      v.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') === target
  )
}

// Helper to get vendor projects
export function getVendorProjects(vendorNameOrId: string): ProjectRecord[] {
  const v = mockVendors.find(
    (item) =>
      item.id.toLowerCase() === vendorNameOrId.toLowerCase() ||
      item.name.toLowerCase() === vendorNameOrId.toLowerCase()
  )
  const targetName = v ? v.name.toLowerCase() : vendorNameOrId.toLowerCase()
  return mockProjects.filter((p) => p.vendor.toLowerCase() === targetName)
}

// Helper to get comprehensive VendorProfile
export function getVendorProfile(id: string): VendorProfile | undefined {
  const vendor = getVendorById(id)
  if (!vendor) return undefined

  const projects = getVendorProjects(vendor.name)

  // Calculate state distributions
  const stateMap: Record<
    string,
    { count: number; disbursed: number; flagged: number }
  > = {}

  const fyMap: Record<string, { disbursed: number; count: number }> = {
    'FY 2023-24': { disbursed: 0, count: 0 },
    'FY 2024-25': { disbursed: 0, count: 0 },
    'FY 2025-26': { disbursed: 0, count: 0 },
  }

  const anomaliesCount: Record<string, number> = {
    'Cost Inflation': 0,
    'Payment Pattern': 0,
    'Completion Delay': 0,
    'Vendor Concentration': 0,
    'Duplicate Works': 0,
    'Procedural Violation': 0,
    'Spatial Similarity': 0,
  }

  const agencyCounts: Record<string, number> = {}
  const constituencyCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}

  let flaggedCapitalNum = 0

  projects.forEach((p) => {
    // State grouping
    if (!stateMap[p.state]) {
      stateMap[p.state] = { count: 0, disbursed: 0, flagged: 0 }
    }
    stateMap[p.state].count++
    stateMap[p.state].disbursed += p.disbursedAmount
    if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
      stateMap[p.state].flagged++
      flaggedCapitalNum += p.sanctionedAmount
    }

    // FY grouping
    const fy = extractFy(p.workCode, p.timeline?.sanctioned)
    if (fyMap[fy]) {
      fyMap[fy].disbursed += p.disbursedAmount
      fyMap[fy].count++
    }

    // Anomaly classification
    const cat = categorizeAnomaly(p.primaryAnomaly)
    anomaliesCount[cat] = (anomaliesCount[cat] || 0) + 1
    p.violations.forEach((v) => {
      const vCat = categorizeAnomaly(`${v.title} ${v.description}`)
      anomaliesCount[vCat] = (anomaliesCount[vCat] || 0) + 1
    })

    // Concentration counters
    agencyCounts[p.agency] = (agencyCounts[p.agency] || 0) + 1
    constituencyCounts[p.constituency] = (constituencyCounts[p.constituency] || 0) + 1
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
  })

  const states: VendorStateSummary[] = Object.entries(stateMap).map(
    ([state, stats]) => ({
      state,
      projectsCount: stats.count,
      disbursedAmount: stats.disbursed,
      disbursedDisplay: formatCurrency(stats.disbursed),
      flaggedCount: stats.flagged,
      flaggedPercentage:
        stats.count > 0 ? Math.round((stats.flagged / stats.count) * 1000) / 10 : 0,
    })
  )

  const disbursementsByFy = Object.entries(fyMap).map(([fy, stats]) => ({
    fy,
    disbursedAmount: Math.round((stats.disbursed / 10000000) * 100) / 100,
    disbursedDisplay: formatCurrency(stats.disbursed),
    worksCount: stats.count,
  }))

  // Concentration metrics
  const totalSystemProjects = mockProjects.length
  const projectSharePercent =
    totalSystemProjects > 0
      ? Math.round((projects.length / totalSystemProjects) * 1000) / 10
      : 0

  const maxAgencyCount = Math.max(...Object.values(agencyCounts), 0)
  const agencyConcentrationPercent =
    projects.length > 0 ? Math.round((maxAgencyCount / projects.length) * 1000) / 10 : 0

  const maxConstCount = Math.max(...Object.values(constituencyCounts), 0)
  const constituencyConcentrationPercent =
    projects.length > 0 ? Math.round((maxConstCount / projects.length) * 1000) / 10 : 0

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 0)
  const categoryConcentrationPercent =
    projects.length > 0 ? Math.round((maxCategoryCount / projects.length) * 1000) / 10 : 0

  // 7 standard risk contributors with objective data-honesty explanations
  const isHighRisk = vendor.riskScore >= 70
  const riskContributors: VendorRiskContributor[] = [
    {
      id: 'rc-1',
      category: 'Cost Anomaly',
      title: 'Cost Anomaly Variance',
      points: isHighRisk ? 28 : 12,
      severity: isHighRisk ? 'critical' : 'medium',
      explanation: isHighRisk
        ? 'Average sanctioned unit rates exceed state standard schedule of rates by 2.4x across multiple civil works.'
        : 'Unit rates align within standard tolerance of regional public works schedule of rates.',
    },
    {
      id: 'rc-2',
      category: 'Payment Pattern',
      title: 'Accelerated Tranche Velocity',
      points: isHighRisk ? 24 : 8,
      severity: isHighRisk ? 'critical' : 'low',
      explanation: isHighRisk
        ? 'Multiple milestone disbursements released in close temporal proximity without requisite stage certification.'
        : 'Disbursements adhere to scheduled periodic verification milestones.',
    },
    {
      id: 'rc-3',
      category: 'Vendor Concentration',
      title: 'Taluka / District Concentration',
      points: vendor.consecutiveAwards && vendor.consecutiveAwards >= 5 ? 22 : 10,
      severity: vendor.consecutiveAwards && vendor.consecutiveAwards >= 5 ? 'high' : 'medium',
      explanation: `Vendor received ${vendor.consecutiveAwards || 4} consecutive public works awards in the same administrative jurisdiction within an 18-month window.`,
    },
    {
      id: 'rc-4',
      category: 'Single-Bidder Pattern',
      title: 'Procurement Competition Signal',
      points: vendor.riskScore > 85 ? 20 : 6,
      severity: vendor.riskScore > 85 ? 'high' : 'low',
      explanation: vendor.riskScore > 85
        ? 'Tender evaluations record 3 or fewer technical bidders, with recurring competitors exhibiting common registered addresses.'
        : 'Standard competitive tender turnout observed with independent participants.',
    },
    {
      id: 'rc-5',
      category: 'Completion Delay',
      title: 'Project Aging & Overdue Milestones',
      points: 16,
      severity: 'medium',
      explanation: 'Works exhibit progress lag against statutory sanction milestones requiring engineering review.',
    },
    {
      id: 'rc-6',
      category: 'Spatial Repetition',
      title: 'Spatial Centroid Proximity',
      points: vendor.id === 'ven-002' ? 22 : 8,
      severity: vendor.id === 'ven-002' ? 'critical' : 'low',
      explanation: vendor.id === 'ven-002'
        ? 'GPS coordinate analysis detects proximity overlap with existing state department infrastructure asset.'
        : 'Geographic coordinate markers confirm distinct, non-overlapping physical construction sites.',
    },
    {
      id: 'rc-7',
      category: 'Cross-Constituency Activity',
      title: 'Multi-Constituency Presence',
      points: states.length > 2 ? 14 : 6,
      severity: states.length > 2 ? 'medium' : 'low',
      explanation: `Entity simultaneously executes contracts across ${states.length} separate state jurisdictions and ${Object.keys(constituencyCounts).length} parliamentary constituencies.`,
    },
  ]

  // Network Nodes and Links
  const networkNodes: VendorNetworkNode[] = [
    {
      id: vendor.id,
      label: vendor.name,
      type: 'vendor',
      riskLevel: vendor.riskLevel,
      subtitle: `GST: ${vendor.gstin}`,
    },
  ]

  const networkLinks: VendorNetworkLink[] = []

  // Add top projects (up to 4)
  projects.slice(0, 4).forEach((p) => {
    networkNodes.push({
      id: p.id,
      label: p.workCode,
      type: 'project',
      riskLevel: p.riskLevel,
      subtitle: p.title.slice(0, 24) + '...',
    })
    networkLinks.push({
      source: vendor.id,
      target: p.id,
      label: 'Awarded Work',
      isAnomaly: p.riskLevel === 'critical' || p.riskLevel === 'high',
    })

    // Connect project to constituency
    const constId = `const-${p.constituency.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '-')}`
    if (!networkNodes.find((n) => n.id === constId)) {
      networkNodes.push({
        id: constId,
        label: p.constituency,
        type: 'constituency',
        subtitle: p.state,
      })
    }
    networkLinks.push({
      source: p.id,
      target: constId,
      label: 'Location',
    })

    // Connect project to agency
    const agencyId = `ag-${p.agency.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '-')}`
    if (!networkNodes.find((n) => n.id === agencyId)) {
      networkNodes.push({
        id: agencyId,
        label: p.agency,
        type: 'agency',
        subtitle: 'Implementing Body',
      })
    }
    networkLinks.push({
      source: p.id,
      target: agencyId,
      label: 'Executing Agency',
    })
  })

  // Add linked vendor connection for specific network signals
  if (vendor.id === 'ven-001' || vendor.id === 'ven-003') {
    const peerId = vendor.id === 'ven-001' ? 'ven-003' : 'ven-001'
    const peer = getVendorById(peerId)
    if (peer) {
      networkNodes.push({
        id: peer.id,
        label: peer.name,
        type: 'vendor',
        riskLevel: peer.riskLevel,
        subtitle: 'Cross-Directorship Signal',
      })
      networkLinks.push({
        source: vendor.id,
        target: peer.id,
        label: 'Shared Director Signal',
        isAnomaly: true,
      })
    }
  }

  return {
    ...vendor,
    completedWorks: vendor.completedWorks || 0,
    totalSanctioned: vendor.totalSanctioned || formatCurrency(vendor.totalDisbursedNum * 1.2),
    totalSanctionedNum: vendor.totalSanctionedNum || vendor.totalDisbursedNum * 1.2,
    totalSpent: vendor.totalSpent || formatCurrency(vendor.totalDisbursedNum * 0.8),
    totalSpentNum: vendor.totalSpentNum || vendor.totalDisbursedNum * 0.8,
    flaggedCapital: formatCurrency(flaggedCapitalNum),
    flaggedCapitalNum,
    avgProjectValue: vendor.avgProjectValue || '₹ 0 L',
    avgProjectValueNum: vendor.avgProjectValueNum || 0,
    states,
    riskContributors,
    disbursementsByFy,
    concentration: {
      projectSharePercent,
      agencyConcentrationPercent,
      constituencyConcentrationPercent,
      categoryConcentrationPercent,
      singleBidderRatePercent: vendor.riskScore > 80 ? 42.5 : 18.0,
      consecutiveAwardsCount: vendor.consecutiveAwards || 3,
    },
    anomaliesCount,
    networkNodes,
    networkLinks,
  }
}

// Summary telemetry for the header
export function getVendorTelemetry(vendors: VendorRecord[]) {
  let totalDisbursed = 0
  let highRiskCount = 0
  let flaggedProjectsCount = 0
  let totalActive = 0
  let totalProjectValue = 0

  vendors.forEach((v) => {
    totalDisbursed += v.totalDisbursedNum
    if (v.riskLevel === 'critical' || v.riskLevel === 'high') {
      highRiskCount++
    }
    flaggedProjectsCount += v.flaggedWorksCount
    totalActive += v.activeWorks
    totalProjectValue += (v.avgProjectValueNum || 0) * (v.activeWorks + (v.completedWorks || 0))
  })

  const totalWorks = totalActive + vendors.reduce((acc, v) => acc + (v.completedWorks || 0), 0)
  const avgValue = totalWorks > 0 ? Math.round(totalProjectValue / totalWorks) : 0

  return {
    vendorsMonitored: vendors.length,
    activeContractors: vendors.filter((v) => v.activeWorks > 0).length,
    highRiskVendors: highRiskCount,
    flaggedProjectsCount,
    totalDisbursedNum: totalDisbursed,
    totalDisbursedDisplay: formatCurrency(totalDisbursed),
    avgProjectValueDisplay: formatCurrency(avgValue),
  }
}

// Vendor Risk Distribution counts
export function getVendorRiskDistribution(vendors: VendorRecord[]) {
  let critical = 0
  let high = 0
  let medium = 0
  let low = 0

  vendors.forEach((v) => {
    if (v.riskLevel === 'critical') critical++
    else if (v.riskLevel === 'high') high++
    else if (v.riskLevel === 'medium') medium++
    else low++
  })

  return {
    critical,
    high,
    medium,
    low,
    total: vendors.length,
  }
}

