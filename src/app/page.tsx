import {
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Search,
  UserPlus,
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
        <aside className="border-b border-hairline bg-canvas px-5 py-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
              초
            </div>
            <div>
              <p className="text-sm font-semibold">초대교회</p>
              <p className="text-xs text-muted">소그룹 관리</p>
            </div>
          </div>

          <nav className="mt-8 grid gap-1 text-sm font-medium">
            {["대시보드", "성도", "구역", "사역팀", "소그룹 모임", "리더 관리"].map(
              (item) => (
                <a
                  className={`rounded-md px-3 py-2 ${
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

        <section className="px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-4 border-b border-hairline pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">관리자 대시보드</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
                이번 주 소그룹 현황
              </h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-hairline-strong bg-canvas px-4 text-sm font-medium">
                <Search size={16} />
                성도 검색
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white">
                <UserPlus size={16} />
                성도 등록
              </button>
            </div>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <section
                  className="rounded-lg border border-hairline bg-canvas p-5"
                  key={card.label}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${card.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-sm text-muted">{card.label}</p>
                  <p className="mt-1 text-3xl font-semibold">{card.value}</p>
                  <p className="mt-2 text-sm text-muted">{card.note}</p>
                </section>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="rounded-lg border border-hairline bg-canvas">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold">구역별 모임 보고</h2>
                  <p className="mt-1 text-sm text-muted">
                    최근 모임일과 보고 상태를 확인합니다.
                  </p>
                </div>
                <CalendarCheck className="text-primary" size={20} />
              </div>

              <div className="overflow-x-auto">
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

            <aside className="rounded-lg border border-hairline bg-canvas p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">확인 필요</h2>
                <CircleAlert className="text-warning" size={20} />
              </div>
              <div className="mt-4 grid gap-3">
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
          </div>
        </section>
      </div>
    </main>
  );
}
