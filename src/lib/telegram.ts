import type { TelegramFile, TelegramSendResult } from '@/types/api'

const BASE = 'https://api.telegram.org'

function token(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN
  if (!t) throw new Error('TELEGRAM_BOT_TOKEN is not set')
  return t
}

function channelId(): string {
  const c = process.env.TELEGRAM_CHANNEL_ID
  if (!c) throw new Error('TELEGRAM_CHANNEL_ID is not set')
  return c
}

async function apiFetch<T>(method: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/bot${token()}/${method}`, init)
  const json = (await res.json()) as { ok: boolean; result: T; description?: string }
  if (!json.ok) throw new Error(json.description ?? `Telegram API error: ${method}`)
  return json.result
}

export async function sendVideo(
  file: File,
  caption?: string
): Promise<TelegramSendResult> {
  const form = new FormData()
  form.append('chat_id', channelId())
  form.append('video', file, file.name)
  form.append('supports_streaming', 'true')
  if (caption) form.append('caption', caption)

  const result = await apiFetch<{
    video?: {
      file_id: string
      file_path?: string
      file_size?: number
    }
    document?: {
      file_id: string
      file_path?: string
      file_size?: number
    }
  }>('sendVideo', { method: 'POST', body: form })

  const media = result.video ?? result.document
  if (!media?.file_id) throw new Error('No file_id returned from Telegram')

  const fileInfo = await getFile(media.file_id)

  return {
    fileId: media.file_id,
    filePath: fileInfo.file_path,
    fileSize: media.file_size ?? file.size,
  }
}

export async function sendDocument(
  file: File
): Promise<TelegramSendResult> {
  const form = new FormData()
  form.append('chat_id', channelId())
  form.append('document', file, file.name)

  const result = await apiFetch<{
    document: {
      file_id: string
      file_size?: number
    }
  }>('sendDocument', { method: 'POST', body: form })

  const fileInfo = await getFile(result.document.file_id)

  return {
    fileId: result.document.file_id,
    filePath: fileInfo.file_path,
    fileSize: result.document.file_size ?? file.size,
  }
}

export async function getFile(fileId: string): Promise<TelegramFile> {
  return apiFetch<TelegramFile>(`getFile?file_id=${encodeURIComponent(fileId)}`)
}

export function buildDownloadUrl(filePath: string): string {
  return `${BASE}/file/bot${token()}/${filePath}`
}

export async function deleteMessage(messageId: number): Promise<void> {
  try {
    await apiFetch(`deleteMessage?chat_id=${encodeURIComponent(channelId())}&message_id=${messageId}`)
  } catch {
    // Best-effort deletion; Telegram may not allow deleting old messages.
  }
}
