import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'products_images.json'), 'utf8'))

async function audit() {
  console.log(`Auditing ${products.length} product images...`)
  const results = []
  let totalBytes = 0

  for (const p of products) {
    if (!p.main_image) continue
    try {
      const res = await fetch(p.main_image, { method: 'HEAD' })
      const contentLength = res.headers.get('content-length')
      const contentType = res.headers.get('content-type')
      const sizeBytes = contentLength ? parseInt(contentLength, 10) : 0
      totalBytes += sizeBytes
      results.push({
        id: p.id,
        name: p.name,
        url: p.main_image,
        sizeBytes,
        sizeMB: (sizeBytes / (1024 * 1024)).toFixed(2),
        contentType
      })
    } catch (err) {
      console.error(`Failed HEAD for ${p.name}:`, err.message)
    }
  }

  // Sort descending by size
  results.sort((a, b) => b.sizeBytes - a.sizeBytes)

  console.log(`\nAudit Complete:`)
  console.log(`Total Products: ${results.length}`)
  console.log(`Total Image Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`)
  
  const over2MB = results.filter(r => r.sizeBytes >= 2 * 1024 * 1024)
  const over1MB = results.filter(r => r.sizeBytes >= 1024 * 1024 && r.sizeBytes < 2 * 1024 * 1024)
  const under1MB = results.filter(r => r.sizeBytes < 1024 * 1024)

  console.log(`Images >= 2 MB: ${over2MB.length}`)
  console.log(`Images 1-2 MB: ${over1MB.length}`)
  console.log(`Images < 1 MB: ${under1MB.length}`)

  console.log('\nTop 15 largest product images:')
  results.slice(0, 15).forEach(r => {
    console.log(`- ${r.name}: ${r.sizeMB} MB (${r.contentType}) - ${r.url.split('/').pop()}`)
  })

  fs.writeFileSync(path.resolve(__dirname, 'audit_results.json'), JSON.stringify({
    totalBytes,
    totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
    results
  }, null, 2))
}

audit()
