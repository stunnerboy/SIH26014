import { landRecords } from '../data/landRecords';
import { courtCases } from '../data/courtCases';
import { documents } from '../data/documents';
import { projects } from '../data/projects';

export const getLandDetails = (id) => {
  const parcel = landRecords.find(r => r.id === id);
  if (!parcel) return null;

  const parcelCases = courtCases.filter(c => c.landId === id);
  const parcelDocs = documents.filter(d => d.landId === id);
  const parcelProjects = projects.filter(p => p.affectedParcels.includes(id));

  return {
    ...parcel,
    cases: parcelCases,
    documents: parcelDocs,
    projects: parcelProjects
  };
};
