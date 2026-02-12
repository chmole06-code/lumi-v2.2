export type RitualId = "bath" | "eat" | "teeth" | "pyjama" | "sleep" | "welcome";
export type FxId = "fairyDust";

export type SoundId = `ritual.${RitualId}` | `fx.${FxId}`;

export type SoundDef = {
  id: SoundId;
  src: string;
  defaultVolume: number;
  preload: boolean;
};

export const SOUNDS: Record<SoundId, SoundDef> = {
  "ritual.bath":   { id: "ritual.bath",   src: "/audio/lumi/ritual_bath.mp3",   defaultVolume: 1.0, preload: true },
  "ritual.eat":    { id: "ritual.eat",    src: "/audio/lumi/ritual_eat.mp3",    defaultVolume: 1.0, preload: true },
  "ritual.teeth":  { id: "ritual.teeth",  src: "/audio/lumi/ritual_teeth.mp3",  defaultVolume: 1.0, preload: true },
  "ritual.pyjama": { id: "ritual.pyjama", src: "/audio/lumi/ritual_pyjama.mp3", defaultVolume: 1.0, preload: true },
  "ritual.sleep":  { id: "ritual.sleep",  src: "/audio/lumi/ritual_sleep.mp3",  defaultVolume: 1.0, preload: true },
  "ritual.welcome": { id: "ritual.welcome", src: "/audio/lumi/lumi_coucou.mp3", defaultVolume: 1.0, preload: true },
  "fx.fairyDust":  { id: "fx.fairyDust",  src: "/audio/lumi/poussiere-fee.mp3", defaultVolume: 0.9, preload: true },
};
