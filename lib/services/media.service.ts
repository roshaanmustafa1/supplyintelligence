import { prisma } from '@/lib/db'

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
