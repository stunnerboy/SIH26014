import { PAGE_GUIDES, COMMON_ANSWERS } from './assistantData';

export const getRouteKey = (pathname) => {
  if (!pathname) return 'default';
  if (pathname.startsWith('/land/')) return '/land';
  if (pathname.startsWith('/search')) return '/search';
  if (pathname.startsWith('/dashboard')) return '/dashboard';
  if (pathname.startsWith('/government/impact')) return '/government/impact';
  return 'default';
};

export const getPageGuide = (pathname, lang = 'hi') => {
  const key = getRouteKey(pathname);
  const data = PAGE_GUIDES[key] || PAGE_GUIDES['default'];
  return data[lang] || data['hi'];
};

export const getAnswerForQuery = (queryKey, pathname, parcelData, lang = 'hi') => {
  const isHi = lang === 'hi';

  // 1. Dynamic Parcel Queries
  if (parcelData) {
    switch (queryKey) {
      case 'land_owner':
        return isHi
          ? `Is parcel (ULPIN: ${parcelData.ulpin}) ke registered owner ${parcelData.ownerName} hain. Village: ${parcelData.village}, District: ${parcelData.district}.`
          : `The registered owner of this parcel (ULPIN: ${parcelData.ulpin}) is ${parcelData.ownerName}. Location: Village ${parcelData.village}, District ${parcelData.district}.`;

      case 'land_area':
        return isHi
          ? `Is parcel ka total area ${parcelData.area} ${parcelData.areaUnit} hai. Survey/Khasra No: ${parcelData.khasraNumber}, Khata No: ${parcelData.khataNumber}.`
          : `The total area of this parcel is ${parcelData.area} ${parcelData.areaUnit}. Survey/Khasra No: ${parcelData.khasraNumber}, Khata No: ${parcelData.khataNumber}.`;

      case 'land_court_case': {
        const hasCase = parcelData.cases && parcelData.cases.length > 0 || parcelData.hasActiveCase;
        if (hasCase) {
          const caseNo = parcelData.cases && parcelData.cases[0] ? parcelData.cases[0].caseNumber : 'CS/2023/Active';
          return isHi
            ? `⚠️ Ha, is parcel par active court case (Case No: ${caseNo}) listed hai. Legal resolution tak mutuation process pending reh sakti hai.`
            : `⚠️ Yes, this parcel has an active court case listed (Case No: ${caseNo}). Legal clearance is required prior to mutation.`;
        }
        return isHi
          ? `✅ Is parcel par koi active court case listed nahi hai. Record Clear hai.`
          : `✅ No active court cases are registered for this parcel. Record status is Clear.`;
      }

      case 'land_encumbrance':
        return isHi
          ? `Encumbrance Record: ${parcelData.encumbranceStatus}. (${parcelData.encumbranceStatus === 'Clear' ? 'Koi mortgage ya bank lien nahi hai.' : 'Zameen par mortgage ya bank charge hai.'})`
          : `Encumbrance Status: ${parcelData.encumbranceStatus}. (${parcelData.encumbranceStatus === 'Clear' ? 'No mortgage or bank lien recorded.' : 'Active bank mortgage or financial encumbrance registered.'})`;

      case 'land_use':
        return isHi
          ? `Land Use Category: ${parcelData.landUse}. Record status: ${parcelData.status || 'Active'}.`
          : `Land Use Classification: ${parcelData.landUse}. Record status: ${parcelData.status || 'Active'}.`;

      default:
        break;
    }
  }

  // 2. Common Static Answers
  if (COMMON_ANSWERS[queryKey]) {
    return COMMON_ANSWERS[queryKey][lang] || COMMON_ANSWERS[queryKey]['hi'];
  }

  // 3. Fallback
  return isHi
    ? "Is demo record mein ye information available nahi hai. Aap menu se Public Search ya Map explore kar sakte hain."
    : "This specific information is not available in the demo record. You can explore Public Search or Map from the main menu.";
};
