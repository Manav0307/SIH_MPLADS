import React, { useState, useMemo } from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface InvestigationResultsProps {
  projects: ProjectRecord[]
  selectedProjectId?: string
  onSelectProject: (project: ProjectRecord) => void
  onOpenDossier: (project: ProjectRecord) => void
}

type SortKey = 'riskScore' | 'sanctionedAmount' | 'disbursedAmount' | 'workCode' | 'state' | 'agingDays'

export const InvestigationResults: React.FC<InvestigationResultsProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenDossier,
}) => {
  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  // Sorted projects
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let valA = a[sortKey]
      let valB = b[sortKey]

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase()
        valB = (valB as string).toLowerCase()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [projects, sortKey, sortOrder])

  // Total pages
  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize))
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedProjects.slice(start, start + pageSize)
  }, [sortedProjects, currentPage, pageSize])

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-[#667090] opacity-50 ml-1 inline" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#3B82F6] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#3B82F6] ml-1 inline" />
    )
  }

  return (
    <Card className="select-none flex flex-col">
      <CardHeader
        telemetry={`${projects.length} RECORDS`}
        action={
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#9AA5C1] hidden sm:inline">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-6 bg-[#0A0E1A] border border-[#232D47] rounded px-1.5 text-[10px] font-mono text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Investigation Results Ledger</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left text-xs min-w-[1100px]">
          <thead>
            <tr className="h-7 border-b border-[#232D47] bg-[#0D1424] text-[#9AA5C1] text-[10px] font-mono uppercase tracking-wider">
              <th className="px-2.5 py-1 text-center w-16">Risk</th>
              <th
                onClick={() => handleSort('workCode')}
                className="px-2.5 py-1 cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap"
              >
                Project ID {renderSortIndicator('workCode')}
              </th>
              <th className="px-2.5 py-1 whitespace-nowrap min-w-[200px]">Project Title</th>
              <th
                onClick={() => handleSort('state')}
                className="px-2.5 py-1 cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap"
              >
                State {renderSortIndicator('state')}
              </th>
              <th className="px-2.5 py-1 whitespace-nowrap">Constituency</th>
              <th className="px-2.5 py-1 whitespace-nowrap">MP</th>
              <th className="px-2.5 py-1 whitespace-nowrap">Vendor</th>
              <th className="px-2.5 py-1 whitespace-nowrap">Agency</th>
              <th
                onClick={() => handleSort('sanctionedAmount')}
                className="px-2.5 py-1 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap"
              >
                Sanctioned {renderSortIndicator('sanctionedAmount')}
              </th>
              <th
                onClick={() => handleSort('disbursedAmount')}
                className="px-2.5 py-1 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap"
              >
                Disbursed {renderSortIndicator('disbursedAmount')}
              </th>
              <th className="px-2.5 py-1 text-center whitespace-nowrap">Status</th>
              <th className="px-2.5 py-1 whitespace-nowrap min-w-[160px]">Anomaly</th>
              <th
                onClick={() => handleSort('riskScore')}
                className="px-2.5 py-1 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap w-24"
              >
                Score {renderSortIndicator('riskScore')}
              </th>
              <th className="px-2.5 py-1 text-center w-14">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={14} className="h-32 text-center text-[#667090] font-sans">
                  No projects match current filter criteria. Try broadening your investigation scope.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((p) => {
                const isSelected = selectedProjectId === p.id
                const isCritical = p.riskLevel === 'critical'
                const isHigh = p.riskLevel === 'high'

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`group border-b border-[#161F36] hover:bg-[#161F36] transition-colors cursor-pointer h-8.5 ${
                      isSelected ? 'bg-[#161F36]' : 'bg-[#10182B]'
                    }`}
                  >
                    {/* Risk Badge */}
                    <td
                      className={`px-2.5 text-center transition-all ${
                        isSelected ? 'border-l-2 border-l-[#3B82F6]' : 'group-hover:border-l-2 group-hover:border-l-[#3B82F6]'
                      }`}
                    >
                      <RiskBadge level={p.riskLevel} size="sm" withPip={isCritical} pulse={isCritical} />
                    </td>

                    {/* Project ID / Work Code */}
                    <td className="px-2.5 font-mono text-[11px] text-[#adc6ff] font-bold whitespace-nowrap">
                      {p.workCode}
                    </td>

                    {/* Project Title */}
                    <td className="px-2.5 font-sans text-xs text-[#E7EBF5] max-w-xs truncate" title={p.title}>
                      {p.title}
                    </td>

                    {/* State */}
                    <td className="px-2.5 font-sans text-xs text-[#9AA5C1] whitespace-nowrap">
                      {p.state}
                    </td>

                    {/* Constituency */}
                    <td className="px-2.5 font-sans text-xs text-[#9AA5C1] whitespace-nowrap max-w-[140px] truncate" title={p.constituency}>
                      {p.constituency}
                    </td>

                    {/* MP */}
                    <td className="px-2.5 font-sans text-xs text-[#E7EBF5] whitespace-nowrap">
                      <span className="font-semibold">{p.mpName}</span>{' '}
                      <span className="font-mono text-[10px] text-[#667090]">({p.mpHouse})</span>
                    </td>

                    {/* Vendor */}
                    <td className="px-2.5 font-sans text-xs text-[#9AA5C1] whitespace-nowrap max-w-[140px] truncate" title={p.vendor}>
                      {p.vendor}
                    </td>

                    {/* Agency */}
                    <td className="px-2.5 font-sans text-xs text-[#9AA5C1] whitespace-nowrap max-w-[140px] truncate" title={p.agency}>
                      {p.agency}
                    </td>

                    {/* Sanctioned */}
                    <td className="px-2.5 font-mono text-xs font-tabular text-right text-[#E7EBF5] whitespace-nowrap">
                      {p.sanctionedDisplay}
                    </td>

                    {/* Disbursed */}
                    <td className="px-2.5 font-mono text-xs font-tabular text-right text-[#EF4444] whitespace-nowrap font-semibold">
                      {p.disbursedDisplay}
                    </td>

                    {/* Status */}
                    <td className="px-2.5 text-center whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                          p.status === 'Under Investigation'
                            ? 'bg-[#401515] text-[#EF4444] border border-[#EF4444]/40'
                            : 'bg-[#161F36] text-[#9AA5C1] border border-[#232D47]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Anomaly */}
                    <td className="px-2.5 font-sans text-[11px] text-[#EF4444] max-w-[180px] truncate font-medium" title={p.primaryAnomaly}>
                      {p.primaryAnomaly}
                    </td>

                    {/* Risk Score */}
                    <td className="px-2.5 text-right whitespace-nowrap">
                      <span
                        className={`font-mono text-xs font-bold font-tabular px-1.5 py-0.5 rounded ${
                          isCritical
                            ? 'bg-[#401515] text-[#EF4444]'
                            : isHigh
                            ? 'bg-[#3A2A0C] text-[#F59E0B]'
                            : 'bg-[#362E0C] text-[#EAB308]'
                        }`}
                      >
                        {p.riskScore}
                      </span>
                    </td>

                    {/* Actions: Open Dossier */}
                    <td className="px-2.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenDossier(p)
                        }}
                        title="Open statutory audit dossier"
                        className="p-1 rounded bg-[#161F36] hover:bg-[#3B82F6] text-[#9AA5C1] hover:text-white transition-colors cursor-pointer border border-[#232D47]"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </CardContent>

      {/* Pagination Footer */}
      <CardFooter className="flex items-center justify-between py-2 px-3">
        <div className="text-[11px] font-mono text-[#9AA5C1]">
          Showing{' '}
          <span className="text-[#E7EBF5] font-semibold">
            {sortedProjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="text-[#E7EBF5] font-semibold">
            {Math.min(currentPage * pageSize, sortedProjects.length)}
          </span>{' '}
          of <span className="text-[#E7EBF5] font-semibold">{sortedProjects.length}</span> results
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="h-6 w-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="font-mono text-[11px] px-2 text-[#E7EBF5]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="h-6 w-6 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#9AA5C1] hover:text-[#E7EBF5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
