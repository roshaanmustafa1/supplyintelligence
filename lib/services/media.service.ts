import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/lib/db'
import { detectImage, toWebp } from '@/lib/image-webp'

export interface UpdateMediaInput {
  originalName?: string
  altText?: string | null
  caption?: string | null
}

export async function getMediaAssets() {
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: 'asc' } })
}

export async function updateMediaAsset(id: string, data: UpdateMediaInput) {
  return prisma.mediaAsset.update({ where: { id }, data })
}

export async function deleteMediaAsset(id: string) {
  return prisma.$transaction([
    prisma.mediaUsage.deleteMany({ where: { assetId: id } }),
    prisma.mediaAsset.delete({ where: { id } }),
  ])
}

/**
 * Validates an image buffer by its magic bytes, converts JPG/PNG to WebP, stores it
 * under public/uploads/articles and records a MediaAsset. Returns null when the
 * buffer is not a supported image.
 */
export async function storeArticleImage(
  buffer: Buffer,
  originalName: string,
  uploadedBy: string,
  altText?: string | null
): Promise<{ url: string; mimeType: string } | null> {
  const detected = detectImage(buffer)
  if (!detected) return null

  const { buffer: output, kind } = await toWebp(buffer, detected)

  const filename = `${crypto.randomUUID()}${kind.ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'articles')
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), output)

  const url = `/uploads/articles/${filename}`
  await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: path.basename(originalName).slice(0, 200) || filename,
      mimeType: kind.mime,
      sizeBytes: output.length,
      storagePath: `public${url}`,
      url,
      altText: altText?.slice(0, 300) || null,
      uploadedBy,
    },
  })

  return { url, mimeType: kind.mime }
}
