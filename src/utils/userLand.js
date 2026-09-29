import { users } from '../data/users';
import { landRecords } from '../data/landRecords';
import { courtCases } from '../data/courtCases';
import { projects } from '../data/projects';
import { applications } from '../data/applications';
import { notifications } from '../data/notifications';

export const getUserById = (id) => {
  return users.find(u => u.id === id) || null;
};

export const getUserLandRecords = (userId) => {
  const user = getUserById(userId);
  if (!user) return [];
  
  return landRecords.filter(record => user.linkedParcels.includes(record.id)).map(record => {
    const hasCase = courtCases.some(c => c.landId === record.id && c.status === 'Active');
    const project = projects.find(p => p.affectedParcels.includes(record.id));
    
    return {
      ...record,
      hasActiveCase: hasCase,
      projectAffected: project ? project : null
    };
  });
};

export const getUserApplications = (userId) => {
  return applications.filter(app => app.userId === userId);
};

export const getUserNotifications = (userId) => {
  return notifications.filter(notif => notif.userId === userId);
};

export const getUserStats = (userId) => {
  const parcels = getUserLandRecords(userId);
  const userApps = getUserApplications(userId);
  
  let totalArea = 0;
  let activeCases = 0;
  let projectImpacts = 0;

  parcels.forEach(p => {
    totalArea += p.area;
    if (p.hasActiveCase) activeCases++;
    if (p.projectAffected) projectImpacts++;
  });

  const pendingApps = userApps.filter(app => app.status === 'Submitted' || app.status === 'Under Review').length;

  return {
    totalParcels: parcels.length,
    totalArea: totalArea.toFixed(2),
    areaUnit: parcels.length > 0 ? parcels[0].areaUnit : 'Acres',
    activeCourtCases: activeCases,
    projectImpacts: projectImpacts,
    pendingApplications: pendingApps
  };
};
