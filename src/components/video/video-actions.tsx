'use client'

import { Copy, Download, Flag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportDialog } from '@/components/report/report-dialog'
import { useCopy } from '@/hooks/use-copy'

interface VideoActionsProps {
  slug: string
  streamUrl: string
  title: string
}

export function VideoActions({ slug, streamUrl, title }: VideoActionsProps) {
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/v/${slug}`
  const { copy, copied } = useCopy()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        onClick={() => copy(pageUrl)}
        aria-label="Copy video link"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied!' : 'Copy link'}
      </Button>

      <Button
        size="sm"
        variant="outline"
        asChild
      >
        <a
          href={streamUrl}
          download={title}
          aria-label="Download video"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </Button>

      <ReportDialog slug={slug}>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Report video"
        >
          <Flag className="h-3.5 w-3.5" />
          Report
        </Button>
      </ReportDialog>
    </div>
  )
}
