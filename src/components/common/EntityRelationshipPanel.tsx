import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  FileText,
  Store,
  Building2,
  UserCheck,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { RiskBadge } from '@/components/common/RiskBadge'
import { findCaseForProject, escalateToCase } from '@/lib/caseRegistry'
import { getVendorById } from '@/data/vendors'
import { getAgencyById } from '@/data/agencies'
import { getMpById } from '@/data/mps'
import { mockProjects } from '@/data/projects'
import { RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

export interface EntityRelationshipPanelProps {
  projectId?: string
  workCode?: string
  projectTitle?: string
  vendorName?: string
  agencyName?: string
  mpName?: string
  state?: string
  district?: string
  constituency?: string
  caseId?: string
  anomaliesCount?: number
  alertsCount?: number
  riskScore?: number
  riskLevel?: RiskLevel
  compact?: boolean
  className?: string
}

export const EntityRelationshipPanel: React.FC<EntityRelationshipPanelProps> = ({
  projectId,
  workCode,
  projectTitle,
  vendorName,
  agencyName,
  mpName,
  state,
  district,
  constituency,
  caseId,
  compact = false,
  className,
}) => {
  const navigate = useNavigate()

  // Match Project Record if available
  const matchedProject = React.useMemo(() => {
    if (projectId) return mockProjects.find((p) => p.id === projectId)
    if (workCode) return mockProjects.find((p) => p.workCode === workCode)
    return null
  }, [projectId, workCode])

  const effectiveWorkCode = workCode || matchedProject?.workCode
  const effectiveProjectId = projectId || matchedProject?.id
  const effectiveTitle = projectTitle || matchedProject?.title
  const effectiveVendorName = vendorName || matchedProject?.vendor
  const effectiveAgencyName = agencyName || matchedProject?.agency
  const effectiveMpName = mpName || matchedProject?.mpName
  const effectiveState = state || matchedProject?.state
  const effectiveDistrict = district || matchedProject?.district
  const effectiveConstituency = constituency || matchedProject?.constituency

  // Resolve Linked Case
  const linkedCase = React.useMemo(() => {
    if (caseId) return { id: caseId, exists: true }
    const found =
      (effectiveWorkCode && findCaseForProject(effectiveWorkCode)) ||
      (effectiveProjectId && findCaseForProject(effectiveProjectId))
    if (found) return { id: found.id, status: found.status, riskScore: found.riskScore, exists: true }
    return null
  }, [caseId, effectiveWorkCode, effectiveProjectId])

  // Resolve Vendor
  const vendorRecord = React.useMemo(() => {
    return effectiveVendorName ? getVendorById(effectiveVendorName) : null
  }, [effectiveVendorName])

  // Resolve Agency
  const agencyRecord = React.useMemo(() => {
    return effectiveAgencyName ? getAgencyById(effectiveAgencyName) : null
  }, [effectiveAgencyName])

  // Resolve MP
  const mpRecord = React.useMemo(() => {
    return effectiveMpName ? getMpById(effectiveMpName) : null
  }, [effectiveMpName])

  const handleEscalateCase = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newCase = escalateToCase({
      projectId: effectiveProjectId,
      workCode: effectiveWorkCode,
      project: matchedProject,
      reason: `Case escalated via Entity Relationship Command Panel.`,
    })
    navigate(`/cases?id=${encodeURIComponent(newCase.id)}`)
  }

  return (
    <div
      className={cn(
        'p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2.5 select-none text-xs font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5 font-mono">
        <span className="text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
          <FolderKanban className="w-3.5 h-3.5 text-[#3B82F6]" />
          Related Statutory Entities &amp; Lineage
        </span>
        <span className="text-[10px] text-[#22C55E]">CROSS-REFERENCED</span>
      </div>

      <div
        className={cn(
          'grid gap-2',
          compact
            ? 'grid-cols-1'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {/* 1. Associated Sovereign Case */}
        <div className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
            <span className="flex items-center gap-1 uppercase font-semibold">
              <FolderKanban className="w-3 h-3 text-[#A855F7]" />
              Audit Case
            </span>
            {linkedCase ? (
              <span className="text-[#22C55E] bg-[#0F3020] px-1 py-0.2 rounded font-bold">
                ACTIVE CASE
              </span>
            ) : (
              <span className="text-[#9AA5C1]">UNESCALATED</span>
            )}
          </div>

          {linkedCase ? (
            <Link
              to={`/cases?id=${encodeURIComponent(linkedCase.id)}`}
              className="group flex items-center justify-between mt-0.5"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#a78bfa] group-hover:underline block">
                  {linkedCase.id}
                </span>
                <span className="text-[10px] font-mono text-[#9AA5C1]">
                  Status: {linkedCase.status || 'Under Review'}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#a78bfa] transition-colors" />
            </Link>
          ) : (
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[11px] text-[#667090]">No active case open</span>
              <button
                type="button"
                onClick={handleEscalateCase}
                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#3A1E1E] hover:bg-[#4d2626] text-[#f87171] border border-[#ef4444]/40 cursor-pointer font-bold transition-colors"
              >
                Escalate
              </button>
            </div>
          )}
        </div>

        {/* 2. Associated Project Asset */}
        {(effectiveWorkCode || effectiveProjectId) && (
          <Link
            to={
              effectiveProjectId
                ? `/projects?id=${encodeURIComponent(effectiveProjectId)}`
                : `/projects?search=${encodeURIComponent(effectiveWorkCode || '')}`
            }
            className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors flex flex-col justify-between space-y-1 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span className="flex items-center gap-1 uppercase font-semibold">
                <FileText className="w-3 h-3 text-[#38BDF8]" />
                Project Asset
              </span>
              <ExternalLink className="w-2.5 h-2.5 text-[#667090] group-hover:text-[#38BDF8]" />
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-[#38BDF8] block truncate">
                {effectiveWorkCode || effectiveProjectId}
              </span>
              <span className="text-[11px] text-[#E7EBF5] group-hover:text-[#adc6ff] block truncate mt-0.5">
                {effectiveTitle || 'MPLADS Capital Infrastructure'}
              </span>
            </div>
          </Link>
        )}

        {/* 3. Contractor / Vendor */}
        {effectiveVendorName && (
          <Link
            to={
              vendorRecord
                ? `/vendors/${encodeURIComponent(vendorRecord.id)}`
                : `/vendors?search=${encodeURIComponent(effectiveVendorName)}`
            }
            className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#F59E0B]/50 transition-colors flex flex-col justify-between space-y-1 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span className="flex items-center gap-1 uppercase font-semibold">
                <Store className="w-3 h-3 text-[#F59E0B]" />
                Contractor
              </span>
              {vendorRecord && (
                <RiskBadge level={vendorRecord.riskLevel} score={vendorRecord.riskScore} size="sm" />
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#F59E0B] block truncate">
                {effectiveVendorName}
              </span>
              <span className="text-[10px] font-mono text-[#667090] block truncate">
                {vendorRecord ? `GST: ${vendorRecord.gstin}` : 'Registered Vendor'}
              </span>
            </div>
          </Link>
        )}

        {/* 4. Implementing Agency */}
        {effectiveAgencyName && (
          <Link
            to={
              agencyRecord
                ? `/agencies/${encodeURIComponent(agencyRecord.id)}`
                : `/agencies?search=${encodeURIComponent(effectiveAgencyName)}`
            }
            className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#38BDF8]/50 transition-colors flex flex-col justify-between space-y-1 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span className="flex items-center gap-1 uppercase font-semibold">
                <Building2 className="w-3 h-3 text-[#38BDF8]" />
                Executing Agency
              </span>
              {agencyRecord && (
                <RiskBadge level={agencyRecord.riskLevel} score={agencyRecord.riskScore} size="sm" />
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#38BDF8] block truncate">
                {effectiveAgencyName}
              </span>
              <span className="text-[10px] font-mono text-[#667090] block truncate">
                {agencyRecord ? agencyRecord.agencyType : 'District Executing Division'}
              </span>
            </div>
          </Link>
        )}

        {/* 5. Member of Parliament */}
        {effectiveMpName && (
          <Link
            to={
              mpRecord
                ? `/mps/${encodeURIComponent(mpRecord.id)}`
                : `/mps?search=${encodeURIComponent(effectiveMpName)}`
            }
            className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#4ADE80]/50 transition-colors flex flex-col justify-between space-y-1 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span className="flex items-center gap-1 uppercase font-semibold">
                <UserCheck className="w-3 h-3 text-[#4ADE80]" />
                Parliamentarian
              </span>
              {mpRecord && (
                <RiskBadge level={mpRecord.riskLevel} score={mpRecord.riskScore} size="sm" />
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#4ADE80] block truncate">
                {effectiveMpName}
              </span>
              <span className="text-[10px] font-mono text-[#667090] block truncate">
                {effectiveConstituency ? `${effectiveConstituency} (${effectiveState})` : effectiveState}
              </span>
            </div>
          </Link>
        )}

        {/* 6. Jurisdiction / GIS Region */}
        {effectiveState && (
          <Link
            to={`/geospatial?state=${encodeURIComponent(effectiveState)}`}
            className="p-2 rounded bg-[#10182B] border border-[#232D47] hover:border-[#EF4444]/50 transition-colors flex flex-col justify-between space-y-1 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span className="flex items-center gap-1 uppercase font-semibold">
                <MapPin className="w-3 h-3 text-[#EF4444]" />
                GIS Jurisdiction
              </span>
              <span className="font-mono text-[9px] text-[#22C55E]">MAP LINKED</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#fca5a5] block truncate">
                {effectiveDistrict ? `${effectiveDistrict}, ${effectiveState}` : effectiveState}
              </span>
              <span className="text-[10px] font-mono text-[#667090] block truncate">
                {effectiveConstituency ? `Constituency: ${effectiveConstituency}` : 'District HQ'}
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
