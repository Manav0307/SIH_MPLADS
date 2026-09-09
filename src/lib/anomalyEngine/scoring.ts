import { ProjectRecord } from '@/types'
import {
  AnomalyFinding,
  AnomalySeverity,
  ProjectRiskAssessment,
  RiskScoreContributor,
} from './types'
import { formatCurrency } from './rules'

const SEVERITY_BASE_POINTS: Record<AnomalySeverity, number> = {
  critical: 35,
  high: 20,
  medium: 10,
  low: 5,
}

export function mapScoreToSeverity(score: number): AnomalySeverity {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}

export function computeProjectRiskScore(
  project: ProjectRecord,
  findings: AnomalyFinding[]
): ProjectRiskAssessment {
  if (findings.length === 0) {
    const nominalScore = Math.min(project.riskScore || 15, 25)
    return {
      projectId: project.id,
      workCode: project.workCode,
      overallScore: nominalScore,
      riskLevel: 'low',
      confidence: 96,
      findings: [],
      scoreContributors: [
        {
          ruleId: 'RULE-NOMINAL-CLEARANCE',
          title: 'Nominal Statutory Compliance',
          points: nominalScore,
          severity: 'low',
          explanation: 'No statutory threshold violations triggered under deterministic audit rules.',
        },
      ],
      totalFinancialExposure: 0,
      exposureDisplay: '₹ 0.00',
      primaryAnomaly: 'None (Nominal)',
    }
  }

  // Calculate granular contributors
  let rawScore = 0
  const contributors: RiskScoreContributor[] = []

  // Sort findings by severity priority
  const severityOrder: Record<AnomalySeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }

  const sortedFindings = [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )

  let cumulativeExposure = 0

  sortedFindings.forEach((finding, index) => {
    const basePoints = SEVERITY_BASE_POINTS[finding.severity]
    // Damping factor for successive rules of same severity
    const damping = index === 0 ? 1.0 : index === 1 ? 0.8 : 0.6
    const points = Math.max(2, Math.round(basePoints * (finding.confidence / 100) * damping))

    rawScore += points
    cumulativeExposure += finding.financialImpact

    contributors.push({
      ruleId: finding.ruleId,
      title: finding.ruleName,
      points,
      severity: finding.severity,
      explanation: finding.explanation,
    })
  })

  // Financial exposure adjustment: if exposure > ₹50 L add +3, if > ₹1 Cr add +6
  if (cumulativeExposure >= 10000000) {
    rawScore += 6
  } else if (cumulativeExposure >= 5000000) {
    rawScore += 3
  }

  // Baseline calibration with project riskScore to ensure alignment
  const targetScore = Math.min(99, Math.max(project.riskScore || 20, Math.min(99, rawScore)))
  const overallScore = Math.min(99, Math.max(15, targetScore))
  const riskLevel = mapScoreToSeverity(overallScore)

  // Average confidence across triggered rules
  const avgConfidence = Math.round(
    findings.reduce((sum, f) => sum + f.confidence, 0) / findings.length
  )

  // Deduplicate and select maximum single financial exposure
  const maxExposure = Math.max(
    ...findings.map((f) => f.financialImpact),
    project.disbursedAmount > 0 ? project.disbursedAmount : project.sanctionedAmount
  )

  const primaryAnomaly =
    sortedFindings[0]?.ruleName || project.primaryAnomaly || 'Unreconciled Audit Finding'

  return {
    projectId: project.id,
    workCode: project.workCode,
    overallScore,
    riskLevel,
    confidence: avgConfidence,
    findings: sortedFindings,
    scoreContributors: contributors,
    totalFinancialExposure: maxExposure,
    exposureDisplay: formatCurrency(maxExposure),
    primaryAnomaly,
  }
}
