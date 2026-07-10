import { createClient } from '@supabase/supabase-js'
import type { Video, VideoPublic, Report } from '@/types/video'

function createServerClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars are not set')
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export async function insertVideo(data: {
  slug: string
  title: string
  telegram_file_id: string
  telegram_file_path: string
  file_size: number
  mime_type: string
  delete_token: string
}): Promise<Video> {
  const db = createServerClient()
  const { data: row, error } = await db
    .from('videos')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row as Video
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const db = createServerClient()
  const { data, error } = await db
    .from('videos')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as Video
}

export async function getVideoPublicBySlug(slug: string): Promise<VideoPublic | null> {
  const db = createServerClient()
  const { data, error } = await db
    .from('videos')
    .select('id, slug, title, file_size, mime_type, views, created_at')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as VideoPublic
}

export async function incrementViews(id: string): Promise<void> {
  const db = createServerClient()
  await db.rpc('increment_views', { video_id: id })
}

export async function deleteVideoByToken(
  slug: string,
  deleteToken: string
): Promise<boolean> {
  const db = createServerClient()
  const { data: video } = await db
    .from('videos')
    .select('id, delete_token')
    .eq('slug', slug)
    .single()

  if (!video || video.delete_token !== deleteToken) return false

  const { error } = await db.from('videos').delete().eq('id', video.id)
  return !error
}

export async function insertReport(data: {
  video_id: string
  reason: string
}): Promise<Report> {
  const db = createServerClient()
  const { data: row, error } = await db
    .from('reports')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row as Report
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const db = createServerClient()
  const { count } = await db
    .from('videos')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug)
  return (count ?? 0) === 0
}
