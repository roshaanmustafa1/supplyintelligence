import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/authorization'
import { storeArticleImage } from '@/lib/services/media.service'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    // Validates by magic bytes and converts JPG/PNG to WebP before saving.
    const stored = await storeArticleImage(buffer, file.name, auth.userId)
    if (!stored) {
      return NextResponse.json({ error: 'Only JPG, PNG, GIF or WebP images are allowed' }, { status: 400 })
    }

    return NextResponse.json({ url: stored.url }, { status: 201 })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
