import { NextResponse } from 'next/server'
import { checkRole, hasRole } from '@/lib/authorization'
import { attachFileToResource, getResourceById } from '@/lib/services/resource.service'
import { storage } from '@/lib/storage'
import { validateFileBuffer, HeuristicSecurityScanner } from '@/lib/storage/validation'
import { sanitizeApiError } from '@/lib/error-sanitizer'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteProps) {
  const auth = await checkRole('AUTHOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { id } = await params

  try {
    const resource = await getResourceById(id, { includeUnpublished: true })
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Ownership check: Authors can only upload files to their own resources; Editors/Admins can upload to any
    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')
    if (!isEditorOrAdmin && resource.authorId !== auth.userId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only upload files to your own resources' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const versionId = (formData.get('versionId') as string) || undefined
    const isPrimary = formData.get('isPrimary') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Validate file extension, MIME type, and magic bytes
    const validation = validateFileBuffer(buffer, file.name, file.type)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, code: validation.code },
        { status: 400 }
      )
    }

    // 2. Malware & macro heuristic scan
    const scanner = new HeuristicSecurityScanner()
    const scanResult = await scanner.scan(buffer, file.name)
    if (!scanResult.isClean) {
      return NextResponse.json(
        {
          error: `File rejected by security scanner: ${scanResult.threatName}`,
          code: 'SECURITY_THREAT_DETECTED',
        },
        { status: 400 }
      )
    }

    // 3. Persist into storage provider
    const storedMeta = await storage.upload({
      filename: file.name,
      buffer,
      mimeType: validation.mimeType,
    })

    // 4. Attach metadata to database resource
    const attachedFile = await attachFileToResource(
      id,
      {
        originalFilename: storedMeta.originalFilename,
        storageKey: storedMeta.storageKey,
        mimeType: storedMeta.mimeType,
        fileSize: storedMeta.fileSize,
        checksum: storedMeta.checksum,
        versionId,
        isPrimary,
      },
      auth.userId
    )

    return NextResponse.json(attachedFile, { status: 201 })
  } catch (error: unknown) {
    console.error(`Error uploading file for resource '${id}':`, error)
    return NextResponse.json(
      { error: sanitizeApiError(error, 'File upload failed') },
      { status: 500 }
    )
  }
}
