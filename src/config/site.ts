export const siteConfig = {
  name: 'VIDDEY',
  tagline: 'Upload. Share. Stream.',
  description: 'Upload and share videos instantly with a simple link. No account required.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://viddey.com',
  brand: {
    primary: '#fb5d80',
    primaryHover: '#ff7f9b',
  },
  upload: {
    maxSizeBytes: 2 * 1024 * 1024 * 1024,
    maxSizeDisplay: '2 GB',
    acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'],
    acceptedExtensions: ['.mp4', '.mov', '.mkv', '.webm'],
    acceptString: 'video/mp4,video/quicktime,video/x-matroska,video/webm,.mp4,.mov,.mkv,.webm',
  },
  links: {
    terms: '/terms',
    privacy: '/privacy',
    contact: 'mailto:contact@viddey.com',
  },
} as const

export type SiteConfig = typeof siteConfig
