'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface UploadZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFile, disabled = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || disabled) return
      onFile(file)
    },
    [onFile, disabled]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      processFile(e.dataTransfer.files?.[0])
    },
    [processFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFile(e.target.files?.[0])
      e.target.value = ''
    },
    [processFile]
  )

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    [disabled]
  )

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.005 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer select-none',
        isDragging
          ? 'border-[#fb5d80] bg-[#fb5d80]/5'
          : 'border-border hover:border-[#fb5d80]/60 hover:bg-accent/40',
        disabled && 'pointer-events-none opacity-50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Click or drag to upload a video"
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={inputRef}
        type="file"
        accept={siteConfig.upload.acceptString}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden
        tabIndex={-1}
      />

      <motion.div
        animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-4 rounded-full bg-[#fb5d80]/10 p-4"
      >
        <UploadCloud className="h-8 w-8 text-[#fb5d80]" aria-hidden />
      </motion.div>

      <p className="text-base font-semibold text-foreground">
        {isDragging ? 'Drop it here' : 'Drag & drop your video'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        or <span className="text-[#fb5d80] font-medium">browse files</span>
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        MP4, MOV, MKV, WEBM — up to {siteConfig.upload.maxSizeDisplay}
      </p>
    </motion.div>
  )
}
