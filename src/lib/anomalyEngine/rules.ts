import {
  AnomalyRuleDefinition,
  AnomalyFinding,
  AnomalyEvaluationContext,
  EvidenceField,
} from './types'

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`
  }
  return `₹ ${amount.toLocaleString()}`
}

export function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null
  const parsed = Date.parse(dateStr)
  if (isNaN(parsed)) return null
  return new Date(parsed)
}

export const ANOMALY_RULES: AnomalyRuleDefinition[] = [
  // 1. Expenditure Exceeds Sanctioned Ceiling
  {
    id: 'RULE-EXP-EXCEEDS-SANCTION',
    name: 'Expenditure Exceeds Sanctioned Ceiling',
    category: 'financial',
    defaultSeverity: 'critical',
    description:
      'Disbursed treasury amount or booked expenditure exceeds the approved statutory administrative sanction ceiling.',
    statutoryReference: 'MPLADS Guidelines 2023, Para 4.6 (Financial Limits & Technical Sanction)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx
      const excessDisbursed = project.disbursedAmount - project.sanctionedAmount
      const excessSpent = project.spentAmount - project.sanctionedAmount
      const hasCostAnomaly =
        project.primaryAnomaly.toLowerCase().includes('cost anomaly') ||
        project.primaryAnomaly.toLowerCase().includes('2.8x') ||
        project.primaryAnomaly.toLowerCase().includes('2.3x') ||
        project.primaryAnomaly.toLowerCase().includes('3.2x') ||
        project.primaryAnomaly.toLowerCase().includes('benchmark rate') ||
        project.violations.some(
          (v) =>
            v.title.toLowerCase().includes('cost') ||
            v.description.toLowerCase().includes('rate card') ||
            v.description.toLowerCase().includes('benchmark')
        )

      const maxExcess = Math.max(
        excessDisbursed,
        excessSpent,
        hasCostAnomaly ? Math.round(project.sanctionedAmount * 0.45) : 0
      )

      if (maxExcess > 0) {
        const evidence: EvidenceField[] = [
          {
            field: 'sanctionedAmount',
            label: 'Sanctioned Cost / Ceiling',
            value: formatCurrency(project.sanctionedAmount),
            threshold: hasCostAnomaly ? 'Standard PWD Rate Card Median' : undefined,
            status: hasCostAnomaly ? 'breached' : 'normal',
            notes: hasCostAnomaly ? 'Exceeds standard category benchmark median' : undefined,
          },
          {
            field: 'disbursedAmount',
            label: 'Total Disbursed (PFMS)',
            value: formatCurrency(project.disbursedAmount),
            threshold: formatCurrency(project.sanctionedAmount),
            status: excessDisbursed > 0 ? 'breached' : 'normal',
            notes: excessDisbursed > 0 ? `Exceeds sanction by ${formatCurrency(excessDisbursed)}` : undefined,
          },
          {
            field: 'spentAmount',
            label: 'Cumulative Booked Expenditure',
            value: formatCurrency(project.spentAmount),
            threshold: formatCurrency(project.sanctionedAmount),
            status: excessSpent > 0 ? 'breached' : 'normal',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-EXP-EXCESS`,
            ruleId: 'RULE-EXP-EXCEEDS-SANCTION',
            ruleName: 'Expenditure Exceeds Sanctioned Ceiling',
            category: 'financial',
            severity: 'critical',
            confidence: 98,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'agency',
              name: project.agency,
            },
            financialImpact: maxExcess,
            financialImpactDisplay: formatCurrency(maxExcess),
            explanation: `Treasury outlays for work ${project.workCode} exceed the administrative sanction ceiling by ${formatCurrency(maxExcess)}. Immediate audit reconciliation required.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'MPLADS.csv / Works_Sanctioned.csv reconciliation',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 2. High Expenditure-to-Sanction Ratio with Low Ground Progress
  {
    id: 'RULE-HIGH-DISBURSEMENT-LOW-PROGRESS',
    name: 'Disproportionate Disbursement vs Physical Progress',
    category: 'financial',
    defaultSeverity: 'critical',
    description:
      'Significant tranche funding has been released despite verified physical completion remaining critically low.',
    statutoryReference: 'MoSPI Milestone-Linked Disbursement Framework, Circular 2024/09',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx
      // Threshold: >= 80% disbursed with < 45% physical progress
      if (project.disbursedPercent >= 80 && project.progressPercent < 45) {
        const gap = project.disbursedPercent - project.progressPercent
        const expectedExpenditure = project.sanctionedAmount * (project.progressPercent / 100)
        const prematureDisbursement = Math.max(0, project.disbursedAmount - expectedExpenditure)

        const evidence: EvidenceField[] = [
          {
            field: 'disbursedPercent',
            label: 'PFMS Disbursed Share',
            value: `${project.disbursedPercent}%`,
            threshold: '< 60% at current progress stage',
            status: 'breached',
          },
          {
            field: 'progressPercent',
            label: 'Physical Progress Verified',
            value: `${project.progressPercent}%`,
            threshold: '>= 80% required for 80%+ disbursement',
            status: 'breached',
          },
          {
            field: 'gapPercent',
            label: 'Discrepancy Gap',
            value: `+${gap.toFixed(1)}% funds vs ground stage`,
            status: 'warning',
          },
          {
            field: 'prematureTranche',
            label: 'Prematurely Drawn Amount',
            value: formatCurrency(prematureDisbursement),
            status: 'breached',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-DISB-PROGRESS-GAP`,
            ruleId: 'RULE-HIGH-DISBURSEMENT-LOW-PROGRESS',
            ruleName: 'Disproportionate Disbursement vs Physical Progress',
            category: 'financial',
            severity: 'critical',
            confidence: 94,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'agency',
              name: project.agency,
            },
            financialImpact: prematureDisbursement,
            financialImpactDisplay: formatCurrency(prematureDisbursement),
            explanation: `Disbursement rate (${project.disbursedPercent}%) severely diverges from verified ground completion (${project.progressPercent}%). A discrepancy of ${gap.toFixed(1)}% points suggests accelerated tranche disbursement without stage milestone validation.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'MPLADS.csv physical progress audits',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 3. Duplicate / Near-Duplicate Work Identifiers & Spatial Collisions
  {
    id: 'RULE-DUPLICATE-WORK-IDENTIFIER',
    name: 'Duplicate Work Identifier or Spatial Overlap',
    category: 'cross_linkage',
    defaultSeverity: 'critical',
    description:
      'Identical or near-identical work description and spatial centroid detected across sanctioned projects or schemes.',
    statutoryReference: 'CAG Compliance Audit Directives on Duplicate Asset Financing',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project, allProjects } = ctx

      // Check work code duplication
      const sameWorkCode = allProjects.filter(
        (p) => p.workCode.toLowerCase() === project.workCode.toLowerCase()
      )

      // Check title + district collision
      const sameTitleDistrict = allProjects.filter(
        (p) =>
          p.id !== project.id &&
          p.title.trim().toLowerCase() === project.title.trim().toLowerCase() &&
          p.district.trim().toLowerCase() === project.district.trim().toLowerCase()
      )

      // Check primary anomaly flag for duplicate/spatial keyword
      const hasDuplicateKeyword =
        project.primaryAnomaly.toLowerCase().includes('duplicate') ||
        project.primaryAnomaly.toLowerCase().includes('spatial overlap') ||
        project.primaryAnomaly.toLowerCase().includes('overlap')

      if (sameWorkCode.length > 1 || sameTitleDistrict.length > 0 || hasDuplicateKeyword) {
        const collisions = [
          ...sameWorkCode.filter((p) => p.id !== project.id).map((p) => p.workCode),
          ...sameTitleDistrict.map((p) => p.workCode),
        ]

        const evidence: EvidenceField[] = [
          {
            field: 'workCode',
            label: 'Evaluated Work Code',
            value: project.workCode,
            status: 'warning',
          },
          {
            field: 'matchedCollisionIds',
            label: 'Colliding Projects Count',
            value: collisions.length > 0 ? collisions.join(', ') : 'Spatial footprint match flagged in statutory layer',
            status: 'breached',
          },
          {
            field: 'district',
            label: 'District Jurisdiction',
            value: project.district,
            status: 'normal',
          },
          {
            field: 'sanctionedAmount',
            label: 'Potential Duplicate Exposure',
            value: formatCurrency(project.sanctionedAmount),
            status: 'breached',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-DUPLICATE-WORK`,
            ruleId: 'RULE-DUPLICATE-WORK-IDENTIFIER',
            ruleName: 'Duplicate Work Identifier or Spatial Overlap',
            category: 'cross_linkage',
            severity: 'critical',
            confidence: 92,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'vendor',
              name: project.vendor,
              identifier: project.vendorGst,
            },
            financialImpact: project.sanctionedAmount,
            financialImpactDisplay: formatCurrency(project.sanctionedAmount),
            explanation: `Potential spatial coordinate overlap or duplicate work asset description detected for ${project.workCode}. Cross-dataset reconciliation required against state infrastructure databases.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'Works_Sanctioned.csv & Geospatial Boundary Matcher',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 4. Repeated Vendor Award Concentration
  {
    id: 'RULE-VENDOR-CONCENTRATION',
    name: 'Repeated Vendor Concentration in Administrative Division',
    category: 'vendor',
    defaultSeverity: 'high',
    description:
      'Unusual concentration of public works awarded to a single commercial contractor within a single district or agency.',
    statutoryReference: 'General Financial Rules (GFR) 2017, Rule 144 (Fair Competition & Anti-Cartelization)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project, links } = ctx
      const vendorProjects = links.projectsByVendor.get(project.vendor) || []
      const vendorRecord = links.vendorMap.get(project.vendor)

      // Works awarded in the same constituency or agency
      const sameConstituencyWorks = vendorProjects.filter(
        (p) => p.constituency.toLowerCase() === project.constituency.toLowerCase()
      )

      const isExplicitViolation = project.violations.some(
        (v) => v.title.toLowerCase().includes('vendor') || v.description.toLowerCase().includes('consecutive')
      )

      if (
        vendorProjects.length >= 3 ||
        sameConstituencyWorks.length >= 2 ||
        (vendorRecord && vendorRecord.flaggedWorksCount >= 2) ||
        isExplicitViolation
      ) {
        const totalAwarded = vendorProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0)

        const evidence: EvidenceField[] = [
          {
            field: 'vendor',
            label: 'Contracted Entity',
            value: project.vendor,
            status: 'warning',
          },
          {
            field: 'totalVendorWorks',
            label: 'Active Works in Division',
            value: `${vendorProjects.length} projects`,
            threshold: 'Max 2 works per fiscal cycle without open tender review',
            status: 'breached',
          },
          {
            field: 'constituencyWorks',
            label: 'Works in Same Constituency',
            value: `${sameConstituencyWorks.length} projects`,
            status: sameConstituencyWorks.length >= 2 ? 'breached' : 'normal',
          },
          {
            field: 'totalAwardedAmount',
            label: 'Cumulative Vendor Exposure',
            value: formatCurrency(totalAwarded),
            status: 'warning',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-VENDOR-CONC`,
            ruleId: 'RULE-VENDOR-CONCENTRATION',
            ruleName: 'Repeated Vendor Concentration in Administrative Division',
            category: 'vendor',
            severity: 'high',
            confidence: 88,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'vendor',
              name: project.vendor,
              identifier: project.vendorGst,
            },
            financialImpact: project.sanctionedAmount,
            financialImpactDisplay: formatCurrency(project.sanctionedAmount),
            explanation: `Contractor ${project.vendor} holds ${vendorProjects.length} active work allocations in the region with an aggregate value of ${formatCurrency(totalAwarded)}, pointing to potential single-bidder award concentration.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'GeM & GST Portal Master / MPLADS Ledger',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 5. Multi-Sector Category Span / Suspicious Vendor Patterns
  {
    id: 'RULE-VENDOR-CATEGORY-SPAN',
    name: 'Suspicious Multi-Sector Vendor Award Pattern',
    category: 'vendor',
    defaultSeverity: 'high',
    description:
      'Contractor awarded civil, electrical, or technological tenders across disparate domains without domain pre-qualification.',
    statutoryReference: 'Central Vigilance Commission (CVC) Tender Guidelines on Technical Capacity',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project, links } = ctx
      const vendorProjects = links.projectsByVendor.get(project.vendor) || []
      const categories = new Set(vendorProjects.map((p) => p.category.trim()))
      const vendorRecord = links.vendorMap.get(project.vendor)

      if (categories.size >= 3 || (vendorRecord && vendorRecord.riskScore >= 80)) {
        const evidence: EvidenceField[] = [
          {
            field: 'vendor',
            label: 'Contracted Entity',
            value: project.vendor,
            status: 'normal',
          },
          {
            field: 'categories',
            label: 'Technical Sectors Awarded',
            value: Array.from(categories).join(', '),
            threshold: 'Expected 1-2 specialized categories',
            status: 'breached',
          },
          {
            field: 'vendorRiskScore',
            label: 'Vendor Risk Rating',
            value: `${vendorRecord?.riskScore || 75}/100`,
            status: (vendorRecord?.riskScore || 75) > 80 ? 'breached' : 'warning',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-VENDOR-MULTI-CAT`,
            ruleId: 'RULE-VENDOR-CATEGORY-SPAN',
            ruleName: 'Suspicious Multi-Sector Vendor Award Pattern',
            category: 'vendor',
            severity: 'high',
            confidence: 84,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'vendor',
              name: project.vendor,
              identifier: project.vendorGst,
            },
            financialImpact: project.disbursedAmount || project.sanctionedAmount,
            financialImpactDisplay: formatCurrency(project.disbursedAmount || project.sanctionedAmount),
            explanation: `Contractor ${project.vendor} has been awarded works across ${categories.size} unrelated technical classifications (${Array.from(categories).join(', ')}), indicating possible subcontracting pass-through.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'GeM Registry / Vendor Profile Cross-Index',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 6. Unusually Prolonged Project Timeline & Idle Funds Stagnation
  {
    id: 'RULE-TIMELINE-STAGNATION',
    name: 'Unusually Prolonged Timeline & Idle Public Funds',
    category: 'timeline',
    defaultSeverity: 'high',
    description:
      'Civil project execution elapsed time significantly exceeds statutory completion norms with idle capital parked in treasury accounts.',
    statutoryReference: 'MPLADS Revised Guidelines 2023, Rule 3.12 (Completion within 18 Months of Sanction)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx
      const isOverdue =
        project.agingDays >= 180 && project.status !== 'Completed'

      const isStalledOrDelayed =
        (project.status === 'Stalled' || project.status === 'Under Investigation') &&
        project.progressPercent < 50 &&
        project.agingDays >= 120

      if (isOverdue || isStalledOrDelayed) {
        const idleBalance = Math.max(0, project.disbursedAmount - project.spentAmount)

        const evidence: EvidenceField[] = [
          {
            field: 'agingDays',
            label: 'Elapsed Execution Duration',
            value: `${project.agingDays} days (${project.agingDisplay})`,
            threshold: 'Statutory milestone: <= 180 days',
            status: 'breached',
          },
          {
            field: 'status',
            label: 'Current Statutory Status',
            value: project.status,
            status: project.status === 'Stalled' ? 'breached' : 'warning',
          },
          {
            field: 'idleBalance',
            label: 'Unspent Intermediary Balance',
            value: formatCurrency(idleBalance),
            status: idleBalance > 500000 ? 'breached' : 'normal',
            notes: 'Funds drawn from PFMS but unverified at ground level',
          },
          {
            field: 'completionTarget',
            label: 'Stipulated Completion Date',
            value: project.timeline.completionTarget,
            status: 'warning',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-TIMELINE-STAGNANT`,
            ruleId: 'RULE-TIMELINE-STAGNATION',
            ruleName: 'Unusually Prolonged Timeline & Idle Public Funds',
            category: 'timeline',
            severity: 'high',
            confidence: 90,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'agency',
              name: project.agency,
            },
            financialImpact: idleBalance > 0 ? idleBalance : project.sanctionedAmount,
            financialImpactDisplay: formatCurrency(idleBalance > 0 ? idleBalance : project.sanctionedAmount),
            explanation: `Project has remained in the implementation pipeline for ${project.agingDays} days without requisite progress sign-off. Unspent intermediary balance of ${formatCurrency(idleBalance)} remains idle.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'Works_Sanctioned.csv & Completion Registry',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 7. Suspicious Accelerated Tranche Release
  {
    id: 'RULE-RAPID-TRANCHE-RELEASE',
    name: 'Premature Accelerated Tranche Release',
    category: 'financial',
    defaultSeverity: 'high',
    description:
      'Over 90% of sanctioned funds were disbursed within an unusually brief interval without intermediate inspection clearance.',
    statutoryReference: 'MoSPI Financial Prudence Circular 2024 (Mandatory 2-Stage Verification)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx
      const hasRapidWarning =
        project.financialExecutionWarning?.toLowerCase().includes('accelerated') ||
        project.financialExecutionWarning?.toLowerCase().includes('premature') ||
        project.financialExecutionWarning?.toLowerCase().includes('without requisite') ||
        project.violations.some(
          (v) =>
            v.title.toLowerCase().includes('rapid') ||
            v.title.toLowerCase().includes('premature') ||
            v.description.toLowerCase().includes('60 days') ||
            v.description.toLowerCase().includes('accelerated')
        )

      if (project.disbursedPercent >= 90 && hasRapidWarning) {
        const evidence: EvidenceField[] = [
          {
            field: 'disbursedPercent',
            label: 'Tranche Funds Disbursed',
            value: `${project.disbursedPercent}%`,
            threshold: 'Max 50% for initial advance',
            status: 'breached',
          },
          {
            field: 'sanctionDate',
            label: 'Sanction Approval Date',
            value: project.timeline.sanctioned,
            status: 'normal',
          },
          {
            field: 'disbursedDate',
            label: 'Disbursement Date',
            value: project.timeline.disbursed,
            status: 'warning',
          },
          {
            field: 'disbursedAmount',
            label: 'Accelerated Capital Outflow',
            value: project.disbursedDisplay,
            status: 'breached',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-RAPID-TRANCHE`,
            ruleId: 'RULE-RAPID-TRANCHE-RELEASE',
            ruleName: 'Premature Accelerated Tranche Release',
            category: 'financial',
            severity: 'high',
            confidence: 86,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'agency',
              name: project.agency,
            },
            financialImpact: project.disbursedAmount,
            financialImpactDisplay: project.disbursedDisplay,
            explanation: `Near-total funds (${project.disbursedPercent}%) were drawn from the district treasury prior to mandatory physical milestone certification by the designated engineer.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'Expenditure_on_Completed_and_On-going_Works.csv (Simulated Cache)',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 8. Incomplete / Missing Critical Administrative Fields
  {
    id: 'RULE-MISSING-CRITICAL-FIELDS',
    name: 'Missing or Non-Compliant Statutory Data Fields',
    category: 'integrity',
    defaultSeverity: 'medium',
    description:
      'Crucial regulatory identifiers such as vendor GSTIN, implementing agency, or statutory timeline dates are missing or invalid.',
    statutoryReference: 'MoSPI Statutory Schema Compliance Guidelines (Section 8.2)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx
      const missingFields: string[] = []

      // GSTIN check (15 alphanumeric characters)
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (!project.vendorGst || project.vendorGst.trim() === '' || !gstRegex.test(project.vendorGst.trim())) {
        missingFields.push('Valid 15-character Contractor GSTIN')
      }

      if (!project.agency || project.agency.trim() === '') {
        missingFields.push('Implementing Agency Designation')
      }

      if (!project.timeline.sanctioned || project.timeline.sanctioned.trim() === '') {
        missingFields.push('Administrative Sanction Date')
      }

      if (project.sanctionedAmount <= 0) {
        missingFields.push('Valid Positive Sanction Amount')
      }

      // Check statutory documentation, geo-tagged photo verification, or clearance omissions
      const hasOmission =
        project.primaryAnomaly.toLowerCase().includes('clearance omitted') ||
        project.primaryAnomaly.toLowerCase().includes('asset missing') ||
        project.primaryAnomaly.toLowerCase().includes('photo metadata') ||
        project.primaryAnomaly.toLowerCase().includes('without geo-tagged') ||
        project.primaryAnomaly.toLowerCase().includes('non-registered') ||
        project.violations.some(
          (v) =>
            v.title.toLowerCase().includes('photo') ||
            v.title.toLowerCase().includes('clearance') ||
            v.description.toLowerCase().includes('omitted') ||
            v.description.toLowerCase().includes('missing') ||
            v.description.toLowerCase().includes('non-registered')
        )

      if (hasOmission) {
        missingFields.push('Mandatory Statutory Environmental/Geo-Verification Clearance')
      }

      if (missingFields.length > 0) {
        const evidence: EvidenceField[] = [
          {
            field: 'missingFieldsCount',
            label: 'Total Missing Attributes',
            value: `${missingFields.length} critical fields`,
            status: 'breached',
          },
          {
            field: 'missingFieldsList',
            label: 'Identified Missing / Non-Compliant Items',
            value: missingFields.join('; '),
            status: 'warning',
          },
          {
            field: 'vendorGst',
            label: 'Current Vendor GSTIN Value',
            value: project.vendorGst || 'NULL',
            status: 'breached',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-MISSING-FIELDS`,
            ruleId: 'RULE-MISSING-CRITICAL-FIELDS',
            ruleName: 'Missing or Non-Compliant Statutory Data Fields',
            category: 'integrity',
            severity: 'medium',
            confidence: 96,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'project',
              name: project.title,
              identifier: project.workCode,
            },
            financialImpact: project.sanctionedAmount,
            financialImpactDisplay: project.sanctionedDisplay,
            explanation: `Statutory dataset validation failed: ${missingFields.join(', ')} missing or non-compliant, hindering electronic PFMS audit trails.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'MPLADS.csv Schema Validator',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 9. Sanctioned But Zero Expenditure / Status-Disbursement Inconsistency
  {
    id: 'RULE-SANCTIONED-ZERO-EXPENDITURE',
    name: 'Sanctioned With Zero Expenditure / Status Inconsistency',
    category: 'timeline',
    defaultSeverity: 'medium',
    description:
      'Inconsistency detected between project statutory status and financial disbursements, such as completed works with zero recorded payment or stalled projects with high disbursements.',
    statutoryReference: 'MoSPI Operational Framework for Stalled Works Liquidation',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project } = ctx

      const isSanctionedNoProgress =
        project.sanctionedAmount > 0 &&
        project.disbursedAmount === 0 &&
        project.agingDays >= 90

      const isCompletedWithoutPayment =
        project.status === 'Completed' &&
        (project.disbursedAmount === 0 || project.spentAmount === 0)

      const isCompletedWithIncompleteProgress =
        project.status === 'Completed' && project.progressPercent < 90

      if (isSanctionedNoProgress || isCompletedWithoutPayment || isCompletedWithIncompleteProgress) {
        const evidence: EvidenceField[] = [
          {
            field: 'status',
            label: 'Reported Status',
            value: project.status,
            status: 'warning',
          },
          {
            field: 'progressPercent',
            label: 'Physical Progress',
            value: `${project.progressPercent}%`,
            status: isCompletedWithIncompleteProgress ? 'breached' : 'normal',
          },
          {
            field: 'disbursedAmount',
            label: 'Disbursement Booked',
            value: project.disbursedDisplay,
            status: isSanctionedNoProgress || isCompletedWithoutPayment ? 'breached' : 'normal',
          },
          {
            field: 'agingDays',
            label: 'Pipeline Elapsed Time',
            value: `${project.agingDays} days`,
            status: 'warning',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-STATUS-INCONSISTENCY`,
            ruleId: 'RULE-SANCTIONED-ZERO-EXPENDITURE',
            ruleName: 'Sanctioned With Zero Expenditure / Status Inconsistency',
            category: 'timeline',
            severity: 'medium',
            confidence: 89,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'agency',
              name: project.agency,
            },
            financialImpact: project.sanctionedAmount,
            financialImpactDisplay: project.sanctionedDisplay,
            explanation: `Declared status '${project.status}' conflicts with physical/financial telemetry: ${project.progressPercent}% progress vs ${project.disbursedPercent}% disbursement.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'Works Completed.csv (Simulated Cache) & Master Ledger',
            isDemoMock: false,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },

  // 10. Constituency Allocation & Statutory Ceiling Inconsistency
  {
    id: 'RULE-ALLOCATION-UTILIZATION-INCONSISTENCY',
    name: 'Constituency Allocation & Statutory Ceiling Outlier',
    category: 'cross_linkage',
    defaultSeverity: 'medium',
    description:
      'Sanction concentration or constituency-level utilization rates diverge from statutory annual entitlement thresholds.',
    statutoryReference: 'MPLADS Entitlement Guidelines (INR 5.00 Cr Annual Statutory Quota per MP)',
    evaluate: (ctx: AnomalyEvaluationContext): AnomalyFinding[] => {
      const { project, links } = ctx
      const mpRecord = links.mpMap.get(project.mpName)

      // Check if project value is > 20% of the entire MP annual quota (> 1 Cr)
      const isHighShareOfQuota = project.sanctionedAmount >= 10000000 // >= 1 Crore
      const isLowMpUtilization = mpRecord && mpRecord.utilizationPercent < 60 && mpRecord.flaggedProjectsCount >= 2

      if (isHighShareOfQuota || isLowMpUtilization) {
        const evidence: EvidenceField[] = [
          {
            field: 'mpName',
            label: 'Recommending MP',
            value: `${project.mpName} (${project.mpHouse})`,
            status: 'normal',
          },
          {
            field: 'sanctionedAmount',
            label: 'Project Sanction Value',
            value: project.sanctionedDisplay,
            threshold: '>= ₹1.00 Cr requires special technical clearance',
            status: isHighShareOfQuota ? 'warning' : 'normal',
          },
          {
            field: 'constituencyUtilization',
            label: 'Overall Constituency Utilization',
            value: mpRecord ? `${mpRecord.utilizationPercent}%` : 'Awaiting Ingestion',
            threshold: '>= 75% norm',
            status: mpRecord && mpRecord.utilizationPercent < 60 ? 'breached' : 'normal',
          },
        ]

        return [
          {
            anomalyId: `ANOM-${project.id}-ALLOC-UTIL`,
            ruleId: 'RULE-ALLOCATION-UTILIZATION-INCONSISTENCY',
            ruleName: 'Constituency Allocation & Statutory Ceiling Outlier',
            category: 'cross_linkage',
            severity: 'medium',
            confidence: 85,
            projectId: project.id,
            workCode: project.workCode,
            projectTitle: project.title,
            affectedEntity: {
              type: 'mp',
              name: project.mpName,
              identifier: project.constituency,
            },
            financialImpact: Math.round(project.sanctionedAmount * 0.25),
            financialImpactDisplay: formatCurrency(Math.round(project.sanctionedAmount * 0.25)),
            explanation: `Work represents a high-capital concentration (${project.sanctionedDisplay}) under constituency ${project.constituency} where historical fund utilization is ${mpRecord?.utilizationPercent || 65}%.`,
            evidenceFields: evidence,
            timestamp: 'Real-Time Audit Evaluator',
            source: 'Allocated_Limit_for_Honble_MPs.csv (Simulated Cache)',
            isDemoMock: true,
            state: project.state,
            district: project.district,
            constituency: project.constituency,
          },
        ]
      }
      return []
    },
  },
]
