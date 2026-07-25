/**
 * Clean up raw-dump product descriptions.
 *
 * The import script stored the full markdown blob in the `description` field.
 * This script:
 *   1. Extracts a clean 1-2 sentence description from the product's shortDescription + features
 *   2. Moves storage/usage instructions to `directions` (if empty)
 *   3. Moves safety notes to `precautions` (if empty)
 *   4. Removes internal data (SKU, batch no, mfg license, manufacturer)
 *
 * Usage:
 *   node src/scripts/cleanDescriptions.js              # dry-run
 *   node src/scripts/cleanDescriptions.js --execute     # write to DB
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/index.js';

const EXECUTE = process.argv.includes('--execute');

function extractSection(text, heading) {
  const re = new RegExp(`\\*\\*${heading}:?\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

function buildCleanDescription(product) {
  const raw = product.description || '';

  // Extract features line
  const features = extractSection(raw, 'Features');
  const suitable = extractSection(raw, 'Suitable for');
  const important = extractSection(raw, 'Important');

  // Build clean description from shortDescription + features
  let desc = product.shortDescription || '';
  if (features) {
    desc += `. ${features}.`;
  }
  if (suitable) {
    desc += ` Suitable for ${suitable.toLowerCase()}.`;
  }
  // Clean up double periods
  desc = desc.replace(/\.\./g, '.').replace(/\s+/g, ' ').trim();

  // Directions: storage/usage instructions
  let directions = product.directions || '';
  if (!directions && important) {
    directions = important
      .replace(/^-\s*/gm, '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join('. ');
    if (directions && !directions.endsWith('.')) directions += '.';
  }

  // Dosage cleanup: remove markdown bullet dashes
  let dosage = product.dosage || '';
  dosage = dosage.replace(/^-\s*/gm, '').trim();

  // Precautions: keep existing or leave empty
  let precautions = product.precautions || '';

  return { description: desc, directions, dosage, precautions };
}

async function main() {
  console.log(`Mode: ${EXECUTE ? 'EXECUTE' : 'DRY RUN'}\n`);

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.\n');

  const products = await Product.find({});
  let updated = 0;

  for (const product of products) {
    const raw = product.description || '';
    const isRawDump = raw.includes('**Image:**') || raw.includes('**SKU:**') || raw.includes('**Benefits:**');

    if (!isRawDump) {
      console.log(`${product.sku.padEnd(8)} SKIP (already clean)`);
      continue;
    }

    const clean = buildCleanDescription(product);

    console.log(`${product.sku.padEnd(8)} ${product.name}`);
    console.log(`         desc: "${clean.description.substring(0, 80)}..."`);
    if (clean.directions) console.log(`         dirs: "${clean.directions.substring(0, 80)}"`);
    if (clean.dosage !== product.dosage) console.log(`         dose: "${clean.dosage.substring(0, 80)}"`);

    if (EXECUTE) {
      product.description = clean.description;
      if (clean.directions && !product.directions) product.directions = clean.directions;
      if (clean.dosage) product.dosage = clean.dosage;
      await product.save();
      updated++;
    }

    console.log('');
  }

  console.log(`\n${EXECUTE ? 'Updated' : 'Would update'}: ${updated}/${products.length} products`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
