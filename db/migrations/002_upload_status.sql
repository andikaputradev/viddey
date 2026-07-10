alter table public.videos
  add column if not exists upload_status text not null default 'completed'
    check (upload_status in ('pending', 'uploading', 'completed', 'failed'));

create index if not exists idx_videos_upload_status
  on public.videos (upload_status);
