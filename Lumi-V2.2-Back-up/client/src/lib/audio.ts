let audioCtx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();

let unlocked = false;
let muted = false;
let volume = 1;

export function initAudioFromUserGesture() {
  if (unlocked) return;

  audioCtx = new AudioContext();
  audioCtx.resume();
  unlocked = true;
}

export function setMuted(v: boolean) {
  muted = v;
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
}

async function loadBuffer(src: string) {
  if (!audioCtx) return;
  if (buffers.has(src)) return;

  const res = await fetch(src);
  const arr = await res.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(arr);
  buffers.set(src, buffer);
}

export async function playAudio(src: string) {
  if (!audioCtx || muted) return;

  await loadBuffer(src);
  const buffer = buffers.get(src);
  if (!buffer) return;

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  gain.gain.value = volume;

  source.buffer = buffer;
  source.connect(gain).connect(audioCtx.destination);
  source.start();
}
