import React, { useState, useMemo } from 'react'
import { Eye, Briefcase } from 'lucide-react'
import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'

interface VendorProjectPortfolioProps {
  projects: ProjectRecord[]
  onSelectProject: (project: ProjectRecord) => void
}

function getStatusVariant(status: ProjectRecord['status']): {
  label: string
  variant: 'live' | 'alert' | 'synced' | 'neutral'
} {
  switch (status) {
    case 'Completed':
      return { label: 'COMPLETED', variant: 'live' }
    case 'Under Investigation':
      return { label: 'INSPECT', variant: 'alert' }
    case 'Stalled':
      return { label: 'STALLED', variant: 'alert' }
    case 'Under Review':
      return { label: 'REVIEW', variant: 'alert' }
    case 'In Progress':
      return { label: 'IN PROGRESS', variant: 'synced' }
    case 'Disbursed':
      return { label: 'DISBURSED', variant: 'synced' }
    case 'Sanctioned':
      return { label: 'SANCTIONED', variant: 'neutral' }
    default:
      return { label: String(status).toUpperCase(), variant: 'neutral' }
  }
}

export const VendorProjectPortfolio: React.FC<VendorProjectPortfolioProps> = ({
  projects,
  onSelectProject,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged'>('all')

  const displayedProjects = useMemo(() => {
    if (filterMode === 'flagged') {
      const flagged = projects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high')
      return flagged.length > 0 ? flagged : projects
    }
    return [...projects].sort((a, b) => b.riskScore - a.riskScore)
  }, [projects, filterMode])

  const flaggedCount = projects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high').length

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`${projects.length} CONTRACTS ASSIGNED // ${flaggedCount} ANOMALY FLAGGED`}
        action={
          <div className="flex items-center gap-1 bg-[#0A0E1A] p-0.5 rounded border border-[#232D47]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#161F36] text-[#3B82F6] font-bold border border-[#232D47]'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
              }`}
            >
              All Works ({projects.length})
            </button>
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                filterMode === 'flagged'
                  ? 'bg-[#401515] text-[#EF4444] font-bold border border-[#EF4444]/40'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
              }`}
            >
              Flagged Only ({flaggedCount})
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Vendor Project Portfolio</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="h-7 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
                <th className="px-3 whitespace-nowrap">Risk</th>
                <th className="px-2.5 whitespace-nowrap">Work ID</th>
                <th className="px-3 whitespace-nowrap">Project Title</th>
                <th className="px-2.5 whitespace-nowrap">State</th>
                <th className="px-2.5 whitespace-nowrap">Constituency</th>
                <th className="px-2.5 whitespace-nowrap">MP</th>
                <th className="px-2.5 whitespace-nowrap">Category</th>
                <th className="px-2.5 text-right whitespace-nowrap">Sanctioned</th>
                <th className="px-2.5 text-right whitespace-nowrap">Disbursed</th>
                <th className="px-2 text-center whitespace-nowrap">Status</th>
                <th className="px-2 text-center whitespace-nowrap">Delay</th>
                <th className="px-3 whitespace-nowrap">Primary Anomaly</th>
                <th className="px-2.5 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#161F36]">
              {displayedProjects.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-[#9AA5C1] font-mono text-xs">
                    No projects found for current view.
                  </td>
                </tr>
              ) : (
                displayedProjects.map((p) => {
                  const isCrit = p.riskLevel === 'critical'
                  const isHigh = p.riskLevel === 'high'
                  const statusConf = getStatusVariant(p.status)

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="hover:bg-[#161F36]/80 transition-colors cursor-pointer group"
                    >
                      {/* Risk Badge */}
                      <td className="py-2 px-3 whitespace-nowrap align-middle">
                        <RiskBadge
                          level={p.riskLevel}
                          score={p.riskScore}
                          size="sm"
                          withPip={isCrit}
                          pulse={isCrit}
                        />
                      </td>

                      {/* Work Code */}
                      <td className="py-2 px-2.5 font-mono text-[11px] text-[#3B82F6] whitespace-nowrap align-middle">
                        {p.workCode}
                      </td>

                      {/* Project Title */}
                      <td className="py-2 px-3 text-[#E7EBF5] font-medium align-middle max-w-[220px]">
                        <span className="line-clamp-1 group-hover:text-[#3B82F6] transition-colors" title={p.title}>
                          {p.title}
                        </span>
                      </td>

                      {/* State */}
                      <td className="py-2 px-2.5 whitespace-nowrap font-mono text-[11px] text-[#9AA5C1] align-middle">
                        {p.state}
                      </td>

                      {/* Constituency */}
                      <td className="py-2 px-2.5 whitespace-nowrap text-[11px] text-[#9AA5C1] align-middle">
                        {p.constituency}
                      </td>

                      {/* MP */}
                      <td className="py-2 px-2.5 whitespace-nowrap text-[11px] text-[#E7EBF5] align-middle">
                        {p.mpName}
                      </td>

                      {/* Category */}
                      <td className="py-2 px-2.5 whitespace-nowrap text-[10px] font-mono text-[#9AA5C1] align-middle">
                        {p.category}
                      </td>

                      {/* Sanctioned */}
                      <td className="py-2 px-2.5 text-right font-mono font-tabular text-[#9AA5C1] whitespace-nowrap align-middle">
                        {p.sanctionedDisplay}
                      </td>

                      {/* Disbursed */}
                      <td className="py-2 px-2.5 text-right font-mono font-tabular font-bold text-[#22C55E] whitespace-nowrap align-middle">
                        {p.disbursedDisplay}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-2 text-center whitespace-nowrap align-middle">
                        <StatusPill
                          label={statusConf.label}
                          variant={statusConf.variant}
                          pulse={isCrit}
                        />
                      </td>

                      {/* Delay */}
                      <td className="py-2 px-2 text-center font-mono font-tabular whitespace-nowrap align-middle">
                        <span className={p.agingDays > 90 ? 'text-[#EF4444] font-bold' : 'text-[#9AA5C1]'}>
                          {p.agingDisplay}
                        </span>
                      </td>

                      {/* Primary Anomaly */}
                      <td className="py-2 px-3 text-[10px] align-middle max-w-[180px]">
                        <span
                          className={`px-1.5 py-0.5 rounded border inline-block truncate max-w-full ${
                            isCrit
                              ? 'bg-[#401515]/40 text-[#EF4444] border-[#EF4444]/30'
                              : isHigh
                              ? 'bg-[#3A2A0C]/40 text-[#F59E0B] border-[#F59E0B]/30'
                              : 'bg-[#0A0E1A] text-[#9AA5C1] border-[#232D47]'
                          }`}
                          title={p.primaryAnomaly}
                        >
                          {p.primaryAnomaly}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2 px-2.5 text-right whitespace-nowrap align-middle">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectProject(p)
                          }}
                          className="px-2 py-0.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-[10px] font-mono text-[#3B82F6] hover:text-[#E7EBF5] flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
