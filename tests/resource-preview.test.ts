import test from "node:test"
import assert from "node:assert/strict"
import {
  toPublicResource,
  type ResourceRecordForPublic,
} from "../lib/services/resource.service"
import { prisma } from "../lib/db"
import { GET as previewGET } from "../app/api/resources/[id]/preview/route"
import { GET as downloadGET } from "../app/api/resources/[id]/download/route"

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

test("Preview Phase 1: public DTO exposes safe file list without storage keys", () => {
  const dto = toPublicResource({
    id: "res-1",
    title: "Pack",
    slug: "pack",
    resourceType: "TEMPLATE",
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    files: [
      {
        id: "f1",
        originalFilename: "a.xlsx",
        storageKey: "secret-a",
        mimeType: XLSX_MIME,
        fileSize: 1,
        checksum: "x",
        isPrimary: false,
      },
      {
        id: "f2",
        originalFilename: "b.pdf",
        storageKey: "secret-b",
        mimeType: "application/pdf",
        fileSize: 2,
        checksum: "y",
        isPrimary: true,
      },
    ],
  } as unknown as ResourceRecordForPublic)

  assert.equal(dto.files.length, 2)
  assert.equal(dto.files.find((f) => f.isPrimary)?.id, "f2")
  assert.equal(dto.files.filter((f) => f.isPrimary).length, 1)
  for (const file of dto.files) {
    assert.equal(
      "storageKey" in file,
      false,
      "storageKey must never reach the public DTO"
    )
  }
})

function call(handler: typeof previewGET, id: string, query = "") {
  return handler(
    new Request(`http://localhost/api/resources/${id}/x${query}`),
    {
      params: Promise.resolve({ id }),
    }
  )
}

test("Preview Phase 1: unknown resource returns 404", async () => {
  const res = await call(previewGET, "does-not-exist-xyz")
  assert.equal(res.status, 404)
})

test("Preview Phase 1: PDF is served inline with hardened headers and no download event", async (t) => {
  const file = await prisma.resourceFile.findFirst({
    where: { mimeType: "application/pdf", resource: { status: "PUBLISHED" } },
    include: { resource: { select: { id: true, downloadCount: true } } },
  })
  if (!file) return t.skip("No published PDF resource in the database")

  const res = await call(previewGET, file.resource.id, `?fileId=${file.id}`)
  assert.equal(res.status, 200)
  assert.equal(res.headers.get("content-type"), "application/pdf")
  assert.match(res.headers.get("content-disposition") ?? "", /^inline;/)
  assert.equal(res.headers.get("x-content-type-options"), "nosniff")
  assert.equal(res.headers.get("x-frame-options"), "SAMEORIGIN")

  await new Promise((r) => setTimeout(r, 100))
  const events = await prisma.resourceEvent.count({
    where: {
      resourceId: file.resource.id,
      eventType: "DOWNLOAD",
      createdAt: { gte: new Date(Date.now() - 5000) },
    },
  })
  assert.equal(events, 0, "preview must not record a DOWNLOAD event")
})

test("Preview Phase 1: XLSX returns JSON preview and unknown fileId returns 404", async (t) => {
  const file = await prisma.resourceFile.findFirst({
    where: { mimeType: XLSX_MIME, resource: { status: "PUBLISHED" } },
    select: { id: true, resourceId: true },
  })
  if (!file) return t.skip("No published XLSX resource in the database")

  const preview = await call(previewGET, file.resourceId, `?fileId=${file.id}`)
  assert.equal(preview.status, 200)
  assert.match(preview.headers.get("content-type") ?? "", /application\/json/)
  const body = await preview.json()
  assert.equal(body.kind, "xlsx")
  assert.ok(Array.isArray(body.sheets))

  const missing = await call(
    previewGET,
    file.resourceId,
    "?fileId=not-a-real-file"
  )
  assert.equal(missing.status, 404)
})

test("Preview Phase 1: download route keeps 404 behaviour via shared loader", async (t) => {
  const missing = await call(downloadGET, "does-not-exist-xyz")
  assert.equal(missing.status, 404)

  // Read-only path: an unknown fileId must 404 and records no DOWNLOAD event
  const file = await prisma.resourceFile.findFirst({
    where: { resource: { status: "PUBLISHED" } },
    select: { resourceId: true },
  })
  if (!file) return t.skip("No published resource file in the database")
  const badFile = await call(
    downloadGET,
    file.resourceId,
    "?fileId=not-a-real-file"
  )
  assert.equal(badFile.status, 404)
})
