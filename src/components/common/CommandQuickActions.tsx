import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  FolderKanban,
  FileText,
  Store,
  Building2,
  UserCheck,
  ShieldAlert,
} from 'lucide-react'
import { escalateToCase, findCaseForProject } from '@/lib/caseRegistry'
import { getVendorById } from '@/data/vendors'
import { getAgencyById } from '@/data/agencies'
import { getMpById } from '@/data/mps'
import { cn } from '@/lib/utils'

export interface CommandQuickActionsProps {
  projectId?: string
  workCode?: string
  projectTitle?: string
  caseId?: string
  vendorName?: string
  vendorId?: string
  agencyName?: string
  agencyId?: string
  mpName?: string
  mpId?: string
  alertId?: string
  onOpenDossier?: () => void
  onOpenEvidence?: () => void
  size?: 'compact' | 'standard'
  layout?: 'grid' | 'row' | 'wrap'
  showOnly?: Array<'investigate' | 'case' | 'project' | 'vendor' | 'agency' | 'mp' | 'evidence'>
  className?: string
}

export const CommandQuickActions: React.FC<CommandQuickActionsProps> = ({
  projectId,
  workCode,
  projectTitle,
  caseId,
  vendorName,
  vendorId,
  agencyName,
  agencyId,
  mpName,
  mpId,
  alertId,
  onOpenDossier,
  onOpenEvidence,
  size = 'compact',
  layout = 'wrap',
  showOnly,
  className,
}) => {
  const navigate = useNavigate()

  // Resolve linked case
  const resolvedCase =
    caseId ||
    (projectId ? findCaseForProject(projectId)?.id : undefined) ||
    (workCode ? findCaseForProject(workCode)?.id : undefined)

  // Resolve vendor ID
  const resolvedVendorId = React.useMemo(() => {
    if (vendorId) return vendorId
    if (vendorName) {
      const match = getVendorById(vendorName)
      return match ? match.id : encodeURIComponent(vendorName)
    }
    return undefined
  }, [vendorId, vendorName])

  // Resolve agency ID
  const resolvedAgencyId = React.useMemo(() => {
    if (agencyId) return agencyId
    if (agencyName) {
      const match = getAgencyById(agencyName)
      return match ? match.id : encodeURIComponent(agencyName)
    }
    return undefined
  }, [agencyId, agencyName])

  // Resolve MP ID
  const resolvedMpId = React.useMemo(() => {
    if (mpId) return mpId
    if (mpName) {
      const match = getMpById(mpName)
      return match ? match.id : encodeURIComponent(mpName)
    }
    return undefined
  }, [mpId, mpName])

  const handleInvestigate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (projectId || workCode) {
      navigate(`/investigation?project=${encodeURIComponent(projectId || workCode!)}`)
    } else if (vendorName) {
      navigate(`/investigation?search=${encodeURIComponent(vendorName)}`)
    } else {
      navigate('/investigation')
    }
  }

  const handleOpenOrEscalateCase = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (resolvedCase) {
      navigate(`/cases?id=${encodeURIComponent(resolvedCase)}`)
    } else if (projectId || workCode) {
      const newCase = escalateToCase({
        projectId,
        workCode,
        title: projectTitle,
        reason: `Statutory case established via Command Center quick action.`,
      })
      navigate(`/cases?id=${encodeURIComponent(newCase.id)}`)
    } else if (vendorName) {
      navigate(`/cases?q=${encodeURIComponent(vendorName)}`)
    } else {
      navigate('/cases')
    }
  }

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpenDossier) {
      onOpenDossier()
    } else if (projectId || workCode) {
      navigate(`/projects?id=${encodeURIComponent(projectId || workCode!)}`)
    } else {
      navigate('/projects')
    }
  }

  const handleViewVendor = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (resolvedVendorId) {
      navigate(`/vendors/${encodeURIComponent(resolvedVendorId)}`)
    } else if (vendorName) {
      navigate(`/vendors?search=${encodeURIComponent(vendorName)}`)
    } else {
      navigate('/vendors')
    }
  }

  const handleViewAgency = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (resolvedAgencyId) {
      navigate(`/agencies/${encodeURIComponent(resolvedAgencyId)}`)
    } else if (agencyName) {
      navigate(`/agencies?search=${encodeURIComponent(agencyName)}`)
    } else {
      navigate('/agencies')
    }
  }

  const handleViewMp = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (resolvedMpId) {
      navigate(`/mps/${encodeURIComponent(resolvedMpId)}`)
    } else if (mpName) {
      navigate(`/mps?search=${encodeURIComponent(mpName)}`)
    } else {
      navigate('/mps')
    }
  }

  const handleViewEvidence = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpenEvidence) {
      onOpenEvidence()
    } else if (alertId) {
      navigate(`/alerts?id=${encodeURIComponent(alertId)}`)
    } else if (projectId || workCode) {
      navigate(`/investigation?project=${encodeURIComponent(projectId || workCode!)}`)
    } else {
      navigate('/anomalies')
    }
  }

  const isVisible = (actionKey: 'investigate' | 'case' | 'project' | 'vendor' | 'agency' | 'mp' | 'evidence') => {
    if (!showOnly) return true
    return showOnly.includes(actionKey)
  }

  const buttonHeight = size === 'compact' ? 'h-7 text-[11px] px-2' : 'h-8 text-xs px-2.5'

  const containerClasses =
    layout === 'grid'
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5'
      : layout === 'row'
      ? 'flex items-center gap-1.5 overflow-x-auto'
      : 'flex items-center gap-1.5 flex-wrap'

  return (
    <div className={cn('select-none font-mono', containerClasses, className)}>
      {/* 1. Investigate */}
      {isVisible('investigate') && (
        <button
          type="button"
          onClick={handleInvestigate}
          className={cn(
            'rounded font-semibold bg-[#10233F] hover:bg-[#163158] text-[#3B82F6] border border-[#3B82F6]/40 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title="Open Forensic Investigation Workspace"
        >
          <Search className="w-3 h-3 text-[#3B82F6]" />
          <span>Investigate</span>
        </button>
      )}

      {/* 2. Open Case / Escalate to Case */}
      {isVisible('case') && (
        <button
          type="button"
          onClick={handleOpenOrEscalateCase}
          className={cn(
            'rounded font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            resolvedCase
              ? 'bg-[#1e1a38] hover:bg-[#2b2450] text-[#a78bfa] border border-[#a78bfa]/40'
              : 'bg-[#3A1E1E] hover:bg-[#522525] text-[#f87171] border border-[#ef4444]/40',
            buttonHeight
          )}
          title={resolvedCase ? `Open Audit Case ${resolvedCase}` : 'Escalate Finding to Formal Sovereign Case'}
        >
          <FolderKanban className="w-3 h-3" />
          <span>{resolvedCase ? `Case ${resolvedCase}` : 'Escalate to Case'}</span>
        </button>
      )}

      {/* 3. View Project */}
      {isVisible('project') && (projectId || workCode) && (
        <button
          type="button"
          onClick={handleViewProject}
          className={cn(
            'rounded font-semibold bg-[#10182B] hover:bg-[#161F36] text-[#adc6ff] border border-[#232D47] hover:border-[#3B82F6]/50 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title="View Project in Portfolio Ledger"
        >
          <FileText className="w-3 h-3 text-[#38BDF8]" />
          <span>Project</span>
        </button>
      )}

      {/* 4. View Vendor */}
      {isVisible('vendor') && (vendorName || vendorId) && (
        <button
          type="button"
          onClick={handleViewVendor}
          className={cn(
            'rounded font-semibold bg-[#10182B] hover:bg-[#161F36] text-[#fde047] border border-[#232D47] hover:border-[#fde047]/40 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title={`View Contractor Profile: ${vendorName || vendorId}`}
        >
          <Store className="w-3 h-3 text-[#EAB308]" />
          <span>Vendor</span>
        </button>
      )}

      {/* 5. View Agency */}
      {isVisible('agency') && (agencyName || agencyId) && (
        <button
          type="button"
          onClick={handleViewAgency}
          className={cn(
            'rounded font-semibold bg-[#10182B] hover:bg-[#161F36] text-[#7dd3fc] border border-[#232D47] hover:border-[#38BDF8]/40 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title={`View Agency Profile: ${agencyName || agencyId}`}
        >
          <Building2 className="w-3 h-3 text-[#38BDF8]" />
          <span>Agency</span>
        </button>
      )}

      {/* 6. View MP */}
      {isVisible('mp') && (mpName || mpId) && (
        <button
          type="button"
          onClick={handleViewMp}
          className={cn(
            'rounded font-semibold bg-[#10182B] hover:bg-[#161F36] text-[#86efac] border border-[#232D47] hover:border-[#4ade80]/40 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title={`View MP & Constituency Profile: ${mpName || mpId}`}
        >
          <UserCheck className="w-3 h-3 text-[#4ADE80]" />
          <span>MP</span>
        </button>
      )}

      {/* 7. View Evidence */}
      {isVisible('evidence') && (
        <button
          type="button"
          onClick={handleViewEvidence}
          className={cn(
            'rounded font-semibold bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border border-[#232D47] flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0',
            buttonHeight
          )}
          title="Inspect Forensic Evidence Slips & GeoTIFFs"
        >
          <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
          <span>Evidence</span>
        </button>
      )}
    </div>
  )
}
