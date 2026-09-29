import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Scale, AlertCircle, FolderOpen, CheckCircle, Clock, FileText, Layers } from 'lucide-react';
import Card, { CardBody } from '../../components/Card';
import Badge from '../../components/Badge';
import { getGovernanceStats, getRecentActivity } from '../../utils/governmentData';

const ACTIVITY_ICONS = { project: FolderOpen, update: FileText, data: Layers, alert: AlertCircle };

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    setStats(getGovernanceStats());
    setActivity(getRecentActivity());
  }, []);

  if (!stats) return null;

  const statCards = [
    { label: 'Total Parcels', value: stats.totalParcels, color: 'border-blue-500', icon: Map, iconColor: 'text-blue-500' },
    { label: 'Total Land Area', value: `${stats.totalArea}`, sub: 'Acres/Ha', color: 'border-green-500', icon: CheckCircle, iconColor: 'text-green-500' },
    { label: 'Project Affected', value: stats.projectAffectedParcels, color: 'border-orange-500', icon: AlertCircle, iconColor: 'text-orange-500' },
    { label: 'Active Court Cases', value: stats.activeCourtCases, color: 'border-red-500', icon: Scale, iconColor: 'text-red-500' },
    { label: 'Encumbered Parcels', value: stats.encumberedParcels, color: 'border-yellow-500', icon: AlertCircle, iconColor: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Land Governance & Planning Dashboard</h1>
        <p className="mt-1 text-gray-500 text-sm">Prototype — Sample data only. Not official government data.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(s => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.iconColor} flex-shrink-0`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              {s.sub && <div className="text-xs text-gray-400 mt-1">{s.sub}</div>}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Demo Project CTA */}
        <Card className="bg-primary-50 border-primary-200">
          <CardBody className="p-6">
            <h2 className="text-lg font-bold text-primary-900 mb-1 flex items-center gap-2">
              <FolderOpen className="h-5 w-5" /> Demo Project Ready
            </h2>
            <p className="text-sm text-primary-800 mb-4">
              <strong>Lucknow Ring Road</strong> — Highway project with preconfigured route, corridor and affected parcel analysis. Open to see a full demo instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/government/impact?demo=true')}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors"
              >
                Open Demo Project
              </button>
              <button
                onClick={() => navigate('/government/project-planning')}
                className="flex-1 bg-white hover:bg-gray-50 text-primary-700 font-semibold text-sm py-2.5 px-4 rounded-lg border border-primary-300 transition-colors"
              >
                Create New Project
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <h2 className="text-base font-bold text-gray-900">Recent Planning Activity</h2>
          </div>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-50">
              {activity.slice(0, 4).map(a => {
                const Icon = ACTIVITY_ICONS[a.type] || FileText;
                return (
                  <div key={a.id} className="flex items-center px-4 py-3 gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{a.action}</p>
                      <p className="text-xs text-gray-400">{a.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Navigate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Project Planning', desc: 'Create and manage infrastructure projects', path: '/government/project-planning', icon: FolderOpen },
          { label: 'Impact Analysis', desc: 'Corridor detection and parcel impact', path: '/government/impact', icon: Map },
          { label: 'Reports', desc: 'Generate project impact assessment reports', path: '/government/reports', icon: FileText },
        ].map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <item.icon className="h-6 w-6 text-primary-600 mb-3" />
            <div className="font-semibold text-gray-900 group-hover:text-primary-700 text-sm">{item.label}</div>
            <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
          </button>
        ))}
      </div>

    </div>
  );
}
