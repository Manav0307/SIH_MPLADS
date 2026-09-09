import React from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  FolderKanban,
  AlertTriangle,
  FileText,
  Store,
  Building2,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InvestigationBreadcrumbsProps {
  caseItem?: { id: string; workCode?: string; title?: string } | null
  findingItem?: { id: string; title: string } | null
  projectItem?: { id: string; workCode?: string; title?: string } | null
  vendorItem?: { id?: string; name: string } | null
  agencyItem?: { id?: string; name: string } | null
  mpItem?: { id?: string; name: string; constituency?: string } | null
  // Flat convenience properties
  caseId?: string
  caseTitle?: string
  anomalyTitle?: string
  findingId?: string
  projectWorkCode?: string
  projectTitle?: string
  vendorName?: string
  agencyName?: string
  mpName?: string
  className?: string
}

export const InvestigationBreadcrumbs: React.FC<InvestigationBreadcrumbsProps> = ({
  caseItem,
  findingItem,
  projectItem,
  vendorItem,
  agencyItem,
  mpItem,
  caseId,
  caseTitle,
  anomalyTitle,
  findingId,
  projectWorkCode,
  projectTitle,
  vendorName,
  agencyName,
  mpName,
  className,
}) => {
  const effectiveCase = caseItem || (caseId ? { id: caseId, title: caseTitle } : null)
  const effectiveFinding =
    findingItem ||
    (anomalyTitle ? { id: findingId || 'finding', title: anomalyTitle } : null)
  const effectiveProject =
    projectItem ||
    (projectWorkCode ? { id: projectWorkCode, workCode: projectWorkCode, title: projectTitle } : null)
  const effectiveVendor = vendorItem || (vendorName ? { name: vendorName } : null)
  const effectiveAgency = agencyItem || (agencyName ? { name: agencyName } : null)
  const effectiveMp = mpItem || (mpName ? { name: mpName } : null)

  // Only render if at least one item is provided
  if (
    !effectiveCase &&
    !effectiveFinding &&
    !effectiveProject &&
    !effectiveVendor &&
    !effectiveAgency &&
    !effectiveMp
  ) {
    return null
  }

  return (
    <nav
      aria-label="Forensic Investigation Context Lineage"
      className={cn(
        'flex items-center gap-1.5 flex-wrap text-xs font-mono py-1 px-2.5 rounded bg-[#0A0E1A]/80 border border-[#232D47] text-[#9AA5C1] select-none',
        className
      )}
    >
      <span className="text-[10px] uppercase font-bold text-[#667090] tracking-wider shrink-0">
        LINEAGE:
      </span>

      {/* 1. Case Node */}
      {effectiveCase && (
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/cases?id=${encodeURIComponent(effectiveCase.id)}`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#3B82F6] hover:text-[#60a5fa] transition-colors"
            title={effectiveCase.title || effectiveCase.id}
          >
            <FolderKanban className="w-3 h-3 text-[#3B82F6]" />
            <span className="font-bold">{effectiveCase.id}</span>
          </Link>
          {(effectiveFinding || effectiveProject || effectiveVendor || effectiveAgency || effectiveMp) && (
            <ChevronRight className="w-3 h-3 text-[#667090]" />
          )}
        </div>
      )}

      {/* 2. Finding / Anomaly Node */}
      {effectiveFinding && (
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/anomalies?search=${encodeURIComponent(effectiveFinding.id || effectiveFinding.title)}`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#EF4444] hover:text-[#f87171] transition-colors max-w-[180px] truncate"
            title={effectiveFinding.title}
          >
            <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
            <span className="truncate">{effectiveFinding.title}</span>
          </Link>
          {(effectiveProject || effectiveVendor || effectiveAgency || effectiveMp) && (
            <ChevronRight className="w-3 h-3 text-[#667090]" />
          )}
        </div>
      )}

      {/* 3. Project Node */}
      {effectiveProject && (
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/projects?id=${encodeURIComponent(effectiveProject.id)}`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#adc6ff] hover:text-[#dbeafe] transition-colors max-w-[190px] truncate"
            title={effectiveProject.title || effectiveProject.workCode}
          >
            <FileText className="w-3 h-3 text-[#38BDF8]" />
            <span className="truncate">{effectiveProject.workCode || effectiveProject.id}</span>
          </Link>
          {(effectiveVendor || effectiveAgency || effectiveMp) && (
            <ChevronRight className="w-3 h-3 text-[#667090]" />
          )}
        </div>
      )}

      {/* 4. Entity Nodes (Vendor, Agency, MP) */}
      <div className="flex items-center gap-1 flex-wrap shrink-0">
        {effectiveVendor && (
          <Link
            to={
              effectiveVendor.id
                ? `/vendors/${encodeURIComponent(effectiveVendor.id)}`
                : `/vendors?search=${encodeURIComponent(effectiveVendor.name)}`
            }
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#F59E0B] hover:text-[#fbbf24] transition-colors max-w-[160px] truncate"
            title={`Vendor: ${effectiveVendor.name}`}
          >
            <Store className="w-3 h-3 text-[#F59E0B]" />
            <span className="truncate">{effectiveVendor.name}</span>
          </Link>
        )}

        {effectiveAgency && (
          <Link
            to={
              effectiveAgency.id
                ? `/agencies/${encodeURIComponent(effectiveAgency.id)}`
                : `/agencies?search=${encodeURIComponent(effectiveAgency.name)}`
            }
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#38BDF8] hover:text-[#7dd3fc] transition-colors max-w-[160px] truncate"
            title={`Agency: ${effectiveAgency.name}`}
          >
            <Building2 className="w-3 h-3 text-[#38BDF8]" />
            <span className="truncate">{effectiveAgency.name}</span>
          </Link>
        )}

        {effectiveMp && (
          <Link
            to={
              effectiveMp.id
                ? `/mps/${encodeURIComponent(effectiveMp.id)}`
                : `/mps?search=${encodeURIComponent(effectiveMp.name)}`
            }
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] text-[#4ADE80] hover:text-[#86efac] transition-colors max-w-[160px] truncate"
            title={`MP: ${effectiveMp.name} (${effectiveMp.constituency || 'Constituency'})`}
          >
            <UserCheck className="w-3 h-3 text-[#4ADE80]" />
            <span className="truncate">{effectiveMp.name}</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
