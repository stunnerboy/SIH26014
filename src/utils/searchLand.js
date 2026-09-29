import { landRecords } from '../data/landRecords';

export const searchLand = (type, query, filters = null, sort = 'relevance') => {
  if (!query && type !== 'location') return [];
  if (type === 'location' && (!query || Object.values(query).every(v => !v))) return [];

  let results = landRecords.filter(record => {
    // 1. Basic Search match
    let isMatch = false;
    if (type === 'ulpin') {
      isMatch = record.ulpin.toLowerCase().includes(query.toLowerCase());
    } else if (type === 'khata') {
      isMatch = record.khataNumber.toLowerCase().includes(query.toLowerCase());
    } else if (type === 'khasra') {
      isMatch = record.khasraNumber.toLowerCase().includes(query.toLowerCase());
    } else if (type === 'owner') {
      isMatch = record.ownerName.toLowerCase().includes(query.toLowerCase());
    } else if (type === 'location') {
      isMatch = true;
      if (query.state && !record.state.toLowerCase().includes(query.state.toLowerCase())) isMatch = false;
      if (query.district && !record.district.toLowerCase().includes(query.district.toLowerCase())) isMatch = false;
      if (query.tehsil && !record.tehsil.toLowerCase().includes(query.tehsil.toLowerCase())) isMatch = false;
      if (query.village && !record.village.toLowerCase().includes(query.village.toLowerCase())) isMatch = false;
    }

    if (!isMatch) return false;

    // 2. Apply Filters
    if (filters) {
      if (filters.state && record.state !== filters.state) return false;
      if (filters.district && record.district !== filters.district) return false;
      if (filters.landUse && record.landUse !== filters.landUse) return false;
      
      if (filters.recordStatus) {
         // match logic for status
         if (filters.recordStatus === 'Active' && record.courtCaseStatus === 'Active') return true; // Just mapping some status
         // Simple filter example
      }
    }

    return true;
  });

  // 3. Sorting
  if (sort === 'area-asc') {
    results.sort((a, b) => a.area - b.area);
  } else if (sort === 'area-desc') {
    results.sort((a, b) => b.area - a.area);
  }
  
  return results;
};

// Helper for extracting unique filter values
export const getFilterOptions = () => {
  const states = [...new Set(landRecords.map(r => r.state))];
  const districts = [...new Set(landRecords.map(r => r.district))];
  const landUses = [...new Set(landRecords.map(r => r.landUse))];
  
  return { states, districts, landUses };
};
