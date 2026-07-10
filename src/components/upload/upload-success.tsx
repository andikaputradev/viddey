'use client'

import { useState } from 'react'
import { CheckCircle2, Copy, ExternalLink, Trash2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'
import type { UploadResult } from '@/types/api'

interface UploadSuccessProps {
  result: UploadResult
  onReset: () => void
  onDelete: (slug: string, token: string) => Promise<void>
}

export function UploadSuccess({ result, onReset, onDelete }: UploadSuccessProps) {
  const { copy, copied } = useCopy()
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this video permanently? This cannot be undone.')) return
    setDeleting(true)
    try {
      await onDelete(result.slug, result.deleteToken)
      setDeleted(true)
      setTimeout(() => onReset(), 1500)
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (deleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground"
      >
        Video deleted successfully.
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-[#fb5d80]/20 bg-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
          className="shrink-0 rounded-full bg-green-500/10 p-1.5"
        >
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-foreground">Upload successful</p>
          <p className="text-xs text-muted-foreground truncate max-w-xs">{result.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="flex-1 truncate text-sm text-muted-foreground font-mono select-all">
          {result.url}
        </span>
        <button
          onClick={() => copy(result.url)}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => copy(result.url)} className="flex-1 sm:flex-none">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={() => window.open(result.url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 sm:flex-none text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>

      <button
        onClick={onReset}
        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        Upload another video
      </button>
    </motion.div>
  )
}
