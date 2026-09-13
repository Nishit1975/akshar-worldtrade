import fs from 'fs'
import path from 'path'
import process from 'node:process'
import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url'
import { company } from '../src/config/company.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '../public/catalogue')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'Akshar-Worldtrade-Export-Catalogue.pdf')
const LOGO_3_PATH = path.join(__dirname, '../src/assets/LOGO 3.PNG')
const PRODUCTS_JSON_PATH = path.join(__dirname, 'cache_images/products.json')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

if (!fs.existsSync(LOGO_3_PATH)) {
  console.error(`ERROR: LOGO 3 not found at ${LOGO_3_PATH}`)
  process.exit(1)
}

if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
  console.error(`ERROR: Cached products not found at ${PRODUCTS_JSON_PATH}. Run 'python scripts/prepare-catalogue-images.py' first.`)
  process.exit(1)
}

const rawProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'))

// Filter out Milling Flours products if any remain
const products = rawProducts.filter(p => !p.category.toLowerCase().includes('flour'))

console.log(`Loaded ${products.length} active export products.`)
if (products.length !== 46) {
  console.warn(`Warning: Expected 46 active export products, found ${products.length}!`)
}

// Brand Palette
const NAVY_DARK = '#0B192C'
const NAVY_MAIN = '#1B365D'
const NAVY_LIGHT = '#F3F6FA'
const NAVY_BADGE = '#E8EFF8'
const GOLD_MAIN = '#C5A059'
const GOLD_DARK = '#9E7A32'
const GOLD_LIGHT = '#FDF8ED'
const GOLD_BORDER = '#E7D7B8'
const TEXT_DARK = '#151E2E'
const TEXT_BODY = '#334155'
const TEXT_MUTED = '#64748B'
const BORDER_COLOR = '#E2E8F0'
const BORDER_LIGHT = '#EDF2F7'
const WHITE = '#FFFFFF'

const TOTAL_PAGES = 32

// Official Social Media SVG Vector Paths (viewBox: 0 0 24 24)
const SVG_INSTAGRAM = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
const SVG_FACEBOOK = 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
const SVG_LINKEDIN = 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z'
const SVG_WHATSAPP = 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.28 14.9 13.2C14.67 13.11 14.51 13.08 14.35 13.32C14.18 13.57 13.71 14.11 13.56 14.27C13.42 14.44 13.27 14.46 13.03 14.34C12.78 14.21 11.99 13.96 11.06 13.13C10.33 12.48 9.84 11.68 9.7 11.43C9.55 11.19 9.68 11.05 9.81 10.93C9.92 10.82 10.06 10.64 10.18 10.5C10.31 10.35 10.35 10.25 10.43 10.08C10.51 9.92 10.47 9.77 10.41 9.65C10.35 9.53 9.88 8.38 9.68 7.91C9.49 7.45 9.29 7.51 9.15 7.51C9 7.5 8.84 7.5 8.68 7.5L8.53 7.33Z'

// Sanitize LinkedIn URL to guarantee public link (no /admin/ or /dashboard/)
const publicLinkedInUrl = (company.social.linkedin || '').replace(/\/admin(\/dashboard)?\/?$/, '/')

// String sanitizer to guarantee clean ASCII rendering and prevent garbled characters
function cleanText(str) {
  if (!str) return ''
  return String(str)
    .replace(/[\u00d7\ufffd]/g, 'x')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, '-')
    .replace(/[\u2018\u2019\u201a\u201b]/g, "'")
    .replace(/[\u201c\u201d\u201e\u201f]/g, '"')
    .replace(/[\u2022\u2023\u25e6\u2043\u2219]/g, '-')
    .replace(/[\u2190-\u21ff]/g, '->')
    .replace(/[\u2700-\u27bf]/g, '')
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

// Target Ordering & Categorization
const ORDERED_GRAINS = [
  'Rice',
  'Wheat',
  'Yellow Corn (Maize)',
  'Millet',
  'Mustard seed',
  'Barley',
  'Oats',
  'Grain Sorghum'
]

const ORDERED_GROUND = [
  'Fennel Powder (Saunf)',
  'Dry Ginger Powder (Sonth)',
  'Nutmeg Powder',
  'Pure Saffron Powder',
  'Turmeric Powder',
  'Natural Vanilla Powder',
  'Green Cardamom Powder',
  'Red Chilli Powder',
  'Cinnamon Powder (Dalchini)',
  'Clove Powder',
  'Coriander Powder (Dhana)',
  'Cumin Powder (Jeera)'
]

const ORDERED_WHOLE = [
  'Black Cardamom (Badi Elaichi)',
  'Black Peppercorns (Tellicherry / MG1)',
  'Byadgi Chilli Whole (Deep Red ASTA)',
  'Cinnamon Sticks & Quills (Dalchini)',
  'Dry Ginger Whole (Cochin Grade)',
  'Dry Red Chilli Whole (Stemless / With Stem)',
  'Green Cardamom (8mm Extra Bold)',
  'Green Peppercorns (Dehydrated / Brine)',
  'Guntur S17 / Teja Red Chilli',
  'Kashmiri Red Chilli Whole',
  'Mace Whole Blades (Javitri)',
  'Nutmeg Whole (Shell / Shell-less)',
  'Turmeric Bulbs Whole',
  'Turmeric Fingers (Erode / Nizamabad)',
  'White Peppercorns Whole',
  'Whole Cloves (Laung)'
]

const ORDERED_SEEDS = [
  'Coriander Seeds (Eagle / Badami / Scoop)',
  'Cumin Seeds (Jeera - Singapore 99% / 99.5%)',
  'Fennel Seeds (Saunf - Green Lucknowi & Bold)'
]

const ORDERED_BLENDED = [
  'Hyderabadi Biryani Spice Blend',
  'Tangy Chaat Masala Blend',
  'Madras Curry Powder Blend (Mild / Hot)',
  'Royal Garam Masala Blend',
  'Kitchen King All-Purpose Curry Spice'
]

const ORDERED_EXOTIC = [
  'Kashmiri Saffron (Mongra Grade 1)',
  'Whole Vanilla Beans (Gourmet Grade A)'
]

function findProductByName(nameList) {
  return nameList.map(targetName => {
    const cleanTarget = targetName.toLowerCase().replace(/[^a-z0-9]/g, '')
    const match = products.find(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget)
    if (!match) {
      console.warn(`Product not found for: ${targetName}`)
    }
    return match
  }).filter(Boolean)
}

const grainsProducts = findProductByName(ORDERED_GRAINS)
const groundProducts = findProductByName(ORDERED_GROUND)
const wholeProducts = findProductByName(ORDERED_WHOLE)
const seedProducts = findProductByName(ORDERED_SEEDS)
const blendedProducts = findProductByName(ORDERED_BLENDED)
const exoticProducts = findProductByName(ORDERED_EXOTIC)

console.log(`Product breakdown:
- Grains & Cereals: ${grainsProducts.length}
- Ground Spices: ${groundProducts.length}
- Whole Spices: ${wholeProducts.length}
- Seed Spices: ${seedProducts.length}
- Blended Spices: ${blendedProducts.length}
- Exotic & Premium: ${exoticProducts.length}
Total classified: ${grainsProducts.length + groundProducts.length + wholeProducts.length + seedProducts.length + blendedProducts.length + exoticProducts.length}`)

// Create PDF document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: false,
  bufferPages: true,
  info: {
    Title: 'Akshar Worldtrade - Official Export Product Catalogue',
    Author: 'Akshar Worldtrade',
    Subject: 'Agricultural Commodities & Spices Export Catalogue',
    Keywords: 'Akshar Worldtrade, Indian Exporter, Spices, Grains, Cereals, Cumin, Turmeric, Rice, Export India',
  },
})

const writeStream = fs.createWriteStream(OUTPUT_FILE)
doc.pipe(writeStream)

// Outlines
const outlineRoot = doc.outline

// Helper for clickable link
function addClickableRect(x, y, w, h, url) {
  if (url) {
    doc.link(x, y, w, h, url)
  }
}

// Running Header & Footer
function addRunningHeaderFooter(pageNum, sectionTitle = 'Official Export Product Catalogue') {
  // Top Header (Y: 20 to 52)
  doc.rect(40, 20, 515, 1).fill(BORDER_LIGHT)
  doc.rect(40, 20, 100, 2).fill(GOLD_MAIN)

  // Header Logo 3 (preserve 1:1 aspect ratio: 28x28 pt, compact yet clearly visible)
  if (fs.existsSync(LOGO_3_PATH)) {
    doc.image(LOGO_3_PATH, 40, 21, { width: 28, height: 28 })
    addClickableRect(40, 21, 28, 28, company.siteUrl)
  }

  doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text('AKSHAR WORLDTRADE', 76, 30, { characterSpacing: 0.8, lineBreak: false })
  addClickableRect(76, 27, 130, 18, company.siteUrl)

  doc.fontSize(8).font('Helvetica').fillColor(TEXT_MUTED)
    .text(cleanText(sectionTitle), 40, 30, { align: 'right', width: 515, lineBreak: false })

  doc.rect(40, 52, 515, 0.75).fill(BORDER_COLOR)

  // Bottom Footer (Y: 792 to 825)
  doc.rect(40, 792, 515, 0.75).fill(BORDER_COLOR)

  doc.fontSize(7.5).font('Helvetica').fillColor(TEXT_MUTED)
    .text(`${company.email}   |   ${company.phone}   |   Rajkot, Gujarat, India`, 40, 800, { lineBreak: false })
  
  // Make email & phone in footer clickable
  addClickableRect(40, 798, 140, 14, `mailto:${company.email}`)
  addClickableRect(185, 798, 90, 14, `tel:${company.phone.replace(/[^0-9+]/g, '')}`)

  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text(`Page ${pageNum} of ${TOTAL_PAGES}`, 40, 800, { align: 'right', width: 515, lineBreak: false })
}

// Helper to draw a clean product section directly on the white page (2 products per page, well proportioned)
function drawProductSection(prod, yPos) {
  const secX = 40
  const secW = 515

  // Header row: Subcategory Tag + Product Name
  const badgeText = cleanText((prod.subcategory || prod.category || 'COMMODITY').toUpperCase())
  doc.roundedRect(secX, yPos, 145, 20, 3).fill(NAVY_BADGE)
  doc.fontSize(7).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text(badgeText, secX, yPos + 6.5, { width: 145, align: 'center', lineBreak: false, characterSpacing: 0.5 })

  // Product Name (prominent bold title)
  doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY_DARK)
    .text(cleanText(prod.name), secX + 155, yPos + 2.5, { width: 360, lineBreak: false })

  // Subtle separator line under product title
  doc.rect(secX, yPos + 28, secW, 0.5).fill(BORDER_LIGHT)

  // Vertical spacing between title and column content
  const colY = yPos + 38

  // LEFT COLUMN: Product Image + Direct Inquire Button (Width: 205, Image Height: 215)
  const imgX = secX
  const imgW = 205
  const imgH = 215

  doc.roundedRect(imgX, colY, imgW, imgH, 5).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)

  if (prod.cached_image && fs.existsSync(prod.cached_image)) {
    try {
      doc.save()
      doc.roundedRect(imgX + 1, colY + 1, imgW - 2, imgH - 2, 4).clip()
      doc.image(prod.cached_image, imgX + 1, colY + 1, {
        width: imgW - 2,
        height: imgH - 2,
        align: 'center',
        valign: 'center'
      })
      doc.restore()
    } catch (err) {
      console.warn(`Error drawing image for ${prod.name}: ${err.message}`)
    }
  }

  // Quick Inquire Button directly below image
  const btnY = colY + imgH + 14
  const btnH = 36
  doc.roundedRect(imgX, btnY, imgW, btnH, 4).fill(NAVY_MAIN)
  doc.fontSize(9).font('Helvetica-Bold').fillColor(WHITE)
    .text('Request Export Quote ->', imgX, btnY + 13, { width: imgW, align: 'center', lineBreak: false })
  addClickableRect(imgX, btnY, imgW, btnH, 'https://aksharworldtrade.com/contact')

  // RIGHT COLUMN: Description & Commercial Parameters (Width: 295, Left offset: 220)
  const rightX = secX + 220
  const rightW = secW - 220 // 295

  // Description Title
  doc.fontSize(8).font('Helvetica-Bold').fillColor(TEXT_MUTED)
    .text('PRODUCT OVERVIEW', rightX, colY, { characterSpacing: 0.6, lineBreak: false })

  // Short Description (wrapped naturally, no truncation)
  const shortDesc = cleanText(prod.short_description || 'Commercial export grade agricultural commodity sourced directly from proven Indian agricultural belts.')
  doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_BODY)
    .text(shortDesc, rightX, colY + 14, { width: rightW, lineGap: 3 })

  // Commercial Parameters Table Box
  const tableY = colY + 76
  const tableH = 189
  doc.roundedRect(rightX, tableY, rightW, tableH, 4).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)

  // Table Row 1: Export Packaging (Height: 78 pt with generous vertical room for full text wrapping)
  doc.rect(rightX, tableY, rightW, 78).fill(WHITE)
  doc.rect(rightX, tableY + 78, rightW, 0.5).fill(BORDER_COLOR)
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text('EXPORT PACKAGING', rightX + 10, tableY + 8, { characterSpacing: 0.5, lineBreak: false })
  const packagingText = cleanText(prod.packaging || 'Packaging is arranged according to product characteristics, buyer requirements and destination-market specifications.')
  doc.fontSize(7.5).font('Helvetica').fillColor(TEXT_DARK)
    .text(packagingText, rightX + 10, tableY + 22, { width: rightW - 20, lineGap: 2.2 })

  // Table Row 2: Minimum Order Quantity (MOQ) (Height: 48 pt)
  doc.rect(rightX, tableY + 78.5, rightW, 48).fill(NAVY_LIGHT)
  doc.rect(rightX, tableY + 126.5, rightW, 0.5).fill(BORDER_COLOR)
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text('MINIMUM ORDER QUANTITY (MOQ)', rightX + 10, tableY + 86, { characterSpacing: 0.5, lineBreak: false })
  const moqText = cleanText(prod.moq || '1 x 20 FT FCL (Full Container Load) or buyer requirement')
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(TEXT_DARK)
    .text(moqText, rightX + 10, tableY + 101, { width: rightW - 20, lineBreak: false })

  // Table Row 3: Quality & Specifications (Height: 62.5 pt)
  doc.rect(rightX, tableY + 127, rightW, 62).fill(WHITE)
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY_MAIN)
    .text('QUALITY & SPECIFICATIONS', rightX + 10, tableY + 135, { characterSpacing: 0.5, lineBreak: false })

  const specKeys = Object.keys(prod.specifications || {})
  let specSummary = 'Product specifications and applicable documentation can be provided according to buyer and destination requirements.'
  if (specKeys.length > 0) {
    specSummary = specKeys.slice(0, 2).map(k => `${k}: ${prod.specifications[k]}`).join(' | ')
  }
  doc.fontSize(7.5).font('Helvetica').fillColor(TEXT_MUTED)
    .text(cleanText(specSummary), rightX + 10, tableY + 149, { width: rightW - 20, lineGap: 2 })
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1: COVER
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Cover')

// Background styling: Rich Akshar Navy top banner
doc.rect(0, 0, 595.28, 300).fill(NAVY_DARK)
doc.rect(0, 296, 595.28, 4).fill(GOLD_MAIN)

// Cover Logo 3 Card (Square 1:1, centered)
const covLogoSize = 114
const covLogoX = (595.28 - covLogoSize) / 2
const covLogoY = 46

doc.roundedRect(covLogoX - 8, covLogoY - 8, covLogoSize + 16, covLogoSize + 16, 8).fill(WHITE)
doc.roundedRect(covLogoX - 8, covLogoY - 8, covLogoSize + 16, covLogoSize + 16, 8).stroke(GOLD_MAIN)

if (fs.existsSync(LOGO_3_PATH)) {
  doc.image(LOGO_3_PATH, covLogoX, covLogoY, { width: covLogoSize, height: covLogoSize })
  addClickableRect(covLogoX - 8, covLogoY - 8, covLogoSize + 16, covLogoSize + 16, company.siteUrl)
}

// Cover Titles inside Navy Header
doc.fillColor(WHITE).fontSize(23).font('Helvetica-Bold')
  .text('AKSHAR WORLDTRADE', 40, 185, { align: 'center', characterSpacing: 1.5, lineBreak: false })
addClickableRect(140, 185, 315, 26, company.siteUrl)

doc.fillColor(GOLD_MAIN).fontSize(11).font('Helvetica-Bold')
  .text('CONNECTING INDIA WITH THE WORLD', 40, 216, { align: 'center', characterSpacing: 2, lineBreak: false })

doc.fillColor('#C8D5E5').fontSize(9.5).font('Helvetica')
  .text('Agricultural Commodities  |  Spices & Seasonings', 40, 235, { align: 'center', lineBreak: false })

doc.fillColor(WHITE).fontSize(13).font('Helvetica-Bold')
  .text('EXPORT PRODUCT CATALOGUE', 40, 262, { align: 'center', characterSpacing: 1.8, lineBreak: false })

// Middle Body: Agricultural Sourcing & Commodity Overview
doc.rect(40, 320, 515, 95).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.rect(40, 320, 4, 95).fill(NAVY_MAIN)

doc.fillColor(NAVY_MAIN).fontSize(13).font('Helvetica-Bold')
  .text('Direct Indian Sourcing  |  Global Export Supply', 60, 335, { lineBreak: false })

doc.fillColor(TEXT_BODY).fontSize(9).font('Helvetica')
  .text(
    'Akshar Worldtrade connects international importers, wholesale distributors, and food processors with premium agricultural commodities and authentic Indian spices sourced directly from proven agricultural belts across India.',
    60,
    355,
    { width: 475, lineGap: 3, lineBreak: false }
  )

// Cover requirement: EXACT text replacement
doc.fillColor(GOLD_DARK).fontSize(8.5).font('Helvetica-Bold')
  .text('Rajkot, Gujarat, India | 46 Products Across Grains & Spices', 60, 395, { lineBreak: false })

// 4 Feature Cards on Cover
const featBoxes = [
  {
    title: 'Grains & Cereals',
    sub: '8 Products',
    desc: 'Rice, Wheat, Yellow Corn (Maize), Millet, Mustard Seed, Barley, Oats, Grain Sorghum.',
    page: 'Pages 04-07'
  },
  {
    title: 'Ground Spices',
    sub: '12 Products',
    desc: 'Pure Turmeric, Chilli, Coriander, Cumin, Fennel, Ginger, Nutmeg, Saffron, Vanilla powders.',
    page: 'Pages 09-14'
  },
  {
    title: 'Whole Spices',
    sub: '16 Products',
    desc: 'Tellicherry Pepper, Byadgi & Teja Chilli, Cardamom, Cloves, Ginger, Turmeric fingers & bulbs.',
    page: 'Pages 15-22'
  },
  {
    title: 'Seed, Blended & Premium',
    sub: '10 Products',
    desc: 'Cumin & Coriander seeds, Biryani & Garam Masala blends, Kashmiri Saffron & Vanilla Beans.',
    page: 'Pages 23-28'
  },
]

featBoxes.forEach((fb, i) => {
  const fx = i % 2 === 0 ? 40 : 305
  const fy = 430 + Math.floor(i / 2) * 92

  doc.roundedRect(fx, fy, 250, 80, 5).fillAndStroke(WHITE, BORDER_COLOR)
  doc.roundedRect(fx, fy, 4, 80, 2).fill(GOLD_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(10.5).font('Helvetica-Bold').text(fb.title, fx + 14, fy + 10, { lineBreak: false })
  doc.fillColor(GOLD_DARK).fontSize(7.5).font('Helvetica-Bold').text(fb.sub.toUpperCase(), fx + 14, fy + 24, { lineBreak: false })
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(fb.desc, fx + 14, fy + 36, { width: 222, lineGap: 1.5, lineBreak: false })
  doc.fillColor(NAVY_MAIN).fontSize(7.5).font('Helvetica-Bold').text(`${fb.page} ->`, fx + 14, fy + 65, { lineBreak: false })
})

// Cover Bottom Trade Banner
doc.rect(0, 695, 595.28, 147).fill(NAVY_DARK)
doc.rect(0, 695, 595.28, 3).fill(GOLD_MAIN)

doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
  .text('AKSHAR WORLDTRADE  -  GLOBAL TRADE DESK', 40, 715, { align: 'center', characterSpacing: 1, lineBreak: false })

doc.fillColor(GOLD_MAIN).fontSize(9).font('Helvetica-Bold')
  .text(`Website: ${company.siteUrl.replace('https://', '')}   |   Email: ${company.email}   |   WhatsApp: +${company.whatsapp}`, 40, 735, { align: 'center', lineBreak: false })
addClickableRect(100, 733, 130, 16, company.siteUrl)
addClickableRect(240, 733, 140, 16, `mailto:${company.email}`)
addClickableRect(390, 733, 130, 16, `https://wa.me/${company.whatsapp}`)

doc.fillColor('#A3B5CC').fontSize(8.5).font('Helvetica')
  .text(company.address.formatted, 40, 755, { align: 'center', lineBreak: false })

// CTA Button on Cover
doc.roundedRect(217, 780, 160, 28, 4).fill(GOLD_MAIN)
doc.fillColor(NAVY_DARK).fontSize(9).font('Helvetica-Bold')
  .text('Request an Export Quote ->', 217, 789, { width: 160, align: 'center', lineBreak: false })
addClickableRect(217, 780, 160, 28, 'https://aksharworldtrade.com/contact')

// ═══════════════════════════════════════════════════════════════
// PAGE 2: ABOUT AKSHAR WORLDTRADE
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('About Akshar Worldtrade')
addRunningHeaderFooter(2, 'About Akshar Worldtrade')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('About Akshar Worldtrade', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

doc.fillColor(TEXT_BODY).fontSize(9).font('Helvetica').text(
  'Akshar Worldtrade is an international trade enterprise based in Rajkot, Gujarat, India. Our commercial focus is centered on sourcing, handling, and exporting high-quality agricultural commodities and spices to global buyers, wholesale importers, food manufacturers, and trading partners.\n\n' +
  'India is one of the world\'s leading agricultural origins, known for producing exceptional varieties of grains, seed spices, blended seasonings, and whole spices. We work directly with established agricultural producing regions across Gujarat, Rajasthan, and other major Indian farming belts to deliver consistent grading, reliable shipment execution, and transparent trade relationships.',
  40,
  105,
  { width: 515, lineGap: 3, lineBreak: false }
)

// Sourcing Hub Advantage Box (factual, neutral wording)
doc.rect(40, 216, 515, 114).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.rect(40, 216, 4, 114).fill(NAVY_MAIN)
doc.fillColor(NAVY_MAIN).fontSize(10.5).font('Helvetica-Bold').text('Rajkot & Gujarat Sourcing Hub Advantage', 55, 226, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8).font('Helvetica').text(
  '- Regional Agri Hub: Rajkot is situated in Western India\'s prominent agricultural producing belt, well-connected for cumin seeds, sesame seeds, mustard, grains, and spices.\n' +
  '- Export Shipments: Export shipments can be coordinated through suitable Indian ports based on destination, product and shipment requirements.\n' +
  '- Direct Sourcing: Sourced from established agricultural markets, aggregators, and primary processors to provide dependable commodity supply.\n' +
  '- Quality Coordination: Product parameters and grading can be aligned to contractual specifications and buyer requirements.',
  55,
  244,
  { width: 485, lineGap: 2.8, lineBreak: false }
)

// Four Pillars of Export Supply
doc.fillColor(NAVY_MAIN).fontSize(11.5).font('Helvetica-Bold').text('Our Export Commitments to Buyers', 40, 348, { lineBreak: false })

const pillars = [
  {
    title: 'Quality-Focused Sourcing',
    desc: 'Procurement from established producing regions aligned with buyer specifications for purity, moisture, and cleanliness.'
  },
  {
    title: 'Reliable Supply Coordination',
    desc: 'Structured container dispatch planning, realistic production timelines, and transparent contract fulfilment for B2B buyers.'
  },
  {
    title: 'Commercial Integrity',
    desc: 'Competitive direct FOB / CIF quotations, transparent commercial terms, and prompt milestone communication throughout execution.'
  },
  {
    title: 'Long-Term Partnerships',
    desc: 'We prioritize enduring, repeat business relationships with international distributors, retail packers, and food processors.'
  }
]

pillars.forEach((p, idx) => {
  const px = idx % 2 === 0 ? 40 : 305
  const py = 368 + Math.floor(idx / 2) * 82

  doc.roundedRect(px, py, 250, 72, 4).fillAndStroke(WHITE, BORDER_COLOR)
  doc.rect(px, py, 4, 72).fill(GOLD_MAIN)
  doc.fillColor(NAVY_MAIN).fontSize(9.5).font('Helvetica-Bold').text(p.title, px + 14, py + 10, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(8).font('Helvetica').text(p.desc, px + 14, py + 26, { width: 224, lineGap: 2, lineBreak: false })
})

// Scope of Operations & Contact Coordinates Box
doc.roundedRect(40, 542, 515, 120, 6).fillAndStroke(GOLD_LIGHT, GOLD_BORDER)
doc.fillColor(GOLD_DARK).fontSize(10.5).font('Helvetica-Bold').text('Company & Contact Details', 55, 556, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  `- Registered Location: ${company.address.formatted}\n` +
  `- Product Range: Grains & Cereals (8 commodities)  |  Spices & Seasonings (38 commodities)\n` +
  `- Communication Desk: WhatsApp & Trade Inquiries: ${company.phone}\n` +
  `- Commercial Inquiries: ${company.email}\n` +
  `- Web Portal: ${company.siteUrl.replace('https://', '')}`,
  55,
  576,
  { width: 485, lineGap: 3.5, lineBreak: false }
)
addClickableRect(55, 630, 200, 14, company.siteUrl)

// Bottom CTA Box
doc.roundedRect(40, 680, 515, 88, 6).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(11).font('Helvetica-Bold').text('Looking to Procure Indian Agricultural Commodities?', 60, 696, { lineBreak: false })
doc.fillColor('#C8D5E5').fontSize(8.5).font('Helvetica').text('Submit your required specifications, target discharge port, and container volume for a formal proforma offer.', 60, 714, { width: 475, lineBreak: false })
doc.roundedRect(60, 734, 175, 22, 4).fill(GOLD_MAIN)
doc.fillColor(NAVY_DARK).fontSize(8).font('Helvetica-Bold').text('Request an Export Quote ->', 60, 741, { width: 175, align: 'center', lineBreak: false })
addClickableRect(60, 734, 175, 22, 'https://aksharworldtrade.com/contact')

// ═══════════════════════════════════════════════════════════════
// PAGE 3: OUR PRODUCT CATEGORIES
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Our Product Categories')
addRunningHeaderFooter(3, 'Our Product Categories')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('Our Product Categories', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

doc.fillColor(TEXT_BODY).fontSize(9.5).font('Helvetica').text(
  'The Akshar Worldtrade export catalogue encompasses 46 active agricultural commodities organized across two primary commodity divisions: Grains & Cereals and Spices & Seasonings. All commodities are sourced in India, graded for export, and packed in international shipping packaging.',
  40,
  105,
  { width: 515, lineGap: 3, lineBreak: false }
)

// Division 1: Grains & Cereals Card
doc.roundedRect(40, 155, 515, 120, 6).fillAndStroke(WHITE, BORDER_COLOR)
doc.rect(40, 155, 515, 26).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(10.5).font('Helvetica-Bold').text('DIVISION 1: GRAINS & CEREALS  (8 PRODUCTS)', 55, 163, { lineBreak: false })
doc.fillColor(GOLD_MAIN).fontSize(9).font('Helvetica-Bold').text('Pages 04 - 07 ->', 460, 163, { lineBreak: false })

doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica').text(
  'Sourced from northern and western Indian farming regions. Cleaned, machine-graded, and prepared for commercial bulk export and food processing requirements.',
  55,
  190,
  { width: 485, lineGap: 2.5, lineBreak: false }
)

const grainPills = ['1. Rice', '2. Wheat', '3. Yellow Corn (Maize)', '4. Millet', '5. Mustard seed', '6. Barley', '7. Oats', '8. Grain Sorghum']
let gpX = 55
let gpY = 225
grainPills.forEach((p, idx) => {
  if (idx === 4) {
    gpX = 55
    gpY = 248
  }
  doc.roundedRect(gpX, gpY, 115, 18, 3).fill(NAVY_LIGHT)
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY_MAIN).text(p, gpX, gpY + 5, { width: 115, align: 'center', lineBreak: false })
  gpX += 122
})

// Division 2: Spices & Seasonings Card
doc.roundedRect(40, 295, 515, 360, 6).fillAndStroke(WHITE, BORDER_COLOR)
doc.rect(40, 295, 515, 26).fill(NAVY_DARK)
doc.fillColor(WHITE).fontSize(10.5).font('Helvetica-Bold').text('DIVISION 2: SPICES & SEASONINGS  (38 PRODUCTS)', 55, 303, { lineBreak: false })
doc.fillColor(GOLD_MAIN).fontSize(9).font('Helvetica-Bold').text('Pages 08 - 28 ->', 460, 303, { lineBreak: false })

doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica').text(
  'India produces a vast diversity of aromatic spices. We supply whole spices, finely milled ground spices, cleaned seed spices, traditional culinary blends, and premium exotic spices.',
  55,
  330,
  { width: 485, lineGap: 2.5, lineBreak: false }
)

const spiceSubCats = [
  {
    name: '1. Ground Spices (12 Products)',
    pages: 'Pages 09-14',
    items: 'Fennel Powder, Dry Ginger Powder, Nutmeg Powder, Pure Saffron Powder, Turmeric Powder, Natural Vanilla Powder, Green Cardamom Powder, Red Chilli Powder, Cinnamon Powder, Clove Powder, Coriander Powder, Cumin Powder.'
  },
  {
    name: '2. Whole Spices (16 Products)',
    pages: 'Pages 15-22',
    items: 'Black Cardamom, Tellicherry Peppercorns, Byadgi Chilli, Cinnamon Quills, Dry Ginger, Stemless Red Chilli, Extra Bold Green Cardamom, Green Peppercorns, Teja Chilli, Kashmiri Chilli, Mace Blades, Nutmeg, Turmeric Bulbs & Fingers, White Peppercorns, Cloves.'
  },
  {
    name: '3. Seed Spices (3 Products)',
    pages: 'Pages 23-24',
    items: 'Coriander Seeds (Eagle/Badami/Scoop), Cumin Seeds (Singapore 99%/99.5%), Fennel Seeds (Green Lucknowi & Bold).'
  },
  {
    name: '4. Blended Spices (5 Products)',
    pages: 'Pages 25-27',
    items: 'Hyderabadi Biryani Spice, Tangy Chaat Masala, Madras Curry Powder (Mild/Hot), Royal Garam Masala, Kitchen King Curry Spice.'
  },
  {
    name: '5. Exotic & Premium (2 Products)',
    pages: 'Page 28',
    items: 'Kashmiri Saffron (Mongra Grade 1), Whole Vanilla Beans (Gourmet Grade A).'
  }
]

let scY = 362
spiceSubCats.forEach((sc) => {
  doc.rect(55, scY, 485, 48).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
  doc.rect(55, scY, 3, 48).fill(GOLD_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(9).font('Helvetica-Bold').text(sc.name, 68, scY + 7, { lineBreak: false })
  doc.fillColor(GOLD_DARK).fontSize(8).font('Helvetica-Bold').text(sc.pages, 450, scY + 7, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(sc.items, 68, scY + 22, { width: 460, lineGap: 1.5, lineBreak: false })

  scY += 55
})

// Scope Exclusions Notice
doc.roundedRect(40, 675, 515, 95, 6).fill(NAVY_LIGHT)
doc.roundedRect(40, 675, 515, 95, 6).stroke(BORDER_COLOR)
doc.fillColor(NAVY_MAIN).fontSize(9.5).font('Helvetica-Bold').text('Catalogue Scope & Product Range', 55, 690, { lineBreak: false })
doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(
  '- This export publication contains exclusively the 46 active export commodities shown above.\n' +
  '- Milling flours and processed flour fractions are excluded from this catalogue and handled under dedicated contract specifications.\n' +
  '- Custom commodity grades and private label packaging are reviewed upon direct buyer inquiry.',
  55,
  708,
  { width: 485, lineGap: 3, lineBreak: false }
)

// ═══════════════════════════════════════════════════════════════
// PAGES 4 TO 7: GRAINS & CEREALS (8 PRODUCTS, 2 PER PAGE)
// ═══════════════════════════════════════════════════════════════
const outlineGrains = outlineRoot.addItem('Grains & Cereals')

for (let i = 0; i < grainsProducts.length; i += 2) {
  const pNum = 4 + Math.floor(i / 2)
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
  addRunningHeaderFooter(pNum, 'Grains & Cereals')

  const prod1 = grainsProducts[i]
  const prod2 = grainsProducts[i + 1]

  if (prod1) {
    outlineGrains.addItem(cleanText(prod1.name))
    drawProductSection(prod1, 60)
  }

  // Subtle separator line between Product 1 and Product 2
  doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

  if (prod2) {
    outlineGrains.addItem(cleanText(prod2.name))
    drawProductSection(prod2, 430)
  }
}

// ═══════════════════════════════════════════════════════════════
// PAGE 8: SPICES & SEASONINGS OVERVIEW
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
const outlineSpices = outlineRoot.addItem('Spices & Seasonings')
addRunningHeaderFooter(8, 'Spices & Seasonings Overview')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('Spices & Seasonings', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

doc.fillColor(TEXT_BODY).fontSize(9.5).font('Helvetica').text(
  'India is renowned worldwide for producing diverse varieties of spices with rich natural aromatics and authentic culinary tradition. Akshar Worldtrade procures and exports Indian spices sourced from prominent cultivation regions: cumin and fennel from Gujarat and Rajasthan, turmeric from Andhra Pradesh and Telangana, red chillies from Guntur and Byadgi, peppercorns from Kerala, and saffron from Jammu & Kashmir.',
  40,
  105,
  { width: 515, lineGap: 3.5, lineBreak: false }
)

// Spices Divisions Grid (factual, concise)
const spiceDivCards = [
  {
    title: 'Ground Spices (12 Products)',
    scope: 'Turmeric, Chilli, Coriander, Cumin, Ginger, Cardamom, Clove, Cinnamon, Nutmeg, Saffron, Vanilla, Fennel.',
    spec: 'Hygienically processed and finely ground to suit diverse culinary, food service, and industrial processing requirements.'
  },
  {
    title: 'Whole Spices (16 Products)',
    scope: 'Tellicherry Black Pepper, Byadgi & Teja Chilli, Green & Black Cardamom, Cloves, Ginger, Turmeric fingers & bulbs.',
    spec: 'Cleaned and sorted whole spices graded according to size, color, and commercial quality parameters.'
  },
  {
    title: 'Seed Spices (3 Products)',
    scope: 'Coriander Seeds (Eagle / Badami / Scoop), Cumin Seeds (Jeera 99% / 99.5%), Fennel Seeds (Lucknowi & Bold).',
    spec: 'Sourced from established agro-producing markets and cleaned to commercial export specifications.'
  },
  {
    title: 'Blended Spices & Seasonings (5 Products)',
    scope: 'Hyderabadi Biryani Spice, Tangy Chaat Masala, Madras Curry Powder, Royal Garam Masala, Kitchen King Spice.',
    spec: 'Balanced culinary formulations ground and packed to maintain authentic aroma and freshness.'
  }
]

spiceDivCards.forEach((sd, idx) => {
  const sx = idx % 2 === 0 ? 40 : 305
  const sy = 195 + Math.floor(idx / 2) * 125

  doc.roundedRect(sx, sy, 250, 115, 6).fillAndStroke(WHITE, BORDER_COLOR)
  doc.rect(sx, sy, 4, 115).fill(NAVY_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(10).font('Helvetica-Bold').text(sd.title, sx + 14, sy + 12, { lineBreak: false })
  doc.fillColor(TEXT_DARK).fontSize(7.5).font('Helvetica-Bold').text('Commodities Covered:', sx + 14, sy + 28, { lineBreak: false })
  doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica').text(sd.scope, sx + 14, sy + 38, { width: 222, lineGap: 1.5, lineBreak: false })
  doc.fillColor(NAVY_MAIN).fontSize(7.5).font('Helvetica-Bold').text('Processing & Standard:', sx + 14, sy + 68, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(sd.spec, sx + 14, sy + 78, { width: 222, lineGap: 1.5, lineBreak: false })
})

// Sourcing Principles for Spices (factual, no universal claims)
doc.roundedRect(40, 465, 515, 125, 6).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.rect(40, 465, 515, 24).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(9.5).font('Helvetica-Bold').text('SPICE SOURCING & COMMERCIAL EXPORT SUPPLY', 55, 472, { lineBreak: false })

const spicePointers = [
  '- Indian Spices Sourcing: Sourced from recognized Indian spice-growing regions across Western and Southern India.',
  '- Broad Product Range: Comprehensive selection spanning whole spices, ground spices, seed spices, and culinary blends.',
  '- Buyer-Specific Specifications: Grinding fineness, moisture thresholds, and packaging tailored to buyer requirements.',
  '- Commercial & Export Supply: Structured bulk supply, transparent container coordination, and applicable export documentation.'
]

let spY = 498
spicePointers.forEach(pt => {
  doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(pt, 55, spY, { width: 485, lineBreak: false })
  spY += 18
})

// Exotic Spices Highlight
doc.roundedRect(40, 610, 515, 95, 6).fillAndStroke(GOLD_LIGHT, GOLD_BORDER)
doc.fillColor(GOLD_DARK).fontSize(10).font('Helvetica-Bold').text('Exotic & Premium Segment Highlight (Page 28)', 55, 624, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'In addition to bulk export spices, Akshar Worldtrade facilitates selective export consignments of rare Indian origin agricultural commodities: pure Kashmiri Mongra Grade 1 Saffron from Pampore, Kashmir, and Gourmet Grade A Whole Vanilla Beans from Southern Indian plantations. Both commodities are packed in protective barrier packaging.',
  55,
  642,
  { width: 485, lineGap: 3, lineBreak: false }
)

// Quick Jump Link
doc.roundedRect(40, 725, 515, 45, 6).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold').text('Explore the 38 Spice Commodities in Detail ->', 60, 740, { lineBreak: false })
doc.fillColor(GOLD_MAIN).fontSize(8.5).font('Helvetica-Bold').text('Proceed to Ground Spices (Pages 09-14) ->', 330, 740, { lineBreak: false })

// ═══════════════════════════════════════════════════════════════
// PAGES 9 TO 14: GROUND SPICES (12 PRODUCTS, 2 PER PAGE)
// ═══════════════════════════════════════════════════════════════
const outlineGround = outlineSpices.addItem('Ground Spices')

for (let i = 0; i < groundProducts.length; i += 2) {
  const pNum = 9 + Math.floor(i / 2)
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
  addRunningHeaderFooter(pNum, 'Ground Spices')

  const prod1 = groundProducts[i]
  const prod2 = groundProducts[i + 1]

  if (prod1) {
    outlineGround.addItem(cleanText(prod1.name))
    drawProductSection(prod1, 60)
  }

  // Subtle separator line between Product 1 and Product 2
  doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

  if (prod2) {
    outlineGround.addItem(cleanText(prod2.name))
    drawProductSection(prod2, 430)
  }
}

// ═══════════════════════════════════════════════════════════════
// PAGES 15 TO 22: WHOLE SPICES (16 PRODUCTS, 2 PER PAGE)
// ═══════════════════════════════════════════════════════════════
const outlineWhole = outlineSpices.addItem('Whole Spices')

for (let i = 0; i < wholeProducts.length; i += 2) {
  const pNum = 15 + Math.floor(i / 2)
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
  addRunningHeaderFooter(pNum, 'Whole Spices')

  const prod1 = wholeProducts[i]
  const prod2 = wholeProducts[i + 1]

  if (prod1) {
    outlineWhole.addItem(cleanText(prod1.name))
    drawProductSection(prod1, 60)
  }

  // Subtle separator line between Product 1 and Product 2
  doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

  if (prod2) {
    outlineWhole.addItem(cleanText(prod2.name))
    drawProductSection(prod2, 430)
  }
}

// ═══════════════════════════════════════════════════════════════
// PAGES 23 TO 24: SEED SPICES (3 PRODUCTS)
// ═══════════════════════════════════════════════════════════════
const outlineSeed = outlineSpices.addItem('Seed Spices')

// Page 23: Coriander Seeds + Cumin Seeds
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
addRunningHeaderFooter(23, 'Seed Spices')
if (seedProducts[0]) {
  outlineSeed.addItem(cleanText(seedProducts[0].name))
  drawProductSection(seedProducts[0], 60)
}

// Subtle divider between Product 1 and Product 2
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

if (seedProducts[1]) {
  outlineSeed.addItem(cleanText(seedProducts[1].name))
  drawProductSection(seedProducts[1], 430)
}

// Page 24: Fennel Seeds + Seed Spices Sourcing Context
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
addRunningHeaderFooter(24, 'Seed Spices')
if (seedProducts[2]) {
  outlineSeed.addItem(cleanText(seedProducts[2].name))
  drawProductSection(seedProducts[2], 60)
}

// Subtle divider between Product and Overview
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

// Lower half of Page 24: Seed Spices Sourcing & Commercial Profile
doc.roundedRect(40, 425, 515, 345, 6).fillAndStroke(WHITE, BORDER_COLOR)
doc.rect(40, 425, 515, 26).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(10.5).font('Helvetica-Bold').text('INDIAN SEED SPICES - COMMERCIAL SOURCING PROFILE', 55, 433, { lineBreak: false })

doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'India is a major global producer of seed spices, with prominent cultivation centered in Gujarat and Rajasthan. Akshar Worldtrade utilizes regional sourcing connectivity to supply seed spice varieties aligned to commercial buyer specifications.',
  55,
  460,
  { width: 485, lineGap: 3, lineBreak: false }
)

const seedGrades = [
  {
    name: 'Cumin Seeds (Jeera)',
    desc: 'Offered in Singapore 99% and 99.5% grades and machine-cleaned varieties based on contract specifications.'
  },
  {
    name: 'Coriander Seeds (Dhana)',
    desc: 'Available in Eagle, Badami, and Scoop commercial grades according to market and buyer requirements.'
  },
  {
    name: 'Fennel Seeds (Saunf)',
    desc: 'Available in Green Lucknowi and Bold commercial grades suitable for culinary and wholesale trade.'
  }
]

let sgY = 506
seedGrades.forEach(sg => {
  doc.rect(55, sgY, 485, 44).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
  doc.rect(55, sgY, 3, 44).fill(GOLD_MAIN)
  doc.fillColor(NAVY_MAIN).fontSize(9).font('Helvetica-Bold').text(sg.name, 68, sgY + 8, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(sg.desc, 68, sgY + 22, { width: 460, lineGap: 1.5, lineBreak: false })
  sgY += 54
})

doc.roundedRect(55, 672, 485, 82, 4).fill(GOLD_LIGHT)
doc.roundedRect(55, 672, 485, 82, 4).stroke(GOLD_BORDER)
doc.fillColor(GOLD_DARK).fontSize(8.5).font('Helvetica-Bold').text('Custom Seed Packing & Container Optimization', 68, 682, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(
  'Seed spices can be packed in buyer-specified export bags, with container stuffing and applicable documentation arranged according to shipment and destination requirements.',
  68,
  698,
  { width: 460, lineGap: 2, lineBreak: false }
)

// ═══════════════════════════════════════════════════════════════
// PAGES 25 TO 27: BLENDED SPICES (5 PRODUCTS)
// ═══════════════════════════════════════════════════════════════
const outlineBlended = outlineSpices.addItem('Blended Spices')

// Page 25: Biryani + Chaat Masala
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
addRunningHeaderFooter(25, 'Blended Spices & Seasonings')
if (blendedProducts[0]) {
  outlineBlended.addItem(cleanText(blendedProducts[0].name))
  drawProductSection(blendedProducts[0], 60)
}

// Subtle divider between Product 1 and Product 2
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

if (blendedProducts[1]) {
  outlineBlended.addItem(cleanText(blendedProducts[1].name))
  drawProductSection(blendedProducts[1], 430)
}

// Page 26: Madras Curry Powder + Garam Masala
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
addRunningHeaderFooter(26, 'Blended Spices & Seasonings')
if (blendedProducts[2]) {
  outlineBlended.addItem(cleanText(blendedProducts[2].name))
  drawProductSection(blendedProducts[2], 60)
}

// Subtle divider between Product 1 and Product 2
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

if (blendedProducts[3]) {
  outlineBlended.addItem(cleanText(blendedProducts[3].name))
  drawProductSection(blendedProducts[3], 430)
}

// Page 27: Kitchen King + Blending Capabilities Overview
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
addRunningHeaderFooter(27, 'Blended Spices & Seasonings')
if (blendedProducts[4]) {
  outlineBlended.addItem(cleanText(blendedProducts[4].name))
  drawProductSection(blendedProducts[4], 60)
}

// Subtle divider between Product and Overview
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

// Lower half of Page 27: Blended Spices Formulation Notes
doc.roundedRect(40, 425, 515, 345, 6).fillAndStroke(WHITE, BORDER_COLOR)
doc.rect(40, 425, 515, 26).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(10.5).font('Helvetica-Bold').text('CULINARY BLEND FORMULATION & EXPORT STANDARDS', 55, 433, { lineBreak: false })

doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'Indian spice blends combine warming spices, seeds, chillies, and aromatic herbs in balanced ratios. Akshar Worldtrade supplies blends processed from quality whole spices, ground under hygienic conditions to preserve flavor integrity.',
  55,
  460,
  { width: 485, lineGap: 3, lineBreak: false }
)

const blendFeatures = [
  {
    title: 'Authentic Regional Profiles',
    desc: 'Formulated using traditional flavor profiles suitable for food service, sauce manufacturers, and retail packing.'
  },
  {
    title: 'Clean Formulation',
    desc: 'Composed of natural spices and seasonings without unnecessary artificial additives.'
  },
  {
    title: 'Controlled Processing',
    desc: 'Uniform milling ensures smooth blending for gravies, marinades, and dry seasoning applications.'
  },
  {
    title: 'Buyer-Specific Formulations',
    desc: 'Custom heat levels and tailored formulation ratios can be reviewed upon commercial inquiry.'
  }
]

let bfY = 506
blendFeatures.forEach(bf => {
  doc.rect(55, bfY, 485, 40).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
  doc.rect(55, bfY, 3, 40).fill(GOLD_MAIN)
  doc.fillColor(NAVY_MAIN).fontSize(9).font('Helvetica-Bold').text(bf.title, 68, bfY + 7, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(bf.desc, 68, bfY + 20, { width: 460, lineGap: 1.5, lineBreak: false })
  bfY += 48
})

doc.roundedRect(55, 706, 485, 50, 4).fill(NAVY_LIGHT)
doc.roundedRect(55, 706, 485, 50, 4).stroke(BORDER_COLOR)
doc.fillColor(NAVY_MAIN).fontSize(8.5).font('Helvetica-Bold').text('Packaging for Blended Seasonings', 68, 715, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(
  'Shipments are packed in protective barrier bags or export master cartons tailored to product characteristics and buyer requirements.',
  68,
  728,
  { width: 460, lineGap: 2, lineBreak: false }
)

// ═══════════════════════════════════════════════════════════════
// PAGE 28: EXOTIC & PREMIUM (2 PRODUCTS)
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
const outlineExotic = outlineSpices.addItem('Exotic & Premium')
addRunningHeaderFooter(28, 'Exotic & Premium')

if (exoticProducts[0]) {
  outlineExotic.addItem(cleanText(exoticProducts[0].name))
  drawProductSection(exoticProducts[0], 60)
}

// Subtle divider between Product 1 and Product 2
doc.rect(40, 400, 515, 0.75).fill(BORDER_LIGHT)

if (exoticProducts[1]) {
  outlineExotic.addItem(cleanText(exoticProducts[1].name))
  drawProductSection(exoticProducts[1], 430)
}

// ═══════════════════════════════════════════════════════════════
// PAGE 29: EXPORT & PACKAGING INFORMATION
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Export & Packaging Standards')
addRunningHeaderFooter(29, 'Export & Packaging Information')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('Export & Packaging Information', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

doc.fillColor(TEXT_BODY).fontSize(9.5).font('Helvetica').text(
  'Packaging is arranged according to product characteristics, buyer requirements and destination-market specifications. Akshar Worldtrade coordinates export packaging based on actual commodity requirements and agreed buyer specifications.',
  40,
  105,
  { width: 515, lineGap: 3.5, lineBreak: false }
)

const packTypes = [
  {
    title: 'Bulk Export Packaging',
    desc: 'Standard commercial packing for wholesale commodities in bags or bulk containers according to commodity characteristics and buyer handling preferences.'
  },
  {
    title: 'Buyer Marking & Labelling',
    desc: 'Buyer-specific packaging marks, destination-country labelling, lot numbers, net/gross weights, and agreed marking details provided upon request.'
  },
  {
    title: 'Protective Packaging Options',
    desc: 'For sensitive ground spices and specialty items, packaging incorporates protective inner liners or barrier materials to preserve product quality.'
  },
  {
    title: 'Container Shipment Coordination',
    desc: 'Stuffing in 20 FT and 40 FT Full Container Loads (FCL). Handling and loading arrangements coordinated according to destination port requirements.'
  }
]

packTypes.forEach((pt, idx) => {
  const px = idx % 2 === 0 ? 40 : 305
  const py = 185 + Math.floor(idx / 2) * 105

  doc.roundedRect(px, py, 250, 95, 6).fillAndStroke(WHITE, BORDER_COLOR)
  doc.rect(px, py, 4, 95).fill(NAVY_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(10).font('Helvetica-Bold').text(pt.title, px + 14, py + 12, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(8).font('Helvetica').text(pt.desc, px + 14, py + 28, { width: 222, lineGap: 2, lineBreak: false })
})

// Packaging Overview Table Box (clean, factual, no ellipsis truncation)
doc.roundedRect(40, 415, 515, 175, 6).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.rect(40, 415, 515, 24).fill(NAVY_DARK)
doc.fillColor(WHITE).fontSize(9.5).font('Helvetica-Bold').text('COMMERCIAL PACKAGING OVERVIEW BY COMMODITY TYPE', 55, 422, { lineBreak: false })

const packRows = [
  { cat: 'Grains & Cereals', format: '25 kg / 50 kg bags and buyer-specified export packaging', handling: 'Containerized shipment coordinated per contract requirements' },
  { cat: 'Whole Spices', format: 'Export bags or cartons selected per commodity characteristics', handling: 'Arranged to meet buyer specifications and import regulations' },
  { cat: 'Ground Spices', format: 'Food-grade bags with protective barrier liners or pouches', handling: 'Sealed to preserve natural aroma and freshness during transit' },
  { cat: 'Seed Spices', format: 'Standard export bags arranged according to commodity weight', handling: 'Coordinated for clean handling and secure container loading' },
  { cat: 'Exotic Spices', format: 'Food-grade sealed pouches, jars, or vacuum-barrier packs', handling: 'Packaged for protection and aroma retention during transport' }
]

let prY = 450
packRows.forEach((r, idx) => {
  const bg = idx % 2 === 0 ? WHITE : NAVY_LIGHT
  doc.rect(55, prY, 485, 24).fillAndStroke(bg, BORDER_COLOR)
  doc.fillColor(NAVY_MAIN).fontSize(7.5).font('Helvetica-Bold').text(r.cat, 65, prY + 7, { width: 95, lineBreak: false })
  doc.fillColor(TEXT_DARK).fontSize(7.5).font('Helvetica').text(r.format, 165, prY + 7, { width: 175, lineBreak: false })
  doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica').text(r.handling, 345, prY + 7, { width: 185, lineBreak: false })
  prY += 24
})

// Buyer Packaging Advisory
doc.roundedRect(40, 610, 515, 155, 6).fill(GOLD_LIGHT)
doc.roundedRect(40, 610, 515, 155, 6).stroke(GOLD_BORDER)
doc.fillColor(GOLD_DARK).fontSize(10).font('Helvetica-Bold').text('Buyer-Specific Packaging Coordination', 55, 625, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'Packaging is arranged according to product characteristics, buyer requirements and destination-market specifications.\n\n' +
  'International buyers with specialized retail packaging requirements, private labelling, or custom bag weight preferences are encouraged to detail their requirements during initial inquiry.\n\n' +
  'Packaging requirements are coordinated according to product characteristics, transit conditions, buyer specifications, and destination-market requirements.',
  55,
  645,
  { width: 485, lineGap: 3.5, lineBreak: false }
)

// ═══════════════════════════════════════════════════════════════
// PAGE 30: QUALITY & DOCUMENTATION
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Quality & Export Documentation')
addRunningHeaderFooter(30, 'Quality & Documentation')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('Quality & Documentation', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

doc.fillColor(TEXT_BODY).fontSize(9.5).font('Helvetica').text(
  'Commercial and shipment documentation is arranged according to product, payment terms, shipment requirements and destination-country regulations. Akshar Worldtrade coordinates statutory compliance and standard export documentation to support smooth customs clearance at destination ports.',
  40,
  105,
  { width: 515, lineGap: 3.5, lineBreak: false }
)

const docBlocks = [
  {
    title: 'Import-Export Code (IEC)',
    status: 'Statutory Registration',
    desc: 'Official Import-Export Code issued by the Directorate General of Foreign Trade (DGFT), Government of India, authorizing global commodity trade.'
  },
  {
    title: 'Food Safety Compliance (FSSAI)',
    status: 'Statutory Requirement',
    desc: 'Compliance with Food Safety and Standards Authority of India (FSSAI) regulations governing hygienic handling and packaging of food commodities.'
  },
  {
    title: 'Phytosanitary Documentation',
    status: 'Statutory Certificate',
    desc: 'Official Phytosanitary Certificates issued by plant quarantine authorities certifying commodity inspection per importing country regulations.'
  },
  {
    title: 'Certificate of Origin (COO)',
    status: 'Statutory Documentation',
    desc: 'Authorized Certificate of Origin issued by recognized Indian trade chambers or inspection agencies confirming Indian provenance.'
  },
  {
    title: 'Commercial Export Documents',
    status: 'Shipment Package',
    desc: 'Commercial Invoice, Detailed Packing List, and Bill of Lading (B/L). Additional documentation provided per agreed contractual terms.'
  },
  {
    title: 'Third-Party Inspection Coordination',
    status: 'Available on Request',
    desc: 'Independent inspection services (e.g. SGS, Bureau Veritas, Intertek) for quality, weight, or container loading can be coordinated per buyer request.'
  }
]

docBlocks.forEach((d, idx) => {
  const dx = idx % 2 === 0 ? 40 : 305
  const dy = 195 + Math.floor(idx / 2) * 115

  doc.roundedRect(dx, dy, 250, 105, 6).fillAndStroke(WHITE, BORDER_COLOR)
  doc.rect(dx, dy, 4, 105).fill(NAVY_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(9.5).font('Helvetica-Bold').text(d.title, dx + 14, dy + 12, { lineBreak: false })
  doc.roundedRect(dx + 14, dy + 28, 140, 14, 2).fill(NAVY_LIGHT)
  doc.fillColor(GOLD_DARK).fontSize(6.5).font('Helvetica-Bold').text(d.status.toUpperCase(), dx + 14, dy + 31, { width: 140, align: 'center', lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(d.desc, dx + 14, dy + 48, { width: 222, lineGap: 2, lineBreak: false })
})

// Compliance Advisory Box
doc.roundedRect(40, 560, 515, 205, 6).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.rect(40, 560, 515, 24).fill(NAVY_DARK)
doc.fillColor(WHITE).fontSize(9.5).font('Helvetica-Bold').text('IMPORT COMPLIANCE & DOCUMENTATION COORDINATION', 55, 567, { lineBreak: false })

doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  '- Destination Standards: Every importing country maintains specific regulations regarding residue limits, moisture parameters, inspection procedures, and labelling mandates.\n\n' +
  '- Proforma Alignment: Prior to contract confirmation, buyers are invited to communicate specific statutory requirements stipulated by their local customs authorities.\n\n' +
  '- Document Dispatch: Shipment documents are promptly transmitted through banking channels or courier services to facilitate timely customs clearance.\n\n' +
  '- Commercial Transparency: Akshar Worldtrade coordinates applicable statutory and shipment documentation according to product, contract, and destination requirements.',
  55,
  598,
  { width: 485, lineGap: 3.5, lineBreak: false }
)

// ═══════════════════════════════════════════════════════════════
// PAGE 31: EXPORT MARKETS, WHY US & EXPORT PROCESS
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Export Markets & Process')
addRunningHeaderFooter(31, 'Export Markets & Process')

doc.fillColor(NAVY_MAIN).fontSize(18).font('Helvetica-Bold').text('Export Markets & Sourcing Process', 40, 68, { lineBreak: false })
doc.rect(40, 92, 38, 3).fill(GOLD_MAIN)

// Section 1: Markets We Serve
doc.fillColor(NAVY_MAIN).fontSize(11).font('Helvetica-Bold').text('Export Markets', 40, 105, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'Akshar Worldtrade coordinates export shipments to commercial buyers, importers, and trading houses across active international markets:',
  40,
  120,
  { width: 515, lineBreak: false }
)

const markets = company.exportMarkets || ['UAE', 'South Africa', 'China', 'Bangladesh', 'Saudi Arabia', 'Iran', 'Malaysia', 'Other International Markets']
let mX = 40
let mY = 138
markets.forEach((m, idx) => {
  doc.roundedRect(mX, mY, 122, 22, 4).fillAndStroke(WHITE, BORDER_COLOR)
  doc.fillColor(NAVY_MAIN).fontSize(7.5).font('Helvetica-Bold').text(m, mX, mY + 6, { width: 122, align: 'center', lineBreak: false })
  mX += 131
  if ((idx + 1) % 4 === 0) {
    mX = 40
    mY += 28
  }
})

// Section 2: Why Akshar Worldtrade (Concise Positioning)
const whyY = 205
doc.fillColor(NAVY_MAIN).fontSize(11).font('Helvetica-Bold').text('Why Partner with Akshar Worldtrade', 40, whyY, { lineBreak: false })

const whyPoints = [
  { title: 'Regional Sourcing Base', text: 'Located in Rajkot, Gujarat, providing direct commercial connectivity to primary Western Indian agricultural producing belts.' },
  { title: 'Specification Adherence', text: 'Procurement and grading coordinated according to buyer-specified purity, moisture, and cleanliness parameters.' },
  { title: 'Competitive Quotations', text: 'Direct sourcing structure delivers competitive FOB / CIF quotations aligned with current market conditions.' },
  { title: 'Documentation Handling', text: 'Complete coordination of statutory export documents tailored to the requirements of your destination port.' },
  { title: 'Responsive Communication', text: 'Trade desk assistance keeping buyers informed from contract signing through loading and shipment transit.' },
  { title: 'Long-Term Trade Focus', text: 'We prioritize enduring, transparent commercial relationships built on reliable execution and integrity.' }
]

whyPoints.forEach((w, idx) => {
  const wx = idx % 2 === 0 ? 40 : 305
  const wy = whyY + 18 + Math.floor(idx / 2) * 58

  doc.roundedRect(wx, wy, 250, 52, 4).fillAndStroke(WHITE, BORDER_COLOR)
  doc.rect(wx, wy, 3, 52).fill(GOLD_MAIN)
  doc.fillColor(NAVY_MAIN).fontSize(8.5).font('Helvetica-Bold').text(w.title, wx + 10, wy + 7, { lineBreak: false })
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(w.text, wx + 10, wy + 20, { width: 230, lineGap: 1.5, lineBreak: false })
})

// Section 3: 6-Step Visual Export Workflow
const flowY = 415
doc.fillColor(NAVY_MAIN).fontSize(11).font('Helvetica-Bold').text('Our 6-Step Commercial Export Process', 40, flowY, { lineBreak: false })

const steps = [
  { step: '01', name: 'Requirement', desc: 'Buyer submits required commodity, grade & volume.' },
  { step: '02', name: 'Product & Spec', desc: 'Parameters & packaging confirmed with trade desk.' },
  { step: '03', name: 'Quotation', desc: 'Formal FOB / CIF proforma invoice issued.' },
  { step: '04', name: 'Documentation', desc: 'Statutory inspection & export paperwork prepared.' },
  { step: '05', name: 'Shipment', desc: 'Container stuffing & dispatch via suitable Indian ports.' },
  { step: '06', name: 'Delivery', desc: 'Vessel tracking & document transfer for clearance.' }
]

steps.forEach((s, idx) => {
  const sx = idx % 3 === 0 ? 40 : (idx % 3 === 1 ? 218 : 396)
  const sy = flowY + 18 + Math.floor(idx / 3) * 70

  doc.roundedRect(sx, sy, 160, 62, 4).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
  doc.roundedRect(sx, sy, 26, 18, 3).fill(NAVY_MAIN)
  doc.fillColor(WHITE).fontSize(8).font('Helvetica-Bold').text(s.step, sx, sy + 5, { width: 26, align: 'center', lineBreak: false })

  doc.fillColor(NAVY_MAIN).fontSize(9).font('Helvetica-Bold').text(s.name, sx + 32, sy + 5, { lineBreak: false })
  doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica').text(s.desc, sx + 8, sy + 24, { width: 144, lineGap: 1.5, lineBreak: false })
})

// Port Dispatch Note (neutral wording per user requirement)
doc.roundedRect(40, 585, 515, 80, 6).fill(GOLD_LIGHT)
doc.roundedRect(40, 585, 515, 80, 6).stroke(GOLD_BORDER)
doc.fillColor(GOLD_DARK).fontSize(9.5).font('Helvetica-Bold').text('Logistics & Sea Port Coordination', 55, 598, { lineBreak: false })
doc.fillColor(TEXT_BODY).fontSize(8.5).font('Helvetica').text(
  'Export shipments can be coordinated through suitable Indian ports based on destination, product and shipment requirements, ensuring reliable container freight schedules and optimized transit times to international destinations.',
  55,
  615,
  { width: 485, lineGap: 2.5, lineBreak: false }
)

// Inquire Banner
doc.roundedRect(40, 680, 515, 85, 6).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(11).font('Helvetica-Bold').text('Ready to Initiate an Export Inquiry?', 60, 698, { lineBreak: false })
doc.fillColor('#C8D5E5').fontSize(8.5).font('Helvetica').text('Contact our commercial team with your required commodity specifications, volume, and destination discharge port.', 60, 715, { width: 475, lineBreak: false })
doc.roundedRect(60, 735, 175, 20, 4).fill(GOLD_MAIN)
doc.fillColor(NAVY_DARK).fontSize(8).font('Helvetica-Bold').text('Request an Export Quote ->', 60, 741, { width: 175, align: 'center', lineBreak: false })
addClickableRect(60, 735, 175, 20, 'https://aksharworldtrade.com/contact')

// ═══════════════════════════════════════════════════════════════
// PAGE 32: FINAL CONTACT PAGE
// ═══════════════════════════════════════════════════════════════
doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
outlineRoot.addItem('Contact & Trade Desk')

// Header banner for contact page
doc.rect(0, 0, 595.28, 260).fill(NAVY_DARK)
doc.rect(0, 256, 595.28, 4).fill(GOLD_MAIN)

// Logo 3 centered (exact 1:1 square: 96x96)
const finLogoSize = 96
const finLogoX = (595.28 - finLogoSize) / 2
const finLogoY = 32

doc.roundedRect(finLogoX - 6, finLogoY - 6, finLogoSize + 12, finLogoSize + 12, 6).fill(WHITE)
doc.roundedRect(finLogoX - 6, finLogoY - 6, finLogoSize + 12, finLogoSize + 12, 6).stroke(GOLD_MAIN)

if (fs.existsSync(LOGO_3_PATH)) {
  doc.image(LOGO_3_PATH, finLogoX, finLogoY, { width: finLogoSize, height: finLogoSize })
  addClickableRect(finLogoX - 6, finLogoY - 6, finLogoSize + 12, finLogoSize + 12, company.siteUrl)
}

doc.fillColor(WHITE).fontSize(20).font('Helvetica-Bold')
  .text('AKSHAR WORLDTRADE', 40, 150, { align: 'center', characterSpacing: 1.2, lineBreak: false })
addClickableRect(160, 150, 275, 22, company.siteUrl)

doc.fillColor(GOLD_MAIN).fontSize(10.5).font('Helvetica-Bold')
  .text('CONNECTING INDIA WITH THE WORLD', 40, 176, { align: 'center', characterSpacing: 1.5, lineBreak: false })

doc.fillColor('#A3B5CC').fontSize(9).font('Helvetica')
  .text('Rajkot, Gujarat, India  |  International Export Desk', 40, 195, { align: 'center', lineBreak: false })

doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
  .text('DIRECT COMMERCIAL CONTACT COORDINATES', 40, 222, { align: 'center', characterSpacing: 1, lineBreak: false })

// 4 Interactive Contact Channels Box
const contactBoxes = [
  {
    title: 'WHATSAPP TRADE CHAT',
    val: `+${company.whatsapp}`,
    sub: 'Direct communication for product requirements and export inquiries',
    link: `https://wa.me/${company.whatsapp}`,
    linkText: 'Open WhatsApp Chat ->'
  },
  {
    title: 'OFFICIAL EMAIL',
    val: company.email,
    sub: 'Detailed RFQs, specifications & formal inquiries',
    link: `mailto:${company.email}`,
    linkText: 'Send Email ->'
  },
  {
    title: 'DIRECT PHONE DESK',
    val: company.phone,
    sub: 'Monday–Saturday: 10:00 AM–7:00 PM IST | Sunday: Closed',
    link: `tel:${company.phone.replace(/[^0-9+]/g, '')}`,
    linkText: 'Call Commercial Desk ->'
  },
  {
    title: 'OFFICIAL WEB PORTAL',
    val: company.siteUrl.replace('https://', ''),
    sub: 'Browse live products, catalog updates & company profile',
    link: company.siteUrl,
    linkText: 'Visit aksharworldtrade.com ->'
  }
]

contactBoxes.forEach((cb, idx) => {
  const cx = idx % 2 === 0 ? 40 : 305
  const cy = 280 + Math.floor(idx / 2) * 98

  doc.roundedRect(cx, cy, 250, 88, 6).fillAndStroke(WHITE, BORDER_COLOR)
  doc.roundedRect(cx, cy, 4, 88, 2).fill(GOLD_MAIN)

  doc.fillColor(NAVY_MAIN).fontSize(7.5).font('Helvetica-Bold').text(cb.title, cx + 14, cy + 10, { characterSpacing: 0.5, lineBreak: false })
  doc.fillColor(TEXT_DARK).fontSize(11).font('Helvetica-Bold').text(cb.val, cx + 14, cy + 24, { width: 222, lineBreak: false })
  doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica').text(cb.sub, cx + 14, cy + 42, { width: 222, lineBreak: false })
  
  doc.fillColor(NAVY_MAIN).fontSize(8).font('Helvetica-Bold').text(cb.linkText, cx + 14, cy + 64, { lineBreak: false })
  addClickableRect(cx, cy, 250, 88, cb.link)
})

// Official Social Media Interactive Bar with recognizable SVG vector icons (WhatsApp, Instagram, Facebook, LinkedIn)
const socY = 490
doc.roundedRect(40, socY, 515, 62, 6).fillAndStroke(NAVY_LIGHT, BORDER_COLOR)
doc.fillColor(NAVY_MAIN).fontSize(8.5).font('Helvetica-Bold').text('CONNECT VIA OFFICIAL SOCIAL & MESSAGING CHANNELS:', 55, socY + 12, { lineBreak: false })

const socials = [
  { name: 'WhatsApp', url: `https://wa.me/${company.whatsapp}`, path: SVG_WHATSAPP, color: '#25D366' },
  { name: 'Instagram', url: company.social.instagram, path: SVG_INSTAGRAM, color: '#E4405F' },
  { name: 'Facebook', url: company.social.facebook, path: SVG_FACEBOOK, color: '#1877F2' },
  { name: 'LinkedIn', url: publicLinkedInUrl, path: SVG_LINKEDIN, color: '#0A66C2' }
]

const socCardW = 115
socials.forEach((s, idx) => {
  const curX = 55 + idx * 123
  doc.roundedRect(curX, socY + 28, socCardW, 26, 4).fillAndStroke(WHITE, BORDER_COLOR)
  
  // Render clean vector icon (viewBox 24x24 scaled to 14x14)
  doc.save()
  doc.translate(curX + 8, socY + 34)
  doc.scale(14 / 24)
  doc.path(s.path).fill(s.color)
  doc.restore()

  doc.fillColor(NAVY_MAIN).fontSize(8).font('Helvetica-Bold').text(s.name, curX + 27, socY + 37, { lineBreak: false })
  addClickableRect(curX, socY + 28, socCardW, 26, s.url)
})

// Proforma RFQ Guide Box
const rfqY = 565
doc.roundedRect(40, rfqY, 515, 115, 6).fillAndStroke(WHITE, BORDER_COLOR)
doc.fillColor(NAVY_MAIN).fontSize(10).font('Helvetica-Bold').text('How to Request a Formal Commercial Proforma Offer', 55, rfqY + 14, { lineBreak: false })

const rfqSteps = [
  '1. Commodity & Variety: State product name, target grade, or required physical specifications.',
  '2. Container Volume: Specify required tonnage or container count (e.g. 1 x 20 FT FCL or 40 FT FCL).',
  '3. Target Destination: Indicate discharge port and preferred Incoterm (FOB Indian Port / CIF Destination).',
  '4. Packaging Preferences: Specify bag type (PP / Paper / Jute) and buyer labelling preferences.'
]

let rY = rfqY + 34
rfqSteps.forEach(st => {
  doc.fillColor(TEXT_BODY).fontSize(7.5).font('Helvetica').text(st, 55, rY, { width: 485, lineBreak: false })
  rY += 18
})

// Big Prominent CTA Card
const ctaY = 690
doc.roundedRect(40, ctaY, 515, 90, 6).fill(NAVY_MAIN)
doc.fillColor(WHITE).fontSize(12).font('Helvetica-Bold')
  .text('REQUEST AN EXPORT QUOTATION', 40, ctaY + 16, { width: 515, align: 'center', characterSpacing: 1.5, lineBreak: false })

doc.fillColor(GOLD_MAIN).fontSize(8).font('Helvetica')
  .text('Our export desk will review your requirement and respond with the appropriate quotation details.', 40, ctaY + 36, { width: 515, align: 'center', lineBreak: false })

const ctaBtnW = 210
const ctaBtnH = 24
const ctaBtnX = 40 + (515 - ctaBtnW) / 2
const ctaBtnY = ctaY + 54
doc.roundedRect(ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH, 4).fill(GOLD_MAIN)
doc.fillColor(NAVY_DARK).fontSize(8.5).font('Helvetica-Bold')
  .text('Open Export Quote Form ->', ctaBtnX, ctaBtnY + 7.5, { width: ctaBtnW, align: 'center', lineBreak: false })
addClickableRect(40, ctaY, 515, 90, 'https://aksharworldtrade.com/contact')

// Bottom copyright
doc.fontSize(7).font('Helvetica').fillColor(TEXT_MUTED)
  .text(`(c) ${new Date().getFullYear()} Akshar Worldtrade. All rights reserved. Connecting India with the World.`, 40, 795, { align: 'center', width: 515, lineBreak: false })

doc.end()

writeStream.on('finish', () => {
  console.log(`\nCatalogue PDF generated successfully: ${OUTPUT_FILE}`)
  const stats = fs.statSync(OUTPUT_FILE)
  console.log(`Final File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)`)
  console.log(`Total Pages: ${TOTAL_PAGES}`)
})
