import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { checkAuth } from '@/lib/authorization'
import { prisma } from '@/lib/db'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

type ImageKind = { ext: string; mime: string }

/** Identify the image type from magic bytes — never trust the client-provided type or filename. */
function detectImage(buf: Buffer): ImageKind | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: '.jpg', mime: 'image/jpeg' }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: '.png', mime: 'image/png' }
  }
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return { ext: '.gif', mime: 'image/gif' }
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return { ext: '.webp', mime: 'image/webp' }
  }
  return null
}

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
    const kind = detectImage(buffer)
    if (!kind) {
      return NextResponse.json({ error: 'Only JPG, PNG, GIF or WebP images are allowed' }, { status: 400 })
    }

    const filename = `${crypto.randomUUID()}${kind.ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'articles')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), buffer)

    const url = `/uploads/articles/${filename}`
    await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: path.basename(file.name).slice(0, 200) || filename,
        mimeType: kind.mime,
        sizeBytes: buffer.length,
        storagePath: `public${url}`,
        url,
        uploadedBy: auth.userId,
      },
    })

    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
