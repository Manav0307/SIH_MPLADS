import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, ArrowRight, Shield } from 'lucide-react'
import { ProjectRecord } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'
import { findCaseForProject } from '@/lib/caseRegistry'

interface ProjectTableRowProps {
  project: ProjectRecord
  isSelected: boolean
  density: 'standard' | 'dense'
  onSelectProject: (project: ProjectRecord) => void
  onInvestigate: (project: ProjectRecord) => void
}

function formatSpent(amount: number): string {
  if (amount === 0) return '₹ 0.00'
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  return `₹ ${(amount / 100000).toFixed(2)} L`
}

function getStatusPillConfig(status: ProjectRecord['status']): {
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

export const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  project,
  isSelected,
  density,
  onSelectProject,
  onInvestigate,
}) => {
  const navigate = useNavigate()
  const activeCase = findCaseForProject(project.id) || findCaseForProject(project.workCode)
  const rowHeightClass = density === 'dense' ? 'py-1.5' : 'py-2.5'
  const textClass = density === 'dense' ? 'text-[11px]' : 'text-xs'
  const statusCfg = getStatusPillConfig(project.status)

  return (
    <tr
      onClick={() => onSelectProject(project)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelectProject(project)
        }
      }}
      className={`group transition-colors border-b border-[#161F36] hover:bg-[#161F36] cursor-pointer relative ${
        isSelected ? 'bg-[#161F36]' : ''
      }`}
    >
      {/* 1. Risk Badge */}
      <td className={`${rowHeightClass} px-2.5 whitespace-nowrap align-middle border-l-2 ${
        isSelected
          ? 'border-l-[#3B82F6]'
          : 'border-l-transparent group-hover:border-l-[#3B82F6]'
      }`}>
        <RiskBadge
          level={project.riskLevel}
          score={project.riskScore}
          withPip={project.riskLevel === 'critical'}
          pulse={project.riskLevel === 'critical'}
          size="sm"
        />
      </td>

      {/* 2. Risk Score */}
      <td className={`${rowHeightClass} px-2 text-center font-mono font-tabular font-bold align-middle ${
        project.riskScore >= 90
          ? 'text-[#EF4444]'
          : project.riskScore >= 70
          ? 'text-[#F59E0B]'
          : project.riskScore >= 40
          ? 'text-[#EAB308]'
          : 'text-[#22C55E]'
      }`}>
        {project.riskScore}
      </td>

      {/* 3. Work ID */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle font-mono ${textClass}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelectProject(project)
          }}
          className="text-[#3B82F6] hover:underline font-bold text-left cursor-pointer inline-flex items-center gap-1"
          title={`Inspect ${project.workCode}`}
        >
          <span>{project.workCode}</span>
        </button>
      </td>

      {/* 4. Project / Work (Title with highest visual emphasis) */}
      <td className={`${rowHeightClass} px-3 align-middle max-w-[280px]`}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelectProject(project)
          }}
          className="text-[#E7EBF5] font-semibold hover:text-[#3B82F6] transition-colors truncate text-xs"
          title={project.title}
        >
          {project.title}
        </div>
        <div className="text-[10px] text-[#667090] font-sans truncate mt-0.5">
          {project.category} &bull; {project.district}
        </div>
      </td>

      {/* 5. State */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle text-[#9AA5C1] ${textClass}`}>
        {project.state}
      </td>

      {/* 6. District */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle text-[#E7EBF5] font-medium ${textClass}`}>
        <Link
          to={`/geospatial?state=${encodeURIComponent(project.state)}&district=${encodeURIComponent(project.district)}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-[#3B82F6] hover:underline transition-colors"
          title={`Filter on GIS Map: ${project.district}`}
        >
          {project.district}
        </Link>
      </td>

      {/* 7. Constituency */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle text-[#9AA5C1] font-mono text-[10px]`}>
        {project.constituency}
      </td>

      {/* 8. MP */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle`}>
        <Link
          to={`/mps/${encodeURIComponent(project.mpName)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#E7EBF5] text-[11px] font-semibold hover:text-[#3B82F6] hover:underline block truncate transition-colors"
          title={`View MP profile: ${project.mpName}`}
        >
          {project.mpName}
        </Link>
        <div className="text-[10px] text-[#667090] font-mono">{project.mpHouse}</div>
      </td>

      {/* 9. Category */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle text-[#9AA5C1] ${textClass}`}>
        {project.category}
      </td>

      {/* 10. Vendor */}
      <td className={`${rowHeightClass} px-2 align-middle max-w-[160px]`}>
        <Link
          to={`/vendors/${encodeURIComponent(project.vendor)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#F59E0B] text-[11px] truncate font-medium block hover:text-[#60A5FA] hover:underline transition-colors"
          title={`View Vendor profile: ${project.vendor}`}
        >
          {project.vendor}
        </Link>
        {project.vendorGst && (
          <div className="text-[9px] text-[#667090] font-mono truncate">
            {project.vendorGst}
          </div>
        )}
      </td>

      {/* 11. Implementing Agency */}
      <td className={`${rowHeightClass} px-2 align-middle max-w-[150px]`}>
        <Link
          to={`/agencies/${encodeURIComponent(project.agency)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#9AA5C1] text-[11px] truncate block hover:text-[#3B82F6] hover:underline transition-colors"
          title={`View Agency profile: ${project.agency}`}
        >
          {project.agency}
        </Link>
      </td>

      {/* 12. Recommended Date */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle font-mono text-[10px] text-[#9AA5C1]`}>
        {project.timeline?.recommended || '-'}
      </td>

      {/* 13. Sanctioned Amount */}
      <td className={`${rowHeightClass} px-2.5 text-right font-mono font-tabular text-[#E7EBF5] font-semibold whitespace-nowrap align-middle ${textClass}`}>
        {project.sanctionedDisplay}
      </td>

      {/* 14. Disbursed Amount */}
      <td className={`${rowHeightClass} px-2.5 text-right font-mono font-tabular whitespace-nowrap align-middle`}>
        <div
          className={`font-semibold ${
            project.disbursedPercent >= 90
              ? 'text-[#EF4444]'
              : project.disbursedPercent >= 70
              ? 'text-[#F59E0B]'
              : 'text-[#E7EBF5]'
          } ${textClass}`}
        >
          {project.disbursedDisplay}
        </div>
        <div className="text-[10px] text-[#9AA5C1] font-normal">
          {project.disbursedPercent.toFixed(0)}%
        </div>
      </td>

      {/* 15. Spent Amount */}
      <td className={`${rowHeightClass} px-2.5 text-right font-mono font-tabular text-[#22C55E] font-semibold whitespace-nowrap align-middle ${textClass}`}>
        {formatSpent(project.spentAmount)}
      </td>

      {/* 16. Status */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle`}>
        <StatusPill
          label={statusCfg.label}
          variant={statusCfg.variant}
          pulse={statusCfg.pulse}
        />
      </td>

      {/* 17. Delay */}
      <td className={`${rowHeightClass} px-2 text-center font-mono font-tabular whitespace-nowrap align-middle text-[11px] font-bold ${
        project.agingDays >= 180
          ? 'text-[#EF4444]'
          : project.agingDays >= 90
          ? 'text-[#F59E0B]'
          : project.agingDays > 0
          ? 'text-[#EAB308]'
          : 'text-[#22C55E]'
      }`}>
        {project.agingDisplay}
      </td>

      {/* 18. Primary Anomaly */}
      <td className={`${rowHeightClass} px-2.5 align-middle max-w-[220px]`}>
        <div
          className={`px-1.5 py-0.5 rounded border text-[10px] truncate ${
            project.riskLevel === 'critical'
              ? 'bg-[#401515]/40 text-[#EF4444] border-[#EF4444]/40'
              : project.riskLevel === 'high'
              ? 'bg-[#3A2A0C]/40 text-[#F59E0B] border-[#F59E0B]/40'
              : project.riskLevel === 'medium'
              ? 'bg-[#362E0C]/40 text-[#EAB308] border-[#EAB308]/40'
              : 'bg-[#0F3020]/40 text-[#22C55E] border-[#22C55E]/40'
          }`}
          title={project.primaryAnomaly}
        >
          {project.primaryAnomaly}
        </div>
      </td>

      {/* 19. Action Buttons */}
      <td className={`${rowHeightClass} px-2 whitespace-nowrap align-middle text-right`}>
        <div className="flex items-center justify-end gap-1">
          {/* Active Case Button if exists */}
          {activeCase && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/cases?id=${activeCase.id}`)
              }}
              className="px-1.5 py-1 rounded bg-[#1c1836] hover:bg-[#28204d] text-[#a5b4fc] hover:text-white border border-[#4f46e5]/40 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
              title={`Jump to Audit Case: ${activeCase.id}`}
            >
              <Shield className="w-2.5 h-2.5 text-[#818cf8]" />
              <span>Case</span>
            </button>
          )}

          {/* Inspect Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelectProject(project)
            }}
            className="px-2 py-1 rounded bg-[#10182B] hover:bg-[#161F36] text-[#3B82F6] hover:text-white border border-[#232D47] hover:border-[#3B82F6]/50 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Open Project Dossier"
          >
            <Eye className="w-2.5 h-2.5" />
            <span>Inspect</span>
          </button>

          {/* Investigate Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onInvestigate(project)
            }}
            className="px-2 py-1 rounded bg-[#10182B] hover:bg-[#161F36] text-[#F59E0B] hover:text-white border border-[#232D47] hover:border-[#F59E0B]/50 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Transfer case to Investigation Workspace"
          >
            <span>Investigate</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
