create extension if not exists "pgcrypto";

create table if not exists public.videos (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  telegram_file_id   text not null,
  telegram_file_path text not null,
  file_size       bigint not null check (file_size > 0),
  mime_type       text not null,
  views           bigint not null default 0,
  delete_token    text unique not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  video_id    uuid not null references public.videos(id) on delete cascade,
  reason      text not null check (reason in ('spam', 'copyright', 'abuse', 'malware', 'other')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_videos_slug          on public.videos (slug);
create index if not exists idx_videos_created_at    on public.videos (created_at desc);
create index if not exists idx_videos_delete_token  on public.videos (delete_token);
create index if not exists idx_reports_video_id     on public.reports (video_id);

alter table public.videos enable row level security;
alter table public.reports enable row level security;

create policy "Service role full access on videos"
  on public.videos for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role full access on reports"
  on public.reports for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace function public.increment_views(video_id uuid)
returns void
language sql
security definer
as $$
  update public.videos
  set views = views + 1
  where id = video_id;
$$;
