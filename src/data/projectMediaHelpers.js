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
  phonePrimary: "+91 78455 85919",
  phoneAlternate: "+91 78455 85919",
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 4 && m.mediaType === 'image').map((m) => m.storagePath)
};

// Part 5: Office Map Link (Strictly Office Only)
export const PART5_OFFICE_MAP = {
  partNumber: 5,
  googleMapsUrl: "https://maps.app.goo.gl/Qit2fHzxKrSnyGvd8",
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

// Part 7: Thiruninravur On-Road Site (Kosavanpalayam) - 5 Unique Walkthrough Videos (Deduplicated)
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
  videos: [
    {
      id: "p7-vid-1",
      title: "Kosavanpalayam On-Road Approach & Road Frontage",
      shortTitle: "Main Road Frontage",
      description: "Direct on-site view of the wide main road frontage and approach connectivity at Kosavanpalayam, Thiruninravur.",
      url: "/media/part7/videos/whatsapp_video_2026-10-16_at_11_19_22_am_17.mp4",
      downloadName: "kosavanpalayam-road-frontage-video-1.mp4",
      poster: "/media/part7/images/whatsapp_image_2026-10-16_at_11_19_17_am_1.jpeg",
      duration: "0:32",
      published: true
    },
    {
      id: "p7-vid-2",
      title: "Internal Plotted Layout & Clear Boundary Stones",
      shortTitle: "Plotted Layout",
      description: "Walkthrough of surveyed residential plots, marked boundary stones, and individual layout demarcations.",
      url: "/media/part7/videos/whatsapp_video_2026-10-16_at_11_19_33_am_19.mp4",
      downloadName: "kosavanpalayam-plots-layout-video-2.mp4",
      poster: "/media/part7/images/whatsapp_image_2026-10-16_at_11_19_18_am_3.jpeg",
      duration: "0:59",
      published: true
    },
    {
      id: "p7-vid-3",
      title: "Perumal Kovil Historic Landmark Proximity",
      shortTitle: "Perumal Kovil Proximity",
      description: "Site walkthrough showing immediate proximity to the historic Perumal Kovil landmark and surrounding peaceful residential neighborhood.",
      url: "/media/part7/videos/whatsapp_video_2026-10-16_at_11_19_37_am_20.mp4",
      downloadName: "kosavanpalayam-perumal-kovil-proximity-video-3.mp4",
      poster: "/media/part7/images/whatsapp_image_2026-10-16_at_11_19_19_am_5.jpeg",
      duration: "0:29",
      published: true
    },
    {
      id: "p7-vid-4",
      title: "40-Feet Wide Internal Tar Road Walkthrough",
      shortTitle: "40-Ft Tar Road",
      description: "Full master walkthrough showcasing the 40-feet wide internal blacktop road, EB power poles, and street lighting.",
      url: "/media/part7/videos/whatsapp_video_2026-10-16_at_11_19_38_am_22.mp4",
      downloadName: "kosavanpalayam-40ft-tar-road-video-4.mp4",
      poster: "/media/part7/images/whatsapp_image_2026-10-16_at_11_19_20_am_8.jpeg",
      duration: "1:08",
      published: true
    },
    {
      id: "p7-vid-5",
      title: "Corner Plot & Road Junction Connectivity",
      shortTitle: "Corner Plot Junction",
      description: "Survey view of corner plots, cross-road accessibility, and sweet groundwater table surroundings.",
      url: "/media/part7/videos/whatsapp_video_2026-10-16_at_11_19_39_am_23.mp4",
      downloadName: "kosavanpalayam-corner-plot-video-5.mp4",
      poster: "/media/part7/images/whatsapp_image_2026-10-16_at_11_19_21_am_11.jpeg",
      duration: "0:19",
      published: true
    }
  ]
};

// Part 8: Model Houses - 2 Distinct Model Architectural Walkthroughs (Video #76 moved to Ready-to-Move House in Thiruninravur)
export const PART8_MEDIA = {
  partNumber: 8,
  title: "Model Houses & Architectural Elevations",
  subtitle: "74 verified photographs and 2 walkthrough videos of real built villas and interior architecture",
  totalPhotosExpected: 74,
  images: IMPORTED_MEDIA.filter((m) => m.partNumber === 8 && m.mediaType === 'image').map((m) => m.storagePath),
  videos: [
    {
      id: "p8-vid-1",
      title: "Model Villa Architectural Elevation & Exterior Walkthrough",
      shortTitle: "Elevation Walkthrough",
      description: "Exterior elevation, contemporary architectural pergola, boundary wall, and portico entrance walkthrough.",
      url: "/media/part8/videos/whatsapp_video_2026-10-16_at_11_25_08_am_75.mp4",
      downloadName: "model-villa-elevation-walkthrough-1.mp4",
      poster: "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_36_am_2__70.jpeg",
      duration: "0:11",
      published: true
    },
    {
      id: "p8-vid-2",
      title: "Model Villa Front Portico & Entrance Walkthrough",
      shortTitle: "Portico & Entrance",
      description: "Front portico car parking, main teakwood entrance doorway, and exterior facade lighting tour.",
      url: "/media/part8/videos/whatsapp_video_2026-10-16_at_11_25_14_am_77.mp4",
      downloadName: "model-villa-entrance-walkthrough-2.mp4",
      poster: "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_09_am_15.jpeg",
      duration: "0:13",
      published: true
    }
  ],
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

// Ready-to-Move House in Thiruninravur (Standalone Property Listing)
export const THIRUNINRAVUR_READY_TO_MOVE_VIDEO = {
  id: "rtm-thiruninravur-vid-1",
  title: "Ready-to-Move House in Thiruninravur — Video Walkthrough",
  shortTitle: "Property Video Tour",
  description: "Watch the property video to explore the visible features of the ready-to-move house in Thiruninravur.",
  url: "/media/part8/videos/whatsapp_video_2026-10-16_at_11_25_09_am_76.mp4",
  downloadName: "ready-to-move-house-thiruninravur-walkthrough.mp4",
  poster: "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_09_am_15.jpeg",
  duration: "Walkthrough",
  published: true
};

export const THIRUNINRAVUR_READY_TO_MOVE_MEDIA = {
  title: "Ready-to-Move House in Thiruninravur",
  location: "Thiruninravur, Tamil Nadu, India",
  status: "Ready to Move",
  images: [
    "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_09_am_15.jpeg",
    "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_10_am_2__17.jpeg",
    "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_10_am_18.jpeg",
    "/media/part8/images/whatsapp_image_2026-10-16_at_11_25_10_am_1__16.jpeg"
  ],
  videos: [THIRUNINRAVUR_READY_TO_MOVE_VIDEO]
};
