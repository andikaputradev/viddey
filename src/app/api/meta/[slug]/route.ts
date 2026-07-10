import { NextRequest, NextResponse } from 'next/server'
import { getVideoPublicBySlug } from '@/lib/supabase/server'
import { slugSchema } from '@/lib/security'
import { siteConfig } from '@/config/site'
import { formatBytes, formatRelativeDate } from '@/lib/utils'

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
    {
      success: true,
      data: {
        title: video.title,
        url: `${siteConfig.url}/v/${video.slug}`,
        streamUrl: `${siteConfig.url}/api/stream/${video.slug}`,
        size: formatBytes(video.file_size),
        views: video.views,
        uploadedAt: formatRelativeDate(video.created_at),
        mimeType: video.mime_type,
      },
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    }
  )
}
