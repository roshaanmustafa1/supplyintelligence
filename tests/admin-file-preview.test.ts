import test from "node:test"
import assert from "node:assert/strict"
import { prisma } from "../lib/db"
import { storage } from "../lib/storage"
import {
  attachFileToResource,
  createResource,
} from "../lib/services/resource.service"
import {
  loadAdminResourceFile,
  loadPublishedResourceFile,
} from "../lib/resource-file-delivery"
import { buildPreviewResponse } from "../lib/preview-response"
import { buildGenuinePdf } from "../lib/storage/ooxml-builder"

test("Admin preview: draft files are previewable by owner/editor only and stay hidden from the public loader", async (t) => {
  const owner = await prisma.user.findFirst({ select: { id: true } })
  if (!owner) return t.skip("No user in the database to own the test resource")

  const slug = `admin-preview-test-${Date.now()}`
  let resourceId: string | undefined
  let storageKey: string | undefined

  try {
    const created = await createResource(
      {
        title: `Admin preview test ${slug}`,
        slug,
        description: "Temporary resource for preview authorization tests.",
        resourceType: "TEMPLATE",
        status: "DRAFT",
        isFeatured: false,
      },
      owner.id
    )
    assert.ok(created)
    resourceId = created.id

    const meta = await storage.upload({
      filename: "draft.pdf",
      buffer: buildGenuinePdf("Draft", "Draft body"),
      mimeType: "application/pdf",
    })
    storageKey = meta.storageKey
    await attachFileToResource(
      resourceId,
      { ...meta, isPrimary: true },
      owner.id
    )

    // Public loader must never expose a DRAFT
    const publicResult = await loadPublishedResourceFile(resourceId, null)
    assert.equal(publicResult.ok, false)

    // Owner (AUTHOR) can preview their own draft
    const ownerResult = await loadAdminResourceFile(resourceId, null, {
      userId: owner.id,
      role: "AUTHOR",
    })
    assert.equal(ownerResult.ok, true)
    if (ownerResult.ok) {
      const response = await buildPreviewResponse(
        ownerResult.file,
        ownerResult.body
      )
      assert.equal(response.status, 200)
      assert.equal(response.headers.get("content-type"), "application/pdf")
    }

    // A different AUTHOR is forbidden
    const stranger = await loadAdminResourceFile(resourceId, null, {
      userId: "someone-else",
      role: "AUTHOR",
    })
    assert.equal(stranger.ok, false)
    if (!stranger.ok) assert.equal(stranger.status, 403)

    // EDITOR may preview any resource
    const editor = await loadAdminResourceFile(resourceId, null, {
      userId: "someone-else",
      role: "EDITOR",
    })
    assert.equal(editor.ok, true)

    // Unknown file id is a 404, not a fallback to another file
    const badFile = await loadAdminResourceFile(resourceId, "not-a-real-file", {
      userId: owner.id,
      role: "AUTHOR",
    })
    assert.equal(badFile.ok, false)
    if (!badFile.ok) assert.equal(badFile.status, 404)
  } finally {
    if (resourceId) {
      await prisma.resource
        .delete({ where: { id: resourceId } })
        .catch(() => {})
    }
    if (storageKey) {
      await storage.delete(storageKey).catch(() => {})
    }
  }
})

test("Admin preview: unknown resource returns 404", async () => {
  const result = await loadAdminResourceFile("does-not-exist-xyz", null, {
    userId: "u",
    role: "ADMIN",
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.status, 404)
})
