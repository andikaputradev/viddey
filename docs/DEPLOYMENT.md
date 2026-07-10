# Vercel Deployment Guide

## Prerequisites

- A Vercel account
- This repository pushed to GitHub, GitLab, or Bitbucket

## Steps

### 1. Import the Project

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New → Project**.
3. Select your repository.
4. Framework preset: **Next.js** (auto-detected).

### 2. Set Environment Variables

In the Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Your bot token |
| `TELEGRAM_CHANNEL_ID` | Channel ID (negative number) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret |
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://viddey.com` |
| `MAX_UPLOAD_SIZE` | Optional — default `2gb` |
| `UPLOAD_RATE_LIMIT` | Optional — uploads per IP per hour, default `10` |
| `REPORT_RATE_LIMIT` | Optional — reports per IP per hour, default `5` |
| `GENERAL_RATE_LIMIT` | Optional — requests per IP per minute, default `120` |

### 3. Deploy

Click **Deploy**. Vercel will build and deploy automatically.

### 4. Configure Custom Domain (Optional)

Go to project → **Settings** → **Domains** → add your domain and follow DNS instructions.

Update `NEXT_PUBLIC_SITE_URL` to match your domain after this step.

## Function Configuration

The upload and stream routes require longer execution time. These are pre-configured in the route handlers:

```ts
export const maxDuration = 60
```

For Vercel Pro/Enterprise plans, you can extend this to 300 seconds if needed for large files.

## Body Size Limit

Vercel's default serverless function body limit is **4.5 MB**. For larger uploads, you must:

1. Upgrade to **Vercel Pro** (allows up to 4.5 MB on Hobby, higher limits available on Pro).
2. Or self-host with a Node.js server where you control request limits.

The `TELEGRAM_BOT_TOKEN` file upload limit (Telegram Cloud API) is **50 MB** regardless of Vercel configuration.

## Redeployment

Push to your main branch. Vercel automatically rebuilds and redeploys.

## Rollback

Go to **Deployments** in the Vercel dashboard, find a previous deployment, and click **Promote to Production**.
