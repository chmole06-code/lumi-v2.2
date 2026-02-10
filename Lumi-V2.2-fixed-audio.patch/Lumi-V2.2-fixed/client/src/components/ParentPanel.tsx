import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ParentSettings = {
  pin: string;
  dailyLimitMinutes: number; // 0 = no limit
  calmMode: boolean;
  sounds: boolean;
  soundsVolume: number; // 0..1
  bedtime: string; // HH:MM
  reminders: boolean;
};

type TodayStats = {
  date: string; // YYYY-MM-DD
  routines: Record<string, boolean>;
  minutesUsed: number;
};

const LS_SETTINGS = "mpa_parent_settings_v2";
const LS_TODAY = "mpa_today_stats_v2";
const LS_HISTORY = "mpa_history_v2"; // array of TodayStats (last 30)

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

const defaultSettings: ParentSettings = {
  pin: "1234",
  dailyLimitMinutes: 15,
  calmMode: false,
  sounds: true,
  bedtime: "21:00",
  reminders: false,
};

function buildDefaultToday(): TodayStats {
  return {
    date: todayKey(),
    routines: { brush: false, bath: false, night: false },
    minutesUsed: 0,
  };
}

export default function ParentPanel({
  triggerClassName,
  onUnlock,
  onSettingsChange,
  onResetDay,
  locked,
  today,
}: {
  triggerClassName?: string;
  locked: boolean;
  today: TodayStats;
  onUnlock: () => void;
  onResetDay: () => void;
  onSettingsChange: (s: ParentSettings) => void;
}) {
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState<ParentSettings>(defaultSettings);
  const [pinInput, setPinInput] = useState("");

  // Load settings
  useEffect(() => {
    const s = readJSON<ParentSettings>(LS_SETTINGS, defaultSettings);
    setSettings(s);
    onSettingsChange(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist settings
  useEffect(() => {
    writeJSON(LS_SETTINGS, settings);
    onSettingsChange(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const unlocked = useMemo(() => pinInput.trim() === settings.pin, [pinInput, settings.pin]);

  const header = locked ? "Mode Parent — Déverrouiller" : "Mode Parent";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn("rounded-full px-3", triggerClassName)}>
          👨‍👩‍👧
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] sm:w-[460px]">
        <SheetHeader>
          <SheetTitle>{header}</SheetTitle>
        </SheetHeader>

        {/* Gate */}
        <Card className="mt-4 p-4">
          <div className="text-sm text-muted-foreground">
            Accès parent (calme, sans stress) — code requis pour modifier ou déverrouiller.
          </div>

          <div className="mt-3 flex gap-2">
            <Input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Code parent"
              className="rounded-xl"
              inputMode="numeric"
            />
            <Button
              className="rounded-xl"
              disabled={!unlocked}
              onClick={() => {
                onUnlock();
                setOpen(false);
              }}
            >
              {locked ? "Déverrouiller" : "OK"}
            </Button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Par défaut : {settings.pin}
          </div>
        </Card>

        <Tabs defaultValue="today" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Aujourd’hui</TabsTrigger>
            <TabsTrigger value="plan">Planning</TabsTrigger>
            <TabsTrigger value="controls">Contrôles</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4 space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Rituels</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={!unlocked}
                  onClick={() => {
                    onResetDay();
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Brossage des dents</span>
                  <span>{today.routines.brush ? "✓" : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bain</span>
                  <span>{today.routines.bath ? "✓" : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dodo</span>
                  <span>{today.routines.night ? "✓" : "—"}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Temps</div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span>Temps utilisé aujourd’hui</span>
                <span>{Math.round(today.minutesUsed)} min</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Objectif : une présence courte et sereine.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="mt-4 space-y-3">
            <Card className="p-4">
              <div className="text-sm font-semibold">Heure du dodo</div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between gap-3">
                <Input
                  type="time"
                  value={settings.bedtime}
                  disabled={!unlocked}
                  onChange={(e) => setSettings((p) => ({ ...p, bedtime: e.target.value }))}
                  className="rounded-xl"
                />
                <div className="text-xs text-muted-foreground">Verrouillage automatique</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Rappels</div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="text-sm">Activer les rappels doux</div>
                <Switch
                  checked={settings.reminders}
                  disabled={!unlocked}
                  onCheckedChange={(v) => setSettings((p) => ({ ...p, reminders: v }))}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Recommandé : OFF pendant les tests familles (UX non intrusive).
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="mt-4 space-y-3">
            <Card className="p-4">
              <div className="text-sm font-semibold">Limite quotidienne</div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span>Minutes / jour</span>
                <span>{settings.dailyLimitMinutes === 0 ? "∞" : settings.dailyLimitMinutes}</span>
              </div>
              <div className="mt-3">
                <Slider
                  value={[settings.dailyLimitMinutes]}
                  min={0}
                  max={30}
                  step={5}
                  disabled={!unlocked}
                  onValueChange={(v) => setSettings((p) => ({ ...p, dailyLimitMinutes: v[0] ?? 15 }))}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                0 = pas de limite. Recommandé : 10–15 minutes.
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Ambiance</div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="text-sm">Sons</div>
                <Switch
                  checked={settings.sounds}
                  disabled={!unlocked}
                  onCheckedChange={(v) => setSettings((p) => ({ ...p, sounds: v }))}
                />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Volume sons</span>
                  <span>{Math.round((settings.soundsVolume ?? 1) * 100)}%</span>
                </div>
                <div className="mt-3">
                  <Slider
                    value={[Math.round((settings.soundsVolume ?? 1) * 100)]}
                    min={0}
                    max={100}
                    step={5}
                    disabled={!unlocked || !settings.sounds}
                    onValueChange={(v) =>
                      setSettings((p) => ({ ...p, soundsVolume: Math.max(0, Math.min(1, (v[0] ?? 100) / 100)) }))
                    }
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  0% = muet. Recommandé : 60–80% pour une ambiance douce.
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">Mode calme renforcé</div>
                <Switch
                  checked={settings.calmMode}
                  disabled={!unlocked}
                  onCheckedChange={(v) => setSettings((p) => ({ ...p, calmMode: v }))}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Réduit encore les particules / micro-effets.
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Code parent</div>
              <Separator className="my-3" />
              <Input
                type="password"
                disabled={!unlocked}
                value={settings.pin}
                onChange={(e) => setSettings((p) => ({ ...p, pin: e.target.value }))}
                className="rounded-xl"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Astuce : un code simple mais pas trop évident.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            <HistoryCard />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function HistoryCard() {
  const [items, setItems] = useState<TodayStats[]>([]);

  useEffect(() => {
    const raw = readJSON<TodayStats[]>(LS_HISTORY, []);
    setItems(raw.slice(-30).reverse());
  }, []);

  const insight = useMemo(() => {
    if (items.length < 3) return "Les habitudes se construisent doucement. Continuez sereinement.";
    const brush = items.filter((i) => i.routines.brush).length;
    const bath = items.filter((i) => i.routines.bath).length;
    const night = items.filter((i) => i.routines.night).length;
    const best = [
      { k: "dents", v: brush },
      { k: "bain", v: bath },
      { k: "dodo", v: night },
    ].sort((a, b) => b.v - a.v)[0];
    return `Rituel le plus régulier : ${best.k} (${best.v}/${items.length}).`;
  }, [items]);

  return (
    <Card className="p-4">
      <div className="text-sm font-semibold">Historique (30 jours)</div>
      <Separator className="my-3" />
      <div className="text-xs text-muted-foreground">{insight}</div>

      <div className="mt-3 space-y-2 max-h-[340px] overflow-auto pr-2">
        {items.length === 0 && <div className="text-sm text-muted-foreground">Aucune donnée pour l’instant.</div>}
        {items.map((it) => (
          <div key={it.date} className="flex items-center justify-between text-sm">
            <span className="font-medium">{it.date}</span>
            <span className="text-muted-foreground">
              {it.routines.brush ? "🪥" : "—"} {it.routines.bath ? "🫧" : "—"} {it.routines.night ? "🌙" : "—"} ·{" "}
              {Math.round(it.minutesUsed)}m
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
