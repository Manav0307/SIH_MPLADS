import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import {
  UploadCloud,
  FileCheck,
  RefreshCw,
  CopyCheck,
  GitMerge,
  ShieldAlert,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { EtlStage, DataSourceDataset } from '@/types/dataSources'

interface EtlPipelineVisualizerProps {
  selectedDataset: DataSourceDataset | null
  allDatasets: DataSourceDataset[]
  onSelectStage?: (stage: EtlStage) => void
}

const STAGES: {
  key: EtlStage
  step: number
  label: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  gate: string
}[] = [
  {
    key: 'Upload',
    step: 1,
    label: 'Upload',
    icon: UploadCloud,
    desc: 'Stream staging, MIME detection, UTF-8 parsing',
    gate: 'File Presence & Format',
  },
  {
    key: 'Validate',
    step: 2,
    label: 'Validate',
    icon: FileCheck,
    desc: 'Schema types, mandatory columns, regex patterns',
    gate: 'MoSPI Statutory Schema',
  },
  {
    key: 'Normalize',
    step: 3,
    label: 'Normalize',
    icon: RefreshCw,
    desc: 'Administrative spelling aliases, date formats, ISO codes',
    gate: 'Lexicon Conformance',
  },
  {
    key: 'Deduplicate',
    step: 4,
    label: 'Deduplicate',
    icon: CopyCheck,
    desc: 'Work ID hashing, duplicate sanction record elimination',
    gate: 'Unique Constraint Check',
  },
  {
    key: 'Join',
    step: 5,
    label: 'Join',
    icon: GitMerge,
    desc: 'Relational mapping to Census, PFMS, & GeM datasets',
    gate: 'Foreign Key Resolution',
  },
  {
    key: 'Quality Check',
    step: 6,
    label: 'Quality Check',
    icon: ShieldAlert,
    desc: 'Null ratios, statistical outliers, demographic balance',
    gate: 'Threshold Validation',
  },
  {
    key: 'Ready',
    step: 7,
    label: 'Ready',
    icon: CheckCircle,
    desc: 'Committed to forensic mart for algorithmic audit',
    gate: 'Statutory Verification Complete',
  },
]

export const EtlPipelineVisualizer: React.FC<EtlPipelineVisualizerProps> = ({
  selectedDataset,
  allDatasets,
}) => {
  // Determine the active stage index for the selected dataset
  const activeStageIndex = selectedDataset
    ? STAGES.findIndex((s) => s.key === selectedDataset.etlStage)
    : -1

  return (
    <Card className="select-none">
      <CardHeader
        telemetry="ETL-PIPELINE // ACTIVE STATE"
        action={
          selectedDataset ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#9AA5C1]">INSPECTING:</span>
              <span className="font-mono text-xs font-bold text-[#adc6ff] bg-[#161F36] px-2 py-0.5 rounded border border-[#232D47]">
                {selectedDataset.name}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-[#667090]">
              SELECT A DATASET TO VIEW STAGE TELEMETRY
            </span>
          )
        }
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
          <CardTitle>Government Data Pipeline & Ingestion Progression</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        {/* Pipeline Stage Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon

            // Count how many datasets are currently in this stage
            const datasetsInStage = allDatasets.filter((d) => d.etlStage === stage.key)

            // Stage state relative to selected dataset
            const isCurrent = selectedDataset && selectedDataset.etlStage === stage.key
            const isCompleted = selectedDataset && activeStageIndex > idx
            const isPending = selectedDataset && activeStageIndex < idx

            let containerBg = 'bg-[#10182B] border-[#232D47]'
            let iconColor = 'text-[#667090]'
            let titleColor = 'text-[#9AA5C1]'

            if (selectedDataset) {
              if (isCurrent) {
                containerBg =
                  stage.key === 'Ready'
                    ? 'bg-[#0F3020] border-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                    : 'bg-[#161F36] border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                iconColor = stage.key === 'Ready' ? 'text-[#22C55E]' : 'text-[#3B82F6]'
                titleColor = 'text-[#E7EBF5]'
              } else if (isCompleted) {
                containerBg = 'bg-[#10182B] border-[#22C55E40]'
                iconColor = 'text-[#22C55E]'
                titleColor = 'text-[#9AA5C1]'
              } else if (isPending) {
                containerBg = 'bg-[#0A0E1A] border-[#161F36] opacity-60'
                iconColor = 'text-[#667090]'
                titleColor = 'text-[#667090]'
              }
            } else {
              if (datasetsInStage.length > 0) {
                containerBg = 'bg-[#161F36] border-[#232D47]'
                iconColor = 'text-[#adc6ff]'
                titleColor = 'text-[#E7EBF5]'
              }
            }

            return (
              <div
                key={stage.key}
                className={`relative p-2.5 rounded border flex flex-col justify-between transition-all duration-200 ${containerBg}`}
              >
                {/* Top header row */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[#667090]">
                      0{stage.step}
                    </span>
                    <span className={`text-xs font-semibold truncate ${titleColor}`}>
                      {stage.label}
                    </span>
                  </div>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                </div>

                {/* Description */}
                <p className="text-[10px] text-[#9AA5C1] line-clamp-2 leading-tight mb-2 font-sans">
                  {stage.desc}
                </p>

                {/* Bottom status / badge */}
                <div className="mt-auto pt-1.5 border-t border-[#232D47]/60 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#667090] truncate max-w-[80px]">
                    {stage.gate}
                  </span>
                  <div className="flex items-center gap-1">
                    {selectedDataset ? (
                      isCurrent ? (
                        <span className="font-mono text-[9px] font-bold text-[#3B82F6] px-1 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 animate-pulse">
                          CURRENT
                        </span>
                      ) : isCompleted ? (
                        <span className="font-mono text-[9px] font-bold text-[#22C55E]">
                          ✓ DONE
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] text-[#667090]">PENDING</span>
                      )
                    ) : (
                      <span className="font-mono text-[9px] font-semibold text-[#adc6ff] bg-[#10182B] px-1.5 py-0.2 rounded border border-[#232D47]">
                        {datasetsInStage.length} files
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Arrow indicator on non-last stages for desktop */}
                {idx < STAGES.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#232D47]">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
