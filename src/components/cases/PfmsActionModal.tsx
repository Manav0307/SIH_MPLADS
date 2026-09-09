import React, { useState } from 'react'
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
  FileCheck,
  AlertOctagon,
} from 'lucide-react'
import { CaseRecord, CasePfmsAction } from '@/types/cases'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

interface PfmsActionModalProps {
  isOpen: boolean
  caseItem: CaseRecord
  onClose: () => void
  onExecutePfmsAction: (action: CasePfmsAction) => void
}

export const PfmsActionModal: React.FC<PfmsActionModalProps> = ({
  isOpen,
  caseItem,
  onClose,
  onExecutePfmsAction,
}) => {
  const currentAction = caseItem.pfmsAction
  const isCurrentlyFrozen = currentAction.status === 'Active Stop-Payment'

  const [actionType, setActionType] = useState<CasePfmsAction['actionType']>(
    isCurrentlyFrozen
      ? 'Release Stop-Payment Hold'
      : 'Stop-Payment Hold (Full Freeze)'
  )
  const [reason, setReason] = useState(
    isCurrentlyFrozen
      ? 'Physical milestone verified following ground re-measurement.'
      : 'Premature tranche disbursement without prerequisite Executive Engineer milestone certification.'
  )
  const [amount, setAmount] = useState<string>(
    caseItem.financialExposure.toString()
  )
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    caseItem.evidence.map((e) => e.id)
  )
  const [authPin, setAuthPin] = useState('8842')
  const [isConfirmed, setIsConfirmed] = useState(false)

  if (!isOpen) return null

  const toggleEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfirmed) return

    const numAmount = parseFloat(amount) || caseItem.financialExposure
    const amountDisplay =
      numAmount >= 10000000
        ? `₹ ${(numAmount / 10000000).toFixed(2)} Cr`
        : `₹ ${(numAmount / 100000).toFixed(2)} L`

    const isRelease = actionType === 'Release Stop-Payment Hold'

    const updatedPfms: CasePfmsAction = {
      hasAction: !isRelease,
      actionType,
      orderNumber: `PFMS-ORD-${Date.now().toString().slice(-6)}`,
      amount: numAmount,
      amountDisplay,
      reason: reason.trim(),
      authorizedBy: 'Dr. Rajeshwar Rao, Principal Auditor General',
      timestamp: 'Today 15:20 IST',
      status: isRelease ? 'Released' : 'Active Stop-Payment',
      supportingEvidence: selectedEvidenceIds,
    }

    onExecutePfmsAction(updatedPfms)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#10182B] border border-[#232D47] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-8 h-8 rounded border flex items-center justify-center',
                isCurrentlyFrozen
                  ? 'bg-[#401515] border-[#EF4444]/50 text-[#EF4444]'
                  : 'bg-[#161F36] border-[#3B82F6]/50 text-[#3B82F6]'
              )}
            >
              {isCurrentlyFrozen ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#E7EBF5]">
                  PFMS Treasury Stop-Payment & Tranche Control
                </h3>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47]">
                  SIMULATED
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#9AA5C1]">
                Public Financial Management System Direct Gateway Desk
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

        {/* Action Status Ribbon */}
        <div
          className={cn(
            'px-4 py-2 border-b text-[11px] font-mono flex items-center justify-between shrink-0',
            isCurrentlyFrozen
              ? 'bg-[#401515]/60 border-[#EF4444]/40 text-[#EF4444]'
              : 'bg-[#10233F]/40 border-[#3B82F6]/40 text-[#3B82F6]'
          )}
        >
          <div className="flex items-center gap-2">
            {isCurrentlyFrozen ? (
              <AlertOctagon className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              STATUS:{' '}
              {isCurrentlyFrozen
                ? 'STOP-PAYMENT HOLD IN EFFECT (ORDER #' +
                  (currentAction.orderNumber || 'PFMS-HOLD-2026') +
                  ')'
                : 'NORMAL ACTIVE TRANCHE // READY FOR STATUTORY HOLD'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold">
            {currentAction.status}
          </span>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Affected Project Summary */}
          <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1]">
                Target PFMS Work & Sanction Order
              </span>
              <span className="font-mono text-[10px] text-[#3B82F6] font-bold">
                {caseItem.workCode}
              </span>
            </div>
            <div className="text-xs font-semibold text-[#E7EBF5] line-clamp-1">
              {caseItem.projectTitle}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#9AA5C1] pt-1 border-t border-[#232D47]/60">
              <div>Vendor: <span className="text-[#E7EBF5]">{caseItem.vendor}</span></div>
              <div>Agency: <span className="text-[#E7EBF5]">{caseItem.agency}</span></div>
              <div>Sanctioned: <span className="text-[#E7EBF5]">{caseItem.project.sanctionedDisplay}</span></div>
              <div>Disbursed: <span className="text-[#EF4444]">{caseItem.project.disbursedDisplay}</span></div>
            </div>
          </div>

          {/* Action Type */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Statutory Action Type *
            </label>
            <select
              value={actionType}
              onChange={(e) =>
                setActionType(e.target.value as CasePfmsAction['actionType'])
              }
              className="w-full h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#EF4444]"
            >
              <option value="Stop-Payment Hold (Full Freeze)">
                Stop-Payment Hold (Full Freeze of remaining & pending tranches)
              </option>
              <option value="Tranche Delay Pending Field Verification">
                Tranche Delay Pending Field Verification (Temporary 30-day hold)
              </option>
              <option value="Escrow Account Audit Hold">
                Escrow Account Audit Hold (Freeze agency sub-treasury drawing rights)
              </option>
              <option value="Release Stop-Payment Hold">
                Release Stop-Payment Hold (Restore active treasury disbursements)
              </option>
            </select>
          </div>

          {/* Amount to Freeze */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-[11px] text-[#9AA5C1] uppercase">
                Exposure / Tranche Amount Affected (₹) *
              </label>
              <span className="font-mono text-[10px] text-[#F59E0B]">
                Default: {caseItem.financialExposureDisplay}
              </span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-8 px-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {/* Statutory Reason */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Statutory Stop-Payment Reason & Regulatory Ground *
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Cite rule violation, missing EE stage certificates, or duplicate centroid..."
              className="w-full p-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#EF4444] resize-none"
            />
          </div>

          {/* Supporting Evidence Checklist */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1.5">
              Attach Supporting Case Evidence ({selectedEvidenceIds.length} attached)
            </label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {caseItem.evidence.map((ev) => {
                const checked = selectedEvidenceIds.includes(ev.id)
                return (
                  <div
                    key={ev.id}
                    onClick={() => toggleEvidence(ev.id)}
                    className={cn(
                      'p-2 rounded border flex items-center justify-between cursor-pointer transition-colors',
                      checked
                        ? 'bg-[#161F36] border-[#3B82F6]/60 text-[#E7EBF5]'
                        : 'bg-[#0A0E1A] border-[#232D47] text-[#9AA5C1]'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded border-[#232D47] text-[#3B82F6] pointer-events-none"
                      />
                      <span className="truncate text-xs font-medium">{ev.title}</span>
                    </div>
                    <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#0D1424] text-[#adc6ff] shrink-0 border border-[#232D47]">
                      {ev.source.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Officer Authorization & Digital Confirmation */}
          <div className="p-3 rounded-lg bg-[#0D1424] border border-[#232D47] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#adc6ff] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                Auditor Digital Authorization PIN
              </span>
              <span className="font-mono text-[10px] text-[#22C55E]">CAG TOKEN VERIFIED</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                value={authPin}
                onChange={(e) => setAuthPin(e.target.value)}
                placeholder="4-digit PIN"
                className="w-24 h-7 px-2 font-mono text-center rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
              />
              <span className="font-mono text-[10px] text-[#667090]">
                Authorized as: <strong className="text-[#E7EBF5]">Dr. Rajeshwar Rao, PAG</strong>
              </span>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-[#232D47]/60">
              <input
                type="checkbox"
                id="pfms-confirm"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-[#232D47] text-[#EF4444] cursor-pointer"
              />
              <label htmlFor="pfms-confirm" className="text-[11px] text-[#E7EBF5] cursor-pointer">
                I confirm the issuance of this simulated statutory PFMS hold instruction under MoSPI Section 14 Regulatory Oversight.
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#232D47] flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="compact" onClick={onClose}>
              Dismiss
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="compact"
              disabled={!isConfirmed || !reason.trim()}
              className={cn(
                'text-white font-semibold flex items-center gap-1.5',
                actionType === 'Release Stop-Payment Hold'
                  ? 'bg-[#22C55E] hover:bg-[#16a34a]'
                  : 'bg-[#EF4444] hover:bg-[#dc2626]'
              )}
            >
              {actionType === 'Release Stop-Payment Hold' ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Execute Tranche Release Order</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Issue Statutory PFMS Stop-Payment</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
