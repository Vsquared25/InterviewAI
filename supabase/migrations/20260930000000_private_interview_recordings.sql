-- Keep saved sessions and recordings scoped to their signed-in owner, even if
-- another permissive policy is added later.
alter table public.interview_sessions enable row level security;

create policy interview_sessions_owner_guard_20260930
on public.interview_sessions
as restrictive
for all
to public
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant update (recording_path) on public.interview_sessions to authenticated;

create policy interview_sessions_clear_own_recording_20260930
on public.interview_sessions
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

update storage.buckets
set public = false
where id = 'interview-recordings';

create policy interview_recordings_owner_guard_20260930
on storage.objects
as restrictive
for all
to public
using (
  bucket_id <> 'interview-recordings'
  or (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id <> 'interview-recordings'
  or (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy interview_recordings_delete_own_20260930
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'interview-recordings'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
