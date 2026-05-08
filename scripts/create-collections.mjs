/**
 * Creates all Klicknkart collections in Shopify via Admin API.
 * Usage: node scripts/create-collections.mjs
 *
 * Requires in .env.local (root):
 *   SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
 *   SHOPIFY_ADMIN_API_TOKEN=shpat_xxxx
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local from root
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local');
  try {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key) env[key.trim()] = rest.join('=').trim();
    }
    return env;
  } catch {
    console.error('Could not read .env.local — make sure it exists at the project root.');
    process.exit(1);
  }
}

const env = loadEnv();
const DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const TOKEN  = env.SHOPIFY_ADMIN_API_TOKEN;

if (!DOMAIN || !TOKEN) {
  console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_TOKEN in .env.local');
  process.exit(1);
}

const API_URL = `https://${DOMAIN}/admin/api/2024-10/graphql.json`;

const COLLECTIONS = [
  { title: 'Paper',                  handle: 'paper',                  description: 'Copy paper, specialty paper, and all paper products.' },
  { title: 'Pens & Pencils',         handle: 'pens-pencils',           description: 'Gel pens, ballpoints, markers, graphite and mechanical pencils.' },
  { title: 'Files & Folders',        handle: 'files-folders',          description: 'Binder files, box files, manila folders and plastic folders.' },
  { title: 'Envelopes & Holders',    handle: 'envelopes-holders',      description: 'Envelopes, document holders and mailing supplies.' },
  { title: 'Staplers & Punches',     handle: 'staplers-punches',       description: 'Staplers, staples, hole punches and binding tools.' },
  { title: 'Batteries',              handle: 'batteries',              description: 'AA, AAA, C, D and 9V batteries for all office devices.' },
  { title: 'Binders & Clips',        handle: 'binders-clips',          description: 'Ring binders, bulldog clips, paper clips and fasteners.' },
  { title: 'Calculators',            handle: 'calculators',            description: 'Scientific, financial and desktop calculators.' },
  { title: 'ICT & Accessories',      handle: 'ict-accessories',        description: 'Mice, keyboards, USB hubs, cables and computer peripherals.' },
  { title: 'Books & Notes',          handle: 'books-notes',            description: 'Notebooks, exercise books, sticky notes and memo pads.' },
  { title: 'Board Markers',          handle: 'board-markers',          description: 'Whiteboard markers, chalk markers and dry-erase supplies.' },
  { title: 'Tapes & Glue',           handle: 'tapes-glue',             description: 'Adhesive tapes, glue sticks, liquid glue and mounting tape.' },
  { title: 'Scissors & Pins',        handle: 'scissors-pins',          description: 'Scissors, drawing pins, thumbtacks and push pins.' },
  { title: 'Trays & Dispensers',     handle: 'trays-dispensers',       description: 'Desk trays, tape dispensers and desktop organisers.' },
  { title: 'Rulers, Stamps & Tissue',handle: 'rulers-stamps-tissue',   description: 'Rulers, date stamps, ink pads and tissue paper.' },
  { title: 'Printer Toners',         handle: 'printer-toners',         description: 'Ink cartridges, toner cartridges and printer accessories.' },
];

const CREATE_COLLECTION = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createCollection(collection) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':               'application/json',
      'X-Shopify-Access-Token':     TOKEN,
    },
    body: JSON.stringify({
      query: CREATE_COLLECTION,
      variables: {
        input: {
          title:       collection.title,
          handle:      collection.handle,
          bodyHtml:    `<p>${collection.description}</p>`,
          sortOrder:   'BEST_SELLING',
          published:   true,
        },
      },
    }),
  });

  const { data, errors } = await res.json();

  if (errors?.length) {
    throw new Error(errors.map(e => e.message).join(', '));
  }

  const { collection: created, userErrors } = data.collectionCreate;

  if (userErrors?.length) {
    throw new Error(userErrors.map(e => `${e.field}: ${e.message}`).join(', '));
  }

  return created;
}

async function main() {
  console.log(`Creating ${COLLECTIONS.length} collections in ${DOMAIN}...\n`);

  let created = 0;
  let skipped = 0;

  for (const col of COLLECTIONS) {
    try {
      const result = await createCollection(col);
      console.log(`✓  ${result.title}  →  /${result.handle}`);
      created++;
    } catch (err) {
      if (err.message.includes('Handle has already been taken')) {
        console.log(`–  ${col.title}  (already exists, skipped)`);
        skipped++;
      } else {
        console.error(`✗  ${col.title}  —  ${err.message}`);
      }
    }

    // small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`);
}

main();
