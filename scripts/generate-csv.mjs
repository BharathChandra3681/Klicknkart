/**
 * Generates a Shopify-compatible products CSV.
 * Run: node scripts/generate-csv.mjs
 * Output: scripts/shopify-products.csv
 */

import { writeFileSync } from 'fs';

const CATALOG = [
  { type: 'Paper', products: ['A0 Paper','A3 Paper - Ream (Gold)','A3 Paper - Paper Line','A4 Paper - Ream (Gold)','A4 Paper - Paperline','A4 Paper Color - Ream (Gold)'] },
  { type: 'Pens & Pencils', products: ['Pen G-2 Black','Pen G-2 Blue','Pen V-2 Black','Pen V-2 Blue','Pen V-2 Red','Pencil 2B','Pencil Sharpener Large','Pencil Sharpener Small','Eraser','Correction Tape','Tipex Small','Tipex Kenko'] },
  { type: 'Files & Folders', products: ['Binder File 2 Ring - Small (ESPP)','Binder File 2 Ring - A4 White (ESPP)','Binder File 2 Ring - Large (ESPP)','Binder File 2 Ring - A4 Large (Bantex)','Binder File 2 Ring - A4 Small (Bantex)','Hanging Files','Box File','Box File Plastic','A4 Divider - Abjad','A4 Divider - Number','Divider Blank','A4 Manila Folder','A4 Plastic Folder / Sheet Protector (Pack of 10)','A4 Plastic Folder / Sheet Protector (Pack of 20)','A4 Binding Plastic','Binding Plastic 18M','F4 Binding Plastic','Clear Bag','Clear Folder'] },
  { type: 'Envelopes & Holders', products: ['A4 Envelope Air Mail','Envelope Large','Envelope Medium','Envelope Small 140mm / 110mm JAYA','Business Card Holder','Business File Folder'] },
  { type: 'Staplers & Punches', products: ['Stapler Large','Stapler No 10','Stapler No 24/6','Staples No 10','Staples No 24/6','Staples Remover','2 Hole Punch Medium','2 Hole Punch Small','Extra 2 Hole Large Punch'] },
  { type: 'Batteries', products: ['Battery Alkaline AA','Battery Alkaline AAA','Battery C','Battery D','Battery Alkaline 9 Volt','Battery for Pointer - 27A','Battery for Pointer - 23AE','Battery for Pointer - CR 2025','Battery for Pointer - CR 2032'] },
  { type: 'Binders & Clips', products: ['Binder Clips No 107','Binder Clips No 155','Binder Clips No 260','Paper Clip No 5','Paper Clips Trigonal No 3','Paper Clip Trigonal Large','Binding Machine','A4 Binding Cover Paper','Plastic Ring 20mm','Plastic Ring 18mm','Plastic Ring 16mm','Plastic Ring 14mm','Plastic Ring 10mm'] },
  { type: 'Calculators', products: ['Calculator CASIO GX-125','Calculator CASIO AX120S','Calculator CASIO JJ-120D'] },
  { type: 'ICT & Accessories', products: ['CD Case Black','CD Case Red','CD RW','USB Flash Disk 4GB','Flash Disk USB 8GB','Flash Disk USB 16GB','Flash Disk USB 32GB','Mouse Pad','Wireless Mouse','Pointer','Cable Extension Roll','Cable Extension Regular'] },
  { type: 'Books & Notes', products: ['Spiral Note Book A5','Spiral Note Book Large','Spiral Note Book Small','Sign Here Flag','Stick Notes 654','Stick Notes 655','Stick Notes 656'] },
  { type: 'Board & Markers', products: ['White Board Large','White Board 150mm x 100mm (Medium)','White Board Eraser','Flip Chart','Flip Chart Paper','White Board Marker Black','White Board Marker Blue','White Board Marker Red','White Board Marker Green','Permanent Marker Black','Permanent Marker Blue','Permanent Marker Red','Permanent Marker Green','Highlighter Yellow','Highlighter Green','Highlighter Blue','Highlighter Pink','Highlighter Purple'] },
  { type: 'Tapes & Glue', products: ['Double Side Tape Green','Double Side Tape White','Cloth Tape 24mm','Cloth Tape 48mm','Cloth Tape Roll Small','Duct Tape','Cloth Tape 12mm','Gel Cleaner','Glue Gun','Stick Glue','Glue Stick Uhu Large'] },
  { type: 'Scissors & Pins', products: ['Scissor','Scissor Large','Cutter L-500','Deskset','Magnet Pin Big','Magnet Pin Small','Push Pin'] },
  { type: 'Trays & Dispensers', products: ['Document Tray 3 Layers','Organiser Desk Dispenser'] },
  { type: 'Rulers, Stamps & Tissue', products: ['Ruler Circle 15cm','Ruler Triangle','Stamp Ink','Stamp Pad','Tissue Box Passeo','Tissue Box Nice'] },
  { type: 'Printer Toners', products: ['HP LaserJet P1102 Toner','RICOH MP 2014D Toner','Kyocera ECOsys M3040idn Toner','HP LaserJet P2025 (CE505A) Toner','HP Deskjet 6943 Ink','HP Deskjet 6943 Toner'] },
];

function toHandle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const headers = [
  'Handle','Title','Body (HTML)','Vendor','Product Category','Type','Tags',
  'Published','Option1 Name','Option1 Value','Variant SKU',
  'Variant Inventory Tracker','Variant Inventory Qty','Variant Inventory Policy',
  'Variant Fulfillment Service','Variant Price','Variant Requires Shipping',
  'Variant Taxable','Status',
];

const rows = [headers.join(',')];

for (const { type, products } of CATALOG) {
  for (const title of products) {
    const handle = toHandle(title);
    const row = [
      handle,
      `"${title}"`,
      `"<p>${title}</p>"`,
      'KlicknKart',
      'Office Supplies',
      `"${type}"`,
      `"${type},stationery,office-supplies"`,
      'true',
      'Title',
      'Default Title',
      handle.substring(0, 40),
      'shopify',
      '100',
      'deny',
      'manual',
      '0.00',
      'true',
      'true',
      'active',
    ];
    rows.push(row.join(','));
  }
}

const csv = rows.join('\n');
writeFileSync('scripts/shopify-products.csv', csv);

const total = CATALOG.reduce((sum, c) => sum + c.products.length, 0);
console.log(`✅ Generated scripts/shopify-products.csv`);
console.log(`   ${CATALOG.length} categories | ${total} products`);
