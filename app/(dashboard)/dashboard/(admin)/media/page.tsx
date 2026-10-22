import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'
import { MediaUploadButton } from '@/components/dashboard/MediaUploadButton'

export const dynamic = 'force-dynamic'

export default function MediaPage() {
  const mediaAssets = [
    {
      id: 'media-1',
      title: 'Hero Container Ship entering Terminal',
      path: '/images/hero-container-ship.jpg',
      alt: 'Large cargo container ship sailing into industrial maritime port',
      size: '240 KB',
      dimensions: '1920 × 1080',
    },
    {
      id: 'media-2',
      title: 'Procurement Process Analytics Display',
      path: '/images/procurement-workflows.jpg',
      alt: 'Corporate executive dashboard showing procurement workflows and KPIs',
      size: '185 KB',
      dimensions: '1600 × 900',
    },
    {
      id: 'media-3',
      title: 'Intelligent Automated Distribution Center',
      path: '/images/supply-chain-flow.jpg',
      alt: 'Automated warehouse distribution hub with conveyor system',
      size: '310 KB',
      dimensions: '1920 × 1200',
    },
    {
      id: 'media-4',
      title: 'Intermodal Freight Railway Corridor',
      path: '/images/freight-corridors.jpg',
      alt: 'Freight train transporting double-stacked shipping containers through mountain pass',
      size: '275 KB',
      dimensions: '1920 × 1080',
    },
    {
      id: 'media-5',
      title: 'Executive Logistics Boardroom Strategy',
      path: '/images/blog-discussion.jpg',
      alt: 'Senior supply chain leaders reviewing operational plans in conference room',
      size: '215 KB',
      dimensions: '1200 × 800',
    },
    {
      id: 'media-6',
      title: 'Autonomous Distribution Hub Video Showcase',
      path: '/images/blog-video-thumb.jpg',
      alt: 'Smart conveyor sorting facility operations preview',
      size: '190 KB',
      dimensions: '1280 × 720',
    },
  ]

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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mediaAssets.map((asset) => (
          <div
            key={asset.id}
            className="group overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm transition-all hover:border-brand-blue/40 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <Image
                src={asset.path}
                alt={asset.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-heading text-sm font-semibold text-dashboard-foreground line-clamp-1">
                {asset.title}
              </h3>
              <p className="font-mono text-xs text-dashboard-muted-foreground truncate">
                {asset.path}
              </p>

              <div className="flex items-center justify-between border-t border-dashboard-border pt-2 text-xs text-dashboard-muted-foreground">
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
