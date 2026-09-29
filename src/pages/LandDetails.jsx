import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { 
  ChevronRight, Share2, Printer, BookmarkPlus, Map as MapIcon, 
  Layers, Scale, FileText, AlertCircle, CheckCircle, Info, Bot,
  Download, Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Button from '../components/Button';
import Card, { CardBody, CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { getLandDetails } from '../utils/getLandDetails';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Map Bounds Helper
function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { padding: [20, 20] });
  }
  return null;
}

export default function LandDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const result = getLandDetails(id);
    setData(result);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary-50">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <EmptyState 
          title="Land parcel not found" 
          description="The requested parcel ID does not exist in our sample dataset."
          actionLabel="Back to Search"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ownership', label: 'Ownership & Records' },
    { id: 'zoning', label: 'Land Use & Zoning' },
    { id: 'legal', label: 'Legal Cases' },
    { id: 'registration', label: 'Registration' },
    { id: 'encumbrance', label: 'Encumbrance' },
    { id: 'tax', label: 'Tax & Valuation' },
    { id: 'infrastructure', label: 'Infrastructure & Projects' },
    { id: 'documents', label: 'Documents' },
  ];

  const mapCoordinates = data.geometry.coordinates[0].map(c => [c[1], c[0]]);

  return (
    <div className="min-h-screen bg-secondary-50 pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-gray-900">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/search" className="hover:text-gray-900">Search</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">Land Details</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                Land Parcel Details
                <Badge variant={data.courtCaseStatus === 'Active' ? 'danger' : 'success'}>
                  {data.courtCaseStatus === 'Active' ? 'Under Case' : 'Clear Title'}
                </Badge>
              </h1>
              <div className="mt-2 text-sm text-gray-600 flex flex-wrap items-center gap-4">
                <span><span className="font-semibold text-gray-900">ULPIN:</span> {data.ulpin}</span>
                <span><span className="font-semibold text-gray-900">Source:</span> {data.state} Revenue Dept</span>
                <span><span className="font-semibold text-gray-900">Updated:</span> Oct 2023</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <Button variant="outline" size="sm" className="flex-shrink-0"><Share2 className="h-4 w-4 mr-2"/> Share</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0"><Printer className="h-4 w-4 mr-2"/> Print</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0"><BookmarkPlus className="h-4 w-4 mr-2"/> Save</Button>
            </div>
          </div>
        </div>
      </div>

      {/* PUBLIC NOTICE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start text-sm text-blue-800">
          <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">Public Information</span>
            Some parcel information may be publicly discoverable without login. Protected personal or sensitive records require appropriate authorization. Prototype data is shown for demonstration.
          </div>
        </div>
      </div>

      {/* TOP SECTION: Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* MOBILE: Map comes first */}
          <div className="w-full lg:hidden h-[250px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <MapContainer center={mapCoordinates[0]} zoom={16} style={{ height: '100%', width: '100%', zIndex: 10 }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <Polygon positions={mapCoordinates} pathOptions={{ color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.4 }} />
              <ChangeView bounds={mapCoordinates} />
            </MapContainer>
          </div>

          {/* LEFT: Summary */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full">
              <CardHeader className="bg-gray-50 border-b-0 pb-0 pt-5">
                <h2 className="text-lg font-semibold text-gray-900">Parcel Summary</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Owner / Rights</div>
                    <div className="font-medium text-gray-900">{data.ownerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Khasra / Survey</div>
                    <div className="font-medium text-gray-900">{data.khasraNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Khata Number</div>
                    <div className="font-medium text-gray-900">{data.khataNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Area</div>
                    <div className="font-medium text-gray-900">{data.area} {data.areaUnit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Land Use</div>
                    <div className="font-medium text-gray-900">{data.landUse}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">State</div>
                    <div className="font-medium text-gray-900">{data.state}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</div>
                  <div className="font-medium text-gray-900">{data.village}, {data.tehsil}, {data.district}</div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* CENTER: Desktop Map */}
          <div className="hidden lg:block lg:w-1/3 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative group">
            <MapContainer center={mapCoordinates[0]} zoom={16} style={{ height: '100%', width: '100%', zIndex: 10, minHeight: '300px' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <Polygon positions={mapCoordinates} pathOptions={{ color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.4 }} />
              <ChangeView bounds={mapCoordinates} />
            </MapContainer>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" onClick={() => navigate(`/map?parcel=${data.id}`)} className="shadow-lg">
                View Full Map
              </Button>
            </div>
          </div>

          {/* RIGHT: Quick Info (Desktop only natively, stacked on mobile) */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Ownership Record Available</span>
              </div>
              <div className={cn("p-4 rounded-xl border shadow-sm flex items-center", data.courtCaseStatus === 'Active' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200')}>
                {data.courtCaseStatus === 'Active' ? (
                  <><AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" /><span className="text-sm font-medium text-red-900">Active Court Case</span></>
                ) : (
                  <><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-sm font-medium text-gray-900">No Sample Court Cases</span></>
                )}
              </div>
              <div className={cn("p-4 rounded-xl border shadow-sm flex items-center", data.encumbranceStatus !== 'Clear' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200')}>
                {data.encumbranceStatus !== 'Clear' ? (
                  <><AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" /><span className="text-sm font-medium text-yellow-800">Encumbrance Found</span></>
                ) : (
                  <><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-sm font-medium text-gray-900">No Sample Mortgage</span></>
                )}
              </div>
              {data.projects.length > 0 && (
                <div className="bg-orange-50 border-orange-200 p-4 rounded-xl shadow-sm flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium text-orange-900">Project Impact: {data.projects[0].name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS & CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                  activeTab === tab.id 
                    ? "border-primary-600 text-primary-700 bg-gray-50" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm p-6 min-h-[400px]">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">ULPIN</span><span className="font-medium text-gray-900">{data.ulpin}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Parcel ID</span><span className="font-medium text-gray-900">{data.id}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Khata Number</span><span className="font-medium text-gray-900">{data.khataNumber}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Khasra / Survey Number</span><span className="font-medium text-gray-900">{data.khasraNumber}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Area</span><span className="font-medium text-gray-900">{data.area} {data.areaUnit}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Location</span><span className="font-medium text-gray-900">{data.village}, {data.district}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Land Use</span><span className="font-medium text-gray-900">{data.landUse}</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Land Classification</span><span className="font-medium text-gray-900">General</span></div>
                  <div><span className="block text-xs text-gray-500 uppercase tracking-wide">Record Update Date</span><span className="font-medium text-gray-900">2023-10-15</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Record Sources</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block">
                  <div className="text-sm"><span className="font-semibold text-gray-700">Source:</span> {data.state} Sample Land Dataset</div>
                  <div className="text-sm mt-1"><span className="font-semibold text-gray-700">Status:</span> Prototype Data</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OWNERSHIP */}
          {activeTab === 'ownership' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Sample / Demo Record - Do not use for legal verification.</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Current Ownership</h3>
                  <div className="space-y-4">
                    <div><span className="block text-xs text-gray-500 uppercase">Rights Holder</span><span className="font-medium text-gray-900">{data.ownerName}</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Ownership Status</span><span className="font-medium text-gray-900">Sole Owner (Sample)</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Record of Rights Reference</span><span className="font-medium text-gray-900">{data.ownershipReference}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Mutation & Registration</h3>
                  <div className="space-y-4">
                    <div><span className="block text-xs text-gray-500 uppercase">Mutation Status</span>
                      <Badge variant={data.mutationStatus === 'Completed' ? 'success' : 'warning'}>{data.mutationStatus}</Badge>
                    </div>
                    <div><span className="block text-xs text-gray-500 uppercase">Mutation Date</span><span className="font-medium text-gray-900">2021-04-12 (Mock)</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Registration Status</span><span className="font-medium text-gray-900">{data.registrationStatus}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ZONING */}
          {activeTab === 'zoning' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Zoning & Usage Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div><span className="block text-xs text-gray-500 uppercase">Current Land Use</span><span className="font-medium text-gray-900">{data.landUse}</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Land Classification</span><span className="font-medium text-gray-900">Standard</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Zoning</span><span className="font-medium text-gray-900">{data.zoning}</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Master Plan Zone</span><span className="font-medium text-gray-900">Zone A (Sample)</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Permitted Use</span><span className="font-medium text-gray-900">{data.landUse} Only</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Restrictions</span><span className="font-medium text-gray-900">{data.restrictions}</span></div>
              </div>
            </div>
          )}

          {/* TAB: LEGAL CASES */}
          {activeTab === 'legal' && (
            <div className="animate-in fade-in duration-300">
              {data.cases.length > 0 ? (
                <div className="space-y-8">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex">
                      <Scale className="h-6 w-6 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-red-800 font-bold text-lg">Active Court Case</h3>
                        <p className="text-red-700 text-sm mt-1">This parcel is currently subject to legal proceedings.</p>
                      </div>
                    </div>
                  </div>
                  
                  {data.cases.map((c) => (
                    <div key={c.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Case Number</div>
                          <div className="font-medium text-gray-900">{c.caseNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Court</div>
                          <div className="font-medium text-gray-900">{c.court}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Case Type</div>
                          <div className="font-medium text-gray-900">{c.type}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                          <Badge variant="danger">{c.status}</Badge>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</div>
                          <div className="text-sm text-gray-700">{c.description}</div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Case Timeline</h4>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center text-sm text-gray-600 overflow-x-auto pb-4">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 mb-2">1</div>
                            <span className="whitespace-nowrap">Filed ({c.filingDate})</span>
                          </div>
                          <div className="hidden md:block h-px w-8 bg-gray-300 mt-[-24px]"></div>
                          <div className="md:hidden w-px h-6 bg-gray-300 ml-4"></div>
                          
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 mb-2">2</div>
                            <span className="whitespace-nowrap">Notice Issued</span>
                          </div>
                          <div className="hidden md:block h-px w-8 bg-gray-300 mt-[-24px]"></div>
                          <div className="md:hidden w-px h-6 bg-gray-300 ml-4"></div>

                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 border-2 border-primary-500 flex items-center justify-center font-bold mb-2">3</div>
                            <span className="whitespace-nowrap font-medium text-gray-900">Current Status</span>
                          </div>
                          <div className="hidden md:block h-px w-8 bg-gray-300 mt-[-24px]"></div>
                          <div className="md:hidden w-px h-6 bg-gray-300 ml-4"></div>

                          <div className="flex flex-col items-center opacity-50">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-bold mb-2">4</div>
                            <span className="whitespace-nowrap">Next Hearing ({c.nextHearing})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline">View Case Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={CheckCircle}
                  title="No active court case found" 
                  description="No active court case found in the sample dataset for this parcel."
                />
              )}
            </div>
          )}

          {/* TAB: REGISTRATION */}
          {activeTab === 'registration' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Registration Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div><span className="block text-xs text-gray-500 uppercase">Registration Status</span><Badge variant={data.registrationStatus === 'Registered' ? 'success' : 'default'}>{data.registrationStatus}</Badge></div>
                <div><span className="block text-xs text-gray-500 uppercase">Registration Ref</span><span className="font-medium text-gray-900">REG/2015/8821 (Mock)</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Registration Date</span><span className="font-medium text-gray-900">2015-08-20</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Transaction Status</span><span className="font-medium text-gray-900">Completed</span></div>
                <div><span className="block text-xs text-gray-500 uppercase">Mutation Status</span><span className="font-medium text-gray-900">{data.mutationStatus}</span></div>
              </div>
            </div>
          )}

          {/* TAB: ENCUMBRANCE */}
          {activeTab === 'encumbrance' && (
            <div className="animate-in fade-in duration-300">
              {data.encumbranceStatus !== 'Clear' ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                      <h3 className="text-yellow-800 font-bold text-lg">Active Encumbrance</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 p-6 rounded-lg bg-gray-50">
                     <div><span className="block text-xs text-gray-500 uppercase mb-1">Encumbrance Details</span><span className="font-medium text-gray-900">{data.encumbranceStatus}</span></div>
                     <div><span className="block text-xs text-gray-500 uppercase mb-1">Number of Active Records</span><span className="font-medium text-gray-900">1</span></div>
                     <div className="md:col-span-2"><span className="block text-xs text-gray-500 uppercase mb-1">Reference Information</span><span className="text-sm text-gray-700">Bank loan registered against property title. Requires NOC for transfer.</span></div>
                  </div>
                </div>
              ) : (
                <EmptyState 
                  icon={CheckCircle}
                  title="No sample encumbrance record" 
                  description="No mortgage or encumbrance records found for this parcel in the prototype data."
                />
              )}
            </div>
          )}

          {/* TAB: TAX & VALUATION */}
          {activeTab === 'tax' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Property Tax</h3>
                  <div className="space-y-4">
                    <div><span className="block text-xs text-gray-500 uppercase">Tax Status</span><Badge variant={data.propertyTaxStatus === 'Paid' ? 'success' : 'danger'}>{data.propertyTaxStatus}</Badge></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Assessment Year</span><span className="font-medium text-gray-900">2023-2024</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Amount</span><span className="font-medium text-gray-900">₹4,500</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                    Valuation 
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">Reference / Preliminary Estimate</span>
                  </h3>
                  <div className="space-y-4">
                    <div><span className="block text-xs text-gray-500 uppercase">Estimated Parcel Value</span><span className="font-semibold text-xl text-primary-700">{data.valuationReference}</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Reference Rate</span><span className="font-medium text-gray-900">Govt. Circle Rate (Mock)</span></div>
                    <div><span className="block text-xs text-gray-500 uppercase">Reference Date</span><span className="font-medium text-gray-900">Jan 2023</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INFRASTRUCTURE & PROJECTS */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {data.projects.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 text-red-700">Project Impact</h3>
                  {data.projects.map(p => (
                    <div key={p.id} className="border border-red-200 bg-red-50 p-6 rounded-lg mb-4">
                       <h4 className="font-bold text-red-900 text-lg mb-1">{p.name}</h4>
                       <div className="text-sm text-red-800 mb-4">{p.type} - {p.status}</div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                         <div><span className="block text-xs text-red-700 uppercase">Total Area</span><span className="font-medium">{data.area} {data.areaUnit}</span></div>
                         <div><span className="block text-xs text-red-700 uppercase">Affected Area</span><span className="font-medium font-bold">{(data.area * 0.32).toFixed(2)} {data.areaUnit}</span></div>
                         <div><span className="block text-xs text-red-700 uppercase">Affected %</span><span className="font-medium font-bold">32%</span></div>
                         <div><span className="block text-xs text-red-700 uppercase">Remaining</span><span className="font-medium">{(data.area * 0.68).toFixed(2)} {data.areaUnit}</span></div>
                       </div>
                       
                       <div className="mb-6">
                         <div className="flex h-4 rounded-full overflow-hidden bg-green-200">
                           <div className="bg-red-500 h-full" style={{ width: '32%' }} title="Affected"></div>
                           <div className="bg-green-500 h-full" style={{ width: '68%' }} title="Remaining"></div>
                         </div>
                         <div className="flex justify-between text-xs mt-1 text-gray-600">
                           <span>Affected (32%)</span>
                           <span>Remaining (68%)</span>
                         </div>
                       </div>
                       
                       <Button size="sm" variant="danger">View Impact on Map</Button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Nearby Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-900">{data.nearbyInfrastructure}</span>
                    <span className="text-primary-600 text-sm flex items-center">View <ChevronRight className="h-4 w-4 ml-1"/></span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-900">Primary School — 1.2 km</span>
                    <span className="text-primary-600 text-sm flex items-center">View <ChevronRight className="h-4 w-4 ml-1"/></span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-900">District Hospital — 4.5 km</span>
                    <span className="text-primary-600 text-sm flex items-center">View <ChevronRight className="h-4 w-4 ml-1"/></span>
                  </div>
                </div>
              </div>
              
              {data.projects.length === 0 && (
                <div className="mt-8">
                  <p className="text-gray-500 text-sm italic">No active project impact found in the sample dataset.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="animate-in fade-in duration-300">
              {data.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.documents.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50">
                      <div className="flex items-start">
                        <FileText className="h-8 w-8 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900">{doc.type}</h4>
                          <div className="text-xs text-gray-500 mt-1">Uploaded: {doc.uploadDate}</div>
                          <Badge variant="success" className="mt-2">{doc.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1"/> View</Button>
                        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1"/> DL</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={FileText}
                  title="No documents available" 
                  description="No sample documents are associated with this parcel."
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* AI HELP FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => navigate('/help')}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center group"
          title="Need help understanding this land record?"
        >
          <Bot className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 font-medium">
            Ask BhuSetu Assistant
          </span>
        </button>
      </div>

    </div>
  );
}
