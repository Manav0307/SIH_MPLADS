import { useState, useEffect } from 'react'
import { mockCases, auditOfficers } from '@/data/cases'
import { mockProjects } from '@/data/projects'
import {
  CaseRecord,
  CaseSeverity,
  CaseAnomalyFinding,
  CaseEvidenceItem,
  CaseTimelineEvent,
  CaseStatusHistory,
  CasePfmsAction,
} from '@/types/cases'
import { ProjectRecord, AnomalyAlert } from '@/types'
import { AnomalyFinding } from '@/lib/anomalyEngine/types'

// In-memory case store initialized with mockCases
let inMemoryCases: CaseRecord[] = [...mockCases]
const listeners = new Set<(cases: CaseRecord[]) => void>()

function notifyListeners() {
  const casesCopy = [...inMemoryCases]
  listeners.forEach((listener) => listener(casesCopy))
}

export function getAllCases(): CaseRecord[] {
  return inMemoryCases
}

export function getCaseById(id: string): CaseRecord | undefined {
  if (!id) return undefined
  const target = id.toLowerCase().trim()
  return inMemoryCases.find(
    (c) =>
      c.id.toLowerCase() === target ||
      c.workCode.toLowerCase() === target ||
      c.projectId.toLowerCase() === target
  )
}

export function findCaseForProject(projectIdOrWorkCode: string): CaseRecord | undefined {
  if (!projectIdOrWorkCode) return undefined
  const target = projectIdOrWorkCode.toLowerCase().trim()
  return inMemoryCases.find(
    (c) =>
      c.projectId.toLowerCase() === target ||
      c.workCode.toLowerCase() === target ||
      c.id.toLowerCase() === target
  )
}

export function updateCase(updatedCase: CaseRecord): void {
  inMemoryCases = inMemoryCases.map((c) => (c.id === updatedCase.id ? updatedCase : c))
  notifyListeners()
}

export interface EscalateInput {
  project?: ProjectRecord | null
  alert?: AnomalyAlert | null
  finding?: AnomalyFinding | null
  workCode?: string
  projectId?: string
  title?: string
  reason?: string
}

/**
 * Escalate an alert, finding, or project into a formal CaseRecord.
 * Reuses existing case if one already exists for the project/workCode;
 * otherwise constructs a new deterministic UI case and registers it.
 */
export function escalateToCase(input: EscalateInput): CaseRecord {
  const workCode =
    input.workCode ||
    input.alert?.workCode ||
    input.finding?.workCode ||
    input.project?.workCode ||
    ''

  const projectId =
    input.projectId ||
    input.project?.id ||
    input.alert?.projectId ||
    input.finding?.projectId ||
    ''

  // 1. Check if a case already exists
  const existing =
    (workCode && findCaseForProject(workCode)) ||
    (projectId && findCaseForProject(projectId))

  if (existing) {
    return existing
  }

  // 2. Resolve or find project record
  const project: ProjectRecord =
    input.project ||
    mockProjects.find((p) => p.workCode === workCode || p.id === projectId) ||
    mockProjects[0]

  // 3. Determine next case sequence ID
  const nextNum = inMemoryCases.length + 1
  const caseId = `CASE-2026-${String(nextNum).padStart(3, '0')}`

  // 4. Derive severity and risk
  const riskScore = input.alert?.riskScore || input.project?.riskScore || project.riskScore || 88
  const severity: CaseSeverity =
    riskScore >= 85 ? 'critical' : riskScore >= 70 ? 'high' : riskScore >= 50 ? 'medium' : 'low'

  const anomalyTitle =
    input.alert?.anomalyType ||
    input.finding?.ruleName ||
    project.primaryAnomaly ||
    'Statutory Audit Variance'

  const anomalyExplanation =
    input.alert?.whyFlagged ||
    input.finding?.explanation ||
    `${project.title} escalated for formal tripartite audit and expenditure cross-examination.`

  const financialImpact =
    input.alert?.financialImpactNum ||
    input.finding?.financialImpact ||
    project.disbursedAmount ||
    project.sanctionedAmount

  const financialImpactDisplay =
    input.alert?.financialImpact ||
    input.finding?.financialImpactDisplay ||
    project.disbursedDisplay ||
    `₹ ${(financialImpact / 100000).toFixed(2)} L`

  // 5. Construct Anomaly Findings
  const anomalies: CaseAnomalyFinding[] = [
    {
      id: `anom-${caseId}-1`,
      ruleId: input.finding?.ruleId || 'RULE-STATUTORY-ESC',
      title: anomalyTitle,
      category: input.finding?.category || 'financial',
      severity,
      explanation: anomalyExplanation,
      financialImpact,
      financialImpactDisplay,
      confidence: input.finding?.confidence || 95.8,
    },
  ]

  // 6. Construct Evidence Items
  const evidence: CaseEvidenceItem[] = [
    {
      id: `ev-${caseId}-1`,
      title: `Escalation Audit Directive (#${caseId})`,
      source: 'National Anomaly Intelligence Engine & SOC Dispatch',
      sourceType: 'audit_doc',
      timestamp: 'Today 15:30 IST',
      verificationStatus: 'Verified',
      verifiedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
      verifiedAt: 'Today 15:30 IST',
      previewType: 'document',
      fileSize: '1.2 MB Encrypted Audit Memorandum',
      hash: `SHA256:e9c${(nextNum * 37 + 11).toString(16).padStart(6, '0')}41b9`,
      notes: input.reason || `Formal statutory case opened via anomaly escalation.`,
    },
    {
      id: `ev-${caseId}-2`,
      title: `PFMS Disbursal Ledger & Stage Gate Audit Log`,
      source: 'Public Financial Management System (PFMS API)',
      sourceType: 'ledger',
      timestamp: '08 Sep 2026 11:20 IST',
      verificationStatus: 'Pending Review',
      previewType: 'ledger',
      fileSize: '650 KB Electronic XML',
      hash: `SHA256:7b${(nextNum * 49 + 23).toString(16).padStart(6, '0')}88cd`,
      notes: `Direct electronic transfer verification records.`,
    },
  ]

  // 7. Construct Timeline & History
  const timeline: CaseTimelineEvent[] = [
    {
      id: `tl-${caseId}-1`,
      date: '09 Sep 2026',
      timestamp: 'Today 15:30 IST',
      title: 'Formal Case Escalation Initiated',
      description: input.reason || `Escalated from Anomaly / Alert queue by Principal Auditor.`,
      type: 'escalation',
      actor: 'Sovereign Audit Command',
      badgeColor: 'text-[#EF4444]',
    },
  ]

  const statusHistory: CaseStatusHistory[] = [
    {
      id: `sh-${caseId}-1`,
      fromStatus: 'New',
      toStatus: 'New',
      changedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
      timestamp: 'Today 15:30 IST',
      remarks: `Case officially registered into sovereign audit queue.`,
    },
  ]

  const pfmsAction: CasePfmsAction = {
    hasAction: severity === 'critical',
    actionType: severity === 'critical' ? 'Stop-Payment Hold (Full Freeze)' : 'None',
    amount: financialImpact,
    amountDisplay: financialImpactDisplay,
    reason: `Automatic stop-payment safeguard triggered upon case escalation.`,
    status: severity === 'critical' ? 'Active Stop-Payment' : 'Normal',
  }

  // 8. Construct CaseRecord
  const newCase: CaseRecord = {
    id: caseId,
    workCode: project.workCode,
    projectId: project.id,
    projectTitle: project.title,
    severity,
    riskScore,
    anomalyCount: 1,
    project,
    vendor: project.vendor,
    vendorGst: project.vendorGst || '27AABCU9603R1ZM',
    agency: project.agency,
    financialExposure: financialImpact,
    financialExposureDisplay: financialImpactDisplay,
    assignedOfficer: auditOfficers[0], // Dr. Rajeshwar Rao
    status: 'New',
    lastUpdated: 'Just now',
    createdDate: '09 Sep 2026',
    state: project.state,
    district: project.district,
    constituency: project.constituency,
    mpName: project.mpName,
    mpHouse: project.mpHouse,
    category: project.category,
    summary: `${project.title} in ${project.district}, ${project.state} flagged for ${anomalyTitle}. Financial exposure: ${financialImpactDisplay}.`,
    anomalies,
    evidence,
    timeline,
    notes: [
      {
        id: `note-${caseId}-1`,
        targetId: project.id,
        author: 'Dr. Rajeshwar Rao, IA&AS',
        timestamp: 'Just now',
        content: `Statutory case established based on anomaly trigger. Recommended immediate site verification and PFMS tranche reconciliation.`,
      },
    ],
    statusHistory,
    pfmsAction,
  }

  // 9. Register into in-memory store
  inMemoryCases = [newCase, ...inMemoryCases]
  notifyListeners()

  return newCase
}

/**
 * React hook to consume reactive case registry
 */
export function useCaseRegistry() {
  const [cases, setCases] = useState<CaseRecord[]>(() => [...inMemoryCases])

  useEffect(() => {
    const handleUpdate = (updatedCases: CaseRecord[]) => {
      setCases([...updatedCases])
    }
    listeners.add(handleUpdate)
    return () => {
      listeners.delete(handleUpdate)
    }
  }, [])

  return {
    cases,
    getCaseById,
    findCaseForProject,
    escalateToCase,
    updateCase,
  }
}
