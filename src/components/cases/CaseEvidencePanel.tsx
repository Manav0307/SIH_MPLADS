import React, { useState } from 'react'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Shield,
  Eye,
  X,
  MapPin,
  FileSpreadsheet,
  Camera,
  Layers,
  FileCheck,
} from 'lucide-react'
import { CaseEvidenceItem } from '@/types/cases'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

interface CaseEvidencePanelProps {
  evidence: CaseEvidenceItem[]
  onAddEvidenceClick: () => void
  onToggleVerification: (evidenceId: string) => void
}

export const CaseEvidencePanel: React.FC<CaseEvidencePanelProps> = ({
  evidence,
  onAddEvidenceClick,
  onToggleVerification,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<CaseEvidenceItem | null>(null)

  const getSourceIcon = (sourceType: CaseEvidenceItem['sourceType']) => {
    switch (sourceType) {
      case 'satellite':
        return <Layers className="w-4 h-4 text-[#3B82F6]" />
      case 'ledger':
        return <FileSpreadsheet className="w-4 h-4 text-[#22C55E]" />
      case 'field_photo':
        return <Camera className="w-4 h-4 text-[#F59E0B]" />
      case 'measurement_book':
        return <FileCheck className="w-4 h-4 text-[#adc6ff]" />
      default:
        return <FileText className="w-4 h-4 text-[#9AA5C1]" />
    }
  }

  return (
    <div className="space-y-3 select-none">
      {/* Evidence Header Bar */}
      <div className="flex items-center justify-between border-b border-[#232D47] pb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#3B82F6]" />
          <span className="font-mono text-xs font-bold text-[#E7EBF5] uppercase tracking-wider">
            Evidence Registry & Provenance Chain
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47]">
            {evidence.length} ARTIFACTS
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="compact"
          onClick={onAddEvidenceClick}
          icon={<UploadCloud className="w-3.5 h-3.5 text-[#3B82F6]" />}
          className="text-xs bg-[#161F36] hover:bg-[#232D47] border-[#3B82F6]/40 text-[#adc6ff]"
        >
          Add Evidence
        </Button>
      </div>

      {/* Evidence List */}
      <div className="space-y-2.5">
        {evidence.map((item) => {
          const isVerified = item.verificationStatus === 'Verified'

          return (
            <div
              key={item.id}
              className={cn(
                'p-3 rounded-lg border transition-all space-y-2 bg-[#0A0E1A]',
                isVerified
                  ? 'border-[#232D47] hover:border-[#22C55E]/60'
                  : 'border-[#362E0C] hover:border-[#F59E0B]/60'
              )}
            >
              {/* Top line: Source Icon, Title, Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#10182B] border border-[#232D47] flex items-center justify-center shrink-0 mt-0.5">
                    {getSourceIcon(item.sourceType)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#E7EBF5] truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#9AA5C1] mt-0.5">
                      <span className="text-[#adc6ff]">{item.source}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase border',
                      isVerified
                        ? 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]/40'
                        : 'bg-[#362E0C] text-[#EAB308] border-[#EAB308]/40'
                    )}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-[#EAB308]" />
                        {item.verificationStatus}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Middle: Notes & Metadata */}
              {item.notes && (
                <p className="text-[11px] text-[#9AA5C1] font-sans leading-relaxed bg-[#10182B]/70 p-2 rounded border border-[#232D47]/60">
                  {item.notes}
                </p>
              )}

              {/* Bottom line: Hash, Coordinates, Preview button & Mark Verified Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#232D47]/60 text-[10px] font-mono">
                <div className="flex items-center gap-2 text-[#667090] truncate">
                  <span className="truncate">Hash: <strong className="text-[#adc6ff]">{item.hash}</strong></span>
                  {item.coordinates && (
                    <span className="flex items-center gap-0.5 text-[#F59E0B] shrink-0">
                      <MapPin className="w-3 h-3" />
                      {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Preview / Evidence Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreview(item)}
                    className="h-6 px-2 rounded bg-[#161F36] hover:bg-[#232D47] text-[#adc6ff] hover:text-white border border-[#232D47] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Evidence</span>
                  </button>

                  {/* Mark Verified Toggle UI */}
                  <button
                    type="button"
                    onClick={() => onToggleVerification(item.id)}
                    className={cn(
                      'h-6 px-2 rounded border flex items-center gap-1 cursor-pointer transition-colors font-medium',
                      isVerified
                        ? 'bg-[#10182B] hover:bg-[#161F36] text-[#9AA5C1] border-[#232D47]'
                        : 'bg-[#0F3020] hover:bg-[#15462c] text-[#22C55E] border-[#22C55E]/50'
                    )}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isVerified ? 'Mark as Pending' : 'Mark Verified'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview Placeholder Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#10182B] border border-[#232D47] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-3 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#3B82F6]" />
                <span className="font-mono text-xs font-bold text-[#E7EBF5] truncate max-w-xs">
                  {selectedPreview.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="p-1 rounded hover:bg-[#161F36] text-[#667090] hover:text-[#E7EBF5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {selectedPreview.previewThumbnail ? (
                <div className="relative rounded-lg overflow-hidden border border-[#232D47] group max-h-64">
                  <img
                    src={selectedPreview.previewThumbnail}
                    alt={selectedPreview.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded font-mono text-[9px] text-[#22C55E] border border-[#22C55E]/40 font-bold">
                    GEOSPATIAL GEO-REFERENCED
                  </div>
                  {selectedPreview.coordinates && (
                    <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded font-mono text-[9px] text-white">
                      Lat: {selectedPreview.coordinates.lat.toFixed(4)}, Lng:{' '}
                      {selectedPreview.coordinates.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-lg bg-[#0A0E1A] border border-dashed border-[#232D47] text-center space-y-2">
                  <FileText className="w-8 h-8 text-[#3B82F6] mx-auto" />
                  <div className="text-xs font-semibold text-[#E7EBF5]">
                    {selectedPreview.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#667090]">
                    {selectedPreview.fileSize || 'Standard Audit File Document'}
                  </div>
                  <p className="text-[11px] text-[#9AA5C1] max-w-sm mx-auto font-sans leading-relaxed">
                    Forensic file integrity verified against source ledger with hash signature{' '}
                    <span className="font-mono text-[#adc6ff]">{selectedPreview.hash}</span>.
                  </p>
                </div>
              )}

              <div className="p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-[11px] font-mono space-y-1">
                <div className="text-[#667090]">Source: <span className="text-[#E7EBF5]">{selectedPreview.source}</span></div>
                <div className="text-[#667090]">Timestamp: <span className="text-[#E7EBF5]">{selectedPreview.timestamp}</span></div>
                <div className="text-[#667090]">Status: <span className="text-[#22C55E] font-bold">{selectedPreview.verificationStatus}</span></div>
              </div>
            </div>

            <div className="p-3 bg-[#0D1424] border-t border-[#232D47] flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="compact"
                onClick={() => setSelectedPreview(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
