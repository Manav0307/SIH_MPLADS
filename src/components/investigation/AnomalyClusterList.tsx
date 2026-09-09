import React from 'react'
import { Layers, ChevronRight, MapPin, Briefcase } from 'lucide-react'
import { AnomalyCluster } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { RiskBadge } from '@/components/common/RiskBadge'

interface AnomalyClusterListProps {
  clusters: AnomalyCluster[]
  selectedClusterId?: string
  onSelectCluster: (cluster: AnomalyCluster) => void
}

export const AnomalyClusterList: React.FC<AnomalyClusterListProps> = ({
  clusters,
  selectedClusterId,
  onSelectCluster,
}) => {
  return (
    <Card className="select-none">
      <CardHeader
        telemetry={`${clusters.length} DETECTED CLUSTERS`}
        action={
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9AA5C1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
            <span>AI PATTERN CLUSTERING V3.2</span>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Detected Anomaly Clusters</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {clusters.map((cluster) => {
            const isSelected = selectedClusterId === cluster.id

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster(cluster)}
                className={`group relative rounded-lg p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161F36] border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'bg-[#0A0E1A] hover:bg-[#161F36]/60 border-[#232D47] hover:border-[#3B82F6]/50'
                }`}
              >
                {/* Cluster Header */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#adc6ff]">
                        {cluster.id}
                      </span>
                      <RiskBadge level={cluster.riskLevel} score={cluster.riskScore} size="sm" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] px-1.5 py-0.5 rounded border border-[#22C55E]/30 font-semibold">
                        {cluster.confidence}% CONF
                      </span>
                    </div>
                  </div>

                  <h4
                    className="font-sans text-xs font-semibold text-[#E7EBF5] line-clamp-1 group-hover:text-[#adc6ff] transition-colors"
                    title={cluster.title}
                  >
                    {cluster.title}
                  </h4>

                  <p className="font-sans text-[11px] text-[#9AA5C1] line-clamp-2 mt-1">
                    {cluster.description}
                  </p>
                </div>

                {/* Cluster Telemetry Footer */}
                <div className="mt-2.5 pt-2 border-t border-[#232D47] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#9AA5C1] flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#667090]" />
                      <span>{cluster.projectCount} Projects</span>
                    </span>
                    <span className="text-[#EF4444] font-bold font-tabular">
                      {cluster.totalExposureDisplay} Exposure
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#9AA5C1] flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 text-[#667090] shrink-0" />
                      <span className="truncate">{cluster.district}, {cluster.state}</span>
                    </span>
                    <span className="text-[#667090] shrink-0">
                      {cluster.detectedTimestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#161F36] text-[#3B82F6] border border-[#232D47] font-semibold">
                      {cluster.mainAnomalyType}
                    </span>

                    <span
                      className={`text-[10px] font-semibold flex items-center gap-0.5 transition-colors ${
                        isSelected ? 'text-[#3B82F6]' : 'text-[#667090] group-hover:text-[#E7EBF5]'
                      }`}
                    >
                      <span>{isSelected ? 'Focused' : 'Inspect'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
