import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Building2, FolderKanban, ArrowUpRight } from 'lucide-react'
import { ProjectRecord } from '@/types'
import { mockVendors, slugify } from '@/data'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface RelatedEntitiesProps {
  projects: ProjectRecord[]
  onSelectProject: (project: ProjectRecord) => void
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

export const RelatedEntities: React.FC<RelatedEntitiesProps> = ({
  projects,
  onSelectProject,
}) => {
  const navigate = useNavigate()

  // 1. Top Vendors calculation
  const vendorMap: Record<
    string,
    { name: string; gst: string; count: number; disbursed: number; maxRisk: number }
  > = {}

  projects.forEach((p) => {
    if (!vendorMap[p.vendor]) {
      vendorMap[p.vendor] = {
        name: p.vendor,
        gst: p.vendorGst,
        count: 0,
        disbursed: 0,
        maxRisk: 0,
      }
    }
    const v = vendorMap[p.vendor]
    v.count++
    v.disbursed += p.disbursedAmount
    if (p.riskScore > v.maxRisk) v.maxRisk = p.riskScore
  })

  const topVendors = Object.values(vendorMap)
    .sort((a, b) => b.disbursed - a.disbursed || b.maxRisk - a.maxRisk)
    .slice(0, 4)

  // 2. Top Implementing Agencies calculation
  const agencyMap: Record<
    string,
    { name: string; count: number; sanctioned: number; maxRisk: number }
  > = {}

  projects.forEach((p) => {
    if (!agencyMap[p.agency]) {
      agencyMap[p.agency] = {
        name: p.agency,
        count: 0,
        sanctioned: 0,
        maxRisk: 0,
      }
    }
    const a = agencyMap[p.agency]
    a.count++
    a.sanctioned += p.sanctionedAmount
    if (p.riskScore > a.maxRisk) a.maxRisk = p.riskScore
  })

  const topAgencies = Object.values(agencyMap)
    .sort((a, b) => b.sanctioned - a.sanctioned || b.maxRisk - a.maxRisk)
    .slice(0, 4)

  // 3. Highest Risk Projects
  const highestRiskProjects = [...projects]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 select-none">
      {/* 1. Top Vendors */}
      <Card>
        <CardHeader
          telemetry={`${topVendors.length} CONTRACTORS`}
          action={
            <button
              onClick={() => navigate('/vendors')}
              className="text-[10px] font-mono text-[#3B82F6] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          }
        >
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
            <CardTitle>Top Vendors</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1.5">
          {topVendors.map((v) => {
            const matched = mockVendors.find((m) => m.name.toLowerCase() === v.name.toLowerCase())
            const vendorUrl = matched ? `/vendors/${matched.id}` : '/vendors'

            return (
              <div
                key={v.name}
                onClick={() => navigate(vendorUrl)}
                className="p-2 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 cursor-pointer transition-colors group"
              >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 pr-1">
                  <div className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate" title={v.name}>
                    {v.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#667090] truncate">
                    GSTIN: {v.gst || 'UNREGISTERED'}
                  </div>
                </div>
                <RiskBadge
                  level={v.maxRisk >= 85 ? 'critical' : v.maxRisk >= 70 ? 'high' : 'medium'}
                  score={v.maxRisk}
                  size="sm"
                />
              </div>

              <div className="mt-1.5 pt-1 border-t border-[#232D47]/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#9AA5C1]">{v.count} {v.count === 1 ? 'Work' : 'Works'}</span>
                <span className="text-[#22C55E] font-semibold">{formatCurrency(v.disbursed)}</span>
              </div>
            </div>
          )})}
        </CardContent>
      </Card>

      {/* 2. Top Implementing Agencies */}
      <Card>
        <CardHeader
          telemetry={`${topAgencies.length} NODAL BODIES`}
          action={
            <button
              onClick={() => navigate('/agencies')}
              className="text-[10px] font-mono text-[#3B82F6] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          }
        >
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
            <CardTitle>Top Implementing Agencies</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1.5">
          {topAgencies.map((a) => (
            <div
              key={a.name}
              onClick={() => navigate(`/agencies/${slugify(a.name)}`)}
              className="p-2 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 cursor-pointer transition-colors group"
            >

              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 pr-1">
                  <div className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate" title={a.name}>
                    {a.name}
                  </div>
                  <div className="text-[10px] text-[#667090]">
                    Executive Authority
                  </div>
                </div>
                <RiskBadge
                  level={a.maxRisk >= 85 ? 'critical' : a.maxRisk >= 70 ? 'high' : 'medium'}
                  score={a.maxRisk}
                  size="sm"
                />
              </div>

              <div className="mt-1.5 pt-1 border-t border-[#232D47]/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#9AA5C1]">{a.count} {a.count === 1 ? 'Work' : 'Works'}</span>
                <span className="text-[#3B82F6] font-semibold">{formatCurrency(a.sanctioned)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Highest Risk Projects */}
      <Card>
        <CardHeader
          telemetry="PRIORITY AUDIT"
          action={
            <span className="font-mono text-[10px] text-[#EF4444] bg-[#401515] px-1.5 py-0.2 rounded border border-[#EF4444]/40 font-bold uppercase">
              CRITICAL
            </span>
          }
        >
          <div className="flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-[#EF4444]" />
            <CardTitle>Highest Risk Works</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1.5">
          {highestRiskProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="p-2 rounded bg-[#0A0E1A] hover:bg-[#161F36] border border-[#232D47] hover:border-[#EF4444]/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 pr-1">
                  <div className="font-mono text-[10px] text-[#3B82F6] font-semibold">
                    {p.workCode}
                  </div>
                  <div className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate" title={p.title}>
                    {p.title}
                  </div>
                </div>
                <RiskBadge
                  level={p.riskLevel}
                  score={p.riskScore}
                  withPip={p.riskLevel === 'critical'}
                  size="sm"
                />
              </div>

              <div className="mt-1 text-[10px] text-[#F59E0B] truncate" title={p.primaryAnomaly}>
                {p.primaryAnomaly}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
