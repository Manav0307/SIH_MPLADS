import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Trash2,
  RotateCcw,
  Bot,
  CheckCircle2,
  FileSignature,
} from 'lucide-react'
import {
  AssistantMessage,
  AssistantContext,
} from '@/types/assistant'
import {
  AssistantResponseCard,
  AssistantContextIndicator,
  AssistantSuggestedQuestions,
} from '@/components/assistant'
import {
  resolveContextFromParams,
  generateAssistantResponse,
  getInitialWelcomeMessage,
  getSuggestedQuestions,
} from '@/lib/assistant/mockAssistantService'

export const AssistantPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Context Resolution from URL Query Parameters
  const [context, setContext] = useState<AssistantContext | null>(() =>
    resolveContextFromParams(searchParams)
  )

  useEffect(() => {
    const resolved = resolveContextFromParams(searchParams)
    setContext(resolved)
  }, [searchParams])

  // 2. Local Session Message History
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    getInitialWelcomeMessage(resolveContextFromParams(searchParams)),
  ])

  const [inputQuery, setInputQuery] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // 3. Quick Note Modal State
  const [noteTargetCase, setNoteTargetCase] = useState<string | null>(null)
  const [noteText, setNoteText] = useState<string>('')
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false)

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Handlers
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query) return

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputQuery('')
    setIsTyping(true)

    // Simulate natural response latency while remaining deterministic
    setTimeout(() => {
      const response = generateAssistantResponse(query, context)
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 450)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewInvestigation = () => {
    setMessages([getInitialWelcomeMessage(context)])
    setInputQuery('')
  }

  const handleClearConversation = () => {
    setMessages([])
    setInputQuery('')
  }

  const handleClearContext = () => {
    setContext(null)
    setSearchParams({})
  }

  const handleOpenNotePrompt = (caseId?: string) => {
    setNoteTargetCase(caseId || context?.id || 'CASE-2026-001')
    setNoteSavedFeedback(false)
    setNoteText('')
  }

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    setNoteSavedFeedback(true)
    setTimeout(() => {
      setNoteTargetCase(null)
      setNoteSavedFeedback(false)
      setNoteText('')
    }, 1200)
  }

  const suggestedQuestions = getSuggestedQuestions(context)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] text-[#E7EBF5] select-none overflow-hidden bg-[#0A0E1A]">
      {/* 1. MISSION-CONTROL TOP HEADER */}
      <div className="h-14 px-4 bg-[#10182B] border-b border-[#232D47] flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#161F36] border border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] shrink-0">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
          </div>

          <div className="flex flex-col truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#E7EBF5] tracking-tight truncate">
                AI Investigation Assistant
              </h1>
              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-[#3A2A0C] text-[#F59E0B] border border-[#F59E0B]/50 uppercase tracking-wider shrink-0">
                Demonstration
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#9AA5C1] truncate">
              Statutory Forensic Intelligence &bull; Deterministic Engine v1.0
            </span>
          </div>
        </div>

        {/* Telemetry and Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E1A] border border-[#232D47] font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#22C55E] font-semibold">LOCAL SESSION</span>
            <span className="text-[#667090]">&bull;</span>
            <span className="text-[#9AA5C1]">OFFLINE DETERMINISTIC</span>
          </div>

          <button
            type="button"
            onClick={handleNewInvestigation}
            className="h-7 px-2.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] border border-[#232D47] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Start new investigation session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="hidden sm:inline">New Session</span>
          </button>

          <button
            type="button"
            onClick={handleClearConversation}
            className="h-7 px-2.5 rounded bg-[#161F36] hover:bg-[#401515] text-[#9AA5C1] hover:text-[#EF4444] border border-[#232D47] hover:border-[#EF4444]/40 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear all messages in conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 2. CONTEXT INDICATOR BAR */}
      <div className="px-4 py-2 bg-[#0D1424] border-b border-[#232D47] shrink-0">
        <AssistantContextIndicator
          context={context}
          onClearContext={handleClearContext}
        />
      </div>

      {/* 3. SUGGESTED INVESTIGATION QUESTIONS STRIP */}
      <div className="px-4 py-2 bg-[#0A0E1A] border-b border-[#232D47]/80 shrink-0">
        <AssistantSuggestedQuestions
          questions={suggestedQuestions}
          onSelectQuestion={(q) => handleSendMessage(q)}
        />
      </div>

      {/* 4. MAIN CONVERSATION SCROLLABLE THREAD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <AssistantResponseCard
            key={msg.id}
            message={msg}
            onAddNotePrompt={handleOpenNotePrompt}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#10182B] border border-[#232D47] text-xs font-mono text-[#9AA5C1] max-w-sm">
            <Bot className="w-4 h-4 text-[#3B82F6] animate-spin" />
            <span>Evaluating forensic indicators and rule trees...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. AUDIT CHAT INPUT BAR */}
      <div className="p-3.5 bg-[#10182B] border-t border-[#232D47] shrink-0">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="relative flex items-center">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                context
                  ? `Ask about ${context.title} (e.g., 'Why is this project high risk?' or 'Summarize the evidence')...`
                  : "Ask an investigation question, query rules, or check financial exposure... (Press 'Enter' to send)"
              }
              className="w-full bg-[#0A0E1A] border border-[#232D47] rounded-lg pl-3 pr-24 py-2.5 text-xs sm:text-sm text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 resize-none transition-all shadow-inner font-sans"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim()}
                className="px-3 py-1.5 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#161F36] disabled:text-[#667090] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#667090] px-1">
            <span>Press Enter to send &bull; Shift + Enter for multiline</span>
            <span className="hidden sm:inline">
              AI Investigation Assistant &bull; Demonstration Mode
            </span>
          </div>
        </div>
      </div>

      {/* 6. QUICK AUDIT NOTE MODAL */}
      {noteTargetCase && (
        <div className="fixed inset-0 bg-[#0A0E1A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#10182B] border border-[#232D47] rounded-lg p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232D47] pb-2">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-xs font-bold text-[#E7EBF5] font-mono uppercase">
                  Add Audit Investigation Note
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#38BDF8]">
                {noteTargetCase}
              </span>
            </div>

            <p className="text-xs text-[#9AA5C1] font-sans">
              Enter field observations, verification results, or statutory directives to record in the case file.
            </p>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Conducted site verification on 12-Feb-2026. Masonry incomplete; issued notice to executive engineer."
              className="w-full p-2.5 rounded bg-[#0A0E1A] border border-[#232D47] text-xs text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setNoteTargetCase(null)}
                className="px-3 py-1.5 rounded bg-[#161F36] text-xs font-mono text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveNote}
                disabled={!noteText.trim() || noteSavedFeedback}
                className="px-3 py-1.5 rounded bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#161F36] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {noteSavedFeedback ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Note Recorded!</span>
                  </>
                ) : (
                  <>
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssistantPage
