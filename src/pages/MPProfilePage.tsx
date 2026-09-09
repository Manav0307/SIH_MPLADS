import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Landmark,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Download,
  ShieldAlert,
  Shield,
  FileSpreadsheet,
  Globe,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { getMpById, getMpProjects } from '@/data'
import { ProjectRecord } from '@/types'
import { ProjectDossierDrawer } from '@/components/dossier'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { InvestigationBreadcrumbs } from '@/components/common/InvestigationBreadcrumbs'
import {
  DemographicParity,
  RedFlaggedProjects,
  ProjectStatusBreakdown,
  AnomalyBreakdown,
  ConstituencyActivity,
  RelatedEntities,
} from '@/components/mps'

export const MPProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Dossier slide-over state
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  // Find MP record
  const mp = useMemo(() => (id ? getMpById(id) : undefined), [id])

  // Get all projects for this MP
  const projects = useMemo(() => (mp ? getMpProjects(mp.name) : []), [mp])

  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  if (!mp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#EF4444]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#E7EBF5]">Constituency Profile Record Not Found</h2>
        <p className="text-xs text-[#9AA5C1] max-w-md">
          No parliamentarian or constituency matching token <code className="text-[#3B82F6] font-mono">{id}</code> exists in the active registry.
        </p>
        <button
          onClick={() => navigate('/mps')}
          className="mt-2 px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to MPs & Constituencies Directory</span>
        </button>
      </div>
    )
  }

  // Profile fund utilization data for BarChart
  const profileUtilizationData = [
    {
      metric: 'Statutory Allocation',
      Amount: Math.round((mp.allocatedAmount / 10000000) * 100) / 100,
      fill: '#424754',
    },
    {
      metric: 'Recommended (DPR)',
      Amount: Math.round((mp.recommendedAmount / 10000000) * 100) / 100,
      fill: '#667090',
    },
    {
      metric: 'Sanctioned Capital',
      Amount: Math.round((mp.sanctionedAmount / 10000000) * 100) / 100,
      fill: '#3B82F6',
    },
    {
      metric: 'Disbursed Capital',
      Amount: Math.round((mp.disbursedAmount / 10000000) * 100) / 100,
      fill: '#22C55E',
    },
    {
      metric: 'Spent on Ground',
      Amount: Math.round((mp.spentAmount / 10000000) * 100) / 100,
      fill: '#10B981',
    },
  ]

  const sanctionedVsAllocated = ((mp.sanctionedAmount / mp.allocatedAmount) * 100).toFixed(1)
  const disbursedVsSanctioned = mp.sanctionedAmount > 0
    ? ((mp.disbursedAmount / mp.sanctionedAmount) * 100).toFixed(1)
    : '0.0'
  const spentVsDisbursed = mp.disbursedAmount > 0
    ? ((mp.spentAmount / mp.disbursedAmount) * 100).toFixed(1)
    : '0.0'
  const unutilizedBalance = Math.max(0, mp.sanctionedAmount - mp.disbursedAmount)

  return (
    <div className="flex flex-col w-full text-[#E7EBF5] select-none pb-12 px-4 space-y-4">
      {/* 1. Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between border-b border-[#232D47] pb-2.5 pt-1">
        <div className="flex items-center gap-2">
          <Link
            to="/mps"
            className="text-xs text-[#9AA5C1] hover:text-[#3B82F6] flex items-center gap-1 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MP Directory</span>
          </Link>
          <span className="text-[#667090] text-xs">/</span>
          <span className="text-xs text-[#E7EBF5] font-mono font-bold truncate">
            {mp.name} &bull; {mp.constituency}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="AUDIT RECORD ACTIVE" variant="synced" />
          <span className="font-mono text-[10px] text-[#667090] hidden sm:inline">
            UID: {mp.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Global Investigation Breadcrumbs */}
      <InvestigationBreadcrumbs mpName={mp.name} />

      {/* 2. MP Profile Header Banner */}
      <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3.5 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* MP Identity & Constituency */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg lg:text-xl font-bold text-[#E7EBF5] tracking-tight">
                {mp.name}
              </h1>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#161F36] border border-[#232D47] text-[#9AA5C1]">
                {mp.house === 'LS' ? 'Lok Sabha' : 'Rajya Sabha'} ({mp.party})
              </span>
              <RiskBadge
                level={mp.riskLevel}
                score={mp.riskScore}
                withPip={mp.riskLevel === 'critical'}
                pulse={mp.riskLevel === 'critical'}
                size="md"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9AA5C1] font-sans flex-wrap">
              <span className="flex items-center gap-1 text-[#E7EBF5] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                {mp.constituency}
              </span>
              <span className="text-[#667090]">&bull;</span>
              <span>District: {mp.district}</span>
              <span className="text-[#667090]">&bull;</span>
              <span>State: {mp.state}</span>
              <span className="text-[#667090]">&bull;</span>
              <span className="font-mono text-[11px] text-[#667090]">{mp.term}</span>
            </div>

            <p className="text-xs text-[#F59E0B] font-mono pt-1">
              Primary Anomaly Flag: <span className="text-[#E7EBF5]">{mp.primaryRisk}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => navigate(`/assistant?type=mp&id=${encodeURIComponent(mp.id)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#38BDF8]/50 rounded text-xs text-[#38BDF8] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open AI Investigation Assistant with MP context"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => {
                alert(`Exporting Comprehensive Constituency Forensic Dossier for ${mp.name} (${mp.constituency})...`)
              }}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#E7EBF5] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={() => navigate(`/projects?search=${encodeURIComponent(mp.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>View Projects</span>
            </button>

            <button
              onClick={() => navigate(`/cases?q=${encodeURIComponent(mp.name)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#a5b4fc] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Related Cases</span>
            </button>

            <button
              onClick={() => navigate(`/geospatial?state=${encodeURIComponent(mp.state)}&district=${encodeURIComponent(mp.district)}`)}
              className="px-2.5 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#22C55E] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>GIS Map</span>
            </button>

            <button
              onClick={() => navigate(`/investigation?search=${encodeURIComponent(mp.name)}`)}
              className="px-2.5 py-1.5 bg-[#401515] hover:bg-[#521C1C] border border-[#EF4444]/60 rounded text-xs text-[#EF4444] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Investigate MP</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#232D47]/80">
          {/* 1. Allocated */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <Landmark className="w-3 h-3 text-[#9AA5C1]" />
              STATUTORY ALLOCATION
            </span>
            <div className="mt-1">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {mp.allocatedDisplay}
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              5-Year Parliamentary Cap
            </span>
          </div>

          {/* 2. Sanctioned */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
              SANCTIONED AMOUNT
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-[#E7EBF5]">
                {mp.sanctionedDisplay}
              </span>
              <span className="font-mono text-[10px] text-[#3B82F6]">({sanctionedVsAllocated}%)</span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              {projects.length} Works Approved
            </span>
          </div>

          {/* 3. Disbursed */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#9AA5C1] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              DISBURSED AMOUNT
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-[#22C55E]">
                {mp.disbursedDisplay}
              </span>
              <span className="font-mono text-[10px] text-[#22C55E]/80">({disbursedVsSanctioned}%)</span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              PFMS Tranches Cleared
            </span>
          </div>

          {/* 4. Flagged Works */}
          <div className="bg-[#0A0E1A] p-2.5 rounded border border-[#232D47]">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#EF4444] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
              FLAGGED PROJECTS
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-[#EF4444]">
                {mp.flaggedProjectsCount}
              </span>
              <span className="font-mono text-[10px] text-[#EF4444]/80">
                ({projects.length > 0 ? ((mp.flaggedProjectsCount / projects.length) * 100).toFixed(0) : 0}% of works)
              </span>
            </div>
            <span className="text-[10px] text-[#667090] font-mono block mt-0.5">
              Risk Score: {mp.riskScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section: Fund Utilization Analysis (Recharts Bar Chart + KPIs) */}
      <Card className="w-full">
        <CardHeader
          telemetry={`PFMS LEDGER: ${mp.constituencyCode} // EXP DISCREPANCY AUDIT`}
          action={
            <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F660] px-2 py-0.5 rounded font-bold uppercase">
              FUND UTILIZATION AUDIT
            </span>
          }
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
            <CardTitle>Fund Utilization</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Fund Utilization KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#0A0E1A] p-2.5 rounded-lg border border-[#232D47]">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold">
                Sanctioned vs Allocated
              </span>
              <div className="mt-0.5">
                <span className="font-mono text-base font-bold text-[#E7EBF5]">
                  {sanctionedVsAllocated}%
                </span>
              </div>
              <span className="text-[10px] text-[#667090] font-sans">
                Statutory Budget Absorbed
              </span>
            </div>

            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold">
                Disbursed vs Sanctioned
              </span>
              <div className="mt-0.5">
                <span className="font-mono text-base font-bold text-[#3B82F6]">
                  {disbursedVsSanctioned}%
                </span>
              </div>
              <span className="text-[10px] text-[#667090] font-sans">
                Tranche Release Velocity
              </span>
            </div>

            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
              <span className="font-mono text-[10px] text-[#9AA5C1] uppercase font-semibold">
                Spent vs Disbursed
              </span>
              <div className="mt-0.5">
                <span className="font-mono text-base font-bold text-[#22C55E]">
                  {spentVsDisbursed}%
                </span>
              </div>
              <span className="text-[10px] text-[#667090] font-sans">
                Field Progress Utilization
              </span>
            </div>

            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#232D47] pt-2 sm:pt-0 sm:pl-3">
              <span className="font-mono text-[10px] text-[#EF4444] uppercase font-semibold">
                Unutilized Sanction
              </span>
              <div className="mt-0.5">
                <span className="font-mono text-base font-bold text-[#EF4444]">
                  ₹ {(unutilizedBalance / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <span className="text-[10px] text-[#667090] font-sans">
                Undrawn Treasury Balance
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="w-full h-52 pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={profileUtilizationData}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#232D47" vertical={false} />
                <XAxis
                  dataKey="metric"
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#667090"
                  tick={{ fill: '#9AA5C1', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-[#10182B] border border-[#232D47] p-2 rounded shadow-lg text-xs font-mono">
                          <span className="text-[#9AA5C1]">{data.metric}: </span>
                          <span className="text-[#E7EBF5] font-bold">₹ {data.Amount} Cr</span>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="Amount"
                  name="Amount (₹ Cr)"
                  fill="#3B82F6"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. Section: Demographic Funding Parity (Data Honesty Compliant) */}
      <DemographicParity
        constituencyName={mp.constituency}
        stateName={mp.state}
      />

      {/* 5. Section: Project Status Breakdown & Anomaly Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ProjectStatusBreakdown statusBreakdown={mp.statusBreakdown} />
        <AnomalyBreakdown anomaliesCount={mp.anomaliesCount} />
      </div>

      {/* 6. Section: Constituency Activity Trend Chart */}
      <ConstituencyActivity
        activityByFy={mp.activityByFy}
        constituencyName={mp.constituency}
      />

      {/* 7. Section: Red-Flagged Projects Table */}
      <RedFlaggedProjects
        projects={projects}
        onSelectProject={handleSelectProject}
      />

      {/* 8. Section: Related Entities (Vendors, Agencies, High Risk Works) */}
      <RelatedEntities
        projects={projects}
        onSelectProject={handleSelectProject}
      />

      {/* 9. Shared Forensic Dossier Drawer */}
      <ProjectDossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default MPProfilePage
