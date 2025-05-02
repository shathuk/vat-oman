import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // Change to your preferred password
}

const SECRET = process.env.JWT_SECRET || 'adk3928$^$@KD293jhsdJSHD123hsd'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (
    username === DEFAULT_ADMIN.username &&
    password === DEFAULT_ADMIN.password
  ) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' })
    return NextResponse.json({ token })
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
