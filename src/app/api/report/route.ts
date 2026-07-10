import { NextRequest, NextResponse } from 'next/server'
import { getVideoPublicBySlug, insertReport } from '@/lib/supabase/server'
import { reportSchema, getClientIp } from '@/lib/security'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(ip, 'report')
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Report rate limit exceeded.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid report data.', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { slug, reason } = parsed.data

  const video = await getVideoPublicBySlug(slug)
  if (!video) {
    return NextResponse.json(
      { success: false, error: 'Video not found.' },
      { status: 404 }
    )
  }

  try {
    await insertReport({ video_id: video.id, reason })
  } catch (err) {
    console.error('[report] insert error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to submit report.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: { message: 'Report submitted.' } })
}
