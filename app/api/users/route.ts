import { NextResponse } from 'next/server'
import { checkRole } from '@/lib/authorization'
import { createUser, canManageRole, isRole } from '@/lib/services/user.service'

export async function POST(request: Request) {
  const auth = await checkRole('ADMIN')
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Insufficient permissions' ? 403 : 401 })
  }

  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!isRole(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    if (!canManageRole(auth.role, body.role)) {
      return NextResponse.json({ error: 'You cannot assign that role' }, { status: 403 })
    }

    const user = await createUser({ email, name: body.name, password, role: body.role })
    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code
    if (code === 'P2002') {
      return NextResponse.json({ error: 'A user with that email already exists' }, { status: 409 })
    }
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
