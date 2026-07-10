# Installation Guide

## Prerequisites

- Node.js 20+
- npm 10+
- A Telegram account
- A Supabase account
- A Vercel account (for deployment)

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/yourhandle/viddey.git
cd viddey
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=-100xxxxxxxxxx

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md) and [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for how to obtain each value.

### 3. Run database migrations

Open your Supabase project → SQL Editor → paste the contents of `db/migrations/001_initial.sql` → run.

### 4. Start the development server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Type Checking

```bash
npm run type-check
```

## Folder Structure

```
viddey/
├── src/
│   ├── app/              Next.js App Router pages and API routes
│   ├── components/       React components
│   ├── config/           Site-wide constants
│   ├── hooks/            Custom React hooks
│   ├── lib/              Server utilities (Supabase, Telegram, security)
│   └── types/            Shared TypeScript types
├── db/
│   └── migrations/       SQL migration files
├── docs/                 Documentation
├── public/               Static assets
├── .env.example          Environment variable template
└── next.config.ts        Next.js configuration
```
