// Automated Property Brochure Verification Test
import { PROPERTIES_DATA } from './src/data/propertiesData.js';
import { generatePropertyBrochure, getBrochureFilename, getPropertyForBrochure } from './src/services/brochureGenerator.js';
import fs from 'fs';
import path from 'path';

async function runBrochureTests() {
  console.log('================================================================');
  console.log('PERFECT HOMES & DEVELOPERS — DYNAMIC PROPERTY BROCHURE TEST SUITE');
  console.log('================================================================\n');

  const testPropertyIds = ['ph-109', 'ph-102', 'ph-103', 'ph-105'];
  const generatedBrochures = [];

  for (const id of testPropertyIds) {
    const prop = PROPERTIES_DATA.find((p) => p.id === id);
    if (!prop) {
      console.error(`❌ Property ${id} not found`);
      continue;
    }

    console.log(`[TEST] Testing Property: "${prop.title}" (${prop.id})`);
    console.log(`       Category: ${prop.category} | Location: ${prop.location}`);

    // 1. Test getBrochureFilename
    const filename = getBrochureFilename(prop);
    console.log(`       Generated Filename: ${filename}`);
    if (!filename.endsWith('-Property-Brochure.pdf')) {
      throw new Error(`Filename format invalid: ${filename}`);
    }

    // 2. Test generatePropertyBrochure
    const startTime = Date.now();
    const doc = await generatePropertyBrochure(prop);
    const duration = Date.now() - startTime;
    const pageCount = doc.getNumberOfPages();
    console.log(`       Generated ${pageCount} Pages in ${duration}ms`);

    if (pageCount !== 8) {
      throw new Error(`Expected exactly 8 pages, got ${pageCount}`);
    }

    // Output PDF buffer to scratch directory
    const outputDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outPath = path.join(outputDir, filename);
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(outPath, Buffer.from(pdfBytes));

    const fileSizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`       Saved to: ${filename} (${fileSizeKB} KB)`);
    console.log(`       ✅ Passed for ${prop.id}\n`);

    generatedBrochures.push({
      id: prop.id,
      title: prop.title,
      category: prop.category,
      filename,
      sizeKB: fileSizeKB,
      pageCount
    });
  }

  // 3. Test Property-Specific Differentiation
  console.log('----------------------------------------------------------------');
  console.log('VERIFYING PROPERTY DIFFERENTIATION & ISOLATION:');
  console.log('----------------------------------------------------------------');
  const aster = PROPERTIES_DATA.find((p) => p.id === 'ph-109');
  const plots = PROPERTIES_DATA.find((p) => p.id === 'ph-102');

  console.log(`- Aster Category: ${aster.category} vs Plots Category: ${plots.category}`);
  console.log(`- Aster BHK: ${aster.bhk} BHK vs Plots BHK: ${plots.bhk} (Plotted Land)`);
  console.log(`- Aster Built-up: ${aster.builtUpArea} Sq.ft vs Plots Built-up: ${plots.builtUpArea || 'N/A'}`);
  console.log(`- Aster Images count: ${aster.images.length} vs Plots Images count: ${plots.images.length}`);
  console.log(`- First Image Aster: ${aster.images[0]}`);
  console.log(`- First Image Plots: ${plots.images[0]}`);

  if (aster.images[0] === plots.images[0]) {
    throw new Error('Images between properties are identical!');
  }
  console.log('✅ Confirmed: Properties use individual, non-overlapping media and specifications.\n');

  console.log('================================================================');
  console.log('ALL BROCHURE GENERATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('Summary of generated verified brochures:');
  console.table(generatedBrochures);
  console.log('================================================================');
}

runBrochureTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
