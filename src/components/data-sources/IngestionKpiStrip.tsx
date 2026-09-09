import React from 'react'
import { Card, CardContent } from '@/components/common/Card'
import { Database, CheckCircle2, Clock, AlertTriangle, ShieldCheck, GitMerge } from 'lucide-react'
import { DataSourceDataset, JoinKeyDefinition } from '@/types/dataSources'

interface IngestionKpiStripProps {
  datasets: DataSourceDataset[]
  joinKeys: JoinKeyDefinition[]
}

export const IngestionKpiStrip: React.FC<IngestionKpiStripProps> = ({ datasets, joinKeys }) => {
  const totalDatasets = datasets.length
  const availableDatasets = datasets.filter((d) => d.ingestionStatus === 'Available')
  const pendingDatasets = datasets.filter((d) => d.ingestionStatus === 'Pending Upload')
  const missingDatasets = datasets.filter((d) => d.ingestionStatus === 'Missing')

  // Calculate average quality score only for available datasets
  const availableWithScore = availableDatasets.filter((d) => d.dataQualityScore !== null)
  const avgQualityScore =
    availableWithScore.length > 0
      ? (
          availableWithScore.reduce((acc, d) => acc + (d.dataQualityScore || 0), 0) /
          availableWithScore.length
        ).toFixed(1)
      : '—'

  const linkedJoinKeys = joinKeys.filter((j) => j.status === 'Linked').length

  const kpis = [
    {
      id: 'kpi-total',
      label: 'STATUTORY SCHEMAS',
      value: totalDatasets,
      subValue: 'Planned Real Datasets',
      icon: <Database className="w-4 h-4 text-[#adc6ff]" />,
      borderAccent: 'border-l-[#3B82F6]',
    },
    {
      id: 'kpi-available',
      label: 'INGESTED / AVAILABLE',
      value: availableDatasets.length,
      subValue: `${availableDatasets.reduce((acc, d) => acc + (d.records || 0), 0).toLocaleString()} Verified Records`,
      icon: <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />,
      borderAccent: 'border-l-[#22C55E]',
      badgeText: 'ONLINE',
      badgeColor: 'text-[#22C55E] bg-[#0F3020] border-[#22C55E40]',
    },
    {
      id: 'kpi-pending',
      label: 'PENDING UPLOAD',
      value: pendingDatasets.length,
      subValue: 'Awaiting District / Treasury Feed',
      icon: <Clock className="w-4 h-4 text-[#F59E0B]" />,
      borderAccent: 'border-l-[#F59E0B]',
      badgeText: 'PENDING',
      badgeColor: 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B40]',
    },
    {
      id: 'kpi-missing',
      label: 'MISSING REPOSITORIES',
      value: missingDatasets.length,
      subValue: 'Census 2011 & LGD Masters',
      icon: <AlertTriangle className="w-4 h-4 text-[#EF4444]" />,
      borderAccent: 'border-l-[#EF4444]',
      badgeText: 'ACTION REQ',
      badgeColor: 'text-[#EF4444] bg-[#401515] border-[#EF444440]',
    },
    {
      id: 'kpi-quality',
      label: 'INGESTED QUALITY SCORE',
      value: `${avgQualityScore}%`,
      subValue: `${availableWithScore.length} of ${totalDatasets} Assessed (0 Fabricated)`,
      icon: <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />,
      borderAccent: 'border-l-[#3B82F6]',
    },
    {
      id: 'kpi-joins',
      label: 'CROSS-DATASET KEYS',
      value: `${linkedJoinKeys}/${joinKeys.length}`,
      subValue: `${joinKeys.length - linkedJoinKeys} Keys Blocked / Pending`,
      icon: <GitMerge className="w-4 h-4 text-[#9AA5C1]" />,
      borderAccent: 'border-l-[#8c909f]',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className={`border-l-4 ${kpi.borderAccent}`}>
          <CardContent className="p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9AA5C1] truncate">
                {kpi.label}
              </span>
              <span className="shrink-0">{kpi.icon}</span>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="text-xl font-mono font-bold text-[#E7EBF5] tabular-nums">
                {kpi.value}
              </span>
              {kpi.badgeText && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${kpi.badgeColor}`}
                >
                  {kpi.badgeText}
                </span>
              )}
            </div>

            <div className="mt-1">
              <p className="text-[11px] text-[#667090] truncate font-sans">{kpi.subValue}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
