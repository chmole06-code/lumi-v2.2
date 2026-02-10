/**
 * Lumi — SFX (API stable)
 *
 * Objectif: garder une API simple (playClickSfx / playPositiveSfx)
 * tout en basculant sur WebAudio pour:
 * - préchargement
 * - meilleure compatibilité mobile (autoplay)
 * - pas de latence / pas de new Audio() à chaque clic
 */

import { initAudioFromUserGesture, playSfx } from "@/lib/audio";

export { initAudioFromUserGesture };

export function playClickSfx() {
  void playSfx("click");
}

export function playPositiveSfx() {
  void playSfx("positive");
}
