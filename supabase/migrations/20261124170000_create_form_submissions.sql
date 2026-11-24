create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('account', 'supplier', 'contact')),
  fields jsonb not null,
  documents jsonb not null default '[]'::jsonb,
  status text not null check (status in ('uploading', 'submitted')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists form_submissions_type_created_at_idx
  on public.form_submissions (form_type, created_at desc);

alter table public.form_submissions enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'account-application-documents',
  'account-application-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
