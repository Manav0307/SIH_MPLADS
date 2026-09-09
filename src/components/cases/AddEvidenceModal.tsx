import React, { useState } from 'react'
import { X, UploadCloud, Shield, FileText, CheckCircle2 } from 'lucide-react'
import { CaseEvidenceItem } from '@/types/cases'
import { Button } from '@/components/common/Button'

interface AddEvidenceModalProps {
  isOpen: boolean
  caseId: string
  workCode: string
  onClose: () => void
  onAddEvidence: (item: CaseEvidenceItem) => void
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  caseId,
  workCode,
  onClose,
  onAddEvidence,
}) => {
  const [title, setTitle] = useState('')
  const [source, setSource] = useState('ISRO Bhuvan Spatial Geo-Portal')
  const [sourceType, setSourceType] = useState<CaseEvidenceItem['sourceType']>('satellite')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const randomHash = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    const newEvidence: CaseEvidenceItem = {
      id: `ev-custom-${Date.now()}`,
      title: title.trim(),
      source: source.trim(),
      sourceType,
      timestamp: 'Today 15:10 IST',
      verificationStatus: 'Verified',
      verifiedBy: 'Logged by Auditor Examiner',
      verifiedAt: 'Today',
      previewType: sourceType === 'satellite' || sourceType === 'field_photo' ? 'image' : 'document',
      previewThumbnail:
        sourceType === 'satellite' || sourceType === 'field_photo'
          ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=400&q=80'
          : undefined,
      fileSize: fileName ? `${fileName} (2.4 MB)` : 'Forensic Record (1.8 MB)',
      hash: `SHA256:${randomHash}a1b2c3d4`,
      notes: notes.trim() || 'Uploaded during audit examination and verified against statutory ledger.',
    }

    onAddEvidence(newEvidence)
    setTitle('')
    setNotes('')
    setFileName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#10182B] border border-[#232D47] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E7EBF5]">Add Audit Evidence Artifact</h3>
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
          {/* Title */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Evidence Title / Label *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GeM Bid Comparative Sheet #GeM-2026-991"
              className="w-full h-8 px-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {/* Source Type & Authority */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
                Evidence Category
              </label>
              <select
                value={sourceType}
                onChange={(e) => {
                  const val = e.target.value as CaseEvidenceItem['sourceType']
                  setSourceType(val)
                  if (val === 'satellite') setSource('ISRO Bhuvan Spatial Geo-Portal')
                  else if (val === 'ledger') setSource('PFMS Public Financial Management System')
                  else if (val === 'tender') setSource('GeM Government e-Marketplace')
                  else if (val === 'measurement_book') setSource('State PWD Measurement Book Archive')
                  else if (val === 'field_photo') setSource('MoSPI Field Audit Camera Unit')
                  else setSource('Audit Inspection Office Record')
                }}
                className="w-full h-8 px-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="satellite">ISRO Satellite Imagery</option>
                <option value="ledger">PFMS Transaction Ledger</option>
                <option value="tender">GeM Tender & Procurement</option>
                <option value="measurement_book">PWD Measurement Book (MB)</option>
                <option value="field_photo">Geo-Tagged Site Photograph</option>
                <option value="audit_doc">Statutory Audit Document</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
                Source Authority
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full h-8 px-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Simulated File Upload Drag Area */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Evidence Document / Media (Simulated Upload)
            </label>
            <div
              onClick={() => setFileName(`Audit-Cert-${Math.floor(Math.random() * 9000 + 1000)}.pdf`)}
              className="border border-dashed border-[#232D47] hover:border-[#3B82F6] rounded-lg p-3 text-center bg-[#0A0E1A]/60 cursor-pointer transition-colors"
            >
              <FileText className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
              <div className="text-[11px] text-[#E7EBF5]">
                {fileName ? (
                  <span className="text-[#22C55E] font-mono flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {fileName} attached
                  </span>
                ) : (
                  <span>Click to simulate attaching verified forensic file</span>
                )}
              </div>
              <span className="text-[10px] font-mono text-[#667090] mt-0.5 block">
                Supports GeoTIFF, XML Ledger, MB Scan, PDF, JPEG (Auto SHA-256 Hashed)
              </span>
            </div>
          </div>

          {/* Auditor Notes */}
          <div>
            <label className="block font-mono text-[11px] text-[#9AA5C1] uppercase mb-1">
              Verification Notes & Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record forensic remarks, verification method, or cross-reference numbers..."
              className="w-full p-2 rounded bg-[#0A0E1A] border border-[#232D47] text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          </div>

          {/* Provenance Notice */}
          <div className="p-2 rounded bg-[#161F36]/50 border border-[#232D47] flex items-start gap-2 text-[10px] font-mono text-[#9AA5C1]">
            <Shield className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
            <span>
              Evidence items are appended with cryptographic hash signatures and timestamped directly into the statutory case registry.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#232D47] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="compact"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="compact"
              disabled={!title.trim()}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Append to Case Registry
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
