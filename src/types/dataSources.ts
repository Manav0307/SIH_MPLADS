export type IngestionStatus = 'Available' | 'Pending Upload' | 'Missing'

export type SchemaStatus = 'Validated' | 'Warning' | 'Schema Mismatch' | 'Pending Parse' | 'Unverified'

export type JoinStatus = 'Linked' | 'Partial' | 'Unresolved' | 'Pending Ingestion'

export type EtlStage =
  | 'Upload'
  | 'Validate'
  | 'Normalize'
  | 'Deduplicate'
  | 'Join'
  | 'Quality Check'
  | 'Ready'

export interface ColumnDefinition {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  foreignTarget?: string
  description: string
  sampleValue?: string
  nullCount?: number | null
  nullPercentage?: number | null
}

export interface JoinKeyDefinition {
  keyName: string
  sourceDataset: string
  targetDataset: string
  sourceColumn: string
  targetColumn: string
  joinType: '1:N' | 'N:1' | '1:1' | 'M:N'
  matchRate: number | null
  orphanCount: number | null
  status: JoinStatus
  description: string
}

export type QualityWarningType =
  | 'missing_file'
  | 'duplicate_record'
  | 'null_identifier'
  | 'schema_deviation'
  | 'join_orphan'

export interface DataQualityWarning {
  id: string
  datasetName: string
  severity: 'critical' | 'high' | 'medium' | 'info'
  type: QualityWarningType
  title: string
  description: string
  impact: string
  remediation: string
  timestamp: string
}

export interface IngestionTimelineEvent {
  id: string
  timestamp: string
  datasetName: string
  stage: EtlStage
  status: 'success' | 'warning' | 'error' | 'pending'
  summary: string
  recordsProcessed?: number | null
}

export interface DataSourceDataset {
  id: string
  name: string
  description: string
  source: string
  sourceAuthority: string
  fileType: 'CSV' | 'XLSX' | 'TSV' | 'GEOJSON'
  records: number | null
  fileSizeBytes?: number | null
  lastUpdated: string | null
  ingestionStatus: IngestionStatus
  schemaStatus: SchemaStatus
  joinStatus: JoinStatus
  dataQualityScore: number | null
  etlStage: EtlStage
  missingValuesCount: number | null
  duplicateRecordsCount: number | null
  columns: ColumnDefinition[]
  detectedIdentifiers: string[]
  joinKeys: string[]
  validationStatus: {
    valid: boolean
    errorCount: number
    warningCount: number
    rulesChecked: string[]
    lastValidatedAt?: string | null
  }
}

export interface DataSourceFilterState {
  searchQuery: string
  status: 'ALL' | IngestionStatus
  fileType: 'ALL' | 'CSV' | 'XLSX' | 'TSV' | 'GEOJSON'
  schemaStatus: 'ALL' | SchemaStatus
}
