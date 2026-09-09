import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  MapPin,
  Store,
  FolderGit2,
  ChevronRight,
  Eye,
  AlertTriangle,
} from 'lucide-react'

import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'
import { mockVendors } from '@/data/vendors'

interface AgencyRelatedEntitiesProps {
  projects: ProjectRecord[]
  onSelectProject: (project: ProjectRecord) => void
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export const AgencyRelatedEntities: React.FC<AgencyRelatedEntitiesProps> = ({
  projects,
  onSelectProject,
}) => {
  // Derive unique MPs
  const mpMap = new Map<string, { count: number; state: string; constituency: string }>()
  // Derive unique Constituencies
  const constMap = new Map<string, { count: number; state: string }>()
  // Derive unique Vendors
  const vendorMap = new Map<string, { count: number; state: string }>()

  projects.forEach((p) => {
    // MP
    if (p.mpName) {
      const mpInfo = mpMap.get(p.mpName) || { count: 0, state: p.state, constituency: p.constituency }
      mpInfo.count++
      mpMap.set(p.mpName, mpInfo)
    }

    // Constituency
    if (p.constituency) {
      const cInfo = constMap.get(p.constituency) || { count: 0, state: p.state }
      cInfo.count++
      constMap.set(p.constituency, cInfo)
    }

    // Vendor
    if (p.vendor) {
      const vInfo = vendorMap.get(p.vendor) || { count: 0, state: p.state }
      vInfo.count++
      vendorMap.set(p.vendor, vInfo)
    }
  })

  const mps = Array.from(mpMap.entries())
    .map(([name, data]) => ({
      name,
      id: `mp-${slugify(name)}`,
      ...data,
    }))
    .sort((a, b) => b.count - a.count)

  const constituencies = Array.from(constMap.entries())
    .map(([name, data]) => ({
      name,
      ...data,
    }))
    .sort((a, b) => b.count - a.count)

  const vendors = Array.from(vendorMap.entries())
    .map(([name, data]) => {
      const matchV = mockVendors.find((v) => v.name.toLowerCase() === name.toLowerCase())
      return {
        name,
        id: matchV?.id,
        ...data,
      }
    })
    .sort((a, b) => b.count - a.count)

  // Highest-risk projects
  const highRiskProjects = [...projects]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="MULTI-STAKEHOLDER NETWORK // CROSS-ENTITY INTEL"
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            LINKED ENTITIES
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Related Entities &amp; Stakeholders</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Top Vendors */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Store className="w-3 h-3 text-[#3B82F6]" />
                Top Vendors ({vendors.length})
              </span>
              <span className="text-[#667090]">Contracted</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {vendors.slice(0, 6).map((v) =>
                v.id ? (
                  <Link
                    key={v.name}
                    to={`/vendors/${v.id}`}
                    className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5 min-w-0 pr-1">
                      <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] block truncate">
                        {v.name}
                      </span>
                      <span className="text-[10px] text-[#667090] font-mono block">
                        {v.count} project{v.count > 1 ? 's' : ''} executed
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#3B82F6] shrink-0" />
                  </Link>
                ) : (
                  <div
                    key={v.name}
                    className="p-1.5 bg-[#10182B] border border-[#232D47] rounded flex items-center justify-between"
                  >
                    <div className="space-y-0.5 min-w-0 pr-1">
                      <span className="text-xs font-semibold text-[#E7EBF5] block truncate">
                        {v.name}
                      </span>
                      <span className="text-[10px] text-[#667090] font-mono block">
                        {v.count} project{v.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 2. Top MPs */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#3B82F6]" />
                Top MPs ({mps.length})
              </span>
              <span className="text-[#667090]">Recommending</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {mps.slice(0, 6).map((m) => (
                <Link
                  key={m.name}
                  to={`/mps/${m.id}`}
                  className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#667090] font-mono block truncate">
                      {m.constituency}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#3B82F6] shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Top Constituencies */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#3B82F6]" />
                Constituencies ({constituencies.length})
              </span>
              <span className="text-[#667090]">Locations</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {constituencies.slice(0, 6).map((c) => (
                <div
                  key={c.name}
                  className="p-1.5 bg-[#10182B] border border-[#232D47] rounded flex items-center justify-between"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <span className="text-xs font-semibold text-[#E7EBF5] block truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-[#667090] font-mono block truncate">
                      State: {c.state}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#3B82F6] font-bold shrink-0">
                    {c.count} {c.count === 1 ? 'work' : 'works'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Highest-Risk Projects */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#EF4444] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                Highest-Risk Works
              </span>
              <span className="text-[#667090]">Top {highRiskProjects.length}</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {highRiskProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#3B82F6]">{p.workCode}</span>
                      <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                    </div>
                    <span className="text-[11px] font-medium text-[#E7EBF5] group-hover:text-[#3B82F6] block truncate">
                      {p.title}
                    </span>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#3B82F6] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
