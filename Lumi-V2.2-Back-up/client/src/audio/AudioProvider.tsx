import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioEngine } from "./audioEngine";
import { SOUNDS, type RitualId, type SoundId } from "./sounds";

type AudioAPI = {
  unlock: () => Promise<void>;
  preload: () => Promise<void>;
  playRitual: (ritual: RitualId) => Promise<void>;
  playFx: (fx: "fairyDust") => Promise<void>;
  muted: boolean;
  volume: number;
  setMuted: (v: boolean) => void;
  setVolume: (v: number) => void;
};

export const AudioContext = createContext<AudioAPI | null>(null);

const LS_MUTED = "lumi.audio.muted";
const LS_VOLUME = "lumi.audio.volume";

function readBool(key: string, fallback: boolean) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "1";
}
function readNum(key: string, fallback: number) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1);

  const engineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    try {
      setMutedState(readBool(LS_MUTED, false));
      setVolumeState(readNum(LS_VOLUME, 1));
    } catch {}
  }, []);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new AudioEngine(SOUNDS as Record<SoundId, any>, { muted, volume });
    } else {
      engineRef.current.setMuted(muted);
      engineRef.current.setVolume(volume);
    }
    try {
      localStorage.setItem(LS_MUTED, muted ? "1" : "0");
      localStorage.setItem(LS_VOLUME, String(volume));
    } catch {}
  }, [muted, volume]);

  const unlock = useCallback(async () => {
    await engineRef.current?.unlock();
  }, []);

  const preload = useCallback(async () => {
    await engineRef.current?.preloadAll(true);
  }, []);

  const playRitual = useCallback(async (ritual: RitualId) => {
    const id = `ritual.${ritual}` as SoundId;
    await engineRef.current?.play(id);
  }, []);

  const playFx = useCallback(async (fx: "fairyDust") => {
    const id = `fx.${fx}` as SoundId;
    await engineRef.current?.play(id);
  }, []);

  const api = useMemo<AudioAPI>(
    () => ({
      unlock,
      preload,
      playRitual,
      playFx,
      muted,
      volume,
      setMuted: setMutedState,
      setVolume: setVolumeState,
    }),
    [unlock, preload, playRitual, playFx, muted, volume]
  );

  useEffect(() => {
    void preload();
  }, [preload]);

  return <AudioContext.Provider value={api}>{children}</AudioContext.Provider>;
}
