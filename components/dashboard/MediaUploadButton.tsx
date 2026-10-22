'use client'

import { Upload } from 'lucide-react'

export function MediaUploadButton() {
  return (
    <button
      type="button"
      onClick={() => alert('Media Uploader: Select file from system to upload to public/images/')}
      className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
    >
      <Upload className="size-4" />
      <span>Upload Asset</span>
    </button>
  )
}
