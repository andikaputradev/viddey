'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { UploadZone } from './upload-zone'
import { UploadProgress } from './upload-progress'
import { UploadSuccess } from './upload-success'
import { useUpload } from '@/hooks/use-upload'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface StoredToken {
  slug: string
  token: string
  uploadedAt: string
}

const EMPTY_TOKENS: StoredToken[] = []

export function UploadCard() {
  const { state, upload, cancel, reset } = useUpload()
  const [, storeToken] = useLocalStorage<StoredToken[]>('viddey_tokens', EMPTY_TOKENS)
  const savedSlugRef = useRef<string | null>(null)

  useEffect(() => {
    if (
      state.status !== 'success' ||
      state.result === null ||
      state.result.slug === savedSlugRef.current
    ) {
      return
    }
    savedSlugRef.current = state.result.slug
    const { slug, deleteToken } = state.result
    storeToken((prev) => [
      { slug, token: deleteToken, uploadedAt: new Date().toISOString() },
      ...prev.slice(0, 49),
    ])
  }, [state.status, state.result, storeToken])

  const handleFile = useCallback(
    (file: File) => {
      if (!siteConfig.upload.acceptedTypes.includes(file.type as never)) return
      if (file.size > siteConfig.upload.maxSizeBytes) return
      upload(file)
    },
    [upload]
  )

  const handleDelete = useCallback(async (slug: string, token: string): Promise<void> => {
    const res = await fetch(`/api/delete/${slug}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string }
      throw new Error(body.error ?? 'Delete failed')
    }
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {state.status === 'idle' && (
          <motion.div
            key="zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <UploadZone onFile={handleFile} />
          </motion.div>
        )}

        {(state.status === 'uploading' || state.status === 'processing') && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <UploadProgress state={state} onCancel={cancel} />
          </motion.div>
        )}

        {state.status === 'success' && state.result !== null && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <UploadSuccess result={state.result} onReset={reset} onDelete={handleDelete} />
          </motion.div>
        )}

        {state.status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <div
              className={cn(
                'flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500'
              )}
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{state.error ?? 'An error occurred during upload.'}</span>
            </div>
            <UploadZone onFile={handleFile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
