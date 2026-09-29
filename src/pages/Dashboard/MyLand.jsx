import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Map, MapPin, Search, ChevronRight, FileText } from 'lucide-react';
import { getUserLandRecords } from '../../utils/userLand';
import Card, { CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

export default function MyLand() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    if (user) setParcels(getUserLandRecords(user.id));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Land Records</h1>
        <p className="mt-1 text-gray-600">View and manage the parcels linked to your profile.</p>
      </div>

      {parcels.length === 0 ? (
        <EmptyState 
          icon={Map}
          title="No linked land records"
          description="You do not have any land parcels linked to your identity profile in this demo."
        />
      ) : (
        <>
          {/* Mobile View: Stacked Cards */}
          <div className="md:hidden space-y-4">
            {parcels.map(p => (
              <Card key={p.id} className="overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-mono font-bold text-primary-700 text-sm">{p.ulpin}</span>
                  <Badge variant={p.hasActiveCase ? 'danger' : 'success'}>{p.hasActiveCase ? 'Court Case' : 'Clear'}</Badge>
                </div>
                <CardBody className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="block text-xs text-gray-500">Khata No.</span><span className="font-medium text-gray-900">{p.khataNumber}</span></div>
                    <div><span className="block text-xs text-gray-500">Khasra No.</span><span className="font-medium text-gray-900">{p.khasraNumber}</span></div>
                    <div><span className="block text-xs text-gray-500">Location</span><span className="font-medium text-gray-900">{p.village}</span></div>
                    <div><span className="block text-xs text-gray-500">Area</span><span className="font-medium text-gray-900">{p.area} {p.areaUnit}</span></div>
                  </div>
                  
                  {(p.hasActiveCase || p.projectAffected || p.encumbranceStatus !== 'Clear') && (
                    <div className="pt-2 border-t border-gray-100 flex gap-2 flex-wrap">
                      {p.hasActiveCase && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded">Legal Case</span>}
                      {p.projectAffected && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded">Project Impact</span>}
                      {p.encumbranceStatus !== 'Clear' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Encumbered</span>}
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/land/${p.id}`)}>Details</Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/map?parcel=${p.id}`)}>Map</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ULPIN</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khata / Khasra</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parcels.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-primary-600">{p.ulpin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.khataNumber} / {p.khasraNumber}</div>
                        <div className="text-xs text-gray-500">{p.landUse}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.village}</div>
                        <div className="text-xs text-gray-500">{p.district}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.area} {p.areaUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant={p.hasActiveCase ? 'danger' : 'success'}>{p.hasActiveCase ? 'Court Case' : 'Clear'}</Badge>
                          {p.projectAffected && <span className="text-[10px] font-medium bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">Project Impact</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/land/${p.id}`)}>Details</Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/map?parcel=${p.id}`)}>Map</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
