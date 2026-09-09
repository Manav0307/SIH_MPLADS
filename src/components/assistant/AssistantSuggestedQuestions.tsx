import React from 'react'
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react'

interface AssistantSuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
}

export const AssistantSuggestedQuestions: React.FC<AssistantSuggestedQuestionsProps> = ({
  questions,
  onSelectQuestion,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center gap-1.5 px-1 font-mono text-[10px] uppercase font-bold text-[#9AA5C1] tracking-wider">
        <Sparkles className="w-3 h-3 text-[#3B82F6]" />
        <span>Suggested Forensic Queries</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(q)}
            className="group px-3 py-1.5 rounded-lg bg-[#10182B] hover:bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6]/50 text-xs font-sans text-[#CAD2E2] hover:text-[#E7EBF5] whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-3 h-3 text-[#3B82F6] opacity-70 group-hover:opacity-100 shrink-0" />
            <span>{q}</span>
            <ArrowRight className="w-2.5 h-2.5 text-[#667090] group-hover:text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
