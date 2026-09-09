import React, { useState, useMemo } from 'react'
import { AlertTriangle, Eye } from 'lucide-react'
import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'

interface RedFlaggedProjectsProps {
  projects: ProjectRecord[]
  onSelectProject: (project: ProjectRecord) => void
}

function getStatusConfig(status: ProjectRecord['status']): {
  label: string
  variant: 'live' | 'alert' | 'synced' | 'neutral'
  pulse: boolean
} {
  switch (status) {
    case 'Completed':
      return { label: 'COMPLETED', variant: 'live', pulse: false }
    case 'Under Investigation':
      return { label: 'INSPECT', variant: 'alert', pulse: true }
    case 'Stalled':
      return { label: 'STALLED', variant: 'alert', pulse: false }
    case 'Under Review':
      return { label: 'REVIEW', variant: 'alert', pulse: false }
    case 'In Progress':
      return { label: 'IN PROGRESS', variant: 'synced', pulse: false }
    case 'Disbursed':
      return { label: 'DISBURSED', variant: 'synced', pulse: false }
    case 'Sanctioned':
      return { label: 'SANCTIONED', variant: 'neutral', pulse: false }
    case 'Recommended':
      return { label: 'RECOMMENDED', variant: 'neutral', pulse: false }
    default:
      return { label: String(status).toUpperCase(), variant: 'neutral', pulse: false }
  }
}

export const RedFlaggedProjects: React.FC<RedFlaggedProjectsProps> = ({
  projects,
  onSelectProject,
}) => {
  const [filterMode, setFilterMode] = useState<'flagged' | 'all'>('flagged')

  const displayedProjects = useMemo(() => {
    if (filterMode === 'flagged') {
      const flagged = projects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high')
      // If none flagged, fall back to all projects sorted by risk score descending
      return flagged.length > 0 ? flagged : [...projects].sort((a, b) => b.riskScore - a.riskScore)
    }
    return [...projects].sort((a, b) => b.riskScore - a.riskScore)
  }, [projects, filterMode])

  const flaggedCount = projects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high').length

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`${flaggedCount} FLAGGED WORKS OF ${projects.length} MONITORED`}
        action={
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterMode === 'flagged'
                  ? 'bg-[#401515] text-[#EF4444] border border-[#EF4444]/60 font-bold'
                  : 'bg-[#10182B] text-[#9AA5C1] border border-[#232D47] hover:bg-[#161F36]'
              }`}
            >
              FLAGGED ({flaggedCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#161F36] text-[#3B82F6] border border-[#3B82F6]/60 font-bold'
                  : 'bg-[#10182B] text-[#9AA5C1] border border-[#232D47] hover:bg-[#161F36]'
              }`}
            >
              ALL WORKS ({projects.length})
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Red-Flagged Projects</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto select-none">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="h-8 border-b border-[#232D47] bg-[#0D1424] font-mono text-[10px] text-[#9AA5C1] uppercase tracking-wider">
                <th className="px-3 whitespace-nowrap">Risk</th>
                <th className="px-2.5 whitespace-nowrap">Work ID</th>
                <th className="px-3 whitespace-nowrap min-w-[220px]">Project</th>
                <th className="px-2.5 whitespace-nowrap">Category</th>
                <th className="px-2.5 text-right whitespace-nowrap">Sanctioned</th>
                <th className="px-2.5 text-right whitespace-nowrap">Disbursed</th>
                <th className="px-2.5 text-center whitespace-nowrap">Status</th>
                <th className="px-2.5 text-center whitespace-nowrap">Delay</th>
                <th className="px-3 whitespace-nowrap min-w-[200px]">Primary Anomaly</th>
                <th className="px-2.5 text-center whitespace-nowrap">Score</th>
                <th className="w-8 px-2 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {displayedProjects.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-xs text-[#667090] font-sans">
                    No flagged works recorded for this constituency. All works within statistical tolerance thresholds.
                  </td>
                </tr>
              ) : (
                displayedProjects.map((proj) => {
                  const statusCfg = getStatusConfig(proj.status)
                  const isCrit = proj.riskLevel === 'critical'

                  return (
                    <tr
                      key={proj.id}
                      onClick={() => onSelectProject(proj)}
                      className="border-b border-[#161F36] hover:bg-[#161F36] cursor-pointer transition-colors group"
                    >
                      {/* 1. Risk */}
                      <td className="px-3 py-2 whitespace-nowrap border-l-2 border-l-transparent group-hover:border-l-[#3B82F6]">
                        <RiskBadge
                          level={proj.riskLevel}
                          score={proj.riskScore}
                          withPip={isCrit}
                          pulse={isCrit}
                          size="sm"
                        />
                      </td>

                      {/* 2. Work ID */}
                      <td className="px-2.5 py-2 font-mono text-xs text-[#3B82F6] font-semibold whitespace-nowrap">
                        {proj.workCode}
                      </td>

                      {/* 3. Project */}
                      <td className="px-3 py-2">
                        <div className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate max-w-sm" title={proj.title}>
                          {proj.title}
                        </div>
                        <div className="text-[10px] text-[#667090] font-sans truncate">
                          Vendor: {proj.vendor}
                        </div>
                      </td>

                      {/* 4. Category */}
                      <td className="px-2.5 py-2 text-xs text-[#9AA5C1] whitespace-nowrap">
                        {proj.category}
                      </td>

                      {/* 5. Sanctioned */}
                      <td className="px-2.5 py-2 text-right font-mono font-tabular text-xs text-[#E7EBF5] font-semibold whitespace-nowrap">
                        {proj.sanctionedDisplay}
                      </td>

                      {/* 6. Disbursed */}
                      <td className="px-2.5 py-2 text-right font-mono font-tabular text-xs text-[#22C55E] font-semibold whitespace-nowrap">
                        {proj.disbursedDisplay}
                      </td>

                      {/* 7. Status */}
                      <td className="px-2.5 py-2 text-center whitespace-nowrap">
                        <StatusPill
                          label={statusCfg.label}
                          variant={statusCfg.variant}
                          pulse={statusCfg.pulse}
                        />
                      </td>

                      {/* 8. Delay */}
                      <td className="px-2.5 py-2 text-center font-mono text-[10px] text-[#F59E0B] whitespace-nowrap">
                        {proj.agingDisplay}
                      </td>

                      {/* 9. Primary Anomaly */}
                      <td className="px-3 py-2 text-xs text-[#F59E0B] max-w-[260px]">
                        <div className="truncate" title={proj.primaryAnomaly}>
                          {proj.primaryAnomaly}
                        </div>
                      </td>

                      {/* 10. Risk Score */}
                      <td className={`px-2.5 py-2 text-center font-mono font-tabular font-bold text-xs whitespace-nowrap ${
                        proj.riskScore >= 85
                          ? 'text-[#EF4444]'
                          : proj.riskScore >= 70
                          ? 'text-[#F59E0B]'
                          : proj.riskScore >= 40
                          ? 'text-[#EAB308]'
                          : 'text-[#22C55E]'
                      }`}>
                        {proj.riskScore}
                      </td>

                      {/* Dossier inspect icon */}
                      <td className="px-2 py-2 text-center text-[#667090] group-hover:text-[#3B82F6] transition-colors">
                        <Eye className="w-3.5 h-3.5" />
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
