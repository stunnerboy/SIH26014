import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Map, FileText, Scale, Bell, AlertCircle, ChevronRight, 
  MapPin, ShieldAlert
} from 'lucide-react';
import { getUserStats, getUserLandRecords } from '../../utils/userLand';
import Card, { CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function Overview() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    if (user) {
      setStats(getUserStats(user.id));
      setParcels(getUserLandRecords(user.id));
    }
  }, [user]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-gray-600">View your linked land records and land-related services.</p>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start text-sm text-blue-800">
        <ShieldAlert className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-1">Demo data for SIH prototype</span>
          You are logged in as a demo user. Identity verification is not implemented in this prototype. Do not submit real personal information.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-l-4 border-primary-500">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs sm:text-sm font-medium uppercase">Total Parcels</span>
              <Map className="h-5 w-5 text-primary-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalParcels}</div>
          </CardBody>
        </Card>
        
        <Card className="bg-white border-l-4 border-green-500">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs sm:text-sm font-medium uppercase">Total Area</span>
              <MapPin className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalArea} <span className="text-sm font-medium text-gray-500">{stats.areaUnit}</span></div>
          </CardBody>
        </Card>

        <Card className="bg-white border-l-4 border-red-500">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs sm:text-sm font-medium uppercase">Court Cases</span>
              <Scale className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.activeCourtCases}</div>
          </CardBody>
        </Card>

        <Card className="bg-white border-l-4 border-blue-500">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs sm:text-sm font-medium uppercase">Applications</span>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pendingApplications}</div>
          </CardBody>
        </Card>
      </div>

      {/* Alerts / Action Required */}
      {(stats.activeCourtCases > 0 || stats.projectImpacts > 0) && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Attention Required</h2>
          <div className="space-y-4">
            
            {stats.activeCourtCases > 0 && parcels.filter(p => p.hasActiveCase).map(p => (
              <div key={`case-${p.id}`} className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900">Active Court Case</h3>
                    <p className="text-sm text-red-800 mt-1">One of your linked parcels ({p.ulpin}) has an active legal case.</p>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => navigate(`/land/${p.id}`)} className="whitespace-nowrap">View Parcel</Button>
              </div>
            ))}

            {stats.projectImpacts > 0 && parcels.filter(p => p.projectAffected).map(p => (
              <div key={`proj-${p.id}`} className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-orange-900">Project Impact Detected</h3>
                    <p className="text-sm text-orange-800 mt-1">
                      {p.projectAffected.name}. Affected area: {(p.area * 0.32).toFixed(2)} {p.areaUnit}. Remaining: {(p.area * 0.68).toFixed(2)} {p.areaUnit}.
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-transparent whitespace-nowrap" onClick={() => navigate(`/land/${p.id}`)}>View Impact</Button>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Profile Snapshot */}
        <Card>
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h3 className="font-bold text-gray-900 flex items-center"><User className="h-5 w-5 mr-2 text-gray-400" /> Demo Profile</h3>
          </div>
          <CardBody className="p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">User ID</span>
                <span className="font-medium text-gray-900">{user.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">State</span>
                <span className="font-medium text-gray-900">{user.state}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Linked Parcels</span>
                <span className="font-medium text-gray-900">{stats.totalParcels}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h3 className="font-bold text-gray-900 flex items-center"><MapPin className="h-5 w-5 mr-2 text-gray-400" /> Quick Actions</h3>
          </div>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              <button onClick={() => navigate('/dashboard/my-land')} className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center"><Map className="h-5 w-5 text-primary-500 mr-3" /> <span className="font-medium text-gray-900 text-sm">View My Land Records</span></div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button onClick={() => navigate('/dashboard/applications')} className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center"><FileText className="h-5 w-5 text-blue-500 mr-3" /> <span className="font-medium text-gray-900 text-sm">Track Applications</span></div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button onClick={() => navigate('/map')} className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center"><MapPin className="h-5 w-5 text-green-500 mr-3" /> <span className="font-medium text-gray-900 text-sm">Explore Map</span></div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

    </div>
  );
}
