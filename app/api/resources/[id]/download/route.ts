import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  getResourceById,
  getResourceBySlug,
  recordResourceEvent,
} from '@/lib/services/resource.service'
import { storage } from '@/lib/storage'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')

  try {
    let resource = await getResourceById(id, { includeUnpublished: false })
    if (!resource) {
      resource = await getResourceBySlug(id, { includeUnpublished: false })
    }

    if (!resource || resource.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Resource not found or not published' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        }
      )
    }

    // Determine target file
    let targetFile = resource.files.find((f) => (fileId ? f.id === fileId : f.isPrimary))
    if (!targetFile && resource.files.length > 0) {
      targetFile = resource.files[0]
    }

    if (!targetFile) {
      return NextResponse.json(
        { error: 'No downloadable asset attached to this resource' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        }
      )
    }

    const storedFile = await storage.download(targetFile.storageKey)
    if (!storedFile) {
      console.error(`Physical file missing from storage for key: ${targetFile.storageKey}`)
      return NextResponse.json(
        { error: 'File asset temporarily unavailable' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        }
      )
    }

    // Record download event asynchronously
    void recordResourceEvent(resource.id, 'DOWNLOAD', {
      fileId: targetFile.id,
      filename: targetFile.originalFilename,
    }).catch(() => { })

    // Sanitize filename for Content-Disposition header
    const sanitizedFilename = targetFile.originalFilename.replace(/["\r\n\\]/g, '_')

    let body: Buffer
    if (Buffer.isBuffer(storedFile.stream)) {
      body = storedFile.stream
    } else {
      const chunks: Buffer[] = []
      for await (const chunk of storedFile.stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      body = Buffer.concat(chunks)
    }

    // CLAIM-01: Download-time SHA-256 integrity verification against database checksum
    if (targetFile.checksum) {
      const calculatedChecksum = crypto.createHash('sha256').update(body).digest('hex')
      if (calculatedChecksum.toLowerCase() !== targetFile.checksum.toLowerCase()) {
        console.error(
          `Integrity mismatch for file ${targetFile.id} (${targetFile.storageKey}): expected ${targetFile.checksum}, got ${calculatedChecksum}`
        )
        return NextResponse.json(
          { error: 'File integrity verification failed. The asset checksum does not match the database record.' },
          {
            status: 500,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          }
        )
      }
    }

    const isInline = searchParams.get('inline') === 'true'
    const dispositionType = isInline ? 'inline' : 'attachment'

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': targetFile.mimeType,
        'Content-Disposition': `${dispositionType}; filename="${sanitizedFilename}"`,
        'Content-Length': body.length.toString(),
        'Cache-Control': 'private, no-transform',
      },
    })
  } catch (error) {
    console.error(`Error downloading file for resource '${id}':`, error)
    return NextResponse.json(
      { error: 'Download request failed' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    )
  }
}
