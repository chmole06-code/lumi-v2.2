import type { SoundDef, SoundId } from "./sounds";

type EngineState = {
  muted: boolean;
  volume: number; // 0..1
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private buffers = new Map<SoundId, AudioBuffer>();
  private htmlAudio = new Map<SoundId, HTMLAudioElement>();

  private defs: Record<SoundId, SoundDef>;
  private state: EngineState;

  constructor(defs: Record<SoundId, SoundDef>, initial: EngineState) {
    this.defs = defs;
    this.state = { muted: initial.muted, volume: clamp01(initial.volume) };
  }

  /** Crée le contexte + resume (mobile-safe). Silencieux. */
  async unlock(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state !== "running") {
        try {
          await this.ctx.resume();
        } catch {
          // ignore
        }
      }
      return;
    }

    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!Ctx) return;

    try {
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.state.muted ? 0 : this.state.volume;
      this.masterGain.connect(this.ctx.destination);

      if (this.ctx.state !== "running") {
        try {
          await this.ctx.resume();
        } catch {
          // ignore
        }
      }
    } catch {
      this.ctx = null;
      this.masterGain = null;
    }
  }

  setMuted(muted: boolean) {
    this.state.muted = muted;
    this.applyMaster();
  }

  setVolume(volume: number) {
    this.state.volume = clamp01(volume);
    this.applyMaster();
  }

  getMuted() {
    return this.state.muted;
  }
  getVolume() {
    return this.state.volume;
  }

  private applyMaster() {
    if (this.masterGain) {
      this.masterGain.gain.value = this.state.muted ? 0 : this.state.volume;
    }
    for (const el of this.htmlAudio.values()) {
      el.muted = this.state.muted;
      el.volume = this.state.volume;
    }
  }

  async preloadAll(preloadOnly = true): Promise<void> {
    const entries = Object.values(this.defs).filter((d) => !preloadOnly || d.preload);
    await Promise.all(entries.map((d) => this.preload(d.id)));
  }

  async preload(id: SoundId): Promise<void> {
    await this.unlock();
    const def = this.defs[id];
    if (!def) return;

    if (this.ctx && this.masterGain) {
      if (this.buffers.has(id)) return;
      try {
        const res = await fetch(def.src, { cache: "force-cache" });
        const arr = await res.arrayBuffer();
        const buf = await this.ctx.decodeAudioData(arr.slice(0));
        this.buffers.set(id, buf);
        return;
      } catch {
        // fallback HTMLAudio
      }
    }

    if (this.htmlAudio.has(id)) return;
    const el = new Audio(def.src);
    el.preload = "auto";
    el.muted = this.state.muted;
    el.volume = this.state.volume;
    this.htmlAudio.set(id, el);
  }

  async play(id: SoundId, opts?: { volume?: number }): Promise<void> {
    const def = this.defs[id];
    if (!def) return;

    if (this.state.muted || this.state.volume <= 0) return;

    await this.preload(id);

    const gainMultiplier = clamp01(opts?.volume ?? def.defaultVolume);

    if (this.ctx && this.masterGain) {
      const buf = this.buffers.get(id);
      if (!buf) return;

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const g = this.ctx.createGain();
      g.gain.value = gainMultiplier;

      src.connect(g);
      g.connect(this.masterGain);

      try {
        src.start(0);
      } catch {
        // ignore
      }
      return;
    }

    const el = this.htmlAudio.get(id);
    if (!el) return;

    try {
      el.currentTime = 0;
      el.volume = clamp01(this.state.volume * gainMultiplier);
      await el.play();
    } catch {
      // ignore autoplay blocks
    }
  }
}
