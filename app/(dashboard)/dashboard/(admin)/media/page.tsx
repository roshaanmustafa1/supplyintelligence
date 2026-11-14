import { Image as ImageIcon } from 'lucide-react'
import { MediaUploadButton } from '@/components/dashboard/MediaUploadButton'
import { MediaLibrary } from '@/components/dashboard/MediaLibrary'
import { getMediaAssets } from '@/lib/services/media.service'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Existing library images, imported into the database on first visit so they can be managed.
const SEED_ASSETS = [
  { title: 'Hero Container Ship entering Terminal', path: '/images/hero-container-ship.jpg', alt: 'Large cargo container ship sailing into industrial maritime port', kb: 240 },
  { title: 'Procurement Process Analytics Display', path: '/images/procurement-workflows.jpg', alt: 'Corporate executive dashboard showing procurement workflows and KPIs', kb: 185 },
  { title: 'Intelligent Automated Distribution Center', path: '/images/supply-chain-flow.jpg', alt: 'Automated warehouse distribution hub with conveyor system', kb: 310 },
  { title: 'Intermodal Freight Railway Corridor', path: '/images/freight-corridors.jpg', alt: 'Freight train transporting double-stacked shipping containers through mountain pass', kb: 275 },
  { title: 'Executive Logistics Boardroom Strategy', path: '/images/blog-discussion.jpg', alt: 'Senior supply chain leaders reviewing operational plans in conference room', kb: 215 },
  { title: 'Autonomous Distribution Hub Video Showcase', path: '/images/blog-video-thumb.jpg', alt: 'Smart conveyor sorting facility operations preview', kb: 190 },
]

async function loadAssets() {
  if ((await prisma.mediaAsset.count()) === 0) {
    await prisma.mediaAsset.createMany({
      data: SEED_ASSETS.map((a) => ({
        filename: a.path.split('/').pop() ?? a.path,
        originalName: a.title,
        mimeType: 'image/jpeg',
        sizeBytes: a.kb * 1024,
        storagePath: `public${a.path}`,
        url: a.path,
        altText: a.alt,
        uploadedBy: 'system',
      })),
    })
  }
  return getMediaAssets()
}

export default async function MediaPage() {
  const assets = await loadAssets()

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
            <ImageIcon className="size-4" />
            <span>Digital Asset Management</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Media & Asset Library
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            High-resolution hero photography, editorial infographics, and video assets for article releases.
          </p>
        </div>

        <MediaUploadButton />
      </div>

      <MediaLibrary
        initialAssets={assets.map((a) => ({
          id: a.id,
          originalName: a.originalName,
          url: a.url,
          altText: a.altText,
          sizeBytes: a.sizeBytes,
        }))}
      />
    </div>
  )
}
