import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PHOTOS_DIR = 'D:\\Perfect homes & developers\\photos';
const PUBLIC_MEDIA_DIR = 'D:\\Perfect homes & developers\\public\\media';

console.log('=== STARTING LOCAL MEDIA IMPORT ENGINE ===');
console.log(`Source Folder: ${PHOTOS_DIR}`);
console.log(`Target Public Media Folder: ${PUBLIC_MEDIA_DIR}`);

if (!fs.existsSync(PHOTOS_DIR)) {
  console.error(`ERROR: Source directory ${PHOTOS_DIR} does not exist!`);
  process.exit(1);
}

// Ensure target directories exist
const parts = [
  { archive: 'part1.zip', partNumber: 1, name: 'Kuberan Avenue — Thiruninravur - Nathamedu', targetDir: 'part1' },
  { archive: 'part 2.zip', partNumber: 2, name: 'Promotional Posters & Marketing Artwork', targetDir: 'part2' },
  { archive: 'part3.zip', partNumber: 3, name: 'Construction Work & On-Site Progress', targetDir: 'part3' },
  { archive: 'part4.zip', partNumber: 4, name: 'Company Office — Perfect Homes & Developers', targetDir: 'part4' },
  { archive: 'part6.zip', partNumber: 6, name: 'Veppampattu — Rail Nagar Residential Property', targetDir: 'part6' },
  { archive: 'part7.zip', partNumber: 7, name: 'Thiruninravur On-Road Site — Kosavanpalayam', targetDir: 'part7' },
  { archive: 'part8.zip', partNumber: 8, name: 'Model Houses & Architectural Elevations', targetDir: 'part8' }
];

if (!fs.existsSync(PUBLIC_MEDIA_DIR)) {
  fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
}

// Create a temp staging folder in scratch
const STAGING_DIR = 'D:\\Perfect homes & developers\\scratch\\staging';
if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

const importStats = {
  discoveredZips: 0,
  discoveredFiles: 0,
  extractedFiles: 0,
  importedPhotos: 0,
  importedVideos: 0,
  skippedFiles: 0,
  failedFiles: 0,
  partsBreakdown: {}
};

const allMediaRecords = [];

// Helper to sanitize filename
function cleanFileName(originalName, index, extension) {
  const base = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
  return `${base}_${index}${extension}`;
}

// Safe PowerShell extraction script for Windows
const extractScriptPath = path.join('scratch', 'extract.ps1');

for (const p of parts) {
  const zipPath = path.join(PHOTOS_DIR, p.archive);
  importStats.partsBreakdown[p.partNumber] = {
    name: p.name,
    archive: p.archive,
    photos: 0,
    videos: 0,
    totalMedia: 0,
    archiveSizeMB: 0
  };

  if (!fs.existsSync(zipPath)) {
    console.warn(`WARNING: Archive ${p.archive} not found in ${PHOTOS_DIR}`);
    continue;
  }

  importStats.discoveredZips++;
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  importStats.partsBreakdown[p.partNumber].archiveSizeMB = parseFloat(sizeMB);
  console.log(`\nProcessing Part ${p.partNumber} (${p.archive}, ${sizeMB} MB)...`);

  const partStaging = path.join(STAGING_DIR, `part_${p.partNumber}`);
  fs.mkdirSync(partStaging, { recursive: true });

  // Extract using PowerShell System.IO.Compression.ZipFile
  const psCode = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("${zipPath.replace(/\\/g, '\\\\')}", "${partStaging.replace(/\\/g, '\\\\')}")
`;
  fs.writeFileSync(extractScriptPath, psCode);
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${extractScriptPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to extract ${p.archive}:`, err.message);
    importStats.failedFiles++;
    continue;
  }

  // Scan extracted files recursively
  function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  const extracted = getFiles(partStaging);
  console.log(`  Extracted ${extracted.length} items from ${p.archive}`);
  importStats.discoveredFiles += extracted.length;

  const targetPartDir = path.join(PUBLIC_MEDIA_DIR, p.targetDir);
  const targetImgDir = path.join(targetPartDir, 'images');
  const targetVidDir = path.join(targetPartDir, 'videos');
  fs.mkdirSync(targetImgDir, { recursive: true });
  fs.mkdirSync(targetVidDir, { recursive: true });

  let fileIndex = 1;
  for (const srcFilePath of extracted) {
    const origFilename = path.basename(srcFilePath);
    const ext = path.extname(origFilename).toLowerCase();
    const fileSize = fs.statSync(srcFilePath).size;

    // Check media type
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    const isVideo = ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);

    if (!isImage && !isVideo) {
      console.log(`  Skipping non-media file: ${origFilename}`);
      importStats.skippedFiles++;
      continue;
    }

    importStats.extractedFiles++;

    const mediaType = isImage ? 'image' : 'video';
    const destFolder = isImage ? targetImgDir : targetVidDir;
    const destFilename = cleanFileName(origFilename, fileIndex, ext);
    const destFilePath = path.join(destFolder, destFilename);

    // Copy file safely (preserving original)
    fs.copyFileSync(srcFilePath, destFilePath);

    const publicUrl = `/media/${p.targetDir}/${mediaType === 'image' ? 'images' : 'videos'}/${destFilename}`;
    const sizeKB = (fileSize / 1024).toFixed(1);

    if (isImage) {
      importStats.importedPhotos++;
      importStats.partsBreakdown[p.partNumber].photos++;
    } else {
      importStats.importedVideos++;
      importStats.partsBreakdown[p.partNumber].videos++;
    }
    importStats.partsBreakdown[p.partNumber].totalMedia++;

    allMediaRecords.push({
      id: `med_p${p.partNumber}_${fileIndex}_${Math.random().toString(36).substring(2, 6)}`,
      partNumber: p.partNumber,
      partName: p.name,
      projectId: getProjectIdForPart(p.partNumber, fileIndex),
      originalFilename: origFilename,
      filename: destFilename,
      mediaType,
      storagePath: publicUrl,
      sizeKB: parseFloat(sizeKB),
      uploadDate: '2026-10-17',
      isFeatured: fileIndex === 1,
      caption: generateCaption(p.partNumber, origFilename, mediaType, fileIndex)
    });

    fileIndex++;
  }
}

function getProjectIdForPart(partNumber, idx) {
  switch (partNumber) {
    case 1:
      return 'ph-kuberan-avenue'; // Part 1
    case 2:
      return 'ph-promotions';     // Part 2
    case 3:
      return 'ph-construction';   // Part 3
    case 4:
      return 'ph-office';         // Part 4
    case 6:
      return 'ph-rail-nagar';     // Part 6
    case 7:
      return 'ph-kosavanpalayam'; // Part 7
    case 8:
      return idx <= 74 ? `ph-model-house-${Math.ceil(idx / 15)}` : 'ph-model-house-videos';
    default:
      return 'ph-unassigned';
  }
}

function generateCaption(partNumber, origName, type, idx) {
  if (partNumber === 1) return type === 'video' ? `Kuberan Avenue Site Video #${idx}` : `Kuberan Avenue Property Photo #${idx}`;
  if (partNumber === 2) return `Perfect Homes & Developers Official Promotional Poster`;
  if (partNumber === 3) return type === 'video' ? `Construction Progress Video Walkthrough #${idx}` : `Construction Site Work Verification Photo`;
  if (partNumber === 4) return `Perfect Homes Office Facility Photo #${idx}`;
  if (partNumber === 6) return type === 'video' ? `Rail Nagar Veppampattu Walkthrough Video #${idx}` : `Rail Nagar Site Photo #${idx}`;
  if (partNumber === 7) return type === 'video' ? `Kosavanpalayam On-Road Site Video #${idx}` : `Kosavanpalayam Property Photo #${idx}`;
  if (partNumber === 8) return type === 'video' ? `Model House Architecture Video #${idx}` : `Model House Villa Exterior/Interior Photo #${idx}`;
  return `Property Media #${idx}`;
}

// Write out media catalog
const metadataJsonPath = 'D:\\Perfect homes & developers\\src\\data\\mediaMetadata.json';
fs.writeFileSync(metadataJsonPath, JSON.stringify(allMediaRecords, null, 2));

const metadataJsPath = 'D:\\Perfect homes & developers\\src\\data\\mediaData.js';
fs.writeFileSync(
  metadataJsPath,
  `/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - IMPORTED LOCAL MEDIA CATALOG (PARTS 1-8)
   Auto-generated and validated from D:\\Perfect homes & developers\\photos
   ========================================================================== */

export const IMPORTED_MEDIA = ${JSON.stringify(allMediaRecords, null, 2)};

export const MEDIA_PARTS_CONFIG = ${JSON.stringify(importStats.partsBreakdown, null, 2)};
`
);

console.log('\n=== IMPORT SUMMARY REPORT ===');
console.log(`Discovered ZIP Archives: ${importStats.discoveredZips}`);
console.log(`Extracted Files: ${importStats.extractedFiles}`);
console.log(`Imported Photos: ${importStats.importedPhotos}`);
console.log(`Imported Videos: ${importStats.importedVideos}`);
console.log(`Total Media Assets: ${importStats.importedPhotos + importStats.importedVideos}`);
console.log(`Skipped Non-Media: ${importStats.skippedFiles}`);
console.log(`Failed Files: ${importStats.failedFiles}`);

console.log('\nBreakdown by Part:');
for (const [partNum, info] of Object.entries(importStats.partsBreakdown)) {
  console.log(`  Part ${partNum} (${info.name}): ${info.photos} Photos, ${info.videos} Videos (Archive Size: ${info.archiveSizeMB} MB)`);
}

console.log(`\nMetadata written to:`);
console.log(`  - ${metadataJsonPath}`);
console.log(`  - ${metadataJsPath}`);
