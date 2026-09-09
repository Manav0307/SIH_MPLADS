import React from 'react'
import {
  X,
  Printer,
  Download,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { CaseRecord } from '@/types/cases'
import { Button } from '@/components/common/Button'

interface DossierPreviewModalProps {
  isOpen: boolean
  caseItem: CaseRecord
  onClose: () => void
  onExportJson?: (caseItem: CaseRecord) => void
}

export const DossierPreviewModal: React.FC<DossierPreviewModalProps> = ({
  isOpen,
  caseItem,
  onClose,
  onExportJson,
}) => {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (onExportJson) {
      onExportJson(caseItem)
    } else {
      const blob = new Blob([JSON.stringify(caseItem, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Statutory-Dossier-${caseItem.id}-${caseItem.workCode.replace(/\//g, '-')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs select-none overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl bg-[#10182B] print:bg-white print:text-black border border-[#232D47] print:border-none rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] print:max-h-none">
        {/* Top Floating Control Bar (Hidden when printing) */}
        <div className="p-3 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#adc6ff]">
              DOSSIER PREVIEW // {caseItem.id}
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#161F36] text-[#22C55E] border border-[#22C55E]/40 font-bold">
              PRINT-READY COMPLIANCE DRAFT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="compact"
              onClick={handleDownload}
              icon={<Download className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Export JSON
            </Button>
            <Button
              type="button"
              variant="primary"
              size="compact"
              onClick={handlePrint}
              icon={<Printer className="w-3.5 h-3.5" />}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold"
            >
              Print / Save PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-[#161F36] text-[#667090] hover:text-[#E7EBF5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans text-xs bg-[#0A0E1A] print:bg-white print:text-black text-[#CAD2E2]">
          {/* 1. Official Sovereign Ministry Header */}
          <div className="text-center border-b-2 border-[#232D47] print:border-black pb-4 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded border border-[#232D47] print:border-black flex items-center justify-center font-bold text-sm bg-[#161F36] print:bg-transparent text-[#3B82F6] print:text-black">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white print:text-black">
              Government of India • Ministry of Statistics and Programme Implementation
            </h1>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#adc6ff] print:text-gray-800">
              Office of the Comptroller & Auditor General of India (CAG)
            </h2>
            <div className="font-mono text-[10px] text-[#9AA5C1] print:text-gray-600 uppercase tracking-widest pt-1">
              MPLADS Statutory Audit & Anomaly Investigation Dossier • Section 14 Oversight
            </div>

            <div className="flex items-center justify-between pt-3 text-[10px] font-mono border-t border-[#232D47]/60 print:border-gray-400 mt-3 text-[#9AA5C1] print:text-gray-700">
              <div>
                Case Reference: <strong className="text-[#adc6ff] print:text-black">{caseItem.id}</strong>
              </div>
              <div>
                Security: <strong className="text-[#EF4444] print:text-black font-bold">CONFIDENTIAL // STATUTORY AUDIT</strong>
              </div>
              <div>
                Date Generated: <strong className="text-white print:text-black">09 Sep 2026</strong>
              </div>
            </div>
          </div>

          {/* 2. Simulation Disclaimer Banner */}
          <div className="p-3 rounded bg-[#10182B] print:bg-gray-100 border border-[#3B82F6]/40 print:border-gray-400 text-[11px] space-y-0.5">
            <div className="font-mono text-[10px] font-bold text-[#3B82F6] print:text-black uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#3B82F6] print:text-black" />
              Statutory UI Preview & Simulation Disclaimer
            </div>
            <p className="text-[#9AA5C1] print:text-gray-700 leading-relaxed">
              This compliance dossier is a simulated audit preview generated by the MPLADS Anomaly SOC Intelligence Platform. It synthesizes forensic rule engine findings, PFMS transactional ledgers, and geospatial indicators for audit review and mock casework.
            </p>
          </div>

          {/* 3. Project & Entity Administrative Information */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
              1. Project Identification & Administrative Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47] font-mono text-[11px]">
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Work Code</span>
                <span className="text-[#3B82F6] print:text-black font-bold">{caseItem.workCode}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Project Title</span>
                <span className="text-white print:text-black font-semibold">{caseItem.projectTitle}</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Location</span>
                <span className="text-white print:text-black">{caseItem.district}, {caseItem.state}</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Constituency</span>
                <span className="text-white print:text-black">{caseItem.constituency}</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Recommending MP</span>
                <span className="text-white print:text-black">{caseItem.mpName} ({caseItem.mpHouse})</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Implementing Agency</span>
                <span className="text-white print:text-black">{caseItem.agency}</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Contracted Vendor</span>
                <span className="text-[#F59E0B] print:text-black font-bold">{caseItem.vendor}</span>
              </div>
              <div>
                <span className="text-[#667090] print:text-gray-600 block text-[9px] uppercase">Vendor GSTIN</span>
                <span className="text-white print:text-black">{caseItem.vendorGst}</span>
              </div>
            </div>
          </div>

          {/* 4. Financial Discrepancy & Exposure Assessment */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
              2. Financial Forensics & Capital Exposure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
              <div className="p-2 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47]">
                <span className="text-[10px] text-[#667090] print:text-gray-600 block">Sanctioned</span>
                <span className="text-xs font-bold text-white print:text-black mt-0.5 block">
                  {caseItem.project.sanctionedDisplay}
                </span>
              </div>
              <div className="p-2 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47]">
                <span className="text-[10px] text-[#667090] print:text-gray-600 block">Disbursed (PFMS)</span>
                <span className="text-xs font-bold text-[#EF4444] print:text-black mt-0.5 block">
                  {caseItem.project.disbursedDisplay} ({caseItem.project.disbursedPercent}%)
                </span>
              </div>
              <div className="p-2 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47]">
                <span className="text-[10px] text-[#667090] print:text-gray-600 block">Physical Progress</span>
                <span className="text-xs font-bold text-[#F59E0B] print:text-black mt-0.5 block">
                  {caseItem.project.progressPercent}% Stage
                </span>
              </div>
              <div className="p-2 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47]">
                <span className="text-[10px] text-[#667090] print:text-gray-600 block">At-Risk Discrepancy</span>
                <span className="text-xs font-bold text-[#EF4444] print:text-black mt-0.5 block">
                  {caseItem.financialExposureDisplay}
                </span>
              </div>
            </div>

            {caseItem.project.financialExecutionWarning && (
              <div className="p-2 rounded bg-[#401515]/40 print:bg-gray-100 border border-[#EF4444]/40 print:border-gray-400 text-[#EF4444] print:text-black text-[11px] font-mono">
                {caseItem.project.financialExecutionWarning}
              </div>
            )}
          </div>

          {/* 5. Forensic Anomaly Findings */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1 flex items-center justify-between">
              <span>3. Forensic Rule Violations & Tripartite Engine Assessments</span>
              <span className="text-[10px] font-mono text-[#EF4444] print:text-black">
                RISK SCORE: {caseItem.riskScore}/100 ({caseItem.severity.toUpperCase()})
              </span>
            </h3>
            <div className="space-y-2">
              {caseItem.anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-2.5 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47] space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <strong className="text-white print:text-black">{anom.title}</strong>
                      <span className="px-1 py-0.2 rounded bg-[#161F36] print:bg-gray-200 text-[#adc6ff] print:text-black text-[9px] uppercase border border-[#232D47] print:border-gray-300">
                        {anom.ruleId}
                      </span>
                    </div>
                    <span className="text-[#EF4444] print:text-black font-bold">
                      {anom.financialImpactDisplay}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9AA5C1] print:text-gray-700 leading-relaxed font-sans">
                    {anom.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Evidence Registry & Provenance Hashes */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
              4. Evidence Provenance & Cryptographic Registry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] border border-[#232D47] print:border-black">
                <thead className="bg-[#10182B] print:bg-gray-200 text-[#9AA5C1] print:text-black">
                  <tr>
                    <th className="p-1.5">Artifact Title</th>
                    <th className="p-1.5">Source Authority</th>
                    <th className="p-1.5">Status</th>
                    <th className="p-1.5">Cryptographic Hash (SHA-256)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232D47] print:divide-black text-[#CAD2E2] print:text-black">
                  {caseItem.evidence.map((ev) => (
                    <tr key={ev.id}>
                      <td className="p-1.5 font-sans font-medium text-white print:text-black">
                        {ev.title}
                      </td>
                      <td className="p-1.5 text-[#9AA5C1] print:text-gray-700">{ev.source}</td>
                      <td className="p-1.5">
                        <span
                          className={`font-bold uppercase ${
                            ev.verificationStatus === 'Verified'
                              ? 'text-[#22C55E] print:text-black'
                              : 'text-[#EAB308] print:text-black'
                          }`}
                        >
                          {ev.verificationStatus}
                        </span>
                      </td>
                      <td className="p-1.5 text-[#adc6ff] print:text-black">{ev.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Investigation Timeline & Officer Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Timeline */}
            <div className="space-y-1.5">
              <h4 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
                5. Statutory Lifecycle Trail
              </h4>
              <div className="space-y-1.5 font-mono text-[10px]">
                {caseItem.timeline.map((t) => (
                  <div
                    key={t.id}
                    className="p-1.5 rounded bg-[#10182B] print:bg-white print:border print:border-gray-200 border border-[#232D47]"
                  >
                    <div className="flex items-center justify-between text-[#9AA5C1] print:text-gray-600">
                      <span>{t.date}</span>
                      <span className="text-[#3B82F6] print:text-black font-semibold">{t.actor}</span>
                    </div>
                    <div className="text-white print:text-black font-sans text-[11px] font-medium mt-0.5">
                      {t.title}
                    </div>
                    <p className="text-[10px] text-[#9AA5C1] print:text-gray-700 font-sans mt-0.5">
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Notes */}
            <div className="space-y-1.5">
              <h4 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
                6. Auditor Observations & Notes
              </h4>
              <div className="space-y-1.5">
                {caseItem.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded bg-[#10182B] print:bg-white print:border print:border-gray-200 border border-[#232D47] space-y-0.5 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1] print:text-gray-600">
                      <span className="text-[#3B82F6] print:text-black font-semibold">{n.author}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <p className="text-[#E7EBF5] print:text-black leading-relaxed text-[11px]">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Statutory Audit Orders & PFMS Status */}
          <div className="space-y-1.5">
            <h4 className="font-mono text-xs uppercase font-bold text-white print:text-black border-b border-[#232D47] print:border-black pb-1">
              7. Statutory Enforcement & PFMS Disbursal Status
            </h4>
            <div className="p-3 rounded bg-[#10182B] print:bg-white print:border print:border-gray-300 border border-[#232D47] font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#667090] print:text-gray-600">PFMS Tranche Control Order:</span>
                <span className="font-bold text-[#EF4444] print:text-black">
                  {caseItem.pfmsAction.status.toUpperCase()}
                </span>
              </div>
              {caseItem.pfmsAction.orderNumber && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#667090] print:text-gray-600">Order Number:</span>
                  <span className="text-white print:text-black">{caseItem.pfmsAction.orderNumber}</span>
                </div>
              )}
              {caseItem.pfmsAction.reason && (
                <div className="text-[11px] text-[#9AA5C1] print:text-gray-700 font-sans pt-1">
                  Reason: {caseItem.pfmsAction.reason}
                </div>
              )}
            </div>
          </div>

          {/* 9. Signatures Block */}
          <div className="pt-6 border-t border-[#232D47] print:border-black flex items-center justify-between text-[11px] font-mono text-[#9AA5C1] print:text-black">
            <div>
              <div className="font-bold text-white print:text-black">
                {caseItem.assignedOfficer.name}
              </div>
              <div>{caseItem.assignedOfficer.designation}</div>
              <div>{caseItem.assignedOfficer.department}</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-white print:text-black">
                Dr. Rajeshwar Rao, IA&AS
              </div>
              <div>Principal Auditor General</div>
              <div>MoSPI / CAG Sovereign Audit Command</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
