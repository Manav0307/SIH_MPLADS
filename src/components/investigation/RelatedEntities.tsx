import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  Building2,
  Store,
  MapPin,
  ChevronRight,
  UserCheck,
} from 'lucide-react'
import { ProjectRecord, VendorRecord } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { findCaseForProject } from '@/lib/caseRegistry'

interface RelatedEntitiesProps {
  currentProject: ProjectRecord
  allProjects: ProjectRecord[]
  allVendors: VendorRecord[]
  onSelectProject: (project: ProjectRecord) => void
}

export const RelatedEntities: React.FC<RelatedEntitiesProps> = ({
  currentProject,
  allProjects,
  allVendors,
  onSelectProject,
}) => {
  const navigate = useNavigate()
  const associatedCase = findCaseForProject(currentProject.id) || findCaseForProject(currentProject.workCode)

  // Related projects logic
  const relatedByVendor = allProjects.filter(
    (p) => p.vendor === currentProject.vendor && p.id !== currentProject.id
  )
  const relatedByAgency = allProjects.filter(
    (p) => p.agency === currentProject.agency && p.id !== currentProject.id
  )
  const relatedByCategory = allProjects.filter(
    (p) => p.category === currentProject.category && p.id !== currentProject.id
  )
  const relatedByConstituency = allProjects.filter(
    (p) => p.constituency === currentProject.constituency && p.id !== currentProject.id
  )

  // Deduplicate related projects
  const uniqueRelatedProjectsMap = new Map<string, { project: ProjectRecord; reason: string }>()

  relatedByVendor.forEach((p) =>
    uniqueRelatedProjectsMap.set(p.id, { project: p, reason: 'Same Vendor' })
  )
  relatedByAgency.forEach((p) => {
    if (!uniqueRelatedProjectsMap.has(p.id)) {
      uniqueRelatedProjectsMap.set(p.id, { project: p, reason: 'Same Agency' })
    }
  })
  relatedByCategory.forEach((p) => {
    if (!uniqueRelatedProjectsMap.has(p.id)) {
      uniqueRelatedProjectsMap.set(p.id, { project: p, reason: 'Same Category' })
    }
  })
  relatedByConstituency.forEach((p) => {
    if (!uniqueRelatedProjectsMap.has(p.id)) {
      uniqueRelatedProjectsMap.set(p.id, { project: p, reason: 'Same Constituency' })
    }
  })

  const relatedProjectsList = Array.from(uniqueRelatedProjectsMap.values())

  // Vendor record
  const vendorMatch = allVendors.find(
    (v) => v.name.toLowerCase() === currentProject.vendor.toLowerCase()
  )

  // Agency mock statistics
  const agencyProjects = allProjects.filter((p) => p.agency === currentProject.agency)
  const agencyFlagged = agencyProjects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high')
  const agencyFlaggedPct = Math.round((agencyFlagged.length / (agencyProjects.length || 1)) * 100)
  const agencyRiskScore = Math.round(
    agencyProjects.reduce((acc, curr) => acc + curr.riskScore, 0) / (agencyProjects.length || 1)
  )

  return (
    <div className="space-y-3 select-none text-xs">
      {/* 1. Related Projects Strip */}
      <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2">
        <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
          <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-[#3B82F6]" />
            Related Forensic Projects ({relatedProjectsList.length})
          </span>
          <span className="font-mono text-[10px] text-[#667090]">CLICKABLE NODES</span>
        </div>

        {relatedProjectsList.length === 0 ? (
          <p className="text-[11px] text-[#667090] py-2 text-center">
            No directly adjacent project nodes detected in current cluster.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {relatedProjectsList.map(({ project, reason }) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="flex items-center justify-between p-2 rounded bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 cursor-pointer transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-[#adc6ff]">
                      {project.workCode}
                    </span>
                    <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#161F36] text-[#3B82F6] border border-[#232D47]">
                      {reason}
                    </span>
                  </div>
                  <div className="font-sans text-[11px] text-[#E7EBF5] truncate mt-0.5" title={project.title}>
                    {project.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] text-[#EF4444] font-tabular font-semibold">
                    {project.disbursedDisplay}
                  </span>
                  <RiskBadge level={project.riskLevel} score={project.riskScore} size="sm" />
                  <ChevronRight className="w-3 h-3 text-[#667090] group-hover:text-[#E7EBF5]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Related Entities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Vendor */}
        <div
          onClick={() =>
            navigate(
              vendorMatch
                ? `/vendors/${encodeURIComponent(vendorMatch.id)}`
                : `/vendors?search=${encodeURIComponent(currentProject.vendor)}`
            )
          }
          className="p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-[#121A2E] border border-[#232D47] hover:border-[#F59E0B]/50 transition-colors cursor-pointer space-y-1.5 group"
          title={`Click to open Vendor Profile: ${currentProject.vendor}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#9AA5C1] uppercase font-bold">
              <Store className="w-3 h-3 text-[#F59E0B]" />
              <span>Related Vendor</span>
            </div>
            <RiskBadge
              level={vendorMatch ? vendorMatch.riskLevel : currentProject.riskLevel}
              score={vendorMatch ? vendorMatch.riskScore : currentProject.riskScore}
              size="sm"
            />
          </div>

          <div className="font-sans text-xs font-bold text-[#E7EBF5] group-hover:text-[#F59E0B] transition-colors truncate">
            {currentProject.vendor}
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-[#161F36] text-[10px] font-mono">
            <div>
              <span className="text-[#667090] block">Works:</span>
              <span className="text-[#E7EBF5] font-semibold">
                {vendorMatch ? vendorMatch.activeWorks : 8} Works
              </span>
            </div>
            <div>
              <span className="text-[#667090] block">Disbursed:</span>
              <span className="text-[#EF4444] font-semibold">
                {vendorMatch ? vendorMatch.totalDisbursed : currentProject.disbursedDisplay}
              </span>
            </div>
            <div>
              <span className="text-[#667090] block">Flagged:</span>
              <span className="text-[#F59E0B] font-semibold">
                {vendorMatch ? `${vendorMatch.flaggedPercentage}%` : '37.5%'}
              </span>
            </div>
            <div>
              <span className="text-[#667090] block">Risk Score:</span>
              <span className="text-[#EF4444] font-bold">
                {vendorMatch ? vendorMatch.riskScore : currentProject.riskScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Agency */}
        <div
          onClick={() => navigate(`/agencies?search=${encodeURIComponent(currentProject.agency)}`)}
          className="p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-[#121A2E] border border-[#232D47] hover:border-[#3B82F6]/50 transition-colors cursor-pointer space-y-1.5 group"
          title={`Click to inspect Agency: ${currentProject.agency}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#9AA5C1] uppercase font-bold">
              <Building2 className="w-3 h-3 text-[#3B82F6]" />
              <span>Related Agency</span>
            </div>
            <RiskBadge
              level={agencyRiskScore >= 85 ? 'critical' : 'high'}
              score={agencyRiskScore}
              size="sm"
            />
          </div>

          <div className="font-sans text-xs font-bold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors truncate">
            {currentProject.agency}
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-[#161F36] text-[10px] font-mono">
            <div>
              <span className="text-[#667090] block">Projects:</span>
              <span className="text-[#E7EBF5] font-semibold">{agencyProjects.length} Managed</span>
            </div>
            <div>
              <span className="text-[#667090] block">Flagged:</span>
              <span className="text-[#EF4444] font-semibold">{agencyFlaggedPct}%</span>
            </div>
            <div>
              <span className="text-[#667090] block">State:</span>
              <span className="text-[#9AA5C1] truncate">{currentProject.state}</span>
            </div>
            <div>
              <span className="text-[#667090] block">Risk Score:</span>
              <span className="text-[#EF4444] font-bold">{agencyRiskScore}/100</span>
            </div>
          </div>
        </div>

        {/* Member of Parliament */}
        <div
          onClick={() => navigate(`/mps?search=${encodeURIComponent(currentProject.mpName)}`)}
          className="p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-[#121A2E] border border-[#232D47] hover:border-[#4ADE80]/50 transition-colors cursor-pointer space-y-1.5 group"
          title={`Click to open MP & Constituency Profile: ${currentProject.mpName}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#9AA5C1] uppercase font-bold">
              <UserCheck className="w-3 h-3 text-[#4ADE80]" />
              <span>Recommending MP</span>
            </div>
            <span className="font-mono text-[9px] text-[#4ADE80] bg-[#0F3020] px-1 py-0.2 rounded border border-[#4ADE80]/30 font-bold">
              {currentProject.mpHouse || 'LS'}
            </span>
          </div>

          <div className="font-sans text-xs font-bold text-[#E7EBF5] group-hover:text-[#4ADE80] transition-colors truncate">
            {currentProject.mpName}
          </div>

          <div className="text-[10px] font-mono text-[#9AA5C1] truncate pt-1 border-t border-[#161F36]">
            Constituency: {currentProject.constituency} ({currentProject.state})
          </div>
        </div>

        {/* Associated Case */}
        <div
          onClick={() => {
            if (associatedCase) {
              navigate(`/cases?id=${encodeURIComponent(associatedCase.id)}`)
            } else {
              navigate(`/cases?workCode=${encodeURIComponent(currentProject.workCode)}`)
            }
          }}
          className="p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-[#121A2E] border border-[#232D47] hover:border-[#A855F7]/50 transition-colors cursor-pointer space-y-1.5 group"
          title={associatedCase ? `Click to open Case ${associatedCase.id}` : 'Click to inspect or create case in Cases Registry'}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#9AA5C1] uppercase font-bold">
              <FolderKanban className="w-3 h-3 text-[#A855F7]" />
              <span>Sovereign Audit Case</span>
            </div>
            {associatedCase ? (
              <span className="font-mono text-[9px] text-[#22C55E] bg-[#0F3020] px-1 py-0.2 rounded border border-[#22C55E]/30 font-bold">
                {associatedCase.status}
              </span>
            ) : (
              <span className="font-mono text-[9px] text-[#9AA5C1] bg-[#161F36] px-1 py-0.2 rounded border border-[#232D47]">
                READY TO ESCALATE
              </span>
            )}
          </div>

          <div className="font-sans text-xs font-bold text-[#E7EBF5] group-hover:text-[#A855F7] transition-colors truncate font-mono">
            {associatedCase ? associatedCase.id : 'No active case opened yet'}
          </div>

          <div className="text-[10px] font-mono text-[#9AA5C1] truncate pt-1 border-t border-[#161F36]">
            {associatedCase
              ? `Assigned: ${associatedCase.assignedOfficer.name}`
              : 'Click to open case workspace'}
          </div>
        </div>
      </div>

      {/* 3. Related Geography */}
      <div
        onClick={() => navigate(`/geospatial?state=${encodeURIComponent(currentProject.state)}`)}
        className="p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-[#121A2E] border border-[#232D47] hover:border-[#EF4444]/50 transition-colors cursor-pointer flex items-center justify-between group"
        title={`Click to view ${currentProject.state} on GIS Intelligence Map`}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#EF4444] shrink-0" />
          <div>
            <div className="text-[10px] font-mono uppercase text-[#667090] font-bold">
              Related Geography (Click to Inspect on GIS Map)
            </div>
            <div className="text-xs font-sans text-[#E7EBF5] group-hover:text-[#fca5a5] font-semibold transition-colors">
              {currentProject.district}, {currentProject.state} ({currentProject.constituency})
            </div>
          </div>
        </div>
        <div className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] px-2 py-0.5 rounded border border-[#22C55E]/30 font-semibold flex items-center gap-1">
          <span>NIC GIS GEOLINKED</span>
          <ChevronRight className="w-3 h-3 text-[#22C55E]" />
        </div>
      </div>
    </div>
  )
}
