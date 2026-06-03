# Database Schema

## 문서 상태

상태: 1차 확정 초안

이 문서는 Supabase PostgreSQL에 적용할 데이터베이스 구조의 1차 확정 초안이다. 이 문서를 기준으로 `supabase/schema.sql`을 작성한다.

## 설계 원칙

- 성도는 시스템의 중심 엔티티다.
- 모든 성도는 하나의 구역과 하나의 사역팀에 속한다.
- 구역/사역팀 미정 상태는 NULL이 아니라 공란 구역/공란 사역팀으로 관리한다.
- 로그인 사용자는 Supabase Auth의 `auth.users`를 사용하고, 앱 내부 프로필은 `profiles`에서 관리한다.
- 성도와 로그인 계정은 1:0..1 관계로 둔다. 즉 성도는 로그인 계정이 없을 수 있다.
- 관리자 계정은 성도 레코드와 연결되지 않아도 된다.
- 1차 MVP 로그인은 관리자/리더를 우선하고, 성도 본인 로그인은 구조만 열어둔다.
- 리더 권한은 role만으로 판단하지 않고 `leader_scopes`로 관리 범위를 확인한다.
- 첫 개발 범위의 모임은 소그룹 모임이며, 예배는 향후 확장으로 남긴다.
- 삭제는 기본적으로 물리 삭제보다 `status` 또는 `archived_at`을 사용한다.

## 핵심 관계

```text
auth.users
  1:1 profiles
  0..1:1 members

districts
  1:N members
  1:N small_group_meetings

ministry_teams
  1:N members

profiles
  1:N leader_scopes

small_group_meetings
  1:N meeting_attendance
  1:N meeting_notes

members
  1:N meeting_attendance
  1:N meeting_notes
```

## Enum 후보

PostgreSQL enum 또는 text + check constraint 중 하나를 선택한다. 초기에는 Supabase 관리와 마이그레이션 유연성을 위해 `text + check constraint`를 권장한다.

### profile_role

```text
member
leader
admin
```

### member_status

```text
active
new_family
long_absent
dormant
transferred
```

초기 화면에서는 다음 네 가지를 우선 사용한다.

```text
active
new_family
long_absent
dormant
```

### gender

```text
male
female
unknown
```

### attendance_status

```text
present
absent
unknown
```

### leader_scope_type

```text
district
ministry_team
```

### meeting_status

```text
planned
completed
cancelled
```

## 테이블 설계

## profiles

Supabase Auth 사용자와 앱 권한을 연결하는 테이블이다.

```text
id uuid primary key references auth.users(id)
member_id uuid unique references members(id)
role text not null default 'member'
display_name text
email text
phone text
status text not null default 'active'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

규칙:

- `id`는 Supabase Auth 사용자 id와 동일하다.
- 한 로그인 계정은 최대 한 명의 성도와 연결된다.
- 관리자는 `member_id` 없이 존재할 수 있다.
- `role = leader`여도 `leader_scopes`가 없으면 관리 범위는 없다.

확정:

- 관리자 계정은 성도 레코드와 연결하지 않아도 된다.
- 1차 MVP 로그인은 관리자/리더를 우선한다.
- 성도 본인 로그인은 schema와 RLS 구조만 열어둔다.

## districts

구역을 관리한다.

```text
id uuid primary key
name text not null unique
description text
is_placeholder boolean not null default false
status text not null default 'active'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz
```

규칙:

- `공란 구역`은 `is_placeholder = true`로 생성한다.
- `공란 구역`은 삭제할 수 없다.
- 일반 구역 이름은 중복될 수 없다.

## ministry_teams

사역팀을 관리한다.

```text
id uuid primary key
name text not null unique
description text
is_placeholder boolean not null default false
status text not null default 'active'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz
```

규칙:

- `공란 사역팀`은 `is_placeholder = true`로 생성한다.
- `공란 사역팀`은 삭제할 수 없다.
- 일반 사역팀 이름은 중복될 수 없다.

## members

성도 정보를 관리한다.

```text
id uuid primary key
district_id uuid not null references districts(id)
ministry_team_id uuid not null references ministry_teams(id)
name text not null
phone text
email text
birth_date date
gender text not null default 'unknown'
address text
church_role text
baptism_status text
registration_date date
status text not null default 'active'
memo text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz
```

규칙:

- `district_id`와 `ministry_team_id`는 NULL이 될 수 없다.
- 소속 미정인 경우 공란 구역/공란 사역팀 id를 사용한다.
- 성도 삭제는 `archived_at` 또는 `status = dormant`로 처리하는 것을 우선한다.

검수 필요:

- `church_role`을 자유 텍스트로 둘 것인가, 별도 직분 테이블/설정값으로 둘 것인가?
- `baptism_status`를 자유 텍스트로 둘 것인가, 정해진 값으로 둘 것인가?
- 가족관계는 1차 MVP에서 제외할 것인가, 별도 `member_relationships`로 만들 것인가?

## leader_scopes

리더의 관리 범위를 정의한다.

```text
id uuid primary key
profile_id uuid not null references profiles(id)
scope_type text not null
district_id uuid references districts(id)
ministry_team_id uuid references ministry_teams(id)
created_at timestamptz not null default now()
created_by uuid references profiles(id)
is_primary boolean not null default false
```

규칙:

- `scope_type = district`이면 `district_id`가 필요하다.
- `scope_type = ministry_team`이면 `ministry_team_id`가 필요하다.
- 하나의 profile은 여러 leader scope를 가질 수 있다.
- 한 구역 또는 사역팀에 여러 리더가 있을 수 있다.
- 복수 리더 중 대표 리더는 `is_primary = true`로 표시한다.
- `profiles.role = leader`여도 `leader_scopes`가 없으면 실제 관리 권한은 없다.

권장 제약:

```text
unique(profile_id, scope_type, district_id)
unique(profile_id, scope_type, ministry_team_id)
```

확정:

- 구역/사역팀 모두 복수 리더를 허용한다.
- 대표 리더 표시를 위해 `is_primary`를 둔다.

## small_group_meetings

소그룹 모임을 관리한다.

```text
id uuid primary key
district_id uuid not null references districts(id)
title text not null
meeting_date date not null
starts_at timestamptz
ends_at timestamptz
location text
status text not null default 'planned'
summary text
next_meeting_date date
created_by uuid references profiles(id)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz
```

규칙:

- 첫 개발 범위에서 소그룹 모임은 구역에 연결된다.
- 사역팀 모임은 첫 MVP에서 제외한다.
- 모임 기록 완료 시 `status = completed`로 전환한다.

확정:

- 모임 날짜는 필수다.
- 시작/종료 시간은 선택값으로 둔다.
- 장소는 1차 MVP에서 자유 텍스트로 둔다.
- 사역팀 모임은 1차 MVP에서 제외한다.

## meeting_attendance

소그룹 모임 참석 상태를 관리한다.

```text
id uuid primary key
meeting_id uuid not null references small_group_meetings(id)
member_id uuid not null references members(id)
status text not null default 'unknown'
note text
checked_by uuid references profiles(id)
checked_at timestamptz
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

규칙:

- `unique(meeting_id, member_id)`로 한 모임에서 한 성도는 하나의 참석 기록만 가진다.
- 참석 상태는 `present`, `absent`, `unknown` 중 하나다.
- 모임 생성 시점의 구역원 기준으로 참석 대상 기록을 생성하는 방식을 권장한다.

검수 필요:

- 방문자/비등록 참석자를 기록할 필요가 있는가?
- 결석 사유를 `note` 하나로 충분히 처리할 것인가, 별도 사유 코드가 필요한가?

## meeting_notes

모임 관련 메모, 기도제목, 나눔 기록을 관리한다.

```text
id uuid primary key
meeting_id uuid not null references small_group_meetings(id)
member_id uuid references members(id)
note_type text not null
content text not null
visibility text not null default 'leaders'
created_by uuid references profiles(id)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz
```

`note_type` 후보:

```text
summary
prayer
sharing
care
follow_up
```

`visibility` 후보:

```text
leaders
admins
private
```

규칙:

- `member_id`가 있으면 특정 성도에 대한 기록이다.
- `member_id`가 없으면 모임 전체 기록이다.
- 민감한 돌봄 기록은 기본적으로 관리자 또는 작성자 중심으로 제한한다.

확정:

- 기도제목, 나눔, 일반 메모는 같은 `meeting_notes` 테이블에서 관리한다.
- `note_type`과 `visibility`로 구분한다.
- 민감한 상담/돌봄 메모는 1차 MVP에서 깊게 다루지 않고 제한적으로만 열어둔다.

## audit_logs

중요 변경 이력을 남기는 테이블이다. 1차 MVP 필수 구현은 아니지만 개인정보 앱이므로 초기에 구조를 열어둔다.

```text
id uuid primary key
actor_profile_id uuid references profiles(id)
action text not null
entity_type text not null
entity_id uuid
before_data jsonb
after_data jsonb
created_at timestamptz not null default now()
```

확정:

- 감사 로그 테이블은 초기 schema에 포함한다.
- 1차 구현에서는 주요 정보 변경 기록부터 시작한다.

## 초기 Seed 데이터

필수:

```text
districts:
- 공란 구역, is_placeholder = true

ministry_teams:
- 공란 사역팀, is_placeholder = true
```

관리자 계정:

- Supabase Auth에서 관리자 사용자를 만든다.
- 해당 auth user id로 `profiles` 레코드를 생성한다.
- `profiles.role = admin`으로 설정한다.

## RLS 초안

1차 SQL 정책 초안은 [schema.sql](../supabase/schema.sql)에 작성했다. 운영 확정 전에는 실제 Supabase 프로젝트에서 RLS 동작을 테스트해야 한다.

### 공통

- 인증되지 않은 사용자는 앱 데이터에 접근할 수 없다.
- 관리자는 모든 테이블을 조회/수정할 수 있다.
- 리더는 `leader_scopes`에 부여된 범위만 조회/수정할 수 있다.
- 성도는 자기 `member_id`와 연결된 데이터만 조회할 수 있다.

### members

- admin: 전체 조회/생성/수정
- district leader: 담당 구역 성도 조회/부분 수정
- ministry team leader: 담당 사역팀 성도 조회/부분 수정
- member: 자기 정보 조회, 일부 수정 요청

### small_group_meetings

- admin: 전체 관리
- district leader: 담당 구역 모임 관리
- member: 자기 구역 모임 조회 구조는 열어둔다.

### meeting_attendance

- admin: 전체 관리
- district leader: 담당 구역 모임 참석 관리
- member: 자기 참석 기록 조회

### meeting_notes

- admin: 전체 조회 가능
- district leader: 담당 구역 모임 기록 조회/작성
- member: 자기에게 공개된 기록만 조회

## 1차 확정 사항

1. 관리자 `member_id`는 nullable로 둔다.
2. 1차 MVP 로그인은 관리자/리더를 우선한다.
3. 성도 본인 로그인은 구조만 열어둔다.
4. `leader_scopes`에 `is_primary`를 추가한다.
5. 구역/사역팀 모두 복수 리더를 허용한다.
6. 사역팀 모임은 1차 MVP에서 제외한다.
7. 소그룹 모임 장소는 자유 텍스트로 둔다.
8. 기도제목과 일반 메모는 같은 `meeting_notes` 테이블에서 관리한다.
9. 민감한 상담/돌봄 메모는 1차 MVP에서 제한적으로만 열어둔다.
10. 감사 로그 테이블은 초기 schema에 포함한다.

## 추가 확정 사항

1. `church_role`은 1차 MVP에서 자유 텍스트로 둔다.
2. `baptism_status`는 1차 MVP에서 자유 텍스트로 둔다.
3. 가족관계는 1차 MVP에서 제외한다.
4. 방문자 또는 비등록 참석자는 1차 MVP 출석 기록에서 제외한다.
5. 성도에게 자기 구역 모임 기록을 볼 수 있는 구조는 열어두되, 화면 구현은 1차 MVP 후순위로 둔다.
