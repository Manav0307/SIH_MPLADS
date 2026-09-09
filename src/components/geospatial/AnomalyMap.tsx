import React, { useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import { StateAnomalyRecord } from '@/types'
import { MapLayerType } from './MapLayerControls'

interface AnomalyMapProps {
  states: StateAnomalyRecord[]
  selectedState?: string
  activeLayer: MapLayerType
  onSelectState: (stateName: string) => void
}

// Controller component inside MapContainer to handle external zoom & reset
const MapController: React.FC<{
  mapRef: React.MutableRefObject<LeafletMap | null>
}> = ({ mapRef }) => {
  const map = useMap()
  mapRef.current = map
  return null
}

export const AnomalyMap: React.FC<AnomalyMapProps> = ({
  states,
  selectedState,
  activeLayer,
  onSelectState,
}) => {
  const mapRef = useRef<LeafletMap | null>(null)
  const defaultCenter: [number, number] = [22.5, 79.0]
  const defaultZoom = 4.5

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, defaultZoom)
    }
  }

  // Determine circle color & radius based on active layer
  const getMarkerProps = (st: StateAnomalyRecord) => {
    let color = '#22C55E'
    let radius = 10
    let label = `${st.name}: ${st.anomalyRate.toFixed(1)}% Anomaly`

    if (activeLayer === 'risk') {
      if (st.anomalyRate >= 15) {
        color = '#EF4444'
        radius = 24
      } else if (st.anomalyRate >= 10) {
        color = '#F59E0B'
        radius = 18
      } else if (st.anomalyRate >= 5) {
        color = '#EAB308'
        radius = 14
      } else {
        color = '#22C55E'
        radius = 10
      }
      label = `${st.name}: ${st.anomalyRate}% Risk (${st.flaggedWorks} works)`
    } else if (activeLayer === 'financial') {
      if (st.discrepancyCr >= 35) {
        color = '#EF4444'
        radius = 24
      } else if (st.discrepancyCr >= 20) {
        color = '#F59E0B'
        radius = 18
      } else {
        color = '#3B82F6'
        radius = 12
      }
      label = `${st.name}: ₹${st.discrepancyCr} Cr Discrepancy`
    } else if (activeLayer === 'vendor') {
      if (st.vendorDensity >= 40) {
        color = '#EF4444'
        radius = 22
      } else if (st.vendorDensity >= 25) {
        color = '#F59E0B'
        radius = 16
      } else {
        color = '#3B82F6'
        radius = 11
      }
      label = `${st.name}: ${st.vendorDensity} High-Risk Vendors`
    } else if (activeLayer === 'gps') {
      if (st.duplicateGpsCount >= 15) {
        color = '#EF4444'
        radius = 22
      } else if (st.duplicateGpsCount >= 8) {
        color = '#F59E0B'
        radius = 16
      } else {
        color = '#3B82F6'
        radius = 10
      }
      label = `${st.name}: ${st.duplicateGpsCount} Duplicate GPS Footprints`
    }

    return { color, radius, label }
  }

  return (
    <div className="flex-1 bg-[#0A0E1A] border border-[#232D47] rounded relative min-h-[300px] flex flex-col justify-between p-3 overflow-hidden select-none">
      {/* Map Overlay Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-6 h-6 bg-[#10182B] border border-[#232D47] rounded flex items-center justify-center text-[#E7EBF5] hover:bg-[#161F36] text-[14px] font-bold cursor-pointer transition-colors shadow-xs"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-6 h-6 bg-[#10182B] border border-[#232D47] rounded flex items-center justify-center text-[#E7EBF5] hover:bg-[#161F36] text-[14px] font-bold cursor-pointer transition-colors shadow-xs"
          title="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="w-6 h-6 bg-[#10182B] border border-[#232D47] rounded flex items-center justify-center text-[#E7EBF5] hover:bg-[#161F36] text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
          title="Reset View to India"
        >
          ⟲
        </button>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          className="w-full h-full bg-[#0A0E1A]"
        >
          <MapController mapRef={mapRef} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={18}
            opacity={0.7}
          />

          {states.map((st) => {
            const { color, radius, label } = getMarkerProps(st)
            const isSelected = selectedState === st.name

            return (
              <CircleMarker
                key={st.code}
                center={[st.latitude, st.longitude]}
                radius={isSelected ? radius + 4 : radius}
                pathOptions={{
                  color: isSelected ? '#FFFFFF' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.65 : 0.35,
                  weight: isSelected ? 2.5 : 1.5,
                }}
                eventHandlers={{
                  click: () => {
                    onSelectState(st.name)
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="font-mono text-[11px] p-0.5 text-black">
                    <strong>{label}</strong>
                    <div className="text-[10px] text-gray-700">Click to filter dashboard</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="mt-auto z-10 bg-[#10182B]/90 backdrop-blur-sm p-2 rounded border border-[#232D47] flex items-center justify-between font-mono text-[10px] w-full">
        <span className="text-[#9AA5C1] uppercase font-bold">Risk Intensity:</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#EF4444]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Critical &gt;15%
          </span>
          <span className="flex items-center gap-1 text-[#F59E0B]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Elevated 10-15%
          </span>
          <span className="flex items-center gap-1 text-[#EAB308]">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" /> Moderate 5-10%
          </span>
          <span className="flex items-center gap-1 text-[#22C55E]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> Low &lt;5%
          </span>
        </div>
      </div>
    </div>
  )
}
