import { NextRequest, NextResponse } from 'next/server'
import { deleteVideoByToken } from '@/lib/supabase/server'
import { slugSchema, deleteTokenSchema, getClientIp } from '@/lib/security'
import { rateLimit } from '@/lib/rate-limit'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(request)
  const rl = rateLimit(ip, 'delete')
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many delete requests.' },
      { status: 429 }
    )
  }

  const { slug } = await params

  const slugParsed = slugSchema.safeParse(slug)
  if (!slugParsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid slug.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const tokenParsed = deleteTokenSchema.safeParse(
    (body as Record<string, unknown>)?.token
  )
  if (!tokenParsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid delete token.' }, { status: 400 })
  }

  const deleted = await deleteVideoByToken(slug, tokenParsed.data)
  if (!deleted) {
    return NextResponse.json(
      { success: false, error: 'Video not found or token is invalid.' },
      { status: 403 }
    )
  }

  return NextResponse.json({ success: true, data: { message: 'Video deleted successfully.' } })
}
