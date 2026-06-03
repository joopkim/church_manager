-- Church Manager initial schema
-- Target: Supabase PostgreSQL

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_placeholder boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint districts_status_check check (status in ('active', 'archived'))
);

create table public.ministry_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_placeholder boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint ministry_teams_status_check check (status in ('active', 'archived'))
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id),
  ministry_team_id uuid not null references public.ministry_teams(id),
  name text not null,
  phone text,
  email text,
  birth_date date,
  gender text not null default 'unknown',
  address text,
  church_role text,
  baptism_status text,
  registration_date date,
  status text not null default 'active',
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint members_gender_check check (gender in ('male', 'female', 'unknown')),
  constraint members_status_check check (
    status in ('active', 'new_family', 'long_absent', 'dormant', 'transferred')
  )
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  member_id uuid unique references public.members(id),
  role text not null default 'member',
  display_name text,
  email text,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('member', 'leader', 'admin')),
  constraint profiles_status_check check (status in ('active', 'disabled'))
);

create table public.leader_scopes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  scope_type text not null,
  district_id uuid references public.districts(id),
  ministry_team_id uuid references public.ministry_teams(id),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  constraint leader_scopes_scope_type_check check (scope_type in ('district', 'ministry_team')),
  constraint leader_scopes_target_check check (
    (scope_type = 'district' and district_id is not null and ministry_team_id is null)
    or
    (scope_type = 'ministry_team' and ministry_team_id is not null and district_id is null)
  )
);

create unique index leader_scopes_unique_district_scope
  on public.leader_scopes(profile_id, district_id)
  where scope_type = 'district';

create unique index leader_scopes_unique_ministry_team_scope
  on public.leader_scopes(profile_id, ministry_team_id)
  where scope_type = 'ministry_team';

create unique index leader_scopes_one_primary_per_district
  on public.leader_scopes(district_id)
  where scope_type = 'district' and is_primary = true;

create unique index leader_scopes_one_primary_per_ministry_team
  on public.leader_scopes(ministry_team_id)
  where scope_type = 'ministry_team' and is_primary = true;

create table public.small_group_meetings (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id),
  title text not null,
  meeting_date date not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  status text not null default 'planned',
  summary text,
  next_meeting_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint small_group_meetings_status_check check (
    status in ('planned', 'completed', 'cancelled')
  )
);

create table public.meeting_attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.small_group_meetings(id) on delete cascade,
  member_id uuid not null references public.members(id),
  status text not null default 'unknown',
  note text,
  checked_by uuid references public.profiles(id),
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meeting_attendance_status_check check (status in ('present', 'absent', 'unknown')),
  constraint meeting_attendance_unique_member unique (meeting_id, member_id)
);

create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.small_group_meetings(id) on delete cascade,
  member_id uuid references public.members(id),
  note_type text not null,
  content text not null,
  visibility text not null default 'leaders',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint meeting_notes_note_type_check check (
    note_type in ('summary', 'prayer', 'sharing', 'care', 'follow_up')
  ),
  constraint meeting_notes_visibility_check check (visibility in ('leaders', 'admins', 'private'))
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create trigger set_districts_updated_at
before update on public.districts
for each row execute function public.set_updated_at();

create trigger set_ministry_teams_updated_at
before update on public.ministry_teams
for each row execute function public.set_updated_at();

create trigger set_members_updated_at
before update on public.members
for each row execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_small_group_meetings_updated_at
before update on public.small_group_meetings
for each row execute function public.set_updated_at();

create trigger set_meeting_attendance_updated_at
before update on public.meeting_attendance
for each row execute function public.set_updated_at();

create trigger set_meeting_notes_updated_at
before update on public.meeting_notes
for each row execute function public.set_updated_at();

insert into public.districts (name, description, is_placeholder)
values ('공란 구역', '구역 소속이 아직 정해지지 않은 성도를 위한 기본 구역입니다.', true)
on conflict (name) do nothing;

insert into public.ministry_teams (name, description, is_placeholder)
values ('공란 사역팀', '사역팀 소속이 아직 정해지지 않은 성도를 위한 기본 사역팀입니다.', true)
on conflict (name) do nothing;

create index members_district_id_idx on public.members(district_id);
create index members_ministry_team_id_idx on public.members(ministry_team_id);
create index members_status_idx on public.members(status);
create index leader_scopes_profile_id_idx on public.leader_scopes(profile_id);
create index leader_scopes_district_id_idx on public.leader_scopes(district_id);
create index leader_scopes_ministry_team_id_idx on public.leader_scopes(ministry_team_id);
create index small_group_meetings_district_id_idx on public.small_group_meetings(district_id);
create index small_group_meetings_meeting_date_idx on public.small_group_meetings(meeting_date);
create index meeting_attendance_meeting_id_idx on public.meeting_attendance(meeting_id);
create index meeting_attendance_member_id_idx on public.meeting_attendance(member_id);
create index meeting_notes_meeting_id_idx on public.meeting_notes(meeting_id);
create index meeting_notes_member_id_idx on public.meeting_notes(member_id);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and status = 'active'
$$;

create or replace function public.current_member_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select member_id
  from public.profiles
  where id = auth.uid()
    and status = 'active'
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_profile_role() = 'admin', false)
$$;

create or replace function public.can_manage_district(target_district_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.leader_scopes ls
      join public.profiles p on p.id = ls.profile_id
      where p.id = auth.uid()
        and p.status = 'active'
        and p.role in ('leader', 'admin')
        and ls.scope_type = 'district'
        and ls.district_id = target_district_id
    )
$$;

create or replace function public.can_manage_ministry_team(target_ministry_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.leader_scopes ls
      join public.profiles p on p.id = ls.profile_id
      where p.id = auth.uid()
        and p.status = 'active'
        and p.role in ('leader', 'admin')
        and ls.scope_type = 'ministry_team'
        and ls.ministry_team_id = target_ministry_team_id
    )
$$;

create or replace function public.can_manage_meeting(target_meeting_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.small_group_meetings m
      where m.id = target_meeting_id
        and public.can_manage_district(m.district_id)
    )
$$;

alter table public.districts enable row level security;
alter table public.ministry_teams enable row level security;
alter table public.members enable row level security;
alter table public.profiles enable row level security;
alter table public.leader_scopes enable row level security;
alter table public.small_group_meetings enable row level security;
alter table public.meeting_attendance enable row level security;
alter table public.meeting_notes enable row level security;
alter table public.audit_logs enable row level security;

create policy "Authenticated users can view active districts"
on public.districts for select
to authenticated
using (archived_at is null);

create policy "Admins can manage districts"
on public.districts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Authenticated users can view active ministry teams"
on public.ministry_teams for select
to authenticated
using (archived_at is null);

create policy "Admins can manage ministry teams"
on public.ministry_teams for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Profiles can be viewed by owner admins and leaders for scoped members"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
  or (
    member_id is not null
    and exists (
      select 1
      from public.members m
      where m.id = profiles.member_id
        and (
          public.can_manage_district(m.district_id)
          or public.can_manage_ministry_team(m.ministry_team_id)
        )
    )
  )
);

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Members can be viewed by scoped users"
on public.members for select
to authenticated
using (
  public.is_admin()
  or id = public.current_member_id()
  or public.can_manage_district(district_id)
  or public.can_manage_ministry_team(ministry_team_id)
);

create policy "Admins and scoped leaders can update members"
on public.members for update
to authenticated
using (
  public.is_admin()
  or public.can_manage_district(district_id)
  or public.can_manage_ministry_team(ministry_team_id)
)
with check (
  public.is_admin()
  or public.can_manage_district(district_id)
  or public.can_manage_ministry_team(ministry_team_id)
);

create policy "Admins can insert members"
on public.members for insert
to authenticated
with check (public.is_admin());

create policy "Admins can manage leader scopes"
on public.leader_scopes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Leaders can view their own scopes"
on public.leader_scopes for select
to authenticated
using (public.is_admin() or profile_id = auth.uid());

create policy "Meetings can be viewed by admins leaders and district members"
on public.small_group_meetings for select
to authenticated
using (
  public.is_admin()
  or public.can_manage_district(district_id)
  or exists (
    select 1
    from public.members m
    where m.id = public.current_member_id()
      and m.district_id = small_group_meetings.district_id
  )
);

create policy "Admins and district leaders can manage meetings"
on public.small_group_meetings for all
to authenticated
using (public.can_manage_district(district_id))
with check (public.can_manage_district(district_id));

create policy "Attendance can be viewed by scoped users and self"
on public.meeting_attendance for select
to authenticated
using (
  public.is_admin()
  or member_id = public.current_member_id()
  or public.can_manage_meeting(meeting_id)
);

create policy "Admins and district leaders can manage attendance"
on public.meeting_attendance for all
to authenticated
using (public.can_manage_meeting(meeting_id))
with check (public.can_manage_meeting(meeting_id));

create policy "Notes can be viewed by visibility and scope"
on public.meeting_notes for select
to authenticated
using (
  public.is_admin()
  or (
    visibility = 'leaders'
    and public.can_manage_meeting(meeting_id)
  )
  or (
    visibility = 'private'
    and created_by = auth.uid()
  )
  or (
    member_id = public.current_member_id()
    and visibility = 'leaders'
  )
);

create policy "Admins and district leaders can create notes"
on public.meeting_notes for insert
to authenticated
with check (
  public.is_admin()
  or public.can_manage_meeting(meeting_id)
);

create policy "Note authors admins and district leaders can update notes"
on public.meeting_notes for update
to authenticated
using (
  public.is_admin()
  or created_by = auth.uid()
  or public.can_manage_meeting(meeting_id)
)
with check (
  public.is_admin()
  or created_by = auth.uid()
  or public.can_manage_meeting(meeting_id)
);

create policy "Admins can view audit logs"
on public.audit_logs for select
to authenticated
using (public.is_admin());

create policy "Admins can insert audit logs"
on public.audit_logs for insert
to authenticated
with check (public.is_admin());
