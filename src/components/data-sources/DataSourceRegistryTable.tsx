import React from 'react'
import {
  FileText,
  FileSpreadsheet,
  MapPin,
  Database,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { DataSourceDataset } from '@/types/dataSources'

interface DataSourceRegistryTableProps {
  datasets: DataSourceDataset[]
  selectedDatasetId: string | null
  onSelectDataset: (dataset: DataSourceDataset) => void
}

export const DataSourceRegistryTable: React.FC<DataSourceRegistryTableProps> = ({
  datasets,
  selectedDatasetId,
  onSelectDataset,
}) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'CSV':
        return <FileText className="w-4 h-4 text-[#adc6ff]" />
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-[#4ae176]" />
      case 'GEOJSON':
        return <MapPin className="w-4 h-4 text-[#ffb3ad]" />
      default:
        return <Database className="w-4 h-4 text-[#9AA5C1]" />
    }
  }

  const renderIngestionStatusPill = (status: DataSourceDataset['ingestionStatus']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider border select-none bg-[#0F3020] border-[#22C55E40] text-[#22C55E]">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#22C55E]" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
            </span>
            <span>AVAILABLE</span>
          </span>
        )
      case 'Pending Upload':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider border select-none bg-[#3A2A0C] border-[#F59E0B40] text-[#F59E0B]">
            <Clock className="w-3 h-3 text-[#F59E0B] shrink-0" />
            <span>PENDING UPLOAD</span>
          </span>
        )
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider border select-none bg-[#401515] border-[#EF444440] text-[#EF4444]">
            <AlertCircle className="w-3 h-3 text-[#EF4444] shrink-0" />
            <span>MISSING</span>
          </span>
        )
    }
  }

  const renderSchemaStatus = (status: DataSourceDataset['schemaStatus'], isAvailable: boolean) => {
    if (!isAvailable) {
      return (
        <span className="font-mono text-[10px] text-[#667090] flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#667090]" />
          <span>Pending Parse</span>
        </span>
      )
    }

    switch (status) {
      case 'Validated':
        return (
          <span className="font-mono text-[10px] text-[#22C55E] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
            <span>Validated</span>
          </span>
        )
      case 'Warning':
        return (
          <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
            <span>Warning</span>
          </span>
        )
      default:
        return <span className="font-mono text-[10px] text-[#9AA5C1]">{status}</span>
    }
  }

  const renderJoinStatus = (status: DataSourceDataset['joinStatus']) => {
    switch (status) {
      case 'Linked':
        return <Badge variant="success">Linked</Badge>
      case 'Partial':
        return (
          <Badge variant="outline" className="text-[#F59E0B] border-[#F59E0B40]">
            Partial
          </Badge>
        )
      case 'Pending Ingestion':
        return (
          <Badge variant="outline" className="text-[#667090] border-[#232D47]">
            Pending Ingest
          </Badge>
        )
      case 'Unresolved':
        return (
          <Badge variant="outline" className="text-[#EF4444] border-[#EF444440]">
            Unresolved
          </Badge>
        )
    }
  }

  return (
    <div className="w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#10182B] select-none">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-8 border-b border-[#232D47] bg-[#0D1424]">
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Dataset Name & Authority
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Source
            </th>
            <th className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-center">
              Type
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-right">
              Records
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Last Updated
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Schema Status
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Join Status
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-right">
              Data Quality
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Ingestion Status
            </th>
            <th className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {datasets.length === 0 ? (
            <tr>
              <td colSpan={10} className="h-28 text-center text-xs text-[#667090] font-sans">
                No statutory datasets match the applied filters.
              </td>
            </tr>
          ) : (
            datasets.map((dataset) => {
              const isSelected = selectedDatasetId === dataset.id
              const isAvailable = dataset.ingestionStatus === 'Available'

              return (
                <tr
                  key={dataset.id}
                  onClick={() => onSelectDataset(dataset)}
                  className={`group transition-colors border-b border-[#161F36] cursor-pointer ${
                    isSelected ? 'bg-[#161F36]' : 'hover:bg-[#161F36]/60'
                  }`}
                >
                  {/* Dataset Name */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#0A0E1A] border border-[#232D47] flex items-center justify-center shrink-0">
                        {getFileIcon(dataset.fileType)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs font-bold text-[#E7EBF5] group-hover:text-[#adc6ff] transition-colors truncate">
                          {dataset.name}
                        </span>
                        <span className="text-[10px] text-[#667090] truncate max-w-[220px]">
                          {dataset.sourceAuthority}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    <span className="text-xs text-[#9AA5C1] font-sans truncate block max-w-[180px]">
                      {dataset.source}
                    </span>
                  </td>

                  {/* File Type */}
                  <td className="px-2 py-2 whitespace-nowrap align-middle text-center">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[#9AA5C1]">
                      {dataset.fileType}
                    </span>
                  </td>

                  {/* Records */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right">
                    {isAvailable && dataset.records !== null ? (
                      <span className="font-mono text-xs font-bold text-[#E7EBF5] tabular-nums">
                        {dataset.records.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-[#667090] italic">
                        — <span className="text-[10px] font-sans">[Unloaded]</span>
                      </span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    {isAvailable && dataset.lastUpdated ? (
                      <span className="font-mono text-[11px] text-[#9AA5C1]">
                        {dataset.lastUpdated}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[#667090] italic">
                        — Pending Ingestion
                      </span>
                    )}
                  </td>

                  {/* Schema Status */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    {renderSchemaStatus(dataset.schemaStatus, isAvailable)}
                  </td>

                  {/* Join Status */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    {renderJoinStatus(dataset.joinStatus)}
                  </td>

                  {/* Data Quality */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right">
                    {isAvailable && dataset.dataQualityScore !== null ? (
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded border ${
                          dataset.dataQualityScore >= 95
                            ? 'bg-[#0F3020] border-[#22C55E40] text-[#22C55E]'
                            : dataset.dataQualityScore >= 80
                            ? 'bg-[#3A2A0C] border-[#F59E0B40] text-[#F59E0B]'
                            : 'bg-[#401515] border-[#EF444440] text-[#EF4444]'
                        }`}
                      >
                        {dataset.dataQualityScore.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#667090] italic">
                        — [Not Assessed]
                      </span>
                    )}
                  </td>

                  {/* Ingestion Status */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle">
                    {renderIngestionStatusPill(dataset.ingestionStatus)}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-2 whitespace-nowrap align-middle text-right">
                    <Button
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="compact"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectDataset(dataset)
                      }}
                      className="text-[11px]"
                    >
                      Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
