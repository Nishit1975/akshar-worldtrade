import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const summaryPath = path.join(__dirname, 'optimized_summary.json')

if (!fs.existsSync(summaryPath)) {
  console.error('optimized_summary.json not found!')
  process.exit(1)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
const products = summary.products || []

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cesbnetuuwzwvflmjbcs.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function run() {
  console.log(`Starting upload and database update for ${products.length} products...`)

  const migrationLog = []
  let uploadedCount = 0
  let updatedCount = 0
  let verifiedCount = 0

  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    const { id, name, oldUrl, oldSizeBytes, newSizeBytes, localWebpPath, destStoragePath, newUrl } = item

    console.log(`\n[${i + 1}/${products.length}] Processing "${name}" (${id})`)

    if (!fs.existsSync(localWebpPath)) {
      throw new Error(`Local file not found: ${localWebpPath}`)
    }

    const fileBuffer = fs.readFileSync(localWebpPath)

    // 1. Upload to Supabase Storage: product-images/<destStoragePath>
    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(destStoragePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (uploadErr) {
      console.error(`Upload error for ${name}:`, uploadErr)
      throw uploadErr
    }
    uploadedCount++
    console.log(`  Uploaded -> ${destStoragePath}`)

    // 2. Update products table: ONLY main_image
    const { error: updateErr } = await supabase
      .from('products')
      .update({ main_image: newUrl })
      .eq('id', id)

    if (updateErr) {
      console.error(`DB update error for ${name}:`, updateErr)
      throw updateErr
    }
    updatedCount++
    console.log(`  DB updated -> main_image = ${newUrl}`)

    // 3. Verify public URL responds with HTTP 200
    const res = await fetch(newUrl, { method: 'HEAD' })
    if (res.status !== 200) {
      throw new Error(`Verification failed for ${newUrl}: HTTP ${res.status}`)
    }
    const contentType = res.headers.get('content-type')
    const contentLength = res.headers.get('content-length')
    verifiedCount++
    console.log(`  Verified HTTP ${res.status}, content-type: ${contentType}, length: ${contentLength}`)

    migrationLog.push({
      productId: id,
      name,
      oldPath: oldUrl,
      newWebpPath: newUrl,
      oldSizeBytes,
      oldSizeMB: (oldSizeBytes / (1024 * 1024)).toFixed(2),
      newSizeBytes,
      newSizeKB: (newSizeBytes / 1024).toFixed(2),
      reductionPercent: (((oldSizeBytes - newSizeBytes) / oldSizeBytes) * 100).toFixed(1),
      httpStatus: res.status,
      verifiedContentType: contentType,
    })
  }

  // Save complete mapping log
  const logFile = path.join(__dirname, 'migration_mapping.json')
  fs.writeFileSync(
    logFile,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        totalProducts: products.length,
        uploadedCount,
        updatedCount,
        verifiedCount,
        products: migrationLog,
      },
      null,
      2
    ),
    'utf-8'
  )

  console.log('\n========================================')
  console.log(' MIGRATION & VERIFICATION COMPLETED')
  console.log('========================================')
  console.log(`Uploaded to Storage: ${uploadedCount}/${products.length}`)
  console.log(`Updated in Database: ${updatedCount}/${products.length}`)
  console.log(`Verified HTTP 200:   ${verifiedCount}/${products.length}`)
  console.log(`Detailed log written to: ${logFile}`)
}

run().catch((err) => {
  console.error('Fatal error during upload/update:', err)
  process.exit(1)
})
