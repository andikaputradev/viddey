import { NextRequest, NextResponse } from 'next/server'
import { sendVideo, sendDocument } from '@/lib/telegram'
import { insertVideo, isSlugAvailable } from '@/lib/supabase/server'
import { generateSlug, generateDeleteToken } from '@/lib/slug'
import {
  validateMimeType,
  validateExtension,
  validateFileSize,
  sanitizeFilename,
  getClientIp,
} from '@/lib/security'
import { rateLimit } from '@/lib/rate-limit'
import { siteConfig } from '@/config/site'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(ip, 'upload')
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Upload rate limit exceeded. Try again later.' },
      { status: 429 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid form data.' },
      { status: 400 }
    )
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: 'No file provided.' },
      { status: 400 }
    )
  }

  if (!validateMimeType(file.type)) {
    return NextResponse.json(
      { success: false, error: `Unsupported file type: ${file.type}` },
      { status: 415 }
    )
  }

  if (!validateExtension(file.name)) {
    return NextResponse.json(
      { success: false, error: 'Unsupported file extension.' },
      { status: 415 }
    )
  }

  if (!validateFileSize(file.size)) {
    return NextResponse.json(
      {
        success: false,
        error: `File too large. Maximum allowed size is ${siteConfig.upload.maxSizeDisplay}.`,
      },
      { status: 413 }
    )
  }

  const title = sanitizeFilename(file.name)

  let telegramResult: { fileId: string; filePath: string; fileSize: number }
  try {
    const isVideoMime = file.type.startsWith('video/')
    telegramResult = isVideoMime
      ? await sendVideo(file, title)
      : await sendDocument(file)
  } catch (err) {
    console.error('[upload] Telegram error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file to storage. Please try again.' },
      { status: 502 }
    )
  }

  let slug = generateSlug()
  let attempts = 0
  while (!(await isSlugAvailable(slug)) && attempts < 5) {
    slug = generateSlug()
    attempts++
  }

  const deleteToken = generateDeleteToken()

  let video: Awaited<ReturnType<typeof insertVideo>>
  try {
    video = await insertVideo({
      slug,
      title,
      telegram_file_id: telegramResult.fileId,
      telegram_file_path: telegramResult.filePath,
      file_size: telegramResult.fileSize,
      mime_type: file.type,
      delete_token: deleteToken,
    })
  } catch (err) {
    console.error('[upload] Supabase insert error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to save video metadata. Please contact support.' },
      { status: 500 }
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return NextResponse.json({
    success: true,
    data: {
      slug: video.slug,
      url: `${siteUrl}/v/${video.slug}`,
      deleteToken,
      title: video.title,
      fileSize: video.file_size,
    },
  })
}
