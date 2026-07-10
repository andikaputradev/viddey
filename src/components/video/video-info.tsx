import { Eye, HardDrive, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatBytes, formatRelativeDate } from '@/lib/utils'
import type { VideoPublic } from '@/types/video'

interface VideoInfoProps {
  video: VideoPublic
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-foreground leading-snug break-words">
        {video.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {video.views.toLocaleString()} {video.views === 1 ? 'view' : 'views'}
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5" aria-hidden />
          {formatBytes(video.file_size)}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatRelativeDate(video.created_at)}
        </span>
        <Badge variant="secondary" className="text-xs">
          {video.mime_type.split('/')[1]?.toUpperCase() ?? 'VIDEO'}
        </Badge>
      </div>
    </div>
  )
}
