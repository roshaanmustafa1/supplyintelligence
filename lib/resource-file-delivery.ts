import crypto from "node:crypto"
import {
  getResourceById,
  getResourceBySlug,
} from "@/lib/services/resource.service"
import { hasRole } from "@/lib/authorization"
import { storage } from "@/lib/storage"

export type PublishedFileResult =
  | {
      ok: true
      resourceId: string
      file: {
        id: string
        originalFilename: string
        mimeType: string
      }
      body: Buffer
    }
  | { ok: false; status: 403 | 404 | 500; error: string }

interface StoredFileRecord {
  id: string
  originalFilename: string
  storageKey: string
  mimeType: string
  checksum: string
  isPrimary: boolean
}

function selectFile<T extends { id: string; isPrimary: boolean }>(
  files: T[],
  fileId: string | null
): T | undefined {
  let target = files.find((f) => (fileId ? f.id === fileId : f.isPrimary))
  if (!target && !fileId && files.length > 0) {
    target = files[0]
  }
  return target
}

/** Reads the stored bytes and verifies the SHA-256 checksum against the database record. */
async function readVerifiedFile(
  resourceId: string,
  targetFile: StoredFileRecord
): Promise<PublishedFileResult> {
  const storedFile = await storage.download(targetFile.storageKey)
  if (!storedFile) {
    console.error(
      `Physical file missing from storage for key: ${targetFile.storageKey}`
    )
    return {
      ok: false,
      status: 404,
      error: "File asset temporarily unavailable",
    }
  }

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

  if (targetFile.checksum) {
    const calculatedChecksum = crypto
      .createHash("sha256")
      .update(body)
      .digest("hex")
    if (
      calculatedChecksum.toLowerCase() !== targetFile.checksum.toLowerCase()
    ) {
      console.error(
        `Integrity mismatch for file ${targetFile.id} (${targetFile.storageKey}): expected ${targetFile.checksum}, got ${calculatedChecksum}`
      )
      return {
        ok: false,
        status: 500,
        error:
          "File integrity verification failed. The asset checksum does not match the database record.",
      }
    }
  }

  return {
    ok: true,
    resourceId,
    file: {
      id: targetFile.id,
      originalFilename: targetFile.originalFilename,
      mimeType: targetFile.mimeType,
    },
    body,
  }
}

/**
 * Loads the bytes of a file attached to a PUBLISHED resource (looked up by id or slug)
 * and verifies its SHA-256 checksum against the database record.
 *
 * Shared by the download and preview routes so both enforce identical
 * visibility and integrity rules. Never exposes storage keys.
 */
export async function loadPublishedResourceFile(
  idOrSlug: string,
  fileId: string | null
): Promise<PublishedFileResult> {
  let resource = await getResourceById(idOrSlug, { includeUnpublished: false })
  if (!resource) {
    resource = await getResourceBySlug(idOrSlug, { includeUnpublished: false })
  }

  if (!resource || resource.status !== "PUBLISHED") {
    return {
      ok: false,
      status: 404,
      error: "Resource not found or not published",
    }
  }

  const targetFile = selectFile(resource.files, fileId)
  if (!targetFile) {
    return {
      ok: false,
      status: 404,
      error: "No downloadable asset attached to this resource",
    }
  }

  return readVerifiedFile(resource.id, targetFile)
}

/**
 * Loads a file of ANY-status resource for an authenticated dashboard user.
 * Authors may only read files of their own resources; Editors and above may read all.
 * The caller must already have passed `checkRole('AUTHOR')`.
 */
export async function loadAdminResourceFile(
  resourceId: string,
  fileId: string | null,
  actor: { userId: string; role: string }
): Promise<PublishedFileResult> {
  const resource = await getResourceById(resourceId, {
    includeUnpublished: true,
  })
  if (!resource) {
    return { ok: false, status: 404, error: "Resource not found" }
  }

  if (!hasRole(actor.role, "EDITOR") && resource.authorId !== actor.userId) {
    return {
      ok: false,
      status: 403,
      error: "Forbidden: you can only preview files of your own resources",
    }
  }

  const targetFile = selectFile(resource.files, fileId)
  if (!targetFile) {
    return {
      ok: false,
      status: 404,
      error: "No file attached to this resource",
    }
  }

  return readVerifiedFile(resource.id, targetFile)
}
