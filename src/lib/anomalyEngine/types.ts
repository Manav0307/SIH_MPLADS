import { ProjectRecord, VendorRecord, AgencyRecord, MpRecord } from '@/types'
import { DataSourceDataset } from '@/types/dataSources'

export type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low'

export type RuleCategory =
  | 'financial'
  | 'vendor'
  | 'timeline'
  | 'integrity'
  | 'cross_linkage'

export interface EvidenceField {
  field: string
  label: string
  value: string | number | boolean | null | undefined
  threshold?: string | number | boolean
  status?: 'breached' | 'warning' | 'normal'
  notes?: string
}

export interface AffectedEntity {
  type: 'vendor' | 'agency' | 'mp' | 'project'
  name: string
  identifier?: string
}

export interface AnomalyFinding {
  anomalyId: string
  ruleId: string
  ruleName: string
  category: RuleCategory
  severity: AnomalySeverity
  confidence: number // 0 - 100
  projectId: string
  workCode: string
  projectTitle: string
  affectedEntity: AffectedEntity
  financialImpact: number
  financialImpactDisplay: string
  explanation: string
  evidenceFields: EvidenceField[]
  timestamp: string
  source: string
  isDemoMock: boolean
  state: string
  district: string
  constituency: string
}

export interface CrossDatasetLinks {
  vendorMap: Map<string, VendorRecord>
  agencyMap: Map<string, AgencyRecord>
  mpMap: Map<string, MpRecord>
  projectsByVendor: Map<string, ProjectRecord[]>
  projectsByAgency: Map<string, ProjectRecord[]>
  projectsByConstituency: Map<string, ProjectRecord[]>
  projectsByWorkCode: Map<string, ProjectRecord[]>
  dataSourceMap: Map<string, DataSourceDataset>
}

export interface AnomalyEvaluationContext {
  project: ProjectRecord
  allProjects: ProjectRecord[]
  links: CrossDatasetLinks
}

export interface AnomalyRuleDefinition {
  id: string
  name: string
  category: RuleCategory
  defaultSeverity: AnomalySeverity
  description: string
  statutoryReference?: string
  evaluate: (context: AnomalyEvaluationContext) => AnomalyFinding[]
}

export interface RiskScoreContributor {
  ruleId: string
  title: string
  points: number
  severity: AnomalySeverity
  explanation: string
}

export interface ProjectRiskAssessment {
  projectId: string
  workCode: string
  overallScore: number // 0 - 100
  riskLevel: AnomalySeverity
  confidence: number
  findings: AnomalyFinding[]
  scoreContributors: RiskScoreContributor[]
  totalFinancialExposure: number
  exposureDisplay: string
  primaryAnomaly: string
}

export interface EngineSummary {
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  totalExposureNum: number
  totalExposureDisplay: string
  ruleTriggerCounts: Record<string, number>
  categoryCounts: Record<RuleCategory, number>
  evaluatedProjectsCount: number
}

export interface DatasetLinkageStats {
  totalDatasets: number
  linkedDatasets: number
  pendingDatasets: number
  matchRate: number
  activeLinkKeys: string[]
  linkedProjectsCount: number
  linkedVendorsCount: number
  linkedAgenciesCount: number
  linkedMpsCount: number
}

export interface EngineEvaluationResult {
  findings: AnomalyFinding[]
  assessments: Record<string, ProjectRiskAssessment>
  summary: EngineSummary
  datasetLinkageStats: DatasetLinkageStats
  timestamp: string
}

export interface EngineFilterOptions {
  searchQuery?: string
  severity?: AnomalySeverity | 'all'
  category?: RuleCategory | 'all'
  ruleId?: string | 'all'
  entityType?: 'all' | 'vendor' | 'agency' | 'mp' | 'project'
  state?: string | 'all'
}
