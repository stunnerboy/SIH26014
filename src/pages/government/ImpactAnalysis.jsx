import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Polyline, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import {
  Pencil, CheckCheck, Trash2, AlertCircle, Scale, X,
  Info, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Card, { CardBody } from '../../components/Card';
import {
  calculateAffectedParcels,
  calculateRouteLength,
  getProjectSummary,
  generateCorridorPolygon
} from '../../utils/projectImpact';
import { DEMO_PROJECT } from '../../utils/governmentData';

function cn(...inputs) { return twMerge(clsx(inputs)); }

// Map click handler
function ClickHandler({ drawing, onMapClick }) {
  useMapEvents({ click: (e) => { if (drawing) onMapClick(e.latlng); } });
  return null;
}

// Auto-fit map to bounds
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
    }
  }, [bounds, map]);
  return null;
}

const PARCEL_COLORS = {
  normal: { color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.35, weight: 1 },
  selected: { color: '#0369a1', fillColor: '#38bdf8', fillOpacity: 0.6, weight: 3 },
  affected: { color: '#c2410c', fillColor: '#f97316', fillOpacity: 0.5, weight: 2 },
};

export default function ImpactAnalysis() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDemo = searchParams.get('demo') === 'true';

  // Project metadata
  const projectName = isDemo ? DEMO_PROJECT.name : (searchParams.get('name') || 'Custom Project');
  const projectType = isDemo ? DEMO_PROJECT.type : (searchParams.get('type') || 'Highway');
  const corridorWidthParam = isDemo ? DEMO_PROJECT.corridorWidth : parseInt(searchParams.get('corridorWidth') || '30', 10);

  // Route & corridor state
  const [route, setRoute] = useState(isDemo ? DEMO_PROJECT.route : []);
  const [corridorWidth, setCorridorWidth] = useState(corridorWidthParam);
  const [corridorPolygon, setCorridorPolygon] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [routeFinished, setRouteFinished] = useState(isDemo);

  // Parcels
  const [affectedParcels, setAffectedParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [mapFit, setMapFit] = useState(null);

  // Tab
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'summary'

  // On demo load, immediately generate corridor
  useEffect(() => {
    if (isDemo) {
      const corridor = generateCorridorPolygon(DEMO_PROJECT.route, DEMO_PROJECT.corridorWidth);
      setCorridorPolygon(corridor);
      const parcels = calculateAffectedParcels(DEMO_PROJECT.route, DEMO_PROJECT.corridorWidth);
      setAffectedParcels(parcels);
      // Fit map to demo route
      const bounds = DEMO_PROJECT.route.map(([lng, lat]) => [lat, lng]);
      setMapFit(bounds);
    }
  }, [isDemo]);

  const handleMapClick = useCallback((latlng) => {
    setRoute(prev => [...prev, [latlng.lng, latlng.lat]]);
  }, []);

  const handleFinishRoute = () => {
    if (route.length < 2) return;
    setDrawing(false);
    setRouteFinished(true);
  };

  const handleClearRoute = () => {
    setRoute([]);
    setCorridorPolygon(null);
    setAffectedParcels([]);
    setRouteFinished(false);
    setDrawing(false);
    setSelectedParcel(null);
  };

  const handleGenerateCorridor = () => {
    const corridor = generateCorridorPolygon(route, corridorWidth);
    setCorridorPolygon(corridor);
    const parcels = calculateAffectedParcels(route, corridorWidth);
    setAffectedParcels(parcels);
    setActiveTab('table');
  };

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel);
    const coords = parcel.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    setMapFit(coords);
  };

  const routeLatLngs = route.map(([lng, lat]) => [lat, lng]);
  const corridorLatLngs = corridorPolygon ? corridorPolygon.map(([lng, lat]) => [lat, lng]) : null;

  const summary = affectedParcels.length > 0
    ? getProjectSummary(
        { name: projectName, type: projectType, corridorWidth },
        affectedParcels
      )
    : null;

  const routeLength = calculateRouteLength(route);

  // Default map center
  const mapCenter = isDemo ? [18.580, 73.980] : [18.579, 73.980];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-0 -m-4 md:-m-8 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-full lg:w-[360px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">

        {/* Project Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">{projectName}</h1>
              <p className="text-xs text-gray-500">{projectType} • Corridor: {corridorWidth}m</p>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-semibold">Prototype GIS</span>
          </div>
        </div>

        {/* Route Controls */}
        <div className="px-4 py-3 border-b border-gray-200 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {!routeFinished ? (
              <>
                <button
                  onClick={() => setDrawing(!drawing)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors",
                    drawing
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {drawing ? 'Drawing... (click map)' : 'Draw Route'}
                </button>
                {route.length >= 2 && (
                  <button
                    onClick={handleFinishRoute}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-green-600 text-white border-green-600 hover:bg-green-700 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Finish Route
                  </button>
                )}
              </>
            ) : (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCheck className="h-3.5 w-3.5" /> Route ready ({routeLength} km)
              </span>
            )}
            {route.length > 0 && (
              <button
                onClick={handleClearRoute}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>

          {routeFinished && (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Corridor Width (m)</label>
                <select
                  value={corridorWidth}
                  onChange={e => setCorridorWidth(parseInt(e.target.value, 10))}
                  className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[10, 20, 30, 50, 100].map(w => <option key={w} value={w}>{w} m</option>)}
                </select>
              </div>
              <button
                onClick={handleGenerateCorridor}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
              >
                Generate Corridor
              </button>
            </div>
          )}

          {drawing && (
            <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              Click on the map to add route points. Click "Finish Route" when done.
            </p>
          )}
        </div>

        {/* Results Tabs */}
        {affectedParcels.length > 0 && (
          <>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('table')}
                className={cn("flex-1 text-xs font-semibold px-3 py-2.5 border-b-2 transition-colors",
                  activeTab === 'table' ? "border-primary-600 text-primary-700 bg-gray-50" : "border-transparent text-gray-500 hover:text-gray-700")}
              >
                Affected Parcels ({affectedParcels.length})
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={cn("flex-1 text-xs font-semibold px-3 py-2.5 border-b-2 transition-colors",
                  activeTab === 'summary' ? "border-primary-600 text-primary-700 bg-gray-50" : "border-transparent text-gray-500 hover:text-gray-700")}
              >
                Project Summary
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'table' && (
                <div className="divide-y divide-gray-100">
                  {affectedParcels.map(parcel => {
                    const isSelected = selectedParcel?.id === parcel.id;
                    return (
                      <div
                        key={parcel.id}
                        onClick={() => handleSelectParcel(parcel)}
                        className={cn(
                          "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                          isSelected && "bg-blue-50 border-l-2 border-l-blue-500"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono font-bold text-primary-700 leading-tight">{parcel.ulpin}</span>
                          <div className="flex gap-1 flex-wrap justify-end">
                            {parcel.hasActiveCase && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">Court Case</span>}
                            {parcel.encumbranceStatus !== 'Clear' && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-semibold">Encumbered</span>}
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 font-medium mb-1">{parcel.ownerName}</div>
                        <div className="text-xs text-gray-500 mb-2">{parcel.village}, {parcel.district}</div>
                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                          <div className="bg-gray-50 rounded p-1 text-center">
                            <div className="font-bold text-gray-900">{parcel.area}</div>
                            <div className="text-gray-400">Total</div>
                          </div>
                          <div className="bg-orange-50 rounded p-1 text-center">
                            <div className="font-bold text-orange-800">{parcel.affectedArea}</div>
                            <div className="text-orange-600">Affected</div>
                          </div>
                          <div className="bg-green-50 rounded p-1 text-center">
                            <div className="font-bold text-green-800">{parcel.affectedPct}%</div>
                            <div className="text-green-600">Impact</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'summary' && summary && (
                <div className="p-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    {[
                      ['Project Name', summary.projectName],
                      ['Project Type', summary.projectType],
                      ['Corridor Width', `${summary.corridorWidth} m`],
                      ['Route Length', `${routeLength} km`],
                      ['Affected Parcels', summary.totalAffectedParcels],
                      ['Total Affected Area', summary.totalAffectedArea + ' (mixed units)'],
                      ['Court Case Parcels', summary.caseAffectedParcels],
                      ['Encumbered Parcels', summary.encumberedParcels],
                      ['Land Uses Affected', summary.landUseCategories.join(', ')],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-xs">{k}</span>
                        <span className="font-semibold text-gray-900 text-xs text-right max-w-[55%]">{String(v)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-amber-900 mb-1">Preliminary Reference Estimate</div>
                    <div className="text-lg font-bold text-amber-800">
                      ₹{summary.estimatedReferenceValue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-amber-700 mt-1">
                      This is not an official compensation calculation. Sample data only.
                    </div>
                  </div>

                  {summary.caseAffectedParcels > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <Scale className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-red-800">
                        <span className="font-bold">Legal attention required</span> — {summary.caseAffectedParcels} affected parcel(s) have active court cases.
                      </div>
                    </div>
                  )}
                  {summary.encumberedParcels > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-yellow-800">
                        <span className="font-bold">Encumbrance record present</span> — {summary.encumberedParcels} parcel(s).
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/government/reports')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                  >
                    Generate Full Report
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {affectedParcels.length === 0 && routeFinished && !corridorPolygon && (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="text-gray-400">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Click "Generate Corridor" to detect affected parcels.</p>
            </div>
          </div>
        )}

        {!routeFinished && route.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="text-gray-400">
              <Pencil className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-gray-600 mb-1">Draw a route on the map</p>
              <p className="text-xs">Click "Draw Route" then click map points.</p>
            </div>
          </div>
        )}
      </div>

      {/* CENTER: MAP */}
      <div className="flex-1 relative min-h-[300px] lg:min-h-0">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <ZoomControl position="bottomright" />
          <ClickHandler drawing={drawing} onMapClick={handleMapClick} />
          {mapFit && <FitBounds bounds={mapFit} />}

          {/* Affected parcels */}
          {affectedParcels.length > 0 ? (
            affectedParcels.map(p => {
              const isSelected = selectedParcel?.id === p.id;
              const coords = p.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
              return (
                <Polygon
                  key={p.id}
                  positions={coords}
                  pathOptions={isSelected ? PARCEL_COLORS.selected : PARCEL_COLORS.affected}
                  eventHandlers={{ click: () => handleSelectParcel(p) }}
                />
              );
            })
          ) : null}

          {/* Route line */}
          {routeLatLngs.length >= 2 && (
            <Polyline
              positions={routeLatLngs}
              pathOptions={{ color: '#2563eb', weight: 3, dashArray: '8,4' }}
            />
          )}

          {/* Corridor polygon */}
          {corridorLatLngs && (
            <Polygon
              positions={corridorLatLngs}
              pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.25, weight: 2, dashArray: '4,4' }}
            />
          )}
        </MapContainer>

        {/* Drawing cursor hint */}
        {drawing && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
            Click map to add route points
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Selected Parcel Details */}
      {selectedParcel && (
        <div className="w-full lg:w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden lg:max-h-full max-h-[50vh]">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Parcel Details</h3>
            <button onClick={() => setSelectedParcel(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">ULPIN</div>
              <div className="font-mono font-bold text-primary-700 text-sm">{selectedParcel.ulpin}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['Khata', selectedParcel.khataNumber],
                ['Khasra', selectedParcel.khasraNumber],
                ['Village', selectedParcel.village],
                ['District', selectedParcel.district],
                ['Land Use', selectedParcel.landUse],
                ['Total Area', `${selectedParcel.area} ${selectedParcel.areaUnit}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-gray-400 uppercase tracking-wide text-[9px]">{k}</div>
                  <div className="font-semibold text-gray-900 mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs font-bold text-gray-700 mb-2">Project Impact</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total Area</span>
                  <span className="font-semibold">{selectedParcel.area} {selectedParcel.areaUnit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-700">Affected Area</span>
                  <span className="font-bold text-orange-700">{selectedParcel.affectedArea} {selectedParcel.areaUnit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-700">Remaining Area</span>
                  <span className="font-semibold text-green-700">{selectedParcel.remainingArea} {selectedParcel.areaUnit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Impact %</span>
                  <span className="font-bold text-gray-900">{selectedParcel.affectedPct}%</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${selectedParcel.affectedPct}%` }} />
              </div>
            </div>

            {/* Valuation */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">Preliminary Reference Estimate</div>
              <div className="text-sm font-bold text-amber-900">
                ₹{selectedParcel.preliminaryValue?.toLocaleString('en-IN')}
              </div>
              <div className="text-[9px] text-amber-600 mt-1">
                {selectedParcel.affectedArea} {selectedParcel.areaUnit} × ₹{selectedParcel.referenceRate?.toLocaleString('en-IN')}/{selectedParcel.areaUnit}
              </div>
              <div className="text-[9px] text-amber-700 mt-1 italic">Not an official compensation figure.</div>
            </div>

            {/* Legal Flags */}
            {selectedParcel.hasActiveCase && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <Scale className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-800 font-semibold">Legal attention required — Active court case</div>
              </div>
            )}
            {selectedParcel.encumbranceStatus !== 'Clear' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-800 font-semibold">Encumbrance record present</div>
              </div>
            )}
            {selectedParcel.affectedPct >= 60 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-orange-800 font-semibold">High percentage of parcel affected</div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => navigate(`/land/${selectedParcel.id}`)}
                className="w-full flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                View Land Details <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => navigate(`/map?parcel=${selectedParcel.id}`)}
                className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2 rounded-lg border border-gray-200 transition-colors"
              >
                View on Map <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
