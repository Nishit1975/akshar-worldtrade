import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=')
  if (k && v) {
    env[k.trim()] = v.join('=').trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, main_image, gallery_images, status')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log(`Total products fetched: ${products.length}`)
  const productsWithImage = products.filter(p => p.main_image)
  console.log(`Products with main_image: ${productsWithImage.length}`)
  
  console.log('\nSample images:')
  productsWithImage.slice(0, 10).forEach(p => {
    console.log(`- ${p.name}: ${p.main_image}`)
  })

  // List all main_images to see pattern
  const imageList = productsWithImage.map(p => ({
    id: p.id,
    name: p.name,
    main_image: p.main_image,
    gallery_images: p.gallery_images
  }))

  const outPath = path.resolve(__dirname, '../scripts/products_images.json')
  fs.writeFileSync(outPath, JSON.stringify(imageList, null, 2))
  console.log(`Saved ${imageList.length} products to ${outPath}`)
}

check()
