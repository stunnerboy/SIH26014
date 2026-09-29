import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Map as MapIcon, Filter, Clock, MapPin, Building, ChevronDown, Check, Info, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Button from '../components/Button';
import Card, { CardBody } from '../components/Card';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { searchLand, getFilterOptions } from '../utils/searchLand';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SEARCH_TABS = [
  { id: 'ulpin', label: 'ULPIN', placeholder: 'Enter ULPIN', example: 'MH12345678901234' },
  { id: 'khata', label: 'Khata Number', placeholder: 'Enter Khata Number', example: '452' },
  { id: 'khasra', label: 'Khasra / Survey Number', placeholder: 'Enter Khasra or Survey Number', example: '12A/1' },
  { id: 'owner', label: 'Owner Name', placeholder: 'Enter owner name', example: 'Ramesh Kumar' },
  { id: 'location', label: 'Location', placeholder: 'Search by Location', example: 'Pune' }
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state
  const queryType = searchParams.get('type') || 'ulpin';
  const queryQ = searchParams.get('q') || '';
  
  // Location specific query string parsing
  const getInitialLoc = () => {
    if (queryType === 'location' && queryQ) {
      try { return JSON.parse(queryQ); } catch(e) { return { state: '', district: '', tehsil: '', village: queryQ }; }
    }
    return { state: '', district: '', tehsil: '', village: '' };
  };

  // Local state
  const [activeTab, setActiveTab] = useState(SEARCH_TABS.find(t => t.id === queryType) || SEARCH_TABS[0]);
  const [searchValue, setSearchValue] = useState(queryType !== 'location' ? queryQ : '');
  const [locValue, setLocValue] = useState(getInitialLoc());
  
  const [results, setResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('relevance');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filterOptions = getFilterOptions();

  useEffect(() => {
    // Load recent searches
    try {
      const saved = JSON.parse(localStorage.getItem('landstack_recent_searches') || '[]');
      setRecentSearches(saved);
    } catch(e) {}
  }, []);

  useEffect(() => {
    // Execute search when URL changes
    if (queryType && queryQ) {
      setActiveTab(SEARCH_TABS.find(t => t.id === queryType) || SEARCH_TABS[0]);
      let parsedQuery = queryQ;
      if (queryType === 'location') {
        try { 
          parsedQuery = JSON.parse(queryQ); 
          setLocValue(parsedQuery); 
        } catch(e) {
          parsedQuery = { state: '', district: '', tehsil: '', village: queryQ };
          setLocValue(parsedQuery);
        }
      } else {
        setSearchValue(queryQ);
      }
      
      const res = searchLand(queryType, parsedQuery, filters, sort);
      setResults(res);
    } else {
      setResults(null);
    }
  }, [searchParams, filters, sort]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    
    let q = activeTab.id === 'location' ? JSON.stringify(locValue) : searchValue;
    
    if (!q || q === '{}') return;

    // Save to history
    const newSearch = { type: activeTab.id, q, label: activeTab.id === 'location' ? `${locValue.village || ''} ${locValue.district || ''}`.trim() : searchValue, timestamp: new Date().toISOString() };
    const updatedHistory = [newSearch, ...recentSearches.filter(s => s.q !== q)].slice(0, 5);
    setRecentSearches(updatedHistory);
    localStorage.setItem('landstack_recent_searches', JSON.stringify(updatedHistory));

    // Update URL
    setSearchParams({ type: activeTab.id, q });
  };

  const handleClear = () => {
    setSearchValue('');
    setLocValue({ state: '', district: '', tehsil: '', village: '' });
    setSearchParams({});
    setResults(null);
  };

  const StatusBadge = ({ status }) => {
    let variant = 'default';
    if (status === 'Clear') variant = 'success';
    else if (status === 'Active') variant = 'danger';
    else if (status === 'None') variant = 'success';
    else variant = 'warning';
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-secondary-50 pb-16">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Land Records</h1>
          <p className="text-gray-600 mb-6">Find available land information using ULPIN or other local land references.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start text-sm text-blue-800 mb-8 max-w-3xl">
            <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <p>Basic land discovery is available without login. Protected or personalized information may require authentication.</p>
          </div>

          {/* SEARCH UI */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50">
              {SEARCH_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab);
                    // Don't clear inputs automatically when switching to keep user data
                  }}
                  className={cn(
                    "px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                    activeTab.id === tab.id 
                      ? "border-primary-600 text-primary-700 bg-white" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSearchSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{activeTab.label}</label>
                
                {activeTab.id === 'location' ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input 
                      type="text" placeholder="State" value={locValue.state} 
                      onChange={e => setLocValue({...locValue, state: e.target.value})}
                      className="block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border outline-none"
                    />
                    <input 
                      type="text" placeholder="District" value={locValue.district} 
                      onChange={e => setLocValue({...locValue, district: e.target.value})}
                      className="block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border outline-none"
                    />
                    <input 
                      type="text" placeholder="Tehsil / Taluka" value={locValue.tehsil} 
                      onChange={e => setLocValue({...locValue, tehsil: e.target.value})}
                      className="block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border outline-none"
                    />
                    <input 
                      type="text" placeholder="Village" value={locValue.village} 
                      onChange={e => setLocValue({...locValue, village: e.target.value})}
                      className="block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={activeTab.placeholder}
                    className="block w-full rounded-md border-gray-300 py-3 pl-4 pr-4 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base border outline-none max-w-2xl"
                  />
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">Search</Button>
                  <Button type="button" variant="ghost" size="lg" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
                </div>
                
                {/* Example Search */}
                <div className="text-sm text-gray-500 hidden sm:block">
                  Example: <button type="button" onClick={() => {
                    if (activeTab.id === 'location') setLocValue({ state: 'Maharashtra', district: 'Pune', tehsil: 'Haveli', village: 'Wagholi' });
                    else setSearchValue(activeTab.example);
                  }} className="text-primary-600 hover:underline">{activeTab.example}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR (History, Help, Map Link) */}
          {results === null && (
            <div className="w-full lg:w-1/3 space-y-6">
              {recentSearches.length > 0 && (
                <Card>
                  <CardBody>
                    <div className="flex items-center text-gray-900 font-semibold mb-4">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" /> Recent Searches
                    </div>
                    <ul className="space-y-3">
                      {recentSearches.map((s, i) => (
                        <li key={i}>
                          <button 
                            onClick={() => setSearchParams({ type: s.type, q: s.q })}
                            className="text-left w-full hover:bg-gray-50 p-2 rounded-md transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-900 truncate">{s.label}</div>
                            <div className="text-xs text-gray-500 uppercase">{s.type}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}

              <Card className="bg-primary-50 border-primary-100">
                <CardBody>
                  <h3 className="font-semibold text-primary-900 mb-2">Don't have a ULPIN?</h3>
                  <p className="text-sm text-primary-700 mb-4">You can search using Khata Number, Khasra/Survey Number, owner name or location.</p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab(SEARCH_TABS[1])}
                  >
                    Show Other Search Options
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 mb-2">Prefer searching visually?</h3>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/map')}>
                    <MapIcon className="h-4 w-4 mr-2" /> Explore Map
                  </Button>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 mb-2">Not sure which number to use?</h3>
                  <p className="text-sm text-gray-600 mb-4">BhuSetu Assistant can guide you through the search.</p>
                  <Button variant="ghost" size="sm" className="w-full border border-gray-200" onClick={() => navigate('/help')}>
                    Get Help
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}

          {/* RESULTS AREA */}
          <div className={cn("w-full", results === null ? "lg:w-2/3" : "lg:w-full")}>
            
            {results !== null && (
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* FILTERS SIDEBAR */}
                {results.length > 0 && (
                  <div className="w-full lg:w-1/4">
                    <div className="lg:hidden mb-4">
                      <Button variant="outline" className="w-full" onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
                        <Filter className="h-4 w-4 mr-2"/> Filters & Sort
                      </Button>
                    </div>
                    
                    <div className={cn("bg-white border border-gray-200 rounded-lg p-4", !showFiltersMobile && "hidden lg:block")}>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><Filter className="h-4 w-4 mr-2"/> Filters</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">State</label>
                          <select 
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border"
                            value={filters.state || ''}
                            onChange={(e) => setFilters({...filters, state: e.target.value})}
                          >
                            <option value="">All States</option>
                            {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Land Use</label>
                          <select 
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border"
                            value={filters.landUse || ''}
                            onChange={(e) => setFilters({...filters, landUse: e.target.value})}
                          >
                            <option value="">All Types</option>
                            {filterOptions.landUses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Sort By</label>
                          <select 
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                          >
                            <option value="relevance">Relevance</option>
                            <option value="area-asc">Area: Low to High</option>
                            <option value="area-desc">Area: High to Low</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => {setFilters({}); setSort('relevance');}}>
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESULTS LIST */}
                <div className={cn("w-full", results.length > 0 && "lg:w-3/4")}>
                  {results.length === 0 ? (
                    <EmptyState 
                      title="No land record found" 
                      description="Try searching with another identifier or check your spelling."
                      actionLabel="Try another search"
                      onAction={handleClear}
                    />
                  ) : (
                    <div>
                      <div className="mb-4 text-gray-600 text-sm">
                        Showing <span className="font-semibold text-gray-900">{results.length}</span> parcels matching your search
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden md:block bg-white shadow-sm ring-1 ring-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ULPIN / ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((record) => (
                              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-primary-700">{record.ulpin}</div>
                                  <div className="text-xs text-gray-500">Khasra: {record.khasraNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{record.ownerName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{record.village}</div>
                                  <div className="text-xs text-gray-500">{record.district}, {record.state}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{record.area} {record.areaUnit}</div>
                                  <div className="text-xs text-gray-500">{record.landUse}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={record.courtCaseStatus === 'Active' ? 'Under Case' : (record.encumbranceStatus !== 'Clear' ? 'Encumbered' : 'Record Available')} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                  <Link to={`/land/${record.id}`} className="text-primary-600 hover:text-primary-900">View Details</Link>
                                  <Link to={`/map?parcel=${record.id}`} className="text-gray-500 hover:text-gray-900">Map</Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-4">
                        {results.map((record) => (
                          <Card key={record.id} className="border-gray-200 shadow-sm">
                            <CardBody className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ULPIN</div>
                                  <div className="font-mono font-medium text-primary-700">{record.ulpin}</div>
                                </div>
                                <StatusBadge status={record.courtCaseStatus === 'Active' ? 'Under Case' : 'Clear'} />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <div>
                                  <span className="block text-gray-500 text-xs">Owner</span>
                                  <span className="font-medium text-gray-900">{record.ownerName}</span>
                                </div>
                                <div>
                                  <span className="block text-gray-500 text-xs">Location</span>
                                  <span className="text-gray-900">{record.village}, {record.state}</span>
                                </div>
                                <div>
                                  <span className="block text-gray-500 text-xs">Khasra / Survey</span>
                                  <span className="text-gray-900">{record.khasraNumber}</span>
                                </div>
                                <div>
                                  <span className="block text-gray-500 text-xs">Area</span>
                                  <span className="text-gray-900">{record.area} {record.areaUnit}</span>
                                </div>
                              </div>
                              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                                <Button className="flex-1" onClick={() => navigate(`/land/${record.id}`)}>View Details</Button>
                                <Button variant="outline" className="flex-1" onClick={() => navigate(`/map?parcel=${record.id}`)}>View Map</Button>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* NO SEARCH PERFORMED YET (Empty Space filler if needed, currently sidebar takes left) */}
            {results === null && (
               <div className="hidden lg:flex flex-col items-center justify-center h-full text-center text-gray-400 p-12 bg-white rounded-lg border border-dashed border-gray-200">
                 <SearchIcon className="h-12 w-12 mb-4 text-gray-300" />
                 <p>Enter a search query to find land records.</p>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-200 pt-8 pb-4">
        <p className="text-xs text-gray-400 text-center">
          Information shown in this prototype is based on sample data. In a production system, records would be retrieved from authorized source systems.
        </p>
      </div>
    </div>
  );
}
