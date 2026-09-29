import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { 
  Search, Map as MapIcon, FileText, Scale, Settings, Activity, 
  User, Users, Briefcase, Landmark, Check, ArrowRight, Bot, Layers,
  FileBadge, RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Button from '../components/Button';
import Card from '../components/Card';
import { landRecords } from '../data/landRecords';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper components
const SectionHeading = ({ title, subtitle, center = false }) => (
  <div className={cn("mb-12", center && "text-center")}>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  
  // Search State
  const searchTabs = [
    { id: 'ulpin', label: 'ULPIN', placeholder: 'Enter 14-digit ULPIN', example: 'MH12345678901234' },
    { id: 'khata', label: 'Khata Number', placeholder: 'Enter Khata Number', example: '452' },
    { id: 'khasra', label: 'Khasra / Survey No.', placeholder: 'Enter Khasra / Survey Number', example: '12A/1' },
    { id: 'owner', label: 'Owner Name', placeholder: 'Enter Owner Name', example: 'Ramesh Kumar' },
    { id: 'location', label: 'Location', placeholder: 'Enter village, district or location', example: 'Wagholi, Pune' }
  ];
  const [activeTab, setActiveTab] = useState(searchTabs[0]);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue) {
      navigate(`/search?type=${activeTab.id}&q=${encodeURIComponent(searchValue)}`);
    }
  };

  // Extract coordinates for map preview
  const mapCenter = [18.580, 73.980]; // Near Pune parcels

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative bg-white overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6">
                National Public Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Land Information,<br/>
                <span className="text-primary-700">Simplified for Everyone</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                Search land records, explore parcels, understand land information and access services through one unified platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => {
                  document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
                }}>
                  Search Land
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/map')}>
                  Explore Map
                </Button>
              </div>
            </div>
            
            {/* GIS Visualization on Right */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hidden md:block">
              {/* Simulated Map Background */}
              <MapContainer 
                center={mapCenter} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                {landRecords.slice(0,2).map(record => (
                  <Polygon 
                    key={record.id}
                    positions={record.geometry.coordinates[0].map(c => [c[1], c[0]])}
                    pathOptions={{ color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.4 }}
                  >
                    <Popup>
                      <div className="font-semibold text-sm">{record.ownerName}</div>
                      <div className="text-xs text-gray-500">ULPIN: {record.ulpin}</div>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>
              
              {/* Floating Cards */}
              <div className="absolute top-6 left-6 bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-[400] max-w-[200px] animate-bounce" style={{animationDuration: '3s'}}>
                <div className="text-xs font-semibold text-gray-500 uppercase">Selected Parcel</div>
                <div className="font-bold text-primary-700 mt-1">Survey No: 12A/1</div>
                <div className="text-xs text-gray-600 mt-1">Area: 2.5 Hectares</div>
              </div>
              <div className="absolute bottom-10 right-6 bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-[400] max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="h-4 w-4 text-green-500"/>
                  <span className="text-xs font-semibold text-gray-700">Clear Title</span>
                </div>
                <div className="text-xs text-gray-500">No active encumbrances found.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH SECTION (Primary Action) */}
      <section id="search-section" className="py-16 bg-secondary-50 relative -mt-8 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl p-2 md:p-4">
            <div className="p-4 md:p-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Search Land Records</h2>
              <p className="text-gray-600 mb-8">Search using any available land reference.</p>
              
              {/* Tabs */}
              <div className="flex overflow-x-auto pb-2 mb-6 border-b border-gray-200 hide-scrollbar scroll-smooth snap-x">
                <div className="flex space-x-6 min-w-max px-2 mx-auto">
                  {searchTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab); setSearchValue(''); }}
                      className={cn(
                        "pb-4 font-medium text-sm md:text-base snap-center transition-colors relative whitespace-nowrap",
                        activeTab.id === tab.id ? "text-primary-700" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab.label}
                      {activeTab.id === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={activeTab.placeholder}
                      className="block w-full rounded-lg border-gray-300 py-3.5 pl-11 pr-4 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base border outline-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="px-8 whitespace-nowrap">
                    Search
                  </Button>
                </div>
                
                {/* Example Links */}
                <div className="mt-4 text-sm text-gray-500 text-left md:text-center">
                  <span className="mr-2">Example:</span>
                  <button 
                    type="button" 
                    onClick={() => setSearchValue(activeTab.example)}
                    className="text-primary-600 hover:text-primary-800 hover:underline font-medium"
                  >
                    {activeTab.example}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-sm text-gray-500 pt-6 border-t border-gray-100">
                Don't have ULPIN? Search using Khata, Khasra, Owner Name or Location.
                <br/>
                <Link to="/search" className="text-primary-600 hover:underline inline-flex items-center mt-2 font-medium">
                  Advanced Search <ArrowRight className="h-4 w-4 ml-1"/>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. FEATURE SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Everything in One Place" 
            subtitle="Access comprehensive land information through our integrated modules."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search Land", desc: "Find land information using multiple search options." },
              { icon: MapIcon, title: "Explore Map", desc: "Explore parcels and nearby land-related information." },
              { icon: Layers, title: "Land Details", desc: "View available ownership, land use, legal and planning information." },
              { icon: Scale, title: "Legal & Court Cases", desc: "Check available legal case and encumbrance information." },
              { icon: Settings, title: "Apply for Services", desc: "Submit and track land-related service requests." },
              { icon: Activity, title: "Project Impact", desc: "Understand how proposed infrastructure projects may affect parcels." }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-700 mb-5">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHO CAN USE BHUSETU */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Who is BhuSetu for?" 
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: User, title: "Citizens", desc: "Search and understand land information." },
              { icon: Users, title: "Farmers", desc: "View and manage linked land records." },
              { icon: Briefcase, title: "Businesses & Professionals", desc: "Access authorized land information for due diligence." },
              { icon: Landmark, title: "Government", desc: "Use GIS-based land information for planning and governance." }
            ].map((user, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="inline-flex h-16 w-16 bg-gray-50 rounded-full items-center justify-center text-gray-600 mb-4">
                  <user.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{user.title}</h3>
                <p className="text-sm text-gray-600">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="How it Works" center />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2" />
            
            {[
              { num: 1, title: "Search", desc: "Enter details" },
              { num: 2, title: "Select Parcel", desc: "Verify location" },
              { num: 3, title: "Explore Information", desc: "View details" },
              { num: 4, title: "Use Services", desc: "Apply or pay" }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center bg-white z-10 px-4 w-full md:w-auto">
                <div className="h-12 w-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-md mb-4 border-4 border-white">
                  {step.num}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PUBLIC ACCESS SECTION */}
      <section className="py-16 md:py-24 bg-primary-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Abstract pattern background could go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold mb-6">Basic land discovery does not require login.</h2>
              <ul className="space-y-4">
                {['ULPIN search', 'Khata search', 'Khasra/Survey search', 'Owner name search', 'Location search', 'Map-based discovery'].map((item, i) => (
                  <li key={i} className="flex items-center text-primary-100">
                    <Check className="h-6 w-6 text-primary-400 mr-3 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-800 rounded-2xl p-8 border border-primary-700">
              <h3 className="text-2xl font-semibold mb-6">Login is required only for personalized or protected services.</h3>
              <ul className="space-y-4">
                {['My Land Dashboard', 'Service Applications', 'Notifications & Alerts', 'Saved Parcels'].map((item, i) => (
                  <li key={i} className="flex items-center text-primary-100">
                    <div className="h-2 w-2 bg-primary-400 rounded-full mr-4 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-primary-700">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
                  Login or Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MAP PREVIEW SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Interactive Map Preview" 
            subtitle="Visually navigate parcels and surrounding infrastructure."
          />
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50 relative h-[500px]">
             <MapContainer 
                center={mapCenter} 
                zoom={14} 
                style={{ height: '100%', width: '100%', zIndex: 10 }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                {landRecords.map(record => (
                  <Polygon 
                    key={record.id}
                    positions={record.geometry.coordinates[0].map(c => [c[1], c[0]])}
                    pathOptions={{ 
                      color: record.courtCaseStatus === 'Active' ? '#dc2626' : '#15803d', 
                      fillColor: record.courtCaseStatus === 'Active' ? '#ef4444' : '#22c55e', 
                      fillOpacity: 0.5 
                    }}
                  >
                    <Popup>
                      <div className="font-semibold">{record.ownerName}</div>
                      <div className="text-xs text-gray-500 mb-1">{record.village}, {record.district}</div>
                      <div className="text-xs font-mono bg-gray-100 px-1 rounded inline-block">{record.ulpin}</div>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>
              {/* Map UI overlay */}
              <div className="absolute top-4 left-4 z-[400] bg-white rounded-md shadow-md p-2">
                <h4 className="text-sm font-semibold mb-1">Legend</h4>
                <div className="flex items-center text-xs mb-1"><div className="w-3 h-3 bg-green-500 mr-2 rounded-sm border border-green-700"/> Clear Parcel</div>
                <div className="flex items-center text-xs"><div className="w-3 h-3 bg-red-500 mr-2 rounded-sm border border-red-700"/> Active Dispute</div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400]">
                <Button onClick={() => navigate('/map')} className="shadow-xl">
                  Explore Full Map <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
          </div>
        </div>
      </section>

      {/* 8. SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Common Services</h2>
              <p className="text-gray-600">Access official land registry services online.</p>
            </div>
            <Link to="/services" className="hidden md:inline-flex text-primary-600 hover:text-primary-800 font-medium items-center">
              View All Services <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: RefreshCw, title: "Mutation / Record Update", desc: "Request change in ownership." },
              { icon: FileText, title: "Record Correction", desc: "Fix errors in area, name, etc." },
              { icon: FileBadge, title: "Ownership Certificate", desc: "Download verified certificate." },
              { icon: Layers, title: "Land Documents", desc: "Get copies of sale deeds." }
            ].map((srv, idx) => (
              <Card key={idx} className="p-6 hover:border-primary-300 transition-colors cursor-pointer group" onClick={() => navigate('/services')}>
                <srv.icon className="h-8 w-8 text-primary-600 mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="font-semibold text-gray-900 mb-1">{srv.title}</h3>
                <p className="text-sm text-gray-500">{srv.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link to="/services" className="inline-flex text-primary-600 hover:text-primary-800 font-medium items-center">
              View All Services <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. AI HELP SECTION */}
      <section className="py-12 bg-primary-50 border-t border-primary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bot className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Need help understanding BhuSetu?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Ask our assistant how to search land, understand records or use a service.
          </p>
          <Button size="lg" onClick={() => navigate('/help')}>
            Ask BhuSetu Assistant
          </Button>
        </div>
      </section>
      
    </div>
  );
}
