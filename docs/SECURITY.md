# Security Documentation

## Implemented Controls

### Authentication & Authorization
- No user accounts; delete actions are gated by a 64-byte cryptographically random token returned at upload time.
- Delete token is stored as a plaintext secret in the database, matched at constant time by the SQL query (no timing-safe compare in SQL, but token length and randomness make brute-force infeasible).

### Input Validation
- File MIME type is validated server-side against an allowlist (`video/mp4`, `video/quicktime`, `video/x-matroska`, `video/webm`).
- File extension is validated independently of MIME type.
- File size is validated against `MAX_UPLOAD_SIZE`.
- All slug and token inputs are validated with Zod schemas and regex before any database interaction.
- Report reason is validated against a strict allowlist enum.

### Rate Limiting
- Upload: 10 requests per IP per hour
- Report: 5 requests per IP per hour
- Delete: 20 requests per IP per hour
- General: 120 requests per IP per minute

Rate limiting is implemented in-process using a sliding window Map. **Limitation:** this does not survive process restarts or scale across multiple serverless instances. For production scale, replace with an Upstash Redis-backed rate limiter (`@upstash/ratelimit`).

### Security Headers
All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — strict policy blocking external scripts and frames

### Secret Isolation
- `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are server-only.
- No sensitive values are prefixed with `NEXT_PUBLIC_` and are never bundled into client JS.
- Telegram file download URLs (containing the bot token) are constructed server-side and are never returned to the browser.

### Database
- Row Level Security (RLS) is enabled on all tables.
- Only the `service_role` key can read/write; the anon key has no access.
- The `increment_views` function uses `SECURITY DEFINER` to allow controlled view counting without exposing table write access.

## Known Limitations

| Area | Limitation | Mitigation |
|---|---|---|
| Rate limiting | In-memory; not distributed | Replace with Upstash Redis for multi-instance |
| Delete token | Plaintext in DB (no hashing) | Consider storing `sha256(token)` for defense-in-depth |
| File type | MIME type can be spoofed by client | Server validates both MIME and extension; add magic-byte inspection for hardening |
| Telegram storage | Files may expire or be removed | Monitor Telegram file availability; back up file_id |
| CSP `unsafe-inline` | Required for Tailwind in some configurations | Move to nonce-based CSP in future versions |
| Vercel body limit | 4.5 MB default on Hobby plan | Document clearly; self-host or upgrade for larger files |

## Reporting Security Issues

Do not open public issues for security vulnerabilities. Contact: security@viddey.com
