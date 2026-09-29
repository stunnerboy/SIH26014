import { landRecords } from '../data/landRecords';
import { courtCases } from '../data/courtCases';
import { projects } from '../data/projects';

export const getAllParcels = () => {
  return landRecords.map(record => {
    const hasCase = courtCases.some(c => c.landId === record.id && c.status === 'Active');
    const project = projects.find(p => p.affectedParcels.includes(record.id));
    
    return {
      ...record,
      hasActiveCase: hasCase,
      projectAffected: project ? project : null
    };
  });
};

export const getParcelById = (id) => {
  const parcels = getAllParcels();
  return parcels.find(p => p.id === id) || null;
};

export const filterMapParcels = (parcels, filters) => {
  return parcels.filter(p => {
    if (filters.landUse && filters.landUse !== 'All' && p.landUse !== filters.landUse) return false;
    if (filters.projectAffected && !p.projectAffected) return false;
    if (filters.courtCase && !p.hasActiveCase) return false;
    if (filters.encumbrance && p.encumbranceStatus === 'Clear') return false;
    return true;
  });
};
