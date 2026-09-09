import React, { useRef, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip, Popup, useMap } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import { StateAnomalyRecord, ProjectRecord } from '@/types'
import { MapLayerType, MapLayerControls } from './MapLayerControls'
import { GisMapLegend } from './GisMapLegend'
import { MapPin, AlertTriangle, ExternalLink, Compass } from 'lucide-react'

interface GisWorkspaceMapProps {
  states: StateAnomalyRecord[]
  projects: ProjectRecord[]
  selectedState?: string
  activeLayer: MapLayerType
  viewMode: 'state' | 'constituency'
  onSelectState: (stateName: string) => void
  onSelectLayer: (layer: MapLayerType) => void
  onOpenProjectDossier?: (project: ProjectRecord) => void
}

// Controller component to manage zoom, reset, resize invalidation and flyTo
const MapController: React.FC<{
  mapRef: React.MutableRefObject<LeafletMap | null>
  targetCenter: [number, number] | null
}> = ({ mapRef, targetCenter }) => {
  const map = useMap()
  mapRef.current = map

  // Invalidate size on mount to eliminate gray tile borders
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 150)
    const handleResize = () => map.invalidateSize()
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  // Fly to target when selected state changes
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, 6.2, { duration: 1.2 })
    }
  }, [targetCenter, map])

  return null
}

export const GisWorkspaceMap: React.FC<GisWorkspaceMapProps> = ({
  states,
  projects,
  selectedState,
  activeLayer,
  viewMode,
  onSelectState,
  onSelectLayer,
  onOpenProjectDossier,
}) => {
  const mapRef = useRef<LeafletMap | null>(null)
  const defaultCenter: [number, number] = [22.8, 79.2]
  const defaultZoom = 4.8

  // Target coordinates if a specific state is selected
  const targetCenter = useMemo<[number, number] | null>(() => {
    if (!selectedState || selectedState === 'All') return null
    const matched = states.find(
      (s) => s.name.toLowerCase() === selectedState.toLowerCase()
    )
    return matched ? [matched.latitude, matched.longitude] : null
  }, [selectedState, states])

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, defaultZoom, { animate: true })
    }
  }

  const handleFocusState = (st: StateAnomalyRecord) => {
    onSelectState(st.name)
    if (mapRef.current) {
      mapRef.current.flyTo([st.latitude, st.longitude], 6.2, { duration: 1.2 })
    }
  }

  // Calculate visual properties for State centroids based on active layer
  const getStateLayerProps = (st: StateAnomalyRecord) => {
    let color = '#22C55E'
    let radius = 12
    let haloRadiusMeters = 80000
    let primaryStat = `${st.anomalyRate.toFixed(1)}% Anomaly`

    if (activeLayer === 'risk') {
      if (st.anomalyRate >= 15) {
        color = '#EF4444'
        radius = 24
        haloRadiusMeters = 180000
      } else if (st.anomalyRate >= 10) {
        color = '#F59E0B'
        radius = 18
        haloRadiusMeters = 130000
      } else if (st.anomalyRate >= 5) {
        color = '#EAB308'
        radius = 14
        haloRadiusMeters = 90000
      } else {
        color = '#22C55E'
        radius = 11
        haloRadiusMeters = 60000
      }
      primaryStat = `${st.anomalyRate.toFixed(1)}% Anomaly (${st.flaggedWorks} flagged works)`
    } else if (activeLayer === 'financial') {
      if (st.discrepancyCr >= 35) {
        color = '#EF4444'
        radius = 26
        haloRadiusMeters = 190000
      } else if (st.discrepancyCr >= 20) {
        color = '#F59E0B'
        radius = 19
        haloRadiusMeters = 140000
      } else {
        color = '#3B82F6'
        radius = 13
        haloRadiusMeters = 70000
      }
      primaryStat = `₹${st.discrepancyCr} Cr Financial Discrepancy (${st.flaggedCapital} exposure)`
    } else if (activeLayer === 'vendor') {
      if (st.vendorDensity >= 40) {
        color = '#EF4444'
        radius = 24
        haloRadiusMeters = 180000
      } else if (st.vendorDensity >= 25) {
        color = '#F59E0B'
        radius = 18
        haloRadiusMeters = 120000
      } else {
        color = '#3B82F6'
        radius = 12
        haloRadiusMeters = 65000
      }
      primaryStat = `${st.vendorDensity} High-Risk Concentrated Contractors`
    } else if (activeLayer === 'gps') {
      if (st.duplicateGpsCount >= 15) {
        color = '#EF4444'
        radius = 24
        haloRadiusMeters = 170000
      } else if (st.duplicateGpsCount >= 8) {
        color = '#F59E0B'
        radius = 17
        haloRadiusMeters = 110000
      } else {
        color = '#3B82F6'
        radius = 11
        haloRadiusMeters = 60000
      }
      primaryStat = `${st.duplicateGpsCount} Duplicate GPS Footprint Clusters`
    }

    return { color, radius, haloRadiusMeters, primaryStat }
  }

  // Constituency markers derived from mockProjects, anchored to state centroids
  const constituencyClusters = useMemo(() => {
    // Map each constituency to its parent state centroid
    const stateMap = new Map<string, StateAnomalyRecord>()
    states.forEach((s) => stateMap.set(s.name.toLowerCase(), s))

    const grouped: Record<
      string,
      {
        name: string
        stateName: string
        stateCentroid: [number, number]
        projects: ProjectRecord[]
        maxRiskScore: number
        totalDisbursed: number
      }
    > = {}

    projects.forEach((p) => {
      const key = `${p.state}__${p.constituency}`
      if (!grouped[key]) {
        const parentState = stateMap.get(p.state.toLowerCase())
        const centroid: [number, number] = parentState
          ? [parentState.latitude, parentState.longitude]
          : [22.8, 79.2]

        grouped[key] = {
          name: p.constituency,
          stateName: p.state,
          stateCentroid: centroid,
          projects: [],
          maxRiskScore: 0,
          totalDisbursed: 0,
        }
      }
      grouped[key].projects.push(p)
      if (p.riskScore > grouped[key].maxRiskScore) {
        grouped[key].maxRiskScore = p.riskScore
      }
      grouped[key].totalDisbursed += p.disbursedAmount
    })

    // Compute cluster offset positions around the parent state centroid so pins don't stack directly on top
    const clusters = Object.values(grouped)
    const stateGroupCounts: Record<string, number> = {}

    return clusters.map((c) => {
      const stName = c.stateName
      const count = stateGroupCounts[stName] || 0
      stateGroupCounts[stName] = count + 1

      // Centroid offset cluster angle & radius (within 0.35 degrees ~35km of centroid)
      const angle = count * (Math.PI * 0.75)
      const offsetDist = count === 0 ? 0 : 0.35
      const lat = c.stateCentroid[0] + Math.sin(angle) * offsetDist
      const lng = c.stateCentroid[1] + Math.cos(angle) * offsetDist

      let color = '#22C55E'
      if (c.maxRiskScore >= 90) color = '#EF4444'
      else if (c.maxRiskScore >= 75) color = '#F59E0B'
      else if (c.maxRiskScore >= 50) color = '#EAB308'

      return {
        ...c,
        lat,
        lng,
        color,
      }
    })
  }, [projects, states])

  return (
    <div className="relative flex-1 w-full h-[580px] lg:h-[650px] bg-[#0A0E1A] border border-[#232D47] rounded-lg overflow-hidden flex flex-col justify-between select-none">
      {/* Top Header Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Zoom, Reset, & Centroid Indicator */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#10182B]/90 backdrop-blur-md p-1 rounded-md border border-[#232D47] shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] border border-[#232D47] rounded flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] border border-[#232D47] rounded flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            title="Zoom Out"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="px-2 h-7 bg-[#161F36] hover:bg-[#232D47] text-[#E7EBF5] border border-[#232D47] rounded flex items-center gap-1 text-[11px] font-mono font-semibold cursor-pointer transition-colors"
            title="Reset View to All-India"
          >
            <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Reset India</span>
          </button>

          {/* Centroid Data Tag */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[#0D1424] rounded border border-[#232D47] text-[10px] font-mono text-[#9AA5C1]">
            <MapPin className="w-3 h-3 text-[#EAB308]" />
            <span>State Centroid Projection Mode</span>
          </div>
        </div>

        {/* Right: Layer Switcher */}
        <div className="pointer-events-auto shadow-lg">
          <MapLayerControls activeLayer={activeLayer} onSelectLayer={onSelectLayer} />
        </div>
      </div>

      {/* Quick State Navigation Chips Bar */}
      <div className="absolute top-14 left-3 z-[1000] hidden md:flex items-center gap-1 pointer-events-auto bg-[#10182B]/85 backdrop-blur-md p-1 rounded-md border border-[#232D47] max-w-xl overflow-x-auto">
        <span className="font-mono text-[9px] text-[#667090] uppercase px-1 font-bold">Focus:</span>
        {states.map((st) => {
          const isSelected = selectedState?.toLowerCase() === st.name.toLowerCase()
          return (
            <button
              key={st.code}
              type="button"
              onClick={() => handleFocusState(st)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] hover:bg-[#232D47]'
              }`}
            >
              {st.code}
            </button>
          )
        })}
      </div>

      {/* Leaflet Canvas */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={true}
          className="w-full h-full bg-[#0A0E1A]"
        >
          <MapController mapRef={mapRef} targetCenter={targetCenter} />

          {/* Dark CartoDB Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={18}
            opacity={0.8}
          />

          {/* LAYER 1: Radiant Thermal Halo Circles (for Risk Heatmap & Discrepancy) */}
          {states.map((st) => {
            const { color, haloRadiusMeters } = getStateLayerProps(st)
            const isSelected = selectedState?.toLowerCase() === st.name.toLowerCase()

            return (
              <React.Fragment key={`halo-${st.code}`}>
                {/* Outer ambient thermal field */}
                <Circle
                  center={[st.latitude, st.longitude]}
                  radius={haloRadiusMeters}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.22 : 0.12,
                    weight: 1,
                    dashArray: activeLayer === 'gps' ? '4, 6' : undefined,
                  }}
                />
                {/* Inner core radiant heat ring */}
                <Circle
                  center={[st.latitude, st.longitude]}
                  radius={haloRadiusMeters * 0.45}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.35 : 0.2,
                    weight: 1.5,
                  }}
                />
              </React.Fragment>
            )
          })}

          {/* LAYER 2: State Centroid Core Markers */}
          {viewMode === 'state' &&
            states.map((st) => {
              const { color, radius, primaryStat } = getStateLayerProps(st)
              const isSelected = selectedState?.toLowerCase() === st.name.toLowerCase()

              return (
                <CircleMarker
                  key={`marker-${st.code}`}
                  center={[st.latitude, st.longitude]}
                  radius={isSelected ? radius + 5 : radius}
                  pathOptions={{
                    color: isSelected ? '#FFFFFF' : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.85 : 0.55,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectState(st.name),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
                    <div className="font-mono text-[11px] p-1 text-black leading-tight">
                      <div className="font-bold flex items-center gap-1">
                        <span>{st.name}</span>
                        <span className="text-[9px] px-1 py-0.2 bg-gray-200 rounded">{st.code}</span>
                      </div>
                      <div className="text-[10px] text-gray-800 mt-0.5">{primaryStat}</div>
                      <div className="text-[9px] text-blue-700 mt-1 font-semibold flex items-center gap-1">
                        <span>Click to inspect regional audit dossier</span>
                      </div>
                    </div>
                  </Tooltip>

                  <Popup>
                    <div className="p-1 font-sans text-xs text-black min-w-[200px]">
                      <div className="font-bold text-sm border-b pb-1 flex justify-between items-center">
                        <span>{st.name}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] text-white font-mono font-bold"
                          style={{ backgroundColor: color }}
                        >
                          {st.riskLevel.toUpperCase()}
                        </span>
                      </div>

                      <div className="py-2 space-y-1 font-mono text-[11px] text-gray-700">
                        <div className="flex justify-between">
                          <span>Anomaly Rate:</span>
                          <strong className="text-black">{st.anomalyRate.toFixed(1)}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Flagged Works:</span>
                          <strong>{st.flaggedWorks}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Capital at Risk:</span>
                          <strong className="text-red-600">{st.flaggedCapital}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Financial Discrepancy:</span>
                          <strong>₹{st.discrepancyCr} Cr</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>High-Risk Vendors:</span>
                          <strong>{st.vendorDensity}</strong>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between gap-1">
                        <div className="text-[9px] text-gray-500 font-mono">
                          Centroid: {st.latitude.toFixed(2)}°N, {st.longitude.toFixed(2)}°E
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectState(st.name)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}

          {/* LAYER 3: Constituency Centroid Clusters (when in constituency view mode) */}
          {viewMode === 'constituency' &&
            constituencyClusters.map((cluster) => {
              const isStateSelected =
                selectedState?.toLowerCase() === cluster.stateName.toLowerCase()

              return (
                <CircleMarker
                  key={`constituency-${cluster.name}`}
                  center={[cluster.lat, cluster.lng]}
                  radius={10}
                  pathOptions={{
                    color: isStateSelected ? '#FFFFFF' : cluster.color,
                    fillColor: cluster.color,
                    fillOpacity: 0.8,
                    weight: isStateSelected ? 2.5 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectState(cluster.stateName),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
                    <div className="font-mono text-[11px] p-1 text-black leading-tight">
                      <strong>{cluster.name}</strong>
                      <div className="text-[10px] text-gray-700">
                        {cluster.stateName} • {cluster.projects.length} Works
                      </div>
                      <div className="text-[9px] text-amber-800 mt-0.5">
                        Max Risk Score: {cluster.maxRiskScore}
                      </div>
                      <div className="text-[9px] text-gray-500 italic mt-0.5">
                        Centroid Cluster (Survey of India Ref)
                      </div>
                    </div>
                  </Tooltip>

                  <Popup>
                    <div className="p-1 font-sans text-xs text-black min-w-[220px]">
                      <div className="font-bold text-sm border-b pb-1 flex justify-between items-center">
                        <span>{cluster.name}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] text-white font-mono font-bold"
                          style={{ backgroundColor: cluster.color }}
                        >
                          Score {cluster.maxRiskScore}
                        </span>
                      </div>

                      <div className="py-2 space-y-1.5 font-mono text-[11px] text-gray-700">
                        <div className="flex justify-between">
                          <span>State:</span>
                          <strong>{cluster.stateName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Tracked Works:</span>
                          <strong>{cluster.projects.length}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Disbursed:</span>
                          <strong>₹ {(cluster.totalDisbursed / 100000).toFixed(1)} L</strong>
                        </div>
                      </div>

                      {cluster.projects[0] && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-[10px] font-bold text-gray-800 truncate mb-1">
                            Primary Work: {cluster.projects[0].title}
                          </div>
                          {onOpenProjectDossier && (
                            <button
                              type="button"
                              onClick={() => onOpenProjectDossier(cluster.projects[0])}
                              className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open Project Dossier</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
        </MapContainer>
      </div>

      {/* Bottom Floating Legend Component */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto">
        <GisMapLegend activeLayer={activeLayer} />
      </div>

      {/* Bottom Right Forensic Disclaimer Badge */}
      <div className="absolute bottom-3 right-3 z-[1000] pointer-events-auto hidden sm:flex items-center gap-1.5 bg-[#10182B]/90 backdrop-blur-md px-2.5 py-1.5 rounded border border-[#232D47] text-[10px] font-mono text-[#9AA5C1]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
        <span>Centroid Projection Active • Zero Simulated GPS Points</span>
      </div>
    </div>
  )
}
