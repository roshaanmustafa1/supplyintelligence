import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../lib/db'
import {
  createResource,
  attachFileToResource,
  transitionPublicationStatus,
} from '../lib/services/resource.service'

const FILENAME = 'LIST-40.xlsx'
const SLUG = 'list-40'
const MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

async function main() {
  const filePath = path.join(process.cwd(), 'storage', 'resources', FILENAME)
  const buffer = fs.readFileSync(filePath)
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex')

  const existingFile = await prisma.resourceFile.findUnique({ where: { storageKey: FILENAME } })
  if (existingFile) {
    console.log('LIST-40 is already registered as an artifact; nothing to do.')
    return
  }

  const author = await prisma.user.findFirst({ where: { isActive: true }, select: { id: true } })
  const categories = await prisma.resourceCategory.findMany({ select: { id: true, slug: true, name: true } })
  console.log('Available categories:', categories.map((c) => c.slug).join(', ') || '(none)')

  const created = await createResource({
    title: 'LIST-40',
    slug: SLUG,
    description: 'LIST-40 spreadsheet.',
    resourceType: 'ARTIFACT',
    status: 'DRAFT',
    authorId: author?.id,
    categoryIds: [],
  })
  if (!created) throw new Error('Failed to create resource')

  await attachFileToResource(created.id, {
    originalFilename: FILENAME,
    storageKey: FILENAME,
    mimeType: MIME,
    fileSize: buffer.length,
    checksum,
    isPrimary: true,
  })
  await transitionPublicationStatus(created.id, 'REVIEW', author?.id)
  await transitionPublicationStatus(created.id, 'PUBLISHED', author?.id)
  console.log(`Published artifact "LIST-40" (${buffer.length} bytes).`)
}

main()
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
