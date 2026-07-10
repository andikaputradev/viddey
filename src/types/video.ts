export interface Video {
  id: string
  slug: string
  title: string
  telegram_file_id: string
  telegram_file_path: string
  file_size: number
  mime_type: string
  views: number
  delete_token: string
  created_at: string
}

export type VideoPublic = Omit<Video, 'delete_token' | 'telegram_file_id' | 'telegram_file_path'>

export interface VideoUploadResult {
  slug: string
  url: string
  deleteToken: string
  title: string
  fileSize: number
}

export interface Report {
  id: string
  video_id: string
  reason: string
  created_at: string
}

export type ReportReason = 'spam' | 'copyright' | 'abuse' | 'malware' | 'other'

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Spam' },
  { value: 'copyright', label: 'Copyright infringement' },
  { value: 'abuse', label: 'Abusive content' },
  { value: 'malware', label: 'Malware or phishing' },
  { value: 'other', label: 'Other' },
]
