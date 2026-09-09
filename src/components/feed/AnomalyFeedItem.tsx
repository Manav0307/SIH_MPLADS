import React from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { AnomalyFeedItem as AnomalyItemType } from '@/types'

interface AnomalyFeedItemProps {
  item: AnomalyItemType
  onClick: (item: AnomalyItemType) => void
}

export const AnomalyFeedItem: React.FC<AnomalyFeedItemProps> = ({ item, onClick }) => {
  const isCritical = item.severity === 'critical'
  const isHigh = item.severity === 'high'

  const borderClass = isCritical
    ? 'border-[#EF4444]/30 hover:border-[#EF4444]'
    : isHigh
    ? 'border-[#232D47] hover:border-[#F59E0B]/50'
    : 'border-[#232D47] hover:border-[#3B82F6]/50'

  const textSeverityClass = isCritical
    ? 'text-[#EF4444]'
    : isHigh
    ? 'text-[#F59E0B]'
    : 'text-[#3B82F6]'

  const impactClass = isCritical
    ? 'text-[#EF4444] font-bold'
    : isHigh
    ? 'text-[#F59E0B] font-bold'
    : 'text-[#E7EBF5] font-semibold'

  return (
    <div
      onClick={() => onClick(item)}
      className={`p-2 rounded bg-[#0D1424] border ${borderClass} transition-all cursor-pointer group select-none`}
    >
      <div className="flex items-center justify-between font-mono text-[10px] mb-1">
        <span className={`${textSeverityClass} font-bold flex items-center gap-1`}>
          {isCritical ? (
            <AlertTriangle className="w-3 h-3" />
          ) : isHigh ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Info className="w-3 h-3" />
          )}
          [{item.severity.toUpperCase()} {item.riskScore}]
        </span>
        <span className="text-[#667090]">{item.timestamp}</span>
      </div>

      <p className="font-sans text-xs text-[#E7EBF5] leading-snug group-hover:text-white transition-colors">
        {item.description}
      </p>

      <div className="flex items-center justify-between font-mono text-[10px] text-[#9AA5C1] mt-1.5 pt-1 border-t border-[#232D47]">
        <span>
          Impact: <span className={impactClass}>{item.financialImpact}</span>
        </span>
        <span>{item.location}</span>
      </div>
    </div>
  )
}
