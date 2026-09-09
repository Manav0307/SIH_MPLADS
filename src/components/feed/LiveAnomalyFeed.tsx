import React from 'react'
import { AnomalyFeedItem as AnomalyItemType } from '@/types'
import { AnomalyFeedItem } from './AnomalyFeedItem'

interface LiveAnomalyFeedProps {
  anomalies: AnomalyItemType[]
  onSelectAnomaly: (anomaly: AnomalyItemType) => void
}

export const LiveAnomalyFeed: React.FC<LiveAnomalyFeedProps> = ({
  anomalies,
  onSelectAnomaly,
}) => {
  return (
    <div className="bg-[#10182B] border border-[#232D47] rounded-lg flex flex-col overflow-hidden select-none h-full">
      {/* Header */}
      <div className="px-3.5 py-2 border-b border-[#232D47] bg-[#0D1424] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <h2 className="font-sans text-sm font-semibold text-[#E7EBF5]">
            Live Anomaly Feed
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#22C55E] bg-[#0F3020] px-1.5 py-0.5 rounded border border-[#22C55E]/30">
          SOC SYNC 2.4s
        </span>
      </div>

      {/* Feed Items Container */}
      <div className="p-2.5 flex-1 overflow-y-auto space-y-2 max-h-[385px]">
        {anomalies.length === 0 ? (
          <div className="py-12 text-center text-[#667090] font-sans text-xs">
            No live anomalies active for current filter criteria.
          </div>
        ) : (
          anomalies.map((item) => (
            <AnomalyFeedItem
              key={item.id}
              item={item}
              onClick={onSelectAnomaly}
            />
          ))
        )}
      </div>
    </div>
  )
}
