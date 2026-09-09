/**
 * ⚠️  DEMONSTRATION DATA ONLY
 * All metrics below are mock/simulated values for UI demonstration purposes.
 * These do NOT represent real production model measurements.
 * Source: Simulated outputs representative of the MPLADS IsolationForest + LightGBM ML repository.
 */

export const DEMO_DISCLAIMER =
  '⚠️ DEMONSTRATION METRICS — Simulated values for UI validation only. Not real production measurements.'

// ---------------------------------------------------------------------------
// Model Overview
// ---------------------------------------------------------------------------
export const mockModelOverview = {
  modelName: 'MPLADS-AnomalyNet',
  version: 'v3.2.1',
  modelType: 'Ensemble: IsolationForest + LightGBM',
  status: 'healthy' as const,
  lastEvaluation: '2026-09-09T08:00:00Z',
  lastEvaluationDisplay: '09 Sep 2026, 08:00 IST',
  datasetVersion: 'MPLADS-DS-2026-Q2 (v4.1)',
  predictionVolume: 18742,
  predictionVolumeDisplay: '18,742 / day',
  currentHealthScore: 94,
  inferenceLatency: '42ms (p95)',
  deploymentEnv: 'Sovereign Audit Cloud — Zone IN-DEL-1',
  trainedOn: '2026-07-15',
  notes: 'Re-trained after FY2025-26 data ingestion cycle.',
}

// ---------------------------------------------------------------------------
// Performance Metrics
// ---------------------------------------------------------------------------
export const mockPerformanceMetrics = {
  precision: 0.871,
  recall: 0.839,
  f1Score: 0.855,
  rocAuc: 0.923,
  falsePositiveRate: 0.062,
  falseNegativeRate: 0.161,
  accuracy: 0.906,
  matthewsCc: 0.784,
  prAuc: 0.891,
  thresholds: {
    precision: 0.85,
    recall: 0.80,
    f1Score: 0.82,
    rocAuc: 0.90,
    falsePositiveRate: 0.10,
    falseNegativeRate: 0.20,
  },
}

// ---------------------------------------------------------------------------
// Risk Score Distribution
// ---------------------------------------------------------------------------
export interface RiskDistributionBucket {
  label: 'Critical' | 'High' | 'Medium' | 'Low'
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  color: string
  bgColor: string
  borderColor: string
}

export const mockRiskDistribution: RiskDistributionBucket[] = [
  { label: 'Critical', count: 1247, percentage: 6.7, trend: 'up', trendValue: '+3.2%', color: '#EF4444', bgColor: '#401515', borderColor: '#EF444440' },
  { label: 'High', count: 3821, percentage: 20.4, trend: 'down', trendValue: '-1.8%', color: '#F59E0B', bgColor: '#3A2A0C', borderColor: '#F59E0B40' },
  { label: 'Medium', count: 5934, percentage: 31.7, trend: 'stable', trendValue: '+0.4%', color: '#EAB308', bgColor: '#362E0C', borderColor: '#EAB30840' },
  { label: 'Low', count: 7740, percentage: 41.3, trend: 'down', trendValue: '-1.8%', color: '#22C55E', bgColor: '#0F3020', borderColor: '#22C55E40' },
]

// ---------------------------------------------------------------------------
// Precision/Recall Trend
// ---------------------------------------------------------------------------
export interface PrTrendPoint {
  cycle: string
  precision: number
  recall: number
  f1: number
  rocAuc: number
}

export const mockPrTrend: PrTrendPoint[] = [
  { cycle: 'Aug-01', precision: 0.841, recall: 0.812, f1: 0.826, rocAuc: 0.901 },
  { cycle: 'Aug-08', precision: 0.849, recall: 0.820, f1: 0.834, rocAuc: 0.908 },
  { cycle: 'Aug-15', precision: 0.855, recall: 0.827, f1: 0.841, rocAuc: 0.912 },
  { cycle: 'Aug-22', precision: 0.860, recall: 0.831, f1: 0.845, rocAuc: 0.914 },
  { cycle: 'Aug-29', precision: 0.858, recall: 0.833, f1: 0.845, rocAuc: 0.916 },
  { cycle: 'Sep-05', precision: 0.864, recall: 0.836, f1: 0.850, rocAuc: 0.919 },
  { cycle: 'Sep-09', precision: 0.871, recall: 0.839, f1: 0.855, rocAuc: 0.923 },
]

// ---------------------------------------------------------------------------
// Score Histogram
// ---------------------------------------------------------------------------
export interface ScoreHistogramBin {
  bin: string
  count: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export const mockScoreHistogram: ScoreHistogramBin[] = [
  { bin: '0-10', count: 1820, riskLevel: 'low' },
  { bin: '10-20', count: 2341, riskLevel: 'low' },
  { bin: '20-30', count: 1987, riskLevel: 'low' },
  { bin: '30-40', count: 1592, riskLevel: 'low' },
  { bin: '40-50', count: 2198, riskLevel: 'medium' },
  { bin: '50-60', count: 1834, riskLevel: 'medium' },
  { bin: '60-70', count: 1902, riskLevel: 'medium' },
  { bin: '70-80', count: 1921, riskLevel: 'high' },
  { bin: '80-90', count: 1900, riskLevel: 'high' },
  { bin: '90-100', count: 1247, riskLevel: 'critical' },
]

// ---------------------------------------------------------------------------
// Confusion Matrix
// ---------------------------------------------------------------------------
export const mockConfusionMatrix = {
  truePositive: 3104,
  falsePositive: 203,
  falseNegative: 594,
  trueNegative: 14841,
  total: 18742,
}

// ---------------------------------------------------------------------------
// Threshold Comparison
// ---------------------------------------------------------------------------
export interface ThresholdPoint {
  threshold: number
  precision: number
  recall: number
  f1: number
  fpr: number
}

export const mockThresholdComparison: ThresholdPoint[] = [
  { threshold: 0.3, precision: 0.712, recall: 0.951, f1: 0.815, fpr: 0.168 },
  { threshold: 0.4, precision: 0.763, recall: 0.912, f1: 0.831, fpr: 0.132 },
  { threshold: 0.45, precision: 0.804, recall: 0.882, f1: 0.841, fpr: 0.109 },
  { threshold: 0.5, precision: 0.841, recall: 0.862, f1: 0.851, fpr: 0.088 },
  { threshold: 0.55, precision: 0.871, recall: 0.839, f1: 0.855, fpr: 0.062 },
  { threshold: 0.6, precision: 0.893, recall: 0.808, f1: 0.848, fpr: 0.044 },
  { threshold: 0.65, precision: 0.912, recall: 0.775, f1: 0.838, fpr: 0.031 },
  { threshold: 0.7, precision: 0.931, recall: 0.728, f1: 0.817, fpr: 0.020 },
]
export const mockCurrentThreshold = 0.55

// ---------------------------------------------------------------------------
// Feature Importance
// ---------------------------------------------------------------------------
export interface FeatureImportanceRecord {
  id: string
  featureName: string
  importance: number
  direction: 'increases_risk' | 'decreases_risk' | 'neutral'
  impactLabel: string
  description: string
  category: 'financial' | 'temporal' | 'vendor' | 'procedural' | 'spatial'
}

export const mockFeatureImportance: FeatureImportanceRecord[] = [
  { id: 'fi-001', featureName: 'cost_variance_pct', importance: 0.184, direction: 'increases_risk', impactLabel: '↑ High Risk', description: 'Percentage deviation of sanctioned cost vs district benchmark. High variance signals potential inflation.', category: 'financial' },
  { id: 'fi-002', featureName: 'vendor_concentration_score', importance: 0.162, direction: 'increases_risk', impactLabel: '↑ High Risk', description: 'Normalized score of vendor project share within a constituency. High concentration implies collusion risk.', category: 'vendor' },
  { id: 'fi-003', featureName: 'time_to_disburse_days', importance: 0.141, direction: 'increases_risk', impactLabel: '↑ Moderate Risk', description: 'Calendar days from recommendation to first disbursement. Outlier delays correlate with procedural violations.', category: 'temporal' },
  { id: 'fi-004', featureName: 'single_bidder_flag', importance: 0.128, direction: 'increases_risk', impactLabel: '↑ High Risk', description: 'Binary flag indicating single-bidder tender. Strong predictor of vendor cartel or fronting behavior.', category: 'procedural' },
  { id: 'fi-005', featureName: 'gps_cluster_density', importance: 0.109, direction: 'increases_risk', impactLabel: '↑ Moderate Risk', description: 'Density of co-located work-site GPS coordinates. High density suggests spatial duplication.', category: 'spatial' },
  { id: 'fi-006', featureName: 'utilization_rate', importance: 0.094, direction: 'decreases_risk', impactLabel: '↓ Reduces Risk', description: 'Ratio of spent to disbursed amount. Higher utilization correlates with genuine project execution.', category: 'financial' },
  { id: 'fi-007', featureName: 'agency_delay_rate', importance: 0.087, direction: 'increases_risk', impactLabel: '↑ Moderate Risk', description: 'Historical delay rate of the implementing agency. Past delays predict future non-compliance.', category: 'temporal' },
  { id: 'fi-008', featureName: 'consecutive_awards_count', importance: 0.072, direction: 'increases_risk', impactLabel: '↑ Moderate Risk', description: 'Number of consecutive awards to same vendor in same constituency without re-tendering.', category: 'vendor' },
  { id: 'fi-009', featureName: 'physical_progress_delta', importance: 0.061, direction: 'decreases_risk', impactLabel: '↓ Reduces Risk', description: 'Difference between financial disbursement and physical progress percentage. Higher delta signals ghost work.', category: 'financial' },
  { id: 'fi-010', featureName: 'recommendation_gap_days', importance: 0.041, direction: 'increases_risk', impactLabel: '↑ Low Risk', description: 'Gap between CAG recommendation and sanction. Prolonged gaps can indicate procedural avoidance.', category: 'procedural' },
]

// ---------------------------------------------------------------------------
// Drift Monitoring
// ---------------------------------------------------------------------------
export type DriftStatus = 'nominal' | 'warning' | 'drift_detected' | 'critical'

export interface DriftFeature {
  id: string
  feature: string
  psi: number
  ksStatistic: number
  status: DriftStatus
  lastChecked: string
  trend: 'stable' | 'increasing' | 'decreasing'
}

export const mockFeatureDrift: DriftFeature[] = [
  { id: 'fd-001', feature: 'cost_variance_pct', psi: 0.089, ksStatistic: 0.072, status: 'warning', lastChecked: '09 Sep 2026', trend: 'increasing' },
  { id: 'fd-002', feature: 'vendor_concentration_score', psi: 0.041, ksStatistic: 0.038, status: 'nominal', lastChecked: '09 Sep 2026', trend: 'stable' },
  { id: 'fd-003', feature: 'time_to_disburse_days', psi: 0.031, ksStatistic: 0.029, status: 'nominal', lastChecked: '09 Sep 2026', trend: 'stable' },
  { id: 'fd-004', feature: 'single_bidder_flag', psi: 0.019, ksStatistic: 0.021, status: 'nominal', lastChecked: '09 Sep 2026', trend: 'stable' },
  { id: 'fd-005', feature: 'gps_cluster_density', psi: 0.124, ksStatistic: 0.118, status: 'drift_detected', lastChecked: '09 Sep 2026', trend: 'increasing' },
  { id: 'fd-006', feature: 'utilization_rate', psi: 0.052, ksStatistic: 0.049, status: 'nominal', lastChecked: '09 Sep 2026', trend: 'stable' },
  { id: 'fd-007', feature: 'agency_delay_rate', psi: 0.198, ksStatistic: 0.187, status: 'critical', lastChecked: '09 Sep 2026', trend: 'increasing' },
  { id: 'fd-008', feature: 'physical_progress_delta', psi: 0.068, ksStatistic: 0.061, status: 'warning', lastChecked: '09 Sep 2026', trend: 'increasing' },
]

export const mockPredictionDrift = {
  psi: 0.073,
  ksStatistic: 0.062,
  status: 'warning' as DriftStatus,
  meanShift: '+0.031',
  varianceShift: '+0.008',
  description: 'Prediction score distribution shows moderate upward shift. Likely attributable to Q2 FY2026-27 procurement surge.',
}

export const mockDataQualityDrift = {
  missingValueRate: 2.1,
  schemaMismatchRate: 0.0,
  outlierRate: 4.8,
  status: 'nominal' as DriftStatus,
  description: 'Data quality within acceptable thresholds. Outlier rate slightly elevated from recent bulk ETL.',
}

export interface DriftTimelineEvent {
  date: string
  type: 'feature_drift' | 'prediction_drift' | 'quality_alert' | 'retraining' | 'threshold_change'
  severity: 'info' | 'warning' | 'critical'
  message: string
}

export const mockDriftTimeline: DriftTimelineEvent[] = [
  { date: '09 Sep 2026', type: 'feature_drift', severity: 'critical', message: 'agency_delay_rate PSI exceeded critical threshold (0.198 > 0.15)' },
  { date: '07 Sep 2026', type: 'feature_drift', severity: 'warning', message: 'gps_cluster_density drift detected (PSI: 0.124)' },
  { date: '05 Sep 2026', type: 'prediction_drift', severity: 'warning', message: 'Prediction score distribution shift detected (PSI: 0.073)' },
  { date: '01 Sep 2026', type: 'retraining', severity: 'info', message: 'Scheduled model evaluation cycle completed. F1 improved from 0.848 to 0.855.' },
  { date: '25 Aug 2026', type: 'threshold_change', severity: 'info', message: 'Decision threshold adjusted from 0.50 to 0.55 based on operational feedback.' },
  { date: '15 Aug 2026', type: 'quality_alert', severity: 'warning', message: 'Bulk ETL ingestion from Q2 procurement data caused transient outlier spike (6.1%).' },
  { date: '10 Aug 2026', type: 'retraining', severity: 'info', message: 'Feature set v4.1 activated. Added physical_progress_delta and gps_cluster_density.' },
]

// ---------------------------------------------------------------------------
// Governance / Explainability
// ---------------------------------------------------------------------------
export const mockGovernanceRecord = {
  modelVersion: 'v3.2.1',
  previousVersion: 'v3.1.8',
  trainingDataRef: 'MPLADS-DS-2026-Q2 (v4.1) — 847,291 project records, FY2019-2026',
  featureSetVersion: 'FS-v4.1 (10 features)',
  explainabilityStatus: 'SHAP Values Active',
  explainabilityMethod: 'SHAP TreeExplainer + LIME local explanations',
  humanReviewRequired: true,
  humanReviewThreshold: 'Risk Score >= 85 / Critical anomaly label',
  auditability: 'Full Audit Trail Active',
  auditTrailVersion: 'AT-v2.3',
  modelOwner: 'CAG Analytics Division — ML Team',
  complianceFramework: 'CAG / MoF AI Governance Policy 2025',
  approvedBy: 'Dr. Rajeshwar Rao, IA&AS — Principal Auditor General',
  approvedOn: '2026-07-20',
  nextScheduledReview: '2026-12-01',
  dataRetentionPolicy: '7 years (per RTI Act, 2005)',
  encryptionStandard: 'AES-256 at rest, TLS 1.3 in transit',
}

// ---------------------------------------------------------------------------
// Fairness / Constituency Monitoring
// ---------------------------------------------------------------------------
export interface FairnessSegment {
  id: string
  segmentType: 'state' | 'constituency' | 'agency' | 'category'
  label: string
  predictionVolume: number
  flagRate: number
  avgRiskScore: number
  falsePositiveRate: number
  falseNegativeRate: number
  status: 'equitable' | 'over_flagged' | 'under_flagged'
}

export const mockStatesFairness: FairnessSegment[] = [
  { id: 'fs-mh', segmentType: 'state', label: 'Maharashtra', predictionVolume: 2841, flagRate: 34.2, avgRiskScore: 61, falsePositiveRate: 0.054, falseNegativeRate: 0.147, status: 'equitable' },
  { id: 'fs-up', segmentType: 'state', label: 'Uttar Pradesh', predictionVolume: 4217, flagRate: 41.8, avgRiskScore: 68, falsePositiveRate: 0.072, falseNegativeRate: 0.192, status: 'over_flagged' },
  { id: 'fs-rj', segmentType: 'state', label: 'Rajasthan', predictionVolume: 1923, flagRate: 28.6, avgRiskScore: 54, falsePositiveRate: 0.048, falseNegativeRate: 0.128, status: 'equitable' },
  { id: 'fs-mp', segmentType: 'state', label: 'Madhya Pradesh', predictionVolume: 2104, flagRate: 37.1, avgRiskScore: 63, falsePositiveRate: 0.061, falseNegativeRate: 0.168, status: 'equitable' },
  { id: 'fs-tn', segmentType: 'state', label: 'Tamil Nadu', predictionVolume: 1847, flagRate: 21.3, avgRiskScore: 42, falsePositiveRate: 0.039, falseNegativeRate: 0.094, status: 'under_flagged' },
  { id: 'fs-wb', segmentType: 'state', label: 'West Bengal', predictionVolume: 1621, flagRate: 38.9, avgRiskScore: 65, falsePositiveRate: 0.068, falseNegativeRate: 0.178, status: 'equitable' },
  { id: 'fs-ka', segmentType: 'state', label: 'Karnataka', predictionVolume: 1384, flagRate: 24.7, avgRiskScore: 48, falsePositiveRate: 0.041, falseNegativeRate: 0.112, status: 'equitable' },
  { id: 'fs-gj', segmentType: 'state', label: 'Gujarat', predictionVolume: 1204, flagRate: 19.8, avgRiskScore: 38, falsePositiveRate: 0.035, falseNegativeRate: 0.086, status: 'equitable' },
]

export const mockCategoryFairness: FairnessSegment[] = [
  { id: 'fc-rd', segmentType: 'category', label: 'Roads & Bridges', predictionVolume: 5821, flagRate: 38.4, avgRiskScore: 64, falsePositiveRate: 0.069, falseNegativeRate: 0.178, status: 'over_flagged' },
  { id: 'fc-ed', segmentType: 'category', label: 'Education', predictionVolume: 3102, flagRate: 22.1, avgRiskScore: 44, falsePositiveRate: 0.041, falseNegativeRate: 0.108, status: 'equitable' },
  { id: 'fc-hw', segmentType: 'category', label: 'Health & Welfare', predictionVolume: 2847, flagRate: 26.8, avgRiskScore: 51, falsePositiveRate: 0.049, falseNegativeRate: 0.131, status: 'equitable' },
  { id: 'fc-dw', segmentType: 'category', label: 'Drinking Water', predictionVolume: 2204, flagRate: 31.2, avgRiskScore: 58, falsePositiveRate: 0.057, falseNegativeRate: 0.154, status: 'equitable' },
  { id: 'fc-ir', segmentType: 'category', label: 'Irrigation', predictionVolume: 1847, flagRate: 28.7, avgRiskScore: 53, falsePositiveRate: 0.053, falseNegativeRate: 0.142, status: 'equitable' },
  { id: 'fc-sc', segmentType: 'category', label: 'Sanitation', predictionVolume: 1621, flagRate: 18.4, avgRiskScore: 36, falsePositiveRate: 0.031, falseNegativeRate: 0.077, status: 'under_flagged' },
  { id: 'fc-sp', segmentType: 'category', label: 'Sports & Culture', predictionVolume: 1300, flagRate: 24.6, avgRiskScore: 47, falsePositiveRate: 0.044, falseNegativeRate: 0.118, status: 'equitable' },
]

// ---------------------------------------------------------------------------
// Model Alerts
// ---------------------------------------------------------------------------
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved'

export interface ModelAlert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  detectedAt: string
  status: AlertStatus
  actionRequired: boolean
  category: 'drift' | 'performance' | 'data_quality' | 'governance' | 'system'
  resolvedAt?: string
  ackBy?: string
}

export const mockModelAlerts: ModelAlert[] = [
  {
    id: 'MA-2026-001',
    severity: 'critical',
    title: 'Feature Drift: agency_delay_rate (PSI 0.198)',
    description: 'agency_delay_rate has exceeded the critical PSI threshold of 0.15. Indicates significant distribution shift in implementing agency delay patterns, likely due to Q2 2026-27 budget revision. Recommend immediate feature investigation and potential retraining.',
    detectedAt: '2026-09-09T06:18:00Z',
    status: 'active',
    actionRequired: true,
    category: 'drift',
  },
  {
    id: 'MA-2026-002',
    severity: 'high',
    title: 'Feature Drift: gps_cluster_density (PSI 0.124)',
    description: 'gps_cluster_density Population Stability Index has crossed the warning threshold (0.10). Possible change in field data collection quality or regional project clustering patterns.',
    detectedAt: '2026-09-07T10:42:00Z',
    status: 'active',
    actionRequired: true,
    category: 'drift',
  },
  {
    id: 'MA-2026-003',
    severity: 'high',
    title: 'Prediction Drift: Score Distribution Shift',
    description: 'Global prediction score distribution has shifted upward (PSI: 0.073). Mean score increased from 0.489 to 0.520. May require threshold recalibration if operational FPR exceeds 8%.',
    detectedAt: '2026-09-05T14:00:00Z',
    status: 'acknowledged',
    actionRequired: false,
    category: 'drift',
    ackBy: 'Dr. Rajeshwar Rao, IA&AS',
  },
  {
    id: 'MA-2026-004',
    severity: 'medium',
    title: 'Fairness Alert: Uttar Pradesh Over-flagging (41.8%)',
    description: 'UP constituency flag rate (41.8%) is 7.6% above national average (34.2%). False Positive Rate for UP (0.072) exceeds system threshold. Review recommended.',
    detectedAt: '2026-09-05T08:00:00Z',
    status: 'acknowledged',
    actionRequired: false,
    category: 'governance',
    ackBy: 'Compliance Review Team',
  },
  {
    id: 'MA-2026-005',
    severity: 'medium',
    title: 'Data Quality: Elevated Outlier Rate (4.8%)',
    description: 'Input data outlier rate (4.8%) slightly above the nominal ceiling (4.0%). Attributable to bulk Q2 ETL ingestion from 3 state procurement portals. Within acceptable range; monitor for sustained elevation.',
    detectedAt: '2026-08-15T20:30:00Z',
    status: 'resolved',
    actionRequired: false,
    category: 'data_quality',
    resolvedAt: '2026-08-17T09:00:00Z',
  },
  {
    id: 'MA-2026-006',
    severity: 'info',
    title: 'New Model Version Available: v3.3.0-rc1',
    description: 'Release candidate v3.3.0 is available in the model registry. Includes improved GPS clustering feature engineering and updated agency delay normalization. Requires CAG approval before promotion to production.',
    detectedAt: '2026-09-08T12:00:00Z',
    status: 'active',
    actionRequired: true,
    category: 'governance',
  },
  {
    id: 'MA-2026-007',
    severity: 'info',
    title: 'Threshold Change Logged: 0.50 to 0.55',
    description: 'Decision threshold adjusted from 0.50 to 0.55 on 2026-08-25 based on operational feedback from audit teams. Change approved by Dr. Rao. F1 score maintained at 0.855.',
    detectedAt: '2026-08-25T11:00:00Z',
    status: 'resolved',
    actionRequired: false,
    category: 'governance',
    resolvedAt: '2026-08-25T11:00:00Z',
  },
]
