import { ProjectRecord, VendorRecord, AgencyRecord, MpRecord } from '@/types'
import {
  AnomalyFinding,
  CrossDatasetLinks,
  EngineEvaluationResult,
  EngineSummary,
  DatasetLinkageStats,
  EngineFilterOptions,
  ProjectRiskAssessment,
  RuleCategory,
} from './types'
import { ANOMALY_RULES, formatCurrency } from './rules'
import { computeProjectRiskScore } from './scoring'
import { mockProjects } from '@/data/projects'
import { mockVendors } from '@/data/vendors'
import { mockAgencies } from '@/data/agencies'
import { mockMps } from '@/data/mps'
import { mockDataSources } from '@/data/dataSources'

export function buildCrossDatasetLinks(
  projects: ProjectRecord[],
  vendors: VendorRecord[] = mockVendors,
  agencies: AgencyRecord[] = mockAgencies,
  mps: MpRecord[] = mockMps
): CrossDatasetLinks {
  const vendorMap = new Map<string, VendorRecord>()
  vendors.forEach((v) => vendorMap.set(v.name, v))

  const agencyMap = new Map<string, AgencyRecord>()
  agencies.forEach((a) => agencyMap.set(a.name, a))

  const mpMap = new Map<string, MpRecord>()
  mps.forEach((m) => {
    mpMap.set(m.name, m)
    mpMap.set(m.constituency, m)
  })

  const projectsByVendor = new Map<string, ProjectRecord[]>()
  const projectsByAgency = new Map<string, ProjectRecord[]>()
  const projectsByConstituency = new Map<string, ProjectRecord[]>()
  const projectsByWorkCode = new Map<string, ProjectRecord[]>()

  projects.forEach((p) => {
    // By Vendor
    const vList = projectsByVendor.get(p.vendor) || []
    vList.push(p)
    projectsByVendor.set(p.vendor, vList)

    // By Agency
    const aList = projectsByAgency.get(p.agency) || []
    aList.push(p)
    projectsByAgency.set(p.agency, aList)

    // By Constituency
    const cList = projectsByConstituency.get(p.constituency) || []
    cList.push(p)
    projectsByConstituency.set(p.constituency, cList)

    // By Work Code
    const wList = projectsByWorkCode.get(p.workCode) || []
    wList.push(p)
    projectsByWorkCode.set(p.workCode, wList)
  })

  const dataSourceMap = new Map()
  mockDataSources.forEach((ds) => dataSourceMap.set(ds.id, ds))

  return {
    vendorMap,
    agencyMap,
    mpMap,
    projectsByVendor,
    projectsByAgency,
    projectsByConstituency,
    projectsByWorkCode,
    dataSourceMap,
  }
}

export function runAnomalyEngine(
  projects: ProjectRecord[] = mockProjects,
  customLinks?: CrossDatasetLinks
): EngineEvaluationResult {
  const links = customLinks || buildCrossDatasetLinks(projects)

  const allFindings: AnomalyFinding[] = []
  const assessments: Record<string, ProjectRiskAssessment> = {}

  const ruleTriggerCounts: Record<string, number> = {}
  const categoryCounts: Record<RuleCategory, number> = {
    financial: 0,
    vendor: 0,
    timeline: 0,
    integrity: 0,
    cross_linkage: 0,
  }

  // Initialize trigger count for each rule
  ANOMALY_RULES.forEach((rule) => {
    ruleTriggerCounts[rule.id] = 0
  })

  projects.forEach((project) => {
    const projectFindings: AnomalyFinding[] = []

    ANOMALY_RULES.forEach((rule) => {
      try {
        const findings = rule.evaluate({
          project,
          allProjects: projects,
          links,
        })

        if (findings && findings.length > 0) {
          findings.forEach((finding) => {
            projectFindings.push(finding)
            allFindings.push(finding)
            ruleTriggerCounts[rule.id] = (ruleTriggerCounts[rule.id] || 0) + 1
            categoryCounts[finding.category] = (categoryCounts[finding.category] || 0) + 1
          })
        }
      } catch (err) {
        console.warn(`[AnomalyEngine] Rule ${rule.id} failed on project ${project.id}:`, err)
      }
    })

    const assessment = computeProjectRiskScore(project, projectFindings)
    assessments[project.id] = assessment
  })

  // Severity counts
  let criticalCount = 0
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0
  let totalExposureNum = 0

  allFindings.forEach((finding) => {
    if (finding.severity === 'critical') criticalCount++
    else if (finding.severity === 'high') highCount++
    else if (finding.severity === 'medium') mediumCount++
    else if (finding.severity === 'low') lowCount++

    totalExposureNum += finding.financialImpact
  })

  const summary: EngineSummary = {
    totalFindings: allFindings.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalExposureNum,
    totalExposureDisplay: formatCurrency(totalExposureNum),
    ruleTriggerCounts,
    categoryCounts,
    evaluatedProjectsCount: projects.length,
  }

  // Dataset linkage stats
  const totalDatasets = mockDataSources.length
  const linkedDatasets = mockDataSources.filter((d) => d.joinStatus === 'Linked').length
  const pendingDatasets = mockDataSources.filter((d) => d.joinStatus === 'Pending Ingestion').length

  const datasetLinkageStats: DatasetLinkageStats = {
    totalDatasets,
    linkedDatasets,
    pendingDatasets,
    matchRate: 98.6,
    activeLinkKeys: [
      'work_code (1:1 Master Join)',
      'vendor_gstin (N:1 GeM Portal)',
      'mp_name / constituency (N:1 Entitlement)',
      'agency (N:1 Implementing Registry)',
    ],
    linkedProjectsCount: projects.length,
    linkedVendorsCount: links.vendorMap.size,
    linkedAgenciesCount: links.agencyMap.size,
    linkedMpsCount: links.mpMap.size,
  }

  return {
    findings: allFindings,
    assessments,
    summary,
    datasetLinkageStats,
    timestamp: new Date().toISOString(),
  }
}

// Global cached engine evaluation singleton
let cachedResult: EngineEvaluationResult | null = null

export function getDefaultEngineResult(forceRefresh = false): EngineEvaluationResult {
  if (!cachedResult || forceRefresh) {
    cachedResult = runAnomalyEngine(mockProjects)
  }
  return cachedResult
}

export function filterFindings(
  findings: AnomalyFinding[],
  filters: EngineFilterOptions
): AnomalyFinding[] {
  return findings.filter((finding) => {
    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim()
      const matches =
        finding.workCode.toLowerCase().includes(q) ||
        finding.projectTitle.toLowerCase().includes(q) ||
        finding.ruleName.toLowerCase().includes(q) ||
        finding.affectedEntity.name.toLowerCase().includes(q) ||
        finding.district.toLowerCase().includes(q) ||
        finding.state.toLowerCase().includes(q) ||
        finding.explanation.toLowerCase().includes(q)
      if (!matches) return false
    }

    // Severity
    if (filters.severity && filters.severity !== 'all') {
      if (finding.severity !== filters.severity) return false
    }

    // Category
    if (filters.category && filters.category !== 'all') {
      if (finding.category !== filters.category) return false
    }

    // Rule ID
    if (filters.ruleId && filters.ruleId !== 'all') {
      if (finding.ruleId !== filters.ruleId) return false
    }

    // Entity Type
    if (filters.entityType && filters.entityType !== 'all') {
      if (finding.affectedEntity.type !== filters.entityType) return false
    }

    // State
    if (filters.state && filters.state !== 'all') {
      if (finding.state.toLowerCase() !== filters.state.toLowerCase()) return false
    }

    return true
  })
}
