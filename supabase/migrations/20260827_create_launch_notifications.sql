create table if not exists public.launch_notifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'launch-notification',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint launch_notifications_email_key unique (email),
  constraint launch_notifications_email_format check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

alter table public.launch_notifications enable row level security;

revoke all on table public.launch_notifications from anon, authenticated;

comment on table public.launch_notifications is
  'Email addresses submitted through the Cairn Careers launch-notification form.';
