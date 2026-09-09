import { ProjectRecord, InvestigationNote } from '@/types'

export type CaseSeverity = 'critical' | 'high' | 'medium' | 'low'

export type CaseStatus = 'New' | 'Under Review' | 'Field Verification' | 'Escalated' | 'Resolved'

export interface CaseOfficer {
  id: string
  name: string
  designation: string
  department: string
  badge: string
  avatar?: string
  contactEmail?: string
}

export interface CaseAnomalyFinding {
  id: string
  ruleId: string
  title: string
  category: string
  severity: CaseSeverity
  explanation: string
  financialImpact: number
  financialImpactDisplay: string
  confidence: number
}

export interface CaseEvidenceItem {
  id: string
  title: string
  source: string
  sourceType: 'satellite' | 'ledger' | 'tender' | 'field_photo' | 'measurement_book' | 'audit_doc'
  timestamp: string
  verificationStatus: 'Verified' | 'Pending Review' | 'Disputed' | 'Unverified'
  verifiedBy?: string
  verifiedAt?: string
  url?: string
  previewType: 'image' | 'document' | 'ledger'
  previewThumbnail?: string
  fileSize?: string
  hash: string
  coordinates?: {
    lat: number
    lng: number
  }
  notes?: string
}

export interface CaseTimelineEvent {
  id: string
  date: string
  timestamp: string
  title: string
  description: string
  type: 'system' | 'officer' | 'field' | 'pfms' | 'escalation' | 'resolution'
  actor: string
  badgeColor?: string
}

export interface CaseStatusHistory {
  id: string
  fromStatus: CaseStatus
  toStatus: CaseStatus
  changedBy: string
  timestamp: string
  remarks: string
}

export interface CasePfmsAction {
  hasAction: boolean
  actionType:
    | 'Stop-Payment Hold (Full Freeze)'
    | 'Tranche Delay Pending Field Verification'
    | 'Escrow Account Audit Hold'
    | 'Release Stop-Payment Hold'
    | 'None'
  orderNumber?: string
  amount: number
  amountDisplay: string
  reason: string
  authorizedBy?: string
  timestamp?: string
  status: 'Active Stop-Payment' | 'Pending Verification' | 'Released' | 'Normal'
  supportingEvidence?: string[]
}

export interface CaseRecord {
  id: string
  workCode: string
  projectId: string
  projectTitle: string
  severity: CaseSeverity
  riskScore: number
  anomalyCount: number
  project: ProjectRecord
  vendor: string
  vendorGst: string
  agency: string
  financialExposure: number
  financialExposureDisplay: string
  assignedOfficer: CaseOfficer
  status: CaseStatus
  lastUpdated: string
  createdDate: string
  state: string
  district: string
  constituency: string
  mpName: string
  mpHouse: 'LS' | 'RS'
  category: string
  summary: string
  anomalies: CaseAnomalyFinding[]
  evidence: CaseEvidenceItem[]
  timeline: CaseTimelineEvent[]
  notes: InvestigationNote[]
  statusHistory: CaseStatusHistory[]
  pfmsAction: CasePfmsAction
}

export interface CaseFilterState {
  searchQuery: string
  status: string
  severity: string
  officer: string
  state: string
  district: string
  anomalyType: string
}

export type CaseSortField =
  | 'riskScore'
  | 'financialExposure'
  | 'lastUpdated'
  | 'anomalyCount'
  | 'id'

export interface CaseSummaryKpis {
  openCases: number
  criticalCases: number
  underFieldVerification: number
  escalated: number
  resolved: number
  totalFinancialExposure: number
  totalFinancialExposureDisplay: string
}
