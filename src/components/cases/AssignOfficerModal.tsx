import React, { useState } from 'react'
import { X, UserCheck, Shield, Check } from 'lucide-react'
import { CaseOfficer } from '@/types/cases'
import { auditOfficers } from '@/data/cases'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

interface AssignOfficerModalProps {
  isOpen: boolean
  caseId: string
  workCode: string
  currentOfficer: CaseOfficer
  onClose: () => void
  onAssignOfficer: (officer: CaseOfficer, memo: string) => void
}

export const AssignOfficerModal: React.FC<AssignOfficerModalProps> = ({
  isOpen,
  caseId,
  workCode,
  currentOfficer,
  onClose,
  onAssignOfficer,
}) => {
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(currentOfficer.id)
  const [assignmentMemo, setAssignmentMemo] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = auditOfficers.find((o) => o.id === selectedOfficerId)
    if (!found) return

    onAssignOfficer(found, assignmentMemo.trim() || 'Officer assigned for statutory case cross-examination.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#10182B] border border-[#232D47] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E7EBF5]">Assign Statutory Audit Officer</h3>
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
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-2">
              Select Audit Officer from MoSPI / CAG Roster
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {auditOfficers.map((officer) => {
                const isSelected = selectedOfficerId === officer.id
                return (
                  <div
                    key={officer.id}
                    onClick={() => setSelectedOfficerId(officer.id)}
                    className={cn(
                      'p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all',
                      isSelected
                        ? 'bg-[#161F36] border-[#3B82F6] ring-1 ring-[#3B82F6]/50'
                        : 'bg-[#0A0E1A] border-[#232D47] hover:border-[#3B82F6]/50'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#10182B] border border-[#232D47] flex items-center justify-center font-mono text-xs font-bold text-[#adc6ff]">
                        {officer.avatar || 'UA'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#E7EBF5]">{officer.name}</span>
                          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#10182B] text-[#9AA5C1] border border-[#232D47]">
                            {officer.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9AA5C1] block mt-0.5">
                          {officer.designation} • {officer.department}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Assignment Directive / Memo */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Assignment Directive / Investigation Terms of Reference
            </label>
            <textarea
              rows={2}
              value={assignmentMemo}
              onChange={(e) => setAssignmentMemo(e.target.value)}
              placeholder="e.g. Assigned to cross-examine rate card variations and issue field measurement summons within 5 working days..."
              className="w-full p-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          </div>

          {/* Notice */}
          <div className="p-2 rounded bg-[#161F36]/40 border border-[#232D47] flex items-start gap-2 text-[10px] font-mono text-[#9AA5C1]">
            <Shield className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
            <span>
              Officer assignment is appended to the Case Status History audit log with statutory timestamp.
            </span>
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
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Confirm Officer Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
