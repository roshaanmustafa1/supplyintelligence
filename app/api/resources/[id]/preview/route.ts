import { NextResponse } from "next/server"
import { loadPublishedResourceFile } from "@/lib/resource-file-delivery"
import { buildPreviewResponse, NO_STORE } from "@/lib/preview-response"

interface RouteProps {
  params: Promise<{ id: string }>
}

/**
 * Read-only inline preview of a published resource file.
 * Unlike /download it never records a DOWNLOAD event.
 * See lib/preview-response.ts for the per-format behaviour.
 */
export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params
  const fileId = new URL(request.url).searchParams.get("fileId")

  try {
    const result = await loadPublishedResourceFile(id, fileId)
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status, headers: { "Cache-Control": NO_STORE } }
      )
    }
    return await buildPreviewResponse(result.file, result.body)
  } catch (error) {
    console.error(`Error previewing file for resource '${id}':`, error)
    return NextResponse.json(
      { error: "Preview request failed" },
      { status: 500, headers: { "Cache-Control": NO_STORE } }
    )
  }
}
