/**
 * Mon Petit Allié — Jeu (V3.0)
 *
 * Objectifs verrouillés :
 * - UX calme, rassurante, non addictive
 * - Lumi au centre, jamais un gadget
 * - Poses fixes (assets) + micro-animations moteur uniquement
 * - Dashboard parent utile (LocalStorage)
 *
 * Mise à jour V3 :
 * - Ajout rituels Manger + Pyjama
 * - Ordre métier : Bain → Manger → Dents → Pyjama → Dodo
 * - Audio métier : FX poussière + voix rituel (une fois au start)
 */

import React, { useEffect, useRef, useState } from "react";
import Lumi, { LumiState } from "@/components/Lumi";
import RoutineButton from "@/components/RoutineButton";
import HealthBar from "@/components/HealthBar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAudio } from "@/audio/useAudio"; 

type Routine = "bath" | "eat" | "teeth" | "pyjama" | "sleep";

type TodayStats = {
  date: string; // YYYY-MM-DD
  routines: Record<Routine, boolean>;
  minutesUsed: number;
};

// Durées (ms) : routines calmes et stables
const DURATION_MS: Record<Routine, number> = {
  bath: 15000,
  eat: 15000,
  teeth: 15000,
  pyjama: 15000,
  sleep: 15000,
};

interface GameState {
  health: number; // 0-100 (douce, pas punitive)
  lumi: LumiState;
  busy: boolean;
  locked: boolean;
  routineActive: Routine | null;
  routineProgress: number; // 0-100
  lockOverrideUntil?: number; // timestamp ms
}

/**
 * ⚠️ V3 : on bump les clés pour éviter conflit shape (v2 n’a pas eat/pyjama)
 */
const LS_TODAY = "mpa_today_stats_v3";
const LS_HISTORY = "mpa_history_v3";
const LS_LUMI_SLEEP = "mpa_lumi_sleep_v3";

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

type SleepState = { sleeping: boolean; since: number };

function readSleep(): SleepState {
  return readJSON<SleepState>(LS_LUMI_SLEEP, { sleeping: false, since: 0 });
}
function writeSleep(s: SleepState) {
  writeJSON(LS_LUMI_SLEEP, s);
}

function defaultToday(): TodayStats {
  return {
    date: todayKey(),
    routines: { bath: false, eat: false, teeth: false, pyjama: false, sleep: false },
    minutesUsed: 0,
  };
}

/** ✅ Réglage âge (ultra léger)
 * Mets "2-3" ou "4-6"
 */
const AGE_GROUP: "2-3" | "4-6" = "4-6";

const COPY = {
  "2-3": {
    buttons: {
      bath: "Bain",
      eat: "Manger",
      teeth: "Dents",
      pyjama: "Pyjama",
      sleep: "Dodo",
    },
    hint: {
      bath: "Allez, bain !",
      eat: "Miam miam !",
      teeth: "Allez, dents !",
      pyjama: "Pyjama tout doux.",
      sleep: "C’est dodo.",
      idle: "Choisis.",
    },
  },
  "4-6": {
    buttons: {
      bath: "Bain",
      eat: "Manger",
      teeth: "Dents",
      pyjama: "Pyjama",
      sleep: "Dodo",
    },
    hint: {
      bath: "C’est l’heure du bain.",
      eat: "C’est l’heure de manger.",
      teeth: "Allez, on va se brosser les dents.",
      pyjama: "On met le pyjama tout doux.",
      sleep: "C’est l’heure du dodo.",
      idle: "Choisis un petit rituel.",
    },
  },
} as const;

export default function Game() {
  const audio = useAudio();

  const [today, setToday] = useState<TodayStats>(() => defaultToday());

  const [state, setState] = useState<GameState>({
    health: 78,
    lumi: "idle",
    busy: false,
    locked: false,
    routineActive: null,
    routineProgress: 0,
  });

  // Track time in-app (minutesUsed) — doux, pour le parent
  const sessionStartRef = useRef<number>(Date.now());
  const minutesTickRef = useRef<number>(0);

  // Load today on mount
  useEffect(() => {
    const t = readJSON<TodayStats>(LS_TODAY, defaultToday());
    if (t.date !== todayKey()) {
      const hist = readJSON<TodayStats[]>(LS_HISTORY, []);
      if (t.date) hist.push(t);
      writeJSON(LS_HISTORY, hist.slice(-30));
      const fresh = defaultToday();
      writeJSON(LS_TODAY, fresh);
      setToday(fresh);
    } else {
      setToday(t);
    }

    const ss = readSleep();
    if (ss.sleeping) {
      setState((p) => ({ ...p, lumi: "night", busy: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist today whenever it changes
  useEffect(() => {
    writeJSON(LS_TODAY, today);
  }, [today]);

  // Health gently decays (non punitive)
  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const nextHealth = Math.max(0, p.health - 0.5);
        return { ...p, health: nextHealth };
      });
    }, 45000);
    return () => clearInterval(id);
  }, []);

  // Screen time ticker
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const elapsedMin = (now - sessionStartRef.current) / 60000;
      if (elapsedMin - minutesTickRef.current >= 0.25) {
        const add = elapsedMin - minutesTickRef.current;
        minutesTickRef.current = elapsedMin;
        setToday((p) => ({ ...p, minutesUsed: Math.max(0, p.minutesUsed + add) }));
      }
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const startRoutine = async (routine: Routine) => {
    if (state.locked || state.busy) return;
    if (readSleep().sleeping) return;

    // ✅ Lumi pose/état : on utilise les states existants + assertions si nécessaire
    // (selon tes assets, "dinner" et "pyjama" existent généralement)
    const routineLumi: Record<Routine, LumiState> = {
      bath: "bath",
      eat: "eat" as LumiState,
      teeth: "brush" as LumiState,
      pyjama: "pyjama" as LumiState,
      sleep: "night" as LumiState,
    };

    // ✅ Audio métier : FX poussière + voix du rituel (une fois au démarrage)
    // - unlock se fait déjà silencieusement au niveau App.tsx sur la première interaction
    // - ici c’est strictement "moment métier"
    try {
      await audio.playFx("fairyDust");
      if (routine === "bath") await audio.playRitual("bath");
      if (routine === "eat") await audio.playRitual("eat");
      if (routine === "teeth") await audio.playRitual("teeth");
      if (routine === "pyjama") await audio.playRitual("pyjama");
      if (routine === "sleep") await audio.playRitual("sleep");
    } catch {
      // silence volontaire : pas de bruit d’erreur en UX enfant
    }

    setState((p) => ({
      ...p,
      busy: true,
      routineActive: routine,
      routineProgress: 0,
      lumi: routineLumi[routine],
    }));

    const durationMs = DURATION_MS[routine] ?? 15000;
    const start = Date.now();

    const tick = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / durationMs) * 100);
      setState((p) => ({ ...p, routineProgress: pct }));

      if (pct >= 100) {
        window.clearInterval(tick);

        if (routine === "sleep") {
          writeSleep({ sleeping: true, since: Date.now() });
        }

        setToday((p) => ({ ...p, routines: { ...p.routines, [routine]: true } }));

        setState((p) => {
          const healed = Math.min(100, p.health + 10);

          // Retour à idle après routines non-sommeil
          const shouldReturnIdle = routine !== "sleep";
          const nextLumi: LumiState = shouldReturnIdle ? "idle" : ("night" as LumiState);

          return {
            ...p,
            health: healed,
            busy: false,
            routineActive: null,
            routineProgress: 0,
            lumi: nextLumi,
          };
        });
      }
    }, 250);
  };

  const wakeUp = () => {
    writeSleep({ sleeping: false, since: 0 });
    setState((p) => ({
      ...p,
      lumi: "idle",
      busy: false,
      routineActive: null,
      routineProgress: 0,
    }));
  };

  const calmBg = false;

  const pageBg = (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(120,120,255,0.22),transparent_55%),radial-gradient(circle_at_85%_35%,rgba(255,120,200,0.14),transparent_55%),radial-gradient(circle_at_45%_90%,rgba(80,255,220,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-fuchsia-950/60" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.58))]" />
    </div>
  );

  const particles = !calmBg ? (
    <div className="fixed inset-0 pointer-events-none opacity-50">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/60 blur-[0.6px]"
          style={{
            left: `${(i * 97) % 100}%`,
            top: `${(i * 41) % 100}%`,
            animation: `floatSoft ${7 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${(i % 4) * 0.4}s`,
          }}
        />
      ))}
    </div>
  ) : null;

  // ✅ textes selon âge
  const copy = COPY[AGE_GROUP];
  const BTN = copy.buttons;

  const routineHint = state.routineActive
    ? state.routineActive === "bath"
      ? copy.hint.bath
      : state.routineActive === "eat"
        ? copy.hint.eat
        : state.routineActive === "teeth"
          ? copy.hint.teeth
          : state.routineActive === "pyjama"
            ? copy.hint.pyjama
            : copy.hint.sleep
    : copy.hint.idle;

  return (
    <div className="min-h-screen overflow-hidden bg-[#070A12]">
      {pageBg}
      {particles}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl md:text-3xl font-extrabold text-white">Mon Petit Allié</div>
            <div className="hidden md:block text-sm text-white/60">calme · doux · premium</div>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6 items-center">
            {/* Lumi stage */}
            <div>
              <Card className="rounded-3xl border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-7">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Lumi</div>
                  <div className="text-xs text-white/60">
                    {today.routines.bath ? "🫧" : "—"} {today.routines.eat ? "🍽️" : "—"}{" "}
                    {today.routines.teeth ? "🪥" : "—"} {today.routines.pyjama ? "🧸" : "—"}{" "}
                    {today.routines.sleep ? "🌙" : "—"}
                  </div>
                </div>

                <div
                  className="mt-4 flex justify-center"
                  onPointerDown={() => {
                    const ss = readSleep();
                    if (ss.sleeping && !state.busy) wakeUp();
                  }}
                >
                  <Lumi state={state.lumi} size="lg" pulse={state.busy} />
                </div>

                <div className="mt-4 text-center text-sm text-white/70">{routineHint}</div>

                {state.busy && (
                  <div className="mt-4">
                    <Progress value={state.routineProgress} />
                  </div>
                )}
              </Card>
            </div>

            {/* Actions + health */}
            <div className="space-y-4">
              <Card className="rounded-3xl border-white/10 bg-white/5 backdrop-blur-md p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Énergie de Lumi</div>
                  <div className="text-xs text-white/60">douce, jamais punitive</div>
                </div>
                <div className="mt-3">
                  <HealthBar health={state.health} />
                </div>
              </Card>

              <Card className="rounded-3xl border-white/10 bg-white/5 backdrop-blur-md p-5">
                <div className="text-sm font-semibold text-white/85">Rituels</div>

                {/* ✅ Ordre métier verrouillé : Bain → Manger → Dents → Pyjama → Dodo */}
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <RoutineButton
                    icon="🫧"
                    title={BTN.bath}
                    description={BTN.bath}
                    onClick={() => void startRoutine("bath")}
                    disabled={state.busy}
                  />
                  <RoutineButton
                    icon="🍽️"
                    title={BTN.eat}
                    description={BTN.eat}
                    onClick={() => void startRoutine("eat")}
                    disabled={state.busy}
                  />
                  <RoutineButton
                    icon="🪥"
                    title={BTN.teeth}
                    description={BTN.teeth}
                    onClick={() => void startRoutine("teeth")}
                    disabled={state.busy}
                  />
                  <RoutineButton
                    icon="🧸"
                    title={BTN.pyjama}
                    description={BTN.pyjama}
                    onClick={() => void startRoutine("pyjama")}
                    disabled={state.busy}
                  />
                  <RoutineButton
                    icon="🌙"
                    title={BTN.sleep}
                    description={BTN.sleep}
                    onClick={() => void startRoutine("sleep")}
                    disabled={state.busy}
                  />
                </div>

                <div className="mt-4 text-xs text-white/60 flex items-center justify-between">
                  <span>Temps aujourd’hui</span>
                  <span className="text-white/75">{Math.round(today.minutesUsed)} min</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-6 text-center text-xs text-white/45">
          Prototype familles — UX calme, sans collecte intrusive.
        </div>
      </div>

      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); opacity: .5; }
          50% { transform: translateY(-14px); opacity: .72; }
        }
      `}</style>
    </div>
  );
}
