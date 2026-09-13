/**
 * Sample product data for UI demonstration.
 *
 * IMPORTANT: Phase 5 will replace this with a Supabase query.
 * The data shape exactly matches the `products` table schema so
 * the UI components require zero changes when switching to live data.
 *
 * Fields match the planned Supabase schema:
 *   id, name, slug, category (label), categoryId, shortDescription,
 *   fullDescription, image (null = use placeholder), specifications (object),
 *   packaging, moq, origin, featured, status
 */
export const products = [
  {
    id: '1',
    name: 'Premium Basmati Rice',
    slug: 'basmati-rice',
    category: 'Grains & Cereals',
    categoryId: 'grains-cereals',
    shortDescription:
      'Long-grain aromatic basmati rice sourced from established growing regions in northern India, meeting international food safety standards.',
    fullDescription: `Premium Basmati Rice is one of India's most prized agricultural exports, celebrated for its distinctive long grains, delicate floral aroma, and exceptional cooking quality. Our basmati is carefully selected from established growing regions and processed under strict quality controls to meet international food safety standards.

Grains are aged to enhance their natural aroma and non-sticky texture after cooking. Each shipment is inspected for moisture content, grain integrity, and purity before dispatch. We offer both raw and parboiled variants, with the ability to accommodate custom packaging and grading requirements from international buyers.`,
    image: null,
    specifications: {
      'Grain Type':        'Long Grain Basmati',
      'Average Length':    '7.5 mm (min)',
      'Moisture Content':  '12.5% max',
      'Broken Grains':     '1% max',
      'Purity':            '99.5% min',
      'Foreign Matter':    'Nil',
    },
    packaging: '25 kg / 50 kg PP woven bags or as per buyer requirement',
    moq: '20 MT',
    origin: 'India',
    featured: true,
    status: 'published',
  },
  {
    id: '2',
    name: 'Cumin Seeds (Jeera)',
    slug: 'cumin-seeds',
    category: 'Spices',
    categoryId: 'spices',
    shortDescription:
      'Bold, aromatic cumin seeds sourced from prime growing regions of Rajasthan and Gujarat with consistent quality and purity.',
    fullDescription: `Cumin Seeds (Cumin cyminum), commonly known as Jeera, are among India's most valued spice exports. Our cumin is sourced from Rajasthan and Gujarat — traditionally recognized as the finest cumin-producing regions — and is processed and cleaned to international export standards.

We supply whole cumin seeds that are bold in aroma, consistent in size, and free from foreign matter. Our processing ensures moisture levels are controlled and the natural essential oils that give cumin its distinctive flavor are preserved. Available in sorted and machine-cleaned grades to meet buyer specifications.`,
    image: null,
    specifications: {
      'Type':           'Whole Cumin Seeds',
      'Purity':         '99% min',
      'Moisture':       '10% max',
      'Admixture':      '1% max',
      'Color':          'Light green to brown',
      'Flavor':         'Strong, characteristic',
    },
    packaging: '25 kg PP bags with inner liner, or as per buyer requirement',
    moq: '5 MT',
    origin: 'India (Rajasthan / Gujarat)',
    featured: true,
    status: 'published',
  },
  {
    id: '3',
    name: 'Turmeric Powder',
    slug: 'turmeric-powder',
    category: 'Spices',
    categoryId: 'spices',
    shortDescription:
      'Bright, high-curcumin turmeric powder processed from premium rhizomes cultivated in Andhra Pradesh and Telangana.',
    fullDescription: `India is the world's largest producer, consumer, and exporter of turmeric, and our turmeric powder reflects the finest quality this heritage provides. We source from prime cultivation areas in Andhra Pradesh and Telangana, where high-curcumin varieties are grown under optimal conditions.

Our turmeric is processed in hygienically maintained facilities, producing a vivid golden-yellow powder with strong aroma, high curcumin content, and controlled moisture. The product meets international food safety specifications and is available in multiple grades including finger, bulb, and powder form.`,
    image: null,
    specifications: {
      'Form':            'Powder',
      'Curcumin':        '3% – 5%+',
      'Moisture':        '10% max',
      'Total Ash':       '8% max',
      'Colour':          'Deep golden yellow',
      'Mesh Size':       '60 mesh (standard)',
    },
    packaging: '25 kg multiwall paper bags with PP liner, or as per buyer requirement',
    moq: '5 MT',
    origin: 'India (Andhra Pradesh / Telangana)',
    featured: true,
    status: 'published',
  },
  {
    id: '4',
    name: 'Black Pepper',
    slug: 'black-pepper',
    category: 'Spices',
    categoryId: 'spices',
    shortDescription:
      'Bold and pungent whole black pepper sourced from India\'s spice coast regions, available in multiple grades.',
    fullDescription: `Black pepper, often called the "King of Spices," is one of the most traded commodities in global spice markets. Our black pepper is sourced from established spice-growing belts and processed to international standards.

We supply bold-sized whole peppercorns with strong piperine content and consistent color. Available in various grades including FAQ (Fair Average Quality), ASTA-compliant grades, and steam-sterilized variants for markets with strict microbial requirements.`,
    image: null,
    specifications: {
      'Type':         'Whole Black Pepper',
      'Purity':       '99% min',
      'Moisture':     '12% max',
      'Light Berries': '2% max',
      'Bulk Density': '550 g/L min',
      'Piperine':     '4% min',
    },
    packaging: '50 kg jute bags / 25 kg PP bags, or as per buyer requirement',
    moq: '5 MT',
    origin: 'India (Kerala / Karnataka)',
    featured: false,
    status: 'published',
  },
  {
    id: '5',
    name: 'Kabuli Chickpeas',
    slug: 'kabuli-chickpeas',
    category: 'Pulses',
    categoryId: 'pulses',
    shortDescription:
      'Large, cream-white Kabuli chickpeas with smooth coat and consistent sizing, ideal for retail and food processing markets.',
    fullDescription: `Kabuli Chickpeas (Cicer arietinum) are large, cream-coloured legumes with a smooth seed coat, popular in Middle Eastern, Mediterranean, and European cuisines. India is a major global supplier of Kabuli chickpeas and our product is sourced from established growing belts with consistent quality.

We supply machine-cleaned and sorted chickpeas in various sizes to meet buyer grading requirements. Our chickpeas are ideal for direct retail packaging, hummus production, canning, and food service supply chains. All lots are tested for aflatoxin, moisture, and foreign matter prior to shipment.`,
    image: null,
    specifications: {
      'Type':         'Kabuli Chickpeas',
      'Count':        '36/40, 40/42, 42/44 per 100g (as required)',
      'Moisture':     '13% max',
      'Admixture':    '0.5% max',
      'Purity':       '99% min',
      'Aflatoxin':    'Within permitted limits',
    },
    packaging: '25 kg / 50 kg PP woven bags, or as per buyer requirement',
    moq: '10 MT',
    origin: 'India (Madhya Pradesh / Rajasthan)',
    featured: false,
    status: 'published',
  },
  {
    id: '6',
    name: 'Sesame Seeds (Natural)',
    slug: 'sesame-seeds',
    category: 'Seeds & Oils',
    categoryId: 'seeds-oils',
    shortDescription:
      'Natural un-hulled sesame seeds with high oil content, sourced from Gujarat and Rajasthan, available in natural and hulled variants.',
    fullDescription: `Sesame Seeds (Sesamum indicum) are among India's most valuable seed exports, sought globally for their high oil content, nutritional value, and versatile culinary applications. India is one of the world's largest exporters of sesame seeds.

We supply natural (un-hulled) and hulled sesame seeds in white, black, and mixed varieties. Our sesame is machine-cleaned, sortex-processed, and tested for moisture, oil content, free fatty acid value, and aflatoxin. Suitable for direct food use, oil extraction, bakery applications, and tahini production.`,
    image: null,
    specifications: {
      'Type':          'Natural / Hulled',
      'Oil Content':   '48–52%',
      'Moisture':      '6% max',
      'Free FFA':      '2% max',
      'Purity':        '99.95% min',
      'Admixture':     '0.05% max',
    },
    packaging: '25 kg PP bags with liner / 50 kg jute bags, or as per buyer requirement',
    moq: '5 MT',
    origin: 'India (Gujarat / Rajasthan)',
    featured: true,
    status: 'published',
  },
]

/** Featured products — used on homepage. Phase 5: query where featured=true */
export const featuredProducts = products.filter((p) => p.featured && p.status === 'published')

/** All published products — used on products page. Phase 5: query where status=published */
export const publishedProducts = products.filter((p) => p.status === 'published')

/** Find a product by slug. Phase 5: Supabase single-row query */
export const getProductBySlug = (slug) => products.find((p) => p.slug === slug) ?? null

export default products
