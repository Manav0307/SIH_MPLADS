export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type AssistantEntityType = 'case' | 'project' | 'vendor' | 'mp' | 'agency' | 'investigation' | 'general'

export interface AssistantContext {
  type: AssistantEntityType
  id: string
  title: string
  subtitle?: string
  workCode?: string
  riskScore?: number
  riskLevel?: RiskSeverity
  location?: string
  metadata?: Record<string, string>
}

export interface InvestigationReasoningStep {
  label: string
  title: string
  description: string
  status?: 'critical' | 'alert' | 'warning' | 'normal' | 'active'
  metric?: string
}

export interface InvestigationReasoningChain {
  evidence: InvestigationReasoningStep
  finding: InvestigationReasoningStep
  riskAssessment: InvestigationReasoningStep
  impact: InvestigationReasoningStep
  recommendedAction: InvestigationReasoningStep
}

export interface AssistantEvidenceCitation {
  id: string
  title: string
  description: string
  metric?: string
  severity: RiskSeverity
  route: string
  targetType: 'project' | 'case' | 'vendor' | 'agency' | 'mp'
  targetId: string
}

export interface AssistantRuleReference {
  code: string
  title: string
  category: string
  weight: number
  status: 'TRIGGERED' | 'EVALUATED'
  description?: string
}

export interface AssistantRelatedEntity {
  type: 'project' | 'vendor' | 'agency' | 'mp' | 'case'
  name: string
  id: string
  role: string
  riskScore?: number
  riskLevel?: RiskSeverity
  route: string
}

export interface AssistantFinancialExposure {
  sanctioned: string
  disbursed: string
  spent: string
  exposure: string
  variancePercent?: string
}

export interface AssistantAction {
  id: string
  label: string
  actionType:
    | 'open_case'
    | 'view_evidence'
    | 'investigate_project'
    | 'view_vendor'
    | 'view_agency'
    | 'escalate'
    | 'add_note'
  icon?: string
  route?: string
  payload?: Record<string, any>
}

export interface AssistantMessage {
  id: string
  sender: 'user' | 'assistant'
  timestamp: string
  text: string
  isDemonstration?: boolean
  confidence?: number
  confidenceLabel?: string
  reasoningChain?: InvestigationReasoningChain
  evidenceCitations?: AssistantEvidenceCitation[]
  ruleReferences?: AssistantRuleReference[]
  financialExposure?: AssistantFinancialExposure
  relatedEntities?: AssistantRelatedEntity[]
  recommendedActions?: AssistantAction[]
}
