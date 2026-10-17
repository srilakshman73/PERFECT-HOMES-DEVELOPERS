/**
 * ============================================================================
 * PERFECT HOMES & DEVELOPERS — STANDALONE LOCAL MEDIA IMPORT UTILITY
 * ============================================================================
 * 
 * Safely imports local property photos and videos from:
 *   D:\Perfect homes & developers\photos
 * into the website's public media storage and generates metadata.
 * 
 * Usage:
 *   node scripts/import-local-media.js
 * Or:
 *   double-click import-media.bat
 * 
 * Safe operations:
 *   - Read-only on source zip files (never alters or deletes original archives)
 *   - Flattens nested folders safely
 *   - Generates web-safe filenames while recording originalFilename
 *   - Assigns media explicitly to Parts 1-8
 *   - No hardcoded secrets or credentials
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const defaultSource = path.join(ROOT_DIR, 'photos');
const customSourceArg = process.argv[2];
const SOURCE_DIR = customSourceArg ? path.resolve(customSourceArg) : defaultSource;
const TARGET_DIR = path.join(ROOT_DIR, 'public', 'media');
const METADATA_JSON = path.join(ROOT_DIR, 'src', 'data', 'mediaMetadata.json');
const METADATA_JS = path.join(ROOT_DIR, 'src', 'data', 'mediaData.js');

console.log('\n================================================================');
console.log(' PERFECT HOMES & DEVELOPERS — LOCAL MEDIA IMPORT UTILITY');
console.log('================================================================');
console.log(`Source Folder: ${SOURCE_DIR}`);
console.log(`Target Folder: ${TARGET_DIR}\n`);

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`[ERROR] Source folder not found: ${SOURCE_DIR}`);
  console.log('Please ensure your media zip files are located in:');
  console.log(`  ${defaultSource}\n`);
  process.exit(1);
}

const PARTS_SPEC = [
  { archive: 'part1.zip', partNumber: 1, name: 'Kuberan Avenue — Thiruninravur - Nathamedu', targetDir: 'part1', projectId: 'ph-kuberan-avenue' },
  { archive: 'part 2.zip', partNumber: 2, name: 'Promotional Posters & Marketing Materials', targetDir: 'part2', projectId: 'ph-promotions' },
  { archive: 'part3.zip', partNumber: 3, name: 'Construction Work & On-Site Progress', targetDir: 'part3', projectId: 'ph-construction' },
  { archive: 'part4.zip', partNumber: 4, name: 'Company Office — Perfect Homes & Developers', targetDir: 'part4', projectId: 'ph-office' },
  { archive: 'part6.zip', partNumber: 6, name: 'Veppampattu — Rail Nagar Residential Property', targetDir: 'part6', projectId: 'ph-rail-nagar' },
  { archive: 'part7.zip', partNumber: 7, name: 'Thiruninravur On-Road Site — Kosavanpalayam', targetDir: 'part7', projectId: 'ph-kosavanpalayam' },
  { archive: 'part8.zip', partNumber: 8, name: 'Model Houses & Architectural Elevations', targetDir: 'part8', projectId: 'ph-model-houses' }
];

const tempExtract = path.join(ROOT_DIR, 'scratch', 'temp_extract');
if (fs.existsSync(tempExtract)) {
  fs.rmSync(tempExtract, { recursive: true, force: true });
}
fs.mkdirSync(tempExtract, { recursive: true });

const scriptFile = path.join(ROOT_DIR, 'scratch', 'safe_extract.ps1');

const allRecords = [];
let totalDiscovered = 0;
let totalExtracted = 0;
let totalPhotos = 0;
let totalVideos = 0;

for (const part of PARTS_SPEC) {
  const archivePath = path.join(SOURCE_DIR, part.archive);
  if (!fs.existsSync(archivePath)) {
    console.log(`[-] Skipping ${part.archive} (not found in source)`);
    continue;
  }

  totalDiscovered++;
  const stats = fs.statSync(archivePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`[*] Processing Part ${part.partNumber}: ${part.archive} (${sizeMB} MB)...`);

  const extractDest = path.join(tempExtract, `part_${part.partNumber}`);
  fs.mkdirSync(extractDest, { recursive: true });

  const psCode = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("${archivePath.replace(/\\/g, '\\\\')}", "${extractDest.replace(/\\/g, '\\\\')}")
`;
  fs.writeFileSync(scriptFile, psCode);
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${scriptFile}"`, { stdio: 'ignore' });
  } catch (err) {
    console.error(`  [!] Failed to extract ${part.archive}: ${err.message}`);
    continue;
  }

  function walk(dir) {
    let files = [];
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) files = files.concat(walk(fp));
      else files.push(fp);
    }
    return files;
  }

  const items = walk(extractDest);
  totalExtracted += items.length;

  const partMediaDir = path.join(TARGET_DIR, part.targetDir);
  const imgDir = path.join(partMediaDir, 'images');
  const vidDir = path.join(partMediaDir, 'videos');
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(vidDir, { recursive: true });

  let idx = 1;
  for (const src of items) {
    const orig = path.basename(src);
    const ext = path.extname(orig).toLowerCase();
    const isImg = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    const isVid = ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);

    if (!isImg && !isVid) continue;

    const mediaType = isImg ? 'image' : 'video';
    const cleanBase = orig.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').toLowerCase();
    const destName = `${cleanBase}_${idx}${ext}`;
    const destFolder = isImg ? imgDir : vidDir;
    const destPath = path.join(destFolder, destName);

    fs.copyFileSync(src, destPath);

    if (isImg) totalPhotos++;
    else totalVideos++;

    const fileSize = fs.statSync(src).size;
    const sizeKB = (fileSize / 1024).toFixed(1);
    const publicUrl = `/media/${part.targetDir}/${isImg ? 'images' : 'videos'}/${destName}`;

    allRecords.push({
      id: `med_p${part.partNumber}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      partNumber: part.partNumber,
      partName: part.name,
      projectId: part.projectId,
      originalFilename: orig,
      filename: destName,
      mediaType,
      storagePath: publicUrl,
      sizeKB: parseFloat(sizeKB),
      uploadDate: new Date().toISOString().split('T')[0],
      isFeatured: idx === 1,
      caption: `${part.name} - ${mediaType === 'image' ? 'Photo' : 'Video'} #${idx}`
    });

    idx++;
  }

  console.log(`  [+] Successfully imported Part ${part.partNumber} (${idx - 1} media files)`);
}

// Write metadata files
fs.writeFileSync(METADATA_JSON, JSON.stringify(allRecords, null, 2));
fs.writeFileSync(
  METADATA_JS,
  `/* Auto-generated media catalog */\nexport const IMPORTED_MEDIA = ${JSON.stringify(allRecords, null, 2)};\n`
);

console.log('\n================================================================');
console.log(' IMPORT COMPLETE');
console.log('================================================================');
console.log(`Archives Processed: ${totalDiscovered}`);
console.log(`Total Photos:       ${totalPhotos}`);
console.log(`Total Videos:       ${totalVideos}`);
console.log(`Total Media Files:  ${allRecords.length}`);
console.log(`Metadata Saved:     ${METADATA_JSON}`);
console.log('================================================================\n');
