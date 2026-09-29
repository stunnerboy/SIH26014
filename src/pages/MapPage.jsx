import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Popup, useMap, ZoomControl } from 'react-leaflet';
import { 
  Search as SearchIcon, Layers, Filter, X, ChevronRight, 
  AlertCircle, Info, MapPin, Maximize, LocateFixed, Bot, CheckCircle,
  Home, Grid
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Button from '../components/Button';
import Badge from '../components/Badge';
import { getAllParcels, getParcelById, filterMapParcels } from '../utils/mapData';
import { searchLand } from '../utils/searchLand';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Map Controller for Zooming
function MapController({ selectedParcel, allParcels }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedParcel) {
      const coords = selectedParcel.geometry.coordinates[0].map(c => [c[1], c[0]]);
      map.fitBounds(coords, { padding: [50, 50], maxZoom: 18 });
    } else if (allParcels.length > 0) {
      // Default to the first parcel's location if none selected
      const defaultCenter = allParcels[0].geometry.coordinates[0][0];
      map.setView([defaultCenter[1], defaultCenter[0]], 12);
    }
  }, [selectedParcel, map, allParcels]);
  
  return null;
}

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Data State
  const allParcels = getAllParcels();
  const [displayedParcels, setDisplayedParcels] = useState(allParcels);
  
  // Selection State
  const parcelId = searchParams.get('parcel');
  const [selectedParcel, setSelectedParcel] = useState(null);
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  
  // Layer & Filter State
  const [filters, setFilters] = useState({
    landUse: 'All',
    projectAffected: false,
    courtCase: false,
    encumbrance: false
  });
  
  const [layers, setLayers] = useState({
    baseMap: true,
    parcelBoundaries: true
  });

  // Handle URL Parameter
  useEffect(() => {
    if (parcelId) {
      const parcel = getParcelById(parcelId);
      if (parcel) {
        setSelectedParcel(parcel);
        setSidebarOpen(false); // Close sidebar on mobile to show map/details
      }
    } else {
      setSelectedParcel(null);
    }
  }, [parcelId]);

  // Handle Filters
  useEffect(() => {
    setDisplayedParcels(filterMapParcels(allParcels, filters));
  }, [filters]);

  // Handle Search
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      // Using existing searchLand utility, simplified to ULPIN/Owner/Khata for quick map search
      const byUlpin = searchLand('ulpin', q);
      const byOwner = searchLand('owner', q);
      const byKhata = searchLand('khata', q);
      const combined = [...new Map([...byUlpin, ...byOwner, ...byKhata].map(item => [item.id, item])).values()];
      setSearchResults(combined.slice(0, 5));
      setShowSearchBox(true);
    } else {
      setSearchResults([]);
      setShowSearchBox(false);
    }
  };

  const selectSearchResult = (id) => {
    setSearchQuery('');
    setShowSearchBox(false);
    setSearchParams({ parcel: id });
  };

  // Determine Parcel Color based on state/filters
  const getParcelStyle = (parcel) => {
    const isSelected = selectedParcel && selectedParcel.id === parcel.id;
    
    if (isSelected) return { color: '#0369a1', fillColor: '#38bdf8', fillOpacity: 0.6, weight: 3 }; // Blue for selected
    if (parcel.hasActiveCase) return { color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.5, weight: 2 }; // Red for court case
    if (parcel.projectAffected) return { color: '#c2410c', fillColor: '#f97316', fillOpacity: 0.5, weight: 2 }; // Orange for project
    if (parcel.encumbranceStatus !== 'Clear') return { color: '#a16207', fillColor: '#eab308', fillOpacity: 0.5, weight: 2 }; // Yellow for encumbrance
    
    return { color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.4, weight: 1 }; // Default Green
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      
      {/* DESKTOP HEADER */}
      <header className="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-6 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary-700 mr-8">BhuSetu</Link>
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li aria-current="page" className="text-gray-900 font-medium">Explore Land Map</li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100">
            Basic parcel discovery is available without login.
          </span>
          <Button variant="outline" size="sm" onClick={() => navigate('/search')}>Search Land</Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>Help</Button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* MOBILE HEADER OVERLAY */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ULPIN, Owner..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchQuery.length>2) setShowSearchBox(true); }}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-lg border-0 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              
              {/* Mobile Search Dropdown */}
              {showSearchBox && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map(res => (
                      <div key={res.id} onClick={() => selectSearchResult(res.id)} className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <div className="text-sm font-bold text-gray-900">{res.ulpin}</div>
                        <div className="text-xs text-gray-500">{res.ownerName} • {res.village}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No matching parcels found.</div>
                  )}
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white p-3 rounded-lg shadow-lg text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* LEFT SIDEBAR (Controls & Filters) */}
        <div className={cn(
          "absolute inset-y-0 left-0 z-[1001] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-10 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 md:bg-white">
            <h2 className="text-lg font-bold text-gray-900 flex items-center"><Layers className="h-5 w-5 mr-2 text-primary-600" /> Map Controls</h2>
            <button className="md:hidden p-1 text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ULPIN, Khata, Khasra..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchQuery.length>2) setShowSearchBox(true); }}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
              {/* Desktop Search Dropdown */}
              {showSearchBox && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(res => (
                      <div key={res.id} onClick={() => selectSearchResult(res.id)} className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <div className="text-sm font-semibold text-primary-700">{res.ulpin}</div>
                        <div className="text-xs text-gray-600">{res.ownerName}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">No matching parcels found.</div>
                  )}
                </div>
              )}
            </div>

            {/* Filters */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Use</label>
                  <select 
                    className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm border focus:ring-primary-500 focus:border-primary-500 outline-none"
                    value={filters.landUse}
                    onChange={e => setFilters({...filters, landUse: e.target.value})}
                  >
                    <option value="All">All Types</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                      checked={filters.projectAffected} onChange={e => setFilters({...filters, projectAffected: e.target.checked})} />
                    <span className="ml-2 text-sm text-gray-700">Show Project Affected Only</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                      checked={filters.courtCase} onChange={e => setFilters({...filters, courtCase: e.target.checked})} />
                    <span className="ml-2 text-sm text-gray-700">Show Active Court Cases Only</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                      checked={filters.encumbrance} onChange={e => setFilters({...filters, encumbrance: e.target.checked})} />
                    <span className="ml-2 text-sm text-gray-700">Show Encumbered Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center"><div className="w-4 h-4 rounded-sm bg-green-500 border border-green-700 opacity-70 mr-3"></div> Normal Parcel</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-sm bg-blue-500 border-2 border-blue-700 opacity-80 mr-3"></div> Selected Parcel</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-sm bg-red-500 border border-red-700 opacity-70 mr-3"></div> Active Court Case</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-sm bg-orange-500 border border-orange-700 opacity-70 mr-3"></div> Project Affected</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-sm bg-yellow-500 border border-yellow-700 opacity-70 mr-3"></div> Encumbered</div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER MAP */}
        <div className="flex-1 relative bg-gray-200 z-0 h-full w-full">
          <MapContainer 
            center={[18.580, 73.980]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }} 
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            
            {layers.parcelBoundaries && displayedParcels.map(parcel => (
              <Polygon 
                key={parcel.id}
                positions={parcel.geometry.coordinates[0].map(c => [c[1], c[0]])}
                pathOptions={getParcelStyle(parcel)}
                eventHandlers={{
                  click: () => {
                    setSearchParams({ parcel: parcel.id });
                  }
                }}
              >
                <Popup>
                  <div className="text-center p-1">
                    <div className="font-bold text-gray-900">{parcel.ulpin}</div>
                    <div className="text-xs text-gray-500 mb-2">{parcel.ownerName}</div>
                    <Button size="sm" onClick={() => setSearchParams({ parcel: parcel.id })}>Select</Button>
                  </div>
                </Popup>
              </Polygon>
            ))}
            
            <MapController selectedParcel={selectedParcel} allParcels={allParcels} />
          </MapContainer>
          
          {/* Floating Map Controls */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none md:top-6 md:right-6">
            <button className="bg-white p-2.5 rounded-lg shadow-md border border-gray-100 text-gray-700 hover:text-primary-600 pointer-events-auto" title="Locate Me">
              <LocateFixed className="h-5 w-5" />
            </button>
            <button className="bg-white p-2.5 rounded-lg shadow-md border border-gray-100 text-gray-700 hover:text-primary-600 pointer-events-auto" title="Reset View" onClick={() => setSearchParams({})}>
              <Maximize className="h-5 w-5" />
            </button>
          </div>
          
          {/* AI Help Floating Button */}
          <button 
            onClick={() => navigate('/help')}
            className="absolute bottom-24 right-4 md:bottom-6 md:left-6 md:right-auto z-[400] bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center"
            title="Need help?"
          >
            <Bot className="h-5 w-5" />
          </button>
        </div>

        {/* RIGHT PANEL / BOTTOM SHEET (Selected Parcel) */}
        {selectedParcel && (
          <div className={cn(
            "absolute z-[1001] bg-white shadow-2xl transition-transform duration-300 ease-in-out border-gray-200 overflow-y-auto",
            "bottom-[64px] left-0 right-0 h-auto max-h-[50vh] rounded-t-2xl border-t md:bottom-0 md:relative md:w-96 md:max-h-none md:h-full md:rounded-none md:border-l md:border-t-0 md:translate-y-0",
            selectedParcel ? "translate-y-0" : "translate-y-[150%] md:translate-x-full"
          )}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
              <h2 className="font-bold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" /> Parcel Details
              </h2>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" onClick={() => setSearchParams({})}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-5">
              {/* Basic Info */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">ULPIN</span>
                  <div className="flex gap-1">
                    {selectedParcel.hasActiveCase && <Badge variant="danger">Court Case</Badge>}
                    {selectedParcel.encumbranceStatus !== 'Clear' && <Badge variant="warning">Encumbered</Badge>}
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-primary-700 mb-4">{selectedParcel.ulpin}</div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div><span className="block text-xs text-gray-500">Khata No.</span><span className="font-medium">{selectedParcel.khataNumber}</span></div>
                  <div><span className="block text-xs text-gray-500">Khasra / Survey</span><span className="font-medium">{selectedParcel.khasraNumber}</span></div>
                  <div><span className="block text-xs text-gray-500">Area</span><span className="font-medium">{selectedParcel.area} {selectedParcel.areaUnit}</span></div>
                  <div><span className="block text-xs text-gray-500">Land Use</span><span className="font-medium">{selectedParcel.landUse}</span></div>
                  <div className="col-span-2"><span className="block text-xs text-gray-500">Owner</span><span className="font-medium">{selectedParcel.ownerName}</span></div>
                  <div className="col-span-2"><span className="block text-xs text-gray-500">Location</span><span className="font-medium">{selectedParcel.village}, {selectedParcel.district}</span></div>
                </div>
              </div>

              {/* Court Case Alert */}
              {selectedParcel.hasActiveCase && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-800 font-bold mb-1">
                    <AlertCircle className="h-4 w-4 mr-2" /> Active Court Case
                  </div>
                  <div className="text-xs text-red-700 mb-2">This parcel is subject to legal proceedings.</div>
                  <Button size="sm" variant="danger" className="w-full text-xs" onClick={() => navigate(`/land/${selectedParcel.id}`)}>View Legal Information</Button>
                </div>
              )}

              {/* Project Impact Alert */}
              {selectedParcel.projectAffected && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center text-orange-800 font-bold mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" /> Project Affected
                  </div>
                  <div className="text-xs text-orange-900 mb-1 font-semibold">{selectedParcel.projectAffected.name}</div>
                  <div className="text-xs text-orange-800 mb-3 space-y-1">
                    <div className="flex justify-between"><span>Total Area:</span> <span>{selectedParcel.area} {selectedParcel.areaUnit}</span></div>
                    <div className="flex justify-between font-bold"><span>Affected:</span> <span>{(selectedParcel.area * 0.32).toFixed(2)} {selectedParcel.areaUnit}</span></div>
                  </div>
                  <Button size="sm" className="w-full text-xs bg-orange-600 hover:bg-orange-700 text-white border-transparent" onClick={() => navigate(`/land/${selectedParcel.id}`)}>View Impact Details</Button>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <Button className="w-full" onClick={() => navigate(`/land/${selectedParcel.id}`)}>View Full Details</Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[1002] px-2 py-2 flex justify-between items-center shadow-lg">
        {[
          { label: 'Home', path: '/', icon: Home },
          { label: 'Search Land', path: '/search', icon: SearchIcon },
          { label: 'Explore Map', path: '/map', icon: MapPin },
          { label: 'Services', path: '/services', icon: Grid },
          { label: 'About', path: '/about', icon: Info }
        ].map((item) => {
          const isActive = item.path === '/map';
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full px-2 py-1 text-xs font-medium rounded-lg transition-colors",
                isActive ? "text-primary-700 bg-primary-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
