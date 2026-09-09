import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { FileText, Save, Trash2, Clock, UserCheck } from 'lucide-react'
import { InvestigationNote } from '@/types'

export interface InvestigationNotesHandle {
  focusInput: () => void
}

interface InvestigationNotesProps {
  notes: InvestigationNote[]
  onAddNote: (content: string) => void
  onClearNotes: () => void
  targetTitle?: string
}

export const InvestigationNotes = forwardRef<InvestigationNotesHandle, InvestigationNotesProps>(
  ({ notes, onAddNote, onClearNotes, targetTitle }, ref) => {
    const [noteText, setNoteText] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        textareaRef.current?.focus()
      },
    }))

    const handleSave = () => {
      if (!noteText.trim()) return
      onAddNote(noteText.trim())
      setNoteText('')
    }

    const handleClear = () => {
      setNoteText('')
    }

    return (
      <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#232D47] space-y-2.5 select-none">
        <div className="flex items-center justify-between border-b border-[#232D47] pb-1.5">
          <span className="font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
            Investigation Notes & Audit Observations
          </span>
          <span className="font-mono text-[10px] text-[#667090]">{notes.length} LOGGED</span>
        </div>

        {/* Textarea Input */}
        <div className="space-y-1.5">
          <textarea
            ref={textareaRef}
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Record observations, findings or required follow-up..."
            className="w-full bg-[#10182B] border border-[#232D47] rounded p-2 text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#667090]">
              Logged for: <span className="text-[#adc6ff]">{targetTitle || 'Active Case'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={!noteText}
                className="h-7 px-2 text-xs font-mono rounded bg-transparent hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] border border-transparent hover:border-[#232D47] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!noteText.trim()}
                className="h-7 px-3 text-xs font-semibold rounded bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Log */}
        {notes.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#232D47] max-h-40 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-[#667090] font-bold">
                Recorded Observations:
              </span>
              <button
                onClick={onClearNotes}
                className="font-mono text-[10px] text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            </div>

            {notes.map((n) => (
              <div
                key={n.id}
                className="p-2 rounded bg-[#10182B] border border-[#232D47] text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#3B82F6] font-semibold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    {n.author}
                  </span>
                  <span className="text-[#667090] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {n.timestamp}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-[#E7EBF5] leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

InvestigationNotes.displayName = 'InvestigationNotes'
