import { ProjectRecord, MpRecord, RiskLevel } from '@/types'
import { mockProjects } from './projects'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

const partyMap: Record<string, string> = {
  'Rahul Sharma': 'INC',
  'Smt. Aparna Sen': 'BJP',
  'Tejaswi M.': 'BJP',
  'Ajay Kumar Rai': 'INC',
  'Vikramaditya S.': 'INC',
  'Dr. S. Mukherjee': 'AITC',
  'Hemant Godse': 'SHS',
  'Su. Venkatesan': 'CPI(M)',
  'Shashi Tharoor': 'INC',
  'Hiren Patel': 'BJP',
  'Gaurav Gogoi': 'INC',
  'Pinaki Misra': 'BJD',
  'Harpal Singh Cheema': 'AAP',
  'Pragya Singh': 'BJP',
  'Manoj Tiwari': 'BJP',
  'Kesineni Srinivas': 'TDP',
  'Asaduddin Owaisi': 'AIMIM',
  'Rao Inderjit Singh': 'BJP',
  'Sanjay Seth': 'BJP',
  'Supriya Sule': 'NCP(SP)',
  'Arvind Sawant': 'SHS(UBT)',
}

// Categorize anomaly string into 1 of the 7 core forensic types
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

// Extract fiscal year from workCode or timeline
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

// Derive MP records from mockProjects
export const mockMps: MpRecord[] = (() => {
  const mpGroups: Record<string, ProjectRecord[]> = {}

  mockProjects.forEach((p) => {
    if (!mpGroups[p.mpName]) {
      mpGroups[p.mpName] = []
    }
    mpGroups[p.mpName].push(p)
  })

  return Object.entries(mpGroups).map(([mpName, projects]) => {
    const first = projects[0]
    const id = `mp-${slugify(mpName)}`

    // Extract constituency code from string like "Ahmednagar (MH-14)"
    const codeMatch = first.constituency.match(/\(([^)]+)\)/)
    const constituencyCode = codeMatch ? codeMatch[1] : first.constituency.slice(0, 5).toUpperCase()

    let totalSanctioned = 0
    let totalDisbursed = 0
    let totalSpent = 0
    let flaggedCount = 0
    let maxRiskScore = 0
    let primaryRisk = first.primaryAnomaly

    const anomaliesCount: Record<string, number> = {
      'Cost Inflation': 0,
      'Payment Pattern': 0,
      'Completion Delay': 0,
      'Vendor Concentration': 0,
      'Duplicate Works': 0,
      'Procedural Violation': 0,
      'Spatial Similarity': 0,
    }

    const statusBreakdown = {
      recommended: 0,
      sanctioned: 0,
      disbursed: 0,
      completed: 0,
      stalled: 0,
    }

    const fyMap: Record<string, { count: number; sanctionedAmount: number }> = {
      'FY 2023-24': { count: 0, sanctionedAmount: 0 },
      'FY 2024-25': { count: 0, sanctionedAmount: 0 },
      'FY 2025-26': { count: 0, sanctionedAmount: 0 },
    }

    projects.forEach((p) => {
      totalSanctioned += p.sanctionedAmount
      totalDisbursed += p.disbursedAmount
      totalSpent += p.spentAmount

      if (p.riskScore > maxRiskScore) {
        maxRiskScore = p.riskScore
        primaryRisk = p.primaryAnomaly
      }

      if (p.riskLevel === 'critical' || p.riskLevel === 'high') {
        flaggedCount++
      }

      // Track anomaly categories from primaryAnomaly + violations
      const cat = categorizeAnomaly(p.primaryAnomaly)
      anomaliesCount[cat] = (anomaliesCount[cat] || 0) + 1

      p.violations.forEach((v) => {
        const vCat = categorizeAnomaly(v.title + ' ' + v.description)
        anomaliesCount[vCat] = (anomaliesCount[vCat] || 0) + 1
      })

      // Track project statuses
      const sLower = p.status.toLowerCase()
      if (sLower.includes('complete')) {
        statusBreakdown.completed++
      } else if (sLower.includes('stall')) {
        statusBreakdown.stalled++
      } else if (sLower.includes('disburs') || sLower.includes('progress') || sLower.includes('investigation')) {
        statusBreakdown.disbursed++
      } else if (sLower.includes('sanction')) {
        statusBreakdown.sanctioned++
      } else {
        statusBreakdown.recommended++
      }

      // Track FY activity
      const fy = extractFy(p.workCode, p.timeline?.sanctioned)
      if (fyMap[fy]) {
        fyMap[fy].count++
        fyMap[fy].sanctionedAmount += p.sanctionedAmount
      }
    })

    // Standard MPLADS entitlement per MP tenure (₹25.00 Cr for 5-yr term, or scaled)
    const allocatedAmount = Math.max(250000000, Math.ceil((totalSanctioned * 1.2) / 10000000) * 10000000)
    const recommendedAmount = Math.round(totalSanctioned * 1.08)

    // Average and effective risk score
    const avgScore = Math.round(
      projects.reduce((acc, curr) => acc + curr.riskScore, 0) / projects.length
    )
    const effectiveRiskScore = Math.max(avgScore, maxRiskScore >= 90 ? Math.round((avgScore + maxRiskScore) / 2) : avgScore)

    let riskLevel: RiskLevel = 'low'
    if (effectiveRiskScore >= 85) riskLevel = 'critical'
    else if (effectiveRiskScore >= 70) riskLevel = 'high'
    else if (effectiveRiskScore >= 40) riskLevel = 'medium'

    // Utilization percentage: disbursed vs sanctioned
    const utilizationPercent = totalSanctioned > 0
      ? Math.min(100, Math.round((totalDisbursed / totalSanctioned) * 1000) / 10)
      : 0

    const activityByFy = Object.entries(fyMap).map(([fy, data]) => ({
      fy,
      projectsCount: data.count,
      sanctionedAmount: data.sanctionedAmount,
    }))

    return {
      id,
      name: mpName,
      house: first.mpHouse,
      constituency: first.constituency,
      constituencyCode,
      state: first.state,
      district: first.district,
      allocatedAmount,
      allocatedDisplay: formatCurrency(allocatedAmount),
      sanctionedAmount: totalSanctioned,
      sanctionedDisplay: formatCurrency(totalSanctioned),
      disbursedAmount: totalDisbursed,
      disbursedDisplay: formatCurrency(totalDisbursed),
      spentAmount: totalSpent,
      spentDisplay: formatCurrency(totalSpent),
      recommendedAmount,
      recommendedDisplay: formatCurrency(recommendedAmount),
      utilizationPercent,
      projectsCount: projects.length,
      flaggedProjectsCount: flaggedCount,
      riskScore: effectiveRiskScore,
      riskLevel,
      primaryRisk,
      party: partyMap[mpName] || 'Independent',
      term: first.mpHouse === 'RS' ? 'Rajya Sabha (2022-2028)' : '18th Lok Sabha (2024-2029)',
      anomaliesCount,
      statusBreakdown,
      activityByFy,
    }
  })
})()

// Helper: Find MP by ID, slug, or name
export function getMpById(id: string): MpRecord | undefined {
  if (!id) return undefined
  const target = id.toLowerCase().trim()
  const slugTarget = target.replace(/^mp-/, '')
  return mockMps.find((m) => {
    const rawId = m.id.toLowerCase()
    const slugName = m.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
    return (
      rawId === target ||
      rawId.replace(/^mp-/, '') === slugTarget ||
      m.name.toLowerCase() === target ||
      slugName === slugTarget ||
      slugName === target ||
      m.constituency.toLowerCase() === target
    )
  })
}

// Helper: Get projects for an MP
export function getMpProjects(mpName: string): ProjectRecord[] {
  return mockProjects.filter((p) => p.mpName.toLowerCase() === mpName.toLowerCase())
}

// Helper: Get top-risk constituencies
export function getTopRiskConstituencies(limit: number = 15): MpRecord[] {
  return [...mockMps]
    .sort((a, b) => b.riskScore - a.riskScore || b.flaggedProjectsCount - a.flaggedProjectsCount)
    .slice(0, limit)
}

// Helper: Calculate national fund utilization summary
export function getNationalUtilizationSummary(mps: MpRecord[]) {
  let recommended = 0
  let sanctioned = 0
  let disbursed = 0
  let allocated = 0

  mps.forEach((m) => {
    recommended += m.recommendedAmount
    sanctioned += m.sanctionedAmount
    disbursed += m.disbursedAmount
    allocated += m.allocatedAmount
  })

  const unutilizedAmount = Math.max(0, sanctioned - disbursed)
  const sanctionedVsRecommended = recommended > 0 ? (sanctioned / recommended) * 100 : 0
  const disbursedVsSanctioned = sanctioned > 0 ? (disbursed / sanctioned) * 100 : 0
  const utilizationVsAllocated = allocated > 0 ? (disbursed / allocated) * 100 : 0

  return {
    recommended,
    recommendedDisplay: formatCurrency(recommended),
    sanctioned,
    sanctionedDisplay: formatCurrency(sanctioned),
    disbursed,
    disbursedDisplay: formatCurrency(disbursed),
    allocated,
    allocatedDisplay: formatCurrency(allocated),
    unutilizedAmount,
    unutilizedDisplay: formatCurrency(unutilizedAmount),
    sanctionedVsRecommended: Math.round(sanctionedVsRecommended * 10) / 10,
    disbursedVsSanctioned: Math.round(disbursedVsSanctioned * 10) / 10,
    utilizationVsAllocated: Math.round(utilizationVsAllocated * 10) / 10,
  }
}
