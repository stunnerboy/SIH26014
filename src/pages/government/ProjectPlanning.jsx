import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, ArrowRight, Info } from 'lucide-react';
import Card, { CardBody } from '../../components/Card';

const PROJECT_TYPES = ['Highway', 'Railway', 'Canal', 'Pipeline', 'Utility', 'Other'];
const CORRIDOR_WIDTHS = ['10', '20', '30', '50', '100'];

export default function ProjectPlanning() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: 'Highway',
    projectId: '',
    description: '',
    corridorWidth: '30'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStart = () => {
    const params = new URLSearchParams({
      name: form.name || 'Custom Project',
      type: form.type,
      projectId: form.projectId || `PROJ-${Date.now()}`,
      corridorWidth: form.corridorWidth
    });
    navigate(`/government/impact?${params.toString()}`);
  };

  const handleOpenDemo = () => {
    navigate('/government/impact?demo=true');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Infrastructure Project</h1>
        <p className="mt-1 text-sm text-gray-500">Define a new project to analyse land parcel impacts.</p>
      </div>

      {/* Demo shortcut */}
      <Card className="bg-primary-50 border-primary-200">
        <CardBody className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-primary-900 flex items-center gap-2"><FolderOpen className="h-5 w-5" /> Use Ready Demo</h2>
            <p className="text-sm text-primary-800 mt-1">Lucknow Ring Road — Highway, 30m corridor, preconfigured route with affected parcels.</p>
          </div>
          <button
            onClick={handleOpenDemo}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
          >
            Open Demo <ArrowRight className="h-4 w-4" />
          </button>
        </CardBody>
      </Card>

      {/* Form */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="font-bold text-gray-900">New Project Details</h2>
        </div>
        <CardBody className="p-6 space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Lucknow Ring Road"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project ID</label>
              <input
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                placeholder="e.g. PWD-2024-001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Corridor Width (m)</label>
              <select
                name="corridorWidth"
                value={form.corridorWidth}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {CORRIDOR_WIDTHS.map(w => <option key={w} value={w}>{w} m</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of the project..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleStart}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              Start Planning <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>After starting, you will be able to draw the project route on the GIS map and generate corridor impact analysis.</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
