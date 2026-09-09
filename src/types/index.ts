export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface NavItem {
  name: string
  path: string
  icon: string
  badge?: string | number
  badgeVariant?: RiskLevel | 'default'
  group: 'core' | 'operations'
}

export interface MetricCardData {
  id: string
  label: string
  value: string | number
  subValue?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
  riskLevel?: RiskLevel
  status?: string
}

export interface RuleViolation {
  id: string
  title: string
  description: string
  severity: RiskLevel
}

export interface ProjectTimeline {
  recommended: string
  sanctioned: string
  disbursed: string
  completionTarget: string
}

export interface ProjectEvidence {
  caption: string
  url: string
  watermark?: string
}

export type ProjectStatus =
  | 'In Progress'
  | 'Completed'
  | 'Under Investigation'
  | 'Sanctioned'
  | 'Disbursed'
  | 'Recommended'
  | 'Stalled'
  | 'Under Review'

export type ProjectSortField =
  | 'riskScore'
  | 'sanctionedAmount'
  | 'disbursedAmount'
  | 'spentAmount'
  | 'agingDays'
  | 'recommendedDate'
  | 'sanctionDate'

export interface ProjectRecord {
  id: string
  workCode: string
  title: string
  state: string
  district: string
  constituency: string
  mpName: string
  mpHouse: 'LS' | 'RS'
  category: string
  sanctionedAmount: number
  sanctionedDisplay: string
  disbursedAmount: number
  disbursedDisplay: string
  disbursedPercent: number
  spentAmount: number
  progressPercent: number
  agingDays: number
  agingDisplay: string
  riskScore: number
  riskLevel: RiskLevel
  primaryAnomaly: string
  agency: string
  vendor: string
  vendorGst: string
  status: ProjectStatus
  financialExecutionWarning?: string
  violations: RuleViolation[]
  recommendedActions: { id: string; label: string; checked: boolean }[]
  evidenceImages: ProjectEvidence[]
  timeline: ProjectTimeline
}

export interface AnomalyFeedItem {
  id: string
  workId: string
  projectId: string
  severity: RiskLevel
  riskScore: number
  title: string
  description: string
  financialImpact: string
  financialImpactNum: number
  timestamp: string
  location: string
  state: string
}

export interface VendorRecord {
  id: string
  name: string
  gstin: string
  activeWorks: number
  completedWorks?: number
  totalSanctioned?: string
  totalSanctionedNum?: number
  totalDisbursed: string
  totalDisbursedNum: number
  totalSpent?: string
  totalSpentNum?: number
  flaggedWorksCount: number
  flaggedPercentage: number
  avgProjectValue?: string
  avgProjectValueNum?: number
  primaryAnomaly: string
  riskScore: number
  riskLevel: RiskLevel
  statePresence?: string[]
  networkSignal?: string
  incorporationYear?: string
  registeredState?: string
  consecutiveAwards?: number
  singleBidderRatio?: number
  topConstituency?: string
  topAgency?: string
}

export interface StateAnomalyRecord {
  code: string
  name: string
  latitude: number
  longitude: number
  anomalyRate: number
  flaggedWorks: number
  flaggedCapital: string
  riskLevel: RiskLevel
  discrepancyCr: number
  vendorDensity: number
  duplicateGpsCount: number
}

export interface DashboardKpis {
  totalAllocated: {
    amount: string
    yoy: string
    constituencies: string
    cap: string
    percent: number
  }
  totalSanctioned: {
    amount: string
    percent: number
    works: string
    target: string
  }
  totalDisbursed: {
    amount: string
    percent: number
    unspent: string
    pfms: string
  }
  flaggedProjects: {
    count: number
    worksPercent: string
    capital: string
    newToday: number
    criticalPercent: number
  }
}

export interface FilterState {
  state: string
  district: string
  constituency: string
  mp: string
  category: string
  vendor: string
  agency: string
  riskSeverity: string
  amountRange: string
  projectStatus: string
  financialYear: string
  searchQuery: string
}

export interface ScatterBenchmarkPoint {
  id: string
  workCode: string
  title: string
  sanctionedLakhs: number
  expectedLakhs: number
  variancePercent: number
  riskLevel: RiskLevel
  riskScore: number
  isOutlier: boolean
  outlierLabel?: string
  state: string
}

export interface LifespanStage {
  stageNumber: number
  title: string
  worksCount: number
  worksDisplay: string
  percentage: number
  capitalDisplay: string
  color: string
}

export interface AgingBucket {
  range: string
  count: number
  label: string
  statusType: 'norm' | 'watch' | 'high' | 'crit'
}

export type ClusterAnomalyType =
  | 'Cost Inflation'
  | 'Payment Pattern'
  | 'Duplicate Works'
  | 'Vendor Concentration'
  | 'Completion Delay'
  | 'Procedural Violation'
  | 'Spatial Similarity'

export interface AnomalyCluster {
  id: string
  title: string
  riskLevel: RiskLevel
  riskScore: number
  projectCount: number
  totalExposure: number
  totalExposureDisplay: string
  mainAnomalyType: ClusterAnomalyType
  state: string
  district: string
  constituency?: string
  confidence: number
  detectedTimestamp: string
  description: string
  relatedProjectIds: string[]
}

export interface EvidenceContributor {
  id: string
  title: string
  points: number
  severity: RiskLevel
  explanation: string
}

export interface RiskScoreBreakdown {
  ruleEngine: number
  statisticalEngine: number
  mlEngine: number
  consolidatedScore: number
}

export interface FinancialForensicsData {
  recommendedAmount: number
  recommendedDisplay: string
  sanctionedAmount: number
  sanctionedDisplay: string
  disbursedAmount: number
  disbursedDisplay: string
  spentAmount: number
  spentDisplay: string
  benchmarkAmount: number
  benchmarkDisplay: string
  disbursedPercent: number
  spentVsDisbursedPercent: number
  costVsBenchmarkPercent: number
  discrepancyNote?: string
}

export interface InvestigationTimelineStage {
  stage: 'Recommended' | 'Sanctioned' | 'Disbursed' | 'Physical Progress' | 'Completion'
  date: string
  status: 'completed' | 'in_progress' | 'flagged' | 'delayed' | 'pending'
  amountDisplay?: string
  gapAlert?: string
}

export interface InvestigationNote {
  id: string
  targetId: string
  author: string
  timestamp: string
  content: string
}

export interface InvestigationFilterState {
  state: string
  district: string
  constituency: string
  mp: string
  riskLevel: string
  category: string
  vendor: string
  agency: string
  anomalyType: string
  financialYear: string
  projectStatus: string
  searchQuery: string
}

export interface MpRecord {
  id: string
  name: string
  house: 'LS' | 'RS'
  constituency: string
  constituencyCode: string
  state: string
  district: string
  allocatedAmount: number
  allocatedDisplay: string
  sanctionedAmount: number
  sanctionedDisplay: string
  disbursedAmount: number
  disbursedDisplay: string
  spentAmount: number
  spentDisplay: string
  recommendedAmount: number
  recommendedDisplay: string
  utilizationPercent: number
  projectsCount: number
  flaggedProjectsCount: number
  riskScore: number
  riskLevel: RiskLevel
  primaryRisk: string
  party: string
  term: string
  anomaliesCount: Record<string, number>
  statusBreakdown: {
    recommended: number
    sanctioned: number
    disbursed: number
    completed: number
    stalled: number
  }
  activityByFy: {
    fy: string
    projectsCount: number
    sanctionedAmount: number
  }[]
}

export interface MpFilterState {
  state: string
  district: string
  constituency: string
  mp: string
  financialYear: string
  riskLevel: string
  amountRange: string
  projectStatus: string
  searchQuery: string
}

export interface VendorRiskContributor {
  id: string
  category: string
  title: string
  points: number
  severity: RiskLevel
  explanation: string
}

export interface VendorNetworkNode {
  id: string
  label: string
  type: 'vendor' | 'project' | 'constituency' | 'agency'
  riskLevel?: RiskLevel
  subtitle?: string
}

export interface VendorNetworkLink {
  source: string
  target: string
  label?: string
  isAnomaly?: boolean
}

export interface VendorStateSummary {
  state: string
  projectsCount: number
  disbursedAmount: number
  disbursedDisplay: string
  flaggedCount: number
  flaggedPercentage: number
}

export interface VendorProfile extends VendorRecord {
  completedWorks: number
  totalSanctioned: string
  totalSanctionedNum: number
  totalSpent: string
  totalSpentNum: number
  flaggedCapital: string
  flaggedCapitalNum: number
  avgProjectValue: string
  avgProjectValueNum: number
  states: VendorStateSummary[]
  riskContributors: VendorRiskContributor[]
  disbursementsByFy: {
    fy: string
    disbursedAmount: number
    disbursedDisplay: string
    worksCount: number
  }[]
  concentration: {
    projectSharePercent: number
    agencyConcentrationPercent: number
    constituencyConcentrationPercent: number
    categoryConcentrationPercent: number
    singleBidderRatePercent: number
    consecutiveAwardsCount: number
  }
  anomaliesCount: Record<string, number>
  networkNodes: VendorNetworkNode[]
  networkLinks: VendorNetworkLink[]
}

export interface VendorFilterState {
  state: string
  district: string
  constituency: string
  financialYear: string
  riskLevel: string
  category: string
  agency: string
  projectStatus: string
  activityLevel: string
  searchQuery: string
}

export type VendorSortField =
  | 'riskScore'
  | 'totalDisbursed'
  | 'flaggedPercentage'
  | 'activeWorks'
  | 'avgProjectValue'

export interface AgencyRiskContributor {
  id: string
  category: string
  title: string
  points: number
  severity: RiskLevel
  explanation: string
}

export interface AgencyStateSummary {
  state: string
  projectsCount: number
  disbursedAmount: number
  disbursedDisplay: string
  flaggedCount: number
  flaggedPercentage: number
}

export interface AgencyVendorSummary {
  vendorName: string
  vendorId?: string
  projectsCount: number
  disbursedAmount: number
  disbursedDisplay: string
  flaggedPercentage: number
  riskLevel: RiskLevel
}

export interface AgencyConstituencySummary {
  constituency: string
  state: string
  projectsCount: number
  sanctionedAmount: number
  sanctionedDisplay: string
  disbursedAmount: number
  disbursedDisplay: string
  flaggedPercentage: number
}

export interface AgencyRecord {
  id: string
  name: string
  agencyType: string
  statePresence: string[]
  activeWorks: number
  completedWorks: number
  delayedWorksCount: number
  totalSanctioned: string
  totalSanctionedNum: number
  totalDisbursed: string
  totalDisbursedNum: number
  totalSpent: string
  totalSpentNum: number
  unutilizedAmount: string
  unutilizedAmountNum: number
  flaggedWorksCount: number
  flaggedPercentage: number
  avgProjectValue: string
  avgProjectValueNum: number
  primaryAnomaly: string
  riskScore: number
  riskLevel: RiskLevel
  topVendor?: string
  topConstituency?: string
}

export interface AgencyProfile extends AgencyRecord {
  states: AgencyStateSummary[]
  riskContributors: AgencyRiskContributor[]
  disbursementsByFy: {
    fy: string
    disbursedAmount: number
    disbursedDisplay: string
    worksCount: number
  }[]
  fundFlow: {
    recommendedAmount: number
    recommendedDisplay: string
    sanctionedAmount: number
    sanctionedDisplay: string
    disbursedAmount: number
    disbursedDisplay: string
    spentAmount: number
    spentDisplay: string
    unutilizedAmount: number
    unutilizedDisplay: string
    sanctionedVsRecommendedPercent: number
    disbursedVsSanctionedPercent: number
    spentVsDisbursedPercent: number
  }
  statusBreakdown: {
    recommended: number
    sanctioned: number
    ongoing: number
    completed: number
    stalled: number
    total: number
  }
  anomaliesCount: Record<string, number>
  vendorConcentration: AgencyVendorSummary[]
  constituencyFootprint: AgencyConstituencySummary[]
}

export interface AgencyFilterState {
  state: string
  district: string
  constituency: string
  mp: string
  agencyType: string
  agency: string
  category: string
  riskLevel: string
  financialYear: string
  projectStatus: string
  amountRange: string
  searchQuery: string
}

export type AgencySortField =
  | 'riskScore'
  | 'totalDisbursed'
  | 'flaggedPercentage'
  | 'activeWorks'
  | 'delayedWorks'
  | 'avgProjectValue'

export * from './alerts'
export * from './dataSources'
export * from './cases'
export * from './assistant'
