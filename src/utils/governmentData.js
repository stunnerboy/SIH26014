import { landRecords } from '../data/landRecords';
import { courtCases } from '../data/courtCases';
import { projects } from '../data/projects';

// Mock reference rates per areaUnit in INR
const REFERENCE_RATES = {
  Hectares: 1840000,  // ₹18.4L per Hectare
  Acres: 740000       // ₹7.4L per Acre
};

// Demo preconfigured route for Lucknow Ring Road project
// Using coordinates near existing parcels (Maharashtra region) for demo
export const DEMO_PROJECT = {
  id: 'govt-demo-001',
  name: 'Lucknow Ring Road',
  type: 'Highway',
  corridorWidth: 30, // meters
  description: 'Proposed ring road project for urban connectivity improvement.',
  route: [
    [73.977, 18.578],
    [73.981, 18.578],
    [73.983, 18.582],
    [73.981, 18.583],
    [73.977, 18.582]
  ]
};

export const getGovernanceStats = () => {
  const total = landRecords.length;
  const totalArea = landRecords.reduce((sum, r) => sum + r.area, 0);
  
  const activeCases = courtCases.filter(c => c.status === 'Active').length;
  
  const encumberedParcels = landRecords.filter(
    r => r.encumbranceStatus && r.encumbranceStatus !== 'Clear'
  ).length;
  
  // Parcels referenced in any project
  const affectedParcelIds = new Set(projects.flatMap(p => p.affectedParcels));
  const projectAffected = affectedParcelIds.size;

  return {
    totalParcels: total,
    totalArea: totalArea.toFixed(2),
    projectAffectedParcels: projectAffected,
    activeCourtCases: activeCases,
    encumberedParcels
  };
};

export const getRecentActivity = () => [
  { id: 1, date: '2024-01-12', action: 'Proposed highway corridor mapped', type: 'project', icon: 'road' },
  { id: 2, date: '2024-01-10', action: 'Railway expansion route reviewed', type: 'project', icon: 'train' },
  { id: 3, date: '2024-01-08', action: 'Land-use planning update for Pune district', type: 'update', icon: 'map' },
  { id: 4, date: '2024-01-05', action: 'Parcel data batch updated (land-001 to land-005)', type: 'data', icon: 'file' },
  { id: 5, date: '2024-01-03', action: 'New encumbrance record flagged for land-003', type: 'alert', icon: 'alert' }
];
