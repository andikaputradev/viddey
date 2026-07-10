import { NextRequest, NextResponse } from 'next/server'
import { getVideoBySlug, incrementViews } from '@/lib/supabase/server'
import { getFile, buildDownloadUrl } from '@/lib/telegram'
import { slugSchema } from '@/lib/security'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    return new NextResponse('Invalid slug', { status: 400 })
  }

  const video = await getVideoBySlug(slug)
  if (!video) {
    return new NextResponse('Video not found', { status: 404 })
  }

  let downloadUrl: string
  try {
    const fileInfo = await getFile(video.telegram_file_id)
    downloadUrl = buildDownloadUrl(fileInfo.file_path)
  } catch (err) {
    console.error('[stream] Telegram getFile error:', err)
    return new NextResponse('Failed to resolve video source', { status: 502 })
  }

  const rangeHeader = request.headers.get('range')

  const upstream = await fetch(downloadUrl, {
    headers: {
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    },
  })

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse('Failed to fetch video from storage', { status: 502 })
  }

  const isInitialRequest =
    !rangeHeader || rangeHeader.startsWith('bytes=0-')

  if (isInitialRequest) {
    incrementViews(video.id).catch((err) =>
      console.error('[stream] increment views error:', err)
    )
  }

  const headers = new Headers()
  headers.set('Content-Type', video.mime_type)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=3600')
  headers.set('X-Content-Type-Options', 'nosniff')

  const contentLength = upstream.headers.get('content-length')
  const contentRange = upstream.headers.get('content-range')
  if (contentLength) headers.set('Content-Length', contentLength)
  if (contentRange) headers.set('Content-Range', contentRange)

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  })
}
