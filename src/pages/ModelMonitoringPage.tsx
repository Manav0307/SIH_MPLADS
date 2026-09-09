import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from 'recharts'
import {
  Cpu,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Eye,
  Database,
  BarChart2,
  FlaskConical,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Bell,
  CheckCheck,
  Clock,
  Layers,
  Scale,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'
import {
  DEMO_DISCLAIMER,
  mockModelOverview,
  mockPerformanceMetrics,
  mockRiskDistribution,
  mockPrTrend,
  mockScoreHistogram,
  mockConfusionMatrix,
  mockThresholdComparison,
  mockCurrentThreshold,
  mockFeatureImportance,
  mockFeatureDrift,
  mockPredictionDrift,
  mockDataQualityDrift,
  mockDriftTimeline,
  mockGovernanceRecord,
  mockStatesFairness,
  mockCategoryFairness,
  mockModelAlerts,
  type DriftStatus,
  type AlertSeverity,
  type AlertStatus,
} from '@/data/modelMonitoring'

const pct = (v: number) => `${(v * 100).toFixed(1)}%`
const fmtPsi = (v: number) => v.toFixed(3)

const histogramColor = (level: string) => {
  if (level === 'critical') return '#EF4444'
  if (level === 'high') return '#F59E0B'
  if (level === 'medium') return '#EAB308'
  return '#22C55E'
}

const driftStatusStyle = (s: DriftStatus) => {
  if (s === 'critical') return { text: '#EF4444', bg: '#401515', border: '#EF444440', label: 'CRITICAL' }
  if (s === 'drift_detected') return { text: '#F59E0B', bg: '#3A2A0C', border: '#F59E0B40', label: 'DRIFT' }
  if (s === 'warning') return { text: '#EAB308', bg: '#362E0C', border: '#EAB30840', label: 'WARNING' }
  return { text: '#22C55E', bg: '#0F3020', border: '#22C55E40', label: 'NOMINAL' }
}

const alertSeverityStyle = (s: AlertSeverity) => {
  if (s === 'critical') return { text: '#EF4444', bg: '#401515', border: '#EF444440' }
  if (s === 'high') return { text: '#F59E0B', bg: '#3A2A0C', border: '#F59E0B40' }
  if (s === 'medium') return { text: '#EAB308', bg: '#362E0C', border: '#EAB30840' }
  return { text: '#3B82F6', bg: '#10233F', border: '#3B82F640' }
}

const alertStatusStyle = (s: AlertStatus) => {
  if (s === 'active') return { text: '#EF4444', bg: '#401515', border: '#EF444440', label: 'ACTIVE' }
  if (s === 'acknowledged') return { text: '#EAB308', bg: '#362E0C', border: '#EAB30840', label: 'ACK' }
  return { text: '#22C55E', bg: '#0F3020', border: '#22C55E40', label: 'RESOLVED' }
}

const fairnessStatusStyle = (s: string) => {
  if (s === 'over_flagged') return { text: '#F59E0B', bg: '#3A2A0C', border: '#F59E0B40', label: 'OVER-FLAGGED' }
  if (s === 'under_flagged') return { text: '#3B82F6', bg: '#10233F', border: '#3B82F640', label: 'UNDER-FLAGGED' }
  return { text: '#22C55E', bg: '#0F3020', border: '#22C55E40', label: 'EQUITABLE' }
}

const categoryColor = (cat: string) => {
  if (cat === 'financial') return '#3B82F6'
  if (cat === 'temporal') return '#EAB308'
  if (cat === 'vendor') return '#F59E0B'
  if (cat === 'procedural') return '#EF4444'
  return '#22C55E'
}

interface ChartTipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

const ChartTooltip: React.FC<ChartTipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded p-2 font-mono text-[11px] shadow-xl">
      <div className="text-[#9AA5C1] mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[#E7EBF5]">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>
            {typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(3) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const PerfCard: React.FC<{
  label: string
  value: number
  threshold: number
  description?: string
}> = ({ label, value, threshold, description }) => {
  const display = pct(value)
  const isGoodMetric = label.toLowerCase().includes('false')
  const isGood = isGoodMetric ? value <= threshold : value >= threshold
  return (
    <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1]">{label}</span>
        <span className={cn(
          'font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border',
          isGood ? 'text-[#22C55E] bg-[#0F3020] border-[#22C55E40]' : 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B40]'
        )}>
          {isGood ? '✓ MET' : '⚠ BELOW'}
        </span>
      </div>
      <div className="font-mono text-xl font-bold text-[#E7EBF5]">{display}</div>
      <div className="w-full bg-[#161F36] rounded-full h-1">
        <div
          className="h-1 rounded-full"
          style={{ width: `${Math.min(value * 100, 100)}%`, background: isGood ? '#22C55E' : '#F59E0B' }}
        />
      </div>
      <div className="text-[10px] text-[#667090] font-mono">
        Threshold: {pct(threshold)}
        {description && <span className="block mt-0.5 font-sans text-[#667090]">{description}</span>}
      </div>
    </div>
  )
}

export const ModelMonitoringPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'drift' | 'governance' | 'fairness' | 'alerts'>('overview')
  const [alertFilter, setAlertFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all')
  const [fairnessView, setFairnessView] = useState<'state' | 'category'>('state')
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const pm = mockPerformanceMetrics
  const filteredAlerts = alertFilter === 'all'
    ? mockModelAlerts
    : mockModelAlerts.filter((a) => a.status === alertFilter)

  const activeAlertCount = mockModelAlerts.filter((a) => a.status === 'active').length
  const fairnessData = fairnessView === 'state' ? mockStatesFairness : mockCategoryFairness

  const tabs = [
    { id: 'overview' as const, label: 'Model Overview', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'performance' as const, label: 'Performance', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: 'drift' as const, label: 'Drift Monitor', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'governance' as const, label: 'Governance', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'fairness' as const, label: 'Fairness', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'alerts' as const, label: `Alerts (${activeAlertCount})`, icon: <Bell className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="space-y-4 select-none">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#232D47] pb-3 pt-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold text-[#E7EBF5]">ML Model Governance & Monitoring</h1>
            <StatusPill label="ENGINE HEALTHY" variant="live" />
            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#362E0C] text-[#EAB308] border border-[#EAB30840]">
              ⚠ DEMO DATA
            </span>
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            {mockModelOverview.modelName} {mockModelOverview.version} · {mockModelOverview.modelType}
          </p>
          <p className="text-[10px] text-[#667090] mt-0.5 font-mono">{DEMO_DISCLAIMER}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="compact"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => navigate('/assistant?context=model-monitoring&modelId=MPLADS-AnomalyNet')}
          >
            Ask AI Assistant
          </Button>
          <Button variant="ghost" size="compact" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {[
          { label: 'Health Score', value: `${mockModelOverview.currentHealthScore}/100`, color: '#22C55E' },
          { label: 'F1 Score', value: pct(pm.f1Score), color: '#3B82F6' },
          { label: 'ROC-AUC', value: pm.rocAuc.toFixed(3), color: '#adc6ff' },
          { label: 'Pred. Volume', value: mockModelOverview.predictionVolumeDisplay, color: '#9AA5C1' },
          { label: 'Active Alerts', value: String(activeAlertCount), color: activeAlertCount > 0 ? '#EF4444' : '#22C55E' },
          { label: 'Latency', value: mockModelOverview.inferenceLatency, color: '#22C55E' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#10182B] border border-[#232D47] rounded-lg p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-[#667090] font-semibold">{kpi.label}</div>
            <div className="font-mono text-sm font-bold mt-0.5" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0.5 border-b border-[#232D47] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === tab.id
                ? 'border-[#3B82F6] text-[#adc6ff]'
                : 'border-transparent text-[#9AA5C1] hover:text-[#E7EBF5] hover:border-[#232D47]'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              telemetry={mockModelOverview.version}
              action={
                <Button
                  variant="ghost"
                  size="compact"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/assistant?context=model-monitoring')}
                >
                  View in Assistant
                </Button>
              }
            >
              <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Model Identity & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Model Name', value: mockModelOverview.modelName, mono: true },
                  { label: 'Version', value: mockModelOverview.version, mono: true },
                  { label: 'Model Type', value: mockModelOverview.modelType, mono: false },
                  { label: 'Status', value: 'Healthy', custom: <StatusPill label="HEALTHY" variant="live" /> },
                  { label: 'Last Evaluation', value: mockModelOverview.lastEvaluationDisplay, mono: true },
                  { label: 'Dataset Version', value: mockModelOverview.datasetVersion, mono: true },
                  { label: 'Prediction Volume', value: mockModelOverview.predictionVolumeDisplay, mono: true },
                  { label: 'Inference Latency', value: mockModelOverview.inferenceLatency, mono: true },
                  { label: 'Deployment Env', value: mockModelOverview.deploymentEnv, mono: false },
                  { label: 'Trained On', value: mockModelOverview.trainedOn, mono: true },
                  { label: 'Current Health', value: `${mockModelOverview.currentHealthScore}/100`, mono: true },
                  { label: 'Notes', value: mockModelOverview.notes, mono: false },
                ].map((row) => (
                  <div key={row.label} className="bg-[#0A0E1A] border border-[#232D47] rounded p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#667090] font-semibold mb-1">{row.label}</div>
                    {row.custom
                      ? row.custom
                      : <div className={cn('text-xs text-[#E7EBF5]', row.mono ? 'font-mono' : 'font-sans')}>{row.value}</div>
                    }
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="font-mono text-[10px] text-[#667090]">
              ⚠ DEMONSTRATION DATA — Not real production measurements
            </CardFooter>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockRiskDistribution.map((bucket) => (
              <div
                key={bucket.label}
                className="rounded-lg p-3 border flex flex-col gap-1"
                style={{ background: bucket.bgColor, borderColor: bucket.borderColor }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: bucket.color }}>
                    {bucket.label}
                  </span>
                  <span className="flex items-center gap-0.5 font-mono text-[10px]" style={{ color: bucket.color }}>
                    {bucket.trend === 'up'
                      ? <TrendingUp className="w-3 h-3" />
                      : bucket.trend === 'down'
                      ? <TrendingDown className="w-3 h-3" />
                      : <Minus className="w-3 h-3" />
                    }
                    {bucket.trendValue}
                  </span>
                </div>
                <div className="font-mono text-xl font-bold" style={{ color: bucket.color }}>
                  {bucket.count.toLocaleString()}
                </div>
                <div className="font-mono text-[10px]" style={{ color: bucket.color }}>
                  {bucket.percentage}% of predictions
                </div>
                <div className="w-full bg-[#0A0E1A]/40 rounded-full h-1 mt-1">
                  <div className="h-1 rounded-full" style={{ width: `${bucket.percentage}%`, background: bucket.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <PerfCard label="Precision" value={pm.precision} threshold={pm.thresholds.precision} description="TP / (TP + FP)" />
            <PerfCard label="Recall" value={pm.recall} threshold={pm.thresholds.recall} description="TP / (TP + FN)" />
            <PerfCard label="F1 Score" value={pm.f1Score} threshold={pm.thresholds.f1Score} description="Harmonic mean P&R" />
            <PerfCard label="ROC-AUC" value={pm.rocAuc} threshold={pm.thresholds.rocAuc} description="Area Under ROC Curve" />
            <PerfCard label="False Pos. Rate" value={pm.falsePositiveRate} threshold={pm.thresholds.falsePositiveRate} description="FP / (FP + TN)" />
            <PerfCard label="False Neg. Rate" value={pm.falseNegativeRate} threshold={pm.thresholds.falseNegativeRate} description="FN / (FN + TP)" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader telemetry="7 eval cycles">
                <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                <CardTitle>Precision / Recall Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockPrTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232D47" />
                    <XAxis dataKey="cycle" tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <YAxis domain={[0.78, 0.96]} tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#9AA5C1' }} />
                    <Line type="monotone" dataKey="precision" stroke="#3B82F6" strokeWidth={1.5} dot={{ r: 2 }} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#22C55E" strokeWidth={1.5} dot={{ r: 2 }} name="Recall" />
                    <Line type="monotone" dataKey="f1" stroke="#adc6ff" strokeWidth={1.5} dot={{ r: 2 }} name="F1" />
                    <Line type="monotone" dataKey="rocAuc" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 2 }} name="ROC-AUC" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader telemetry="risk score bins 0-100">
                <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                <CardTitle>Risk-Score Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockScoreHistogram} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232D47" />
                    <XAxis dataKey="bin" tick={{ fill: '#9AA5C1', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    <YAxis tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Predictions" radius={[2, 2, 0, 0]}>
                      {mockScoreHistogram.map((entry, i) => (
                        <Cell key={i} fill={histogramColor(entry.riskLevel)} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader telemetry={`n = ${mockConfusionMatrix.total.toLocaleString()}`}>
                <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
                <CardTitle>Confusion Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-[#0F3020] border border-[#22C55E40] rounded-lg p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-[#22C55E] font-bold">True Positive</div>
                    <div className="font-mono text-xl font-bold text-[#22C55E] mt-1">{mockConfusionMatrix.truePositive.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-[#22C55E]/70">{pct(mockConfusionMatrix.truePositive / mockConfusionMatrix.total)}</div>
                  </div>
                  <div className="bg-[#401515] border border-[#EF444440] rounded-lg p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-[#EF4444] font-bold">False Positive</div>
                    <div className="font-mono text-xl font-bold text-[#EF4444] mt-1">{mockConfusionMatrix.falsePositive.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-[#EF4444]/70">{pct(mockConfusionMatrix.falsePositive / mockConfusionMatrix.total)}</div>
                  </div>
                  <div className="bg-[#3A2A0C] border border-[#F59E0B40] rounded-lg p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-[#F59E0B] font-bold">False Negative</div>
                    <div className="font-mono text-xl font-bold text-[#F59E0B] mt-1">{mockConfusionMatrix.falseNegative.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-[#F59E0B]/70">{pct(mockConfusionMatrix.falseNegative / mockConfusionMatrix.total)}</div>
                  </div>
                  <div className="bg-[#10233F] border border-[#3B82F640] rounded-lg p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-[#3B82F6] font-bold">True Negative</div>
                    <div className="font-mono text-xl font-bold text-[#3B82F6] mt-1">{mockConfusionMatrix.trueNegative.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-[#3B82F6]/70">{pct(mockConfusionMatrix.trueNegative / mockConfusionMatrix.total)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader telemetry={`current: ${mockCurrentThreshold}`}>
                <FlaskConical className="w-3.5 h-3.5 text-[#3B82F6]" />
                <CardTitle>Threshold Comparison</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockThresholdComparison} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232D47" />
                    <XAxis dataKey="threshold" tick={{ fill: '#9AA5C1', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => v.toFixed(2)} />
                    <YAxis domain={[0, 1]} tick={{ fill: '#9AA5C1', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#9AA5C1' }} />
                    <Line type="monotone" dataKey="precision" stroke="#3B82F6" strokeWidth={1.5} dot={{ r: 2 }} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#22C55E" strokeWidth={1.5} dot={{ r: 2 }} name="Recall" />
                    <Line type="monotone" dataKey="f1" stroke="#adc6ff" strokeWidth={1.5} dot={{ r: 2 }} name="F1" />
                    <ReferenceLine x={mockCurrentThreshold} stroke="#EAB308" strokeDasharray="4 2" label={{ value: 'ACTIVE', fill: '#EAB308', fontSize: 9, position: 'top' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader telemetry="SHAP values · FS-v4.1">
              <FlaskConical className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Feature Importance — Anomaly Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {mockFeatureImportance.map((feat) => (
                  <div key={feat.id}>
                    <div
                      className="flex items-center gap-3 p-2 rounded hover:bg-[#0A0E1A] cursor-pointer transition-colors group"
                      onClick={() => setExpandedFeature(expandedFeature === feat.id ? null : feat.id)}
                    >
                      <div className="font-mono text-[10px] text-[#667090] w-6 text-right shrink-0">
                        #{mockFeatureImportance.indexOf(feat) + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#E7EBF5]">{feat.featureName}</span>
                          <span className="font-mono text-[9px] px-1 py-0.5 rounded border shrink-0"
                            style={{ color: categoryColor(feat.category), background: '#0A0E1A', borderColor: `${categoryColor(feat.category)}40` }}>
                            {feat.category}
                          </span>
                        </div>
                        <div className="w-full bg-[#161F36] rounded-full h-1.5 mt-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${(feat.importance / 0.2) * 100}%`,
                              background: feat.direction === 'decreases_risk' ? '#22C55E' : '#3B82F6',
                            }}
                          />
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#E7EBF5] shrink-0 w-12 text-right">
                        {(feat.importance * 100).toFixed(1)}%
                      </div>
                      <span className={cn(
                        'font-mono text-[9px] px-1.5 py-0.5 rounded border font-bold shrink-0',
                        feat.direction === 'decreases_risk'
                          ? 'text-[#22C55E] bg-[#0F3020] border-[#22C55E40]'
                          : 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B40]'
                      )}>
                        {feat.impactLabel}
                      </span>
                      <div className="text-[#667090] group-hover:text-[#9AA5C1] shrink-0">
                        {expandedFeature === feat.id ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    {expandedFeature === feat.id && (
                      <div className="ml-9 mr-2 mb-1 px-3 py-2 bg-[#0A0E1A] border border-[#232D47] rounded text-xs text-[#9AA5C1] font-sans">
                        {feat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="font-mono text-[10px] text-[#667090]">
              ⚠ DEMONSTRATION DATA — Importance values are simulated for UI purposes
            </CardFooter>
          </Card>
        </div>
      )}

      {/* TAB: DRIFT MONITORING */}
      {activeTab === 'drift' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-semibold text-[#E7EBF5]">Feature Drift</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border text-[#EF4444] bg-[#401515] border-[#EF444440] ml-auto">1 CRITICAL</span>
              </div>
              <div className="space-y-1">
                {(['critical', 'drift_detected', 'warning', 'nominal'] as const).map((s) => {
                  const count = mockFeatureDrift.filter((f) => f.status === s).length
                  const st = driftStatusStyle(s)
                  return (
                    <div key={s} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono" style={{ color: st.text }}>{st.label}</span>
                      <span className="font-mono font-bold" style={{ color: st.text }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs font-semibold text-[#E7EBF5]">Prediction Drift</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border text-[#EAB308] bg-[#362E0C] border-[#EAB30840] ml-auto">WARNING</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-[#9AA5C1]">PSI</span><span className="font-mono text-[#E7EBF5] font-bold">{mockPredictionDrift.psi}</span></div>
                <div className="flex justify-between"><span className="text-[#9AA5C1]">KS Statistic</span><span className="font-mono text-[#E7EBF5]">{mockPredictionDrift.ksStatistic}</span></div>
                <div className="flex justify-between"><span className="text-[#9AA5C1]">Mean Shift</span><span className="font-mono text-[#F59E0B]">{mockPredictionDrift.meanShift}</span></div>
                <div className="flex justify-between"><span className="text-[#9AA5C1]">Variance Shift</span><span className="font-mono text-[#EAB308]">{mockPredictionDrift.varianceShift}</span></div>
              </div>
            </div>

            <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-semibold text-[#E7EBF5]">Data Quality</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border text-[#22C55E] bg-[#0F3020] border-[#22C55E40] ml-auto">NOMINAL</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-[#9AA5C1]">Missing Values</span><span className="font-mono text-[#E7EBF5]">{mockDataQualityDrift.missingValueRate}%</span></div>
                <div className="flex justify-between"><span className="text-[#9AA5C1]">Schema Mismatch</span><span className="font-mono text-[#22C55E]">{mockDataQualityDrift.schemaMismatchRate}%</span></div>
                <div className="flex justify-between"><span className="text-[#9AA5C1]">Outlier Rate</span><span className="font-mono text-[#EAB308]">{mockDataQualityDrift.outlierRate}%</span></div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader telemetry="PSI · KS-test">
              <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Feature Drift Monitor</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="h-7 border-b border-[#232D47]">
                      {['Feature', 'PSI', 'KS Stat', 'Trend', 'Status', 'Last Checked'].map((h) => (
                        <th key={h} className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockFeatureDrift.map((feat) => {
                      const st = driftStatusStyle(feat.status)
                      return (
                        <tr key={feat.id} className="h-8 border-b border-[#161F36] hover:bg-[#161F36] group transition-colors">
                          <td className="px-3 font-mono text-xs text-[#E7EBF5] group-hover:border-l-2 group-hover:border-l-[#3B82F6] pl-[10px]">{feat.feature}</td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{fmtPsi(feat.psi)}</td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{fmtPsi(feat.ksStatistic)}</td>
                          <td className="px-3">
                            <div className="flex items-center gap-1">
                              <span style={{ color: feat.trend === 'stable' ? '#22C55E' : '#EAB308' }}>
                                {feat.trend === 'increasing'
                                  ? <TrendingUp className="w-3 h-3" />
                                  : feat.trend === 'decreasing'
                                  ? <TrendingDown className="w-3 h-3" />
                                  : <Minus className="w-3 h-3" />
                                }
                              </span>
                              <span className="font-mono text-[10px] text-[#9AA5C1]">{feat.trend}</span>
                            </div>
                          </td>
                          <td className="px-3">
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ color: st.text, background: st.bg, borderColor: st.border }}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-3 font-mono text-[10px] text-[#9AA5C1]">{feat.lastChecked}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader telemetry="last 30 days">
              <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Drift Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-5 space-y-0">
                <div className="absolute left-2 top-1 bottom-1 w-px bg-[#232D47]" />
                {mockDriftTimeline.map((ev, i) => {
                  const dotColor = ev.severity === 'critical' ? '#EF4444' : ev.severity === 'warning' ? '#EAB308' : '#3B82F6'
                  const typeLabel = ev.type.replace(/_/g, ' ').toUpperCase()
                  return (
                    <div key={i} className="relative flex gap-3 pb-3">
                      <div
                        className="absolute -left-3 top-1 w-2 h-2 rounded-full border-2 border-[#10182B] shrink-0"
                        style={{ background: dotColor }}
                      />
                      <div className="flex-1 bg-[#0A0E1A] border border-[#232D47] rounded p-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] text-[#667090]">{ev.date}</span>
                          <span className="font-mono text-[9px] px-1 py-0.5 rounded border font-bold"
                            style={{ color: dotColor, background: `${dotColor}15`, borderColor: `${dotColor}40` }}>
                            {typeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#E7EBF5] mt-1 font-sans">{ev.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: GOVERNANCE */}
      {activeTab === 'governance' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              telemetry="CAG / MoF AI Governance Policy 2025"
              action={
                <Button
                  variant="ghost"
                  size="compact"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/assistant?context=model-monitoring&q=governance')}
                >
                  Explain Governance
                </Button>
              }
            >
              <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Governance & Explainability Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Model Version', value: mockGovernanceRecord.modelVersion, mono: true },
                  { label: 'Previous Version', value: mockGovernanceRecord.previousVersion, mono: true },
                  { label: 'Training Data Reference', value: mockGovernanceRecord.trainingDataRef, mono: false },
                  { label: 'Feature Set Version', value: mockGovernanceRecord.featureSetVersion, mono: true },
                  { label: 'Explainability Status', value: mockGovernanceRecord.explainabilityStatus, highlight: '#22C55E' },
                  { label: 'Explainability Method', value: mockGovernanceRecord.explainabilityMethod, mono: false },
                  { label: 'Human Review Required', value: mockGovernanceRecord.humanReviewRequired ? 'YES — MANDATORY' : 'NO', highlight: mockGovernanceRecord.humanReviewRequired ? '#F59E0B' : '#22C55E' },
                  { label: 'Human Review Threshold', value: mockGovernanceRecord.humanReviewThreshold, mono: true },
                  { label: 'Auditability', value: mockGovernanceRecord.auditability, highlight: '#22C55E' },
                  { label: 'Audit Trail Version', value: mockGovernanceRecord.auditTrailVersion, mono: true },
                  { label: 'Model Owner', value: mockGovernanceRecord.modelOwner, mono: false },
                  { label: 'Compliance Framework', value: mockGovernanceRecord.complianceFramework, mono: false },
                  { label: 'Approved By', value: mockGovernanceRecord.approvedBy, mono: false },
                  { label: 'Approved On', value: mockGovernanceRecord.approvedOn, mono: true },
                  { label: 'Next Scheduled Review', value: mockGovernanceRecord.nextScheduledReview, mono: true },
                  { label: 'Data Retention Policy', value: mockGovernanceRecord.dataRetentionPolicy, mono: false },
                  { label: 'Encryption Standard', value: mockGovernanceRecord.encryptionStandard, mono: true },
                ].map((row) => (
                  <div key={row.label} className="bg-[#0A0E1A] border border-[#232D47] rounded p-2.5 flex flex-col gap-1">
                    <div className="text-[10px] uppercase tracking-wider text-[#667090] font-semibold">{row.label}</div>
                    <div
                      className={cn('text-xs font-semibold', row.mono ? 'font-mono' : 'font-sans', !row.highlight && 'text-[#E7EBF5]')}
                      style={row.highlight ? { color: row.highlight } : undefined}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="font-mono text-[10px] text-[#667090]">
              ⚠ DEMONSTRATION DATA — Governance records are simulated for UI validation
            </CardFooter>
          </Card>

          <div className="bg-[#3A2A0C] border border-[#F59E0B40] rounded-lg p-3 flex items-start gap-3">
            <Eye className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#F59E0B]">HUMAN REVIEW REQUIRED FOR HIGH-RISK PREDICTIONS</div>
              <div className="text-xs text-[#E7EBF5] mt-0.5">
                All model outputs with Risk Score &ge; 85 or Critical anomaly label require mandatory human audit officer review before escalation.
                Threshold: <span className="font-mono font-bold">{mockGovernanceRecord.humanReviewThreshold}</span>
              </div>
              <Button
                variant="ghost"
                size="compact"
                className="mt-2"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => navigate('/assistant?context=model-monitoring&q=human-review-cases')}
              >
                View Model Context in AI Assistant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FAIRNESS */}
      {activeTab === 'fairness' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex border border-[#232D47] rounded overflow-hidden">
              {(['state', 'category'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFairnessView(v)}
                  className={cn(
                    'px-3 h-7 text-xs font-semibold uppercase tracking-wider transition-colors',
                    fairnessView === v ? 'bg-[#161F36] text-[#adc6ff]' : 'text-[#9AA5C1] hover:bg-[#0A0E1A]'
                  )}
                >
                  By {v}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-[#667090]">
              ⚠ DEMONSTRATION — Fairness analysis across {fairnessView === 'state' ? 'Indian states' : 'project categories'}
            </span>
          </div>

          <Card>
            <CardHeader telemetry={`${fairnessData.length} segments`}>
              <Scale className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Fairness Monitoring — {fairnessView === 'state' ? 'State-wise' : 'Category-wise'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="h-7 border-b border-[#232D47]">
                      {['Segment', 'Pred. Volume', 'Flag Rate', 'Avg Risk Score', 'FPR', 'FNR', 'Fairness Status'].map((h) => (
                        <th key={h} className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fairnessData.map((seg) => {
                      const st = fairnessStatusStyle(seg.status)
                      return (
                        <tr key={seg.id} className="h-8 border-b border-[#161F36] hover:bg-[#161F36] group transition-colors">
                          <td className="px-3 text-xs font-semibold text-[#E7EBF5] group-hover:border-l-2 group-hover:border-l-[#3B82F6] pl-[10px]">{seg.label}</td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{seg.predictionVolume.toLocaleString()}</td>
                          <td className="px-3 font-mono text-xs">
                            <span style={{ color: seg.flagRate > 38 ? '#F59E0B' : seg.flagRate < 22 ? '#3B82F6' : '#E7EBF5' }}>
                              {seg.flagRate}%
                            </span>
                          </td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{seg.avgRiskScore}</td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{pct(seg.falsePositiveRate)}</td>
                          <td className="px-3 font-mono text-xs text-[#E7EBF5]">{pct(seg.falseNegativeRate)}</td>
                          <td className="px-3">
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ color: st.text, background: st.bg, borderColor: st.border }}>
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="font-mono text-[10px] text-[#667090]">
              ⚠ DEMONSTRATION DATA — Fairness metrics are simulated. Over-flagged: flag rate above national avg + 7.5%.
            </CardFooter>
          </Card>

          <Card>
            <CardHeader telemetry="flag rate comparison">
              <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
              <CardTitle>Flag Rate by {fairnessView === 'state' ? 'State' : 'Category'}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fairnessData} margin={{ top: 4, right: 8, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232D47" />
                  <XAxis dataKey="label" tick={{ fill: '#9AA5C1', fontSize: 9, fontFamily: 'JetBrains Mono' }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fill: '#9AA5C1', fontSize: 9, fontFamily: 'JetBrains Mono' }} unit="%" />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={34.2} stroke="#3B82F6" strokeDasharray="4 2" label={{ value: 'AVG', fill: '#3B82F6', fontSize: 9 }} />
                  <Bar dataKey="flagRate" name="Flag Rate %" radius={[2, 2, 0, 0]}>
                    {fairnessData.map((entry, i) => (
                      <Cell key={i} fill={entry.status === 'over_flagged' ? '#F59E0B' : entry.status === 'under_flagged' ? '#3B82F6' : '#22C55E'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-[#667090] font-semibold">Filter:</span>
            {(['all', 'active', 'acknowledged', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setAlertFilter(f)}
                className={cn(
                  'px-2.5 h-6 text-[10px] font-mono font-bold uppercase tracking-wider rounded border transition-colors',
                  alertFilter === f
                    ? 'bg-[#161F36] text-[#adc6ff] border-[#3B82F640]'
                    : 'text-[#9AA5C1] border-[#232D47] hover:bg-[#0A0E1A]'
                )}
              >
                {f} ({f === 'all' ? mockModelAlerts.length : mockModelAlerts.filter((a) => a.status === f).length})
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredAlerts.map((alert) => {
              const sevSt = alertSeverityStyle(alert.severity)
              const statusSt = alertStatusStyle(alert.status)
              const isExpanded = expandedAlert === alert.id
              return (
                <div
                  key={alert.id}
                  className="bg-[#10182B] border border-[#232D47] rounded-lg overflow-hidden"
                  style={alert.status === 'active' && alert.severity === 'critical' ? { boxShadow: '0 0 12px rgba(239,68,68,0.15)' } : undefined}
                >
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#0A0E1A] transition-colors"
                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  >
                    <div className="relative flex shrink-0">
                      {alert.status === 'active' && (
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75" style={{ background: sevSt.text }} />
                      )}
                      <span className="relative w-2 h-2 rounded-full" style={{ background: sevSt.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-[#667090]">{alert.id}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border font-bold" style={{ color: sevSt.text, background: sevSt.bg, borderColor: sevSt.border }}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border" style={{ color: statusSt.text, background: statusSt.bg, borderColor: statusSt.border }}>
                          {statusSt.label}
                        </span>
                        {alert.actionRequired && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#401515] border border-[#EF444440] text-[#EF4444]">ACTION REQ</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-[#E7EBF5] mt-0.5">{alert.title}</div>
                    </div>
                    <div className="text-[10px] font-mono text-[#667090] shrink-0 text-right">
                      <div>{new Date(alert.detectedAt).toLocaleDateString('en-IN')}</div>
                      {alert.ackBy && <div className="text-[#9AA5C1]">{alert.ackBy.split(' ').slice(0, 2).join(' ')}</div>}
                    </div>
                    <div className="text-[#667090] shrink-0">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-[#232D47]">
                      <p className="text-xs text-[#9AA5C1] font-sans mt-2">{alert.description}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border text-[#9AA5C1] border-[#232D47] bg-[#0A0E1A]">
                          CATEGORY: {alert.category.toUpperCase().replace('_', ' ')}
                        </span>
                        {alert.resolvedAt && (
                          <span className="font-mono text-[9px] text-[#22C55E]">
                            Resolved: {new Date(alert.resolvedAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="compact"
                          icon={<Sparkles className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/assistant?context=model-alert&alertId=${alert.id}`)}
                        >
                          Investigate with AI
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filteredAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-[#667090]">
                <CheckCheck className="w-8 h-8 mb-2" />
                <span className="text-sm">No alerts matching current filter.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
