-- Rulează în Supabase Dashboard → SQL Editor (o singură dată)
-- Creează bucket-ul public pentru fotografii recenzii / galerie

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read uploads"
on storage.objects
for select
to public
using (bucket_id = 'uploads');
