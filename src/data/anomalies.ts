import { AnomalyFeedItem } from '@/types'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'

export function getEngineAnomalyFeedItems(): AnomalyFeedItem[] {
  const { findings, assessments } = getDefaultEngineResult()
  const relativeTimes = [
    '2 min ago',
    '7 min ago',
    '14 min ago',
    '26 min ago',
    '42 min ago',
    '1 hr ago',
    '2 hrs ago',
    '3 hrs ago',
    '5 hrs ago',
    '8 hrs ago',
  ]

  return findings.map((f, idx) => {
    const assessment = assessments[f.projectId]
    const score = assessment?.overallScore || (f.severity === 'critical' ? 95 : f.severity === 'high' ? 82 : 60)
    return {
      id: f.anomalyId,
      workId: f.workCode,
      projectId: f.projectId,
      severity: f.severity,
      riskScore: score,
      title: f.ruleName,
      description: f.explanation,
      financialImpact: f.financialImpactDisplay,
      financialImpactNum: f.financialImpact,
      timestamp: relativeTimes[idx % relativeTimes.length],
      location: `${f.district}, ${f.state}`,
      state: f.state,
    }
  })
}

// Single source of truth: mockAnomalies generated directly from the Anomaly Engine
export const mockAnomalies: AnomalyFeedItem[] = getEngineAnomalyFeedItems()
