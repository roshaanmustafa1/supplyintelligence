import { NextResponse } from "next/server"
import { checkRole } from "@/lib/authorization"
import { loadAdminResourceFile } from "@/lib/resource-file-delivery"
import { buildPreviewResponse, NO_STORE } from "@/lib/preview-response"

interface RouteProps {
  params: Promise<{ id: string }>
}

/**
 * Read-only preview of any file of a resource (including DRAFT / REVIEW / ARCHIVED)
 * for dashboard users. Authors are limited to their own resources.
 * Records no events and never modifies anything.
 */
export async function GET(request: Request, { params }: RouteProps) {
  const auth = await checkRole("AUTHOR")
  if (!auth.authorized) {
    const status = auth.error === "Unauthenticated" ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { id } = await params
  const fileId = new URL(request.url).searchParams.get("fileId")

  try {
    const result = await loadAdminResourceFile(id, fileId, {
      userId: auth.userId,
      role: auth.role,
    })
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status, headers: { "Cache-Control": NO_STORE } }
      )
    }
    return await buildPreviewResponse(result.file, result.body)
  } catch (error) {
    console.error(`Error previewing admin file for resource '${id}':`, error)
    return NextResponse.json(
      { error: "Preview request failed" },
      { status: 500, headers: { "Cache-Control": NO_STORE } }
    )
  }
}
