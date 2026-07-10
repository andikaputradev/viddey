'use client'

import { X, FileVideo } from 'lucide-react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/utils'
import type { UploadState } from '@/hooks/use-upload'

interface UploadProgressProps {
  state: UploadState
  onCancel: () => void
}

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return ''
  if (seconds < 60) return `${seconds}s remaining`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s remaining` : `${m}m remaining`
}

export function UploadProgress({ state, onCancel }: UploadProgressProps) {
  const { file, progress, speed, loaded, total, remaining, status } = state
  const isProcessing = status === 'processing'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-lg bg-[#fb5d80]/10 p-2">
            <FileVideo className="h-5 w-5 text-[#fb5d80]" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {file?.name ?? 'Uploading…'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isProcessing
                ? 'Processing on server…'
                : total > 0
                ? `${formatBytes(loaded)} / ${formatBytes(total)}`
                : file
                ? formatBytes(file.size)
                : '—'}
            </p>
          </div>
        </div>

        {!isProcessing && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onCancel}
            aria-label="Cancel upload"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {isProcessing ? 'Processing…' : `${progress}%`}
          </span>
          {!isProcessing && speed > 0 && (
            <span className="text-xs font-medium text-[#fb5d80] tabular-nums">
              {formatBytes(speed)}/s
            </span>
          )}
        </div>

        <Progress
          value={isProcessing ? 0 : progress}
          indeterminate={isProcessing}
          className="h-1.5"
          aria-label={isProcessing ? 'Processing' : `Upload progress: ${progress}%`}
          aria-valuenow={isProcessing ? undefined : progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {!isProcessing && (
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground tabular-nums">
            <span>
              {loaded > 0 && total > 0
                ? `${formatBytes(loaded)} of ${formatBytes(total)}`
                : 'Starting…'}
            </span>
            {remaining > 0 && (
              <span className="text-right">{formatRemaining(remaining)}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
