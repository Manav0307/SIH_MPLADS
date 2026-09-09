import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  MapPin,
  Building2,
  FolderGit2,
  ChevronRight,
  Eye,
  Briefcase,
} from 'lucide-react'
import { ProjectRecord } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface VendorRelatedEntitiesProps {
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

export const VendorRelatedEntities: React.FC<VendorRelatedEntitiesProps> = ({
  projects,
  onSelectProject,
}) => {
  // Derive unique MPs
  const mpMap = new Map<string, { count: number; state: string; constituency: string }>()
  // Derive unique Constituencies
  const constMap = new Map<string, { count: number; state: string }>()
  // Derive unique Agencies
  const agencyMap = new Map<string, { count: number; state: string }>()

  projects.forEach((p) => {
    // MP
    const mpInfo = mpMap.get(p.mpName) || { count: 0, state: p.state, constituency: p.constituency }
    mpInfo.count++
    mpMap.set(p.mpName, mpInfo)

    // Constituency
    const cInfo = constMap.get(p.constituency) || { count: 0, state: p.state }
    cInfo.count++
    constMap.set(p.constituency, cInfo)

    // Agency
    const aInfo = agencyMap.get(p.agency) || { count: 0, state: p.state }
    aInfo.count++
    agencyMap.set(p.agency, aInfo)
  })

  const mps = Array.from(mpMap.entries()).map(([name, data]) => ({
    name,
    id: `mp-${slugify(name)}`,
    ...data,
  }))

  const constituencies = Array.from(constMap.entries()).map(([name, data]) => ({
    name,
    ...data,
  }))

  const agencies = Array.from(agencyMap.entries()).map(([name, data]) => ({
    name,
    ...data,
  }))

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="NETWORK CROSS-REFERENCING // DIRECTORY NODES"
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            RELATED NODES
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Related Entities &amp; Public Stakeholders</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Related Parliamentarians (MPs) */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#3B82F6]" />
                Related MPs ({mps.length})
              </span>
              <span className="text-[#667090]">Link</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {mps.map((m) => (
                <Link
                  key={m.name}
                  to={`/mps/${m.id}`}
                  className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded flex items-center justify-between group transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] transition-colors block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#667090] font-mono block truncate">
                      {m.constituency}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#9AA5C1] shrink-0">
                    <span>{m.count}</span>
                    <ChevronRight className="w-3 h-3 text-[#667090] group-hover:text-[#3B82F6]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Related Constituencies */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#22C55E]" />
                Constituencies ({constituencies.length})
              </span>
              <span className="text-[#667090]">Region</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {constituencies.map((c) => (
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
                  <span className="font-mono text-[10px] text-[#9AA5C1] shrink-0">
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Related Implementing Agencies */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#F59E0B]" />
                Agencies ({agencies.length})
              </span>
              <span className="text-[#667090]">Executing</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {agencies.map((a) => (
                <Link
                  key={a.name}
                  to={`/agencies/${slugify(a.name)}`}
                  className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] rounded flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <span className="text-xs font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] block truncate">
                      {a.name}
                    </span>
                    <span className="text-[10px] text-[#667090] font-mono block truncate">
                      State: {a.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-[#9AA5C1]">
                      {a.count}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#667090] group-hover:text-[#3B82F6]" />
                  </div>
                </Link>
              ))}

            </div>
          </div>

          {/* 4. Related Projects */}
          <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-2.5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-[#3B82F6]" />
                Related Works ({projects.length})
              </span>
              <span className="text-[#667090]">Dossier</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {projects.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="p-1.5 bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 rounded flex items-center justify-between group cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono font-bold text-[#3B82F6] group-hover:underline">
                        {p.workCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9AA5C1] block truncate" title={p.title}>
                      {p.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <RiskBadge
                      level={p.riskLevel}
                      score={p.riskScore}
                      size="sm"
                    />
                    <Eye className="w-3 h-3 text-[#667090] group-hover:text-[#3B82F6]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
