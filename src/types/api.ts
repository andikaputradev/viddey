export interface ApiSuccess<T = unknown> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export interface UploadResult {
  slug: string
  url: string
  deleteToken: string
  title: string
  fileSize: number
}

export interface TelegramFile {
  file_id: string
  file_unique_id: string
  file_size: number
  file_path: string
}

export interface TelegramSendResult {
  fileId: string
  filePath: string
  fileSize: number
}
