import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EvidenceReferenceCardProps {
  title: string
  description: string
  route: string
  source?: string
  sourceType?: string
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
  metric?: string
  className?: string
}

export const EvidenceReferenceCard: React.FC<EvidenceReferenceCardProps> = ({
  title,
  description,
  route,
  source,
  sourceType,
  severity = 'info',
  metric,
  className,
}) => {
  const navigate = useNavigate()

  const severityMap = {
    critical: 'bg-[#401515] text-[#EF4444] border-[#EF4444]/40',
    high: 'bg-[#3A2A0C] text-[#F59E0B] border-[#F59E0B]/40',
    medium: 'bg-[#362E0C] text-[#EAB308] border-[#EAB308]/40',
    low: 'bg-[#0F3020] text-[#22C55E] border-[#22C55E]/40',
    info: 'bg-[#10233F] text-[#3B82F6] border-[#3B82F6]/40',
  }

  return (
    <div
      onClick={() => navigate(route)}
      className={cn(
        'p-2.5 rounded-lg bg-[#0A0E1A] border border-[#232D47] hover:border-[#3B82F6] transition-all cursor-pointer group flex flex-col justify-between evidence-reference-card',
        className
      )}
      title={source || 'Evidence source'}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase', severityMap[severity])}>
            {severity}
          </span>
          <ExternalLink className="w-3 h-3 text-[#667090] group-hover:text-[#3B82F6] transition-colors" />
        </div>

        <div className="flex items-start gap-1.5">
          <FileText className="w-3 h-3 text-[#EAB308] mt-0.5 shrink-0" />
          <h5 className="text-xs font-bold text-[#E7EBF5] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
            {title}
          </h5>
        </div>

        <p className="text-[11px] text-[#9AA5C1] line-clamp-2 leading-tight">
          {description}
        </p>

        {(source || sourceType) && (
          <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[9px] border-t border-[#232D47] pt-1">
            <span className="text-[#3B82F6] truncate">
              {sourceType ? `${sourceType}` : 'Source'}
            </span>
            {source && <span className="text-[#9AA5C1] truncate">{source}</span>}
          </div>
        )}
      </div>

      {metric && (
        <div className="mt-2 pt-1 border-t border-[#232D47] flex items-center justify-between font-mono text-[9px]">
          <span className="text-[#667090]">Evidence Metric:</span>
          <span className="text-[#38BDF8] font-bold">{metric}</span>
        </div>
      )}
    </div>
  )
}
