"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Mic,
  MicOff,
  Save,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type RiskLevel = "green" | "yellow" | "orange" | "red";

type Member = {
  id: number;
  name: string;
  statusLabel: string;
  risk: RiskLevel;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onaudiostart: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<{
          0: { transcript: string };
          isFinal: boolean;
        }>;
      }) => void)
    | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const members: Member[] = [
  { id: 1, name: "김민준", statusLabel: "잘 참석", risk: "green" },
  { id: 2, name: "박서연", statusLabel: "잘 참석", risk: "green" },
  { id: 3, name: "이하준", statusLabel: "단기결석", risk: "yellow" },
  { id: 4, name: "최지우", statusLabel: "2회 결석", risk: "orange" },
  { id: 5, name: "정하윤", statusLabel: "3회 이상", risk: "red" },
  { id: 6, name: "강도윤", statusLabel: "잘 참석", risk: "green" },
  { id: 7, name: "윤서준", statusLabel: "사유 없음", risk: "orange" },
  { id: 8, name: "임지아", statusLabel: "잘 참석", risk: "green" },
];

const riskStyle: Record<RiskLevel, string> = {
  green: "border-success bg-tint-mint text-foreground",
  yellow: "border-warning bg-tint-yellow text-foreground",
  orange: "border-[#D97706] bg-[#FFE8D4] text-foreground",
  red: "border-error bg-tint-rose text-foreground",
};

const defaultAttendance = (risk: RiskLevel) => risk !== "red";

const quickAmounts = [10000, 20000, 30000, 50000];

export default function DistrictWorshipReportPage() {
  const [attendance, setAttendance] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(members.map((member) => [member.id, defaultAttendance(member.risk)])),
  );
  const [absenceNotice, setAbsenceNotice] = useState<Record<number, boolean | null>>(() =>
    Object.fromEntries(
      members.map((member) => [member.id, defaultAttendance(member.risk) ? null : false]),
    ),
  );
  const [pendingAbsentMember, setPendingAbsentMember] = useState<Member | null>(null);
  const [offering, setOffering] = useState(0);
  const [prayer, setPrayer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("버튼을 누르고 기도제목을 말씀하세요.");
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const counts = useMemo(() => {
    const present = Object.values(attendance).filter(Boolean).length;
    return {
      present,
      absent: members.length - present,
    };
  }, [attendance]);

  function toggleAttendance(memberId: number) {
    if (attendance[memberId]) {
      const member = members.find((item) => item.id === memberId);
      if (member) {
        setPendingAbsentMember(member);
      }
      return;
    }

    setAttendance((current) => ({ ...current, [memberId]: true }));
    setAbsenceNotice((current) => ({ ...current, [memberId]: null }));
  }

  function confirmAbsence(hasNotice: boolean) {
    if (!pendingAbsentMember) {
      return;
    }

    setAttendance((current) => ({
      ...current,
      [pendingAbsentMember.id]: false,
    }));
    setAbsenceNotice((current) => ({
      ...current,
      [pendingAbsentMember.id]: hasNotice,
    }));
    setPendingAbsentMember(null);
  }

  function addOffering(amount: number) {
    setOffering((current) => current + amount);
  }

  function startVoiceInput() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    setVoiceError("");

    if (!Recognition) {
      setVoiceMessage("이 브라우저는 음성 입력을 지원하지 않습니다.");
      setVoiceError("Chrome 또는 Safari에서 다시 시도해 주세요.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onaudiostart = () => {
      setVoiceMessage("마이크가 켜졌습니다. 천천히 말씀하세요.");
      setVoiceError("");
    };
    recognition.onerror = (event) => {
      const messageByError: Record<string, string> = {
        "not-allowed": "마이크 권한이 거부되었습니다. 브라우저 주소창의 마이크 권한을 허용해 주세요.",
        "no-speech": "음성이 감지되지 않았습니다. 버튼을 다시 누르고 조금 더 크게 말씀해 주세요.",
        network: "음성 인식 네트워크 연결에 문제가 있습니다.",
        "audio-capture": "마이크를 찾을 수 없습니다.",
      };

      setVoiceError(messageByError[event.error] ?? `음성 입력 오류: ${event.error}`);
      setVoiceMessage("음성 입력을 다시 시도해 주세요.");
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }

      const nextPrayer = transcript.trim();
      setPrayer(nextPrayer);
      setVoiceMessage(
        nextPrayer ? "음성을 글자로 바꾸고 있습니다." : "듣고 있습니다. 계속 말씀하세요.",
      );
      setVoiceError("");
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceMessage((current) =>
        prayer ? "필요하면 다시 눌러 추가로 말씀하세요." : current,
      );
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    setVoiceMessage("마이크 권한을 확인하고 있습니다.");

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError("음성 입력을 시작하지 못했습니다. 잠시 후 다시 눌러 주세요.");
    }
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    setIsListening(false);
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
          <div className="min-w-0">
            <p className="text-base font-semibold text-primary">1구역</p>
            <h1 className="text-2xl font-semibold leading-8">구역예배 보고서</h1>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5">
        <div className="rounded-xl border border-hairline bg-canvas p-5">
          <p className="text-lg text-muted">2026년 6월 첫째 주</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-tint-mint p-4">
              <p className="text-base text-muted">출석</p>
              <p className="mt-1 text-4xl font-semibold">{counts.present}</p>
            </div>
            <div className="rounded-xl bg-tint-rose p-4">
              <p className="text-base text-muted">결석</p>
              <p className="mt-1 text-4xl font-semibold">{counts.absent}</p>
            </div>
          </div>
        </div>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5">
          <div className="flex items-center gap-3">
            <Users className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">구역원 출결</h2>
              <p className="mt-1 text-base leading-6 text-muted">
                이름 버튼을 누르면 출석과 결석이 바뀝니다.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {members.map((member) => {
              const isPresent = attendance[member.id];
              const notice = absenceNotice[member.id];

              return (
                <button
                  className={`min-h-20 rounded-xl border-2 p-4 text-left ${riskStyle[member.risk]} ${
                    isPresent ? "" : "ring-4 ring-error/30"
                  }`}
                  key={member.id}
                  onClick={() => toggleAttendance(member.id)}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-2xl font-semibold">{member.name}</span>
                      <span className="mt-1 block text-base opacity-80">
                        {member.statusLabel}
                      </span>
                    </span>
                    <span
                      className={`inline-flex min-w-24 items-center justify-center gap-2 rounded-xl px-3 py-2 text-lg font-semibold ${
                        isPresent ? "bg-white/80 text-success" : "bg-error text-white"
                      }`}
                    >
                      {isPresent ? <Check size={22} /> : <X size={22} />}
                      {isPresent ? "출석" : "결석"}
                    </span>
                  </span>
                  {!isPresent && (
                    <span className="mt-3 block rounded-xl bg-white/75 px-3 py-2 text-lg font-semibold">
                      {notice ? "사전 고지 결석" : "고지 없음"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">구역헌금 보고</h2>
              <p className="mt-1 text-base text-muted">금액 버튼을 누르거나 직접 입력합니다.</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-hairline bg-surface-soft p-4">
            <p className="text-base text-muted">보고 금액</p>
            <p className="mt-1 text-4xl font-semibold">
              {offering.toLocaleString("ko-KR")}원
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickAmounts.map((amount) => (
              <button
                className="h-16 rounded-xl border border-hairline-strong bg-canvas text-xl font-semibold"
                key={amount}
                onClick={() => addOffering(amount)}
              >
                +{amount.toLocaleString("ko-KR")}원
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="text-base font-semibold text-muted">직접 입력</span>
            <input
              className="mt-2 h-16 w-full rounded-xl border border-hairline-strong bg-canvas px-4 text-2xl font-semibold outline-none focus:border-primary"
              inputMode="numeric"
              onChange={(event) => setOffering(Number(event.target.value.replace(/\D/g, "")))}
              placeholder="금액"
              type="text"
              value={offering ? offering.toLocaleString("ko-KR") : ""}
            />
          </label>
        </section>

        <section className="mt-5 rounded-xl border border-hairline bg-canvas p-5">
          <div className="flex items-center gap-3">
            <Mic className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-semibold">기도 제목</h2>
              <p className="mt-1 text-base text-muted">긴 내용은 음성으로 남깁니다.</p>
            </div>
          </div>

          <button
            className={`mt-5 flex min-h-24 w-full items-center justify-center gap-3 rounded-xl text-2xl font-semibold ${
              isListening ? "bg-error text-white" : "bg-primary text-white"
            }`}
            onClick={isListening ? stopVoiceInput : startVoiceInput}
          >
            {isListening ? <MicOff size={30} /> : <Mic size={30} />}
            {isListening ? "음성 입력 중지" : "기도 제목 말하기"}
          </button>

          <p className="mt-3 rounded-xl bg-surface-soft p-4 text-lg leading-7 text-muted">
            {voiceMessage}
          </p>
          {voiceError && (
            <p className="mt-3 rounded-xl bg-tint-rose p-4 text-lg font-semibold leading-7 text-error">
              {voiceError}
            </p>
          )}

          <textarea
            className="mt-4 min-h-40 w-full rounded-xl border border-hairline-strong bg-canvas p-4 text-xl leading-8 outline-none focus:border-primary"
            onChange={(event) => setPrayer(event.target.value)}
            placeholder="음성 입력 결과가 여기에 표시됩니다."
            value={prayer}
          />
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-canvas/95 px-4 py-3 shadow-[0_-8px_24px_rgba(23,23,23,0.06)] backdrop-blur">
        <button className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-primary text-xl font-semibold text-white">
          <Save size={26} />
          보고서 저장
        </button>
      </div>

      {pendingAbsentMember && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40 px-4 py-4">
          <section className="mx-auto w-full max-w-3xl rounded-2xl bg-canvas p-5 shadow-2xl">
            <p className="text-base font-semibold text-primary">결석 확인</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight">
              {pendingAbsentMember.name} 성도는 사전 고지된 결석인가요?
            </h2>
            <p className="mt-3 text-lg leading-8 text-muted">
              결석 사유를 미리 들었다면 고지 결석으로 표시합니다.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                className="min-h-16 rounded-xl bg-primary px-4 text-xl font-semibold text-white"
                onClick={() => confirmAbsence(true)}
              >
                예, 미리 알려줬습니다
              </button>
              <button
                className="min-h-16 rounded-xl bg-error px-4 text-xl font-semibold text-white"
                onClick={() => confirmAbsence(false)}
              >
                아니요, 고지 없이 결석입니다
              </button>
              <button
                className="min-h-14 rounded-xl border border-hairline-strong bg-canvas px-4 text-xl font-semibold"
                onClick={() => setPendingAbsentMember(null)}
              >
                취소
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
