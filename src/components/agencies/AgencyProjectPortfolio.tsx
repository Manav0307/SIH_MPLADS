import React, { useState, useMemo } from 'react'
import { Eye, FolderKanban, Clock } from 'lucide-react'

import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'

interface AgencyProjectPortfolioProps {
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

export const AgencyProjectPortfolio: React.FC<AgencyProjectPortfolioProps> = ({
  projects,
  onSelectProject,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'delayed'>('all')

  const flaggedCount = projects.filter(
    (p) => p.riskLevel === 'critical' || p.riskLevel === 'high'
  ).length

  const delayedCount = projects.filter(
    (p) =>
      p.agingDays > 60 ||
      p.status === 'Stalled' ||
      p.primaryAnomaly.toLowerCase().includes('delay')
  ).length

  const displayedProjects = useMemo(() => {
    let list = [...projects]
    if (filterMode === 'flagged') {
      list = list.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high')
    } else if (filterMode === 'delayed') {
      list = list.filter(
        (p) =>
          p.agingDays > 60 ||
          p.status === 'Stalled' ||
          p.primaryAnomaly.toLowerCase().includes('delay')
      )
    }
    return list.sort((a, b) => b.riskScore - a.riskScore)
  }, [projects, filterMode])

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`${projects.length} WORKS EXECUTING // ${flaggedCount} FLAGGED // ${delayedCount} DELAYED`}
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
              Flagged ({flaggedCount})
            </button>
            <button
              onClick={() => setFilterMode('delayed')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                filterMode === 'delayed'
                  ? 'bg-[#3A2A0C] text-[#F59E0B] font-bold border border-[#F59E0B]/40'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
              }`}
            >
              Delayed ({delayedCount})
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Agency Project Portfolio</CardTitle>
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
                <th className="px-2 whitespace-nowrap">State</th>
                <th className="px-2 whitespace-nowrap">District</th>
                <th className="px-2 whitespace-nowrap">Constituency</th>
                <th className="px-2 whitespace-nowrap">MP</th>
                <th className="px-2.5 whitespace-nowrap">Vendor</th>
                <th className="px-2 whitespace-nowrap">Category</th>
                <th className="px-2.5 text-right whitespace-nowrap">Sanctioned</th>
                <th className="px-2.5 text-right whitespace-nowrap">Disbursed</th>
                <th className="px-2 text-center whitespace-nowrap">Status</th>
                <th className="px-2 text-center whitespace-nowrap">Delay</th>
                <th className="px-3 whitespace-nowrap">Primary Anomaly</th>
                <th className="px-2 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#232D47]/60">
              {displayedProjects.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-8 text-center text-[#9AA5C1] font-mono text-xs">
                    No projects found for the selected filter.
                  </td>
                </tr>
              ) : (
                displayedProjects.map((p) => {
                  const statusInfo = getStatusVariant(p.status)
                  const isDelayed =
                    p.agingDays > 60 ||
                    p.status === 'Stalled' ||
                    p.primaryAnomaly.toLowerCase().includes('delay')

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="hover:bg-[#161F36]/60 transition-colors cursor-pointer group"
                    >
                      {/* Risk */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                      </td>

                      {/* Work ID */}
                      <td className="px-2.5 py-2 font-mono text-[11px] text-[#adc6ff] whitespace-nowrap">
                        {p.workCode}
                      </td>

                      {/* Title */}
                      <td className="px-3 py-2 max-w-[200px] truncate font-medium text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors">
                        {p.title}
                      </td>

                      {/* State */}
                      <td className="px-2 py-2 text-[#9AA5C1] whitespace-nowrap text-[11px]">
                        {p.state}
                      </td>

                      {/* District */}
                      <td className="px-2 py-2 text-[#9AA5C1] whitespace-nowrap text-[11px]">
                        {p.district}
                      </td>

                      {/* Constituency */}
                      <td className="px-2 py-2 text-[#9AA5C1] whitespace-nowrap text-[11px] max-w-[120px] truncate">
                        {p.constituency}
                      </td>

                      {/* MP */}
                      <td className="px-2 py-2 text-[#E7EBF5] whitespace-nowrap text-[11px] max-w-[120px] truncate">
                        {p.mpName}
                      </td>

                      {/* Vendor */}
                      <td className="px-2.5 py-2 text-[#9AA5C1] whitespace-nowrap text-[11px] max-w-[130px] truncate">
                        {p.vendor}
                      </td>

                      {/* Category */}
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded bg-[#161F36] text-[10px] text-[#9AA5C1] font-mono">
                          {p.category}
                        </span>
                      </td>

                      {/* Sanctioned */}
                      <td className="px-2.5 py-2 font-mono text-right whitespace-nowrap text-[11px] text-[#9AA5C1]">
                        {p.sanctionedDisplay}
                      </td>

                      {/* Disbursed */}
                      <td className="px-2.5 py-2 font-mono text-right whitespace-nowrap text-[11px] text-[#22C55E] font-medium">
                        {p.disbursedDisplay}
                      </td>

                      {/* Status */}
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <StatusPill label={statusInfo.label} variant={statusInfo.variant} />
                      </td>

                      {/* Delay */}
                      <td className="px-2 py-2 text-center whitespace-nowrap font-mono text-[11px]">
                        {isDelayed ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#EF4444]/10 text-[#EF4444] font-bold">
                            <Clock className="w-2.5 h-2.5" />
                            {p.agingDisplay || `+${p.agingDays}d`}
                          </span>
                        ) : (
                          <span className="text-[#667090]">
                            {p.agingDisplay || `${p.agingDays}d`}
                          </span>
                        )}
                      </td>

                      {/* Anomaly */}
                      <td className="px-3 py-2 whitespace-nowrap max-w-[180px] truncate text-[11px] text-[#F59E0B]">
                        {p.primaryAnomaly}
                      </td>

                      {/* Action */}
                      <td className="px-2 py-2 text-right whitespace-nowrap font-mono">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectProject(p)
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[10px] text-[#3B82F6] hover:text-[#adc6ff] border border-[#232D47] transition-colors cursor-pointer"
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
