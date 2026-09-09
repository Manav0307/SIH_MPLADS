import React, { useState, useMemo, useCallback } from 'react'
import {
  Database,
  RefreshCw,
  Download,
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  Clock,
} from 'lucide-react'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/common/Button'
import {
  IngestionKpiStrip,
  EtlPipelineVisualizer,
  DataSourceFiltersBar,
  DataSourceRegistryTable,
  DatasetDetailDrawer,
  JoinKeyMonitoringPanel,
  DataQualityWarningsPanel,
  IngestionTimeline,
} from '@/components/data-sources'
import {
  mockDataSources,
  mockJoinKeys,
  mockDataQualityWarnings,
  mockIngestionTimeline,
  initialDataSourceFilterState,
} from '@/data'
import {
  DataSourceDataset,
  DataSourceFilterState,
  JoinKeyDefinition,
  DataQualityWarning,
  IngestionTimelineEvent,
  EtlStage,
} from '@/types'

export const DataSourcesPage: React.FC = () => {
  // 1. Master dataset state for interactive local updates
  const [datasets, setDatasets] = useState<DataSourceDataset[]>(mockDataSources)
  const [joinKeys] = useState<JoinKeyDefinition[]>(mockJoinKeys)
  const [warnings] = useState<DataQualityWarning[]>(mockDataQualityWarnings)
  const [timelineEvents, setTimelineEvents] = useState<IngestionTimelineEvent[]>(
    mockIngestionTimeline
  )

  // 2. Filter & search state
  const [filters, setFilters] = useState<DataSourceFilterState>(initialDataSourceFilterState)

  // 3. Selection & Drawer State
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(() => mockDataSources[0]?.id || null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [drawerInitialTab] = useState<'overview' | 'schema' | 'warnings' | 'actions'>('overview')

  // 4. Auxiliary Workspace View Tabs
  const [activeBottomTab, setActiveBottomTab] = useState<'joins' | 'warnings' | 'timeline'>('joins')

  // 5. Toast Feedback Banner
  const [toastMessage, setToastMessage] = useState<{
    text: string
    type: 'success' | 'warning' | 'info'
  } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle filter changes
  const handleFilterChange = useCallback(
    <K extends keyof DataSourceFilterState>(key: K, value: DataSourceFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilters(initialDataSourceFilterState)
  }, [])

  // Dataset selection handler
  const handleSelectDataset = useCallback((dataset: DataSourceDataset) => {
    setSelectedDatasetId(dataset.id)
    setIsDrawerOpen(true)
  }, [])

  // Local UI Actions
  const handleValidate = useCallback((datasetId: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          return {
            ...d,
            schemaStatus: 'Validated',
            validationStatus: {
              ...d.validationStatus,
              valid: true,
              errorCount: 0,
              lastValidatedAt: now,
              rulesChecked: [
                ...d.validationStatus.rulesChecked,
                `Manual interactive validation executed at ${now}: PASSED`,
              ],
            },
          }
        }
        return d
      })
    )

    // Add event to timeline
    const target = datasets.find((d) => d.id === datasetId)
    if (target) {
      const newEvent: IngestionTimelineEvent = {
        id: `evt-val-${Date.now()}`,
        timestamp: now,
        datasetName: target.name,
        stage: 'Validate',
        status: 'success',
        summary: `Interactive schema validation passed for ${target.name}. 0 errors detected.`,
        recordsProcessed: target.records,
      }
      setTimelineEvents((prev) => [newEvent, ...prev])
    }

    showToast(`Validation succeeded for dataset: 0 schema deviations.`, 'success')
  }, [datasets])

  const handleRerunQualityCheck = useCallback((datasetId: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId && d.dataQualityScore !== null) {
          // Recomputed quality score with small realistic variance
          const adjustedScore = Math.min(99.5, Math.max(94.0, (d.dataQualityScore || 96.0) + (Math.random() * 0.4 - 0.2)))
          return {
            ...d,
            dataQualityScore: Number(adjustedScore.toFixed(1)),
            lastUpdated: now,
          }
        }
        return d
      })
    )

    const target = datasets.find((d) => d.id === datasetId)
    if (target) {
      const newEvent: IngestionTimelineEvent = {
        id: `evt-qc-${Date.now()}`,
        timestamp: now,
        datasetName: target.name,
        stage: 'Quality Check',
        status: 'success',
        summary: `Interactive quality check completed for ${target.name}. Conformance index recalculated.`,
        recordsProcessed: target.records,
      }
      setTimelineEvents((prev) => [newEvent, ...prev])
    }

    showToast(`Quality audit re-run complete: Conformance metrics refreshed.`, 'success')
  }, [datasets])

  const handleMarkReady = useCallback((datasetId: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    let newStage: EtlStage = 'Ready'
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          newStage = d.etlStage === 'Ready' ? 'Quality Check' : 'Ready'
          return {
            ...d,
            etlStage: newStage,
            lastUpdated: now,
          }
        }
        return d
      })
    )

    const target = datasets.find((d) => d.id === datasetId)
    if (target) {
      const newEvent: IngestionTimelineEvent = {
        id: `evt-rdy-${Date.now()}`,
        timestamp: now,
        datasetName: target.name,
        stage: newStage,
        status: 'success',
        summary: `Pipeline stage transitioned to '${newStage}' by statutory audit operator.`,
        recordsProcessed: target.records,
      }
      setTimelineEvents((prev) => [newEvent, ...prev])
    }

    showToast(`Dataset pipeline stage set to '${newStage}'.`, 'success')
  }, [datasets])

  const handleRefreshLake = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('Lake synchronization complete. Telemetry buffers refreshed.', 'info')
    }, 800)
  }

  // Filtered dataset evaluation
  const filteredDatasets = useMemo(() => {
    return datasets.filter((ds) => {
      // 1. Search filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = ds.name.toLowerCase().includes(query)
        const matchesSource = ds.source.toLowerCase().includes(query)
        const matchesAuthority = ds.sourceAuthority.toLowerCase().includes(query)
        const matchesDesc = ds.description.toLowerCase().includes(query)
        const matchesColumns = ds.columns.some((c) => c.name.toLowerCase().includes(query))
        const matchesJoinKeys = ds.joinKeys.some((jk) => jk.toLowerCase().includes(query))
        if (
          !matchesName &&
          !matchesSource &&
          !matchesAuthority &&
          !matchesDesc &&
          !matchesColumns &&
          !matchesJoinKeys
        ) {
          return false
        }
      }

      // 2. Status filter
      if (filters.status !== 'ALL' && ds.ingestionStatus !== filters.status) {
        return false
      }

      // 3. File type filter
      if (filters.fileType !== 'ALL' && ds.fileType !== filters.fileType) {
        return false
      }

      return true
    })
  }, [datasets, filters])

  const selectedDataset = useMemo(() => {
    return datasets.find((d) => d.id === selectedDatasetId) || null
  }, [datasets, selectedDatasetId])

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* 1. Sovereign Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#232D47] pb-3 pt-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold text-[#E7EBF5] tracking-tight">
              Data Sources & Ingestion Workspace
            </h1>
            <StatusPill label="11 SCHEMAS REGISTERED" variant="live" />
            <StatusPill label="GATEWAY CONNECTED" variant="synced" />
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5 font-sans">
            Government data-ingestion lake, cross-dataset referential join keys, and data-quality monitoring for MPLADS statutory oversight.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="compact"
            onClick={handleRefreshLake}
            disabled={isRefreshing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Sync Telemetry
          </Button>
          <Button
            variant="primary"
            size="compact"
            onClick={() => {
              showToast('Exporting Statutory Data Lake Manifest (JSON)...', 'info')
            }}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Manifest
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#0F3020] border-[#22C55E40] text-[#22C55E]'
              : toastMessage.type === 'warning'
              ? 'bg-[#3A2A0C] border-[#F59E0B40] text-[#F59E0B]'
              : 'bg-[#10233F] border-[#3B82F640] text-[#adc6ff]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-current opacity-70 hover:opacity-100 font-mono text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Ingestion Status KPI Cards */}
      <IngestionKpiStrip datasets={datasets} joinKeys={joinKeys} />

      {/* 3. Interactive ETL Pipeline Visualizer */}
      <EtlPipelineVisualizer
        selectedDataset={selectedDataset}
        allDatasets={datasets}
      />

      {/* 4. Filters and Search Bar */}
      <DataSourceFiltersBar
        filters={filters}
        datasets={datasets}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onRefresh={handleRefreshLake}
        isRefreshing={isRefreshing}
      />

      {/* 5. Dataset Registry Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-xs font-bold font-mono text-[#E7EBF5] uppercase tracking-wider">
              Statutory Dataset Registry & Ingestion Ledger
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#667090]">
            CLICK ANY ROW TO OPEN DETAILED INSPECTION DRAWER
          </span>
        </div>

        <DataSourceRegistryTable
          datasets={filteredDatasets}
          selectedDatasetId={selectedDatasetId}
          onSelectDataset={handleSelectDataset}
        />
      </div>

      {/* 6. Lower Workspace Panels: Join Keys, Data Quality Warnings & Timeline */}
      <div className="space-y-3 pt-2">
        {/* Sub-navigation tabs for lower analysis panels */}
        <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveBottomTab('joins')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono transition-colors ${
                activeBottomTab === 'joins'
                  ? 'bg-[#161F36] text-[#adc6ff] border-t-2 border-[#3B82F6] font-bold'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36]/50'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Join-Key Monitoring ({joinKeys.length})</span>
            </button>
            <button
              onClick={() => setActiveBottomTab('warnings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono transition-colors ${
                activeBottomTab === 'warnings'
                  ? 'bg-[#161F36] text-[#adc6ff] border-t-2 border-[#3B82F6] font-bold'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36]/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Data-Quality Warnings ({warnings.length})</span>
            </button>
            <button
              onClick={() => setActiveBottomTab('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono transition-colors ${
                activeBottomTab === 'timeline'
                  ? 'bg-[#161F36] text-[#adc6ff] border-t-2 border-[#3B82F6] font-bold'
                  : 'text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#161F36]/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ingestion Timeline ({timelineEvents.length})</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-[#667090] hidden sm:inline">
            CROSS-DATASET STATUTORY OVERSIGHT SUITE
          </span>
        </div>

        {/* Tab Content Display */}
        {activeBottomTab === 'joins' && <JoinKeyMonitoringPanel joinKeys={joinKeys} />}
        {activeBottomTab === 'warnings' && <DataQualityWarningsPanel warnings={warnings} />}
        {activeBottomTab === 'timeline' && <IngestionTimeline events={timelineEvents} />}
      </div>

      {/* 7. Detailed Dataset Drawer / Panel */}
      <DatasetDetailDrawer
        dataset={selectedDataset}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onValidate={handleValidate}
        onRerunQualityCheck={handleRerunQualityCheck}
        onMarkReady={handleMarkReady}
        initialTab={drawerInitialTab}
      />
    </div>
  )
}
