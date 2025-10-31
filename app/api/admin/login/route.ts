import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body || {}

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD not configured on the server" }, { status: 500 })
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 })
  }
}
