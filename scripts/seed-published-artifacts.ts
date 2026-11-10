import crypto from 'node:crypto'
import { prisma } from '../lib/db'
import { storage } from '../lib/storage'
import {
  createResource,
  attachFileToResource,
  transitionPublicationStatus,
} from '../lib/services/resource.service'
import { buildGenuineXlsx, buildGenuinePdf } from '../lib/storage/ooxml-builder'

export async function seedPublishedArtifacts() {
  console.log('--- SEEDING PUBLISHED ARTIFACTS (GENUINE OOXML & PDF) ---')

  // Find or use admin / author user
  const author = await prisma.user.findFirst({
    where: { isActive: true },
    select: { id: true, name: true },
  })
  const authorId = author?.id

  // Find categories
  const categories = await prisma.resourceCategory.findMany()
  const catMap = new Map(categories.map((c) => [c.slug, c.id]))

  const sampleArtifacts = [
    {
      title: 'Strategic Sourcing 7-Step Maturity Matrix',
      slug: 'strategic-sourcing-7-step-maturity-matrix',
      description:
        'Comprehensive diagnostic model to evaluate procurement maturity across tail-spend automation, contract lifecycle management, risk modeling, and strategic sourcing governance.',
      resourceType: 'TEMPLATE' as const,
      categorySlug: 'procurement-strategy',
      filename: 'strategic-sourcing-maturity-matrix.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      isFeatured: true,
      createBuffer: () => buildGenuineXlsx('Strategic Sourcing 7-Step Maturity Matrix'),
    },
    {
      title: 'Multi-Tier Supplier Disruption Risk Scorecard',
      slug: 'multi-tier-supplier-disruption-risk-scorecard',
      description:
        'Quantitative scoring rubric to identify single-source dependencies, measure maritime corridor vulnerability, and model buffer inventory safety stocks.',
      resourceType: 'ARTIFACT' as const,
      categorySlug: 'supplier-risk-compliance',
      filename: 'supplier-disruption-scorecard.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      isFeatured: true,
      createBuffer: () => buildGenuineXlsx('Multi-Tier Supplier Disruption Risk Scorecard'),
    },
    {
      title: 'Enterprise AI Procurement Architecture Blueprint',
      slug: 'enterprise-ai-procurement-architecture-blueprint',
      description:
        'Practitioner implementation guide and technical blueprint for deploying autonomous invoice intake, rate-card audit agents, and contract clause verification.',
      resourceType: 'ARTIFACT' as const,
      categorySlug: 'digital-transformation-ai',
      filename: 'enterprise-ai-procurement-blueprint.pdf',
      mimeType: 'application/pdf',
      isFeatured: false,
      createBuffer: () => buildGenuinePdf('Enterprise AI Procurement Architecture Blueprint'),
    },
  ]

  for (const item of sampleArtifacts) {
    const existing = await prisma.resource.findUnique({
      where: { slug: item.slug },
      include: { files: true },
    })

    let resourceId = existing?.id

    if (!existing) {
      const categoryId = catMap.get(item.categorySlug)
      const categoryIds = categoryId ? [categoryId] : []

      // 1. Create Resource as DRAFT
      const created = await createResource({
        title: item.title,
        slug: item.slug,
        description: item.description,
        resourceType: item.resourceType,
        status: 'DRAFT',
        isFeatured: item.isFeatured,
        authorId,
        categoryIds,
      })

      if (!created) {
        console.error(`Failed to create resource "${item.title}"`)
        continue
      }
      resourceId = created.id
    }

    // 2. Generate genuine file buffer and upload to storage
    const buffer = item.createBuffer()
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex')
    const storedMeta = await storage.upload({
      filename: item.filename,
      buffer,
      mimeType: item.mimeType,
    })

    // If existing has existing files, update the primary file or attach new
    if (existing && existing.files.length > 0) {
      const primaryFile = existing.files[0]
      await prisma.resourceFile.update({
        where: { id: primaryFile.id },
        data: {
          originalFilename: item.filename,
          storageKey: storedMeta.storageKey,
          mimeType: item.mimeType,
          fileSize: buffer.length,
          checksum,
        },
      })
      console.log(`Updated existing asset with genuine file: "${item.title}" (${storedMeta.storageKey}, ${buffer.length} bytes, sha256: ${checksum.slice(0, 16)}...)`)
    } else {
      // 3. Attach file to resource
      await attachFileToResource(resourceId!, {
        originalFilename: item.filename,
        storageKey: storedMeta.storageKey,
        mimeType: item.mimeType,
        fileSize: buffer.length,
        checksum,
        isPrimary: true,
      })

      // 4. Publish Resource (DRAFT -> REVIEW -> PUBLISHED per state machine)
      await transitionPublicationStatus(resourceId!, 'REVIEW', authorId)
      await transitionPublicationStatus(resourceId!, 'PUBLISHED', authorId)

      console.log(`Successfully created, attached genuine file, and published: "${item.title}" (slug: ${item.slug})`)
    }
  }

  console.log('--- SEEDING COMPLETE ---')
}

if (process.argv[1]?.includes('seed-published-artifacts')) {
  seedPublishedArtifacts()
    .catch((err) => {
      console.error('Seeding failed:', err)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
