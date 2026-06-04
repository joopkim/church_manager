import {
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Home as HomeIcon,
  MapPinned,
  Mic,
  Plus,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

const summaryCards = [
  {
    label: "전체 성도",
    value: "128",
    note: "공란 구역 6명 포함",
    color: "bg-tint-sky",
    icon: Users,
  },
  {
    label: "구역",
    value: "12",
    note: "보고 완료 8개",
    color: "bg-tint-mint",
    icon: CheckCircle2,
  },
  {
    label: "사역팀",
    value: "9",
    note: "공란 사역팀 11명",
    color: "bg-tint-yellow",
    icon: ClipboardList,
  },
  {
    label: "확인 필요",
    value: "7",
    note: "미보고/장기결석",
    color: "bg-tint-rose",
    icon: CircleAlert,
  },
];

const quickActions = [
  {
    label: "출석 체크",
    note: "구역 모임 참석을 바로 표시",
    icon: CheckCircle2,
    style: "bg-primary text-white",
    href: "/district-worship-report",
  },
  {
    label: "음성 메모",
    note: "기도제목과 나눔을 말로 기록",
    icon: Mic,
    style: "bg-tint-yellow text-foreground",
    href: "/district-worship-report",
  },
  {
    label: "성도 찾기",
    note: "이름으로 빠르게 확인",
    icon: Search,
    style: "bg-tint-sky text-foreground",
    href: "#",
  },
  {
    label: "새 성도",
    note: "기본 정보만 먼저 등록",
    icon: Plus,
    style: "bg-tint-mint text-foreground",
    href: "#",
  },
];

const districtRows = [
  {
    name: "1구역",
    leader: "김민준",
    members: 11,
    lastMeeting: "2026.06.01",
    attendance: "91%",
    status: "보고 완료",
  },
  {
    name: "2구역",
    leader: "박서연",
    members: 9,
    lastMeeting: "2026.05.31",
    attendance: "78%",
    status: "보고 완료",
  },
  {
    name: "3구역",
    leader: "이하준",
    members: 12,
    lastMeeting: "2026.05.24",
    attendance: "미입력",
    status: "미보고",
  },
  {
    name: "공란 구역",
    leader: "-",
    members: 6,
    lastMeeting: "-",
    attendance: "-",
    status: "정리 필요",
  },
];

const attentionItems = [
  "공란 구역 성도 6명",
  "공란 사역팀 성도 11명",
  "이번 주 미보고 구역 4개",
  "최근 3주 결석 성도 3명",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-28 text-lg text-foreground lg:pb-10">
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-semibold text-white">
              초
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold leading-7">초대교회</p>
              <p className="text-base leading-6 text-muted">소그룹 관리</p>
            </div>
          </div>
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline-strong bg-canvas">
            <Search size={24} />
            <span className="sr-only">검색</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-hairline bg-canvas p-5">
          <p className="text-base font-semibold text-primary">오늘 할 일</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            이번 주 소그룹 현황
          </h1>
          <p className="mt-3 text-lg leading-8 text-muted">
            입력은 버튼으로 처리하고, 긴 내용은 음성 메모로 남깁니다.
          </p>
        </div>

        <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
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

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="lg:order-2">
            <div className="rounded-xl border border-hairline bg-canvas p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">확인 필요</h2>
                <CircleAlert className="text-warning" size={28} />
              </div>
              <div className="mt-4 grid gap-3">
                {attentionItems.map((item) => (
                  <button
                    className="min-h-16 rounded-xl border border-hairline bg-surface-soft px-4 py-4 text-left text-lg font-medium leading-7"
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:order-1">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <section
                  className="rounded-xl border border-hairline bg-canvas p-4"
                  key={card.label}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="mt-4 text-base text-muted">{card.label}</p>
                  <p className="mt-1 text-3xl font-semibold">{card.value}</p>
                  <p className="mt-2 text-base leading-6 text-muted">
                    {card.note}
                  </p>
                </section>
              );
            })}
            </div>

            <section className="mt-5 rounded-xl border border-hairline bg-canvas">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-5">
                <div>
                  <h2 className="text-2xl font-semibold">구역별 모임 보고</h2>
                  <p className="mt-2 text-lg leading-7 text-muted">
                    최근 모임일과 보고 상태를 확인합니다.
                  </p>
                </div>
                <CalendarCheck className="text-primary" size={28} />
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {districtRows.map((row) => (
                  <article
                    className="rounded-xl border border-hairline bg-surface-soft p-4"
                    key={row.name}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-semibold">{row.name}</h3>
                        <p className="mt-1 text-lg text-muted">리더 {row.leader}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-base font-semibold ${
                          row.status === "보고 완료"
                            ? "bg-tint-mint text-success"
                            : "bg-tint-yellow text-warning"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <dl className="mt-5 grid grid-cols-3 gap-3 text-lg">
                      <div>
                        <dt className="text-base text-muted">인원</dt>
                        <dd className="mt-1 font-semibold">{row.members}명</dd>
                      </div>
                      <div>
                        <dt className="text-base text-muted">최근 모임</dt>
                        <dd className="mt-1 font-semibold">{row.lastMeeting}</dd>
                      </div>
                      <div>
                        <dt className="text-base text-muted">출석률</dt>
                        <dd className="mt-1 font-semibold">{row.attendance}</dd>
                      </div>
                    </dl>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Link
                        className="flex h-14 items-center justify-center rounded-xl border border-hairline-strong bg-canvas text-base font-semibold"
                        href="/district-worship-reports"
                      >
                        목록
                      </Link>
                      <Link
                        className="flex h-14 items-center justify-center rounded-xl border border-hairline-strong bg-canvas text-base font-semibold"
                        href="/district-worship-report"
                      >
                        작성
                      </Link>
                      <Link
                        className="inline-flex h-14 items-center justify-center gap-1 rounded-xl bg-primary text-base font-semibold text-white"
                        href="/district-worship-report"
                      >
                        <Mic size={20} />
                        음성
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] border-collapse text-lg">
                  <thead>
                    <tr className="border-b border-hairline-soft text-left text-muted">
                      <th className="px-5 py-4 font-medium">구역</th>
                      <th className="px-5 py-4 font-medium">리더</th>
                      <th className="px-5 py-4 font-medium">인원</th>
                      <th className="px-5 py-4 font-medium">최근 모임</th>
                      <th className="px-5 py-4 font-medium">출석률</th>
                      <th className="px-5 py-4 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtRows.map((row) => (
                      <tr className="border-b border-hairline-soft" key={row.name}>
                        <td className="px-5 py-4 font-medium">{row.name}</td>
                        <td className="px-5 py-4 text-muted">{row.leader}</td>
                        <td className="px-5 py-4">{row.members}</td>
                        <td className="px-5 py-4 text-muted">{row.lastMeeting}</td>
                        <td className="px-5 py-4">{row.attendance}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-base font-semibold ${
                              row.status === "보고 완료"
                                ? "bg-tint-mint text-success"
                                : "bg-tint-yellow text-warning"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-3 py-2 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: "홈", icon: HomeIcon, active: true, href: "/" },
            { label: "구역", icon: MapPinned, href: "#" },
            { label: "모임", icon: CalendarCheck, href: "/district-worship-reports" },
            { label: "성도", icon: UserRound, href: "#" },
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
