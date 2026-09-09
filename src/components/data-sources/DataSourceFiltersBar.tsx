import React from 'react'
import { Search, X, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { DataSourceFilterState, IngestionStatus, DataSourceDataset } from '@/types/dataSources'

interface DataSourceFiltersBarProps {
  filters: DataSourceFilterState
  datasets: DataSourceDataset[]
  onFilterChange: <K extends keyof DataSourceFilterState>(key: K, value: DataSourceFilterState[K]) => void
  onResetFilters: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const DataSourceFiltersBar: React.FC<DataSourceFiltersBarProps> = ({
  filters,
  datasets,
  onFilterChange,
  onResetFilters,
  onRefresh,
  isRefreshing = false,
}) => {
  const countByStatus = {
    ALL: datasets.length,
    Available: datasets.filter((d) => d.ingestionStatus === 'Available').length,
    'Pending Upload': datasets.filter((d) => d.ingestionStatus === 'Pending Upload').length,
    Missing: datasets.filter((d) => d.ingestionStatus === 'Missing').length,
  }

  const statusTabs: { label: string; value: 'ALL' | IngestionStatus; count: number }[] = [
    { label: 'ALL SCHEMAS', value: 'ALL', count: countByStatus.ALL },
    { label: 'AVAILABLE', value: 'Available', count: countByStatus.Available },
    { label: 'PENDING UPLOAD', value: 'Pending Upload', count: countByStatus['Pending Upload'] },
    { label: 'MISSING', value: 'Missing', count: countByStatus.Missing },
  ]

  const fileTypes: ('ALL' | 'CSV' | 'XLSX' | 'TSV' | 'GEOJSON')[] = [
    'ALL',
    'CSV',
    'XLSX',
    'TSV',
    'GEOJSON',
  ]

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'ALL' ||
    filters.fileType !== 'ALL' ||
    filters.schemaStatus !== 'ALL'

  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg p-3 space-y-2.5 select-none">
      {/* Top row: Search input + File Type Selector + Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#667090]" />
          <input
            type="text"
            placeholder="Search datasets by filename, authority, join keys, columns..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="w-full h-8 pl-8 pr-7 bg-[#161F36] border border-[#232D47] rounded text-xs text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#667090] hover:text-[#E7EBF5]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* File Type Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-[#9AA5C1] uppercase">Format:</span>
          <div className="flex items-center bg-[#161F36] p-0.5 rounded border border-[#232D47]">
            {fileTypes.map((ft) => (
              <button
                key={ft}
                onClick={() => onFilterChange('fileType', ft)}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                  filters.fileType === ft
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#9AA5C1] hover:text-[#E7EBF5]'
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="compact"
              onClick={onResetFilters}
              icon={<X className="w-3 h-3" />}
            >
              Clear Filters
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="secondary"
              size="compact"
              onClick={onRefresh}
              disabled={isRefreshing}
              icon={<RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Sync Lake
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Ingestion Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#232D47]/70">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono text-[#667090] uppercase flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onFilterChange('status', tab.value)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-[#161F36] text-[#adc6ff] border border-[#3B82F6] font-bold shadow-xs'
                    : 'bg-[#10182B] text-[#9AA5C1] border border-[#232D47] hover:bg-[#161F36] hover:text-[#E7EBF5]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-[#3B82F6]/20 text-[#adc6ff]'
                      : 'bg-[#161F36] text-[#667090]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="text-[11px] font-mono text-[#667090] shrink-0">
          SHOWING {datasets.length} DATASETS
        </div>
      </div>
    </div>
  )
}
