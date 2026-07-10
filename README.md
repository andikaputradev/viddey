# VIDDEY

> Upload. Share. Stream.

VIDDEY is a production-ready anonymous video hosting platform built with **Next.js 15**, **React 19**, and **TypeScript**. Videos are stored on Telegram's infrastructure and streamed securely through a server-side proxy. No login, no registration, no payment — just upload and share.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Next.js Route Handlers |
| Database | Supabase PostgreSQL |
| Storage | Telegram Bot API (private channel) |
| Deployment | Vercel |

## Quick Start

```bash
git clone https://github.com/yourhandle/viddey.git
cd viddey
cp .env.example .env.local
npm install
npm run dev
```

Set up environment variables in `.env.local` — see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Telegram Setup](docs/TELEGRAM_SETUP.md)
- [Supabase Setup](docs/SUPABASE_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Reference](docs/API.md)
- [Security](docs/SECURITY.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Architecture

```
Browser ──► /api/upload ──► Telegram Bot API (sendDocument/sendVideo)
                      └──► Supabase (insert metadata + slug)

Browser ──► /api/stream/[slug] ──► Supabase (lookup file_id)
                             └──► Telegram getFile ──► Proxy stream
```

## License

MIT
