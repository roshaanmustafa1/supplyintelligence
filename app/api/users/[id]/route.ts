import { NextResponse } from 'next/server'
import { checkRole } from '@/lib/authorization'
import { updateUser, getUserRole, canManageRole, isRole } from '@/lib/services/user.service'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await checkRole('ADMIN')
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Insufficient permissions' ? 403 : 401 })
  }

  const { id } = await params
  if (id === auth.userId) {
    return NextResponse.json({ error: 'You cannot modify your own account here' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data: { role?: (typeof body)['role']; isActive?: boolean } = {}

    if (body.role !== undefined) {
      if (!isRole(body.role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      if (!canManageRole(auth.role, body.role)) {
        return NextResponse.json({ error: 'You cannot assign that role' }, { status: 403 })
      }
      data.role = body.role
    }
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      data.isActive = body.isActive
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const target = await getUserRole(id)
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!canManageRole(auth.role, target.role)) {
      return NextResponse.json({ error: 'You cannot modify this user' }, { status: 403 })
    }

    return NextResponse.json(await updateUser(id, data))
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
