import {
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Plus,
  Search,
  Users,
} from "lucide-react";

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
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="sticky top-0 z-10 border-b border-hairline bg-canvas/95 px-4 py-3 backdrop-blur lg:static lg:border-b-0 lg:border-r lg:px-5 lg:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white lg:h-10 lg:w-10">
              초
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">초대교회</p>
              <p className="text-xs text-muted">소그룹 관리</p>
            </div>
          </div>

          <nav className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1 text-sm font-medium lg:mx-0 lg:mt-8 lg:grid lg:overflow-visible lg:px-0 lg:pb-0">
            {["대시보드", "성도", "구역", "사역팀", "소그룹 모임", "리더 관리"].map(
              (item) => (
                <a
                  className={`shrink-0 rounded-md px-3 py-2 ${
                    item === "대시보드"
                      ? "bg-surface text-foreground"
                      : "text-muted"
                  }`}
                  href="#"
                  key={item}
                >
                  {item}
                </a>
              ),
            )}
          </nav>
        </aside>

        <section className="px-4 py-4 pb-24 sm:px-6 lg:px-10 lg:py-6 lg:pb-10">
          <header className="flex flex-col gap-4 border-b border-hairline pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">관리자 대시보드</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">
                이번 주 소그룹 현황
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-hairline-strong bg-canvas px-3 text-sm font-medium">
                <Search size={16} />
                성도 검색
              </button>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white">
                <Plus size={16} />
                성도 등록
              </button>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <section
                  className="rounded-lg border border-hairline bg-canvas p-3.5 sm:p-5"
                  key={card.label}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-md sm:h-10 sm:w-10 ${card.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-xs text-muted sm:text-sm">{card.label}</p>
                  <p className="mt-1 text-2xl font-semibold sm:text-3xl">{card.value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted sm:mt-2 sm:text-sm">
                    {card.note}
                  </p>
                </section>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
            <aside className="rounded-lg border border-hairline bg-canvas p-4 xl:order-2 xl:p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold sm:text-lg">확인 필요</h2>
                <CircleAlert className="text-warning" size={20} />
              </div>
              <div className="mt-3 grid gap-2.5">
                {attentionItems.map((item) => (
                  <div
                    className="rounded-md border border-hairline bg-surface-soft px-3 py-3 text-sm"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <section className="rounded-lg border border-hairline bg-canvas xl:order-1">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-base font-semibold sm:text-lg">구역별 모임 보고</h2>
                  <p className="mt-1 text-sm leading-5 text-muted">
                    최근 모임일과 보고 상태를 확인합니다.
                  </p>
                </div>
                <CalendarCheck className="text-primary" size={20} />
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {districtRows.map((row) => (
                  <article
                    className="rounded-lg border border-hairline bg-surface-soft p-4"
                    key={row.name}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{row.name}</h3>
                        <p className="mt-1 text-sm text-muted">리더 {row.leader}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "보고 완료"
                            ? "bg-tint-mint text-success"
                            : "bg-tint-yellow text-warning"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <dt className="text-xs text-muted">인원</dt>
                        <dd className="mt-1 font-medium">{row.members}명</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">최근 모임</dt>
                        <dd className="mt-1 font-medium">{row.lastMeeting}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">출석률</dt>
                        <dd className="mt-1 font-medium">{row.attendance}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-hairline-soft text-left text-muted">
                      <th className="px-5 py-3 font-medium">구역</th>
                      <th className="px-5 py-3 font-medium">리더</th>
                      <th className="px-5 py-3 font-medium">인원</th>
                      <th className="px-5 py-3 font-medium">최근 모임</th>
                      <th className="px-5 py-3 font-medium">출석률</th>
                      <th className="px-5 py-3 font-medium">상태</th>
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
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
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
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-4 py-3 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur lg:hidden">
        <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white">
          <CalendarCheck size={18} />
          모임 기록 입력
        </button>
      </div>
    </main>
  );
}
