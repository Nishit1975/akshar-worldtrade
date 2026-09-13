import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const auditPath = path.join(__dirname, 'audit_results.json')
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf-8'))
const products = auditData.results || []

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cesbnetuuwzwvflmjbcs.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function cleanup() {
  console.log(`Starting cleanup of old PNG images for ${products.length} products...`)

  const oldStoragePaths = products.map((p) => {
    // Extract path after /product-images/
    const marker = '/product-images/'
    const idx = p.url.indexOf(marker)
    if (idx === -1) {
      throw new Error(`Unexpected URL format: ${p.url}`)
    }
    return decodeURIComponent(p.url.slice(idx + marker.length))
  })

  console.log(`Deleting ${oldStoragePaths.length} old PNG objects from Supabase Storage...`)
  
  // Supabase remove takes array of file paths
  const { data, error } = await supabase.storage
    .from('product-images')
    .remove(oldStoragePaths)

  if (error) {
    console.error('Error removing old files:', error)
    throw error
  }

  console.log(`Successfully removed ${data?.length || oldStoragePaths.length} old PNG images from Supabase Storage.`)

  // Clean up local temp files in scripts/temp_webp
  const tempDir = path.join(__dirname, 'temp_webp')
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
    console.log('Cleaned up scripts/temp_webp directory.')
  }

  // Clean up local category PNGs now replaced by WebP
  const assetsDir = path.join(__dirname, '..', 'src', 'assets')
  const localPngsToDelete = [
    'grains-cereals.png',
    'spices-seasonings.png',
    'Spices & Seasonings.png',
  ]

  for (const f of localPngsToDelete) {
    const p = path.join(assetsDir, f)
    if (fs.existsSync(p)) {
      fs.unlinkSync(p)
      console.log(`Removed local asset: ${f}`)
    }
  }

  console.log('Cleanup completed successfully.')
}

cleanup().catch((err) => {
  console.error('Fatal error during cleanup:', err)
  process.exit(1)
})
