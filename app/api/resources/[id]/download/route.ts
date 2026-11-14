import { NextResponse } from 'next/server'
import { recordResourceEvent } from '@/lib/services/resource.service'
import { loadPublishedResourceFile } from '@/lib/resource-file-delivery'

interface RouteProps {
  params: Promise<{ id: string }>
}

const NO_STORE = 'private, no-cache, no-store, max-age=0, must-revalidate'

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')

  try {
    const result = await loadPublishedResourceFile(id, fileId)
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status, headers: { 'Cache-Control': NO_STORE } }
      )
    }

    const { file, body, resourceId } = result

    // Record download event asynchronously
    void recordResourceEvent(resourceId, 'DOWNLOAD', {
      fileId: file.id,
      filename: file.originalFilename,
    }).catch(() => {})

    // Sanitize filename for Content-Disposition header
    const sanitizedFilename = file.originalFilename.replace(/["\r\n\\]/g, '_')

    const isInline = searchParams.get('inline') === 'true'
    const dispositionType = isInline ? 'inline' : 'attachment'

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `${dispositionType}; filename="${sanitizedFilename}"`,
        'Content-Length': body.length.toString(),
        'Cache-Control': 'private, no-transform',
      },
    })
  } catch (error) {
    console.error(`Error downloading file for resource '${id}':`, error)
    return NextResponse.json(
      { error: 'Download request failed' },
      { status: 500, headers: { 'Cache-Control': NO_STORE } }
    )
  }
}
