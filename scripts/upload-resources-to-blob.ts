/**
 * One-off: copies existing files from storage/resources to the private Vercel Blob store,
 * keeping the same storageKey so existing database rows keep working.
 * Usage: BLOB_READ_WRITE_TOKEN=... npx tsx scripts/upload-resources-to-blob.ts
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'

async function main() {
  const dir = path.join(process.cwd(), 'storage', 'resources')
  const files = (await fs.readdir(dir)).filter((f) => /\.(xlsx|docx|pdf)$/i.test(f))
  for (const file of files) {
    await put(`resources/${file}`, await fs.readFile(path.join(dir, file)), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    console.log(`uploaded ${file}`)
  }
  console.log(`Done: ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
