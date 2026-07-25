#!/usr/bin/env node

/**
 * Import the Neelkanth product catalogue into MongoDB.
 *
 * Usage:
 *   node src/scripts/importCatalogue.js              # dry-run (default)
 *   node src/scripts/importCatalogue.js --execute     # write to DB
 *   node src/scripts/importCatalogue.js --execute --skip-images
 *
 * Reads from:  ../../data/neelkanth-catalog/products.json
 *              ../../data/neelkanth-catalog/products-full-details.md
 *              ../../data/neelkanth-catalog/images/product-images/*.jpg
 *
 * Upserts on slug — safe to re-run.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--execute');
const SKIP_IMAGES = args.includes('--skip-images');

// ── Paths ──────────────────────────────────────────────
const DATA_DIR = resolve(__dirname, '../../../data/neelkanth-catalog');
const JSON_PATH = resolve(DATA_DIR, 'products.json');
const DETAILS_PATH = resolve(DATA_DIR, 'products-full-details.md');
const IMAGES_DIR = resolve(DATA_DIR, 'images/product-images');

// ── Lazy-load models after mongoose is connected ──────
let Product, Category, HealthTag, Order, Cart, Wishlist;

async function loadModels() {
  const models = await import('../models/index.js');
  Product = models.Product;
  Category = models.Category;
  HealthTag = models.HealthTag;
  Order = models.Order;
  Cart = models.Cart;
  Wishlist = models.Wishlist;
}

// ── Cloudinary config (only if uploading images) ──────
function configureCloudinary() {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) {
    console.warn('⚠  Cloudinary env vars missing — image upload will be skipped');
    return false;
  }
  cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret, secure: true });
  return true;
}

// ── Parse full-details markdown into keyed sections ───
function parseFullDetails(mdContent) {
  const sections = {};
  const blocks = mdContent.split(/^## /m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const titleLine = lines[0].trim();
    if (!titleLine || titleLine.startsWith('#')) continue;

    const sectionContent = lines.slice(1).join('\n').trim();
    sections[titleLine] = sectionContent;
  }
  return sections;
}

function extractField(section, label) {
  if (!section) return null;
  const regex = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)(?=\\n\\*\\*|$)`, 's');
  const match = section.match(regex);
  return match ? match[1].trim() : null;
}

function extractListItems(section, headerPattern) {
  if (!section) return [];
  const headerRegex = new RegExp(`\\*\\*${headerPattern}:\\*\\*`, 'i');
  const headerMatch = section.match(headerRegex);
  if (!headerMatch) return [];

  const afterHeader = section.slice(headerMatch.index + headerMatch[0].length);
  const items = [];
  const lines = afterHeader.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      items.push(trimmed.slice(2).trim());
    } else if (trimmed === '' && items.length > 0) {
      break;
    } else if (items.length > 0 && !trimmed.startsWith('-') && !trimmed.startsWith('*') && trimmed !== '') {
      break;
    }
  }
  return items;
}

function extractIngredients(section) {
  if (!section) return [];
  const ingredients = [];

  const ingredientHeaders = [
    'Key Ingredients',
    'Key Ingredients (per 5ml)',
    'Key Ingredients (49 ingredients with amounts per serving)',
    'Key Ingredient Groups',
  ];

  for (const header of ingredientHeaders) {
    const regex = new RegExp(`\\*\\*${header.replace(/[()]/g, '\\$&')}:?\\*\\*`, 'i');
    const match = section.match(regex);
    if (!match) continue;

    const afterHeader = section.slice(match.index + match[0].length);
    const lines = afterHeader.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2).trim();
        const dashMatch = content.match(/^(.+?)\s*[-—]\s*(.+)$/);
        const parenMatch = content.match(/^(.+?)\s*\((.+?)\)$/);

        if (dashMatch) {
          ingredients.push({ name: dashMatch[1].trim(), quantity: dashMatch[2].trim() });
        } else if (parenMatch) {
          ingredients.push({ name: `${parenMatch[1].trim()} (${parenMatch[2].trim()})` });
        } else {
          ingredients.push({ name: content });
        }
      } else if (/^\d+\.\s/.test(trimmed)) {
        const numContent = trimmed.replace(/^\d+\.\s*/, '');
        const parts = numContent.split(/,\s*/);
        for (const part of parts) {
          const pMatch = part.trim().match(/^(.+?)\s+(\d+\s*mg.*)$/i);
          if (pMatch) {
            ingredients.push({ name: pMatch[1].trim(), quantity: pMatch[2].trim() });
          } else {
            ingredients.push({ name: part.trim() });
          }
        }
      } else if (trimmed === '' && ingredients.length > 0) {
        continue;
      } else if (trimmed.startsWith('**') && ingredients.length > 0) {
        break;
      }
    }
    if (ingredients.length > 0) break;
  }

  return ingredients;
}

function extractBenefits(section) {
  if (!section) return [];
  const benefits = [];
  const match = section.match(/\*\*Benefits:\*\*/i);
  if (!match) return [];

  const afterMatch = section.slice(match.index + match[0].length);
  const lines = afterMatch.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      benefits.push(trimmed.slice(2).trim());
    } else if (trimmed === '' && benefits.length > 0) {
      continue;
    } else if (benefits.length > 0 && !trimmed.startsWith('-')) {
      break;
    }
  }
  return benefits;
}

function extractPrecautions(section) {
  if (!section) return null;
  const items = extractListItems(section, 'Precautions');
  if (items.length > 0) return items.join('. ');

  const noteMatch = section.match(/\*\*Note:\*\*\s*(.+)/);
  if (noteMatch) return noteMatch[1].trim();

  const disclaimerMatch = section.match(/\*\*Disclaimer:\*\*\s*(.+)/);
  if (disclaimerMatch) return disclaimerMatch[1].trim();

  return null;
}

// ── Category & HealthTag resolution ───────────────────
const categoryCache = new Map();
const healthTagCache = new Map();

async function resolveCategory(name) {
  const key = name.toLowerCase().trim();
  if (categoryCache.has(key)) return categoryCache.get(key);

  let cat = await Category.findOne({ name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } });
  if (!cat) {
    if (DRY_RUN) {
      console.log(`  [DRY] Would create category: "${name}"`);
      categoryCache.set(key, 'dry-run-id');
      return 'dry-run-id';
    }
    cat = await Category.create({ name, isActive: true });
    console.log(`  ✓ Created category: "${name}" (${cat._id})`);
  }
  categoryCache.set(key, cat._id);
  return cat._id;
}

async function resolveHealthTag(name) {
  const key = name.toLowerCase().trim();
  if (healthTagCache.has(key)) return healthTagCache.get(key);

  let tag = await HealthTag.findOne({ name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } });
  if (!tag) {
    if (DRY_RUN) {
      console.log(`  [DRY] Would create health tag: "${name}"`);
      healthTagCache.set(key, 'dry-run-id');
      return 'dry-run-id';
    }
    tag = await HealthTag.create({ name, isActive: true });
    console.log(`  ✓ Created health tag: "${name}" (${tag._id})`);
  }
  healthTagCache.set(key, tag._id);
  return tag._id;
}

async function resolveHealthTags(concerns) {
  if (!concerns || concerns.length === 0) return [];
  const ids = [];
  for (const concern of concerns) {
    const trimmed = concern.trim();
    if (trimmed) {
      const id = await resolveHealthTag(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
      ids.push(id);
    }
  }
  return ids;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Image upload ──────────────────────────────────────
const UPLOAD_FOLDER = 'neelkanth/products';

async function uploadImage(filePath, slug) {
  const buffer = readFileSync(filePath);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        public_id: `${Date.now()}-${slug}`,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// ── Main import logic ─────────────────────────────────
async function importProducts() {
  // Read source data
  if (!existsSync(JSON_PATH)) {
    console.error(`❌ products.json not found at: ${JSON_PATH}`);
    process.exit(1);
  }

  const productsData = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));
  console.log(`📦 Found ${productsData.length} products in catalogue\n`);

  // Read full details
  let fullDetails = {};
  if (existsSync(DETAILS_PATH)) {
    const mdContent = readFileSync(DETAILS_PATH, 'utf-8');
    fullDetails = parseFullDetails(mdContent);
    console.log(`📄 Parsed ${Object.keys(fullDetails).length} product detail sections\n`);
  } else {
    console.warn('⚠  products-full-details.md not found — importing without long descriptions\n');
  }

  const cloudinaryReady = !SKIP_IMAGES && configureCloudinary();
  const imagesAvailable = existsSync(IMAGES_DIR);

  if (!SKIP_IMAGES && !imagesAvailable) {
    console.warn(`⚠  Image directory not found at: ${IMAGES_DIR}`);
    console.warn('   Run with --skip-images or add images to that directory\n');
  }

  // Summary tracking
  const summary = [];
  const importedProductIds = new Set();

  for (const p of productsData) {
    console.log(`\n── ${p.name} (${p.sku}) ──`);

    // Resolve category
    const categoryId = await resolveCategory(p.category);

    // Resolve health tags
    const healthTagIds = await resolveHealthTags(p.health_concerns || []);

    // Find matching full detail section — exact name match first, then fuzzy
    let detailKey = Object.keys(fullDetails).find(
      (k) => k.toLowerCase() === p.name.toLowerCase()
    );
    if (!detailKey) {
      detailKey = Object.keys(fullDetails).find((k) => {
        const kNorm = k.toLowerCase().replace(/^neelkanth\s+/i, '').trim();
        const pNorm = p.name.toLowerCase().replace(/^neelkanth\s+/i, '').trim();
        return kNorm === pNorm;
      });
    }
    if (!detailKey) {
      const slugWords = p.slug.replace(/-/g, ' ');
      detailKey = Object.keys(fullDetails).find((k) => {
        const kSlug = k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        return kSlug === slugWords;
      });
    }
    const detail = detailKey ? fullDetails[detailKey] : null;

    // Extract structured data from full details
    const benefits = detail ? extractBenefits(detail) : [];
    const ingredients = detail ? extractIngredients(detail) : [];
    const dosageRaw = detail ? extractField(detail, 'Dosage') : null;
    const directionsRaw = detail ? extractField(detail, 'Directions') : null;
    const precautions = detail ? extractPrecautions(detail) : null;

    // Build description from full detail section
    let description = null;
    if (detail) {
      description = detail;
    }

    // Determine status
    let status = 'active';
    let draftReason = null;

    if (p.mrp_inr === null || p.mrp_inr === undefined) {
      status = 'draft';
      draftReason = 'Price not stated';
    } else if (p.launching_soon) {
      status = 'draft';
      draftReason = 'Launching soon';
    }

    const price = (p.mrp_inr !== null && p.mrp_inr !== undefined) ? Number(p.mrp_inr) : 0;

    // Build product data
    const productData = {
      name: p.name,
      sku: p.sku,
      shortDescription: p.short_description || '',
      description: description || '',
      category: categoryId,
      healthTags: healthTagIds,
      packSize: p.pack_size || '',
      form: p.form,
      price,
      stock: 0,
      lowStockThreshold: 5,
      hsnCode: p.hsn_code,
      gstRate: Number(p.gst_rate),
      isFeatured: false,
      status,
      ingredients: ingredients.length > 0 ? ingredients : [],
      dosage: dosageRaw || '',
      directions: directionsRaw || '',
      benefits: benefits.length > 0 ? benefits : [],
      indications: (p.health_concerns || []).map(
        (c) => c.trim().charAt(0).toUpperCase() + c.trim().slice(1)
      ),
      precautions: precautions || '',
    };

    let action = 'skip';
    let imageUploaded = false;

    if (DRY_RUN) {
      const existing = await Product.findOne({ sku: p.sku }).lean();
      action = existing ? 'would update' : 'would create';
      const displaySlug = existing ? existing.slug : '(auto from name)';
      console.log(`  [DRY] ${action}: sku="${p.sku}", status=${status}, price=₹${price}`);
      if (detail) console.log(`  [DRY] Matched detail section: "${detailKey}"`);
      console.log(`  [DRY] Benefits: ${benefits.length}, Ingredients: ${ingredients.length}`);
      if (existing) importedProductIds.add(existing._id.toString());
    } else {
      // Upsert on SKU (slug auto-generates from name via pre-validate hook)
      const existing = await Product.findOne({ sku: p.sku });

      if (existing) {
        // Update existing — preserve images
        const { images: _keepImages, ...updateData } = productData;
        Object.assign(existing, updateData);
        await existing.save();
        action = 'updated';
        importedProductIds.add(existing._id.toString());
        console.log(`  ✓ Updated: ${existing.slug} (sku=${p.sku})`);
      } else {
        // Create new
        const newProduct = new Product(productData);
        await newProduct.save();
        action = 'created';
        importedProductIds.add(newProduct._id.toString());
        console.log(`  ✓ Created: ${newProduct.slug} (sku=${p.sku})`);
      }

      // Handle image upload
      if (!SKIP_IMAGES && cloudinaryReady && imagesAvailable) {
        const product = await Product.findOne({ sku: p.sku });
        if (product.images.length === 0) {
          const imageFile = resolve(IMAGES_DIR, p.image_file);
          if (existsSync(imageFile)) {
            try {
              const { url, publicId } = await uploadImage(imageFile, p.slug);
              product.images.push({ url, publicId, alt: p.name, isPrimary: true });
              await product.save();
              imageUploaded = true;
              console.log(`  ✓ Image uploaded: ${p.image_file}`);
            } catch (err) {
              console.error(`  ✗ Image upload failed: ${err.message}`);
            }
          } else {
            console.warn(`  ⚠ Image file not found: ${imageFile}`);
          }
        } else {
          console.log(`  ⏭ Image already exists — skipped`);
          imageUploaded = true;
        }
      }
    }

    // Get actual slug from DB for summary
    let actualSlug = p.slug;
    if (!DRY_RUN) {
      const saved = await Product.findOne({ sku: p.sku }, 'slug').lean();
      if (saved) actualSlug = saved.slug;
    }

    summary.push({
      slug: actualSlug,
      sku: p.sku,
      action,
      image: imageUploaded ? 'yes' : (SKIP_IMAGES ? 'skipped' : 'no'),
      status,
      draftReason: draftReason || '—',
      price: price > 0 ? `₹${price}` : '₹0 (not stated)',
    });
  }

  return { summary, importedProductIds };
}

// ── Handle dummy / non-catalogue products ─────────────
async function retireDummyProducts(importedIds) {
  const allProducts = await Product.find({}, 'name slug sku status').lean();
  const dummies = allProducts.filter((p) => !importedIds.has(p._id.toString()));

  if (dummies.length === 0) {
    console.log('\n  No dummy products to retire.\n');
    return;
  }

  console.log(`\n── Dummy Products Found: ${dummies.length} ──`);

  for (const dummy of dummies) {
    console.log(`\n  Dummy: "${dummy.name}" (${dummy.sku}) [${dummy.status}]`);

    const inOrders = await Order.countDocuments({ 'items.product': dummy._id });
    const inCarts = await Cart.countDocuments({ 'items.product': dummy._id });
    const inWishlists = await Wishlist.countDocuments({ 'items.product': dummy._id });

    console.log(`    Orders: ${inOrders}, Carts: ${inCarts}, Wishlists: ${inWishlists}`);

    if (DRY_RUN) {
      if (inOrders > 0) {
        console.log(`    [DRY] Would archive (soft-delete) — referenced in orders`);
      } else {
        if (inCarts > 0) console.log(`    [DRY] Would remove from ${inCarts} cart(s)`);
        if (inWishlists > 0) console.log(`    [DRY] Would remove from ${inWishlists} wishlist(s)`);
        console.log(`    [DRY] Would hard-delete`);
      }
    } else {
      if (inOrders > 0) {
        await Product.updateOne({ _id: dummy._id }, { status: 'archived' });
        console.log(`    ✓ Archived (soft-delete) — referenced in ${inOrders} order(s)`);
      } else {
        if (inCarts > 0) {
          await Cart.updateMany(
            { 'items.product': dummy._id },
            { $pull: { items: { product: dummy._id } } }
          );
          console.log(`    ✓ Removed from ${inCarts} cart(s)`);
        }
        if (inWishlists > 0) {
          await Wishlist.updateMany(
            { 'items.product': dummy._id },
            { $pull: { items: { product: dummy._id } } }
          );
          console.log(`    ✓ Removed from ${inWishlists} wishlist(s)`);
        }
        await Product.deleteOne({ _id: dummy._id });
        console.log(`    ✓ Hard-deleted`);
      }
    }
  }
}

// ── Check for dummy products / existing data ──────────
async function auditExistingData() {
  const productCount = await Product.countDocuments({});
  const orderCount = await Order.countDocuments({});
  const cartCount = await Cart.countDocuments({});
  const wishlistCount = await Wishlist.countDocuments({});

  console.log('── Existing Data Audit ──');
  console.log(`  Products:  ${productCount}`);
  console.log(`  Orders:    ${orderCount}`);
  console.log(`  Carts:     ${cartCount}`);
  console.log(`  Wishlists: ${wishlistCount}`);

  if (productCount > 0) {
    const products = await Product.find({}, 'name slug sku status').lean();
    console.log('\n  Existing products:');
    for (const p of products) {
      console.log(`    - ${p.name} (${p.sku}) [${p.status}]`);
    }

    // Check references
    const productIds = products.map((p) => p._id);
    const referencedInOrders = await Order.distinct('items.product', {
      'items.product': { $in: productIds },
    });
    const referencedInCarts = await Cart.distinct('items.product', {
      'items.product': { $in: productIds },
    });
    const referencedInWishlists = await Wishlist.distinct('items.product', {
      'items.product': { $in: productIds },
    });

    console.log(`\n  Products referenced in orders:    ${referencedInOrders.length}`);
    console.log(`  Products referenced in carts:     ${referencedInCarts.length}`);
    console.log(`  Products referenced in wishlists: ${referencedInWishlists.length}`);
  }

  return productCount;
}

// ── Print gap list (fields that are empty/not stated) ─
function printGapList(summary, productsData) {
  console.log('\n══════════════════════════════════════════');
  console.log('  FIELDS NOT STATED / GAPS FOR CLIENT');
  console.log('══════════════════════════════════════════\n');

  const gaps = [];
  for (const p of productsData) {
    const productGaps = [];
    if (p.mrp_inr === null || p.mrp_inr === undefined) {
      productGaps.push('price (MRP)');
    }
    if (!p.pack_size || p.pack_size === 'Not stated') {
      productGaps.push('pack size');
    }
    if (p.launching_soon) {
      productGaps.push('LAUNCHING SOON — needs launch date');
    }
    if (productGaps.length > 0) {
      gaps.push({ name: p.name, sku: p.sku, missing: productGaps });
    }
  }

  if (gaps.length === 0) {
    console.log('  No gaps found — all products have required fields.\n');
  } else {
    for (const g of gaps) {
      console.log(`  ${g.sku} — ${g.name}`);
      for (const m of g.missing) {
        console.log(`    ⚠ ${m}`);
      }
    }
  }
}

// ── Entry point ───────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Neelkanth Catalogue Import Script       ║');
  console.log(`║  Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'EXECUTE (writing to DB)'}        ║`);
  console.log(`║  Images: ${SKIP_IMAGES ? 'SKIPPED' : 'ENABLED'}                          ║`);
  console.log('╚══════════════════════════════════════════╝\n');

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }
  console.log(`🔌 Connecting to: ${mongoUri.replace(/\/\/(.+?)@/, '//*****@')}`);
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB\n');

  // Load models
  await loadModels();

  // Audit existing data
  const existingCount = await auditExistingData();
  console.log('');

  // Backup existing products (if any) before modifying
  if (existingCount > 0 && !DRY_RUN) {
    const allProducts = await Product.find({}).lean();
    const backupPath = resolve(__dirname, `../../../data/backup-products-${Date.now()}.json`);
    const { writeFileSync } = await import('fs');
    writeFileSync(backupPath, JSON.stringify(allProducts, null, 2));
    console.log(`📋 Backed up ${allProducts.length} existing product(s) to: ${backupPath}\n`);
  }

  // Run import
  const productsData = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));
  const { summary, importedProductIds } = await importProducts();

  // Retire dummy products (any product not in the set of just-imported IDs)
  await retireDummyProducts(importedProductIds);

  // Print summary table
  console.log('\n══════════════════════════════════════════');
  console.log('  IMPORT SUMMARY');
  console.log('══════════════════════════════════════════\n');

  const colWidths = { slug: 28, sku: 8, action: 14, image: 8, status: 10, price: 12, reason: 20 };
  const header = [
    'Slug'.padEnd(colWidths.slug),
    'SKU'.padEnd(colWidths.sku),
    'Action'.padEnd(colWidths.action),
    'Image'.padEnd(colWidths.image),
    'Status'.padEnd(colWidths.status),
    'Price'.padEnd(colWidths.price),
    'Draft Reason'.padEnd(colWidths.reason),
  ].join(' | ');

  console.log(header);
  console.log('-'.repeat(header.length));

  for (const row of summary) {
    console.log([
      row.slug.padEnd(colWidths.slug),
      row.sku.padEnd(colWidths.sku),
      row.action.padEnd(colWidths.action),
      row.image.padEnd(colWidths.image),
      row.status.padEnd(colWidths.status),
      (row.price || '').toString().padEnd(colWidths.price),
      row.draftReason.padEnd(colWidths.reason),
    ].join(' | '));
  }

  // Stats
  const created = summary.filter((r) => r.action === 'created' || r.action === 'would create').length;
  const updated = summary.filter((r) => r.action === 'updated' || r.action === 'would update').length;
  const drafts = summary.filter((r) => r.status === 'draft').length;
  const active = summary.filter((r) => r.status === 'active').length;
  const imagesUploaded = summary.filter((r) => r.image === 'yes').length;

  console.log(`\n  Total: ${summary.length} | Created: ${created} | Updated: ${updated}`);
  console.log(`  Active: ${active} | Draft: ${drafts} | Images: ${imagesUploaded}\n`);

  // Print gap list
  printGapList(summary, productsData);

  // Image format warning
  console.log('\n══════════════════════════════════════════');
  console.log('  ⚠  IMAGE FORMAT NOTE');
  console.log('══════════════════════════════════════════');
  console.log('  Product banners are landscape (3000x1690).');
  console.log('  Frontend product cards use 1:1 square with');
  console.log('  object-fit: cover (center-crop).');
  console.log('  Consider replacing with square packshot photos.\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
