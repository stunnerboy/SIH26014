export const PAGE_GUIDES = {
  '/search': {
    hi: {
      title: "Land Search Guide",
      intro: "Main land search page par hain. Aap 5 tarike se search kar sakte hain.",
      steps: [
        "Step 1: Search method select karein (ULPIN, Khata, Khasra, Owner, ya Location).",
        "Step 2: Required ULPIN, Khata ya Khasra number enter karein.",
        "Step 3: 'Search Land' button par click karein.",
        "Step 4: Search results list mein 'View Details' select karke full parcel record dekhein."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "ULPIN kya hai?", query: "what_is_ulpin" },
        { text: "Khata aur Khasra mein fark?", query: "khata_vs_khasra" },
        { text: "Login kab zaroori hai?", query: "when_login_needed" }
      ]
    },
    en: {
      title: "Land Search Guide",
      intro: "You are on the main land search page. You can search using 5 different methods.",
      steps: [
        "Step 1: Choose search method (ULPIN, Khata, Khasra, Owner, or Location).",
        "Step 2: Enter the required ULPIN, Khata, or Khasra number.",
        "Step 3: Click the 'Search Land' button.",
        "Step 4: Click 'View Details' on search results to open the complete record."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "What is ULPIN?", query: "what_is_ulpin" },
        { text: "Difference between Khata & Khasra?", query: "khata_vs_khasra" },
        { text: "When is login required?", query: "when_login_needed" }
      ]
    }
  },

  '/land': {
    hi: {
      title: "Land Parcel Details Guide",
      intro: "Aap parcel details page par hain. Yahan zameen ki puri jankari di gayi hai.",
      steps: [
        "Step 1: Header aur Overview section mein ULPIN, Status aur Total Area dekhein.",
        "Step 2: Ownership & Records tab mein Khata/Khasra aur Owner Details dekhein.",
        "Step 3: Legal & Encumbrance tab mein court cases aur mortgage record check karein.",
        "Step 4: GIS Location tab par click karke parcel map par dekhein."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "Is zameen ka owner kaun hai?", query: "land_owner" },
        { text: "Is land ka area kitna hai?", query: "land_area" },
        { text: "Court case hai kya?", query: "land_court_case" },
        { text: "Encumbrance status kya hai?", query: "land_encumbrance" },
        { text: "Land use kya hai?", query: "land_use" }
      ]
    },
    en: {
      title: "Land Parcel Details Guide",
      intro: "You are on the parcel details page displaying comprehensive parcel profile.",
      steps: [
        "Step 1: View ULPIN, record status, and total area in the header overview.",
        "Step 2: Check ownership details and Khata/Khasra numbers in the Ownership tab.",
        "Step 3: Inspect active court cases and encumbrance records in Legal tab.",
        "Step 4: View parcel boundaries on the map in the GIS tab."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "Who is the owner of this land?", query: "land_owner" },
        { text: "What is the total area?", query: "land_area" },
        { text: "Is there any court case?", query: "land_court_case" },
        { text: "What is the encumbrance status?", query: "land_encumbrance" },
        { text: "What is the land use category?", query: "land_use" }
      ]
    }
  },

  '/dashboard': {
    hi: {
      title: "Citizen Dashboard Guide",
      intro: "Aapke linked land records aur personal applications ka dashboard.",
      steps: [
        "Step 1: Summary cards mein Total Parcels, Area aur Active Cases dekhein.",
        "Step 2: 'My Land' tab par click karke aapke naam par linked saare parcels dekhein.",
        "Step 3: 'Applications' tab mein mutation aur service requests track karein.",
        "Step 4: 'Notifications' tab mein land updates aur notices padhein."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "Mere land kaise dekhein?", query: "how_view_myland" },
        { text: "Court case ka matlab?", query: "court_case_meaning" },
        { text: "New application kaise karein?", query: "how_apply_service" }
      ]
    },
    en: {
      title: "Citizen Dashboard Guide",
      intro: "Overview of your linked land records and personalized service applications.",
      steps: [
        "Step 1: Check total parcels, total area, and active court cases in summary cards.",
        "Step 2: Click 'My Land' to view all parcels linked to your profile.",
        "Step 3: Track mutation requests and service progress in 'Applications'.",
        "Step 4: Review acquisition alerts and updates in 'Notifications'."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "How to view my land?", query: "how_view_myland" },
        { text: "What does court case mean?", query: "court_case_meaning" },
        { text: "How to apply for services?", query: "how_apply_service" }
      ]
    }
  },

  '/government/impact': {
    hi: {
      title: "Project Impact Analysis Guide",
      intro: "GIS corridor impact analysis tool infrastructure projects ke liye.",
      steps: [
        "Step 1: Left panel mein 'Draw Route' select karke map par corridor path banayein.",
        "Step 2: Corridor width (e.g. 30m) choose karke 'Generate Corridor' par click karein.",
        "Step 3: System automatically route ke andar aane wale affected parcels detect karta hai.",
        "Step 4: Affected parcels list par click karke individual impact %, area aur reference valuation dekhein."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "Impact calculation samjhao", query: "explain_impact_calc" },
        { text: "Reference valuation kya hai?", query: "explain_reference_val" },
        { text: "Legal flags ka kya matlab hai?", query: "explain_legal_flags" }
      ]
    },
    en: {
      title: "Project Impact Analysis Guide",
      intro: "GIS corridor impact assessment tool for government infrastructure projects.",
      steps: [
        "Step 1: Click 'Draw Route' on the left panel and click points on the map.",
        "Step 2: Select corridor buffer width (e.g., 30m) and click 'Generate Corridor'.",
        "Step 3: System automatically intersects route buffer with parcel geometries.",
        "Step 4: Review affected parcel list, impact area %, preliminary reference value & court case flags."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "Explain impact calculation", query: "explain_impact_calc" },
        { text: "What is preliminary reference value?", query: "explain_reference_val" },
        { text: "What do legal flags signify?", query: "explain_legal_flags" }
      ]
    }
  },

  'default': {
    hi: {
      title: "BhuSetu Portal Help",
      intro: "BhuSetu portal par aapka swagat hai. Aap zameen ki public jankari search kar sakte hain aur GIS map explore kar sakte hain.",
      steps: [
        "Step 1: Search page par jaakar ULPIN, Khata ya Khasra se zameen dhundhein.",
        "Step 2: Interactive map par zameen ki boundary aur land use dekhein.",
        "Step 3: Login karke apne linked land records aur applications track karein."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "BhuSetu kya hai?", query: "what_is_bhusetu" },
        { text: "Public search bina login kaise karein?", query: "how_public_search" },
        { text: "Government portal kya hai?", query: "what_is_govt_portal" }
      ]
    },
    en: {
      title: "BhuSetu Portal Help",
      intro: "Welcome to BhuSetu Portal. You can search public land records and explore GIS map boundaries.",
      steps: [
        "Step 1: Use the Search page to find parcels by ULPIN, Khata, or Khasra number.",
        "Step 2: Explore interactive map layers and parcel geometries.",
        "Step 3: Login to view personalized land records and service applications."
      ],
      quickActions: [
        { text: "Guide me", type: "guide" },
        { text: "What is BhuSetu?", query: "what_is_bhusetu" },
        { text: "How to search without login?", query: "how_public_search" },
        { text: "What is the Government portal?", query: "what_is_govt_portal" }
      ]
    }
  }
};

export const COMMON_ANSWERS = {
  what_is_ulpin: {
    hi: "ULPIN (Unique Land Parcel Identification Number) ek 14-digit alphanumeric code hai jo har land parcel ko aadhar-style unique identity deta hai.",
    en: "ULPIN (Unique Land Parcel Identification Number) is a 14-digit alphanumeric unique identifier assigned to every land parcel in India."
  },
  khata_vs_khasra: {
    hi: "Khata number landholding/owner family record hota hai, jabki Khasra number specific zameen ke tukde (plot/survey number) ko darshata hai.",
    en: "Khata number identifies the landowner/holding family account, while Khasra number identifies a specific plot/parcel of land."
  },
  when_login_needed: {
    hi: "Public search aur map dekhte waqt login ZAROORI NAHI hai. Login sirf apne linked land records ('My Land'), notifications aur service applications track karne ke liye zaroori hai.",
    en: "Login is NOT required for searching land or exploring the map. Login is only required to view your personalized linked land records ('My Land'), applications, and notifications."
  },
  what_is_bhusetu: {
    hi: "BhuSetu ek digital land governance platform prototype hai jo citizens aur government ko unified GIS land records access aur impact planning tools pradan karta hai.",
    en: "BhuSetu is a digital land governance platform prototype connecting citizens and government with unified GIS land records and infrastructure impact planning tools."
  },
  how_public_search: {
    hi: "Public search ke liye navigation menu mein 'Search Land' select karein. Wahan ULPIN, Khata, Khasra, Owner Name, ya Village select karke bina kisi login ke zameen ki public details dekhein.",
    en: "Select 'Search Land' in the header navigation. Enter ULPIN, Khata, Khasra, Owner Name, or Location to view public land records without any login requirement."
  },
  what_is_govt_portal: {
    hi: "Government planning portal project officers ke liye GIS-based route planning, corridor impact buffer calculation, aur affected parcels report generate karne ka tool hai.",
    en: "The Government Planning Portal allows authorized planning officers to conduct GIS route planning, corridor impact buffer analysis, and generate parcel assessment reports."
  },
  how_view_myland: {
    hi: "Citizen Login ke baad Dashboard mein 'My Land' tab par click karein. Wahan aapke identity profile se linked saare parcels list ho jayenge.",
    en: "After citizen login, navigate to the 'My Land' tab on the Dashboard to view all land parcels linked to your profile."
  },
  court_case_meaning: {
    hi: "Court Case flag darshata hai ki is parcel ke khilaf koi active legal dispute revenue court ya civil court mein chal raha hai.",
    en: "An active court case flag indicates an ongoing legal dispute regarding ownership or boundaries registered in court records."
  },
  how_apply_service: {
    hi: "Services section se aap Mutation (Namantaran) ya Certified Record Copy ke liye request apply kar sakte hain. Application status Dashboard mein track hoti hai.",
    en: "You can apply for services such as Mutation or Certified Land Record copies through the Services module. Track status on your Dashboard."
  },
  explain_impact_calc: {
    hi: "Project Corridor Impact calculation proposed route line ke aas-pass buffer distance (e.g. 30m) lekar parcel polygons ke saath intersection compute karta hai.",
    en: "Project Corridor Impact calculation creates a buffer polygon (e.g., 30m) along the proposed route and calculates intersecting parcel geometry area and percentage."
  },
  explain_reference_val: {
    hi: "Preliminary Reference Value affected area ko state-approved standard reference rate se multiply karke nikala jata hai. Ye sample demo figure hai, official compensation nahi.",
    en: "Preliminary Reference Value is estimated by multiplying the affected area by the reference rate for the land use type. This is a sample reference estimate only."
  },
  explain_legal_flags: {
    hi: "Legal flags red badge (Court Case) aur yellow badge (Encumbrance/Mortgage) darshate hain taaki project planning ke dauran dispute-prone parcels ki pehchan pehle ho sake.",
    en: "Legal flags highlight active court cases (red) and encumbrances (yellow) so project planners can identify legal risks prior to land acquisition."
  }
};
