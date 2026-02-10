/**
 * Lumi — Audio Engine (minimal, stable, Netlify-safe)
 *
 * But:
 * - Précharger et rejouer des SFX sans latence
 * - Respecter les restrictions autoplay (déverrouillage via geste utilisateur)
 * - Zéro dépendance externe
 *
 * Notes:
 * - On utilise WebAudio (AudioContext) + decodeAudioData pour permettre le play
 *   même après le geste initial (mobile/iOS plus fiable).
 * - Les fichiers audio restent dans /client/public/sfx (servis statiquement).
 */

const LS_SETTINGS = "mpa_parent_settings_v2";

type ParentSettings = {
  sounds?: boolean;        // mute global
  soundsVolume?: number;   // 0..1
};

// SFX manifest: ajoute ici tes nouveaux sons (id -> fichiers + gain)
type SfxId = "click" | "positive";

type SfxDef = {
  sources: string[]; // chemins absolus (depuis /public)
  gain: number;      // multiplicateur 0..1
};

const SFX: Record<SfxId, SfxDef> = {
  click: {
    sources: ["/sfx/sparkle_click.wav"],
    gain: 0.18,
  },
  positive: {
    sources: ["/sfx/lumi_positive.wav"],
    gain: 0.22,
  },
};

let ctx: AudioContext | null = null;
let unlocked = false;
const buffers = new Map<SfxId, AudioBuffer>();

function readSettings(): ParentSettings {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return { sounds: true, soundsVolume: 1 };
    const s = JSON.parse(raw) as ParentSettings;
    return {
      sounds: s.sounds !== false,
      soundsVolume: typeof s.soundsVolume === "number" ? s.soundsVolume : 1,
    };
  } catch {
    return { sounds: true, soundsVolume: 1 };
  }
}

function pickPlayableSource(sources: string[]): string | null {
  // WebAudio fetch+decode ne nécessite pas canPlayType,
  // mais on garde un point d’extension si tu ajoutes .ogg/.mp3.
  return sources[0] ?? null;
}

async function ensureContext(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

async function decodeToBuffer(id: SfxId): Promise<void> {
  if (buffers.has(id)) return;
  const c = await ensureContext();
  if (!c) return;

  const src = pickPlayableSource(SFX[id].sources);
  if (!src) return;

  try {
    const res = await fetch(src, { cache: "force-cache" });
    if (!res.ok) return;
    const data = await res.arrayBuffer();
    const buf = await c.decodeAudioData(data.slice(0));
    buffers.set(id, buf);
  } catch {
    // ignore
  }
}

async function preloadAll(): Promise<void> {
  await Promise.all((Object.keys(SFX) as SfxId[]).map((id) => decodeToBuffer(id)));
}

/**
 * À appeler UNIQUEMENT depuis un geste utilisateur (pointerdown/click).
 * Déverrouille l’audio et précharge les buffers.
 */
export async function initAudioFromUserGesture(): Promise<void> {
  const s = readSettings();
  if (s.sounds === false) return;

  const c = await ensureContext();
  if (!c) return;

  try {
    if (c.state === "suspended") {
      await c.resume();
    }
    unlocked = true;
  } catch {
    // ignore
  }

  // Précharge léger (ne casse rien si ça échoue)
  void preloadAll();
}

export async function playSfx(id: SfxId): Promise<void> {
  if (typeof window === "undefined") return;

  const s = readSettings();
  if (s.sounds === false) return;

  const c = await ensureContext();
  if (!c) return;

  // Si pas encore unlock, on tente un resume "optimiste" (ça peut échouer sans geste)
  if (!unlocked) {
    try {
      if (c.state === "suspended") await c.resume();
      unlocked = c.state === "running";
    } catch {
      // ignore
    }
  }

  // Sans unlock, on n’insiste pas (pas d’erreur visible).
  if (!unlocked) return;

  // Lazy decode
  if (!buffers.has(id)) {
    await decodeToBuffer(id);
  }
  const buf = buffers.get(id);
  if (!buf) return;

  try {
    const src = c.createBufferSource();
    src.buffer = buf;

    const g = c.createGain();
    const baseVolume = Math.max(0, Math.min(1, typeof s.soundsVolume === "number" ? s.soundsVolume : 1));
    const finalGain = Math.max(0, Math.min(1, baseVolume * SFX[id].gain));

    g.gain.value = finalGain;
    src.connect(g);
    g.connect(c.destination);

    src.start(0);
  } catch {
    // ignore
  }
}
