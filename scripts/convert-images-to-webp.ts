/**
 * Converts the JPG/PNG images in public/images and public/uploads to WebP,
 * rewrites every reference (source files and database text columns), then moves
 * the original files out of public/ into image-originals/ so they are no longer
 * served but remain available.
 *
 * Usage: npx tsx scripts/convert-images-to-webp.ts [--dry]
 */
import fs from 'node:fs'
import path from 'node:path'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/db'
import { detectImage, toWebp } from '../lib/image-webp'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const ORIGINALS_DIR = path.join(ROOT, 'image-originals')
const IMAGE_ROOTS = ['images', 'uploads']

// Referenced by social/SEO crawlers (og:image, JSON-LD logo): keep as-is in public/.
const KEEP_AS_IS = new Set(['/images/hero-container-ship.jpg', '/images/logo.png'])

const SOURCE_DIRS = ['app', 'components', 'lib', 'data', 'scripts']
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.json', '.mjs', '.css'])

function walk(dir: string, extensions: Set<string>, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, extensions, out)
    } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

const toUrl = (file: string) => '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/')

async function main() {
  const dry = process.argv.includes('--dry')

  // 1. Collect JPG/PNG files and convert them next to the originals.
  const images = IMAGE_ROOTS.flatMap((root) =>
    walk(path.join(PUBLIC_DIR, root), new Set(['.jpg', '.jpeg', '.png']))
  ).filter((file) => !KEEP_AS_IS.has(toUrl(file)))

  const mappings: { file: string; oldUrl: string; newUrl: string; newFile: string }[] = []
  let savedBytes = 0

  for (const file of images) {
    const oldUrl = toUrl(file)
    const newFile = file.replace(/\.(jpe?g|png)$/i, '.webp')
    const newUrl = toUrl(newFile)

    const buffer = fs.readFileSync(file)
    const kind = detectImage(buffer)
    if (!kind) {
      console.warn(`Skipping (not a valid image): ${oldUrl}`)
      continue
    }

    if (!fs.existsSync(newFile)) {
      const converted = await toWebp(buffer, kind)
      if (converted.kind.ext !== '.webp') {
        console.warn(`Skipping (conversion failed): ${oldUrl}`)
        continue
      }
      if (!dry) fs.writeFileSync(newFile, converted.buffer)
      savedBytes += buffer.length - converted.buffer.length
    }
    mappings.push({ file, oldUrl, newUrl, newFile })
  }

  console.log(`Images to convert: ${mappings.length}. Size saved: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`)

  // 2. Rewrite references in source files.
  const sourceFiles = [
    ...SOURCE_DIRS.flatMap((dir) => walk(path.join(ROOT, dir), SOURCE_EXTENSIONS)),
    ...fs
      .readdirSync(path.join(ROOT, 'prisma'))
      .filter((name) => name.endsWith('.ts'))
      .map((name) => path.join(ROOT, 'prisma', name)),
  ]

  let rewrittenFiles = 0
  for (const file of sourceFiles) {
    if (file.endsWith('convert-images-to-webp.ts')) continue
    let text = fs.readFileSync(file, 'utf8')
    const original = text
    for (const { oldUrl, newUrl } of mappings) text = text.split(oldUrl).join(newUrl)
    if (text !== original) {
      rewrittenFiles++
      if (!dry) fs.writeFileSync(file, text)
    }
  }
  console.log(`Source files updated: ${rewrittenFiles}`)

  // 3. Rewrite references in database text columns (works on SQLite and PostgreSQL).
  const isSqlite = (process.env.DATABASE_URL ?? '').startsWith('file:')
  const placeholder = (n: number) => (isSqlite ? '?' : `$${n}`)
  const quote = (name: string) => `"${name.replace(/"/g, '""')}"`
  const params = mappings.flatMap((m) => [m.oldUrl, m.newUrl])

  let dbColumnsUpdated = 0
  for (const model of Prisma.dmmf.datamodel.models) {
    const tbl = quote(model.dbName ?? model.name)
    for (const field of model.fields) {
      if (field.kind !== 'scalar' || field.type !== 'String') continue
      const col = quote(field.dbName ?? field.name)

      const hits = await prisma.$queryRawUnsafe<{ n: number | bigint }[]>(
        `SELECT count(*) AS n FROM ${tbl} WHERE ${col} LIKE '%/images/%' OR ${col} LIKE '%/uploads/%'`
      )
      if (Number(hits[0].n) === 0) continue

      // Nested REPLACE over every mapping, one statement per column.
      let expr = col
      mappings.forEach((_, i) => {
        expr = `REPLACE(${expr}, ${placeholder(i * 2 + 1)}, ${placeholder(i * 2 + 2)})`
      })
      console.log(`DB ${model.name}.${field.name}: ${hits[0].n} row(s) contain image links`)
      dbColumnsUpdated++
      if (!dry) {
        await prisma.$executeRawUnsafe(
          `UPDATE ${tbl} SET ${col} = ${expr} WHERE ${col} LIKE '%/images/%' OR ${col} LIKE '%/uploads/%'`,
          ...params
        )
      }
    }
  }
  console.log(`DB columns updated: ${dbColumnsUpdated}`)

  // 4. Keep MediaAsset metadata consistent with the converted files.
  if (!dry) {
    for (const { newUrl, newFile } of mappings) {
      if (!newUrl.startsWith('/uploads/')) continue
      await prisma.mediaAsset.updateMany({
        where: { url: newUrl },
        data: {
          filename: path.basename(newFile),
          mimeType: 'image/webp',
          sizeBytes: fs.statSync(newFile).size,
        },
      })
    }
  }

  // 5. Move originals out of public/ so they are no longer served.
  if (!dry) {
    for (const { file } of mappings) {
      const target = path.join(ORIGINALS_DIR, path.relative(PUBLIC_DIR, file))
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.renameSync(file, target)
    }
    console.log(`Originals moved to image-originals/ (${mappings.length} files).`)
  }

  console.log(dry ? 'Dry run only: nothing was written.' : 'Done.')
}

main()
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
