import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../lib/db'
import {
  createResource,
  attachFileToResource,
  transitionPublicationStatus,
} from '../lib/services/resource.service'

const FILENAME = 'DEMAND LETTER (WORD FORMAT).docx'
const SLUG = 'demand-letter-word-format'
const MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

async function main() {
  const filePath = path.join(process.cwd(), 'storage', 'resources', FILENAME)
  const buffer = fs.readFileSync(filePath)
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex')

  const existingFile = await prisma.resourceFile.findUnique({ where: { storageKey: FILENAME } })
  if (existingFile) {
    console.log('Demand letter is already registered; nothing to do.')
    return
  }

  const author = await prisma.user.findFirst({ where: { isActive: true }, select: { id: true } })

  const created = await createResource({
    title: 'Demand Letter (Word Format)',
    slug: SLUG,
    description: 'Editable Word template for a formal demand letter.',
    resourceType: 'TEMPLATE',
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
  console.log(`Published template "Demand Letter (Word Format)" (${buffer.length} bytes).`)
}

main()
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
