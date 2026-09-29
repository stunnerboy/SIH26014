import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Layers, Info } from 'lucide-react';
import Card, { CardBody } from '../../components/Card';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const LAYER_GROUPS = [
  {
    label: 'Base',
    layers: [
      { id: 'basemap', label: 'Street Map', desc: 'OpenStreetMap base layer', defaultOn: true },
    ]
  },
  {
    label: 'Land',
    layers: [
      { id: 'parcels', label: 'Parcel Boundaries', desc: 'All registered land parcels', defaultOn: true },
      { id: 'village', label: 'Village Boundaries', desc: 'Administrative village limits (mock)', defaultOn: false },
      { id: 'landuse', label: 'Land Use Zones', desc: 'Agricultural, Residential, etc.', defaultOn: false },
    ]
  },
  {
    label: 'Governance',
    layers: [
      { id: 'courtcases', label: 'Court Cases', desc: 'Parcels with active court cases', defaultOn: false },
      { id: 'encumbrance', label: 'Encumbrance', desc: 'Mortgaged or encumbered parcels', defaultOn: false },
      { id: 'tax', label: 'Tax Records', desc: 'Tax payment status (mock)', defaultOn: false },
    ]
  },
  {
    label: 'Infrastructure',
    layers: [
      { id: 'roads', label: 'Roads', desc: 'National and state highways (mock)', defaultOn: false },
      { id: 'railway', label: 'Railway', desc: 'Railway corridors (mock)', defaultOn: false },
      { id: 'utilities', label: 'Utilities', desc: 'Power lines, water mains (mock)', defaultOn: false },
      { id: 'projects', label: 'Proposed Projects', desc: 'Infrastructure project corridors', defaultOn: true },
    ]
  },
  {
    label: 'Environment',
    layers: [
      { id: 'restricted', label: 'Restricted Zones', desc: 'Forest, heritage, buffer zones (mock)', defaultOn: false },
    ]
  }
];

const LAYER_COLORS = {
  parcels: '#22c55e',
  village: '#8b5cf6',
  landuse: '#f59e0b',
  courtcases: '#ef4444',
  encumbrance: '#f97316',
  tax: '#6366f1',
  roads: '#64748b',
  railway: '#1e40af',
  utilities: '#0ea5e9',
  projects: '#dc2626',
  restricted: '#065f46',
};

export default function DataLayers() {
  const allLayerIds = LAYER_GROUPS.flatMap(g => g.layers).map(l => l.id);
  const defaultState = Object.fromEntries(
    LAYER_GROUPS.flatMap(g => g.layers).map(l => [l.id, l.defaultOn])
  );
  const [layerState, setLayerState] = useState(defaultState);

  const toggle = (id) => setLayerState(prev => ({ ...prev, [id]: !prev[id] }));

  const activeLayers = allLayerIds.filter(id => layerState[id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Layers</h1>
        <p className="mt-1 text-sm text-gray-500">Toggle visibility of map data layers. All data is mock/sample for this prototype.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Layer Controls */}
        <div className="space-y-4">
          {LAYER_GROUPS.map(group => (
            <Card key={group.label}>
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-lg">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gray-500" /> {group.label}
                </h2>
              </div>
              <CardBody className="p-0 divide-y divide-gray-50">
                {group.layers.map(layer => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0 border"
                        style={{
                          backgroundColor: layerState[layer.id] ? LAYER_COLORS[layer.id] || '#94a3b8' : 'transparent',
                          borderColor: LAYER_COLORS[layer.id] || '#94a3b8',
                          opacity: layerState[layer.id] ? 1 : 0.4
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{layer.label}</div>
                        <div className="text-xs text-gray-400">{layer.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(layer.id)}
                      className={cn(
                        "relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                        layerState[layer.id] ? 'bg-primary-600' : 'bg-gray-200'
                      )}
                      role="switch"
                      aria-checked={layerState[layer.id]}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        layerState[layer.id] ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                ))}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Active Layer Legend */}
        <div className="space-y-4">
          <Card>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Active Layers ({activeLayers.length})</h2>
            </div>
            <CardBody className="p-4">
              {activeLayers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No layers active. Toggle layers to enable them.</p>
              ) : (
                <div className="space-y-2">
                  {activeLayers.map(id => {
                    const layer = LAYER_GROUPS.flatMap(g => g.layers).find(l => l.id === id);
                    if (!layer) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                        <div
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={{ backgroundColor: LAYER_COLORS[id] || '#94a3b8', opacity: 0.8 }}
                        />
                        <span className="text-sm text-gray-900">{layer.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardBody className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <span className="font-bold block mb-1">Layer Integration Note</span>
                Layer toggles here control visibility settings. In this SIH prototype, layers are represented as mock data categories. Integration with a live GIS map would connect these toggles directly to the React-Leaflet map on the Impact Analysis page.
              </div>
            </CardBody>
          </Card>

          <Card>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Colour Legend</h2>
            </div>
            <CardBody className="p-4">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {LAYER_GROUPS.flatMap(g => g.layers).map(layer => (
                  <div key={layer.id} className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: LAYER_COLORS[layer.id] }} />
                    {layer.label}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
