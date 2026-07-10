# Troubleshooting Guide

## Upload Fails Immediately

**Symptom:** Error shown right after selecting a file, before upload starts.

**Causes and fixes:**
- File type not accepted — only MP4, MOV, MKV, WEBM are supported.
- File size exceeds the configured limit — check `MAX_UPLOAD_SIZE`.
- `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHANNEL_ID` is not set in environment variables.

## Upload Stuck at 100% / Processing Forever

**Symptom:** Progress bar reaches 100% but no share link appears.

**Causes and fixes:**
- Telegram API is unresponsive — retry later.
- The bot does not have post permission in the channel — verify bot is admin with posting rights.
- Vercel function timed out — upgrade to Pro and set a higher `maxDuration`.

## "Failed to resolve video source" on Video Page

**Symptom:** Video player shows an error; stream API returns 502.

**Causes and fixes:**
- Telegram file_path has expired — this should not happen since getFile is called on every stream request; verify `TELEGRAM_BOT_TOKEN` is correct.
- The video record exists in Supabase but the Telegram message was deleted — the file_id is no longer valid.

## Video Not Found (404)

**Symptom:** Opening a share link returns the not-found page.

**Causes and fixes:**
- The video was deleted via the delete endpoint.
- The slug does not exist — verify the URL is correct.
- Supabase connection is failing — check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Rate Limit Errors (429)

**Symptom:** API returns `429 Too Many Requests`.

**Causes and fixes:**
- Exceeded upload rate limit (10/hour) — wait and retry.
- For development, increase `UPLOAD_RATE_LIMIT` in `.env.local`.

## SUPABASE_SERVICE_ROLE_KEY Not Working

**Symptom:** Database operations fail with auth errors.

**Causes and fixes:**
- Copied the `anon` key instead of `service_role` — double-check in Supabase dashboard → Settings → API.
- Key has a leading or trailing space — ensure no whitespace.

## Build Fails: Module Not Found

**Symptom:** `npm run build` exits with missing module errors.

**Causes and fixes:**
- Run `npm install` before building.
- Verify `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`.

## Videos Play with No Audio on Mobile

**Symptom:** Video plays but audio is muted or absent on iOS.

**Causes and fixes:**
- iOS requires user interaction to unmute. Tap the speaker icon in the native video controls.
- This is a browser/OS behavior, not a VIDDEY bug.

## Dark Mode Flickers on Load

**Symptom:** Page briefly shows light mode before switching to dark.

**Causes and fixes:**
- This is expected behavior when `defaultTheme="dark"` is used with SSR. `next-themes` handles this with a script injection. Ensure `suppressHydrationWarning` is set on the `<html>` tag (already configured in `layout.tsx`).
