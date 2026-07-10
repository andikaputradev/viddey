# API Reference

All responses follow this schema:

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "error": "Human-readable message.", "code": "OPTIONAL_CODE" }
```

---

## POST /api/upload

Upload a video file to VIDDEY.

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | Video file (mp4, mov, mkv, webm). Max 2 GB. |

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "abc123xyz0",
    "url": "https://viddey.com/v/abc123xyz0",
    "deleteToken": "a3f...64hexchars",
    "title": "my_video.mp4",
    "fileSize": 12345678
  }
}
```

**Errors:**
- `400` — No file or bad form data
- `413` — File too large
- `415` — Unsupported file type
- `429` — Rate limit exceeded (10 uploads/IP/hour)
- `502` — Telegram API failure

---

## GET /api/video/[slug]

Fetch public metadata for a video.

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "abc123xyz0",
    "title": "my_video.mp4",
    "file_size": 12345678,
    "mime_type": "video/mp4",
    "views": 42,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Errors:** `400` bad slug, `404` not found.

---

## GET /api/stream/[slug]

Stream the video. Supports `Range` header for seeking.

**Headers:**
- `Range: bytes=0-` (optional, standard browser range request)

**Success response (200 or 206):**
- Body: video binary stream
- `Content-Type: video/mp4` (or actual mime type)
- `Accept-Ranges: bytes`
- `Content-Length: <size>`
- `Content-Range: bytes 0-1234/5678` (on 206)

---

## POST /api/report

Submit a content report.

**Request body (JSON):**
```json
{
  "slug": "abc123xyz0",
  "reason": "spam"
}
```

**Allowed reasons:** `spam`, `copyright`, `abuse`, `malware`, `other`

**Success response (200):**
```json
{ "success": true, "data": { "message": "Report submitted." } }
```

**Errors:** `400` bad slug/body, `404` video not found, `422` validation error, `429` rate limit.

---

## DELETE /api/delete/[slug]

Permanently delete a video.

**Request body (JSON):**
```json
{ "token": "a3f...64hexchars" }
```

The `token` was returned at upload time and must match the stored `delete_token` in the database.

**Success response (200):**
```json
{ "success": true, "data": { "message": "Video deleted successfully." } }
```

**Errors:** `400` bad slug/token format, `403` token mismatch, `429` rate limit.

---

## GET /api/health

Returns service health status.

```json
{ "status": "ok", "timestamp": "...", "version": "0.1.0" }
```

---

## GET /api/meta/[slug]

Returns formatted metadata for social sharing integrations.

```json
{
  "success": true,
  "data": {
    "title": "my_video.mp4",
    "url": "https://viddey.com/v/abc123xyz0",
    "streamUrl": "https://viddey.com/api/stream/abc123xyz0",
    "size": "11.77 MB",
    "views": 42,
    "uploadedAt": "3d ago",
    "mimeType": "video/mp4"
  }
}
```
