import { landRecords } from '../data/landRecords';
import { courtCases } from '../data/courtCases';

const REFERENCE_RATES = {
  Hectares: 1840000,
  Acres: 740000
};

// Simple corridor approximation:
// For each parcel, check if any polygon vertex is within corridor distance of any route segment
// This avoids the need for Turf.js

function distPointToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const nearX = ax + t * dx;
  const nearY = ay + t * dy;
  return Math.hypot(px - nearX, py - nearY);
}

// Convert meters to approximate degrees (rough: 1 deg lat ~ 111km)
function metersToDegrees(meters) {
  return meters / 111000;
}

function parcelIntersectsCorridor(parcel, route, corridorWidthMeters) {
  if (!parcel.geometry || route.length < 2) return false;
  const thresholdDeg = metersToDegrees(corridorWidthMeters / 2);
  const coords = parcel.geometry.coordinates[0]; // ring of [lng,lat]
  
  for (let i = 0; i < route.length - 1; i++) {
    const [ax, ay] = route[i];   // [lng, lat]
    const [bx, by] = route[i + 1];
    for (const [px, py] of coords) {
      const dist = distPointToSegment(px, py, ax, ay, bx, by);
      if (dist <= thresholdDeg) return true;
    }
  }
  return false;
}

function calcAffectedFraction(parcel, route, corridorWidthMeters) {
  // Simple heuristic: use ratio of parcel vertices within corridor
  if (!parcel.geometry || route.length < 2) return 0;
  const thresholdDeg = metersToDegrees(corridorWidthMeters / 2);
  const coords = parcel.geometry.coordinates[0];
  let inside = 0;
  
  for (let i = 0; i < route.length - 1; i++) {
    const [ax, ay] = route[i];
    const [bx, by] = route[i + 1];
    for (const [px, py] of coords) {
      if (distPointToSegment(px, py, ax, ay, bx, by) <= thresholdDeg) inside++;
    }
  }
  // Cap fraction between 10% and 80% for realistic simulation
  const rawFraction = Math.min(inside / (coords.length * (route.length - 1)), 1);
  return Math.min(0.8, Math.max(0.1, rawFraction));
}

export const calculateAffectedParcels = (route, corridorWidthMeters = 30) => {
  if (!route || route.length < 2) return [];
  
  return landRecords
    .filter(p => parcelIntersectsCorridor(p, route, corridorWidthMeters))
    .map(p => {
      const fraction = calcAffectedFraction(p, route, corridorWidthMeters);
      const affectedArea = parseFloat((p.area * fraction).toFixed(3));
      const remainingArea = parseFloat((p.area - affectedArea).toFixed(3));
      const affectedPct = Math.round(fraction * 100);
      const rate = REFERENCE_RATES[p.areaUnit] || REFERENCE_RATES.Hectares;
      const prelimValue = Math.round(affectedArea * rate);
      const hasCase = courtCases.some(c => c.landId === p.id && c.status === 'Active');
      
      return {
        ...p,
        affectedArea,
        remainingArea,
        affectedPct,
        preliminaryValue: prelimValue,
        hasActiveCase: hasCase,
        referenceRate: rate
      };
    });
};

export const calculateRouteLength = (route) => {
  if (!route || route.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const [lng1, lat1] = route[i];
    const [lng2, lat2] = route[i + 1];
    // Haversine approximation
    const R = 6371000; // meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return (total / 1000).toFixed(2); // km
};

export const getProjectSummary = (project, affectedParcels) => {
  const totalAffectedArea = affectedParcels.reduce((s, p) => s + p.affectedArea, 0).toFixed(3);
  const totalValue = affectedParcels.reduce((s, p) => s + p.preliminaryValue, 0);
  const withCases = affectedParcels.filter(p => p.hasActiveCase).length;
  const encumbered = affectedParcels.filter(p => p.encumbranceStatus !== 'Clear').length;
  const landUses = [...new Set(affectedParcels.map(p => p.landUse))];
  
  return {
    projectName: project.name,
    projectType: project.type,
    corridorWidth: project.corridorWidth,
    totalAffectedParcels: affectedParcels.length,
    totalAffectedArea,
    estimatedReferenceValue: totalValue,
    caseAffectedParcels: withCases,
    encumberedParcels: encumbered,
    landUseCategories: landUses
  };
};

export const generateCorridorPolygon = (route, corridorWidthMeters = 30) => {
  if (!route || route.length < 2) return null;
  const halfDeg = metersToDegrees(corridorWidthMeters / 2);
  
  const left = [];
  const right = [];
  
  for (let i = 0; i < route.length; i++) {
    const [lng, lat] = route[i];
    // Get direction from prev to next segment
    let dx = 0, dy = 0;
    if (i < route.length - 1) {
      dx = route[i + 1][0] - route[i][0];
      dy = route[i + 1][1] - route[i][1];
    } else {
      dx = route[i][0] - route[i - 1][0];
      dy = route[i][1] - route[i - 1][1];
    }
    const len = Math.hypot(dx, dy) || 1;
    // Perpendicular
    const nx = -dy / len;
    const ny = dx / len;
    left.push([lng + nx * halfDeg, lat + ny * halfDeg]);
    right.push([lng - nx * halfDeg, lat - ny * halfDeg]);
  }
  
  // Combine: left forward + right backward = closed polygon
  const polygon = [...left, ...[...right].reverse(), left[0]];
  return polygon;
};
