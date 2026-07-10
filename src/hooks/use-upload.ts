'use client'

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { uploadConfig } from '@/config/upload'
import type { UploadResult } from '@/types/api'

export interface UploadState {
  status: 'idle' | 'initiating' | 'uploading' | 'processing' | 'success' | 'error'
  progress: number
  speed: number
  loaded: number
  total: number
  remaining: number
  file: File | null
  error: string | null
  result: UploadResult | null
}

type Action =
  | { type: 'INITIATE'; file: File }
  | { type: 'UPLOADING'; progress: number; speed: number; loaded: number; total: number; remaining: number }
  | { type: 'PROCESSING' }
  | { type: 'SUCCESS'; result: UploadResult }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }

const INITIAL: UploadState = {
  status: 'idle',
  progress: 0,
  speed: 0,
  loaded: 0,
  total: 0,
  remaining: 0,
  file: null,
  error: null,
  result: null,
}

function reducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case 'INITIATE':
      return { ...INITIAL, status: 'initiating', file: action.file, total: action.file.size }
    case 'UPLOADING':
      return { ...state, status: 'uploading', progress: action.progress, speed: action.speed, loaded: action.loaded, total: action.total, remaining: action.remaining }
    case 'PROCESSING':
      return { ...state, status: 'processing', progress: 100, speed: 0, remaining: 0 }
    case 'SUCCESS':
      return { ...state, status: 'success', result: action.result, progress: 100 }
    case 'ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'RESET':
      return INITIAL
  }
}

interface ActiveUpload {
  aborted: boolean
  activeXhr: XMLHttpRequest | null
  pollTimer: ReturnType<typeof setTimeout> | null
}

interface SpeedSample {
  time: number
  loaded: number
}

interface ServiceSession {
  sessionId: string
  totalChunks: number
  chunkSize: number
}

interface ServiceStatus {
  state: string
  result?: { slug: string; url: string; deleteToken: string }
  error?: string
  telegramProgress: { loaded: number; total: number }
}

function toMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}

export function useUpload() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const activeRef = useRef<ActiveUpload>({ aborted: false, activeXhr: null, pollTimer: null })

  useEffect(() => {
    if (
      state.status !== 'uploading' &&
      state.status !== 'processing' &&
      state.status !== 'initiating'
    ) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.status])

  const upload = useCallback((file: File) => {
    const active = activeRef.current
    active.aborted = true
    if (active.activeXhr !== null) { active.activeXhr.abort(); active.activeXhr = null }
    if (active.pollTimer !== null) { clearTimeout(active.pollTimer); active.pollTimer = null }
    active.aborted = false

    dispatch({ type: 'INITIATE', file })
    void runUpload(file, active, dispatch)
  }, [])

  const cancel = useCallback(() => {
    const active = activeRef.current
    active.aborted = true
    if (active.activeXhr !== null) { active.activeXhr.abort(); active.activeXhr = null }
    if (active.pollTimer !== null) { clearTimeout(active.pollTimer); active.pollTimer = null }
    dispatch({ type: 'RESET' })
  }, [])

  const reset = useCallback(() => {
    const active = activeRef.current
    active.aborted = true
    if (active.activeXhr !== null) { active.activeXhr.abort(); active.activeXhr = null }
    if (active.pollTimer !== null) { clearTimeout(active.pollTimer); active.pollTimer = null }
    dispatch({ type: 'RESET' })
  }, [])

  return { state, upload, cancel, reset }
}

async function runUpload(
  file: File,
  active: ActiveUpload,
  dispatch: React.Dispatch<Action>
): Promise<void> {
  const { serviceUrl, apiKey, chunkSize } = uploadConfig

  let session: ServiceSession
  try {
    const res = await fetch(`${serviceUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Upload-Key': apiKey },
      body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
    })
    const body = await res.json() as { ok: boolean; data?: ServiceSession; error?: string }
    if (!body.ok || body.data === undefined) {
      throw new Error(body.error ?? 'Failed to create upload session')
    }
    session = body.data
  } catch (e) {
    if (!active.aborted) dispatch({ type: 'ERROR', error: toMessage(e) })
    return
  }

  if (active.aborted) return

  const startTime = Date.now()
  let totalLoaded = 0
  let lastSample: SpeedSample = { time: Date.now(), loaded: 0 }

  for (let i = 0; i < session.totalChunks; i++) {
    if (active.aborted) return

    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const result = await uploadChunk(
      session.sessionId, i, chunk, apiKey, serviceUrl, active,
      (chunkLoaded) => {
        if (active.aborted) return
        totalLoaded = i * chunkSize + chunkLoaded

        const now = Date.now()
        const elapsed = (now - startTime) / 1000
        const sampleDelta = now - lastSample.time
        let speed = 0

        if (sampleDelta >= 300) {
          speed = (totalLoaded - lastSample.loaded) / (sampleDelta / 1000)
          lastSample = { time: now, loaded: totalLoaded }
        } else if (elapsed > 0) {
          speed = totalLoaded / elapsed
        }

        const remaining = speed > 0 ? Math.ceil((file.size - totalLoaded) / speed) : 0
        const progress = Math.min(99, Math.round((totalLoaded / file.size) * 100))

        dispatch({ type: 'UPLOADING', progress, speed, loaded: totalLoaded, total: file.size, remaining })
      }
    )

    if (!result) {
      if (!active.aborted) dispatch({ type: 'ERROR', error: `Failed to upload chunk ${i + 1}/${session.totalChunks}` })
      return
    }
  }

  if (active.aborted) return

  try {
    const res = await fetch(`${serviceUrl}/sessions/${session.sessionId}/complete`, {
      method: 'POST',
      headers: { 'X-Upload-Key': apiKey },
    })
    const body = await res.json() as { ok: boolean; error?: string }
    if (!body.ok) throw new Error(body.error ?? 'Completion request failed')
  } catch (e) {
    if (!active.aborted) dispatch({ type: 'ERROR', error: toMessage(e) })
    return
  }

  if (active.aborted) return
  dispatch({ type: 'PROCESSING' })
  await pollSessionStatus(session.sessionId, apiKey, serviceUrl, active, dispatch, file)
}

function uploadChunk(
  sessionId: string,
  index: number,
  chunk: Blob,
  apiKey: string,
  serviceUrl: string,
  active: ActiveUpload,
  onProgress: (loaded: number) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    active.activeXhr = xhr

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded)
    })
    xhr.addEventListener('load', () => {
      active.activeXhr = null
      resolve(xhr.status >= 200 && xhr.status < 300)
    })
    xhr.addEventListener('error', () => { active.activeXhr = null; resolve(false) })
    xhr.addEventListener('abort', () => { active.activeXhr = null; resolve(false) })

    xhr.open('PUT', `${serviceUrl}/sessions/${sessionId}/chunks/${index}`)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.setRequestHeader('X-Upload-Key', apiKey)
    xhr.send(chunk)
  })
}

async function pollSessionStatus(
  sessionId: string,
  apiKey: string,
  serviceUrl: string,
  active: ActiveUpload,
  dispatch: React.Dispatch<Action>,
  file: File
): Promise<void> {
  const { pollIntervalMs, maxPollAttempts } = uploadConfig

  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    if (active.aborted) return

    await new Promise<void>((resolve) => {
      active.pollTimer = setTimeout(resolve, pollIntervalMs)
    })

    if (active.aborted) return

    let statusData: { ok: boolean; data?: ServiceStatus }
    try {
      const res = await fetch(`${serviceUrl}/sessions/${sessionId}`, {
        headers: { 'X-Upload-Key': apiKey },
      })
      statusData = await res.json() as { ok: boolean; data?: ServiceStatus }
    } catch {
      continue
    }

    if (!statusData.ok || statusData.data === undefined) continue

    const { state, result, error, telegramProgress } = statusData.data

    if (state === 'uploading_telegram' && telegramProgress.total > 0) {
      const progress = Math.min(99, Math.round((telegramProgress.loaded / telegramProgress.total) * 100))
      dispatch({
        type: 'UPLOADING',
        progress,
        speed: 0,
        loaded: telegramProgress.loaded,
        total: file.size,
        remaining: 0,
      })
    }

    if (state === 'completed' && result !== undefined) {
      dispatch({
        type: 'SUCCESS',
        result: {
          slug: result.slug,
          url: result.url,
          deleteToken: result.deleteToken,
          title: file.name,
          fileSize: file.size,
        },
      })
      return
    }

    if (state === 'failed') {
      dispatch({ type: 'ERROR', error: error ?? 'Server processing failed' })
      return
    }
  }

  dispatch({ type: 'ERROR', error: 'Upload timed out waiting for server response' })
}
