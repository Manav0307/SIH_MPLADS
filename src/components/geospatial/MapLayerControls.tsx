import React from 'react'

export type MapLayerType = 'risk' | 'financial' | 'vendor' | 'gps'

interface MapLayerControlsProps {
  activeLayer: MapLayerType
  onSelectLayer: (layer: MapLayerType) => void
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  activeLayer,
  onSelectLayer,
}) => {
  const layers: { id: MapLayerType; label: string }[] = [
    { id: 'risk', label: 'Risk Heatmap' },
    { id: 'financial', label: 'Financial Discrepancy' },
    { id: 'vendor', label: 'Vendor Density' },
    { id: 'gps', label: 'Duplicate / Spatial Similarity' },
  ]

  return (
    <div className="flex items-center gap-1 bg-[#0A0E1A] p-0.5 rounded border border-[#232D47] font-mono text-[10px] select-none">
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onSelectLayer(layer.id)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#3B82F6] text-white font-bold'
                : 'text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
            }`}
          >
            {layer.label}
          </button>
        )
      })}
    </div>
  )
}
