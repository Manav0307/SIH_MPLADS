import React, { useState } from 'react'
import { MapLayerType } from './MapLayerControls'
import { Info, ChevronDown, ChevronUp, MapPin } from 'lucide-react'

interface GisMapLegendProps {
  activeLayer: MapLayerType
}

export const GisMapLegend: React.FC<GisMapLegendProps> = ({ activeLayer }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const layerMetadata: Record<
    MapLayerType,
    {
      title: string
      subtitle: string
      items: { color: string; label: string; range: string }[]
    }
  > = {
    risk: {
      title: 'Risk Anomaly Intensity',
      subtitle: 'Based on multi-source audit rules & anomaly rate',
      items: [
        { color: '#EF4444', label: 'Critical Anomaly', range: '> 15% rate / > 90 score' },
        { color: '#F59E0B', label: 'Elevated Risk', range: '10% – 15% rate' },
        { color: '#EAB308', label: 'Moderate Watch', range: '5% – 10% rate' },
        { color: '#22C55E', label: 'Nominal Profile', range: '< 5% rate' },
      ],
    },
    financial: {
      title: 'Financial Discrepancy',
      subtitle: 'Variance between sanctioned capital & physical realization',
      items: [
        { color: '#EF4444', label: 'Critical Variance', range: '≥ ₹35.0 Cr discrepancy' },
        { color: '#F59E0B', label: 'Substantial Variance', range: '₹20.0 Cr – ₹35.0 Cr' },
        { color: '#3B82F6', label: 'Standard Variance', range: '< ₹20.0 Cr discrepancy' },
      ],
    },
    vendor: {
      title: 'Vendor Density & Cartelization',
      subtitle: 'Concentration of high-risk contractors in jurisdiction',
      items: [
        { color: '#EF4444', label: 'High Density Cartel Risk', range: '≥ 40 flagged vendors' },
        { color: '#F59E0B', label: 'Moderate Concentration', range: '25 – 39 flagged vendors' },
        { color: '#3B82F6', label: 'Distributed Pool', range: '< 25 flagged vendors' },
      ],
    },
    gps: {
      title: 'Duplicate GPS & Spatial Overlaps',
      subtitle: 'Works sharing identical or proximate geo-footprints',
      items: [
        { color: '#EF4444', label: 'Severe Overlap Alert', range: '≥ 15 duplicate works' },
        { color: '#F59E0B', label: 'Moderate Spatial Match', range: '8 – 14 duplicate works' },
        { color: '#3B82F6', label: 'Low Proximity Signal', range: '< 8 duplicate works' },
      ],
    },
  }

  const current = layerMetadata[activeLayer]

  return (
    <div className="z-[1000] bg-[#10182B]/95 backdrop-blur-md border border-[#232D47] rounded-lg shadow-xl text-xs overflow-hidden max-w-xs select-none transition-all">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between cursor-pointer hover:bg-[#161F36]/60 transition-colors"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Info className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
          <span className="font-mono text-[11px] font-bold text-[#E7EBF5] uppercase tracking-wider truncate">
            {current.title}
          </span>
        </div>
        <button
          type="button"
          className="text-[#9AA5C1] hover:text-[#E7EBF5] p-0.5 rounded transition-colors"
          title={isExpanded ? 'Collapse Legend' : 'Expand Legend'}
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-2.5 space-y-2">
          <p className="text-[10px] text-[#9AA5C1] leading-tight">
            {current.subtitle}
          </p>

          <div className="space-y-1.5 pt-1">
            {current.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#E7EBF5] font-medium">{item.label}</span>
                </div>
                <span className="text-[#9AA5C1] pl-2">{item.range}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-[#232D47]/80 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[9px] text-[#667090] font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full border border-[#9AA5C1]" />
              <span>Circle radius scales with metric exposure</span>
            </div>
            <div className="flex items-start gap-1 text-[9px] text-[#EAB308] font-mono bg-[#362E0C]/40 p-1.5 rounded border border-[#EAB308]/20">
              <MapPin className="w-3 h-3 text-[#EAB308] shrink-0 mt-0.5" />
              <span>
                <strong>Centroid Mode:</strong> Plotted at official State Centroids. Zero simulated GPS coordinates.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
