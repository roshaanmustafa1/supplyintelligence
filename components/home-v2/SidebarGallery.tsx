'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface GalleryItem {
  id: string
  image: string
  alt: string
  caption: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 'warehouse',
    image: '/images/gallery-warehouse.jpg',
    alt: 'High-bay automated AGV fulfillment center',
    caption: 'Robotics',
  },
  {
    id: 'air-cargo',
    image: '/images/gallery-air-cargo.jpg',
    alt: 'Air cargo ramp operations at twilight',
    caption: 'Air Freight',
  },
  {
    id: 'port-cranes',
    image: '/images/gallery-port-cranes.jpg',
    alt: 'Port container gantry cranes at ocean harbor',
    caption: 'Maritime',
  },
  {
    id: 'intermodal',
    image: '/images/gallery-intermodal-rail.jpg',
    alt: 'Intermodal freight rail yard container cars',
    caption: 'Intermodal',
  },
]

export function SidebarGallery() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
            Field Dispatches
          </h3>
          <span className="text-[11px] font-medium text-slate-400 mt-1 block">
            @supplyintel
          </span>
        </div>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors group"
        >
          <span>Follow Us</span>
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* 4 Square Photos Row */}
      <div className="grid grid-cols-4 gap-2">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer shadow-2xs"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
              <span className="text-[10px] text-white font-semibold leading-tight line-clamp-1">
                {item.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
