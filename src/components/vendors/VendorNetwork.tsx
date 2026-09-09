import React from 'react'
import { Network, Store, Briefcase, MapPin, Building2, AlertTriangle } from 'lucide-react'
import { VendorNetworkNode, VendorNetworkLink } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface VendorNetworkProps {
  nodes: VendorNetworkNode[]
  links: VendorNetworkLink[]
  vendorName: string
}

export const VendorNetwork: React.FC<VendorNetworkProps> = ({
  nodes,
  links,
  vendorName,
}) => {
  const vendorNode = nodes.find((n) => n.type === 'vendor' && n.label === vendorName) || nodes[0]
  const projectNodes = nodes.filter((n) => n.type === 'project')
  const constituencyNodes = nodes.filter((n) => n.type === 'constituency')
  const agencyNodes = nodes.filter((n) => n.type === 'agency')
  const peerVendors = nodes.filter((n) => n.type === 'vendor' && n.id !== vendorNode?.id)

  const hasPeerConnection = peerVendors.length > 0

  return (
    <Card className="w-full">
      <CardHeader
        telemetry={`NODE GRAPH // ${nodes.length} NODES &bull; ${links.length} LINKS`}
        action={
          <span className="font-mono text-[10px] text-[#3B82F6] bg-[#10233F] border border-[#3B82F6]/60 px-2 py-0.5 rounded font-bold uppercase">
            ENTITY TOPOLOGY
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Contractor Network Signals</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-xs text-[#9AA5C1]">
          Deterministic relationship topology mapping entity relationships across projects,
          electoral jurisdictions, and executing bodies.
        </p>

        {/* Peer Directorship / Syndicate Signal Alert Banner */}
        {hasPeerConnection && (
          <div className="bg-[#401515]/30 border border-[#EF4444]/40 rounded p-2.5 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#EF4444] font-mono uppercase">
                Potential Directorship Linkage Detected
              </span>
              <p className="text-[11px] text-[#9AA5C1] leading-relaxed">
                Analytical signal indicates shared corporate registration parameters (common DIN
                or identical e-tender submission gateway IP) between{' '}
                <strong className="text-[#E7EBF5]">{vendorName}</strong> and{' '}
                <strong className="text-[#E7EBF5]">{peerVendors[0]?.label}</strong>.
                Requires formal ROC verification.
              </p>
            </div>
          </div>
        )}

        {/* Network Flow Visualization Strip (Hierarchical Cascade) */}
        <div className="bg-[#0A0E1A] border border-[#232D47] rounded-lg p-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Level 1: Vendor Entity */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
                <Store className="w-3 h-3 text-[#3B82F6]" />
                Primary Vendor
              </span>
              <div className="bg-[#10182B] border border-[#3B82F6]/60 rounded p-2 space-y-1 shadow-sm">
                <span className="text-xs font-bold text-[#E7EBF5] block">{vendorNode?.label}</span>
                <span className="text-[10px] text-[#9AA5C1] font-mono block">{vendorNode?.subtitle}</span>
                <span className="inline-block px-1.5 py-0.2 rounded bg-[#161F36] border border-[#232D47] text-[9px] font-mono text-[#3B82F6]">
                  PRIME CONTRACTOR
                </span>
              </div>

              {/* Connected Peer if any */}
              {hasPeerConnection && (
                <div className="pt-2">
                  <span className="font-mono text-[9px] uppercase text-[#F59E0B] font-bold block mb-1">
                    &bull; Cross-Linked Entity
                  </span>
                  <div className="bg-[#3A2A0C]/20 border border-[#F59E0B]/50 rounded p-2 space-y-1">
                    <span className="text-xs font-semibold text-[#E7EBF5] block">{peerVendors[0].label}</span>
                    <span className="text-[10px] text-[#F59E0B] font-mono block">{peerVendors[0].subtitle}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Level 2: Awarded Works */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-[#F59E0B]" />
                Awarded Works ({projectNodes.length})
              </span>
              <div className="space-y-1.5">
                {projectNodes.map((p) => {
                  const isCrit = p.riskLevel === 'critical'
                  return (
                    <div
                      key={p.id}
                      className="bg-[#10182B] border border-[#232D47] rounded p-1.5 space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#3B82F6]">{p.label}</span>
                        {isCrit && (
                          <span className="text-[9px] font-mono text-[#EF4444] bg-[#401515] px-1 rounded">
                            FLAGGED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#9AA5C1] block truncate">{p.subtitle}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Level 3: Constituencies */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#22C55E]" />
                Constituencies
              </span>
              <div className="space-y-1.5">
                {constituencyNodes.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#10182B] border border-[#232D47] rounded p-1.5 space-y-0.5"
                  >
                    <span className="text-xs font-semibold text-[#E7EBF5] block truncate">{c.label}</span>
                    <span className="text-[10px] text-[#667090] font-mono block">{c.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 4: Executing Agencies */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#9AA5C1]" />
                Executing Agencies
              </span>
              <div className="space-y-1.5">
                {agencyNodes.map((a) => (
                  <div
                    key={a.id}
                    className="bg-[#10182B] border border-[#232D47] rounded p-1.5 space-y-0.5"
                  >
                    <span className="text-xs font-semibold text-[#E7EBF5] block truncate">{a.label}</span>
                    <span className="text-[10px] text-[#667090] font-mono block">{a.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
