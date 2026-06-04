import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Home as HomeIcon,
  MapPinned,
  Mic,
  PhoneCall,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    label: "보고서 작성",
    note: "출결, 헌금, 기도제목 입력",
    icon: ClipboardList,
    href: "/district-worship-report",
    style: "bg-primary text-white",
  },
  {
    label: "참석 독려",
    note: "이번 주 연락할 구역원 확인",
    icon: Bell,
    href: "#prepare",
    style: "bg-tint-yellow text-foreground",
  },
  {
    label: "심방 대상",
    note: "결석 흐름을 보고 연락",
    icon: PhoneCall,
    href: "#care",
    style: "bg-tint-rose text-foreground",
  },
  {
    label: "기도 리뷰",
    note: "최근 기도제목 확인",
    icon: HeartHandshake,
    href: "#prayer",
    style: "bg-tint-mint text-foreground",
  },
];

const preparationTasks = [
  {
    title: "성경공부 본문 확인",
    detail: "요한복음 15장 1-8절",
    status: "준비 필요",
  },
  {
    title: "구역원 참석 독려",
    detail: "이번 주 미응답 3명",
    status: "연락 필요",
  },
  {
    title: "장소 확인",
    detail: "주일 오후, 구역원 가정",
    status: "확정",
  },
];

const careMembers = [
  {
    name: "정하윤",
    state: "3회 이상 결석",
    note: "건강 상태 확인 필요",
    tone: "bg-tint-rose text-error",
  },
  {
    name: "윤서준",
    state: "고지 없는 결석",
    note: "이번 주 전화 권장",
    tone: "bg-tint-yellow text-warning",
  },
  {
    name: "최지우",
    state: "2회 연속 결석",
    note: "기도와 안부 확인",
    tone: "bg-tint-yellow text-warning",
  },
];

const prayerItems = [
  {
    title: "최지우 성도 건강 회복",
    scope: "전성도",
    content: "치료 일정과 회복 과정에 평안이 있도록 함께 기도합니다.",
  },
  {
    title: "새가족 정착",
    scope: "전성도",
    content: "새로 연결된 가정이 구역 안에서 자연스럽게 교제하도록 기도합니다.",
  },
  {
    title: "가정 상담 요청",
    scope: "목회자만",
    content: "민감한 내용이라 목회자와 구역장만 확인합니다.",
  },
];

const weeklyStatus = [
  { label: "출석 예상", value: "7/8명" },
  { label: "연락 필요", value: "3명" },
  { label: "기도제목", value: "3개" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-28 text-lg text-foreground lg:pb-10">
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-semibold text-white">
              1
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold leading-7">1구역 대시보드</p>
              <p className="text-base leading-6 text-muted">김민준 구역장</p>
            </div>
          </div>
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline-strong bg-canvas">
            <Search size={24} />
            <span className="sr-only">검색</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-xl border border-hairline bg-canvas p-5">
          <p className="text-base font-semibold text-primary">오늘의 구역장 할 일</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            이번 주 구역예배를 준비하고, 결석 흐름과 기도제목을 확인하세요.
          </h1>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {weeklyStatus.map((item) => (
              <div className="rounded-xl bg-surface-soft p-3 text-center" key={item.label}>
                <p className="text-base text-muted">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                className={`min-h-32 rounded-xl p-4 text-left shadow-sm ${action.style}`}
                href={action.href}
                key={action.label}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 text-foreground">
                  <Icon size={26} />
                </span>
                <span className="mt-4 block text-xl font-semibold leading-7">
                  {action.label}
                </span>
                <span className="mt-1 block text-base leading-6 opacity-80">
                  {action.note}
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5" id="prepare">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">구역예배 준비</h2>
              <p className="mt-1 text-base leading-6 text-muted">
                성경공부와 참석 독려를 먼저 챙깁니다.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {preparationTasks.map((task) => (
              <button
                className="min-h-20 rounded-xl border border-hairline bg-surface-soft p-4 text-left"
                key={task.title}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-xl font-semibold">{task.title}</span>
                    <span className="mt-1 block text-base leading-6 text-muted">
                      {task.detail}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-base font-semibold text-primary">
                    {task.status}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5" id="care">
          <div className="flex items-center gap-3">
            <PhoneCall className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">출결 확인과 심방</h2>
              <p className="mt-1 text-base leading-6 text-muted">
                결석이 반복되는 구역원을 먼저 살핍니다.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {careMembers.map((member) => (
              <article
                className="rounded-xl border border-hairline bg-canvas p-4"
                key={member.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold">{member.name}</h3>
                    <p className="mt-1 text-lg leading-7 text-muted">{member.note}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-base font-semibold ${member.tone}`}
                  >
                    {member.state}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="flex h-14 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-canvas text-lg font-semibold">
                    <PhoneCall size={21} />
                    전화
                  </button>
                  <button className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-white">
                    <CheckCircle2 size={21} />
                    확인 완료
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5" id="prayer">
          <div className="flex items-center gap-3">
            <HeartHandshake className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">구역을 위한 기도</h2>
              <p className="mt-1 text-base leading-6 text-muted">
                최근 보고된 기도제목을 공개범위와 함께 확인합니다.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {prayerItems.map((item) => (
              <article
                className="rounded-xl border border-hairline bg-surface-soft p-4"
                key={item.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold leading-7">{item.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-base font-semibold ${
                      item.scope === "목회자만"
                        ? "bg-tint-rose text-error"
                        : "bg-tint-mint text-success"
                    }`}
                  >
                    {item.scope}
                  </span>
                </div>
                <p className="mt-3 text-lg leading-8 text-muted">{item.content}</p>
              </article>
            ))}
          </div>

          <Link
            className="mt-4 flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xl font-semibold text-white"
            href="/district-worship-report"
          >
            <Mic size={24} />
            기도제목 추가
          </Link>
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5">
          <div className="flex items-center gap-3">
            <CalendarCheck className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">이번 주 보고</h2>
              <p className="mt-1 text-base leading-6 text-muted">
                보고서를 작성하거나 지난 보고를 확인합니다.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              className="flex h-16 items-center justify-center rounded-xl bg-primary text-xl font-semibold text-white"
              href="/district-worship-report"
            >
              작성
            </Link>
            <Link
              className="flex h-16 items-center justify-center rounded-xl border border-hairline-strong bg-canvas text-xl font-semibold"
              href="/district-worship-reports"
            >
              목록
            </Link>
          </div>
        </section>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-3 py-2 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: "홈", icon: HomeIcon, active: true, href: "/" },
            { label: "구역", icon: MapPinned, href: "#prepare" },
            { label: "모임", icon: CalendarCheck, href: "/district-worship-reports" },
            { label: "성도", icon: Users, href: "#care" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-base font-semibold ${
                  item.active ? "bg-surface text-primary" : "text-muted"
                }`}
                href={item.href}
                key={item.label}
              >
                <Icon size={24} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
