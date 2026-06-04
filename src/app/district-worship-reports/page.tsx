"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  Edit3,
  FilePlus2,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Report = {
  id: number;
  date: string;
  dayKind: "주일" | "평일";
  timePeriod: "오전" | "오후" | "저녁";
  place: string;
  leader: string;
  present: number;
  absent: number;
  status: "저장됨" | "작성중";
};

const initialReports: Report[] = [
  {
    id: 1,
    date: "2026-06-07",
    dayKind: "주일",
    timePeriod: "오후",
    place: "구역원 가정",
    leader: "구역장",
    present: 7,
    absent: 1,
    status: "저장됨",
  },
  {
    id: 2,
    date: "2026-05-31",
    dayKind: "주일",
    timePeriod: "저녁",
    place: "교회",
    leader: "구역장",
    present: 6,
    absent: 2,
    status: "저장됨",
  },
  {
    id: 3,
    date: "2026-05-27",
    dayKind: "평일",
    timePeriod: "오전",
    place: "기타 외부",
    leader: "김민준",
    present: 5,
    absent: 3,
    status: "작성중",
  },
  {
    id: 4,
    date: "2026-05-24",
    dayKind: "주일",
    timePeriod: "오후",
    place: "구역원 가정",
    leader: "구역장",
    present: 8,
    absent: 0,
    status: "저장됨",
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`));
}

export default function DistrictWorshipReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedCount = selectedIds.length;
  const totalAttendance = useMemo(
    () =>
      reports.reduce(
        (total, report) => ({
          present: total.present + report.present,
          absent: total.absent + report.absent,
        }),
        { present: 0, absent: 0 },
      ),
    [reports],
  );

  function toggleSelection(reportId: number) {
    setSelectedIds((current) =>
      current.includes(reportId)
        ? current.filter((id) => id !== reportId)
        : [...current, reportId],
    );
  }

  function toggleSelectMode() {
    setIsSelecting((current) => !current);
    setSelectedIds([]);
  }

  function deleteReport(reportId: number) {
    const canDelete = window.confirm("이 보고서를 삭제하시겠습니까?");
    if (!canDelete) {
      return;
    }

    setReports((current) => current.filter((report) => report.id !== reportId));
    setSelectedIds((current) => current.filter((id) => id !== reportId));
  }

  function deleteSelectedReports() {
    if (!selectedCount) {
      return;
    }

    const canDelete = window.confirm(`${selectedCount}개의 보고서를 삭제하시겠습니까?`);
    if (!canDelete) {
      return;
    }

    setReports((current) => current.filter((report) => !selectedIds.includes(report.id)));
    setSelectedIds([]);
    setIsSelecting(false);
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-lg text-foreground">
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline-strong bg-canvas"
            href="/"
          >
            <ArrowLeft size={24} />
            <span className="sr-only">뒤로</span>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-primary">1구역</p>
            <h1 className="text-2xl font-semibold leading-8">저장된 보고서</h1>
          </div>
          <button
            className={`flex h-12 min-w-20 items-center justify-center gap-2 rounded-xl px-3 text-base font-semibold ${
              isSelecting ? "bg-error text-white" : "border border-hairline-strong bg-canvas"
            }`}
            onClick={toggleSelectMode}
          >
            {isSelecting ? <X size={22} /> : <CheckSquare size={22} />}
            {isSelecting ? "취소" : "선택"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5">
        <div className="rounded-xl border border-hairline bg-canvas p-5">
          <p className="text-lg text-muted">최근 보고서 {reports.length}개</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-tint-mint p-4">
              <p className="text-base text-muted">누적 출석</p>
              <p className="mt-1 text-4xl font-semibold">{totalAttendance.present}</p>
            </div>
            <div className="rounded-xl bg-tint-rose p-4">
              <p className="text-base text-muted">누적 결석</p>
              <p className="mt-1 text-4xl font-semibold">{totalAttendance.absent}</p>
            </div>
          </div>
        </div>

        {isSelecting && (
          <div className="mt-4 rounded-xl border border-hairline bg-canvas p-4">
            <p className="text-xl font-semibold">{selectedCount}개 선택됨</p>
            <button
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-error text-xl font-semibold text-white disabled:bg-hairline-strong"
              disabled={!selectedCount}
              onClick={deleteSelectedReports}
            >
              <Trash2 size={24} />
              선택 삭제
            </button>
          </div>
        )}

        <section className="mt-5 grid gap-4">
          {reports.map((report) => {
            const selected = selectedIds.includes(report.id);
            const total = report.present + report.absent;

            return (
              <article
                className={`rounded-xl border-2 bg-canvas p-4 ${
                  selected ? "border-primary ring-4 ring-primary/20" : "border-hairline"
                }`}
                key={report.id}
              >
                <div className="flex items-start gap-3">
                  {isSelecting && (
                    <button
                      className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-white ${
                        selected ? "border-primary bg-primary" : "border-hairline-strong bg-canvas"
                      }`}
                      onClick={() => toggleSelection(report.id)}
                    >
                      {selected && <CheckSquare size={24} />}
                      <span className="sr-only">선택</span>
                    </button>
                  )}

                  <button
                    className="min-w-0 flex-1 text-left"
                    disabled={!isSelecting}
                    onClick={() => toggleSelection(report.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold leading-8">
                          {formatDate(report.date)}
                        </p>
                        <p className="mt-1 text-lg text-muted">
                          {report.dayKind} {report.timePeriod} · {report.place}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-base font-semibold ${
                          report.status === "저장됨"
                            ? "bg-tint-mint text-success"
                            : "bg-tint-yellow text-warning"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-tint-mint p-3">
                        <p className="text-base text-muted">출석</p>
                        <p className="mt-1 text-3xl font-semibold">{report.present}</p>
                      </div>
                      <div className="rounded-xl bg-tint-rose p-3">
                        <p className="text-base text-muted">결석</p>
                        <p className="mt-1 text-3xl font-semibold">{report.absent}</p>
                      </div>
                      <div className="rounded-xl bg-surface-soft p-3">
                        <p className="text-base text-muted">합계</p>
                        <p className="mt-1 text-3xl font-semibold">{total}</p>
                      </div>
                    </div>
                  </button>
                </div>

                {!isSelecting && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      className="flex h-14 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-canvas text-xl font-semibold"
                      href="/district-worship-report"
                    >
                      <Edit3 size={22} />
                      수정
                    </Link>
                    <button
                      className="flex h-14 items-center justify-center gap-2 rounded-xl bg-error text-xl font-semibold text-white"
                      onClick={() => deleteReport(report.id)}
                    >
                      <Trash2 size={22} />
                      삭제
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-4 py-3 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur">
        <Link
          className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-primary text-xl font-semibold text-white"
          href="/district-worship-report"
        >
          <FilePlus2 size={26} />새 보고서 작성
        </Link>
      </div>
    </main>
  );
}
