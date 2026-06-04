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
import { useState } from "react";

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
  offering: number;
  prayer: string;
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
    offering: 50000,
    prayer: "최지우 성도 건강 회복과 새가족 정착을 위해 기도 요청이 있었습니다.",
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
    offering: 30000,
    prayer: "구역원 가정예배 회복과 자녀들의 신앙생활을 위해 함께 기도했습니다.",
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
    offering: 20000,
    prayer: "장기 결석 성도 연락과 구역 모임 장소 조정을 위해 기도하기로 했습니다.",
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
    offering: 70000,
    prayer: "감사 제목이 많았고 다음 모임에 새가족을 초대하기로 했습니다.",
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
  const [prayerReport, setPrayerReport] = useState<Report | null>(null);

  const selectedCount = selectedIds.length;
  const singleSelectedReport = selectedCount === 1
    ? reports.find((report) => report.id === selectedIds[0])
    : null;

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
        {isSelecting && (
          <div className="rounded-xl border border-hairline bg-canvas p-4">
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

        <section className={`${isSelecting ? "mt-4" : ""} overflow-hidden rounded-xl border border-hairline bg-canvas`}>
          <div className="grid grid-cols-[1fr_72px_86px] border-b border-hairline bg-surface-soft px-3 py-2 text-sm font-semibold text-muted">
            <span>날짜/수정</span>
            <span className="text-center">출결</span>
            <span className="text-right">헌금/기도</span>
          </div>

          <div className="divide-y divide-hairline-soft">
            {reports.map((report) => {
              const selected = selectedIds.includes(report.id);

              return (
                <div
                  className={`grid min-h-16 w-full grid-cols-[1fr_72px_86px] items-center gap-2 px-3 py-3 ${
                    selected ? "bg-tint-sky ring-4 ring-inset ring-primary/20" : "bg-canvas"
                  }`}
                  key={report.id}
                >
                  {isSelecting ? (
                    <button
                      className="min-w-0 text-left"
                      onClick={() => toggleSelection(report.id)}
                    >
                      <span className="block text-base font-semibold leading-6">
                        {formatDate(report.date)}
                      </span>
                    </button>
                  ) : (
                    <Link
                      className="min-w-0 text-left"
                      href="/district-worship-report"
                    >
                      <span className="block text-base font-semibold leading-6">
                        {formatDate(report.date)}
                      </span>
                    </Link>
                  )}

                  <button
                    className="text-center"
                    onClick={() => {
                      if (isSelecting) {
                        toggleSelection(report.id);
                      }
                    }}
                  >
                    <span className="block text-lg font-semibold text-success">
                      {report.present}
                    </span>
                    <span className="text-sm text-error">/{report.absent}</span>
                  </button>

                  <button
                    className="text-right text-base font-semibold"
                    onClick={() => {
                      if (isSelecting) {
                        toggleSelection(report.id);
                        return;
                      }

                      setPrayerReport(report);
                    }}
                  >
                    {report.offering.toLocaleString("ko-KR")}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-4 py-3 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur">
        {isSelecting ? (
          <div className="grid grid-cols-2 gap-3">
            <Link
              className={`inline-flex h-16 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-canvas text-xl font-semibold ${
                singleSelectedReport ? "" : "pointer-events-none opacity-40"
              }`}
              href="/district-worship-report"
            >
              <Edit3 size={24} />
              수정
            </Link>
            <button
              className="inline-flex h-16 items-center justify-center gap-2 rounded-xl bg-error text-xl font-semibold text-white disabled:bg-hairline-strong"
              disabled={!selectedCount}
              onClick={deleteSelectedReports}
            >
              <Trash2 size={24} />
              삭제
            </button>
          </div>
        ) : (
          <Link
            className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-primary text-xl font-semibold text-white"
            href="/district-worship-report"
          >
            <FilePlus2 size={26} />새 보고서 작성
          </Link>
        )}
      </div>

      {prayerReport && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40 px-4 py-4">
          <section className="mx-auto w-full max-w-3xl rounded-2xl bg-canvas p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-primary">기도제목</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight">
                  {formatDate(prayerReport.date)}
                </h2>
                <p className="mt-1 text-lg text-muted">
                  출석 {prayerReport.present}명 · 결석 {prayerReport.absent}명 · 헌금{" "}
                  {prayerReport.offering.toLocaleString("ko-KR")}원
                </p>
              </div>
              <button
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline-strong"
                onClick={() => setPrayerReport(null)}
              >
                <X size={24} />
                <span className="sr-only">닫기</span>
              </button>
            </div>

            <p className="mt-5 rounded-xl bg-surface-soft p-4 text-xl leading-9">
              {prayerReport.prayer}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
