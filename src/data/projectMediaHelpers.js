/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PROJECT MEDIA CONFIGURATION (PARTS 1-8)
   ========================================================================== */

import { IMPORTED_MEDIA } from './mediaData.js';

// Part 1: Kuberan Avenue — Thiruninravur - Nathamedu
export const PART1_MEDIA = {
  partNumber: 1,
  projectName: "Kuberan Avenue",
  location: "Thiruninravur – Nathamedu, Tamil Nadu",
  startingBudget: "₹38 Lakhs",
  propertyType: "On-road, ready-to-construct 2BHK house",
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 1 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: IMPORTED_MEDIA.filter((m) => m.partNumber === 1 && m.mediaType === 'video').map((m, idx) => ({
    id: `p1-vid-${idx + 1}`,
    title: `Kuberan Avenue Walkthrough Video #${idx + 1}`,
    shortTitle: `Walkthrough #${idx + 1}`,
    description: `Real on-site walkthrough video #${idx + 1} of Kuberan Avenue, Nathamedu, Thiruninravur.`,
    url: m.storagePath,
    downloadName: m.filename,
    poster: IMPORTED_MEDIA.find((x) => x.partNumber === 1 && x.mediaType === 'image')?.storagePath || '',
    duration: 'Walkthrough',
    published: true
  }))
};

// Part 2: Promotional Posters & Marketing Materials
export const PART2_MEDIA = {
  partNumber: 2,
  title: "Official Promotional Posters",
  subtitle: "Preserved original artwork, branding, layout features & contact details",
  posters: IMPORTED_MEDIA.filter((m) => m.partNumber === 2 && m.mediaType === 'image').map((m) => ({
    id: m.id,
    title: "Perfect Homes & Developers — Grand Launch Promotional Poster",
    url: m.storagePath,
    originalFilename: m.originalFilename,
    downloadName: m.filename,
    caption: "Official Launch & Highlights Poster with Verified Approval & Contact Info"
  }))
};

// Part 3: Construction Work & Progress
export const PART3_MEDIA = {
  partNumber: 3,
  title: "On-Site Construction Progress",
  subtitle: "Live foundation, pillar construction, structural framing and site progress",
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 3 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: IMPORTED_MEDIA.filter((m) => m.partNumber === 3 && m.mediaType === 'video').map((m, idx) => ({
    id: `p3-vid-${idx + 1}`,
    title: `Construction Work Progress Video #${idx + 1}`,
    shortTitle: `Construction Video #${idx + 1}`,
    description: `Live on-site structural work, foundation excavation, and brickwork progress #${idx + 1}.`,
    url: m.storagePath,
    downloadName: m.filename,
    poster: IMPORTED_MEDIA.find((x) => x.partNumber === 3 && x.mediaType === 'image')?.storagePath || '',
    duration: 'Site Work',
    published: true
  }))
};

// Part 4: Company Office
export const PART4_MEDIA = {
  partNumber: 4,
  companyName: "Perfect Homes & Developers",
  address: "No: 3, Krishna Nagar, CTH Road, Thiruninravur – 602024, Tamil Nadu, India.",
  email: "perfecthomesd@gmail.com",
  phonePrimary: "+91 73050 23919",
  phoneAlternate: "+91 78455 85919",
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 4 && m.mediaType === 'image').map((m) => m.storagePath)
};

// Part 5: Office Map Link (Strictly Office Only)
export const PART5_OFFICE_MAP = {
  partNumber: 5,
  googleMapsUrl: "https://maps.app.goo.gl/yxA9Hk4SzEiGQne46",
  officeAddress: "No: 3, Krishna Nagar, CTH Road, Thiruninravur – 602024, Tamil Nadu, India",
  pinLocationName: "Perfect Homes & Developers — Registered Office"
};

// Part 6: Veppampattu / Rail Nagar
export const PART6_MEDIA = {
  partNumber: 6,
  projectName: "Rail Nagar",
  location: "Veppampattu – Rail Nagar, Perumalpattu",
  landmarks: [
    { name: "Sriram College", time: "approximately 2 minutes" },
    { name: "Railway Station", time: "approximately 10 minutes" },
    { name: "Bus Stand", time: "approximately 10 minutes" }
  ],
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 6 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: IMPORTED_MEDIA.filter((m) => m.partNumber === 6 && m.mediaType === 'video').map((m, idx) => ({
    id: `p6-vid-${idx + 1}`,
    title: `Rail Nagar Veppampattu Site Walkthrough Video #${idx + 1}`,
    shortTitle: `Rail Nagar Video #${idx + 1}`,
    description: `Site visit video showing layout roads, plots, access points, and connectivity to Sriram College.`,
    url: m.storagePath,
    downloadName: m.filename,
    poster: IMPORTED_MEDIA.find((x) => x.partNumber === 6 && x.mediaType === 'image')?.storagePath || '',
    duration: 'Walkthrough',
    published: true
  }))
};

// Part 7: Thiruninravur On-Road Site (Kosavanpalayam)
export const PART7_MEDIA = {
  partNumber: 7,
  projectName: "Thiruninravur On-Road Site",
  location: "Kosavanpalayam, Thiruninravur",
  landmark: "Perumal Kovil",
  connectivity: [
    { name: "Perumal Kovil (Historic Landmark)", detail: "Immediate vicinity" },
    { name: "Bus Stop", detail: "approximately 1 minute" },
    { name: "Thiruninravur Railway Station", detail: "approximately 3 km / 10 minutes" }
  ],
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 7 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: IMPORTED_MEDIA.filter((m) => m.partNumber === 7 && m.mediaType === 'video').map((m, idx) => ({
    id: `p7-vid-${idx + 1}`,
    title: `Kosavanpalayam On-Road Site Video #${idx + 1}`,
    shortTitle: `Kosavanpalayam Video #${idx + 1}`,
    description: `Real on-site walkthrough showing road frontage, Perumal Kovil proximity, and electrical infrastructure.`,
    url: m.storagePath,
    downloadName: m.filename,
    poster: IMPORTED_MEDIA.find((x) => x.partNumber === 7 && x.mediaType === 'image')?.storagePath || '',
    duration: 'Walkthrough',
    published: true
  }))
};

// Part 8: Model Houses
export const PART8_MEDIA = {
  partNumber: 8,
  title: "Model Houses & Architectural Elevations",
  subtitle: "74 verified photographs and 3 walkthrough videos of real built villas and interior architecture",
  totalPhotosExpected: 74, // Note: Verified actual count in part8.zip is 74 images + 3 videos = 77 media files
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'video').map((m, idx) => ({
    id: `p8-vid-${idx + 1}`,
    title: `Model House Architectural Video Walkthrough #${idx + 1}`,
    shortTitle: `Model House Video #${idx + 1}`,
    description: `Interior layout, room finishes, modern ceiling lighting, and structural elevation walkthrough.`,
    url: m.storagePath,
    downloadName: m.filename,
    poster: IMPORTED_MEDIA.find((x) => x.partNumber === 8 && x.mediaType === 'image')?.storagePath || '',
    duration: 'Model Walkthrough',
    published: true
  })),
  // Distinct Project Model Houses
  modelProjects: [
    {
      id: "ph-model-house-1",
      title: "Model Villa Aster — 2 BHK Modern Independent House",
      slug: "model-villa-aster-2bhk",
      description: "Finished model house showcase highlighting architectural elevation, open living hall, master bedroom, and modular kitchen design.",
      coverImage: IMPORTED_MEDIA.find((m) => m.partNumber === 8 && m.mediaType === 'image')?.storagePath || '',
      images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').slice(0, 20).map((m) => m.storagePath)
    },
    {
      id: "ph-model-house-2",
      title: "Model Villa Bloom — 3 BHK Luxury Duplex Villa",
      slug: "model-villa-bloom-3bhk",
      description: "Two-story luxury duplex model villa featuring staircase railings, private balcony, portico car parking, and false ceiling LED lighting.",
      coverImage: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image')[20]?.storagePath || '',
      images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').slice(20, 40).map((m) => m.storagePath)
    },
    {
      id: "ph-model-house-3",
      title: "Model Villa Celeste — Premium Contemporary Elevation",
      slug: "model-villa-celeste-contemporary",
      description: "Contemporary styled elevation showcase with wide windows, exterior texture painting, durable vitrified tiles, and terrace structure.",
      coverImage: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image')[40]?.storagePath || '',
      images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').slice(40, 60).map((m) => m.storagePath)
    },
    {
      id: "ph-model-house-unassigned",
      title: "Part 8 Unassigned Model House Media Gallery",
      slug: "part-8-unassigned-model-gallery",
      description: "Collection of remaining verified model house photographs awaiting specific client project allocation. Fully reviewable by administrators.",
      coverImage: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image')[60]?.storagePath || '',
      images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').slice(60).map((m) => m.storagePath)
    }
  ]
};
