import { z } from 'zod'
import { siteConfig } from '@/config/site'

export const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/webm',
])

export const ALLOWED_EXTENSIONS = new Set(['.mp4', '.mov', '.mkv', '.webm'])

export function validateMimeType(mime: string): boolean {
  return ALLOWED_MIME_TYPES.has(mime)
}

export function validateExtension(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  return ALLOWED_EXTENSIONS.has(ext)
}

export function validateFileSize(size: number): boolean {
  return size > 0 && size <= siteConfig.upload.maxSizeBytes
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._\-\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^[._\-]+/, '')
    .slice(0, 200)
    || 'video'
}

export function sanitizeReportReason(reason: string): string {
  const allowed = ['spam', 'copyright', 'abuse', 'malware', 'other']
  return allowed.includes(reason) ? reason : ''
}

export const slugSchema = z.string().regex(/^[a-z0-9]{8,12}$/)

export const deleteTokenSchema = z.string().regex(/^[a-f0-9]{64}$/)

export const reportSchema = z.object({
  slug: slugSchema,
  reason: z.enum(['spam', 'copyright', 'abuse', 'malware', 'other']),
})

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? '0.0.0.0'
}
