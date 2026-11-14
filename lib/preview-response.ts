import { NextResponse } from "next/server"
import { getFileFormatInfo } from "@/lib/resource-utils"
import { previewDocx, previewXlsx } from "@/lib/file-preview"

export const NO_STORE =
  "private, no-cache, no-store, max-age=0, must-revalidate"

/**
 * Builds the read-only preview response for a verified file.
 * PDF is streamed inline; DOCX/XLSX are converted to bounded, sanitized JSON.
 * Shared by the public and admin preview routes. Never records events.
 */
export async function buildPreviewResponse(
  file: { originalFilename: string; mimeType: string },
  body: Buffer
): Promise<NextResponse> {
  const format = getFileFormatInfo(file.mimeType, file.originalFilename)

  if (format.key === "docx" || format.key === "xlsx") {
    try {
      const preview =
        format.key === "docx"
          ? await previewDocx(body)
          : await previewXlsx(body)
      return NextResponse.json(preview, {
        headers: {
          "Cache-Control": "private, no-transform",
          "X-Content-Type-Options": "nosniff",
        },
      })
    } catch (error) {
      console.error(`Failed to build ${format.key} preview:`, error)
      return NextResponse.json(
        {
          error: "This file could not be previewed. You can still download it.",
        },
        { status: 422, headers: { "Cache-Control": NO_STORE } }
      )
    }
  }

  if (format.key !== "pdf") {
    return NextResponse.json(
      { error: "Preview is not available for this file type" },
      { status: 415, headers: { "Cache-Control": NO_STORE } }
    )
  }

  const safeName = file.originalFilename.replace(/["\r\n\\]/g, "_")

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Content-Length": body.length.toString(),
      "Cache-Control": "private, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  })
}
