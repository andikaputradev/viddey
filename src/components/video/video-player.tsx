'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface VideoPlayerProps {
  src: string
  title: string
  mimeType: string
}

export function VideoPlayer({ src, title, mimeType }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
  }, [src])

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-black relative">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
          <div className="h-8 w-8 rounded-full border-2 border-[#fb5d80] border-t-transparent animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-[200px] p-8 text-center">
          <p className="text-sm text-muted-foreground">
            This video could not be played. It may have been deleted or is temporarily unavailable.
          </p>
        </div>
      )}

      <motion.video
        ref={videoRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-h-[70vh] rounded-xl object-contain bg-black"
        controls
        playsInline
        preload="metadata"
        title={title}
        onLoadedMetadata={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        aria-label={`Video: ${title}`}
      >
        <source src={src} type={mimeType} />
        <p className="text-sm text-muted-foreground p-4">
          Your browser does not support HTML5 video.
        </p>
      </motion.video>
    </div>
  )
}
