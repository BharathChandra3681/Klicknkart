/**
 * KlicknKart Shopify Seeder
 * Creates all collections and products from the stationery list.
 *
 * Usage:
 *   SHOPIFY_STORE_DOMAIN=kilcknkart.myshopify.com \
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx \
 *   node scripts/seed-shopify.mjs
 */

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = '2025-01';

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('Missing env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN');
  process.exit(1);
}

const ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// ── Product data from stationery list ────────────────────────────────────────

const CATALOG = [
  {
    collection: { title: 'Paper', handle: 'paper', description: 'A-series paper reams and printing paper' },
    products: [
      'A0 Paper',
      'A3 Paper - Ream (Gold)',
      'A3 Paper - Paper Line',
      'A4 Paper - Ream (Gold)',
      'A4 Paper - Paperline',
      'A4 Paper Color - Ream (Gold)',
    ],
  },
  {
    collection: { title: 'Pens & Pencils', handle: 'pens-pencils', description: 'Pens, pencils, erasers and correction tools' },
    products: [
      'Pen G-2 Black',
      'Pen G-2 Blue',
      'Pen V-2 Black',
      'Pen V-2 Blue',
      'Pen V-2 Red',
      'Pencil 2B',
      'Pencil Sharpener Large',
      'Pencil Sharpener Small',
      'Eraser',
      'Correction Tape',
      'Tipex Small',
      'Tipex Kenko',
    ],
  },
  {
    collection: { title: 'Files & Folders', handle: 'files-folders', description: 'Binders, folders, dividers and file accessories' },
    products: [
      'Binder File 2 Ring - Small (ESPP)',
      'Binder File 2 Ring - A4 White (ESPP)',
      'Binder File 2 Ring - Large (ESPP)',
      'Binder File 2 Ring - A4 Large (Bantex)',
      'Binder File 2 Ring - A4 Small (Bantex)',
      'Hanging Files',
      'Box File',
      'Box File Plastic',
      'A4 Divider - Abjad',
      'A4 Divider - Number',
      'Divider Blank',
      'A4 Manila Folder',
      'A4 Plastic Folder / Sheet Protector (Pack of 10)',
      'A4 Plastic Folder / Sheet Protector (Pack of 20)',
      'A4 Binding Plastic',
      'Binding Plastic 18M',
      'F4 Binding Plastic',
      'Clear Bag',
      'Clear Folder',
    ],
  },
  {
    collection: { title: 'Envelopes & Holders', handle: 'envelopes-holders', description: 'Envelopes, business card and file holders' },
    products: [
      'A4 Envelope Air Mail',
      'Envelope Large',
      'Envelope Medium',
      'Envelope Small 140mm / 110mm JAYA',
      'Business Card Holder',
      'Business File Folder',
    ],
  },
  {
    collection: { title: 'Staplers & Punches', handle: 'staplers-punches', description: 'Staplers, staples and hole punches' },
    products: [
      'Stapler Large',
      'Stapler No 10',
      'Stapler No 24/6',
      'Staples No 10',
      'Staples No 24/6',
      'Staples Remover',
      '2 Hole Punch Medium',
      '2 Hole Punch Small',
      'Extra 2 Hole Large Punch',
    ],
  },
  {
    collection: { title: 'Batteries', handle: 'batteries', description: 'Alkaline batteries in all sizes' },
    products: [
      'Battery Alkaline AA',
      'Battery Alkaline AAA',
      'Battery C',
      'Battery D',
      'Battery Alkaline 9 Volt',
      'Battery for Pointer - 27A',
      'Battery for Pointer - 23AE',
      'Battery for Pointer - CR 2025',
      'Battery for Pointer - CR 2032',
    ],
  },
  {
    collection: { title: 'Binders & Clips', handle: 'binders-clips', description: 'Binder clips, paper clips and binding supplies' },
    products: [
      'Binder Clips No 107',
      'Binder Clips No 155',
      'Binder Clips No 260',
      'Paper Clip No 5',
      'Paper Clips Trigonal No 3',
      'Paper Clip Trigonal Large',
      'Binding Machine',
      'A4 Binding Cover Paper',
      'Plastic Ring 20mm',
      'Plastic Ring 18mm',
      'Plastic Ring 16mm',
      'Plastic Ring 14mm',
      'Plastic Ring 10mm',
    ],
  },
  {
    collection: { title: 'Calculators', handle: 'calculators', description: 'Desktop and scientific calculators' },
    products: [
      'Calculator CASIO GX-125',
      'Calculator CASIO AX120S',
      'Calculator CASIO JJ-120D',
    ],
  },
  {
    collection: { title: 'ICT & Accessories', handle: 'ict-accessories', description: 'USB drives, mice, cables and computer accessories' },
    products: [
      'CD Case Black',
      'CD Case Red',
      'CD RW',
      'USB Flash Disk 4GB',
      'Flash Disk USB 8GB',
      'Flash Disk USB 16GB',
      'Flash Disk USB 32GB',
      'Mouse Pad',
      'Wireless Mouse',
      'Pointer',
      'Cable Extension Roll',
      'Cable Extension Regular',
    ],
  },
  {
    collection: { title: 'Books & Notes', handle: 'books-notes', description: 'Notebooks, notepads and sticky notes' },
    products: [
      'Spiral Note Book A5',
      'Spiral Note Book Large',
      'Spiral Note Book Small',
      'Sign Here Flag',
      'Stick Notes 654',
      'Stick Notes 655',
      'Stick Notes 656',
    ],
  },
  {
    collection: { title: 'Board & Markers', handle: 'board-markers', description: 'Whiteboards, markers, highlighters and flip charts' },
    products: [
      'White Board Large',
      'White Board 150mm x 100mm (Medium)',
      'White Board Eraser',
      'Flip Chart',
      'Flip Chart Paper',
      'White Board Marker Black',
      'White Board Marker Blue',
      'White Board Marker Red',
      'White Board Marker Green',
      'Permanent Marker Black',
      'Permanent Marker Blue',
      'Permanent Marker Red',
      'Permanent Marker Green',
      'Highlighter Yellow',
      'Highlighter Green',
      'Highlighter Blue',
      'Highlighter Pink',
      'Highlighter Purple',
    ],
  },
  {
    collection: { title: 'Tapes & Glue', handle: 'tapes-glue', description: 'Adhesive tapes, glue sticks and gel cleaners' },
    products: [
      'Double Side Tape Green',
      'Double Side Tape White',
      'Cloth Tape 24mm',
      'Cloth Tape 48mm',
      'Cloth Tape Roll Small',
      'Duct Tape',
      'Cloth Tape 12mm',
      'Gel Cleaner',
      'Glue Gun',
      'Stick Glue',
      'Glue Stick Uhu Large',
    ],
  },
  {
    collection: { title: 'Scissors & Pins', handle: 'scissors-pins', description: 'Scissors, cutters, pins and desk sets' },
    products: [
      'Scissor',
      'Scissor Large',
      'Cutter L-500',
      'Deskset',
      'Magnet Pin Big',
      'Magnet Pin Small',
      'Push Pin',
    ],
  },
  {
    collection: { title: 'Trays & Dispensers', handle: 'trays-dispensers', description: 'Document trays and desk organisers' },
    products: [
      'Document Tray 3 Layers',
      'Organiser Desk Dispenser',
    ],
  },
  {
    collection: { title: 'Rulers, Stamps & Tissue', handle: 'rulers-stamps-tissue', description: 'Rulers, stamp pads, ink and tissue boxes' },
    products: [
      'Ruler Circle 15cm',
      'Ruler Triangle',
      'Stamp Ink',
      'Stamp Pad',
      'Tissue Box Passeo',
      'Tissue Box Nice',
    ],
  },
  {
    collection: { title: 'Printer Toners', handle: 'printer-toners', description: 'Ink and toner cartridges for printers' },
    products: [
      'HP LaserJet P1102 Toner',
      'RICOH MP 2014D Toner',
      'Kyocera ECOsys M3040idn Toner',
      'HP LaserJet P2025 (CE505A) Toner',
      'HP Deskjet 6943 Ink',
      'HP Deskjet 6943 Toner',
    ],
  },
];

// ── GraphQL helpers ───────────────────────────────────────────────────────────

async function adminQuery(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Collection creation ───────────────────────────────────────────────────────

async function createCollection(col) {
  const data = await adminQuery(`
    mutation CollectionCreate($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id title handle }
        userErrors { field message }
      }
    }
  `, {
    input: {
      title: col.title,
      handle: col.handle,
      descriptionHtml: `<p>${col.description}</p>`,
      sortOrder: 'BEST_SELLING',
    },
  });

  const { collection, userErrors } = data.collectionCreate;
  if (userErrors.length > 0) {
    throw new Error(`Collection error (${col.title}): ${userErrors.map(e => e.message).join(', ')}`);
  }
  return collection;
}

// ── Product creation ──────────────────────────────────────────────────────────

async function createProduct(title, collectionId) {
  const data = await adminQuery(`
    mutation ProductCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product { id title handle }
        userErrors { field message }
      }
    }
  `, {
    input: {
      title,
      status: 'ACTIVE',
      collectionsToJoin: [collectionId],
      variants: [
        {
          price: '0.00',
          inventoryManagement: 'SHOPIFY',
          inventoryPolicy: 'DENY',
        },
      ],
    },
  });

  const { product, userErrors } = data.productCreate;
  if (userErrors.length > 0) {
    throw new Error(`Product error (${title}): ${userErrors.map(e => e.message).join(', ')}`);
  }
  return product;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 KlicknKart Shopify Seeder`);
  console.log(`Store: ${STORE_DOMAIN}\n`);

  let totalCollections = 0;
  let totalProducts = 0;
  const errors = [];

  for (const category of CATALOG) {
    process.stdout.write(`📁 Creating collection: ${category.collection.title} ... `);

    let collection;
    try {
      collection = await createCollection(category.collection);
      console.log(`✅ ${collection.id}`);
      totalCollections++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      errors.push(err.message);
      continue;
    }

    await sleep(300);

    for (const productTitle of category.products) {
      process.stdout.write(`   📦 ${productTitle} ... `);
      try {
        const product = await createProduct(productTitle, collection.id);
        console.log(`✅`);
        totalProducts++;
      } catch (err) {
        console.log(`❌ ${err.message}`);
        errors.push(err.message);
      }
      await sleep(200);
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`✅ Collections created: ${totalCollections}`);
  console.log(`✅ Products created:    ${totalProducts}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors (${errors.length}):`);
    errors.forEach((e) => console.log(`   - ${e}`));
  }

  console.log(`\n🎉 Done! Visit your Shopify Admin to review and add prices/images.\n`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
