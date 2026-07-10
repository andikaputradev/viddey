import { NextRequest, NextResponse } from 'next/server'
import { getVideoPublicBySlug } from '@/lib/supabase/server'
import { slugSchema } from '@/lib/security'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid slug.' }, { status: 400 })
  }

  const video = await getVideoPublicBySlug(slug)
  if (!video) {
    return NextResponse.json({ success: false, error: 'Video not found.' }, { status: 404 })
  }

  return NextResponse.json(
    { success: true, data: video },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
