import React, { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface ResolveCaseModalProps {
  isOpen: boolean
  caseId: string
  workCode: string
  projectTitle: string
  financialExposureDisplay: string
  onClose: () => void
  onResolveCase: (resolutionCategory: string, remarks: string) => void
}

export const ResolveCaseModal: React.FC<ResolveCaseModalProps> = ({
  isOpen,
  caseId,
  workCode,
  projectTitle,
  financialExposureDisplay,
  onClose,
  onResolveCase,
}) => {
  const [category, setCategory] = useState('Statutory Recovery Executed')
  const [remarks, setRemarks] = useState('')
  const [isCertified, setIsCertified] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCertified) return

    onResolveCase(
      category,
      remarks.trim() ||
        `Statutory audit clearance issued under category '${category}'. All discrepancies verified and closed.`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#10182B] border border-[#232D47] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#0F3020] border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E7EBF5]">Statutory Case Resolution & Closure</h3>
              <span className="font-mono text-[10px] text-[#9AA5C1]">
                {caseId} • {workCode}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#161F36] text-[#667090] hover:text-[#E7EBF5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Summary Box */}
          <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-1">
            <div className="text-[11px] font-bold text-[#E7EBF5]">{projectTitle}</div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA5C1]">
              <span>Work Code: {workCode}</span>
              <span className="text-[#F59E0B] font-bold">Exposure: {financialExposureDisplay}</span>
            </div>
          </div>

          {/* Resolution Category */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Resolution Disposition Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#22C55E]"
            >
              <option value="Statutory Recovery Executed">
                Statutory Recovery Executed (Excess funds remitted back to treasury)
              </option>
              <option value="Physical Milestone Rectified">
                Physical Milestone Rectified (Ground inspection confirmed delivery)
              </option>
              <option value="Procedural Compliance Reconciled">
                Procedural Compliance Reconciled (MB books & bills certified)
              </option>
              <option value="Reclassified / False Positive">
                Reclassified as Compliant / False Positive Flag Dismissed
              </option>
            </select>
          </div>

          {/* Detailed Observations */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Final Audit Closure Memo & Certification Remarks *
            </label>
            <textarea
              rows={3}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide justification, recovery challan / treasury voucher details, or joint measurement certificate summary..."
              className="w-full p-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#22C55E] resize-none"
            />
          </div>

          {/* Auditor Certification Checkbox */}
          <div className="p-3 rounded-lg bg-[#0F3020]/30 border border-[#22C55E]/40 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="certify-resolution"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              className="mt-0.5 rounded border-[#232D47] text-[#22C55E] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="certify-resolution" className="text-[11px] text-[#E7EBF5] cursor-pointer">
              <strong className="text-[#22C55E] block font-mono text-[10px] uppercase">
                Auditor Statutory Declaration
              </strong>
              I hereby certify that all forensic discrepancies in this case have been investigated, verified against ground records, and resolved in accordance with MoSPI / CAG audit standards.
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#232D47] flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="compact" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="compact"
              disabled={!isCertified || !remarks.trim()}
              className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold"
            >
              Sign Off & Resolve Case
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
