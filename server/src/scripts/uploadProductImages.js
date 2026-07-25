/**
 * Set product images from local static files in client/public/images/products/.
 *
 * Usage:
 *   node src/scripts/uploadProductImages.js              # dry-run (default)
 *   node src/scripts/uploadProductImages.js --execute     # write to DB
 *
 * When Cloudinary credentials are available, re-upload via admin panel.
 * For now, images are served statically from the Vite public directory.
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = resolve(__dirname, '../../../client/public/images/products');

const EXECUTE = process.argv.includes('--execute');

// Image filename → product SKU mapping (verified by visual inspection)
const IMAGE_MAP = [
  { file: '02-neelkanth-jst-d9-60-capsules.png',              sku: 'NGW001A' },
  { file: '02b-neelkanth-jst-d9-30-capsules.png',             sku: 'NGW001B' },
  { file: '03-neelkanth-painmukta-gold.png',                  sku: 'NGW008'  },
  { file: '04-neelkanth-pain-relief-oil.png',                  sku: 'NGW006'  },
  { file: '05-neelkanth-kafma-cough-syrup-100ml.png',         sku: 'NGW023'  },
  { file: '06-neelkanth-kafma-capsules-30.png',               sku: 'NGW024'  },
  { file: '07-neelkanth-ng21-superfood-berry-blend-120.png',  sku: 'NGW003'  },
  { file: '08-neelkanth-insulin-g10-40g.png',                  sku: 'NGW004'  },
  { file: '12-neelkanth-green-tea-effervescent-60.png',       sku: 'NGW011'  },
  { file: '13-neelkanth-cholestrix-tablets.png',               sku: 'NGW002'  },
  { file: '14-neelkanth-mg17-migraine-capsules.png',          sku: 'NGW014'  },
  { file: '15-neelkanth-happy-hair.png',                       sku: 'NGW016'  },
  { file: '16-neelkanth-fever-relief-tablets-30.png',         sku: 'NGW015'  },
  { file: '17-neelkanth-ojas-capsules-men-30.png',            sku: 'NGW010'  },
  { file: '18-neelkanth-ojas-capsules-women.png',             sku: 'NGW009'  },
  { file: '20-neelkanth-kranti-balm.png',                      sku: 'NGW007'  },
  { file: '21-neelkanth-flaxseed-omega-369-softgels-60.png',  sku: 'NGW017'  },
  { file: '22-neelkanth-bp190-bp-control-drops.png',          sku: 'NGW018'  },
  { file: '24-neelkanth-palangtod-capsules.png',               sku: 'NGW020'  },
  { file: '25-neelkanth-herbal-potli.png',                     sku: 'NGW022'  },
];

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║  Product Image Setup (static files)      ║`);
  console.log(`║  Mode: ${EXECUTE ? 'EXECUTE' : 'DRY RUN'}                             ║`);
  console.log('╚══════════════════════════════════════════╝\n');

  let missingFiles = 0;
  for (const entry of IMAGE_MAP) {
    if (!existsSync(resolve(PUBLIC_IMAGES, entry.file))) {
      console.error(`  MISSING: ${entry.file}`);
      missingFiles++;
    }
  }
  if (missingFiles > 0) {
    console.error(`\n${missingFiles} image file(s) missing. Aborting.`);
    process.exit(1);
  }
  console.log(`  All ${IMAGE_MAP.length} image files verified.\n`);

  console.log(`  Connecting to MongoDB...`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`  Connected.\n`);

  let updated = 0;
  let skipped = 0;

  for (const { file, sku } of IMAGE_MAP) {
    process.stdout.write(`  ${sku.padEnd(8)} `);

    const product = await Product.findOne({ sku });
    if (!product) {
      console.log(`SKIP (not found)`);
      skipped++;
      continue;
    }

    if (product.images?.length > 0) {
      console.log(`SKIP (already has image)`);
      skipped++;
      continue;
    }

    const url = `/images/products/${file}`;

    if (!EXECUTE) {
      console.log(`WOULD SET → ${url}`);
      continue;
    }

    product.images = [{ url, alt: product.name, isPrimary: true }];
    await product.save();
    console.log(`SET → ${url}`);
    updated++;
  }

  // Summary
  console.log('\n══════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════\n');
  console.log(`  Total mapped:  ${IMAGE_MAP.length}`);
  console.log(`  Updated:       ${updated}`);
  console.log(`  Skipped:       ${skipped}`);

  const noImage = await Product.find(
    { status: { $in: ['active', 'draft', 'out_of_stock'] }, $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] }
  ).select('sku name').lean();

  if (noImage.length > 0) {
    console.log(`\n  Products still without images (${noImage.length}):`);
    for (const p of noImage) {
      console.log(`    ${p.sku} — ${p.name}`);
    }
  }

  await mongoose.disconnect();
  console.log('\n  Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
