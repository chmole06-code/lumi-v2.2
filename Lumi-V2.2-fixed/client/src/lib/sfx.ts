/**
 * Lumi — SFX (ultra léger)
 * Objectifs: sons doux, non intrusifs, jamais en boucle.
 * Zéro dépendance lourde.
 */

const LS_SETTINGS = "mpa_parent_settings_v2";

type ParentSettings = {
  sounds?: boolean;
};

function isSoundsEnabled(): boolean {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return true;
    const s = JSON.parse(raw) as ParentSettings;
    return s.sounds !== false;
  } catch {
    return true;
  }
}

function safePlay(src: string, volume: number) {
  if (typeof window === "undefined") return;
  if (!isSoundsEnabled()) return;

  // IMPORTANT: Audio must be user-gesture initiated (pointer/click). We only call this from UI events.
  const a = new Audio(src);
  a.preload = "auto";
  a.loop = false;
  a.volume = Math.max(0, Math.min(1, volume));

  // play() peut échouer si le navigateur bloque l’audio — on ignore sans bruit.
  void a.play().catch(() => {});
}

export function playClickSfx() {
  // très léger
  safePlay("/sfx/sparkle_click.wav", 0.18);
}

export function playPositiveSfx() {
  // feedback positif doux
  safePlay("/sfx/lumi_positive.wav", 0.22);
}
