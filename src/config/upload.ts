export const uploadConfig = {
  serviceUrl: process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL ?? 'http://localhost:3001',
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY ?? '',
  chunkSize: parseInt(process.env.NEXT_PUBLIC_CHUNK_SIZE_BYTES ?? '10485760', 10),
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_BYTES ?? '2147483648', 10),
  maxFileSizeDisplay: '2 GB',
  pollIntervalMs: 1500,
  maxPollAttempts: 600,
  acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'] as string[],
  acceptString: 'video/mp4,video/quicktime,video/x-matroska,video/webm,.mp4,.mov,.mkv,.webm',
} as const
