import { ProjectRecord } from '@/types'

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export type AlertStatus = 'New' | 'Under Review' | 'Escalated' | 'Resolved'

export interface AnomalyAlert {
  id: string
  workCode: string
  projectId: string
  projectTitle: string
  severity: AlertSeverity
  anomalyType: string
  riskScore: number
  financialImpact: string
  financialImpactNum: number
  state: string
  district: string
  constituency: string
  mpName: string
  agency: string
  vendor: string
  vendorGst?: string
  status: AlertStatus
  createdTime: string
  createdDate: string
  financialYear: string
  whyFlagged: string
  recommendedAction: string
  recommendedActionsList: { id: string; label: string; checked: boolean }[]
  notesCount: number
  escalatedTo?: string
  escalatedDate?: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
  project?: ProjectRecord
}

export interface AlertFilterState {
  state: string
  district: string
  constituency: string
  mp: string
  agency: string
  vendor: string
  riskSeverity: string
  anomalyType: string
  status: string
  financialYear: string
  searchQuery: string
}

export type AlertSortField = 'riskScore' | 'financialImpact' | 'createdTime' | 'severity' | 'status' | 'id'

export interface AlertSummaryKpis {
  totalAlerts: number
  activeCount: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  newCount: number
  underReviewCount: number
  escalatedCount: number
  resolvedCount: number
  totalExposureLakhs: number
  totalExposureDisplay: string
}
