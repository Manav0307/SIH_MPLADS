import React, { useState, useMemo } from 'react'
import {
  Gavel,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react'
import { ProjectRecord } from '@/types'

interface CriticalProjectsTableProps {
  projects: ProjectRecord[]
  onSelectProject: (project: ProjectRecord) => void
  selectedProjectId?: string
}

export const CriticalProjectsTable: React.FC<CriticalProjectsTableProps> = ({
  projects,
  onSelectProject,
  selectedProjectId,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'riskScore' | 'sanctionedAmount' | 'disbursedAmount' | 'agingDays'>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Filter by search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchTerm.toLowerCase()
      return (
        p.workCode.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.mpName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.primaryAnomaly.toLowerCase().includes(q)
      )
    })
  }, [projects, searchTerm])

  // Sort projects
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })
  }, [filteredProjects, sortField, sortOrder])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize))
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedProjects.slice(start, start + pageSize)
  }, [sortedProjects, currentPage, pageSize])

  const handleSort = (field: 'riskScore' | 'sanctionedAmount' | 'disbursedAmount' | 'agingDays') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Work ID',
      'Title',
      'State',
      'District',
      'Constituency',
      'MP',
      'Category',
      'Sanctioned Amount',
      'Disbursed Amount',
      'Disbursed %',
      'Delay Days',
      'Risk Score',
      'Risk Level',
      'Vendor',
      'Primary Anomaly',
    ]

    const rows = sortedProjects.map((p) => [
      `"${p.workCode}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      `"${p.constituency}"`,
      `"${p.mpName}"`,
      `"${p.category}"`,
      p.sanctionedAmount,
      p.disbursedAmount,
      p.disbursedPercent,
      p.agingDays,
      p.riskScore,
      p.riskLevel.toUpperCase(),
      `"${p.vendor}"`,
      `"${p.primaryAnomaly.replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `MPLADS_High_Risk_Ledger_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col overflow-hidden select-none">
      {/* Table Header Toolbar */}
      <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[#EF4444]" />
          <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
            Critical / High-Risk Projects Ledger
          </h2>
          <span className="font-mono text-[10px] bg-[#401515] text-[#ffdad6] px-2 py-0.5 rounded font-bold border border-[#EF4444]/40">
            {sortedProjects.length} Works
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Filter current list..."
              className="bg-[#0A0E1A] border border-[#232D47] rounded px-2 pl-6 py-0.5 text-xs font-sans text-[#E7EBF5] placeholder:text-[#667090] focus:outline-none focus:border-[#3B82F6] text-[11px] w-36 lg:w-44"
            />
            <Search className="w-3 h-3 text-[#667090] absolute left-1.5 top-1.5 pointer-events-none" />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] font-mono text-[10px] px-2 py-1 rounded border border-[#232D47] flex items-center gap-1 transition-colors cursor-pointer"
            title="Download CSV export of ledger"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Dense Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans text-xs">
          <thead>
            <tr className="bg-[#0D1424] border-b border-[#232D47] text-[#9AA5C1] font-sans text-[11px] uppercase font-semibold">
              <th
                className="py-2 px-3 cursor-pointer hover:text-[#E7EBF5]"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-1">
                  <span>Risk</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>
              <th className="py-2 px-2">Work ID &amp; Description</th>
              <th className="py-2 px-2">Location &amp; MP</th>
              <th className="py-2 px-2">Category</th>
              <th
                className="py-2 px-2 text-right cursor-pointer hover:text-[#E7EBF5]"
                onClick={() => handleSort('sanctionedAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Sanctioned</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>
              <th
                className="py-2 px-2 text-right cursor-pointer hover:text-[#E7EBF5]"
                onClick={() => handleSort('disbursedAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Disbursed</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>
              <th
                className="py-2 px-2 text-center cursor-pointer hover:text-[#E7EBF5]"
                onClick={() => handleSort('agingDays')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Aging</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>
              <th className="py-2 px-3">Primary Forensic Anomaly Trigger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#161F36]">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#667090] font-sans text-xs">
                  No projects found matching the active search or global filter criteria.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((p) => {
                const isSelected = selectedProjectId === p.id
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`hover:bg-[#161F36] transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#161F36]' : ''
                    }`}
                  >
                    {/* Risk Badge */}
                    <td className="py-2 px-3 whitespace-nowrap align-middle">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 border ${
                          p.riskLevel === 'critical'
                            ? 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40'
                            : p.riskLevel === 'high'
                            ? 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40'
                            : 'bg-[#362E0C] text-[#EAB308] border-[#EAB308]/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.riskLevel === 'critical'
                              ? 'bg-[#EF4444]'
                              : p.riskLevel === 'high'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#EAB308]'
                          }`}
                        />
                        {p.riskScore} {p.riskLevel === 'critical' ? 'CRIT' : p.riskLevel.toUpperCase()}
                      </span>
                    </td>

                    {/* Work ID & Description */}
                    <td className="py-2 px-2 align-middle">
                      <div className="font-mono text-[#3B82F6] text-[11px] font-bold group-hover:underline">
                        {p.workCode}
                      </div>
                      <div
                        className="text-[#E7EBF5] text-xs truncate max-w-[210px]"
                        title={p.title}
                      >
                        {p.title}
                      </div>
                    </td>

                    {/* Location & MP */}
                    <td className="py-2 px-2 whitespace-nowrap align-middle">
                      <div className="text-[#E7EBF5] text-[11px] font-semibold">
                        {p.district}, {p.state.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-[#9AA5C1] text-[10px]">{p.mpName}</div>
                    </td>

                    {/* Category */}
                    <td className="py-2 px-2 whitespace-nowrap text-[#9AA5C1] text-[11px] align-middle">
                      {p.category}
                    </td>

                    {/* Sanctioned */}
                    <td className="py-2 px-2 text-right font-mono font-tabular text-[#E7EBF5] font-semibold align-middle">
                      {p.sanctionedDisplay}
                    </td>

                    {/* Disbursed */}
                    <td className="py-2 px-2 text-right font-mono font-tabular align-middle">
                      <span
                        className={`font-bold ${
                          p.disbursedPercent >= 90
                            ? 'text-[#EF4444]'
                            : p.disbursedPercent >= 70
                            ? 'text-[#F59E0B]'
                            : 'text-[#E7EBF5]'
                        }`}
                      >
                        {p.disbursedDisplay}
                      </span>{' '}
                      <span className="text-[10px] text-[#9AA5C1] font-normal">
                        ({p.disbursedPercent.toFixed(0)}%)
                      </span>
                    </td>

                    {/* Aging */}
                    <td className="py-2 px-2 text-center font-mono font-tabular text-[11px] font-bold align-middle">
                      <span
                        className={
                          p.agingDays >= 180
                            ? 'text-[#EF4444]'
                            : p.agingDays >= 90
                            ? 'text-[#F59E0B]'
                            : 'text-[#EAB308]'
                        }
                      >
                        {p.agingDisplay}
                      </span>
                    </td>

                    {/* Primary Forensic Anomaly Trigger */}
                    <td className="py-2 px-3 align-middle">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-sans max-w-[240px] truncate ${
                          p.riskLevel === 'critical'
                            ? 'bg-[#401515]/30 text-[#EF4444] border-[#EF4444]/30'
                            : 'bg-[#3A2A0C]/30 text-[#F59E0B] border-[#F59E0B]/30'
                        }`}
                        title={p.primaryAnomaly}
                      >
                        {p.primaryAnomaly}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="p-2 border-t border-[#232D47] bg-[#0A0E1A] flex items-center justify-between text-[11px] font-mono text-[#9AA5C1]">
        <span>
          Showing {paginatedProjects.length} of {sortedProjects.length} priority anomalies (Filtered for immediate statutory review)
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-0.5 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => setCurrentPage(pg)}
              className={`px-2 py-0.5 rounded border text-[10px] font-bold cursor-pointer ${
                currentPage === pg
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40'
                  : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1] hover:bg-[#161F36]'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-0.5 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
